import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware";
import CourseService from "@/lib/courseService";

export const POST = requireAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    const result = await CourseService.enrollInCourse(
      user._id.toString(),
      courseId
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
        enrollment: result.enrollment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
});

export const GET = requireAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "active" | "completed" | "all" | null;

    const enrollments = await CourseService.getUserEnrollments(
      user._id.toString(),
      status || "all"
    );

    return NextResponse.json(
      { enrollments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get enrollments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
});
