import Exam from "../models/exam.js";
import Result from "../models/result.js";

    import ExamAccess from "../models/examAccess.js";
export const submitExam = async (req, res) => {
  try {
    const { examId, answers, startedAt } = req.body;
    const userId = req.user._id;

    // ✅ 1. Validate input
    if (!examId) {
      return res.status(400).json({ message: "Exam ID is required" });
    }

    // ✅ 2. Find exam
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // ✅ 3. Prevent multiple submission
    const existingResult = await Result.findOne({ userId, examId });

    if (existingResult) {
      return res.status(400).json({
        message: "You have already submitted this exam",
      });
    }




const access = await ExamAccess.findOne({ userId, examId });

const now = new Date();
const durationMs = (exam.duration || 60) * 60 * 1000;

// If no access record or startedAt is missing, allow submission but flag as potentially time-expired
let isTimeExpired = false;
if (access && access.startedAt && (now - access.startedAt > durationMs)) {
  isTimeExpired = true;
}


    // ✅ 4. Timer validation (IMPORTANT)
    // if (startedAt && exam.duration) {
    //   const now = new Date();
    //   const startTime = new Date(startedAt);
    //   const durationMs = exam.duration * 60 * 1000;

    //   if (now - startTime > durationMs) {
    //     return res.status(400).json({
    //       message: "Time expired, exam auto-submitted",
    //     });
    //   }
    // }

    // ✅ 5. Initialize counters
    let totalMarks = 0;
    let obtainedMarks = 0;

    const totalQuestions = exam.questions.length;
    let answeredCount = 0;
    let correctCount = 0;

    // ✅ 6. Evaluate answers safely
    const evaluatedAnswers = exam.questions.map((q) => {
      const studentAnswer = answers?.find(
        (a) => a.questionId === q._id.toString()
      )?.selectedAnswer;

      // count answered
      if (studentAnswer !== undefined && studentAnswer !== null) {
        answeredCount++;
      }

      const isCorrect = q.correctAnswer === studentAnswer;

      totalMarks += q.marks;

      if (isCorrect) {
        obtainedMarks += q.marks;
        correctCount++;
      }

      return {
        questionId: q._id,
        question: q.question,
        options: q.options,
        selectedAnswer: studentAnswer || null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        marks: isCorrect ? q.marks : 0,
      };
    });

    // ✅ 7. Save result
    const result = await Result.create({
      userId,
      examId,
      answers: evaluatedAnswers,
      totalMarks,
      obtainedMarks,
      totalQuestions,
      answeredCount,
      correctCount,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      submittedAt: new Date(),
      isSubmitted: true,
    });

    // ✅ 8. Response
  res.json({
  message: isTimeExpired
    ? "Time expired, auto-submitted"
    : "Exam submitted successfully",
  summary: {
    totalQuestions,
    answered: answeredCount,
    correct: correctCount,
    wrong: answeredCount - correctCount,
    totalMarks,
    obtainedMarks,
  },
  result,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};