import React from 'react';
import { Link } from 'react-router';
import heroBg from '../assets/pages2.jpg';

const Home = () => {
  return (
    <div className="font-body bg-surface text-on-surface selection:bg-primary/20">

      {/* Hero Section */}
      <header className="relative min-h-[600px] sm:min-h-[750px] lg:min-h-[900px] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt="Panoramic view of a modern glass-walled university library interior"
            src={heroBg}
          />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-primary/10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full py-16 sm:py-20">
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-label tracking-widest uppercase text-xs font-bold">
              The Academic Horizon
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-headline font-black text-white leading-[1.1] tracking-tighter">
              Smart Online <br />
              <span className="text-primary-fixed-dim">Examination System</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-xl font-medium leading-relaxed">
              Secure, Fast, and Reliable Exam Platform for the Modern Academic Landscape. Streamlining integrity and accessibility for global education.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 sm:pt-4">
              <Link
                to="/login"
                className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-primary font-bold text-base sm:text-lg rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 sm:px-12 py-4 sm:py-5 bg-white/10 backdrop-blur-md text-white font-bold text-base sm:text-lg rounded-lg border border-white/30 hover:bg-white/20 transition-all"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Floating Hero Card — visible md and up */}
          <div className="lg:col-span-5 hidden md:block">
            <div className="bg-white/10 backdrop-blur-2xl p-6 sm:p-8 rounded-xl border border-white/20 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider">Live Monitoring</p>
                    <p className="text-white font-bold text-sm sm:text-base">Real-time Analytics</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-bold">Active</span>
              </div>
              <div className="space-y-4">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary-fixed"></div>
                </div>
                <div className="flex justify-between text-white/80 text-sm font-label">
                  <span>Integrity Score</span>
                  <span>98.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section: The Bento Grid */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-20 space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-primary tracking-tight">
              Academic Infrastructure
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl font-body">
              A unified ecosystem designed for focus and intellectual integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8">

            {/* Secure Exam Portal Card */}
            <div className="md:col-span-8 bg-surface-container-lowest p-6 sm:p-10 rounded-xl shadow-sm border border-outline-variant/15 flex flex-col justify-between min-h-[320px] sm:min-h-[400px] hover:shadow-xl hover:shadow-primary/5 transition-all group">
              <div className="space-y-4 sm:space-y-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-fixed-dim/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-sky-900">Secure Exam Portal</h3>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-body">
                  Multi-layered security protocols including OTP-gated access and biometric verification. Automatic result generation ensures immediate feedback without administrative delay.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-6 sm:pt-8">
                <span className="px-3 sm:px-4 py-2 bg-surface-container-low rounded-lg text-xs font-bold text-sky-800 tracking-wide uppercase font-label">OTP Protection</span>
                <span className="px-3 sm:px-4 py-2 bg-surface-container-low rounded-lg text-xs font-bold text-sky-800 tracking-wide uppercase font-label">AI Monitoring</span>
              </div>
            </div>

            {/* Mini Insight Card */}
            <div className="md:col-span-4 bg-primary text-white p-6 sm:p-10 rounded-xl flex flex-col justify-center items-center text-center space-y-4 sm:space-y-6">
              <span className="material-symbols-outlined text-5xl sm:text-6xl opacity-50">verified_user</span>
              <h3 className="text-xl sm:text-2xl font-headline font-bold">100% Integrity</h3>
              <p className="opacity-80 font-body text-sm sm:text-base">Our proprietary anti-cheat engine monitors focus patterns and tab switching in real-time.</p>
            </div>

            {/* Teacher Dashboard */}
            <div className="md:col-span-6 bg-surface-container-low p-6 sm:p-10 rounded-xl space-y-6 sm:space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-headline font-bold text-sky-900">Teacher Dashboard</h3>
                <span className="material-symbols-outlined text-sky-700">dashboard_customize</span>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-lg text-center space-y-2 sm:space-y-3 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">add_circle</span>
                  <p className="text-[10px] sm:text-xs font-label font-bold text-slate-500 uppercase tracking-tighter">Exam Creation</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg text-center space-y-2 sm:space-y-3 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">monitoring</span>
                  <p className="text-[10px] sm:text-xs font-label font-bold text-slate-500 uppercase tracking-tighter">Monitoring</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg text-center space-y-2 sm:space-y-3 shadow-sm">
                  <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">qr_code_2</span>
                  <p className="text-[10px] sm:text-xs font-label font-bold text-slate-500 uppercase tracking-tighter">QR Attendance</p>
                </div>
              </div>
              <p className="text-slate-600 font-body text-sm sm:text-base">Empowering faculty with intuitive tools for mass examination management and instantaneous student tracking.</p>
            </div>

            {/* Student Dashboard */}
            <div className="md:col-span-6 bg-surface-container-highest p-6 sm:p-10 rounded-xl flex flex-col justify-between border border-primary/5">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-headline font-bold text-sky-900">Student Dashboard</h3>
                <div className="space-y-3 sm:space-y-4 font-body">
                  <div className="flex items-center gap-3 sm:gap-4 bg-white/50 p-3 sm:p-4 rounded-lg">
                    <span className="material-symbols-outlined text-orange-500 flex-shrink-0">pending_actions</span>
                    <span className="font-medium text-sm sm:text-base">Pending Exams  Notifications</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 bg-white/50 p-3 sm:p-4 rounded-lg">
                    <span className="material-symbols-outlined text-sky-500 flex-shrink-0">payments</span>
                    <span className="font-medium text-sm sm:text-base">Secure Payment Gateways</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 bg-white/50 p-3 sm:p-4 rounded-lg">
                    <span className="material-symbols-outlined text-green-500 flex-shrink-0">trending_up</span>
                    <span className="font-medium text-sm sm:text-base">Performance Tracking & Analytics</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-8">
                <button className="text-primary font-bold inline-flex items-center gap-2 group font-label text-sm sm:text-base">
                  Explore Student Portal
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Content Split Section */}
      <section id="about" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-sm">
          <div className="p-8 sm:p-12 lg:p-16 space-y-6 sm:space-y-8 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-headline font-black text-sky-900">
              Designed for the Next Century of Learning
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-body">
              ExamiSystem isn't just a Proctoring tool. It's a comprehensive academic gateway. From digital identity management to global result distribution, we ensure the scholarship remains pure and the experience remains seamless.
            </p>
            <ul className="space-y-3 sm:space-y-4 font-body">
              <li className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">check_circle</span>
                Cloud-Native Architecture
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">check_circle</span>
                99.9% Platform Uptime
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">check_circle</span>
                Global CDN for High-Speed Delivery
              </li>
            </ul>
          </div>
          <div className="relative min-h-[280px] sm:min-h-[400px]">
            <img
              className="absolute inset-0 w-full h-full object-cover"
              alt="Close-up of a student working on a laptop"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7hukxHdSbx5BAyAaLlqJrBwS5HXTpseMqDeZUI6snt-AONwqYN-TxrmCjT6hx3dcenN0zAbp4UWg9gxrEbt1panfP0IQICg6eDgsBMLmTgaEQLUcdQXPdXIcoW-APXsIlm2CriaiTbkeuo-Ia2cN2M6XeZbi5U7aJcBgzqiF03qiuYz5nQmcDADdd3UBzVwS91sWosGv5HcMpLG_2U9f9D8y9y9AUUX5y6VFYHJr3AawpYXq77BCZHQ7PzsAwv6i7hppHwCGB_rA"
            />
            <div className="absolute inset-0 bg-primary/10"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="w-full border-t border-slate-200/15 dark:border-slate-800/15 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 lg:px-12 py-8 sm:py-10 max-w-7xl mx-auto font-label text-sm tracking-wide gap-6 sm:gap-0">
          <div className="space-y-2 text-center sm:text-left">
            <div className="font-headline font-bold text-sky-800 dark:text-sky-200 text-xl">ExamiSystem</div>
            <p className="text-slate-500 dark:text-slate-400">© 2024 ExamiSystem. The Academic Horizon.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8 text-slate-500 dark:text-slate-400">
            <a className="hover:text-sky-600 dark:hover:text-sky-300 underline underline-offset-4 transition-opacity opacity-80 hover:opacity-100" href="#">Academic Integrity</a>
            <a className="hover:text-sky-600 dark:hover:text-sky-300 underline underline-offset-4 transition-opacity opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="hover:text-sky-600 dark:hover:text-sky-300 underline underline-offset-4 transition-opacity opacity-80 hover:opacity-100" href="#">Faculty Portal</a>
            <a className="hover:text-sky-600 dark:hover:text-sky-300 underline underline-offset-4 transition-opacity opacity-80 hover:opacity-100" href="#">Student Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;