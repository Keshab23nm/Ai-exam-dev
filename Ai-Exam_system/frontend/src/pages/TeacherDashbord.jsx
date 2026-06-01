import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../api/index';
import { useAuth } from '../context/AuthContext';
import TotalStudents from '../components/exams/TotalStudents';
import ExamOtpGeneration from '../components/exams/ExamOtpGeneration';
import TeacherManageExams from '../components/exams/TeacherManageExams';
import TeacherManageResults from '../components/exams/TeacherManageResults';
import TeacherAttendance from '../components/exams/TeacherAttendance';
import TeacherExamPayments from '../components/exams/TeacherExamPayments';

const NAV_ITEMS = [
  { id: 'profile',    label: 'Profile',    icon: 'person' },
  { id: 'students',   label: 'Students',   icon: 'groups' },
  { id: 'exams',      label: 'Exams',      icon: 'quiz' },
  { id: 'results',    label: 'Results',    icon: 'bar_chart' },
  { id: 'otp',        label: 'OTP',        icon: 'key' },
  { id: 'payments',   label: 'Fees',       icon: 'payments' },
  { id: 'attendance', label: 'Attendance', icon: 'qr_code_scanner' },
];

const TeacherDashbord = () => {
  const { user: teacherData, logout } = useAuth();
  const [activeTab, setActiveTab]     = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    const sectionTitleStyle = 'text-2xl sm:text-3xl font-black text-[#0f172a] mb-6 sm:mb-8 tracking-tight font-sans';

    switch (activeTab) {
      case 'profile':
        return (
          <div className="animate-in fade-in duration-500">
            <h2 className={sectionTitleStyle}>Teacher Profile</h2>
            {teacherData ? (
              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,66,118,0.05)] border border-white/20 max-w-3xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8 mb-8 pb-8 border-b border-slate-200 text-center sm:text-left">
                  <div className="h-20 w-20 sm:h-28 sm:w-28 flex-shrink-0 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-[#00335a] to-[#001d33] flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg border-4 border-white">
                    {teacherData.name ? teacherData.name.charAt(0).toUpperCase() : 'T'}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] capitalize mb-2 tracking-tight">{teacherData.name || 'N/A'}</h3>
                    <span className="px-4 py-1.5 bg-[#e0f2fe] text-[#00335a] text-[10px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
                      {teacherData.role || 'Teacher'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                  <div className="group">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2 ml-1">Email Address</p>
                    <div className="text-sm text-[#0f172a] font-bold bg-slate-100/50 p-4 sm:p-5 rounded-2xl break-all">{teacherData.email || 'N/A'}</div>
                  </div>
                  {teacherData.class && (
                    <div className="group">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2 ml-1">Assigned Class</p>
                      <div className="text-sm text-[#0f172a] font-bold bg-slate-100/50 p-4 sm:p-5 rounded-2xl">{teacherData.class}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-6">
                  <div className="h-10 bg-slate-200 rounded-2xl w-1/2"></div>
                  <div className="h-64 bg-slate-100 rounded-[2.5rem] w-full"></div>
                </div>
              </div>
            )}
          </div>
        );
      case 'students':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Student List</h2>
            <TotalStudents />
          </div>
        );
      case 'exams':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Manage Exams</h2>
            <TeacherManageExams />
          </div>
        );
      case 'results':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Student Results</h2>
            <TeacherManageResults />
          </div>
        );
      case 'otp':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Exam OTP</h2>
            <ExamOtpGeneration />
          </div>
        );
      case 'attendance':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Verify Attendance</h2>
            <TeacherAttendance />
          </div>
        );
      case 'payments':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}></h2>
            <TeacherExamPayments />
          </div>
        );
      default:
        return <div>Select an option</div>;
    }
  };

  // Mobile bottom bar shows only the first 5 items to avoid overflow
  const mobileNavItems = NAV_ITEMS.slice(0, 5);

  return (
    <div className="flex min-h-screen bg-[#f1f2f4] font-sans text-[#0f172a] selection:bg-[#004276]/10">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-72 bg-white flex flex-col border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        aria-label="Teacher navigation"
      >
        <div className="p-8 pb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#00335a] rounded-full"></div>
              <h1 className="text-xl font-black text-[#00335a] tracking-tighter uppercase leading-none">ExamiSystem</h1>
            </div>
            <button
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-[#00335a] hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <p className="text-[10px] font-black text-slate-500 mt-2 tracking-[0.3em] uppercase">Faculty Portal</p>
        </div>

        <nav className="flex-1 px-6 space-y-2 overflow-y-auto" aria-label="Sidebar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                activeTab === item.id
                  ? 'bg-[#f1f5f9] text-[#00335a] shadow-sm'
                  : 'text-slate-500 hover:text-[#00335a] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          ))}

          <div className="pt-8">
            <button
              onClick={handleLogout}
              className="w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 flex items-center gap-3 hover:bg-rose-50 border border-transparent hover:border-rose-100"
            >
              <span className="material-symbols-outlined text-xl text-rose-500">logout</span>
              <span className="text-sm font-bold text-rose-600 tracking-tight">Logout</span>
            </button>
          </div>
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-[#00335a] uppercase tracking-widest leading-relaxed">System Integrity Verified</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-[#00335a] rounded-full animate-pulse"></div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Academic Node</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">

        {/* Top Header */}
        <header className="sticky top-0 z-10 flex justify-between items-center bg-white px-4 sm:px-8 lg:px-10 py-4 sm:py-6 border-b border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              className="md:hidden p-2 rounded-xl text-[#00335a] hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <span className="text-[9px] sm:text-[10px] font-black text-[#00335a] uppercase tracking-[0.3em] sm:tracking-[0.4em]">Administrative Console</span>
              <h2 className="text-lg sm:text-2xl font-black text-[#0f172a] capitalize tracking-tight mt-0.5">
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {teacherData && (
              <div className="text-right hidden sm:block border-r border-slate-200 pr-5 sm:pr-6">
                <p className="text-xs font-black text-[#00335a] uppercase tracking-widest">{teacherData.name}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Faculty {teacherData.class || 'Member'}</p>
              </div>
            )}
            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-[#00335a] to-[#001d33] shadow-xl shadow-[#004276]/20 flex items-center justify-center text-white font-black text-base sm:text-xl border-2 sm:border-4 border-white flex-shrink-0">
              {teacherData ? teacherData.name.charAt(0).toUpperCase() : 'T'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderContent()}
        </main>

        {/* Mobile bottom tab bar (first 5 nav items) */}
        <nav
          className="md:hidden sticky bottom-0 z-10 bg-white border-t border-slate-200 flex items-center justify-around px-1 py-2"
          aria-label="Mobile bottom navigation"
        >
          {mobileNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors min-w-[52px] ${
                activeTab === item.id ? 'text-[#00335a]' : 'text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === item.id ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
          {/* "More" opens the full sidebar drawer */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="More options"
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors min-w-[52px] text-slate-400"
          >
            <span className="material-symbols-outlined text-xl">more_horiz</span>
            <span className="text-[9px] font-black uppercase tracking-wider">More</span>
          </button>
        </nav>

      </div>
    </div>
  );
};

export default TeacherDashbord;