import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Course from "@/models/Course";
import CourseEnrollment from "@/models/CourseEnrollment";
import { authenticateUser } from "@/lib/middleware";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } } | { params: Promise<{ id: string }> };

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const { id: courseId } = await Promise.resolve(context.params);
    const { videoUrl } = await req.json();

    if (!videoUrl) return NextResponse.json({ error: "videoUrl is required" }, { status: 400 });

    const course = await Course.findById(courseId).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    if (!Array.isArray(course.youtubeLinks) || !course.youtubeLinks.includes(videoUrl)) {
      return NextResponse.json({ error: "Invalid video for this course" }, { status: 400 });
    }

    const enrollment = await CourseEnrollment.findOne({
      userId: String(user._id),
      courseId: String(courseId),
    });

    if (!enrollment) return NextResponse.json({ error: "Not enrolled" }, { status: 403 });

    // Persist that this video’s quiz is unlocked by remembering lastVideoUrl
    enrollment.lastVideoUrl = videoUrl;
    await enrollment.save();

    return NextResponse.json({ unlocked: true, lastVideoUrl: enrollment.lastVideoUrl }, { status: 200 });
  } catch (err) {
    console.error("Unlock quiz error:", err);
    return NextResponse.json({ error: "Failed to unlock quiz" }, { status: 500 });
  }
}