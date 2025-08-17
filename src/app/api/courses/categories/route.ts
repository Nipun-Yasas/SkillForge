import { NextResponse } from "next/server";
import CourseService from "@/lib/courseService";

export async function GET() {
  try {
    const categories = await CourseService.getCategories();
    
    return NextResponse.json(
      { categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
