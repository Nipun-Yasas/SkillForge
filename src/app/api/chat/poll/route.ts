import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";

export async function GET(request: NextRequest) {
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
    const url = new URL(request.url);
    const conversationId = url.searchParams.get("conversationId");
    const lastMessageTime = url.searchParams.get("lastMessageTime");

    if (conversationId) {
      // Poll for new messages in a specific conversation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query: any = { conversationId };
      
      if (lastMessageTime) {
        query.createdAt = { $gt: new Date(lastMessageTime) };
      }

      const newMessages = await Message.find(query)
        .populate("senderId", "name email avatar")
        .sort({ createdAt: 1 })
        .lean();

      console.log(`🔄 Polling conversation ${conversationId}: ${newMessages.length} new messages`);

      const formattedMessages = newMessages.map(msg => ({
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
        newMessages: formattedMessages,
        hasNewMessages: newMessages.length > 0
      }, { status: 200 });

    } else {
      // Poll for conversation list updates
      const conversations = await Conversation.find({
        participants: currentUserId
      })
      .populate("participants", "name email avatar role")
      .populate("lastMessageSender", "name")
      .sort({ lastMessageTime: -1 })
      .lean();

      console.log(`🔄 Conversations refreshed: ${conversations.length} conversations`);

      const formattedConversations = conversations.map(conv => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const otherParticipant = (conv.participants as any[]).find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (participant: any) => participant._id.toString() !== currentUserId
        );

        return {
          conversationId: conv._id,
          user: {
            _id: otherParticipant._id,
            name: otherParticipant.name,
            email: otherParticipant.email,
            avatar: otherParticipant.avatar,
            role: otherParticipant.role,
          },
          lastMessage: conv.lastMessage || "Start chatting...",
          lastMessageTime: conv.lastMessageTime,
          lastMessageSender: conv.lastMessageSender,
        };
      });

      return NextResponse.json({
        conversations: formattedConversations,
        timestamp: new Date().toISOString()
      }, { status: 200 });
    }

  } catch (error) {
    console.error("❌ Error in polling:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
