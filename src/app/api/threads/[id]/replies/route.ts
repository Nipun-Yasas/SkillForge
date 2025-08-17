import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reply from "@/models/Reply";
import Thread from "@/models/Thread";
import { verifyToken } from "@/lib/auth";

// GET /api/threads/[id]/replies - Get all replies for a thread
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Check if thread exists
    const thread = await Thread.findById(id);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    const replies = await Reply.find({ thread: id })
      .populate("author", "name avatar")
      .sort({ createdAt: 1 })
      .lean();

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
      replies: formattedReplies,
    });
  } catch (error) {
    console.error("Get replies error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/threads/[id]/replies - Create a new reply
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
    const body = await request.json();
    const { content } = body;

    // Validation
    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Check if thread exists
    const thread = await Thread.findById(id);
    if (!thread) {
      return NextResponse.json(
        { error: "Thread not found" },
        { status: 404 }
      );
    }

    // Create reply
    const reply = new Reply({
      content: content.trim(),
      author: payload.userId,
      thread: id,
      likes: [],
      isAcceptedAnswer: false,
    });

    await reply.save();

    // Add reply to thread
    thread.replies.push(reply._id as any);
    await thread.save();

    // Populate author for response
    await reply.populate("author", "name avatar");

    const responseReply = {
      _id: reply._id,
      content: reply.content,
      author: {
        name: (reply.author as any).name,
        avatar: (reply.author as any).avatar,
      },
      likes: 0,
      isAcceptedAnswer: reply.isAcceptedAnswer,
      createdAt: reply.createdAt,
    };

    return NextResponse.json(
      {
        message: "Reply created successfully",
        reply: responseReply,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create reply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
