import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "learner" | "mentor" | "both";
  avatar?: string;
  bio?: string;
  location?: string;
  experience?: string;
  skills: {
    teaching: string[];
    learning: string[];
  };
  learningGoals?: string;
  availability?: string;
  university?: string;
  year?: string;
  major?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["learner", "mentor", "both"],
      default: "learner",
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    experience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
    },
    skills: {
      teaching: [
        {
          type: String,
          trim: true,
        },
      ],
      learning: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    learningGoals: {
      type: String,
      maxlength: [1000, "Learning goals cannot exceed 1000 characters"],
    },
    availability: {
      type: String,
      maxlength: [200, "Availability cannot exceed 200 characters"],
    },
    university: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "PhD"],
    },
    major: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
UserSchema.index({ "skills.teaching": 1 });
UserSchema.index({ "skills.learning": 1 });

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
