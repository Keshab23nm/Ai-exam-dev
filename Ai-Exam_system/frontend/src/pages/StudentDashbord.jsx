import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { authApi } from '../api/index';
import ExamList from '../components/exams/ExamList';
import StudentResults from '../components/exams/StudentResults';
import StudentQR from '../components/StudentQR';
import StudentPayment from '../components/exams/StudentPayment';

const NAV_ITEMS = [
  { id: 'profile',    label: 'Profile',    icon: 'person' },
  { id: 'exam',       label: 'Exams',      icon: 'quiz' },
  { id: 'results',    label: 'Results',    icon: 'bar_chart' },
  { id: 'payment',    label: 'Fees',       icon: 'payments' },
  { id: 'attendance', label: 'Attendance', icon: 'qr_code_scanner' },
];

const StudentDashbord = () => {
  const [activeTab, setActiveTab]           = useState('profile');
  const [user, setUser]                     = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [selectedDate, setSelectedDate]     = useState('');
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authApi.getMe();
        setUser(res.data.user || res.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'attendance') {
      const fetchAttendance = async () => {
        try {
          const params = selectedDate ? { date: new Date(selectedDate).toDateString() } : {};
          const res = await authApi.getMyAttendance(params);
          setAttendanceHistory(res.data);
        } catch (error) {
          console.error('Failed to fetch attendance history', error);
        }
      };
      fetchAttendance();
    }
  }, [activeTab, selectedDate]);

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
            <h2 className={sectionTitleStyle}>My Profile</h2>
            {user ? (
              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,66,118,0.05)] border border-white/20 max-w-3xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8 mb-8 pb-8 border-b border-slate-200 text-center sm:text-left">
                  <div className="h-20 w-20 sm:h-28 sm:w-28 flex-shrink-0 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-[#00335a] to-[#001d33] flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-lg border-4 border-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] capitalize mb-2 tracking-tight">{user.name || 'N/A'}</h3>
                    <span className="px-4 py-1.5 bg-[#e0f2fe] text-[#00335a] text-[10px] font-black tracking-[0.2em] uppercase rounded-full shadow-sm">
                      {user.role || 'Student'}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
                  <div className="group">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2 ml-1">Email Address</p>
                    <div className="text-sm text-[#0f172a] font-bold bg-slate-100/50 p-4 sm:p-5 rounded-2xl break-all">{user.email || 'N/A'}</div>
                  </div>
                  <div className="group">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2 ml-1">Class</p>
                    <div className="text-sm text-[#0f172a] font-bold bg-slate-100/50 p-4 sm:p-5 rounded-2xl">{user.class || 'N/A'}</div>
                  </div>
                  <div className="group">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2 ml-1">Account Status</p>
                    <div className="text-sm text-[#0f172a] font-bold bg-slate-100/50 p-4 sm:p-5 rounded-2xl flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${user.isVerified ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                      {user.isVerified ? 'Verified' : 'Pending Verification'}
                    </div>
                  </div>
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
      case 'exam':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Available Exams</h2>
            <ExamList />
          </div>
        );
      case 'results':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Examination Results</h2>
            <StudentResults />
          </div>
        );
      case 'payment':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Fee Payment</h2>
            <StudentPayment />
          </div>
        );
      case 'attendance':
        return (
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className={sectionTitleStyle}>Class Attendance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-black text-[#00335a] uppercase tracking-[0.3em] mb-4 self-start ml-2 text-center w-full">Identification Node</p>
                {user ? (
                  <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,66,118,0.05)] border border-white/20 w-full max-w-[500px]">
                    <StudentQR user={user} />
                  </div>
                ) : (
                  <div className="animate-pulse h-[400px] bg-slate-100 rounded-[2.5rem] w-full max-w-[500px]"></div>
                )}
              </div>
              <div>
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4 ml-2">
                  <p className="text-[10px] font-black text-[#00335a] uppercase tracking-[0.3em]">Attendance History</p>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-[10px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[#00335a] outline-none focus:ring-1 focus:ring-[#00335a]/20 transition-all"
                  />
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,66,118,0.05)] border border-white/20 p-5 sm:p-8 h-fit min-h-[300px] max-w-[500px]">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {attendanceHistory.length > 0 ? (
                      attendanceHistory.map((record, index) => (
                        <div key={record._id || index} className="flex items-center justify-between p-4 sm:p-6 bg-slate-50/50 rounded-2xl border border-transparent hover:border-[#00335a]/10 hover:bg-white hover:shadow-sm transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[#00335a]/5 flex items-center justify-center text-[#00335a] font-black text-sm group-hover:bg-[#00335a] group-hover:text-white transition-colors flex-shrink-0">
                              {attendanceHistory.length - index}
                            </div>
                            <div>
                              <p className="text-sm font-black text-[#0f172a]">{record.date}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verification Successful</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest hidden xs:block">Present</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                          <div className="w-6 h-6 border-2 border-slate-300 rounded-md"></div>
                        </div>
                        <p className="text-sm font-bold">No attendance records found</p>
                        <p className="text-[10px] uppercase tracking-widest mt-1">Visit your instructor to scan</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select an option</div>;
    }
  };

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
        aria-label="Student navigation"
      >
        <div className="p-8 pb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#00335a] rounded-full"></div>
              <h1 className="text-xl font-black text-[#00335a] tracking-tighter uppercase leading-none">ExamiSystem</h1>
            </div>
            {/* Close button - mobile only */}
            <button
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-[#00335a] hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
          <p className="text-[10px] font-black text-slate-500 mt-2 tracking-[0.3em] uppercase">Student Portal</p>
        </div>

        <nav className="flex-1 px-6 space-y-2" aria-label="Sidebar">
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
            {/* Hamburger - mobile only */}
            <button
              className="md:hidden p-2 rounded-xl text-[#00335a] hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={sidebarOpen}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <span className="text-[9px] sm:text-[10px] font-black text-[#00335a] uppercase tracking-[0.3em] sm:tracking-[0.4em]">Student Console</span>
              <h2 className="text-lg sm:text-2xl font-black text-[#0f172a] capitalize tracking-tight mt-0.5">
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {user && (
              <div className="text-right hidden sm:block border-r border-slate-200 pr-5 sm:pr-6">
                <p className="text-xs font-black text-[#00335a] uppercase tracking-widest">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Student Class {user.class || 'N/A'}</p>
              </div>
            )}
            <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-[#00335a] to-[#001d33] shadow-xl shadow-[#004276]/20 flex items-center justify-center text-white font-black text-base sm:text-xl border-2 sm:border-4 border-white flex-shrink-0">
              {user ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderContent()}
        </main>

        {/* Mobile bottom tab bar */}
        <nav
          className="md:hidden sticky bottom-0 z-10 bg-white border-t border-slate-200 flex items-center justify-around px-1 py-2"
          aria-label="Mobile bottom navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              aria-label={item.label}
              aria-current={activeTab === item.id ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors min-w-[56px] ${
                activeTab === item.id ? 'text-[#00335a]' : 'text-slate-400'
              }`}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: activeTab === item.id ? "'FILL' 1" : "'FILL' 0" }}>
                {item.icon}
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-colors min-w-[56px] text-rose-400"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="text-[9px] font-black uppercase tracking-wider">Logout</span>
          </button>
        </nav>

      </div>
    </div>
  );
};

export default StudentDashbord;