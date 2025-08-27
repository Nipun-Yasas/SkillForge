import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import CourseModel from "@/models/Course";
import { authenticateUser } from "@/lib/middleware";
import CourseEnrollment from "@/models/CourseEnrollment";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { user } = await authenticateUser(request);
    const userId = user?._id?.toString();

    // Filters
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const level = searchParams.get("level") || undefined;
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || undefined;
    const instructor = searchParams.get("instructor") || undefined;

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "12", 10), 50);
    const skip = (page - 1) * limit;

    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const query: any = {};

    // If filtering by instructor:
    // - If it's the owner (or admin), show all (draft + published)
    // - Otherwise, only show published
    if (instructor) {
      query["instructor.id"] = instructor;
      if (!(userId && (userId === instructor || user?.role === "admin"))) {
        query.isPublished = true;
      }
    } else {
      // Public catalog
      query.isPublished = true;
    }

    if (category) query.category = category;
    if (level) query.level = level;
    if (tags?.length) query.tags = { $in: tags };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [totalCount, courses] = await Promise.all([
      CourseModel.countDocuments(query),
      CourseModel.find(query)
        .sort({ isPublished: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    // Annotate courses with enrollment status for the current user
    let annotated = courses as any[];
    if (userId && courses.length) {
      const courseIds = courses.map((c: any) => String(c._id));
      const enrollments = await CourseEnrollment.find({
        userId,
        courseId: { $in: courseIds },
      })
        .lean()
        .exec();
      const enrolledSet = new Set(enrollments.map((e: any) => e.courseId));
      const progressMap = Object.fromEntries(
        enrollments.map((e: any) => [e.courseId, e.progress ?? 0])
      );
      annotated = courses.map((c: any) => {
        const id = String(c._id);
        return {
          ...c,
          isEnrolled: enrolledSet.has(id),
          progress: progressMap[id],
        };
      });
    }

    return NextResponse.json(
      { courses: annotated, totalCount, currentPage: page, totalPages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
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
