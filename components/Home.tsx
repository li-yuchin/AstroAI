
import React from 'react';
import { AppSection, UserProfile } from '../types';

interface HomeProps {
  onNavigate: (section: AppSection) => void;
  userProfile: UserProfile | null;
}

const Home: React.FC<HomeProps> = ({ onNavigate, userProfile }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="text-center space-y-4">
        <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
            <h2 className="text-4xl font-bold relative">
              你好, {userProfile?.name || '旅人'}
            </h2>
        </div>
        <p className="text-slate-400">「命運並非不可更改，而是可以被看見的軌跡。」</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate(AppSection.DAILY)}
          className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-6 rounded-2xl text-left hover:border-indigo-400 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">📅</span>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Daily</span>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300">每日運勢</h3>
          <p className="text-sm text-slate-400">解鎖今日能量分布，掌握幸運色彩與方位。</p>
        </button>

        <button 
          onClick={() => onNavigate(AppSection.CHAT)}
          className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 p-6 rounded-2xl text-left hover:border-purple-400 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">💬</span>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Counseling</span>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300">AI 命理諮詢</h3>
          <p className="text-sm text-slate-400">深入探討職場、感情、人生的不確定焦慮。</p>
        </button>

        <button 
          onClick={() => onNavigate(AppSection.VISION)}
          className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/30 p-6 rounded-2xl text-left hover:border-blue-400 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">👁️</span>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Vision</span>
          </div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300">智能面相分析</h3>
          <p className="text-sm text-slate-400">透過照片分析性格特質與近期氣色運勢。</p>
        </button>

        <div className="bg-slate-900/40 border border-slate-700 p-6 rounded-2xl opacity-60">
           <div className="flex justify-between items-start mb-4">
            <span className="text-3xl">📜</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Soon</span>
          </div>
          <h3 className="text-xl font-bold mb-2">年度流年報告</h3>
          <p className="text-sm text-slate-400">2025 年完整大限解析，敬請期待。</p>
        </div>
      </div>

      <section className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-6">
        <h4 className="font-bold text-indigo-300 mb-2 italic">「造命建議」</h4>
        <p className="text-sm italic text-slate-300">
          "當你感覺到阻礙時，那往往是靈魂正在累積轉向的能量。今日建議靜心冥想五分鐘。"
        </p>
      </section>
    </div>
  );
};

export default Home;
