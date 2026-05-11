import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String },
  signature: { type: String },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['created', 'successful', 'failed'], default: 'created' },
  receiptPath: { type: String },
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);