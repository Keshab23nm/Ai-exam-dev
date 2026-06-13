
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import ExamOtp from '../models/ExamOtp.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import ImageKit from 'imagekit';
import { config } from '../config/config.js';

const imagekit = new ImageKit({
  publicKey: config.publicKey,
  privateKey: config.privateKey,
  urlEndpoint: config.urlEndpoint
});

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
   key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_SECRET,
    });
  }
  return razorpayInstance;
};

export const createOrder = async (req, res) => {
  try {
    const { examId, amount } = req.body;
    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);
    if (!order) return res.status(500).json({ success: false, message: 'Some error occured' });

    const payment = await Payment.create({
      user: req.user.id,
      exam: examId,
      orderId: order.id,
      amount,
    });

    res.json({ 
      success: true, 
      order, 
      payment, 
      key_id: config.RAZORPAY_KEY_ID 
    });
  } catch (error) {
 console.error("CREATE ORDER ERROR");

 console.error(error);

 console.error(error.message);

 console.error(error.stack);

 return res.status(500).json({
   success:false,
   message:error.message
 });
}
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, examId } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', config.RAZORPAY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      const updatedPayment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          paymentId: razorpay_payment_id, 
          signature: razorpay_signature, 
          status: 'successful',
          exam: examId 
        },
        { new: true }
      ).populate('user exam');

      // Generate receipt automatically and upload to ImageKit
      const doc = new PDFDocument();
      const fileName = `receipt-${updatedPayment._id}.pdf`;
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));

      const uploadPromise = new Promise((resolve, reject) => {
        doc.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const response = await imagekit.upload({
              file: buffer,
              fileName: fileName,
              folder: '/receipts',
            });
            resolve(response.url);
          } catch (err) {
            reject(err);
          }
        });
        doc.on('error', reject);
      });

      // --- Receipt PDF Content ---
      doc.fillColor('#333333').font('Helvetica-Bold').fontSize(24).text('EXAMI SYSTEM', { align: 'center', characterSpacing: 2 });
      doc.moveDown(0.5);
      doc.font('Helvetica').fontSize(14).fillColor('#666666').text('Official Payment Receipt', { align: 'center' });
      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#e5e7eb').lineWidth(2).stroke();
      doc.moveDown(1.5);
      const detailsY = doc.y;
      doc.fontSize(12).fillColor('#374151');
      doc.font('Helvetica').text('Date:', 50, detailsY);
      doc.font('Helvetica-Bold').text(new Date(updatedPayment.createdAt).toLocaleString(), 150, detailsY);
      doc.font('Helvetica').text('Transaction ID:', 50, detailsY + 25);
      doc.font('Helvetica-Bold').text(updatedPayment.paymentId, 150, detailsY + 25);
      doc.font('Helvetica').text('Payment Status:', 50, detailsY + 50);
      doc.font('Helvetica-Bold').fillColor('#16a34a').text('SUCCESSFUL', 150, detailsY + 50);
      doc.moveDown(4);
      const boxTop = doc.y;
      doc.rect(50, boxTop, 500, 140).fillOpacity(0.1).fillAndStroke('#3b82f6', '#cbd5e1');
      doc.fillOpacity(1).fillColor('#1e293b');
      const boxContentY = boxTop + 20;
      doc.fontSize(14).font('Helvetica-Bold').text('Payment Details:', 70, boxContentY);
      doc.fontSize(12).font('Helvetica').text('Student Name:', 70, boxContentY + 35);
      doc.font('Helvetica-Bold').text(`${updatedPayment.user.name || updatedPayment.user._id}`, 200, boxContentY + 35);
      doc.font('Helvetica').text('Exam Title:', 70, boxContentY + 65);
      doc.font('Helvetica-Bold').text(`${updatedPayment.exam.title || updatedPayment.exam._id}`, 200, boxContentY + 65);
      doc.font('Helvetica').text('Amount Paid:', 70, boxContentY + 95);
      doc.fontSize(16).font('Helvetica-Bold').fillColor('#1e293b').text(`INR ${updatedPayment.amount}`, 200, boxContentY + 93);
      doc.moveDown(6);
      const footerY = doc.y + 40;
      doc.moveTo(50, footerY).lineTo(550, footerY).strokeColor('#e5e7eb').lineWidth(1).stroke();
      doc.fontSize(10).font('Helvetica').fillColor('#9ca3af').text('This is a computer-generated receipt and requires no physical signature.', 50, footerY + 15, { align: 'center' });
      doc.end();

      const receiptUrl = await uploadPromise;
      updatedPayment.receiptPath = receiptUrl;
      await updatedPayment.save();
      
      console.log("Payment Verified & Receipt Uploaded:", receiptUrl);
      res.json({ 
        success: true, 
        message: 'Payment verified successfully', 
        paymentId: updatedPayment._id,
        receiptUrl: receiptUrl
      });
    } else {
      console.log("Invalid Signature for Order:", razorpay_order_id);
      res.status(400).json({ success: false, message: 'Invalid signature sent!' });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateOtp = async (req, res) => {
  try {
    const { examId } = req.body;
    console.log("Student Context - examId:", examId, "userId:", req.user.id);

    // ensure payment is done
    const payment = await Payment.findOne({ user: req.user.id, exam: examId, status: 'successful' });
    if (!payment) {
      console.log("No successful payment found for User:", req.user.id, "Exam:", examId);
      return res.status(400).json({ success: false, message: 'Payment required before generating OTP' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const newOtp = await ExamOtp.create({
      user: req.user.id,
      exam: examId,
      otp,
      expiresAt
    });

    console.log("Student-Generated OTP:", otp);

    res.json({ success: true, otp, message: 'OTP generated successfully', access: newOtp });
  } catch (error) {
    console.error("Student OTP Generation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { examId, otp } = req.body;
    const examOtp = await ExamOtp.findOne({ user: req.user.id, exam: examId, otp, isUsed: false });

    if (!examOtp) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    if (examOtp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    examOtp.isUsed = true;
    await examOtp.save();

    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate('user exam');
    if (!payment || payment.status !== 'successful') {
      return res.status(404).json({ success: false, message: 'Payment receipt not found' });
    }

    // If receipt already exists on ImageKit, return it
    if (payment.receiptPath && payment.receiptPath.startsWith('http')) {
      return res.json({ success: true, receiptUrl: payment.receiptPath });
    }

    const doc = new PDFDocument();
    const fileName = `receipt-${payment._id}.pdf`;
    
    // Use a buffer to collect the PDF data for ImageKit upload
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    
    const uploadToImageKit = new Promise((resolve, reject) => {
      doc.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const response = await imagekit.upload({
            file: buffer,
            fileName: fileName,
            folder: '/receipts',
          });
          resolve(response.url);
        } catch (err) {
          reject(err);
        }
      });
      doc.on('error', reject);
    });

    // Header
    doc.fillColor('#333333')
       .font('Helvetica-Bold')
       .fontSize(24)
       .text('EXAMI SYSTEM', { align: 'center', characterSpacing: 2 });
    doc.moveDown(0.5);
    doc.font('Helvetica')
       .fontSize(14)
       .fillColor('#666666')
       .text('Official Payment Receipt', { align: 'center' });
    doc.moveDown(2);

    // Separator line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#e5e7eb').lineWidth(2).stroke();
    doc.moveDown(1.5);

    // Receipt details
    const detailsY = doc.y;
    
    doc.fontSize(12).fillColor('#374151');
    doc.font('Helvetica').text('Date:', 50, detailsY);
    doc.font('Helvetica-Bold').text(new Date(payment.createdAt).toLocaleString(), 150, detailsY);
    
    doc.font('Helvetica').text('Transaction ID:', 50, detailsY + 25);
    doc.font('Helvetica-Bold').text(payment.paymentId, 150, detailsY + 25);

    doc.font('Helvetica').text('Payment Status:', 50, detailsY + 50);
    doc.font('Helvetica-Bold').fillColor('#16a34a').text('SUCCESSFUL', 150, detailsY + 50);

    doc.moveDown(4);

    // Details Box
    const boxTop = doc.y;
    doc.rect(50, boxTop, 500, 140)
       .fillOpacity(0.1)
       .fillAndStroke('#3b82f6', '#cbd5e1');
    
    doc.fillOpacity(1); // Reset opacity for text
    doc.fillColor('#1e293b');
    
    const boxContentY = boxTop + 20;
    doc.fontSize(14).font('Helvetica-Bold').text('Payment Details:', 70, boxContentY);
    
    doc.fontSize(12).font('Helvetica').text('Student Name:', 70, boxContentY + 35);
    doc.font('Helvetica-Bold').text(`${payment.user.name || payment.user._id}`, 200, boxContentY + 35);
    
    doc.font('Helvetica').text('Exam Title:', 70, boxContentY + 65);
    doc.font('Helvetica-Bold').text(`${payment.exam.title || payment.exam._id}`, 200, boxContentY + 65);
    
    doc.font('Helvetica').text('Amount Paid:', 70, boxContentY + 95);
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#1e293b').text(`INR ${payment.amount}`, 200, boxContentY + 93);

    doc.moveDown(6);

    // Footer
    const footerY = doc.y + 40;
    doc.moveTo(50, footerY).lineTo(550, footerY).strokeColor('#e5e7eb').lineWidth(1).stroke();
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#9ca3af')
       .text('This is a computer-generated receipt and requires no physical signature.', 50, footerY + 15, { align: 'center' });

    doc.end();

    const receiptUrl = await uploadToImageKit;
    payment.receiptPath = receiptUrl;
    await payment.save();

    res.json({ success: true, receiptUrl: payment.receiptPath });
  } catch (error) {
    console.error("Generate Receipt Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};