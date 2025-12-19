
import React, { useState, useRef } from 'react';
import { analyzeFace } from '../services/geminiService';

const FaceAnalysis: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // Extract base64 part
      const base64Data = image.split(',')[1];
      const analysis = await analyzeFace(base64Data);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      setResult('分析失敗，請檢查照片是否清晰。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">智能面相分析</h2>
        <p className="text-sm text-slate-400">上傳清晰正面照，解讀性格優勢與近期運勢。</p>
      </div>

      <div className="bg-slate-900/40 border-2 border-dashed border-indigo-500/30 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[300px] transition-all hover:border-indigo-500/50">
        {!image ? (
          <>
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📸</span>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-full font-bold shadow-lg transition-all"
            >
              選擇照片
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </>
        ) : (
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="relative group">
               <img 
                src={image} 
                alt="Selected" 
                className="max-w-full max-h-[300px] rounded-2xl shadow-2xl border-2 border-indigo-400/50" 
              />
              <button 
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
              >
                ✕
              </button>
            </div>
            
            {!result && (
              <button 
                onClick={startAnalysis}
                disabled={loading}
                className="w-full max-w-xs bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 rounded-xl font-bold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? 'AI 正在分析特徵...' : '開始面相分析'}
              </button>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="bg-[#160030]/60 border border-indigo-500/30 p-6 rounded-3xl shadow-xl space-y-4 animate-in slide-in-from-top-4">
          <h3 className="text-indigo-300 font-bold flex items-center">
            <span className="mr-2">📝</span> 分析結果
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
              {result}
            </p>
          </div>
          <button 
            onClick={() => {
              setImage(null);
              setResult(null);
            }}
            className="w-full py-3 text-slate-400 hover:text-indigo-300 transition-colors text-xs uppercase font-bold tracking-widest"
          >
            重新分析
          </button>
        </div>
      )}

      <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl flex items-start space-x-3">
        <span className="text-amber-500">⚠️</span>
        <p className="text-[10px] text-amber-200/70 leading-relaxed">
          面相分析僅供參考，不應用作醫療診斷或任何正式決策依據。系統不存儲您的照片，分析後將即刻清除緩存。
        </p>
      </div>
    </div>
  );
};

export default FaceAnalysis;
