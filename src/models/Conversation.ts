import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  _id: string;
  participants: string[]; // Array of user IDs
  lastMessage?: string;
  lastMessageTime?: Date;
  lastMessageSender?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    lastMessageSender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageTime: -1 });

const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
