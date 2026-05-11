import React, { useEffect, useState } from "react";
import { examApi } from "../../api/index";
import ExamItem from "./ExamItem";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    examApi.getAllExams()
    .then((res) => {
      // Sometimes the backend sends an array, sometimes an object with an 'exams' property
      const fetchedExams = Array.isArray(res.data) ? res.data : res.data.exams || [];
      setExams(fetchedExams);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError("Failed to fetch exams. Please check your connection or login again.");
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-gray-500">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="font-medium animate-pulse">Loading exams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 border border-red-200 rounded-lg text-center font-medium my-4">
        {error}
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-bold text-gray-700 mb-1">No Exams Available</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Currently, there are no exams assigned to you. When a teacher publishes an exam, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {exams.map((exam) => (
        <ExamItem key={exam._id} exam={exam} />
      ))}
    </div>
  );
};

export default ExamList;