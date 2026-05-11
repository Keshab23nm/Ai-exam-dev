import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { authApi } from '../api/index';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', class: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.register(formData);
      alert(res.data.message);
      navigate('/verify');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
      setFormData({ name: '', email: '', password: '', class: '' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f1f2f4] px-4 py-8 font-sans">
      <div className="w-full max-w-md">

        {/* Logo / brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-black text-[#00335a] tracking-tighter hover:opacity-80 transition-opacity">
            ExamiSystem
          </Link>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Academic Horizon</p>
        </div>

        <div className="bg-white shadow-[0_20px_60px_rgba(0,51,90,0.08)] rounded-[2rem] p-7 sm:p-10 border border-slate-100">
          <h1 className="text-2xl font-black text-[#0f172a] mb-1 tracking-tight">Create an account</h1>
          <p className="text-sm text-slate-500 mb-8">Join ExamiSystem — it takes less than a minute.</p>

          {error && (
            <div role="alert" className="mb-6 flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl px-4 py-3 text-sm font-medium">
              <span className="material-symbols-outlined text-base mt-0.5 flex-shrink-0">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2" htmlFor="reg-name">
                Full Name
              </label>
              <input
                type="text"
                id="reg-name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#00335a]/20 focus:border-[#00335a] focus:outline-none transition-all text-[#0f172a] font-medium placeholder:text-slate-300 bg-slate-50 focus:bg-white"
                required
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2" htmlFor="reg-email">
                Email Address
              </label>
              <input
                type="email"
                id="reg-email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#00335a]/20 focus:border-[#00335a] focus:outline-none transition-all text-[#0f172a] font-medium placeholder:text-slate-300 bg-slate-50 focus:bg-white"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2" htmlFor="reg-password">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="reg-password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#00335a]/20 focus:border-[#00335a] focus:outline-none transition-all text-[#0f172a] font-medium placeholder:text-slate-300 bg-slate-50 focus:bg-white pr-16"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-black text-slate-400 hover:text-[#00335a] transition-colors px-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Class Dropdown */}
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2" htmlFor="reg-class">
                Select Class
              </label>
              <select
                id="reg-class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#00335a]/20 focus:border-[#00335a] focus:outline-none transition-all text-[#0f172a] font-medium bg-slate-50 focus:bg-white appearance-none"
                required
              >
                <option value="" disabled>Select your class</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00335a] hover:bg-[#004276] active:scale-95 text-white font-black py-3.5 px-4 rounded-2xl transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none shadow-lg shadow-[#00335a]/20"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00335a] font-black hover:underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;