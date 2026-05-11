import React, { useState, useEffect } from 'react';
import { teacherApi } from '../../api/index';

const TeacherExamPayments = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await teacherApi.getExams();
        setExams(res.data);
      } catch (err) {
        console.error("Failed to fetch exams", err);
      }
    };
    fetchExams();
  }, []);

  const handleExamChange = async (e) => {
    const examId = e.target.value;
    setSelectedExam(examId);
    if (!examId) {
      setPaymentData(null);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await teacherApi.getPaymentStatus(examId);
      setPaymentData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payment status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-black text-[#0f172a] tracking-tight font-sans text-left">Fee Verification Console</h2>
        
        <div className="relative w-full md:w-72">
          <select
            value={selectedExam}
            onChange={handleExamChange}
            className="w-full appearance-none bg-white font-black text-[#00335a] px-6 py-4 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00335a]/20 transition-all cursor-pointer text-sm"
          >
            <option value="">Select Examination</option>
            {exams.map(exam => (
              <option key={exam._id} value={exam._id}>{exam.title}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#00335a]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7.247 11.14 2.451 5.658C2.13 5.269 2.408 4.7 2.91 4.7h9.18c.502 0 .78.569.459.958l-4.796 5.482a.5.5 0 0 1-.741 0z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ...existing code... */}

      {paymentData && !loading && (
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
          <div className="px-5 sm:px-10 py-5 sm:py-8 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
            <div>
              <p className="text-[10px] font-black text-[#00335a] uppercase tracking-[0.4em] mb-1">Clearing Roster</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight font-sans text-left">{paymentData.examTitle}</h3>
            </div>
            <div className="bg-[#00335a] text-white px-4 sm:px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
              {paymentData.paymentStatus.filter(s => s.paid).length} / {paymentData.paymentStatus.length}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 sm:px-10 py-4 sm:py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Student</th>
                  <th className="px-5 sm:px-10 py-4 sm:py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hidden sm:table-cell">Email</th>
                  <th className="px-5 sm:px-10 py-4 sm:py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentData.paymentStatus.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 sm:px-10 py-4 sm:py-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-sm ${student.paid ? 'bg-[#00335a]' : 'bg-slate-300'}`}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="font-black text-[#0f172a] text-sm block truncate">{student.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium truncate sm:hidden block">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 sm:px-10 py-4 sm:py-6 text-slate-600 font-bold font-sans text-left hidden sm:table-cell">{student.email}</td>
                    <td className="px-5 sm:px-10 py-4 sm:py-6">
                      <div className="flex justify-center">
                        {student.paid ? (
                          <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200">
                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Paid</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-rose-100 text-rose-800 rounded-xl border border-rose-200">
                            <div className="w-1.5 h-1.5 bg-rose-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Unpaid</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {paymentData.paymentStatus.length === 0 && (
            <div className="p-20 text-center">
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">No student records found for this cohort.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherExamPayments;