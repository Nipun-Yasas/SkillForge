import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReply extends Document {
  _id: string;
  content: string;
  author: Types.ObjectId;
  thread: Types.ObjectId;
  likes: Types.ObjectId[];
  isAcceptedAnswer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema<IReply>(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: [1, "Content must be at least 1 character"],
      maxlength: [3000, "Content cannot exceed 3000 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thread: {
      type: Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isAcceptedAnswer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ReplySchema.index({ thread: 1, createdAt: 1 });
ReplySchema.index({ author: 1 });
ReplySchema.index({ likes: 1 });

const Reply = mongoose.models.Reply || mongoose.model<IReply>("Reply", ReplySchema);

export default Reply;
