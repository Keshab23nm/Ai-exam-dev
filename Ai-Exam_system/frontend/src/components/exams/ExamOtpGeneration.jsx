import React, { useState, useEffect } from 'react';
import { teacherApi } from '../../api/index';

const ExamOtpGeneration = () => {
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch teacher's exams
        const examsRes = await teacherApi.getExams();
        
        // 2. Fetch class students
        const studentsRes = await teacherApi.getStudents();
        
        setExams(examsRes.data);
        setStudents(studentsRes.data);
      } catch (error) {
        console.error('Error fetching data for OTP generation', error);
        setMessage({ type: 'error', text: 'Failed to load exams or students data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sendOtp = async (examId, studentId) => {
    setProcessingId(`${examId}-${studentId}`);
    try {
      const res = await teacherApi.generateOtp(examId, studentId);
      
      setMessage({ type: 'success', text: res.data.message || 'OTP generated successfully!' });
      
      // Auto clear success message
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error generating OTP' 
      });
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">Generate Exam OTP</h2>
          <p className="text-xs font-bold text-slate-500 mt-1">Select a student to generate their unique access code.</p>
        </div>

        {message.text && (
          <div className={`w-full sm:w-auto px-5 sm:px-8 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] shadow-lg animate-in fade-in zoom-in-95 duration-500 flex items-center gap-3 sm:gap-4 border-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-inner flex-shrink-0 ${
              message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {message.type === 'success' ? '✓' : '!'}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-0.5">Notification</p>
              <p className="text-sm font-bold tracking-tight">{message.text}</p>
            </div>
          </div>
        )}
      </div>

      {exams.length === 0 ? (
        <div className="bg-white p-10 sm:p-20 rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-6">🔒</div>
          <p className="text-[#0f172a] font-black uppercase tracking-[0.2em]">No Active Exams</p>
          <p className="text-sm font-bold text-slate-400 mt-2">Create an exam first to generate access codes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-10">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-200 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 overflow-hidden flex flex-col group">
              {/* Exam Header */}
              <div className="bg-[#00335a] p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm border border-white/10">Class {exam.class || 'N/A'}</span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{exam.duration || 60} Mins</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">{exam.title}</h3>
                </div>
              </div>

              {/* Students List */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/50 max-h-[400px] sm:max-h-[500px]">
                <div className="mb-4 px-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-sans text-left">{students.length} Registered Students</h4>
                </div>

                {students.length > 0 ? (
                  <div className="space-y-3">
                    {students.map((student) => {
                      const isProcessing = processingId === `${exam._id}-${student._id}`;
                      return (
                        <div key={student._id} className="bg-white p-4 sm:p-5 rounded-[1.5rem] flex justify-between items-center transition-all duration-300 border border-slate-100 shadow-sm hover:shadow-md gap-3">
                          <div className="flex items-center gap-3 sm:gap-4 text-left min-w-0">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-[1rem] flex items-center justify-center text-white font-black text-sm transition-all shadow-sm ${isProcessing ? 'bg-slate-300' : 'bg-[#00335a]'}`}>
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-[#0f172a] capitalize text-sm truncate">{student.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 leading-none mt-1 truncate hidden sm:block">{student.email}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => sendOtp(exam._id, student._id)}
                            disabled={isProcessing}
                            aria-label={isProcessing ? 'Generating OTP…' : `Generate OTP for ${student.name}`}
                            className={`flex-shrink-0 h-10 sm:h-11 px-3 sm:px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-sm flex items-center gap-2 ${
                              isProcessing
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-[#00335a] text-white hover:bg-black active:scale-95'
                            }`}
                          >
                            {isProcessing ? (
                              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                            ) : (
                              <span className="material-symbols-outlined text-sm">key</span>
                            )}
                            <span className="hidden sm:inline">{isProcessing ? 'Generating…' : 'OTP'}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12 grayscale opacity-50">
                    <p className="text-xs font-black uppercase tracking-[0.2em]">No students in class</p>
                  </div>
                )}
              </div>

              <div className="p-5 sm:p-6 bg-white border-t border-slate-200 flex items-center justify-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans text-left">Secure OTP Protocol Active</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamOtpGeneration;
