import React, { useState, useEffect } from 'react';
import { teacherApi, aiApi } from '../../api/index';

const TeacherManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [expandedExamId, setExpandedExamId] = useState(null);
  // console.log(prompt);
  const toggleExamExpand = (id) => {
    if (expandedExamId === id) {
      setExpandedExamId(null);
    } else {
      setExpandedExamId(id);
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await teacherApi.getExams();
      setExams(Array.isArray(res.data) ? res.data : res.data.exams || []);
    } catch (err) {
      console.error('Failed to fetch exams', err);
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleCreateFromPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setCreating(true);
      setError(null);
      await aiApi.createFromPrompt({ prompt });
      setPrompt('');
      fetchExams(); // Refresh the list
    } catch (err) {
      console.error('Failed to create exam', err);
      setError('Failed to create exam from prompt');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Left Side: Exam List */}
      <div className="flex-1 min-w-0">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[#191c1d] tracking-tight">Active Curriculum</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Authenticated Academic Modules</p>
        </div>
        
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-sm font-bold mb-8 animate-bounce">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-[2rem] border border-slate-50 animate-pulse"></div>
            ))}
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
            <span className="text-5xl mb-4 block opacity-20">📜</span>
            <p className="text-slate-400 font-medium italic">Repository currently empty of examination modules.</p>
          </div>
        ) : (
          <div className="space-y-6 sm:max-h-[800px] sm:overflow-y-auto sm:pr-4 custom-scrollbar">
            {exams.map((exam, index) => {
              const eId = exam._id || index;
              const isExpanded = expandedExamId === eId;
              
              return (
              <div key={eId} className={`group bg-white rounded-[2.25rem] transition-all duration-500 border ${isExpanded ? 'border-[#004276]/20 shadow-[0_30px_60px_rgba(0,66,118,0.12)]' : 'border-slate-50 hover:border-[#004276]/10 hover:shadow-[0_20px_40px_rgba(0,66,118,0.05)]'} overflow-hidden`}>
                <div 
                  className="cursor-pointer p-8 flex justify-between items-center bg-white"
                  onClick={() => toggleExamExpand(eId)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[9px] font-black bg-[#e0f2fe] text-[#004276] px-3 py-1 rounded-full uppercase tracking-widest">{exam.class || 'Global'}</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">UID: {eId.toString().slice(-6)}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#191c1d] tracking-tight group-hover:text-[#004276] transition-colors">{exam.title || 'Untitled Academic Module'}</h3>
                    <p className="text-slate-400 text-xs font-medium mt-1 line-clamp-1">{exam.description || 'No descriptive metadata provided'}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-[#004276] text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-[#004276]/10 group-hover:text-[#004276]'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                
                {/* Questions Preview - Glassmorphism Inner Content */}
                {isExpanded && (
                <div className="px-8 pb-8 pt-2 bg-gradient-to-b from-white to-[#f8f9fa] animate-in slide-in-from-top-4 duration-500">
                  <div className="h-px bg-slate-100 mb-6"></div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-black text-[#191c1d] text-xs uppercase tracking-[0.2em]">Question Repository ({exam.questions?.length || 0})</h4>
                    <button className="text-[10px] font-bold text-[#004276] hover:underline uppercase tracking-widest">Full Editor</button>
                  </div>
                  <ul className="space-y-6">
                    {exam.questions?.map((q, qIndex) => (
                      <li key={q._id || qIndex} className="bg-white/60 p-6 rounded-[1.5rem] border border-white/80 shadow-sm group/q hover:shadow-md transition-all">
                        <div className="flex gap-4">
                          <span className="text-xs font-black text-[#004276]/30 group-hover/q:text-[#004276] transition-colors">{String(qIndex + 1).padStart(2, '0')}.</span>
                          <span className="font-bold text-[#31444c] text-sm leading-relaxed">{q.question}</span>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 ml-8">
                          {q.options?.map((opt, oIndex) => (
                            <div key={oIndex} className="bg-[#f1f5f9]/50 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 border border-transparent hover:bg-white hover:border-[#004276]/10 transition-all flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-[9px] text-[#004276] shadow-sm">{String.fromCharCode(65 + oIndex)}</span>
                              {opt}
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>

      {/* Right Side: AI Exam Creator */}
      <div className="w-full lg:w-[420px]">
        <div className="bg-gradient-to-br from-[#004276] to-[#002a4b] p-1 rounded-[2rem] sm:rounded-[3rem] shadow-[0_40px_80px_rgba(0,66,118,0.25)] overflow-hidden group lg:sticky lg:top-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-1000"></div>
          
          <div className="bg-[#00355e]/40 backdrop-blur-2xl p-10 rounded-[2.8rem] relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl shadow-inner">✨</div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">AI Neural Generator</h2>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em] mt-1">Linguistic Exam Synthesis</p>
              </div>
            </div>
            
            <p className="text-sm text-[#e0f2fe]/80 leading-relaxed font-medium mb-8">
              Describe your scholarly objectives, and our neural engine will synthesize a structured evaluation module.
            </p>
            
            <form onSubmit={handleCreateFromPrompt} className="space-y-6">
              <div className="relative group/field">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Synthesize a 10-point evaluation on Quantum Mechanics and Planck's Constant..."
                  className="w-full h-48 p-6 bg-[#002a4b]/40 backdrop-blur-sm text-white placeholder-white/20 rounded-[2rem] border border-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-[#002a4b]/60 transition-all resize-none font-medium text-sm leading-relaxed"
                  disabled={creating}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={creating || !prompt.trim()}
                className={`w-full h-16 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-xl ${
                  creating 
                    ? 'bg-white/10 text-white/40 cursor-not-allowed' 
                    : 'bg-white text-[#004276] hover:bg-[#e0f2fe] hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95'
                }`}
              >
                {creating ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                    Synthesizing...
                  </>
                ) : (
                  'Commence Synthesis'
                )}
              </button>
            </form>
            
            <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Automatic Bloom's Taxonomy Alignment</p>
              </div>
              <div className="flex items-center gap-3 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Randomized Distractor Generation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherManageExams;
