import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { authenticateUser } from '@/lib/middleware';
import CourseEnrollment from '@/models/CourseEnrollment';
import Course from '@/models/Course';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: { id: string } } | { params: Promise<{ id: string }> };

async function ensureDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    await ensureDB();
    const { user, error } = await authenticateUser(req);
    if (error || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { id: courseId } = await Promise.resolve(context.params);
    const body = await req.json().catch(() => ({}));
    let rating = Number(body?.rating);
    if (!Number.isFinite(rating)) return NextResponse.json({ error: 'Rating is required' }, { status: 400 });
    rating = Math.min(5, Math.max(1, Math.round(rating)));

    const enrollment = await CourseEnrollment.findOne({
      userId: String(user._id),
      courseId: String(courseId),
    });
    if (!enrollment) return NextResponse.json({ error: 'Not enrolled' }, { status: 403 });

    enrollment.rating = rating;
    await enrollment.save();

    // Recompute aggregate rating and count
    const agg = await CourseEnrollment.aggregate([
      { $match: { courseId: String(courseId), rating: { $gte: 1 } } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const avg = agg[0]?.avg ?? 0;
    const count = agg[0]?.count ?? 0;
    await Course.findByIdAndUpdate(courseId, { $set: { rating: avg, totalRatings: count } }).lean();

    return NextResponse.json({ success: true, rating, courseRating: avg, totalRatings: count }, { status: 200 });
  } catch (err) {
    console.error('POST /api/courses/[id]/rate error:', err);
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 });
  }
}