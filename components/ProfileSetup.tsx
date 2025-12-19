
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileSetupProps {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSave, initialProfile }) => {
  // 初始值設為完全空白，不帶預設城市
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.birthDate && profile.birthTime && profile.birthPlace) {
      setIsSaving(true);
      // 模擬編織命盤的過程，增加儀式感
      setTimeout(() => {
        onSave(profile);
        setIsSaving(false);
      }, 1000);
    } else {
      alert('請填寫完整的出生資訊，這對準確性至關重要。');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-10 animate-in fade-in duration-700 py-6">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-white tracking-tight">命理資料設定</h2>
        <p className="text-indigo-300/60 text-sm font-light">
          請提供精確的生辰資訊，AstroGuide 將以此為您校準星圖。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#160030]/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
        {isSaving && (
          <div className="absolute inset-0 z-20 bg-[#0c001a]/80 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
             <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-indigo-300 text-xs font-bold tracking-widest uppercase animate-pulse">正在編織個人命盤...</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] ml-1">您的稱呼</label>
          <input 
            type="text" 
            required
            value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 focus:border-indigo-500 focus:bg-slate-900 outline-none transition-all text-white placeholder:text-slate-700"
            placeholder="請輸入姓名或暱稱"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] ml-1">出生日期</label>
            <input 
              type="date" 
              required
              value={profile.birthDate}
              onChange={e => setProfile({...profile, birthDate: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 focus:border-indigo-500 outline-none transition-all text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] ml-1">出生時間</label>
            <input 
              type="time" 
              required
              value={profile.birthTime}
              onChange={e => setProfile({...profile, birthTime: e.target.value})}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 focus:border-indigo-500 outline-none transition-all text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] ml-1">出生地點</label>
          <input 
            type="text" 
            required
            value={profile.birthPlace}
            onChange={e => setProfile({...profile, birthPlace: e.target.value})}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
            placeholder="例如：台北市、高雄市..."
          />
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 py-5 rounded-2xl font-bold text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0.5 transition-all text-sm uppercase tracking-widest mt-4"
        >
          {isSaving ? '同步中' : '儲存資料並開啟解析'}
        </button>
      </form>

      <div className="bg-indigo-900/10 border border-indigo-500/10 p-5 rounded-2xl text-center">
        <p className="text-[10px] text-slate-500 leading-relaxed tracking-wider">
          「所有的過去都已寫在群星之中，所有的未來都握在你的手裡。」<br/>
          <span className="opacity-40 mt-2 block italic">— AstroGuide Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default ProfileSetup;
