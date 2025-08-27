import {NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware";
import CourseService from "@/lib/courseService";

export const PUT = requireAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { courseId, moduleId, timeSpent } = body;

    if (!courseId || !moduleId) {
      return NextResponse.json(
        { error: "Course ID and Module ID are required" },
        { status: 400 }
      );
    }

    const result = await CourseService.updateProgress(
      user._id.toString(),
      courseId,
      moduleId,
      timeSpent
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: result.message,
        progress: result.progress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
});
