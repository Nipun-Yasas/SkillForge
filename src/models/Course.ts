import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  rating: number;
  totalRatings: number;
  enrolledStudents: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  credit: number;
  image: string;
  tags: string[];
  category: string;
  prerequisites?: string[];
  learningOutcomes: string[];
  totalDuration: number;
  isPublished: boolean;
  youtubeLinks: string[];
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    instructor: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: String,
      bio: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Course level is required"],
    },
    credit: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      trim: true,
      maxlength: 2048,
      default: undefined,
      validate: {
        validator: (v: string | undefined) =>
          !v ||
          /^https?:\/\/.+/i.test(v) ||
          /^\/uploads\/[a-zA-Z0-9._-]+$/.test(v) ||
          /^\/api\/images\/[a-f0-9]{24}$/i.test(v), // allow GridFS served URLs
        message: "Invalid image URL",
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      required: [true, "Course category is required"],
      trim: true,
    },
    prerequisites: [String],
    learningOutcomes: [
      {
        type: String,
        required: true,
      },
    ],
    totalDuration: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    youtubeLinks: [
      {
        type: String,
        trim: true,
      },
    ],
    publishedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
CourseSchema.index({ title: "text", description: "text", tags: "text" });
CourseSchema.index({ category: 1, level: 1 });
CourseSchema.index({ rating: -1, enrolledStudents: -1 });
CourseSchema.index({ "instructor.id": 1 });
CourseSchema.index({ isPublished: 1, publishedAt: -1 });

const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
