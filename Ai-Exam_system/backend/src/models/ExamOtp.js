import mongoose from 'mongoose';

const examOtpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  isUsed: { type: Boolean, default: false }
}, { 
  timestamps: true,
  collection: 'examotps' // Explicitly set collection name
});

export default mongoose.model('ExamOtp', examOtpSchema);