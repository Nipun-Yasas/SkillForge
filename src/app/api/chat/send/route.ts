import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

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
    const { conversationId, content } = await request.json();

    if (!conversationId || !content?.trim()) {
      return NextResponse.json({ error: "Conversation ID and content are required" }, { status: 400 });
    }

    // Verify user is participant in this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (!conversation.participants.includes(currentUserId)) {
      return NextResponse.json({ error: "Unauthorized access to conversation" }, { status: 403 });
    }

    // Create and save the message
    const newMessage = new Message({
      conversationId,
      senderId: currentUserId,
      content: content.trim(),
      messageType: "text",
      isRead: false,
    });

    await newMessage.save();

    // Update conversation with last message info
    conversation.lastMessage = content.trim();
    conversation.lastMessageTime = new Date();
    conversation.lastMessageSender = currentUserId;
    await conversation.save();

    console.log("💬 Message saved:", {
      messageId: newMessage._id,
      conversationId,
      senderId: currentUserId,
      content: content.substring(0, 50) + (content.length > 50 ? "..." : "")
    });

    // Return the created message
    return NextResponse.json({
      message: {
        _id: newMessage._id,
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        content: newMessage.content,
        messageType: newMessage.messageType,
        isRead: newMessage.isRead,
        createdAt: newMessage.createdAt,
        isOwnMessage: true
      },
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
