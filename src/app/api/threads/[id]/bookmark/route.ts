import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Thread from "@/models/Thread";
import { verifyToken } from "@/lib/auth";

// POST /api/threads/[id]/bookmark - Bookmark/Unbookmark a thread
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = params;

    const thread = await Thread.findById(id);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    const userId = payload.userId;
    const hasBookmarked = thread.bookmarks.includes(userId as any);

    if (hasBookmarked) {
      // Remove bookmark
      thread.bookmarks = thread.bookmarks.filter(
        (bookmarkId) => bookmarkId.toString() !== userId
      );
    } else {
      // Add bookmark
      thread.bookmarks.push(userId as any);
    }

    await thread.save();

    return NextResponse.json({
      message: hasBookmarked ? "Thread unbookmarked" : "Thread bookmarked",
      isBookmarked: !hasBookmarked,
    });
  } catch (error) {
    console.error("Bookmark thread error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
