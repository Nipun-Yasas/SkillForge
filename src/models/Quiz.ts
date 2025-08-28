import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizAnswer {
  text: string;
  correct: boolean;
}

export interface IQuiz extends Document {
  courseId: string;       
  videoUrl: string;        
  question: string;
  answers: IQuizAnswer[]; 
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAnswerSchema = new Schema<IQuizAnswer>(
  {
    text: { type: String, required: true, trim: true, maxlength: 500 },
    correct: { type: Boolean, default: false },
  },
  { _id: false }
);

const QuizSchema = new Schema<IQuiz>(
  {
    courseId: { type: String, required: true, index: true },
    videoUrl: { type: String, required: true, trim: true },
    question: { type: String, required: true, trim: true, maxlength: 1000 },
    answers: {
      type: [QuizAnswerSchema],
      validate: {
        validator: (arr: IQuizAnswer[]) =>
          Array.isArray(arr) &&
          arr.length === 5 &&
          arr.every(a => a.text && typeof a.correct === "boolean") &&
          arr.some(a => a.correct === true),
        message:
          "Provide exactly 5 answers with at least one marked correct.",
      },
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

QuizSchema.index({ courseId: 1, videoUrl: 1, order: 1 });

export default (mongoose.models.Quiz as Model<IQuiz>) ||
  mongoose.model<IQuiz>("Quiz", QuizSchema);