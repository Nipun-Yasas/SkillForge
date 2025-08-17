import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  rating: number;
  totalRatings: number;
  enrolledStudents: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  isPremium: boolean;
  image: string;
  tags: string[];
  category: string;
  prerequisites?: string[];
  learningOutcomes: string[];
  modules: {
    id: string;
    title: string;
    description: string;
    duration: string;
    videoUrl?: string;
    resources?: {
      title: string;
      url: string;
      type: "video" | "pdf" | "link" | "quiz";
    }[];
    isCompleted?: boolean;
  }[];
  totalDuration: number; // in minutes
  isPublished: boolean;
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
    longDescription: {
      type: String,
      maxlength: [2000, "Long description cannot exceed 2000 characters"],
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
    duration: {
      type: String,
      required: [true, "Course duration is required"],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Course level is required"],
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "/api/placeholder/300/200",
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
    modules: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        videoUrl: String,
        resources: [
          {
            title: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
            },
            type: {
              type: String,
              enum: ["video", "pdf", "link", "quiz"],
              required: true,
            },
          },
        ],
        isCompleted: {
          type: Boolean,
          default: false,
        },
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
