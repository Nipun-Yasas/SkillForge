import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
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
    const { conversationId } = params;

    // Verify user is participant in this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (!conversation.participants.includes(currentUserId)) {
      return NextResponse.json({ error: "Unauthorized access to conversation" }, { status: 403 });
    }

    // Get messages for this conversation
    const messages = await Message.find({ conversationId })
      .populate("senderId", "name email avatar")
      .sort({ createdAt: 1 }) // Oldest first
      .lean();

    console.log(`💬 Messages fetched for conversation ${conversationId}:`, messages.length, "messages");

    // If no messages, return placeholder
    if (messages.length === 0) {
      return NextResponse.json({
        messages: [],
        placeholder: "Start chatting! Send your first message 👋",
        conversationId
      }, { status: 200 });
    }

    // Format messages for frontend
    const formattedMessages = messages.map(msg => ({
      _id: msg._id,
      content: msg.content,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      senderId: (msg.senderId as any)._id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      senderName: (msg.senderId as any).name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      senderAvatar: (msg.senderId as any).avatar,
      createdAt: msg.createdAt,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isOwnMessage: (msg.senderId as any)._id.toString() === currentUserId
    }));

    return NextResponse.json({
      messages: formattedMessages,
      conversationId,
      totalMessages: messages.length
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
