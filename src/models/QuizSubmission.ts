import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizResponse {
  quizId: string;
  selected: number[];
}

export interface IQuizSubmission extends Document {
  userId: string;
  courseId: string;
  videoUrl: string;
  responses: IQuizResponse[];
  score: number;
  passed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizResponseSchema = new Schema<IQuizResponse>(
  {
    quizId: { type: String, required: true },
    selected: {
      type: [Number],
      required: true,
      validate: (arr: number[]) => Array.isArray(arr) && arr.length >= 1,
    },
  },
  { _id: false }
);

const QuizSubmissionSchema = new Schema<IQuizSubmission>(
  {
    userId: { type: String, required: true, index: true },
    courseId: { type: String, required: true, index: true },
    videoUrl: { type: String, required: true, index: true },
    responses: { type: [QuizResponseSchema], default: [] },
    score: { type: Number, default: 0, min: 0, max: 100 },
    passed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

QuizSubmissionSchema.index({ userId: 1, courseId: 1, videoUrl: 1 }, { unique: true });

export default (mongoose.models.QuizSubmission as Model<IQuizSubmission>) ||
  mongoose.model<IQuizSubmission>("QuizSubmission", QuizSubmissionSchema);