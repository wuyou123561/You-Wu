import React from 'react';
import { AnalysisResult, VerdictLevel } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, Fingerprint, Database, BrainCircuit, ExternalLink, ShieldAlert, ArrowDown } from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis }) => {
  const isRed = analysis.verdict === 'RED';
  const isYellow = analysis.verdict === 'YELLOW';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* 1. Truth Filter Funnel (视觉核心) */}
      <section className="relative">
        <h4 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-8 text-center">The Truth Filter Funnel</h4>
        <div className="max-w-md mx-auto space-y-2">
          <FunnelLayer label="Source Lens" status={analysis.sourceLens.status} isRed={analysis.sourceLens.isRedFlag} opacity="opacity-100" width="w-full" />
          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-800" /></div>
          <FunnelLayer label="Fact Lens" status={analysis.factLens.status} isRed={analysis.factLens.isRedFlag} opacity="opacity-80" width="w-[85%] mx-auto" />
          <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-slate-700" /></div>
          <FunnelLayer label="Logic Lens" status={analysis.logicLens.status} isRed={analysis.logicLens.isRedFlag} opacity="opacity-60" width="w-[70%] mx-auto" />
          <div className="flex justify-center"><ArrowDown className="w-6 h-6 text-indigo-500 animate-bounce mt-2" /></div>
        </div>
      </section>

      {/* 2. Final Verdict Case File */}
      <div className={`mt-12 p-1 border-2 rounded-[2.5rem] ${isRed ? 'border-red-500/50 bg-red-500/5' : isYellow ? 'border-amber-500/50 bg-amber-500/5' : 'border-emerald-500/50 bg-emerald-500/5'}`}>
        <div className="bg-white rounded-[2.3rem] p-10 shadow-2xl relative overflow-hidden">
          {/* Stamp Effect */}
          <div className={`absolute top-10 right-10 px-8 py-3 border-[6px] rounded-xl rotate-[-12deg] font-black text-4xl opacity-20 pointer-events-none select-none uppercase
            ${isRed ? 'border-red-600 text-red-600' : isYellow ? 'border-amber-600 text-amber-600' : 'border-emerald-600 text-emerald-600'}`}>
            {analysis.verdict}
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className={`p-4 rounded-3xl ${isRed ? 'bg-red-100 text-red-600' : isYellow ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isRed ? <XCircle size={48} /> : isYellow ? <AlertTriangle size={48} /> : <CheckCircle2 size={48} />}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Final Verdict</h3>
              <p className="text-2xl font-black text-slate-900 leading-tight mb-4">{analysis.summary}</p>
              
              {isRed && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl items-center">
                  <ShieldAlert className="text-red-600 shrink-0" />
                  <p className="text-sm font-bold text-red-700">RED FLAG: <span className="font-normal">{(analysis as any).redFlagExplanation}</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed Lens Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LensCard icon={<Fingerprint />} title="Source Check" lens={analysis.sourceLens} />
        <LensCard icon={<Database />} title="Fact Check" lens={analysis.factLens} />
        <LensCard icon={<BrainCircuit />} title="Logic Check" lens={analysis.logicLens} />
      </div>

      {/* 4. Evidence Trail */}
      {analysis.groundingSources && (
        <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
          <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-8 text-indigo-400">Intelligence Trail</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.groundingSources.map((s, i) => (
              <a key={i} href={s.uri} target="_blank" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <span className="text-sm font-bold truncate pr-4">{s.title || 'Verified Source'}</span>
                <ExternalLink size={14} className="text-indigo-400 shrink-0" />
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const FunnelLayer = ({ label, status, isRed, opacity, width }: any) => (
  <div className={`${width} ${opacity} h-12 flex items-center justify-between px-6 font-black text-[10px] uppercase tracking-widest text-white rounded-lg transition-all duration-700
    ${isRed ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]' : 'bg-slate-800'}`}>
    <span>{label}</span>
    <span className={isRed ? 'animate-pulse' : 'text-slate-400'}>{status}</span>
  </div>
);

const LensCard = ({ icon, title, lens }: any) => (
  <div className={`p-8 rounded-[2rem] border-2 transition-all hover:-translate-y-2 duration-300 ${lens.isRedFlag ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 shadow-xl'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${lens.isRedFlag ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
      {icon}
    </div>
    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</h5>
    <p className={`text-xl font-black italic tracking-tighter mb-4 ${lens.isRedFlag ? 'text-red-700' : 'text-slate-900'}`}>{lens.status}</p>
    <p className="text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-100 pt-4">{lens.details}</p>
  </div>
);

export default AnalysisDashboard;