import mongoose from "mongoose";

const examAccessSchema = new mongoose.Schema(
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

    examOtp: {
      type: String,
      required: true,
    },
    // email: {
    //   type: String,
    //   required: true,
    // },

    isUsed: {
      type: Boolean,
      default: false,
    },
 startedAt: Date,
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ExamAccess = mongoose.model("ExamAccess", examAccessSchema);

export default ExamAccess;