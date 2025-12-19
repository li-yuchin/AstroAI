
import React, { useState, useEffect, useCallback } from 'react';
import { AppSection, UserProfile } from './types';
import Navigation from './components/Navigation';
import Home from './components/Home';
import DailyHoroscopeView from './components/DailyHoroscopeView';
import ChatBot from './components/ChatBot';
import FaceAnalysis from './components/FaceAnalysis';
import ProfileSetup from './components/ProfileSetup';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.HOME);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 初始化讀取
  useEffect(() => {
    const saved = localStorage.getItem('astro_guide_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setUserProfile(parsed);
        }
      } catch (e) {
        console.error("Failed to parse saved profile", e);
      }
    }
  }, []);

  // 儲存邏輯：確保狀態更新與持久化同步
  const saveProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('astro_guide_profile', JSON.stringify(profile));
    setActiveSection(AppSection.HOME);
  }, []);

  const renderSection = () => {
    // 強制流程：若無資料則必須先設定（除非主動切換到設定頁面）
    if (!userProfile && activeSection !== AppSection.PROFILE) {
      return <ProfileSetup onSave={saveProfile} />;
    }

    switch (activeSection) {
      case AppSection.HOME:
        return <Home onNavigate={setActiveSection} userProfile={userProfile} />;
      case AppSection.DAILY:
        // 此時 userProfile 必不為 null (受上方 if 保護)
        return <DailyHoroscopeView key={JSON.stringify(userProfile)} userProfile={userProfile!} />;
      case AppSection.CHAT:
        return <ChatBot key={JSON.stringify(userProfile)} userProfile={userProfile!} />;
      case AppSection.VISION:
        return <FaceAnalysis />;
      case AppSection.PROFILE:
        return <ProfileSetup onSave={saveProfile} initialProfile={userProfile || undefined} />;
      default:
        return <Home onNavigate={setActiveSection} userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0c001a] text-slate-200 flex flex-col pb-20">
      <header className="p-4 border-b border-indigo-900/50 flex justify-between items-center sticky top-0 bg-[#0c001a]/80 backdrop-blur-md z-50">
        <h1 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent cursor-pointer"
            onClick={() => setActiveSection(AppSection.HOME)}
        >
          AstroGuide AI
        </h1>
        <button 
          onClick={() => setActiveSection(AppSection.PROFILE)}
          className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-xs font-bold border border-indigo-400/50 hover:bg-indigo-600/50 transition-all"
        >
          {userProfile?.name?.charAt(0) || '?'}
        </button>
      </header>

      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
        {renderSection()}
      </main>

      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
    </div>
  );
};

export default App;
