import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { examApi } from "../../api/index";
import QuestionCard from "./QuestionCard";

const ExamPage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  
    examApi.getExamQuestions(examId)
    .then(res => {
      setExam(res.data.exam || res.data); // Adjust based on your actual response
      // Set time based on backend duration format (assuming minutes)
      const durationInMinutes = (res.data.exam || res.data).duration || 60;
      setTimeLeft(durationInMinutes * 60);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError("Failed to load exam or unauthorized.");
      setLoading(false);
    });
  }, [examId]);

  // TIMER
  useEffect(() => {
    if (loading || !exam) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timerObj = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerObj);
  }, [timeLeft, loading, exam]);

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, { questionId, selectedAnswer: option }];
    });
  };

  const currentAnswerForQuestion = (questionId) => {
    const found = answers.find(a => a.questionId === questionId);
    return found ? found.selectedAnswer : "";
  };

  const handleSubmit = async () => {
    try {
      // 📝 Submit answers (IMPORTANT)
      await examApi.submitExam({
        examId,
        answers,
      });
      alert("Exam submitted successfully!");
      navigate('/student-dashboard'); // Or go to a results page
    } catch (err) {
      console.error(err);
      alert("Error submitting exam.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 p-6">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p>{error || "You do not have access to this exam."}</p>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeCritical = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="min-h-screen bg-gray-50 pb-28 sm:pb-20">
      {/* Sticky Top Header */}
      <div className="sticky top-0 bg-white shadow-sm border-b border-gray-200 z-10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 max-w-3xl mx-auto">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{exam.title}</h2>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Please complete all questions before submitting.</p>
          </div>
          <div className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border flex items-center gap-2 sm:gap-3 shadow-sm ${
            isTimeCritical
              ? 'bg-red-50 border-red-200 text-red-700 animate-pulse'
              : 'bg-blue-50 border-blue-100 text-blue-800'
          }`}>
            <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider opacity-80 hidden xs:inline">Time</span>
            <span className="text-xl sm:text-2xl font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-6">
          <div className="flex justify-between items-center mb-5 border-b pb-4">
            <h3 className="text-base sm:text-xl font-semibold text-gray-800">Questions ({exam.questions?.length || 0})</h3>
            <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
              Answered: {answers.length}
            </span>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {exam.questions && exam.questions.map((q, index) => (
              <div key={q._id} id={`question-${index}`}>
                <div className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">Question {index + 1}</div>
                <QuestionCard
                  q={q}
                  onAnswer={handleAnswer}
                  currentAnswer={currentAnswerForQuestion(q._id)}
                />
              </div>
            ))}
            {(!exam.questions || exam.questions.length === 0) && (
              <p className="text-center text-gray-500 py-8">No questions found for this exam.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Submit Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 sm:px-6 py-3 sm:py-4 z-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
            Review your answers before submitting.
          </p>
          <button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 py-3 bg-[#00335a] hover:bg-[#004276] active:scale-95 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            Submit Exam
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;