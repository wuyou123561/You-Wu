
import React from 'react';
import { AnalysisResult } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Fingerprint, 
  Database, 
  BrainCircuit, 
  ExternalLink, 
  Globe,
  History,
  ShieldCheck,
  Boxes,
  Info
} from 'lucide-react';

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis }) => {
  const getVerdictStyles = (verdict: string) => {
    if (verdict === 'RED') return { 
      bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', 
      icon: <XCircle className="w-10 h-10 text-red-600" />, stamp: 'FRAUDULENT' 
    };
    if (verdict === 'YELLOW') return { 
      bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700', 
      icon: <AlertTriangle className="w-10 h-10 text-amber-600" />, stamp: 'UNVERIFIED' 
    };
    return { 
      bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700', 
      icon: <CheckCircle2 className="w-10 h-10 text-emerald-600" />, stamp: 'AUTHENTIC' 
    };
  };

  const styles = getVerdictStyles(analysis.verdict);

  const getHostname = (uri: string) => {
    try {
      return new URL(uri).hostname;
    } catch {
      return 'external-link';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      
      {/* CASE HEADER */}
      <div className="flex justify-between items-end border-b-4 border-slate-900 pb-2">
        <div>
          <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Case Intelligence File</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-2">
            <ShieldCheck size={12} className="text-indigo-600" />
            Verified via Tri-Lens Protocol v3.0
          </p>
        </div>
        <div className="text-[10px] font-mono font-bold text-slate-400">REF_ID: {Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
      </div>

      {/* VERDICT CARD */}
      <div className={`p-8 rounded-[2.5rem] border-[3px] shadow-lg relative overflow-hidden flex items-center gap-6 ${styles.bg} ${styles.border}`}>
        <div className="shrink-0">{styles.icon}</div>
        <div className="z-10">
          <h4 className={`text-2xl font-black uppercase tracking-tighter ${styles.text}`}>{styles.stamp}</h4>
          <p className="text-slate-900 font-bold leading-tight mt-1 text-lg">{analysis.summary}</p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.06] font-black text-8xl rotate-[-12deg] pointer-events-none select-none italic tracking-tighter">
          {styles.stamp}
        </div>
      </div>

      {/* COLOR-CODED LENS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LensCard icon={<Fingerprint />} title="Source" lens={analysis.sourceLens} />
        <LensCard icon={<Database />} title="Fact" lens={analysis.factLens} />
        <LensCard icon={<BrainCircuit />} title="Logic" lens={analysis.logicLens} />
      </div>

      {/* INTELLIGENCE TRAIL (SEARCH RESULTS) */}
      <section className="bg-white p-7 rounded-[2.5rem] shadow-sm border-2 border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Intelligence Trail</h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified Web Sources</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-[9px] font-black text-slate-500 rounded-full uppercase tracking-widest animate-pulse">Live Tracking</span>
        </div>

        {analysis.groundingSources && analysis.groundingSources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysis.groundingSources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:border-indigo-100 transition-colors">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${getHostname(source.uri)}&sz=128`} 
                      className="w-6 h-6"
                      alt=""
                      onError={(e) => (e.currentTarget.src = "https://www.google.com/favicon.ico")}
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[13px] font-black text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                      {source.title || 'Source Intelligence'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-widest mt-0.5">
                      {getHostname(source.uri)}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-200/50 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all ml-2">
                  <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-14 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
            <Globe className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] italic">
              AI Internal Verification... No External Links Provided
            </p>
          </div>
        )}
      </section>

      {/* ATOMIZED CLAIMS */}
      <section className="bg-slate-900 p-7 rounded-[2.5rem] border-2 border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Boxes className="w-24 h-24 text-indigo-400" />
        </div>
        
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Intelligence Decomposition</h4>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Verified Atomized Units</p>
            </div>
          </div>
          <div className="group relative">
            <Info className="w-4 h-4 text-slate-600 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-[9px] text-slate-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-bold border border-slate-700">
              We split the text into single "Bricks" to isolate specific lies.
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          {analysis.claims.map((claim, i) => (
            <div key={i} className="bg-slate-800/50 p-4 rounded-2xl text-[12px] font-bold text-slate-300 border border-slate-700/50 flex gap-5 items-start group hover:bg-slate-800 hover:border-indigo-500/30 transition-all">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-indigo-500 flex items-center justify-center shrink-0 font-mono text-[10px] border border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
                ATOM_{i+1}
              </span>
              <p className="italic leading-relaxed">"{claim.text}"</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

const LensCard = ({ icon, title, lens }: any) => {
  const getStatusColor = (status: string, isRedFlag: boolean) => {
    const s = status.toUpperCase();
    if (isRedFlag || s.includes('RED') || s.includes('FALLACIOUS') || s.includes('FABRICATED')) 
      return { border: 'border-red-500', text: 'text-red-600', bg: 'bg-red-50/50', iconBg: 'bg-red-500 shadow-red-200' };
    if (s.includes('YELLOW') || s.includes('VAGUE') || s.includes('ANONYMOUS') || s.includes('EMOTIONAL')) 
      return { border: 'border-amber-500', text: 'text-amber-600', bg: 'bg-amber-50/50', iconBg: 'bg-amber-500 shadow-amber-200' };
    return { border: 'border-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50/50', iconBg: 'bg-emerald-500 shadow-emerald-200' };
  };

  const colors = getStatusColor(lens.status, lens.isRedFlag);

  return (
    <div className={`p-6 rounded-[2rem] border-2 bg-white transition-all duration-300 shadow-sm ${colors.border} ${colors.bg}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-white shadow-lg ${colors.iconBg}`}>
        {icon}
      </div>
      <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title} Analysis</h6>
      <div className={`text-xl font-black italic tracking-tighter mb-3 uppercase ${colors.text}`}>{lens.status}</div>
      <p className="text-[11px] text-slate-700 leading-relaxed font-bold line-clamp-4">{lens.details}</p>
    </div>
  );
};

export default AnalysisDashboard;
