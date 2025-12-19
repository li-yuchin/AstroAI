
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { startAstroChat, handleFunctionCall } from '../services/geminiService';

interface ChatBotProps {
  userProfile: UserProfile;
}

const ChatBot: React.FC<ChatBotProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 注入 Profile 初始化 AI
    chatRef.current = startAstroChat(userProfile);

    // AI 主動開場，結合用戶資料
    const greeting = `你好 ${userProfile.name}。根據你提供的生辰資料（${userProfile.birthDate} ${userProfile.birthTime}），我已為你鎖定了當前的星盤能量。今天的星象在你的人生宮位中激發了獨特的振動。有什麼特別困擾你的事情嗎？無論是職場的轉機、感情的流轉，或是尋找內心的寧靜，我都會結合東西方命理為你解析。`;
    
    setMessages([{ role: 'model', text: greeting, timestamp: Date.now() }]);
  }, [userProfile]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: input });
      
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          const result = handleFunctionCall(fc.name, fc.args);
          const finalResponse = await chatRef.current.sendMessage({
            message: `系統回報工具執行結果: ${JSON.stringify(result)}。請繼續根據此結果回答用戶。`
          });
          setMessages(prev => [...prev, { role: 'model', text: finalResponse.text || '', timestamp: Date.now() }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: response.text || '', timestamp: Date.now() }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，星象連結受到干擾，請稍後再試。', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-[#0c001a]/60 border border-indigo-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="p-5 bg-indigo-900/30 border-b border-indigo-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-xs font-bold text-indigo-100 tracking-widest uppercase">Consulting Mode</span>
        </div>
        <span className="text-[10px] text-indigo-300/60 font-medium">ANALYZING: {userProfile.name}'S CHART</span>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-5 rounded-3xl shadow-lg ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-white/5'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap font-light">{msg.text}</p>
              <div className="text-[9px] mt-2 opacity-40 text-right font-bold uppercase tracking-widest">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-800/80 p-5 rounded-3xl rounded-tl-none border border-white/5">
               <div className="flex space-x-2">
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
               </div>
             </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      <div className="p-6 bg-[#160030]/80 border-t border-indigo-500/10">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="描述你的困惑，讓星象指引你..."
            className="w-full bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 pr-14 text-sm focus:outline-none focus:border-indigo-500/50 min-h-[60px] max-h-[150px] resize-none transition-all placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 bottom-3 p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 rounded-xl transition-all shadow-lg active:scale-90"
          >
            <svg className="w-5 h-5 text-white transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
