import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authApi } from '../api';

const Verify = () => {
  const [formData, setFormData] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.verify(formData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check your OTP and try again.');
    } finally {
      setLoading(false);
      setFormData({ email: '', otp: '' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 pt-24 pb-8 font-sans overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="w-full max-w-[400px] relative z-10">
        <div className="bg-white/90 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,51,90,0.1)] rounded-[2rem] p-6 sm:p-10 border border-white/50">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-[#00335a] flex items-center justify-center shadow-lg shadow-blue-200 rotate-3">
                <span className="material-symbols-outlined text-white text-3xl -rotate-3">shield_lock</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-[10px] font-bold">check</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-[#0f172a] mb-2 tracking-tight">Identity Verification</h1>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[240px] mx-auto">
              We've sent a 6-digit security code to your email address.
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-6 flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl px-4 py-3 text-xs font-semibold">
              <span className="material-symbols-outlined text-lg">error_outline</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1" htmlFor="verify-email">
                <span className="material-symbols-outlined text-sm">mail</span>
                Email Address
              </label>
              <input
                type="email"
                id="verify-email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-[#00335a] focus:outline-none transition-all text-[#0f172a] text-sm font-semibold placeholder:text-slate-300 bg-slate-50/50"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1" htmlFor="verify-otp">
                <span className="material-symbols-outlined text-sm">password</span>
                Verification Code
              </label>
              <input
                type="text"
                id="verify-otp"
                name="otp"
                placeholder="0 0 0 0 0 0"
                maxLength="6"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-5 py-5 text-center tracking-[1em] text-2xl font-black border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-[#00335a] focus:outline-none transition-all bg-slate-50/50 focus:bg-white text-[#00335a] placeholder:text-slate-200"
                required
                autoComplete="one-time-code"
              />
              <p className="text-[10px] text-slate-400 font-medium text-center italic">
                Didn't receive the code? Check your <span className="text-[#00335a] font-bold">Spam folder</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-[#00335a] hover:bg-[#002848] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-blue-900/10 active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="tracking-wide text-sm">Verifying...</span>
                </div>
              ) : (
                <>
                  <span className="tracking-wide text-base text-white">Verify Account</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-xs">
              Already verified?{' '}
              <Link to="/login" className="text-[#00335a] font-bold hover:text-blue-700 transition-colors inline-flex items-center gap-1 group">
                Sign in
                <span className="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">login</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;