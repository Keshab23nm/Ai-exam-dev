import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
  marks: {
    type: Number,
    default: 1,
  },
});

const examSchema = new mongoose.Schema({
  title: String,
  subject: String,
  class: String,
  duration: Number,

  difficulty: String,
  numberOfQuestions: Number,

  questions: [questionSchema],

  totalMarks: Number,

  startTime: Date,
  endTime: Date,

  isActive: {
    type: Boolean,
    default: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

const exam = mongoose.model("Exam", examSchema);

export default exam;