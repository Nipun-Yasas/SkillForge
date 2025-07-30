import mongoose, { Document, Schema } from "mongoose";

export interface ICreditTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  type: 'earned' | 'spent' | 'bonus' | 'purchase' | 'refund';
  amount: number;
  creditType: 'teaching' | 'learning' | 'bonus';
  description: string;
  relatedUserId?: mongoose.Types.ObjectId; // Who they taught/learned from
  status: 'pending' | 'completed' | 'failed';
  metadata?: {
    sessionDuration?: number;
    rating?: number;
    skill?: string;
    paymentMethod?: string;
  };
  createdAt: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
    },
    type: {
      type: String,
      enum: ['earned', 'spent', 'bonus', 'purchase', 'refund'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    creditType: {
      type: String,
      enum: ['teaching', 'learning', 'bonus'],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    relatedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    metadata: {
      sessionDuration: Number,
      rating: Number,
      skill: String,
      paymentMethod: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CreditTransactionSchema.index({ userId: 1, createdAt: -1 });
CreditTransactionSchema.index({ sessionId: 1 });
CreditTransactionSchema.index({ type: 1 });

export default mongoose.models.CreditTransaction || 
  mongoose.model<ICreditTransaction>('CreditTransaction', CreditTransactionSchema);
