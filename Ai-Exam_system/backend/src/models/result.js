import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId, // ✅ IMPORTANT
        question: String,
        options: [String],
        selectedAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        marks: Number,
      },
    ],

    // 📊 MARKS
    totalMarks: {
      type: Number,
      required: true,
    },

    obtainedMarks: {
      type: Number,
      required: true,
    },

    // 📊 NEW FIELDS (VERY IMPORTANT)
    totalQuestions: Number,
    answeredCount: Number,
    correctCount: Number,

    // ⏱️ TIMER TRACKING
    startedAt: Date,
    submittedAt: Date,

    // 🚫 PREVENT MULTIPLE ATTEMPTS
    isSubmitted: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);