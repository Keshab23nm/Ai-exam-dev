import Exam from "../models/exam.js";
import ExamAccess from "../models/examAccess.js";
import mongoose from "mongoose";
import user from "../models/user.js";
import result from "../models/result.js";
import pdfModel from "../models/pdfModel.js";
import Payment from "../models/Payment.js";

export const getExamsForStudent = async (req, res) => {
  try {
    const userClass = req.user.class;

    if (req.user.role === "teacher") {
      // Teachers get all exams for their class WITH correct answers
      const exams = await Exam.find({ class: userClass });
      return res.json({ exams });
    }

    // Students get exams WITHOUT the correctAnswer field
    const exams = await Exam.find({ class: userClass }).select('-questions.correctAnswer');

    const examsWithPayment = await Promise.all(
      exams.map(async (exam) => {
        const payment = await Payment.findOne({
          user: req.user._id,
          exam: exam._id,
          status: 'successful'
        });

        const examObj = exam.toObject();

        if (payment) {
          examObj.paymentStatus = 'otp-generated';
        } else {
          examObj.paymentStatus = 'pending';
        }

        return examObj;
      })
    );

    res.json(examsWithPayment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// export const verifyExamOtp = async (req, res) => {
//   try {
//     const { examId } = req.body;
//     const otp = String(req.body.otp);
//     const userId = req.user._id;
//    console.log(userId)
// // console.log(   new mongoose.Types.ObjectId(userId))
//     // 🔐 Find matching OTP

//     const access = await ExamAccess.findOne({
//       userId,
//       examId,
//       examOtp: otp,   
//       isUsed: false,
//     });


// // const access = await ExamAccess.findOne({
// // userId,
// // examId,
// // examOtp: otp,
// // });


//     console.log(access);
//     if (!access) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // 🔁 Mark OTP as used
//     access.isUsed = true;
//     await access.save();

//     res.json({
//       message: "OTP verified successfully ✅",
//       accessGranted: true,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const verifyExamOtp = async (req, res) => {
  try {
    const { examId, otp } = req.body;
    const userId = req.user._id;

    const access = await ExamAccess.findOne({
      userId,
      examId,
      examOtp: String(otp),
      isUsed: false,
    });

    if (!access) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // ✅ mark OTP used
    access.isUsed = true;

    // ✅ START TIMER HERE
    access.startedAt = new Date();

    await access.save();

    res.json({
      message: "OTP verified successfully ✅",
      accessGranted: true,
      startedAt: access.startedAt, // send to frontend
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);


    const userId = req.user._id;
    // console.log('userId:', userId);
    // console.log(exam.createdBy);
   const seeuser = await user.find({
      _id: userId,
     role: "student",
    });
// console.log('seeuser:', seeuser[0]._id);
const userfind= await result.findOne({
  userId,

});
const examfind= await result.findOne({
  examId: req.params.id,
});
if(userfind && examfind){
  return res.status(400).json({ message: "You have already submitted this exam" });
}

if (userId.toString() !== seeuser[0]._id.toString()) {
  return res.status(401).json({ message: 'Unauthorized' });
}
// if(userId !== seeuser[0]._id){//  object comprision is not possible in mongoose we have to convert it to string before comparision
//   console.log('Unauthorized access attempt by userId:', userId,seeuser[0]._id);
//   return res.status(401).json({ message: 'Unauthorized' });
// }
    // if(!seeuser){
    //   return res.status(401).json({ message: 'Unauthorized' });
    // } 
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // ❗ Do NOT send correctAnswer to frontend
    const questions = exam.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      options: q.options,
    }));

    res.json({
      examId: exam._id,
      title: exam.title,
      duration: exam.duration, // Ensure duration is sent down to the frontend!
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// export const getExamById = async (req, res) => {
//   try {
//     const examId = req.params.id;
//     const userId = req.user._id;

//     const access = await ExamAccess.findOne({
//       // userId,
//       // examId,
//       isUsed: true,
//     });

//     if(!userId){
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
//     if (!access) {
//       return res.status(403).json({
//         message: "Verify OTP first ❌",
//       });
//     }

//     const exam = await Exam.findById(examId);

//     res.json(exam);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// export const createExam = async (req, res) => {
//   try {
//     const { title, subject, class: examClass, duration, questions } = req.body;

//     const exam = await Exam.create({
//       title,
//       subject,
//       class: examClass,
//       duration,
//       questions,
//       createdBy: req.user._id,
//     });

//     res.json({
//       message: "Exam created successfully",
//       exam,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



export const getresult = async (req, res) => {
  try {
    const userId = req.user._id;
    const { examId } = req.query;

    const resultfind = await pdfModel.findOne({
      studentId: userId,
      examId,
      iscreated: true,
    }).populate("examId", "title");

    if (!resultfind) {
      return res.status(200).json({ success: false, message: "Result not found" });
    }

    return res.json({
      success: true,
      name: resultfind.name,
      studentClass: resultfind.studentClass,
      // obtained: resultfind.obtained,
      // total: resultfind.total,
      // percentage: resultfind.percentage,
      // grade: resultfind.grade,
      pdfUrl: resultfind.pdfUrl,
      examTitle: resultfind.examId?.title
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};