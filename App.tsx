import React, { useState } from 'react';
import { analyzeNews } from './services/geminiService';
import { AnalysisResult } from './types';
import Header from './components/Header';
import NewsInput from './components/NewsInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import ProtocolGuide from './components/ProtocolGuide';
import { AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeNews(content);
      setAnalysis(result);
    } catch (err: any) {
      // 如果是因为没填 Key 导致的报错，这里会捕获并显示
      const msg = err.message || '';
      if (msg.includes('401') || msg.includes('API_KEY')) {
        setError('Detective, your API_KEY is missing or invalid. Please configure it in environment settings.');
      } else {
        setError('Analysis failed. The truth is elusive right now. Please try again.');
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
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 text-sm border border-red-100 animate-in shake duration-500">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <span className="font-medium">{error}</span>
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
              <p className="max-w-xs mt-2 italic">粘贴新闻到左侧，启动三维滤镜进行核查。</p>
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