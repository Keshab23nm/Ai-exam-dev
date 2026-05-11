import express from 'express';
import { createOrder, verifyPayment, generateOtp, verifyOtp, generateReceipt } from '../controllers/payment.controller.js';
import { user } from '../middlewire/authmiddlewire.js';

const router = express.Router();

router.post('/create-order', user, createOrder);
router.post('/verify-payment', user, verifyPayment);
router.post('/generate-otp', user, generateOtp);
router.post('/verify-otp', user, verifyOtp);
router.get('/receipt/:paymentId', user, generateReceipt);

export default router;