import express from "express";
import {
 
  getExamsForStudent,
  verifyExamOtp,
  getExamById,
  getresult
} from "../controllers/exam.controller.js";

import { user } from "../middlewire/authmiddlewire.js";
import { isTeacher } from "../middlewire/rolemiddlewire.js";

import { submitExam } from "../controllers/result.controller.js";

const router = express.Router();

// 📘 Student sees exam list
router.get("/", user, getExamsForStudent);

// 🔐 OTP verification
router.post("/verify-otp", user, verifyExamOtp);

// 🧠 Get questions + options
router.get("/questions/:id", user, getExamById);

// 📝 Submit answers (IMPORTANT)
router.post("/submit-exam", user, submitExam);
router.get("/get-result", user, getresult);
export default router;