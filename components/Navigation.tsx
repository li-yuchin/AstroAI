
import React from 'react';
import { AppSection } from '../types';

interface NavigationProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate }) => {
  const items = [
    { id: AppSection.HOME, label: '首頁', icon: '✨' },
    { id: AppSection.DAILY, label: '運勢', icon: '📅' },
    { id: AppSection.CHAT, label: '諮詢', icon: '💬' },
    { id: AppSection.VISION, label: '面相', icon: '👁️' },
    { id: AppSection.PROFILE, label: '設定', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#160030]/90 backdrop-blur-lg border-t border-indigo-900/50 flex justify-around p-2 z-50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
            activeSection === item.id 
              ? 'text-indigo-400 scale-110' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-xl mb-1">{item.icon}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
