import React, { useState, useEffect } from 'react';
import { teacherApi, examApi } from '../../api/index';

const TeacherManageResults = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [sendingResultId, setSendingResultId] = useState(null);

  // Fetch all exams for this teacher to populate the dropdown/list
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoadingExams(true);
        const res = await examApi.getAllExams();
        const fetchedExams = res.data.exams || res.data || [];
        setExams(fetchedExams);
      } catch (err) {
        console.error('Failed to fetch exams', err);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  // Fetch results when an exam is selected
  useEffect(() => {
    if (!selectedExam) return;

    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        setResults([]);
        const res = await teacherApi.getResultsStudents(selectedExam._id);
        setResults(res.data || []);
       
      } catch (err) {
        console.error('Failed to fetch results', err);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchResults();
  }, [selectedExam]);
  // console.log(results);
// console.log(selectedExam._id);


  const handleSendResult = async (resultId) => {
    const resultToSend = results.find((r) => r._id === resultId);
    if (!resultToSend) return;

    setSendingResultId(resultId);
    try {
      const res = await teacherApi.createPdf({
        name: resultToSend.userId?.name,
        studentClass: selectedExam?.class || resultToSend.userId?.class,
        obtained: resultToSend.obtainedMarks,
        total: resultToSend.totalMarks,
        examId: selectedExam._id,
        studentId: resultToSend.userId?._id,
        subject: selectedExam?.subject
      });

      if (res.data.success === false) {
        alert(res.data.message);
      } else {
        alert('Result sent successfully to the student!');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send result';
      alert(errorMessage);
    } finally {
      setSendingResultId(null);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-xl p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-white/40 gap-5 sm:gap-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#191c1d] tracking-tight">Academic Grading</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Linguistic and quantitative performance analysis</p>
        </div>
        <div className="w-full sm:w-[400px]">
          {loadingExams ? (
            <div className="h-12 sm:h-14 bg-[#f8f9fa] rounded-2xl animate-pulse w-full"></div>
          ) : (
            <div className="relative group">
              <label className="absolute -top-2 left-4 sm:left-6 bg-white px-2 text-[9px] font-black text-[#004276] uppercase tracking-widest z-10">Target Module</label>
              <select
                className="w-full h-12 sm:h-14 bg-white/40 backdrop-blur-md border border-slate-100 rounded-2xl px-4 sm:px-6 outline-none focus:ring-2 focus:ring-[#004276]/20 focus:border-[#004276] text-sm font-bold text-[#31444c] appearance-none cursor-pointer transition-all hover:bg-white"
                onChange={(e) => {
                  const examOptions = exams.find(ex => String(ex._id) === e.target.value);
                  setSelectedExam(examOptions || null);
                }}
                defaultValue=""
              >
                <option value="" disabled>Select module for review</option>
                {exams.map(exam => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title} — {exam.class || 'Global'}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedExam ? (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-white overflow-hidden flex-1 flex flex-col">
          <div className="px-5 sm:px-10 py-5 sm:py-8 border-b border-slate-50 flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="text-base sm:text-xl font-black text-[#191c1d] tracking-tight leading-none">
                <span className="text-[#004276]">{selectedExam.title}</span>
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{selectedExam.class || 'Global'} Repository</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 px-4 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center shadow-inner">
                <span className="text-[#10b981] text-[10px] font-black tracking-widest uppercase">{results.length} Authenticated</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            {loadingResults ? (
              <div className="p-12 sm:p-20 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#004276]/10 border-t-[#004276] rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying Performance Logs</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-12 sm:p-24 text-center">
                <div className="text-6xl mb-6 opacity-20 filter grayscale">📋</div>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em]">Archival Record Empty</p>
                <p className="text-xs font-medium italic mt-2 text-slate-300">Awaiting student authentication and submission</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f8f9fa] text-[#004276]">
                    <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em]">Candidate</th>
                    <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center hidden sm:table-cell">Dept.</th>
                    <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center">Score</th>
                    <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-center hidden md:table-cell">%</th>
                    <th className="px-4 sm:px-10 py-4 sm:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {results.map((res) => {
                    const studentName = res.userId?.name || 'Unknown Candidate';
                    const obtainedMarks = res.obtainedMarks || 0;
                    const totalMarks = res.totalMarks || 0;
                    const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(1) : 0;
                    const isPassing = percentage >= 40;

                    return (
                      <tr key={res._id} className="hover:bg-slate-50/50 transition-colors group/row">
                        <td className="px-4 sm:px-10 py-4 sm:py-6">
                          <div className="flex items-center gap-3 sm:gap-5">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1.2rem] bg-[#f8f9fa] text-slate-400 flex items-center justify-center font-black text-sm shadow-inner flex-shrink-0">
                              {studentName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-[#31444c] capitalize tracking-tight truncate">{studentName}</div>
                              <div className="text-[10px] text-slate-400 font-medium truncate hidden sm:block">{res.userId?.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-10 py-4 sm:py-6 text-center hidden sm:table-cell">
                          <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-50 shadow-sm">{selectedExam.class || 'GLB'}</span>
                        </td>
                        <td className="px-4 sm:px-10 py-4 sm:py-6 text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-100 shadow-sm leading-none">
                            <span className="text-[#191c1d] font-black text-sm">{obtainedMarks}</span>
                            <span className="text-slate-300 text-[10px] font-bold">/</span>
                            <span className="text-slate-400 text-xs font-bold">{totalMarks}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-10 py-4 sm:py-6 text-center hidden md:table-cell">
                          <div className={`text-sm font-black tracking-tight ${isPassing ? 'text-emerald-500' : 'text-rose-500'}`}>{percentage}%</div>
                          <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mt-2 overflow-hidden">
                            <div className={`h-full rounded-full ${isPassing ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-10 py-4 sm:py-6 text-right">
                          <button
                            onClick={() => handleSendResult(res._id)}
                            disabled={sendingResultId === res._id}
                            aria-label={sendingResultId === res._id ? 'Sending…' : 'Deploy result to student'}
                            className={`h-10 sm:h-12 px-3 sm:px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow flex items-center gap-2 ml-auto ${
                              sendingResultId === res._id
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                                : 'bg-[#004276] text-white hover:bg-[#002a4b] active:scale-95'
                            }`}
                          >
                            {sendingResultId === res._id ? (
                              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                            ) : (
                              <span className="material-symbols-outlined text-sm">send</span>
                            )}
                            <span className="hidden sm:inline">{sendingResultId === res._id ? 'Sending…' : 'Deploy'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <svg className="w-24 h-24 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="text-xl font-bold text-gray-700">No Exam Selected</h3>
          <p className="text-gray-500 mt-2 text-center max-w-md">
            Please select an exam from the dropdown menu above to view all student results organized in a row-by-row format.
          </p>
        </div>
      )}
    </div>
  );
};

export default TeacherManageResults;