import mongoose, { Document, Schema } from "mongoose";

export interface ICredit extends Document {
  userId: mongoose.Types.ObjectId;
  teachingCredits: number;      // Credits earned by teaching
  learningCredits: number;      // Credits available for learning
  bonusCredits: number;         // Bonus/reward credits
  totalEarned: number;          // Lifetime teaching credits earned
  totalSpent: number;           // Lifetime learning credits spent
  reputation: number;           // Teaching quality score (0-100)
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  achievements: string[];       // Unlocked achievement badges
  createdAt: Date;
  updatedAt: Date;
}

const CreditSchema = new Schema<ICredit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    teachingCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    learningCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    bonusCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    reputation: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    level: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    },
    achievements: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
CreditSchema.index({ reputation: -1 });
CreditSchema.index({ level: 1 });

export default mongoose.models.Credit || mongoose.model<ICredit>('Credit', CreditSchema);
