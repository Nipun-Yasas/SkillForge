import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Reply from "@/models/Reply";
import { verifyToken } from "@/lib/auth";

// POST /api/replies/[id]/like - Like/Unlike a reply
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

    const reply = await Reply.findById(id);
    if (!reply) {
      return NextResponse.json(
        { error: "Reply not found" },
        { status: 404 }
      );
    }

    const userId = payload.userId;
    const hasLiked = reply.likes.includes(userId as any);

    if (hasLiked) {
      // Unlike
      reply.likes = reply.likes.filter(
        (likeId) => likeId.toString() !== userId
      );
    } else {
      // Like
      reply.likes.push(userId as any);
    }

    await reply.save();

    return NextResponse.json({
      message: hasLiked ? "Reply unliked" : "Reply liked",
      isLiked: !hasLiked,
      likesCount: reply.likes.length,
    });
  } catch (error) {
    console.error("Like reply error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
