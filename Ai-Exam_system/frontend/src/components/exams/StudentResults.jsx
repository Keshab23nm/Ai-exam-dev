import React, { useState, useEffect } from 'react';
import { examApi } from '../../api/index';

const StudentResults = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch all exams for the student's class
        const examsRes = await examApi.getAllExams();
        const fetchedExams = examsRes.data.exams || examsRes.data || [];

        // 2. Fetch the result for each specific exam
        const resultPromises = fetchedExams.map(async (exam) => {
          try {
            const res = await examApi.getResult(exam._id);
            // If the backend returns success: true, it means a result was found
            if (res.data.success) {
              return { examId: exam._id, ...res.data, iscreated: true };
            }
            return null;
          } catch (err) {
            return null; // Ignore errors for individual missing results
          }
        });

        // Wait for all specific exam result requests to finish
        const fetchedResultsArray = await Promise.all(resultPromises);
        // Filter out the nulls (exams that don't have results yet)
        const fetchedResults = fetchedResultsArray.filter(Boolean);

        setExams(fetchedExams);
        setResults(fetchedResults);
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
// console.log(results);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="font-bold text-base sm:text-lg text-gray-800">My Exam Results</h3>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : exams.length === 0 ? (
          <div className="p-12 text-center text-gray-500 italic">
            You don't have any exams assigned yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs sm:text-sm uppercase tracking-wider border-b border-gray-200">
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Student</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Exam</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-center">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {exams.map((exam) => {
                // Find matching result logic
                const examResult = results.find(
                  (res) => String(res.examId?._id || res.examId) === String(exam._id) && res.iscreated
                );

                const hasResult = !!examResult;
                // Try grabbing name from result, otherwise fallback to "Pending Name/Exam"
                const studentName = examResult ? examResult.name : "Waiting for Result";

                return (
                  <tr key={exam._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
                      <div className="font-semibold text-gray-800 capitalize text-sm max-w-[120px] sm:max-w-none truncate">
                        {hasResult ? studentName : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600 font-medium text-sm max-w-[120px] sm:max-w-none truncate">
                      {exam.title}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 text-center">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold ${
                        hasResult ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {hasResult ? "Done" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 text-right">
                      <a
                        href={hasResult ? examResult.pdfUrl : "#"}
                        target={hasResult ? "_blank" : "_self"}
                        rel="noreferrer"
                        aria-label={hasResult ? `Download result for ${exam.title}` : "Result not available"}
                        className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-sm ${
                          hasResult
                            ? "bg-[#00335a] hover:bg-[#004276] text-white"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={(e) => { if (!hasResult) e.preventDefault(); }}
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentResults;