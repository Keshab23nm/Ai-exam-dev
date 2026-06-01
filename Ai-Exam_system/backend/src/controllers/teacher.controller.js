import User from "../models/user.js";
import ExamAccess from "../models/examAccess.js";
import Exam from "../models/exam.js";
import result from "../models/result.js";
import Attendance from "../models/qrModel.js";
import Payment from "../models/Payment.js";
import {config} from '../config/config.js';
import { transporter } from '../utils/emailotpsend.js';




export const getStudentsByClass = async (req, res) => {
  try {
    // console.log(req.user);
    const teacherClass = req.user.class;

    const students = await User.find({
      class: teacherClass,
      role: "student",
    }).select("-password");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteStudent = async (req, res) => {
  try {
     
    const teacherClass = req.user.class;
    const student = await User.findById(req.params.id);

    if (student.class !== teacherClass) {
      return res.status(403).json({ message: "Not authorized to delete this student" });
    }
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.deleteOne();

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// export const generateExamOtp = async (req, res) => {

//   try {
//     const { userId } = req.body;

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
// const findexamid= await Exam.find({_id})
// console.log(findexamid);
// if(!findexamid){  return res.status(404).json({ message: "Exam not found" });
// }
//     const access = await ExamAccess.create({
//       userId,
//       examId,
//       examOtp: otp,
//     });

//     console.log("Exam OTP:", otp);

//     res.json({
//       message: "Exam OTP generated",
//       otp,
//       access,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const generateExamOtp = async (req, res) => {
  try {
    const teacherId = req.user._id;              
    const { studentId } = req.body;              
    const examId = req.params.examId;           

    console.log("Teacher Context - examId:", examId, "studentId:", studentId, "Body:", req.body);

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (!studentId) {
       return res.status(400).json({ message: "Student ID is required in request body" });
    }

    const payment = await Payment.findOne({ 
      user: studentId, 
      exam: examId, 
      status: 'successful' 
    });

    if (!payment) {
      console.log("No successful payment found for Student:", studentId, "Exam:", examId);
      return res.status(400).json({ message: "Payment not completed for this student" });
    } 

    // 🔐 2. Check teacher owns this exam
    if (exam.createdBy.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔐 3. Check student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 🔐 4. Check student belongs to same class
    // Using loose equality in case one is a string and other is a number
    if (student.class != exam.class) {
      return res.status(400).json({
        message: `Student class (${student.class}) mismatch with exam class (${exam.class})`,
      });
    }

    // 🔁 5. Prevent duplicate OTP
    const existing = await ExamAccess.findOne({
      userId: studentId,
      examId,
      isUsed: false,
    });

    if (existing) {
      return res.json({ message: "OTP already sent", access: existing });
    }

    // 🔢 6. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 💾 7. Save OTP
    const access = await ExamAccess.create({
      userId: studentId,
      examId,
      examOtp: otp
    });

const mailOptions = {
    from: config.OTP_EMAIL,
    to: student.email,
    subject: `📝 Exam Entrance Code: ${exam.title}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #10B981; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">Exam Entry Pass</h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="color: #333; margin-top: 0;">Hello ${student.name},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Your teacher has generated an entrance code for the following exam:</p>
          
          <div style="background-color: #f9fafb; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #374151; font-weight: 600;">Exam: ${exam.title}</p>
            <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 14px;">Class: ${exam.class}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; font-weight: bold; margin-bottom: 10px;">YOUR ENTRANCE CODE:</p>
            <div style="display: inline-block; background-color: #ecfdf5; padding: 15px 30px; border-radius: 8px; border: 2px solid #10B981;">
              <span style="font-size: 32px; font-weight: bold; color: #059669; letter-spacing: 5px;">${otp}</span>
            </div>
          </div>

          <div style="background-color: #fffbeb; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin-top: 20px;">
            <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">⚠️ Important Instructions:</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #b91c1c; font-size: 13px; line-height: 1.5;">
              <li>This code is for <b>ONE-TIME USE ONLY</b>.</li>
              <li>Once you enter the exam with this code, it will be invalidated.</li>
              <li>Make sure you are fully prepared and have a stable internet connection before using this code.</li>
              <li>Do not share this code with anyone else.</li>
            </ul>
          </div>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} ExamiSystem - Secure Examination Portal</p>
        </div>
      </div>
    `,
  };

   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        // Using return to stop execution and prevent duplicate response
        return res.status(500).json({ success: false, message: "Error sending email" });
      } 
      console.log("Email sent: ", info.response);
      return res.json({
        success: true,
        message: "OTP generated and sent to email successfully",
        access,
      });
    });

  } catch (error) {
    console.error("Teacher OTP Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const getResultsForTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { examId } = req.query;

    // Find the exam and verify the teacher is the owner
    const exam = await Exam.findById(examId);
    if (!exam || exam.createdBy.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find all results for this exam
    const results = await result.find({ examId }).populate("userId", "name email").select("-answers");

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


  export const notdoneexam = async(req,res)=>{
  try {
    const { examId } = req.query; 
    
    // Find all ExamAccess records where the exam is not done (isUsed: false)
    // and populate the userId to get the student's name and email
    // Select only the populated userId field and exclude all other ExamAccess fields like examOtp, isUsed, etc.
    const pendingExams = await ExamAccess.find({ isUsed: false, examId })
      .populate("userId", "name email")
      .select("userId -_id");

 const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    console.log(exam.title);
    res.json({examTitle: exam.title, pendingExams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


  export const getExam = async(req,res)=>{
     const createdBy = req.user._id;
     const teacherclass = req.user.class;
  try {
    const exams = await Exam.find({ createdBy, class: teacherclass });

    if (!exams) {
      return res.status(404).json({ message: "No exams found" });
    }

    res.json(exams);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}





export const markAttendance = async (req, res) => {
  try {
    const { userId } = req.body;
    const teacherClass = req.user.class; // Get the logged-in teacher's class

    // 1. Find the student in the database
    const student = await User.findById(userId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // 2. Security Check: Block if classes don't match
    if (String(student.class) !== String(teacherClass)) {
      return res.status(403).json({ 
        error: `Cannot mark attendance. Student is in class ${student.class}, but you manage class ${teacherClass}.` 
      });
    }

    // Standardize date to "Sun May 10 2026" format to match existing DB records
    const today = new Date().toDateString();

    const exists = await Attendance.findOne({ userId, date: today });

    if (exists) {
      return res.status(200).json({ message: "Already marked" });
    }

    await Attendance.create({ userId, date: today });

    res.json({ message: "Attendance marked" });

  } catch (err) {
    res.status(400).json({ error: "Invalid QR or Server Error" });
  }
};


export const getPaymentStatusByExam = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { examId } = req.query;

    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required" });
    }

    // 1. Verify exam existence and ownership
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.createdBy.toString() !== teacherId.toString()) {
      return res.status(403).json({ message: "Not authorized to view this exam's payments" });
    }

    // 2. Get all students in the teacher's/exam's class
    const students = await User.find({ 
      class: exam.class, 
      role: 'student' 
    }).select("name email");

    // 3. Get all successful payments for this exam
    const payments = await Payment.find({ 
      exam: examId, 
      status: 'successful' 
    }).select("user");

    const paidUserIds = payments.map(p => p.user.toString());

    // 4. Combine data
    const paymentStatus = students.map(student => ({
      _id: student._id,
      name: student.name,
      email: student.email,
      paid: paidUserIds.includes(student._id.toString())
    }));

    res.json({
      examTitle: exam.title,
      paymentStatus
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceList = async (req, res) => {
  try {
    const { date } = req.query;
    const teacherClass = req.user.class;
    
    // Explicitly use the provided date or default to today's date string
    const queryDate = date || new Date().toDateString();

    const attendances = await Attendance.find({ date: queryDate })
      .populate({
        path: "userId",
        match: { class: teacherClass }, // Only populate if student is in teacher's class
        select: "name email class role"
      })
      .sort({ _id: -1 });

    // Filter out attendances where userId is null (students not in this teacher's class)
    const filteredAttendances = attendances.filter(a => a.userId !== null);

    res.json(filteredAttendances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
