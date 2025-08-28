import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import CourseModel from "@/models/Course";
import { authenticateUser } from "@/lib/middleware";

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDB();
    const url = new URL(request.url);
    const excludeOwn = url.searchParams.get("excludeOwn") === "1";

    // Build your existing filter (search/category/level/isPublished, etc.)
    const filter: Record<string, any> = {};

    // If requested and user is authenticated, exclude their own courses
    if (excludeOwn) {
      const { user } = await authenticateUser(request);
      if (user) {
        const uid = String(user._id);
        // Handle both embedded instructor { id } and plain instructor string
        filter.$and = [
          ...(filter.$and || []),
          {
            $and: [
              { $or: [{ "instructor.id": { $ne: uid } }, { instructor: { $ne: uid } }] },
            ],
          },
        ];
      }
    }

    // Pagination
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(url.searchParams.get("limit") || 12)));
    const skip = (page - 1) * limit;

    const [totalCount, courses] = await Promise.all([
      CourseModel.countDocuments(filter),
      CourseModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return NextResponse.json(
      { courses, totalCount, currentPage: page, totalPages: Math.max(1, Math.ceil(totalCount / limit)) },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json({ error: "Failed to load courses" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication for creating courses
    const { user, error } = await authenticateUser(request);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (user.role !== "mentor" && user.role !== "both" && user.role !== "admin") {
      return NextResponse.json({ error: "Only mentors can create courses" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      level,
      image,
      tags = [],
      category,
      prerequisites = [],
      learningOutcomes = [],
      totalDuration = 0,
      isPublished = false,
      credit = 0,
      youtubeLinks = [],
    } = body;

    // Validation
    if (!title || !description || !level || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!Array.isArray(learningOutcomes) || learningOutcomes.length === 0) {
      return NextResponse.json({ error: "At least one learning outcome is required" }, { status: 400 });
    }
    const courseData = {
      title,
      description,
      instructor: {
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
      },
      level,
      image: image || "",
      tags,
      category,
      prerequisites,
      learningOutcomes,
      totalDuration: Number(totalDuration) || 0,
      isPublished,
      credit: Number(credit) || 0,
      youtubeLinks: Array.isArray(youtubeLinks) ? youtubeLinks : [],
      publishedAt: isPublished ? new Date() : undefined,
    };

    const Course = (await import("@/models/Course")).default;
    const course = new Course(courseData);
    await course.save();

    return NextResponse.json({ message: "Course created successfully", course }, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
