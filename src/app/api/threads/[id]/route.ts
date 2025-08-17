import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Thread from "@/models/Thread";
import Reply from "@/models/Reply";
import { verifyToken } from "@/lib/auth";

// GET /api/threads/[id] - Get a specific thread with replies
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const thread = await Thread.findById(id)
      .populate("author", "name avatar")
      .lean();

    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Get replies
    const replies = await Reply.find({ thread: id })
      .populate("author", "name avatar")
      .sort({ createdAt: 1 })
      .lean();

    // Format thread
    const formattedThread = {
      _id: thread._id,
      title: thread.title,
      content: thread.content,
      author: {
        name: (thread.author as any).name,
        avatar: (thread.author as any).avatar,
      },
      category: thread.category,
      tags: thread.tags,
      likes: thread.likes?.length || 0,
      replies: replies.length,
      isPinned: thread.isPinned,
      isAnswered: thread.isAnswered,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };

    // Format replies
    const formattedReplies = replies.map((reply: any) => ({
      _id: reply._id,
      content: reply.content,
      author: {
        name: reply.author.name,
        avatar: reply.author.avatar,
      },
      likes: reply.likes?.length || 0,
      isAcceptedAnswer: reply.isAcceptedAnswer,
      createdAt: reply.createdAt,
    }));

    return NextResponse.json({
      thread: formattedThread,
      replies: formattedReplies,
    });
  } catch (error) {
    console.error("Get thread error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/threads/[id] - Update a thread (only by author)
export async function PUT(
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
    const body = await request.json();
    const { title, content, tags, isAnswered } = body;

    const thread = await Thread.findById(id);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (thread.author.toString() !== payload.userId) {
      return NextResponse.json(
        { error: "Not authorized to update this thread" },
        { status: 403 }
      );
    }

    // Update fields
    if (title) thread.title = title.trim();
    if (content) thread.content = content.trim();
    if (tags) {
      thread.tags = tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
    }
    if (typeof isAnswered === "boolean") thread.isAnswered = isAnswered;

    await thread.save();

    return NextResponse.json({
      message: "Thread updated successfully",
    });
  } catch (error) {
    console.error("Update thread error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/threads/[id] - Delete a thread (only by author)
export async function DELETE(
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

    // Check if user is the author
    if (thread.author.toString() !== payload.userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this thread" },
        { status: 403 }
      );
    }

    // Delete all replies
    await Reply.deleteMany({ thread: id });

    // Delete thread
    await Thread.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Thread deleted successfully",
    });
  } catch (error) {
    console.error("Delete thread error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
