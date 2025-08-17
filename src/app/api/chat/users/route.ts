import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Conversation from "@/models/Conversation";

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

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

    // Get all users except the current user
    const allUsers = await User.find(
      { _id: { $ne: currentUserId } },
      { name: 1, email: 1, avatar: 1, role: 1 }
    ).lean();

    console.log("📌 Chat users loaded:", allUsers.length, "total users");

    // Get all conversations involving the current user
    const conversations = await Conversation.find({
      participants: currentUserId
    })
    .populate("participants", "name email avatar role")
    .populate("lastMessageSender", "name")
    .sort({ lastMessageTime: -1 })
    .lean();

    console.log("📌 User conversations:", conversations.length, "conversations");

    // Create a set of user IDs who have existing conversations
    const usersWithConversations = new Set();
    const chats = conversations.map(conv => {
      // Find the other participant (not the current user)
      const otherParticipant = (conv.participants as PopulatedUser[]).find(
        (participant: PopulatedUser) => participant._id.toString() !== currentUserId
      );
      
      if (otherParticipant) {
        usersWithConversations.add(otherParticipant._id.toString());
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
      }
      return null;
    }).filter(Boolean);

    // Users with no existing conversations
    const usersForNewConversation = allUsers.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (user) => !usersWithConversations.has((user as any)._id.toString())
    );

    console.log("� Loaded chats:", chats.length, "| New users:", usersForNewConversation.length);

    return NextResponse.json({
      chats,
      usersForNewConversation,
      totalUsers: allUsers.length
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching chat users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
