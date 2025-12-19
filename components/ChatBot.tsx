
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { startAstroChat, handleFunctionCall } from '../services/geminiService';
import { SYSTEM_INSTRUCTION } from '../constants';

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
    // Initial greeting
    const greeting = `你好, ${userProfile.name}。我是 AstroGuide。我看見你的星盤中顯示你是一個具備獨特特質的靈魂。今天有什麼困惑或想要探索的事嗎？無論是職場的波動、感情的微光，還是人生的選擇，我都願意與你一同解析。`;
    setMessages([{ role: 'model', text: greeting, timestamp: Date.now() }]);
    
    // Initialize Gemini Chat
    chatRef.current = startAstroChat(SYSTEM_INSTRUCTION);
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
      
      // Handle Function Calling if any
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          const result = handleFunctionCall(fc.name, fc.args);
          // Send back function result to model
          const finalResponse = await chatRef.current.sendMessage({
            message: JSON.stringify({ functionResult: result })
          });
          setMessages(prev => [...prev, { role: 'model', text: finalResponse.text || '', timestamp: Date.now() }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: response.text || '', timestamp: Date.now() }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: '抱歉，星象連結似乎有些不穩定，請稍後再試。', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] bg-[#160030]/40 border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl">
      <div className="p-4 bg-indigo-900/40 border-b border-indigo-500/20 flex items-center space-x-3">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-bold text-indigo-200">AstroGuide 在線諮詢中</span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <div className="text-[10px] mt-1 opacity-50 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-slate-700">
               <div className="flex space-x-1">
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
               </div>
             </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      <div className="p-4 bg-indigo-900/20 border-t border-indigo-500/20">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="請輸入你的困惑..."
            className="w-full bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:border-indigo-400 min-h-[60px] max-h-[120px] resize-none"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-3 bottom-3 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-white transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center">
          諮詢師建議僅供參考，決策權始終在於你。
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
