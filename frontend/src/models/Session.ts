import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  teacherId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  skill: string;
  sessionType: 'one-on-one' | 'group' | 'workshop' | 'quick-help';
  duration: number; // in hours
  scheduledDate: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  location: {
    type: 'online' | 'in-person';
    details: string; // Zoom link or physical location
  };
  cost: number; // in credits
  paymentType: 'barter' | 'premium' | 'free';
  
  // Session details
  agenda: string;
  materials: string[];
  prerequisites: string[];
  
  // Completion data
  completedAt?: Date;
  teacherRating?: number; // 1-5 stars
  studentRating?: number; // 1-5 stars
  teacherFeedback?: string;
  studentFeedback?: string;
  learningOutcomes?: string[];
  
  // Matching data
  matchScore: number; // 0-100
  matchFactors: {
    skillCompatibility: number;
    scheduleOverlap: number;
    locationProximity: number;
    reputationScore: number;
    learningStyleMatch: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: String,
      required: true,
      trim: true,
    },
    sessionType: {
      type: String,
      enum: ['one-on-one', 'group', 'workshop', 'quick-help'],
      default: 'one-on-one',
    },
    duration: {
      type: Number,
      required: true,
      min: 0.25, // 15 minutes minimum
      max: 8,    // 8 hours maximum
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    location: {
      type: {
        type: String,
        enum: ['online', 'in-person'],
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentType: {
      type: String,
      enum: ['barter', 'premium', 'free'],
      required: true,
    },
    agenda: {
      type: String,
      trim: true,
    },
    materials: [{
      type: String,
      trim: true,
    }],
    prerequisites: [{
      type: String,
      trim: true,
    }],
    completedAt: Date,
    teacherRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    studentRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    teacherFeedback: {
      type: String,
      trim: true,
    },
    studentFeedback: {
      type: String,
      trim: true,
    },
    learningOutcomes: [{
      type: String,
      trim: true,
    }],
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    matchFactors: {
      skillCompatibility: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      scheduleOverlap: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      locationProximity: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      reputationScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      learningStyleMatch: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
SessionSchema.index({ teacherId: 1, scheduledDate: 1 });
SessionSchema.index({ studentId: 1, scheduledDate: 1 });
SessionSchema.index({ skill: 1 });
SessionSchema.index({ status: 1 });
SessionSchema.index({ matchScore: -1 });

export default mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
