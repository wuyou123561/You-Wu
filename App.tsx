
import React, { useState, useEffect } from 'react';
import { analyzeNews } from './services/geminiService';
import { AnalysisResult } from './types';
import Header from './components/Header';
import NewsInput from './components/NewsInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import ProtocolGuide from './components/ProtocolGuide';
import { AlertCircle, ShieldCheck, HelpCircle, Lock, Terminal, Key } from 'lucide-react';

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyMissing, setIsKeyMissing] = useState(false);

  // Check for API Key using both env and window.aistudio
  useEffect(() => {
    const checkKey = async () => {
      const envKey = process.env.API_KEY;
      const hasSelected = window.aistudio && await window.aistudio.hasSelectedApiKey();
      
      if (!envKey && !hasSelected) {
        setIsKeyMissing(true);
      } else {
        setIsKeyMissing(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // As per guidelines: assume success and proceed
      setIsKeyMissing(false);
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
      if (err.message?.includes('entity was not found') || err.message?.includes('403')) {
        setIsKeyMissing(true);
        setError("Your API key might be invalid or not linked to a paid project. Please re-select.");
      } else {
        setError(err.message || 'Analysis failed. Please check your connection or try a shorter text.');
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center border border-indigo-500/50">
            <Lock className="text-indigo-500 w-10 h-10" />
            <div className="absolute inset-0 rounded-full border border-indigo-500 animate-ping opacity-20"></div>
          </div>
          <div className="space-y-4">
            <h1 className="text-white text-2xl font-black italic tracking-tighter uppercase">Clearance Required</h1>
            <p className="text-slate-400 text-sm leading-relaxed font-mono">
              [SYSTEM ERROR: TRUTH_ENGINE_OFFLINE]<br />
              Detective, your field terminal requires an authorized Gemini API Key to initiate deep truth scans.
            </p>
          </div>
          
          <button 
            onClick={handleSelectKey}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            <Key className="w-5 h-5" />
            Connect to Truth Server
          </button>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Intelligence Directive</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              Select an API key from a paid GCP project. Note: <strong>Free of charge</strong> tiers are available if billing is not enabled. 
              Review <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-indigo-400 underline">Billing Documentation</a> for setup details.
            </p>
            <div className="p-3 bg-black/50 rounded-lg font-mono text-[10px] text-emerald-500">
              # Terminal decrypted. Waiting for key input...
            </div>
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
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 p-12 text-center shadow-inner">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                <ShieldCheck className="w-12 h-12 opacity-20 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-600 italic tracking-tight">Awaiting Investigation</h3>
              <p className="max-w-xs mt-3 text-sm leading-relaxed text-slate-400">
                Enter news or specific claims on the left to initiate the high-fidelity Tri-Lens verification protocol.
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
