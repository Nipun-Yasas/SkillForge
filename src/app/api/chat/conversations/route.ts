import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get token and verify user
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No authentication token found" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const currentUserId = decoded.userId;
    const { otherUserId } = await request.json();

    if (!otherUserId) {
      return NextResponse.json({ error: "Other user ID is required" }, { status: 400 });
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    });

    if (existingConversation) {
      console.log("📌 Conversation already exists:", existingConversation._id);
      return NextResponse.json({
        conversationId: existingConversation._id,
        message: "Conversation already exists"
      }, { status: 200 });
    }

    // Verify other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new conversation
    const newConversation = new Conversation({
      participants: [currentUserId, otherUserId],
      lastMessage: "Start chatting...",
      lastMessageTime: new Date(),
    });

    await newConversation.save();

    console.log("✅ New conversation created:", {
      conversationId: newConversation._id,
      participants: [currentUserId, otherUserId],
      otherUser: otherUser.name
    });

    return NextResponse.json({
      conversationId: newConversation._id,
      message: "Conversation created successfully",
      otherUser: {
        _id: otherUser._id,
        name: otherUser.name,
        email: otherUser.email,
        avatar: otherUser.avatar,
        role: otherUser.role,
      }
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
