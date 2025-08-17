import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

type UpdatePayload = {
  name?: string;
  bio?: string;
  role?: string;
  location?: string;
  experience?: string;
  learningGoals?: string;
  availability?: string;
  skills?: {
    learning: string[];
    teaching: string[];
  };
};

export const runtime = "nodejs";

let isConnected = false;
async function connectToDB() {
  if (isConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  await mongoose.connect(uri);
  isConnected = true;
}

function getUserId(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  return userId || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Build safe update payload
    const update: UpdatePayload  = {
      name: body.name,
      bio: body.bio,
      role: body.role,
      location: body.location,
      experience: body.experience,
      learningGoals: body.learningGoals,
      availability: body.availability,
    };

    if (body.skills && typeof body.skills === "object") {
      update.skills = {
        learning: Array.isArray(body.skills.learning) ? body.skills.learning : [],
        teaching: Array.isArray(body.skills.teaching) ? body.skills.teaching : [],
      };
    }

    await connectToDB();

    const updated = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}