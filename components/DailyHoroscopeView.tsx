
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
        const info = `${userProfile.birthDate} ${userProfile.birthTime} ${userProfile.birthPlace}`;
        const data = await generateDailyHoroscope(info);
        setHoroscope(data);
      } catch (err) {
        setError('無法生成今日運勢，請稍後再試。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHoroscope();
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-400 animate-pulse font-medium">正在觀測星象...</p>
      </div>
    );
  }

  if (error || !horoscope) {
    return (
      <div className="p-8 bg-red-900/20 border border-red-500/30 rounded-2xl text-center">
        <p className="text-red-400">{error || '運勢數據遺失'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-b from-indigo-900/60 to-transparent p-8 rounded-3xl border border-indigo-500/20 shadow-2xl text-center">
        <h2 className="text-indigo-300 font-bold tracking-widest uppercase mb-2">今日運勢得分</h2>
        <div className="text-7xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
          {horoscope.overall_score}
        </div>
        <p className="text-lg text-slate-300 leading-relaxed max-w-lg mx-auto italic">
          「{horoscope.summary}」
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 flex flex-col items-center">
          <span className="text-xs text-slate-400 uppercase mb-1">幸運色</span>
          <span className="text-lg font-bold text-indigo-300">{horoscope.lucky_color}</span>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 flex flex-col items-center">
          <span className="text-xs text-slate-400 uppercase mb-1">幸運方位</span>
          <span className="text-lg font-bold text-purple-300">{horoscope.lucky_direction}</span>
        </div>
      </div>

      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center">
          <span className="mr-2">💡</span> 造命指引
        </h3>
        <ul className="space-y-3">
          {horoscope.action_items.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-3 text-slate-300">
              <span className="w-5 h-5 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center text-[10px] text-slate-500 uppercase tracking-widest">
        GENERATED AT {horoscope.date}
      </div>
    </div>
  );
};

export default DailyHoroscopeView;
