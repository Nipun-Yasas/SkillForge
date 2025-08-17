import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware";
import CourseService from "@/lib/courseService";

interface RouteParams {
  params: { id: string };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: courseId } = params;
    
    // Get optional user authentication
    const { user } = await authenticateUser(request);
    const userId = user?._id?.toString();

    const course = await CourseService.getCourseById(courseId, userId);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ course }, { status: 200 });
  } catch (error) {
    console.error("Get course error:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: courseId } = params;
    
    // Require authentication
    const { user, error } = await authenticateUser(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const Course = (await import("@/models/Course")).default;
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user is the instructor or admin
    if (course.instructor.id !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to edit this course" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updates = { ...body };

    // Update instructor info if it changed
    if (user.name !== course.instructor.name || user.avatar !== course.instructor.avatar) {
      updates.instructor = {
        ...course.instructor,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
      };
    }

    // Recalculate total duration if modules changed
    if (updates.modules) {
      let totalDuration = 0;
      updates.modules.forEach((module: any) => {
        if (module.duration) {
          const minutes = parseInt(module.duration.replace(/\D/g, '')) || 0;
          totalDuration += minutes;
        }
      });
      updates.totalDuration = totalDuration;
    }

    // Set publishedAt if publishing for the first time
    if (updates.isPublished && !course.publishedAt) {
      updates.publishedAt = new Date();
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: "Course updated successfully",
        course: updatedCourse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: courseId } = params;
    
    // Require authentication
    const { user, error } = await authenticateUser(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const Course = (await import("@/models/Course")).default;
    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user is the instructor or admin
    if (course.instructor.id !== user._id.toString() && user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to delete this course" },
        { status: 403 }
      );
    }

    // Soft delete by unpublishing instead of hard delete
    // This preserves enrollment data and student progress
    await Course.findByIdAndUpdate(courseId, {
      isPublished: false,
      deletedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
