import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reply from "@/models/Reply";
import { verifyToken } from "@/lib/auth";

// PUT /api/replies/[id] - Update a reply (only by author)
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
    const { content } = body;

    const reply = await Reply.findById(id);
    if (!reply) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (reply.author.toString() !== payload.userId) {
      return NextResponse.json(
        { error: "Not authorized to update this reply" },
        { status: 403 }
      );
    }

    // Update content
    if (content) {
      reply.content = content.trim();
      await reply.save();
    }

    return NextResponse.json({
      message: "Reply updated successfully",
    });
  } catch (error) {
    console.error("Update reply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/replies/[id] - Delete a reply (only by author)
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

    const reply = await Reply.findById(id);
    if (!reply) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (reply.author.toString() !== payload.userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this reply" },
        { status: 403 }
      );
    }

    // Remove reply from thread
    const Thread = require("@/models/Thread").default;
    await Thread.findByIdAndUpdate(reply.thread, {
      $pull: { replies: id }
    });

    // Delete reply
    await Reply.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Reply deleted successfully",
    });
  } catch (error) {
    console.error("Delete reply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
