import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Thread from "@/models/Thread";
import User from "@/models/User";
import Reply from "@/models/Reply";
import { verifyToken } from "@/lib/auth";

// Ensure models are registered
User;
Reply;

// GET /api/threads - Get all threads with filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "recent";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    const query: any = {};
    
    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case "popular":
        sort = { likes: -1, createdAt: -1 };
        break;
      case "replies":
        sort = { replies: -1, createdAt: -1 };
        break;
      default:
        sort = { isPinned: -1, createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const threads = await Thread.find(query)
      .populate("author", "name avatar")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Thread.countDocuments(query);

    // Get reply counts for each thread
    const threadIds = threads.map((thread: any) => thread._id);
    const replyCounts = await Reply.aggregate([
      { $match: { thread: { $in: threadIds } } },
      { $group: { _id: "$thread", count: { $sum: 1 } } }
    ]);

    const replyCountMap = replyCounts.reduce((map: any, item: any) => {
      map[item._id.toString()] = item.count;
      return map;
    }, {});

    // Format response
    const formattedThreads = threads.map((thread: any) => ({
      _id: thread._id,
      title: thread.title,
      content: thread.content,
      author: {
        name: thread.author.name,
        avatar: thread.author.avatar,
      },
      category: thread.category,
      tags: thread.tags,
      likes: thread.likes?.length || 0,
      replies: replyCountMap[thread._id.toString()] || 0,
      isPinned: thread.isPinned,
      isAnswered: thread.isAnswered,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    }));

    return NextResponse.json({
      threads: formattedThreads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get threads error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/threads - Create a new thread
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { title, content, category, tags } = body;

    // Validation
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = [
      "skill-help",
      "mentor-recommendations",
      "project-collaboration", 
      "general-skill-talk",
      "feedback-zone",
      "events-meetups",
      "success-stories",
      "ama-threads"
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Process tags
    const processedTags = tags 
      ? tags.split(",").map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
      : [];

    // Create thread
    const thread = new Thread({
      title: title.trim(),
      content: content.trim(),
      author: payload.userId,
      category,
      tags: processedTags,
      likes: [],
      bookmarks: [],
      replies: [],
      isPinned: false,
      isAnswered: false,
    });

    await thread.save();

    // Populate author for response
    await thread.populate("author", "name avatar");

    const responseThread = {
      _id: thread._id,
      title: thread.title,
      content: thread.content,
      author: {
        name: (thread.author as any).name,
        avatar: (thread.author as any).avatar,
      },
      category: thread.category,
      tags: thread.tags,
      likes: 0,
      replies: 0,
      isPinned: thread.isPinned,
      isAnswered: thread.isAnswered,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };

    return NextResponse.json(
      {
        message: "Thread created successfully",
        thread: responseThread,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create thread error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
