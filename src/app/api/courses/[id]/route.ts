import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authenticateUser } from "@/lib/middleware";
import Course from "@/models/Course";
import CourseEnrollment from "@/models/CourseEnrollment";
import Quiz from "@/models/Quiz";
import QuizSubmission from "@/models/QuizSubmission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { id } = await Promise.resolve(context.params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
    }
    const course = await Course.findById(id).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ course }, { status: 200 });
  } catch (err) {
    console.error("GET /api/courses/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { id: courseId } = await Promise.resolve(context.params);
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ error: "Invalid course id" }, { status: 400 });
    }

    const { user, error } = await authenticateUser(request);
    if (error || !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const course = await Course.findById(courseId);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const ownerId = String((course as any).instructor?.id ?? (course as any).instructor ?? "");
    if (ownerId && ownerId !== String(user._id) && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to edit this course" }, { status: 403 });
    }

    const body = await request.json();
    const updates: any = { ...body };

    // Accept both published and isPublished from client
    if (typeof updates.published === "boolean" && updates.isPublished === undefined) {
      updates.isPublished = updates.published;
      delete updates.published;
    }

    if (updates.totalDuration != null) updates.totalDuration = Number(updates.totalDuration) || 0;
    if (updates.credit != null) updates.credit = Number(updates.credit) || 0;

    // Only keep youtubeLinks if it's an array; otherwise ignore
    if ("youtubeLinks" in updates && !Array.isArray(updates.youtubeLinks)) {
      delete updates.youtubeLinks;
    }

    // Optional: keep instructor info in sync
    if (user.name || user.avatar || user.bio) {
      updates.instructor = {
        ...(course as any).instructor,
        id: ownerId || String(user._id),
        name: user.name ?? (course as any).instructor?.name,
        avatar: user.avatar ?? (course as any).instructor?.avatar,
        bio: user.bio ?? (course as any).instructor?.bio,
      };
    }

    // Recompute totalDuration from modules if modules provided
    if (Array.isArray(updates.modules)) {
      let totalDuration = 0;
      for (const m of updates.modules) {
        const minutes = parseInt(String(m?.duration ?? "").replace(/\D/g, ""), 10) || 0;
        totalDuration += minutes;
      }
      updates.totalDuration = totalDuration;
    }

    // Publish / Unpublish
    if (typeof updates.isPublished === "boolean") {
      if (updates.isPublished && !course.publishedAt) {
        updates.publishedAt = new Date();
      }
      if (!updates.isPublished) {
        updates.publishedAt = undefined;
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    return NextResponse.json({ course: updatedCourse }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/courses/[id] error:", err);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: courseId } = await Promise.resolve(context.params);
    const course = await Course.findById(courseId);
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Only instructor (owner) or admin can delete
    const ownerId = String((course as any).instructor?.id ?? (course as any).instructor ?? "");
    if (ownerId && ownerId !== String(user._id) && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Cascade delete related data
    await Promise.all([
      Quiz.deleteMany({ courseId: String(courseId) }),
      QuizSubmission.deleteMany({ courseId: String(courseId) }),
      CourseEnrollment.deleteMany({ courseId: String(courseId) }),
    ]);

    await course.deleteOne();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Delete course error:", err);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
