import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authenticateUser } from "@/lib/middleware";
import QuizSubmission from "@/models/QuizSubmission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: { id: string } } | { params: Promise<{ id: string }> };

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: courseId } = await Promise.resolve(context.params);
    const url = new URL(req.url);
    const videoUrl = url.searchParams.get("videoUrl");
    if (!videoUrl) {
      return NextResponse.json({ error: "videoUrl is required" }, { status: 400 });
    }

    const submission = await QuizSubmission.findOne({
      userId: String(user._id),
      courseId: String(courseId),
      videoUrl,
    })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(
      submission
        ? {
            submission: {
              score: submission.score,
              passed: submission.passed,
              updatedAt: submission.updatedAt,
            },
          }
        : { submission: null },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET last submission error:", err);
    return NextResponse.json({ error: "Failed to load submission" }, { status: 500 });
  }
}