import React, { useState, useEffect } from 'react';
import { teacherApi, examApi } from '../../api/index';

const TotalStudents = () => {
  const [totalStudents, setTotalStudents] = useState([]);
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to remove this student from the system? This action cannot be undone.')) {
      try {
        await teacherApi.deleteStudent(studentId);
        setTotalStudents(prev => prev.filter(s => s._id !== studentId));
        // Optional: Trigger a refresh of the entire data if needed
      } catch (error) {
        console.error('Failed to delete student', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch total students in class
        const studentsRes = await teacherApi.getStudents();
        setTotalStudents(studentsRes.data);

        // 2. Fetch exams for this class
        const examsRes = await examApi.getAllExams();
        const exams = examsRes.data.exams || examsRes.data || [];

        // 3. For each exam, fetch appeared and not-appeared students
        const examsWithDetails = await Promise.all(
          exams.map(async (exam) => {
            try {
              const [resultsRes, notDoneRes] = await Promise.all([
                teacherApi.getResultsStudents(exam._id),
                teacherApi.getStudentNotDoneExam(exam._id),
              ]);

              return {
                ...exam,
                appeared: resultsRes.data,
                notAppeared: notDoneRes.data.pendingExams || notDoneRes.data || [],
              };
            } catch (err) {
              console.error(`Failed to fetch details for exam ${exam.title}`, err);
              return { ...exam, appeared: [], notAppeared: [] };
            }
          })
        );

        setExamData(examsWithDetails);
      } catch (error) {
        console.error('Error fetching student data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-xl h-12 w-12 border-4 border-[#004276]/20 border-t-[#004276]"></div>
      </div>
    );
  }

  // Calculate global not-appeared list
  const allNotAppeared = [];
  examData.forEach(exam => {
    const pendingList = Array.isArray(exam.notAppeared) ? exam.notAppeared : [];
    pendingList.forEach(item => {
      if (item.userId) {
        allNotAppeared.push({
          studentName: item.userId.name || 'Unknown',
          status: 'Pending Submission',
          examName: exam.title,
        });
      }
    });
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Section: Overview & Not Appeared */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Total Students Card - Layering Principle */}
        <div className="bg-gradient-to-br from-[#004276] to-[#005ba3] rounded-[2.5rem] p-8 text-white shadow-[0_20px_50px_rgba(0,66,118,0.15)] flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-70">Total Cohort</h3>
          <p className="text-7xl font-black tracking-tight">{totalStudents.length}</p>
          <div className="mt-4 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">Active Students</div>
        </div>

        {/* Not Appeared List - Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-8 lg:col-span-2 flex flex-col h-80 border border-white/40">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-black text-[#191c1d] tracking-tight">Pending Examinations</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{allNotAppeared.length} Candidates Outstanding</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {allNotAppeared.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allNotAppeared.map((record, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#f8f9fa] p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300 group border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white text-[#004276] flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {record.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-[#31444c] capitalize text-sm">{record.studentName}</p>
                        <p className="text-[9px] text-[#004276] font-black uppercase tracking-widest">{record.status}</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg shadow-sm group-hover:text-[#004276] transition-colors">
                      {record.examName}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 italic py-8">
                <span className="text-4xl mb-2">🌿</span>
                <p className="text-sm font-medium">Academic integrity complete. No pending exams.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NEW: Student Directory with Delete Option */}
      <StudentDirectory students={totalStudents} onDelete={handleDeleteStudent} />

      {/* Bottom Section: Exams Store / Results View - Planes over Boxes */}
      <div className="bg-white/40 backdrop-blur-md rounded-[3rem] p-1 shadow-sm">
        <div className="px-10 py-8">
          <h2 className="text-2xl font-black text-[#191c1d] tracking-tight">Examination Archive</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified submission records and analytics</p>
        </div>
        
        <div className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {examData.length > 0 ? (
            examData.map((exam) => {
              const appearedList = Array.isArray(exam.appeared) ? exam.appeared : [];
              
              return (
                <div key={exam._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,66,118,0.08)] hover:-translate-y-1 group border border-slate-50">
                  <div className="px-8 py-6 flex justify-between items-start">
                    <div className="flex-1 mr-4">
                      <p className="text-[9px] font-black text-[#004276] uppercase tracking-[0.2em] mb-1">Module</p>
                      <h3 className="font-black text-lg text-[#191c1d] leading-tight group-hover:text-[#004276] transition-colors mb-2">{exam.title}</h3>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e0f2fe] rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#004276] animate-pulse"></span>
                        <span className="text-[10px] font-bold text-[#004276] uppercase tracking-wider">{appearedList.length} Authenticated</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 pb-6 pt-2">
                    <div className="h-64 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                      {appearedList.length > 0 ? (
                        appearedList.map((resItem, idx) => {
                          const studentName = resItem.userId?.name || 'Unknown';
                          return (
                            <div key={idx} className="flex justify-between items-center bg-[#f8f9fa] p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white text-slate-400 flex items-center justify-center font-black text-xs shadow-sm group-hover:text-[#004276]">
                                  {studentName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-[#31444c] capitalize text-xs">{studentName}</p>
                                  <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Verified Completion</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
                          <p className="text-xs font-medium italic">Archive empty</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-slate-400 font-medium italic">No academic modules discovered within the repository.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalStudents;

const StudentDirectory = ({ students, onDelete }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-10 border border-white/40 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-[#191c1d] tracking-tight">Student Directory</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management of active cohort members</p>
        </div>
        <div className="px-5 py-2 bg-[#e0f2fe] text-[#004276] text-[10px] font-black tracking-widest uppercase rounded-full shadow-sm">
          {students.length} Total Enrolled
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student._id} className="bg-slate-50/50 p-6 rounded-[2rem] border border-transparent hover:border-[#004276]/10 hover:bg-white hover:shadow-xl transition-all duration-500 group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#004276] text-xl font-black border border-slate-100 group-hover:scale-110 group-hover:bg-[#004276] group-hover:text-white transition-all duration-500">
                  {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <button 
                  onClick={() => onDelete(student._id)}
                  className="p-2.5 rounded-xl bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-500 hover:text-white shadow-sm"
                  title="Remove Student"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
              
              <div>
                <h3 className="font-black text-[#191c1d] text-lg capitalize tracking-tight mb-1">{student.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span className="text-[11px] font-bold uppercase tracking-wider">Class: {student.class || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span className="text-[11px] font-medium truncate italic">{student.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${student.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {student.isVerified ? 'Verified' : 'Pending'}
                </span>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">UID: {student._id.slice(-6).toUpperCase()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 italic font-medium">No students registered in this class.</p>
          </div>
        )}
      </div>
    </div>
  );
};
