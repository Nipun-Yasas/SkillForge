import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authenticateUser } from "@/lib/middleware";
import Course from "@/models/Course";
import Quiz from "@/models/Quiz";
import CourseEnrollment from "@/models/CourseEnrollment";
import QuizSubmission from "@/models/QuizSubmission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

type RouteContext =
  | { params: { id: string } }
  | { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { id: courseId } = await Promise.resolve(context.params);
    const { user, error } = await authenticateUser(req);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const videoUrl: string = body?.videoUrl;
    const responses: { quizId: string; selected: number[] }[] = body?.responses || [];

    if (!videoUrl || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: "videoUrl and responses are required" }, { status: 400 });
    }

    const course = await Course.findById(courseId).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    // Validate video belongs to course
    const links: string[] = course.youtubeLinks || [];
    if (!links.includes(videoUrl)) {
      return NextResponse.json({ error: "Invalid video for this course" }, { status: 400 });
    }

    // Ensure enrollment exists
    const enrollment = await CourseEnrollment.findOne({
      userId: String(user._id),
      courseId: String(courseId),
    });
    if (!enrollment) {
      return NextResponse.json({ error: "You are not enrolled in this course" }, { status: 403 });
    }

    // Load quizzes for this video
    const quizzes = await Quiz.find({ courseId: String(courseId), videoUrl }).lean();
    if (!quizzes.length) {
      return NextResponse.json({ error: "No quizzes found for this video" }, { status: 400 });
    }

    // Score: compare selected with correct indices for each quiz
    const correctById = new Map<string, number[]>(
      quizzes.map((q: any) => [
        String(q._id),
        (q.answers || [])
          .map((a: any, idx: number) => (a.correct ? idx : -1))
          .filter((i: number) => i >= 0),
      ])
    );

    let correctCount = 0;
    let attempted = 0;
    for (const r of responses) {
      const key = String(r.quizId);
      if (!correctById.has(key)) continue;
      attempted++;
      const correct = correctById.get(key)!;
      const selected = Array.isArray(r.selected) ? [...r.selected].sort() : [];
      const expected = [...correct].sort();
      const isCorrect =
        selected.length === expected.length &&
        selected.every((v, i) => v === expected[i]);
      if (isCorrect) correctCount++;
    }

    const total = quizzes.length;
    const score = Math.round((correctCount / total) * 100);
    const passed = score >= 70;

    // Upsert latest submission
    await QuizSubmission.findOneAndUpdate(
      { userId: String(user._id), courseId: String(courseId), videoUrl },
      { $set: { responses, score, passed } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // If passed, mark video completed and update progress
    let progress = enrollment.progress || 0;
    let completedCount = enrollment.completedVideos?.length || 0;

    if (passed && !enrollment.completedVideos.includes(videoUrl)) {
      enrollment.completedVideos = [
        ...new Set([...(enrollment.completedVideos || []), videoUrl])
      ];
      completedCount = enrollment.completedVideos.length;
      const totalVideos = links.length || 1;
      progress = Math.min(100, Math.round((completedCount / totalVideos) * 100));
      enrollment.progress = progress;
      enrollment.lastVideoUrl = videoUrl;
      try {
        await enrollment.save();
      } catch (err) {
        console.error("Enrollment save error:", err);
        return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
      }
    } else {
      // Update last attempted even if not passed
      enrollment.lastVideoUrl = videoUrl;
      try {
        await enrollment.save();
      } catch (err) {
        console.error("Enrollment save error:", err);
        return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
      }
    }

    return NextResponse.json(
      {
        score,
        passed,
        completedVideos: enrollment.completedVideos,
        completedCount,
        totalVideos: links.length,
        progress,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Submit quiz error:", err);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}