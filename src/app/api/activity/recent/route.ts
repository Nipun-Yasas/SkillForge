import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { authenticateUser } from "@/lib/middleware";
import Course from "@/models/Course";
import CourseEnrollment from "@/models/CourseEnrollment";
import QuizSubmission from "@/models/QuizSubmission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = unknown;

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function GET(req: NextRequest, ctx: RouteContext) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const url = new URL(req.url);
    const limit = Math.min(25, Math.max(1, Number(url.searchParams.get("limit") || 12)));

    // Fetch activity sources in parallel
    const [enrolls, subs, enrollsForCompletion] = await Promise.all([
      CourseEnrollment.find({ userId: String(user._id) })
        .sort({ enrolledAt: -1 })
        .limit(limit)
        .lean(),
      QuizSubmission.find({ userId: String(user._id) })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .lean(),
      CourseEnrollment.find({
        userId: String(user._id),
        $or: [{ progress: { $gte: 100 } }, { completedAt: { $exists: true } }],
      })
        .sort({ completedAt: -1, updatedAt: -1 })
        .limit(limit)
        .lean(),
    ]);

    // Collect courseIds to map titles
    const courseIds = new Set<string>();
    enrolls.forEach((e: any) => courseIds.add(String(e.courseId)));
    subs.forEach((s: any) => courseIds.add(String(s.courseId)));
    enrollsForCompletion.forEach((e: any) => courseIds.add(String(e.courseId)));
    const courses = await Course.find({ _id: { $in: Array.from(courseIds) } })
      .select({ _id: 1, title: 1 })
      .lean();
    const courseMap = new Map(courses.map((c: any) => [String(c._id), c.title as string]));

    // Normalize to unified items
    const items: {
      id: string;
      type: "enroll" | "quiz" | "quiz_pass" | "complete" | "rating";
      title: string;
      subtitle?: string;
      at: string;
      href?: string;
    }[] = [];

    // Enrollments
    enrolls.forEach((e: any) => {
      const cId = String(e.courseId);
      items.push({
        id: `enroll:${e._id}`,
        type: "enroll",
        title: `Enrolled in ${courseMap.get(cId) ?? "a course"}`,
        subtitle: "Started learning",
        at: (e.enrolledAt || e.createdAt || e.updatedAt || new Date()).toISOString?.() || new Date().toISOString(),
        href: `/courses/${cId}`,
      });
      // Rating activity if exists
      if (typeof e.rating === "number" && e.rating > 0) {
        items.push({
          id: `rating:${e._id}`,
          type: "rating",
          title: `Rated ${courseMap.get(cId) ?? "a course"} ${e.rating}★`,
          subtitle: "Thanks for your feedback",
          at: (e.updatedAt || e.createdAt || new Date()).toISOString?.() || new Date().toISOString(),
          href: `/courses/${cId}`,
        });
      }
      // Completion item if marked in this doc
      if ((e.progress ?? 0) >= 100 || e.completedAt) {
        items.push({
          id: `complete:${e._id}`,
          type: "complete",
          title: `Completed ${courseMap.get(cId) ?? "a course"}`,
          subtitle: "Congratulations!",
          at: (e.completedAt || e.updatedAt || new Date()).toISOString?.() || new Date().toISOString(),
          href: `/courses/${cId}`,
        });
      }
    });

    // Quiz submissions
    subs.forEach((s: any) => {
      const cId = String(s.courseId);
      const passed = !!s.passed || (typeof s.score === "number" && s.score >= 70);
      items.push({
        id: `quiz:${s._id}`,
        type: passed ? "quiz_pass" : "quiz",
        title: passed ? `Passed a quiz in ${courseMap.get(cId) ?? "a course"}` : `Took a quiz in ${courseMap.get(cId) ?? "a course"}`,
        subtitle:
          typeof s.score === "number"
            ? `Score: ${Math.round(s.score)}%`
            : undefined,
        at: (s.updatedAt || s.createdAt || new Date()).toISOString?.() || new Date().toISOString(),
        href: `/courses/${cId}`,
      });
    });

    // Also ensure completions from separate query are included
    enrollsForCompletion.forEach((e: any) => {
      const cId = String(e.courseId);
      items.push({
        id: `complete-extra:${e._id}`,
        type: "complete",
        title: `Completed ${courseMap.get(cId) ?? "a course"}`,
        subtitle: "Great job!",
        at: (e.completedAt || e.updatedAt || new Date()).toISOString?.() || new Date().toISOString(),
        href: `/courses/${cId}`,
      });
    });

    // Sort and cap
    items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    const limited = items.slice(0, limit);

    return NextResponse.json({ items: limited }, { status: 200 });
  } catch (err) {
    console.error("GET /api/activity/recent error:", err);
    return NextResponse.json({ error: "Failed to load activity" }, { status: 500 });
  }
}