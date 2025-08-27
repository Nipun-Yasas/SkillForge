import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Quiz from "@/models/Quiz";
import Course from "@/models/Course";
import { authenticateUser } from "@/lib/middleware";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string; quizId: string } }) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

    const { id: courseId, quizId } = params;
    const course = await Course.findById(courseId).lean();
    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    if (course.instructor?.id !== String(user._id) && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await Quiz.deleteOne({ _id: quizId, courseId: String(courseId) });
    return NextResponse.json({ message: "Quiz deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE quiz error:", err);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}