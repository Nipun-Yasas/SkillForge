import mongoose, { Document, Schema } from "mongoose";

export interface ICourseEnrollment extends Document {
  _id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // percentage (0-100)
  completedModules: string[]; // array of module IDs
  currentModule?: string;
  timeSpent: number; // in minutes
  rating?: number;
  review?: string;
  isActive: boolean;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CourseEnrollmentSchema = new Schema<ICourseEnrollment>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      ref: "User",
    },
    courseId: {
      type: String,
      required: [true, "Course ID is required"],
      ref: "Course",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedModules: [
      {
        type: String,
      },
    ],
    currentModule: String,
    timeSpent: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one enrollment per user per course
CourseEnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
CourseEnrollmentSchema.index({ userId: 1, isActive: 1 });
CourseEnrollmentSchema.index({ courseId: 1, isActive: 1 });
CourseEnrollmentSchema.index({ progress: 1 });

const CourseEnrollment =
  mongoose.models.CourseEnrollment ||
  mongoose.model<ICourseEnrollment>("CourseEnrollment", CourseEnrollmentSchema);

export default CourseEnrollment;
