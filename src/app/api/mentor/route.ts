/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";

interface Mentor {
  id: string;
  name: string;
  bio: string;
  image: string;
  skills: string[];
  experience: string;
  availability: string;
  location: string;
  university: string;
  major: string;
  students?: number;
  rating?: number;
  hourlyRate?: string;
}

export const runtime = "nodejs";
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDB();

    const user = await User.findOne({
      _id: id,
      role: { $in: ["mentor", "both"] },
    }).lean() as any;

    if (!user) {
      return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
    }

    const mentor: Mentor = {
      id: String(user._id),
      name: user.name,
      bio: user.bio ?? "",
      image: user.avatar ?? "",
      skills: [
        ...(user.skills?.teaching ?? []),
        ...(user.skills?.learning ?? []),
      ],
      experience: user.experience ?? "",
      availability: user.availability ?? "",
      students: 0, 
      rating: 0,
      hourlyRate: "",
      location: user.location ?? "",
      university: user.university ?? "",
      major: user.major ?? "",
    };

    return NextResponse.json({ mentor }, { status: 200 });
  } catch (err) {
    console.error("GET /api/mentor error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}