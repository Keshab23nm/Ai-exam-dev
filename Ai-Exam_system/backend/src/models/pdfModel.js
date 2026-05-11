import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam",
  },
  iscreated:{
    type:Boolean,
    default:false
  },
  name: String,
  subject: String,
  studentClass: String,
  obtained: Number,
  total: Number,
  percentage: Number,
  grade: String,
  pdfUrl: String, // ⭐ main field
}, { timestamps: true });

export default mongoose.model("PdfResult", resultSchema);