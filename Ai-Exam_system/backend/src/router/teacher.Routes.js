import express from "express";
import {
  getStudentsByClass,
  deleteStudent,
  generateExamOtp,
  getResultsForTeacher,
  notdoneexam,
  getExam,
  markAttendance,
  getAttendanceList,
  getPaymentStatusByExam
} from "../controllers/teacher.controller.js";
import { getteacher } from "../controllers/auth.controller.js";
import { user } from "../middlewire/authmiddlewire.js";
import { isTeacher } from "../middlewire/rolemiddlewire.js";
import { getExamsForStudent } from "../controllers/exam.controller.js";
import {generatePDF} from "../controllers/pdf.controller.js";
const router = express.Router();

router.get("/students", user, isTeacher, getStudentsByClass);
router.delete("/student/:id", user, isTeacher, deleteStudent);
router.post("/generate-otp/:examId", user, isTeacher, generateExamOtp);
router.get("/teacheriam", user, isTeacher, getteacher);
router.get("/results-students", user, isTeacher, getResultsForTeacher);
router.get ("/student-notdone-exam", user, isTeacher, notdoneexam);
router.get("/get-exam", user, isTeacher, getExam);
router.get("/", user, isTeacher, getExamsForStudent);
router.post("/create-pdf",user,isTeacher,generatePDF);
router.post("/markAttendance",user,isTeacher,markAttendance)
router.get("/attendance-list", user, isTeacher, getAttendanceList);
router.get("/payment-status", user, isTeacher, getPaymentStatusByExam);

export default router;