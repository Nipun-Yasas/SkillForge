import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware";
import CourseService from "@/lib/courseService";

export const POST = requireAuth(async (request, user) => {
  try {
    const body = await request.json();
    const { courseId, rating, review } = body;

    if (!courseId || rating === undefined) {
      return NextResponse.json(
        { error: "Course ID and rating are required" },
        { status: 400 }
      );
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    const result = await CourseService.rateCourse(
      user._id.toString(),
      courseId,
      rating,
      review
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error("Rating error:", error);
    return NextResponse.json(
      { error: "Failed to rate course" },
      { status: 500 }
    );
  }
});
