import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import User from "@/models/User";

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

function getUserId(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  return userId || null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDB();

    const form = await req.formData();
    const file = form.get("avatar");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const fileName = `${userId}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`;

    const updated = await User.findByIdAndUpdate(
      userId,
      { avatar: url },
      { new: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user: updated, avatar: url }, { status: 200 });
  } catch (err) {
    console.error("POST /api/profile/avatar error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}