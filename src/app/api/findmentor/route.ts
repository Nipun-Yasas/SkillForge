/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

export const runtime = "nodejs";
export const revalidate = 0;
export const dynamic = "force-dynamic";

let isConnected = false;
async function connectToDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(uri);
  isConnected = true;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "12", 10), 1), 50);
    const skills = searchParams.getAll("skill");
    const availabilities = searchParams.getAll("availability");
    const categories = searchParams.getAll("category");

    const filter: any = { role: { $in: ["mentor", "both"] } };
    const and: any[] = [];

    if (q) {
      const regex = new RegExp(q, "i");
      and.push({
        $or: [
          { name: regex },
          { bio: regex },
          { location: regex },
          { experience: regex },
          { university: regex },
          { major: regex },
          { learningGoals: regex },
          { "skills.teaching": regex },
          { "skills.learning": regex },
        ],
      });
    }

    if (skills.length > 0) {
      and.push({
        "skills.teaching": { $in: skills.map((s) => new RegExp(`^${s}$`, "i")) },
      });
    }

    if (availabilities.length > 0) {
      and.push({
        availability: { $in: availabilities.map((a) => new RegExp(`^${a}$`, "i")) },
      });
    }

    if (categories.length > 0) {
      const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regs = categories.map((c) => new RegExp(escape(c), "i"));
      // Match ANY selected category in ANY of these fields
      and.push({
        $or: [
          { learningGoals: { $in: regs } },
          { bio: { $in: regs } },
          { experience: { $in: regs } },
          { "skills.teaching": { $in: regs } },
          { "skills.learning": { $in: regs } },
        ],
      });
      // If you require ALL categories to match, push one $or per category instead.
    }

    if (and.length) filter.$and = and;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json(
      { users, page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/findmentor error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}