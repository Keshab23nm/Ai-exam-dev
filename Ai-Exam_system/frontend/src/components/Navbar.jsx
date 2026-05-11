import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = [
    { path: '/', name: 'Home' },
    { path: '#features', name: 'Features' },
    { path: '#about', name: 'About' },
    { path: '#contact', name: 'Contact' },
  ];

  const linkClass = (path) => {
    const isActive = location.pathname === path || (path === '/' && location.pathname === '');
    return isActive
      ? 'text-sky-700 dark:text-sky-400 border-b-2 border-sky-700 dark:border-sky-400 pb-1'
      : 'text-slate-600 dark:text-slate-400 hover:text-sky-900 dark:hover:text-white transition-colors';
  };

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,66,118,0.06)] dark:bg-slate-900/70 transition-all duration-300"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-8 py-4">

        {/* Brand */}
        <Link
          to="/"
          aria-label="ExamiSystem home"
          className="flex flex-col group"
        >
          <span className="text-xl sm:text-2xl font-black text-sky-900 dark:text-sky-100 tracking-tighter group-hover:text-primary transition-colors leading-none">
            ExamiSystem
          </span>
          <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] leading-none mt-1">
            Academic Horizon
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 font-headline font-semibold tracking-tight">
          {nav.map((item, index) =>
            item.path.startsWith('#') ? (
              <a
                key={index}
                href={item.path}
                className="text-slate-600 dark:text-slate-400 hover:text-sky-900 dark:hover:text-white transition-colors"
              >
                {item.name}
              </a>
            ) : (
              <Link key={index} to={item.path} className={linkClass(item.path)}>
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Login
          </Link>
        </div>

        {/* Mobile: hamburger + login */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/20"
          >
            Login
          </Link>
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-sky-900 dark:text-sky-100 hover:bg-sky-100/50 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 px-4 py-4 space-y-1">
          {nav.map((item, index) =>
            item.path.startsWith('#') ? (
              <a
                key={index}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 font-semibold transition-colors"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={index}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold transition-colors ${
                  location.pathname === item.path
                    ? 'bg-sky-50 text-sky-700 dark:bg-slate-800 dark:text-sky-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.name}
              </Link>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;