
import React, { useState, useEffect } from 'react';
import { analyzeNews } from './services/geminiService';
import { AnalysisResult } from './types';
import Header from './components/Header';
import NewsInput from './components/NewsInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import ProtocolGuide from './components/ProtocolGuide';
import { AlertCircle, ShieldCheck, HelpCircle, Lock, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyMissing, setIsKeyMissing] = useState(false);

  useEffect(() => {
    // 检查 API Key 是否存在
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      setIsKeyMissing(true);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeNews(content);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please check your connection or try a shorter text.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setContent('');
    setAnalysis(null);
    setError(null);
  };

  // 如果没有配置 API Key，显示这个特工风格的错误页面
  if (isKeyMissing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/50">
            <Lock className="text-red-500 w-10 h-10" />
            <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-20"></div>
          </div>
          <div className="space-y-4">
            <h1 className="text-white text-2xl font-black italic tracking-tighter uppercase">Missing Intelligence Clearance</h1>
            <p className="text-slate-400 text-sm leading-relaxed font-mono">
              [ERROR: API_KEY_NOT_FOUND]<br />
              System access is currently restricted. Please configure the environment variables in the Vercel Dashboard.
            </p>
          </div>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Deployment Guide</span>
            </div>
            <ol className="text-[11px] text-slate-400 space-y-2 list-decimal list-inside">
              <li>Open Vercel Dashboard</li>
              <li>Settings > Environment Variables</li>
              <li>Add <code className="text-indigo-400 font-bold">API_KEY</code></li>
              <li>Redeploy the project</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-indigo-600 w-5 h-5" />
              Feed the Evidence
            </h2>
            <NewsInput 
              value={content} 
              onChange={setContent} 
              onAnalyze={handleAnalyze}
              loading={loading}
              onReset={reset}
            />
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2 text-sm border border-red-100">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="text-indigo-600 w-5 h-5" />
              The Tri-Lens Protocol
            </h2>
            <ProtocolGuide />
          </section>
        </div>

        <div className="lg:col-span-7">
          {analysis ? (
            <AnalysisDashboard analysis={analysis} />
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-lg font-medium text-slate-600">Awaiting Investigation</h3>
              <p className="max-w-xs mt-2">Paste a news article or claim on the left to begin the Tri-Lens verification process.</p>
            </div>
          )}
        </div>
      </main>

      {!analysis && !loading && content.length > 50 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button 
            onClick={handleAnalyze}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full shadow-xl font-bold hover:bg-indigo-700 transition-all active:scale-95"
          >
            Run Detective Protocol
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
