import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import CourseEnrollment from "@/models/CourseEnrollment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const userIds = await CourseEnrollment.distinct("userId", { isActive: true });
    return NextResponse.json({ activeStudents: userIds.length }, { status: 200 });
  } catch (err) {
    console.error("GET /api/courses/active-students error:", err);
    return NextResponse.json({ error: "Failed to load active students" }, { status: 500 });
  }
}