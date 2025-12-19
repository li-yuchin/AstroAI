
import React, { useState, useEffect } from 'react';
import { UserProfile, DailyHoroscope } from '../types';
import { generateDailyHoroscope } from '../services/geminiService';

interface DailyHoroscopeViewProps {
  userProfile: UserProfile;
}

const DailyHoroscopeView: React.FC<DailyHoroscopeViewProps> = ({ userProfile }) => {
  const [loading, setLoading] = useState(true);
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        setLoading(true);
        // 直接傳遞完整的 profile 以獲得更好的 AI 解析
        const data = await generateDailyHoroscope(userProfile);
        setHoroscope(data);
        setError(null);
      } catch (err) {
        setError('星象連結失敗，請檢查網路後重新嘗試。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHoroscope();
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-indigo-300 font-medium animate-pulse">正在為 {userProfile.name} 觀測星象...</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Calculating Natal Alignments</p>
        </div>
      </div>
    );
  }

  if (error || !horoscope) {
    return (
      <div className="p-10 bg-red-900/10 border border-red-500/20 rounded-3xl text-center space-y-4">
        <p className="text-red-400 font-medium">{error || '無法獲取運勢數據'}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full text-xs transition-all"
        >
          重新嘗試
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-gradient-to-br from-indigo-900/60 via-[#160030]/80 to-purple-900/40 p-8 rounded-[2rem] border border-indigo-500/30 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <h2 className="text-indigo-300 font-bold tracking-[0.2em] text-xs uppercase mb-4">今日運勢能量指數</h2>
        <div className="text-8xl font-black bg-gradient-to-b from-white to-indigo-400 bg-clip-text text-transparent mb-6 drop-shadow-sm">
          {horoscope.overall_score}
        </div>
        <p className="text-xl text-indigo-100 font-light leading-relaxed max-w-lg mx-auto italic opacity-90">
          「{horoscope.summary}」
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 flex flex-col items-center justify-center backdrop-blur-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-1">Lucky Color</span>
          <span className="text-lg font-bold text-indigo-300">{horoscope.lucky_color}</span>
        </div>
        <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 flex flex-col items-center justify-center backdrop-blur-sm">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mb-1">Lucky Direction</span>
          <span className="text-lg font-bold text-purple-300">{horoscope.lucky_direction}</span>
        </div>
      </div>

      <div className="bg-[#1a1033] p-8 rounded-[2rem] border border-indigo-500/20 shadow-xl">
        <h3 className="font-bold text-lg text-indigo-200 mb-6 flex items-center">
          <span className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mr-3 text-sm">💡</span>
          專屬造命指引
        </h3>
        <ul className="space-y-4">
          {horoscope.action_items.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-4 group">
              <span className="w-6 h-6 bg-slate-800 text-indigo-400 border border-indigo-500/30 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-1 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                {idx + 1}
              </span>
              <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">
          Astrological Forecast for {userProfile.name} • {horoscope.date}
        </p>
      </div>
    </div>
  );
};

export default DailyHoroscopeView;
