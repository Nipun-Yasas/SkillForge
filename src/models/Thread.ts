import mongoose, { Document, Schema, Types } from "mongoose";

export interface IThread extends Document {
  _id: string;
  title: string;
  content: string;
  author: Types.ObjectId;
  category: string;
  tags: string[];
  likes: Types.ObjectId[];
  bookmarks: Types.ObjectId[];
  replies: Types.ObjectId[];
  isPinned: boolean;
  isAnswered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema = new Schema<IThread>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [10, "Content must be at least 10 characters"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "skill-help",
        "mentor-recommendations", 
        "project-collaboration",
        "general-skill-talk",
        "feedback-zone",
        "events-meetups",
        "success-stories",
        "ama-threads"
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ThreadSchema.index({ category: 1, createdAt: -1 });
ThreadSchema.index({ tags: 1 });
ThreadSchema.index({ author: 1 });
ThreadSchema.index({ likes: 1 });
ThreadSchema.index({ createdAt: -1 });

const Thread = mongoose.models.Thread || mongoose.model<IThread>("Thread", ThreadSchema);

export default Thread;
