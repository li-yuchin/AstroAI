
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileSetupProps {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSave, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '台北'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.birthDate) {
      onSave(profile);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">命理資料設定</h2>
        <p className="text-slate-400 text-sm">為了精準分析您的運勢，請提供準確的出生資訊。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-8 rounded-3xl border border-slate-700 shadow-xl">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">您的稱呼</label>
          <input 
            type="text" 
            required
            value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
            placeholder="例如：小明"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">出生日期</label>
          <input 
            type="date" 
            required
            value={profile.birthDate}
            onChange={e => setProfile({...profile, birthDate: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">出生時間</label>
          <input 
            type="time" 
            required
            value={profile.birthTime}
            onChange={e => setProfile({...profile, birthTime: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">出生地點</label>
          <input 
            type="text" 
            required
            value={profile.birthPlace}
            onChange={e => setProfile({...profile, birthPlace: e.target.value})}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 focus:border-indigo-500 outline-none transition-all"
            placeholder="例如：台北市"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          儲存並開始探索
        </button>
      </form>

      <p className="text-[10px] text-center text-slate-500 uppercase leading-relaxed">
        您的個人資料將僅儲存在瀏覽器本地，不會被上傳至雲端數據庫。<br/>
        我們尊重您的隱私。
      </p>
    </div>
  );
};

export default ProfileSetup;
