import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authenticateUser } from "@/lib/middleware";
import Course from "@/models/Course";
import Quiz from "@/models/Quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext =
  | { params: { id: string; quizId: string } }
  | { params: Promise<{ id: string; quizId: string }> };

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const { id: courseId, quizId } = await Promise.resolve(context.params);

    const course = await Course.findById(courseId).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Only instructor or admin can edit
    if (course.instructor?.id && String(course.instructor.id) !== String(user._id) && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { videoUrl, question, answers, order } = body || {};

    if (!videoUrl || !Array.isArray(course.youtubeLinks) || !course.youtubeLinks.includes(videoUrl)) {
      return NextResponse.json({ error: "Invalid video URL for this course" }, { status: 400 });
    }
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    if (!Array.isArray(answers) || answers.length !== 5) {
      return NextResponse.json({ error: "Exactly 5 answers are required" }, { status: 400 });
    }
    if (!answers.some((a: any) => a?.correct === true)) {
      return NextResponse.json({ error: "At least one answer must be correct" }, { status: 400 });
    }

    const updated = await Quiz.findOneAndUpdate(
      { _id: quizId, courseId: String(courseId) },
      {
        $set: {
          videoUrl: String(videoUrl),
          question: String(question),
          answers: answers.map((a: any) => ({ text: String(a.text || ""), correct: !!a.correct })),
          ...(Number.isFinite(order) ? { order: Number(order) } : {}),
        },
      },
      { new: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    return NextResponse.json({ quiz: updated }, { status: 200 });
  } catch (err) {
    console.error("Update quiz error:", err);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const { id: courseId, quizId } = await Promise.resolve(context.params);

    const course = await Course.findById(courseId).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Only instructor or admin can delete
    if (course.instructor?.id && String(course.instructor.id) !== String(user._id) && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const deleted = await Quiz.findOneAndDelete({ _id: quizId, courseId: String(courseId) }).lean();
    if (!deleted) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Delete quiz error:", err);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}