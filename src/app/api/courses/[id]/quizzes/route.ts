import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Quiz from "@/models/Quiz";
import Course from "@/models/Course";
import { authenticateUser } from "@/lib/middleware";

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

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { id: courseId } = await Promise.resolve(context.params);

    const quizzes = await Quiz.find({ courseId })
      .sort({ videoUrl: 1, order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (err) {
    console.error("GET quizzes error:", err);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id: courseId } = await Promise.resolve(context.params);
    const course = await Course.findById(courseId).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    if (course.instructor?.id !== String(user._id) && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const { videoUrl, question, answers, order } = body || {};

    if (!videoUrl || !Array.isArray(course.youtubeLinks) || !course.youtubeLinks.includes(videoUrl)) {
      return NextResponse.json({ error: "Invalid video URL for this course" }, { status: 400 });
    }
    if (!question || !Array.isArray(answers) || answers.length !== 5) {
      return NextResponse.json({ error: "Question and exactly 5 answers are required" }, { status: 400 });
    }
    if (!answers.some((a: any) => a?.correct === true)) {
      return NextResponse.json({ error: "At least one answer must be correct" }, { status: 400 });
    }

    const quiz = await Quiz.create({
      courseId: String(courseId),
      videoUrl,
      question: String(question),
      answers: answers.map((a: any) => ({ text: String(a.text || ""), correct: !!a.correct })),
      order: Number.isFinite(order) ? Number(order) : 0,
    });

    return NextResponse.json({ quiz }, { status: 201 });
  } catch (err) {
    console.error("POST quizzes error:", err);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}