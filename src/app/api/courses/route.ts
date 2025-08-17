import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware";
import CourseService, { CourseFilters } from "@/lib/courseService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get optional user authentication
    const { user } = await authenticateUser(request);
    const userId = user?._id?.toString();

    // Parse query parameters
    const filters: CourseFilters = {
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      level: searchParams.get("level") || undefined,
      tags: searchParams.get("tags")?.split(",") || undefined,
      instructor: searchParams.get("instructor") || undefined,
      isPremium: searchParams.get("isPremium") === "true" ? true : 
                 searchParams.get("isPremium") === "false" ? false : undefined,
      minRating: searchParams.get("minRating") ? 
                 parseFloat(searchParams.get("minRating")!) : undefined,
      page: searchParams.get("page") ? 
            parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? 
             parseInt(searchParams.get("limit")!) : 12,
      sortBy: (searchParams.get("sortBy") as any) || "enrolledStudents",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
    };

    const result = await CourseService.getCourses(filters, userId);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication for creating courses
    const { user, error } = await authenticateUser(request);
    
    if (error || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only mentors and admins can create courses
    if (user.role !== "mentor" && user.role !== "both" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Only mentors can create courses" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      longDescription,
      duration,
      level,
      price = 0,
      isPremium = false,
      image,
      tags = [],
      category,
      prerequisites = [],
      learningOutcomes = [],
      modules = [],
      isPublished = false,
    } = body;

    // Validation
    if (!title || !description || !duration || !level || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!learningOutcomes.length) {
      return NextResponse.json(
        { error: "At least one learning outcome is required" },
        { status: 400 }
      );
    }

    // Calculate total duration from modules
    let totalDuration = 0;
    modules.forEach((module: any) => {
      if (module.duration) {
        const minutes = parseInt(module.duration.replace(/\D/g, '')) || 0;
        totalDuration += minutes;
      }
    });

    const courseData = {
      title,
      description,
      longDescription,
      instructor: {
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
      },
      duration,
      level,
      price,
      isPremium,
      image: image || "/api/placeholder/300/200",
      tags,
      category,
      prerequisites,
      learningOutcomes,
      modules: modules.map((module: any, index: number) => ({
        ...module,
        id: module.id || `module-${index + 1}`,
      })),
      totalDuration,
      isPublished,
      publishedAt: isPublished ? new Date() : undefined,
    };

    const Course = (await import("@/models/Course")).default;
    const course = new Course(courseData);
    await course.save();

    return NextResponse.json(
      {
        message: "Course created successfully",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
