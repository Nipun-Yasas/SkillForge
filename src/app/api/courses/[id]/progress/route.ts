import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authenticateUser } from "@/lib/middleware";
import Course from "@/models/Course";
import CourseEnrollment from "@/models/CourseEnrollment";
import QuizSubmission from "@/models/QuizSubmission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: courseId } = params;
    const course = await Course.findById(courseId).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    const enrollment = await CourseEnrollment.findOne({
      userId: String(user._id),
      courseId: String(courseId),
    }).lean();

    if (!enrollment) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
    }

    const links: string[] = course.youtubeLinks || [];
    const completed = new Set(enrollment.completedVideos || []);
    const totalVideos = links.length;
    const completedCount = completed.size;
    const progress = Math.min(100, Math.round((completedCount / (totalVideos || 1)) * 100));

    // Last submission for current video (if any)
    const lastUrl = enrollment.lastVideoUrl || links[0];
    const lastSubmission = lastUrl
      ? await QuizSubmission.findOne({
          userId: String(user._id),
          courseId: String(courseId),
          videoUrl: lastUrl,
        })
          .sort({ updatedAt: -1 })
          .lean()
      : null;

    return NextResponse.json(
      {
        completedVideos: Array.from(completed),
        completedCount,
        totalVideos,
        progress,
        lastVideoUrl: lastUrl,
        lastScore: lastSubmission?.score ?? null,
        lastPassed: lastSubmission?.passed ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Progress error:", err);
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}