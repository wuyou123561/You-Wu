
import React, { useState, useEffect } from 'react';
import { analyzeNews } from './services/geminiService';
import { AnalysisResult } from './types';
import Header from './components/Header';
import NewsInput from './components/NewsInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import ProtocolGuide from './components/ProtocolGuide';
import { AlertCircle, ShieldCheck, HelpCircle, Lock, Terminal, Key, ArrowRight, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyMissing, setIsKeyMissing] = useState(false);

  const checkKeyStatus = async () => {
    const envKey = process.env.API_KEY;
    const hasEnvKey = envKey && envKey !== '' && envKey !== 'undefined';
    const hasSelected = window.aistudio && await window.aistudio.hasSelectedApiKey();
    
    if (!hasEnvKey && !hasSelected) {
      setIsKeyMissing(true);
    } else {
      setIsKeyMissing(false);
    }
  };

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        setIsKeyMissing(false);
        setError(null);
      } catch (err) {
        console.error("Key selection failed:", err);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeNews(content);
      setAnalysis(result);
    } catch (err: any) {
      const msg = err.message || '';
      setError(msg);
      // Automatically show lock screen if it's a hard auth error
      if (msg.includes('AUTH_ERROR') || msg.includes('API Key missing')) {
        setIsKeyMissing(true);
      }
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

  if (isKeyMissing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-500 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="relative mx-auto w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/50 rotate-3">
            <Lock className="text-indigo-500 w-10 h-10 -rotate-3" />
            <div className="absolute inset-0 rounded-3xl border border-indigo-500 animate-ping opacity-20"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-white text-3xl font-black italic tracking-tighter uppercase">Clearance Required</h1>
            <p className="text-slate-400 text-sm leading-relaxed font-mono">
              [SYSTEM_STATUS: OFFLINE]<br />
              Detective, your terminal is not connected to the Gemini Grid. 
              Please click the button below to authorize.
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleSelectKey}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/40 active:scale-95 group border-b-4 border-indigo-800"
            >
              <Key className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              Connect to Truth Server
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Select your project in the popup to authorize this session
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 text-left shadow-inner">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operator Note</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed italic mb-4">
              "Truth has no paywall, but the API requires a project. 
              Ensure you choose the one you created in Google Cloud Console."
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <Header onTriggerAuth={handleSelectKey} />
      
      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-indigo-600 w-5 h-5" />
              Evidence Feed
            </h2>
            <NewsInput 
              value={content} 
              onChange={setContent} 
              onAnalyze={handleAnalyze}
              loading={loading}
              onReset={reset}
            />
            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 animate-in shake">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-bold">{error}</p>
                    <button 
                      onClick={handleSelectKey}
                      className="text-[10px] font-black uppercase tracking-widest bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <RefreshCw size={10} /> Switch Key / Reconnect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="text-indigo-600 w-5 h-5" />
              Tri-Lens Protocol
            </h2>
            <ProtocolGuide />
          </section>
        </div>

        <div className="lg:col-span-7">
          {analysis ? (
            <AnalysisDashboard analysis={analysis} />
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 p-12 text-center shadow-inner group">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-12 h-12 opacity-20 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-600 italic tracking-tight">Detective Terminal Ready</h3>
              <p className="max-w-xs mt-3 text-sm leading-relaxed text-slate-400">
                Paste a news claim on the left to activate the investigation suite.
              </p>
            </div>
          )}
        </div>
      </main>

      {!analysis && !loading && content.length > 50 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button 
            onClick={handleAnalyze}
            className="bg-indigo-600 text-white px-10 py-4 rounded-full shadow-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all active:scale-95 border-4 border-indigo-500/20"
          >
            Launch Investigation
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
