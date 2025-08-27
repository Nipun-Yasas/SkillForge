import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware";
import CourseService from "@/lib/courseService";
import CourseEnrollment from "@/models/CourseEnrollment";

type RouteContext =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id: courseId } = await Promise.resolve(context.params);
    const { user } = await authenticateUser(request);
    const userId = user?._id?.toString();

    const course = await CourseService.getCourseById(courseId, userId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    let isEnrolled = false;
    let progress: number | undefined = undefined;
    if (userId) {
      const enr = await CourseEnrollment.findOne({ userId, courseId: String(courseId) })
        .lean()
        .exec() as { progress?: number } | null;
      if (enr) {
        isEnrolled = true;
        progress = enr.progress ?? 0;
      }
    }
    return NextResponse.json({ course: { ...course, isEnrolled, progress } }, { status: 200 });
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id: courseId } = await Promise.resolve(context.params);

    const { user, error } = await authenticateUser(request);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const Course = (await import("@/models/Course")).default;
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.instructor.id !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to edit this course" }, { status: 403 });
    }

    const body = await request.json();
    const updates: any = { ...body };

    // Coerce numeric fields even if sent as strings/empty
    if ("totalDuration" in updates) {
      updates.totalDuration = Number(updates.totalDuration) || 0;
    }
    if ("credit" in updates) {
      updates.credit = Number(updates.credit) || 0;
    }
    if ("youtubeLinks" in updates && !Array.isArray(updates.youtubeLinks)) {
      updates.youtubeLinks = [];
    }

    if (user.name !== course.instructor.name || user.avatar !== course.instructor.avatar) {
      updates.instructor = {
        ...course.instructor,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
      };
    }

    if (updates.modules) {
      let totalDuration = 0;
      updates.modules.forEach((m: any) => {
        if (m.duration) {
          const minutes = parseInt(String(m.duration).replace(/\D/g, "")) || 0;
          totalDuration += minutes;
        }
      });
      updates.totalDuration = totalDuration;
    }

    if (updates.isPublished && !course.publishedAt) {
      updates.publishedAt = new Date();
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: "Course updated successfully", course: updatedCourse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: courseId } = await Promise.resolve(context.params);

    const { user, error } = await authenticateUser(request);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const Course = (await import("@/models/Course")).default;
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    if (course.instructor.id !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to delete this course" }, { status: 403 });
    }

    await Course.findByIdAndUpdate(courseId, {
      isPublished: false,
      deletedAt: new Date(),
    });

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
