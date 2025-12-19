
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const saved = localStorage.getItem('astro_guide_profile');
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  const saveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('astro_guide_profile', JSON.stringify(profile));
    setActiveSection(AppSection.HOME);
  };

  const renderSection = () => {
    if (!userProfile && activeSection !== AppSection.PROFILE) {
      return <ProfileSetup onSave={saveProfile} />;
    }

    switch (activeSection) {
      case AppSection.HOME:
        return <Home onNavigate={setActiveSection} userProfile={userProfile} />;
      case AppSection.DAILY:
        return <DailyHoroscopeView userProfile={userProfile!} />;
      case AppSection.CHAT:
        return <ChatBot userProfile={userProfile!} />;
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
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold border border-indigo-400">
          {userProfile?.name?.charAt(0) || '?'}
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
        {renderSection()}
      </main>

      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
    </div>
  );
};

export default App;
