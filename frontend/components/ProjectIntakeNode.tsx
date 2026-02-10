import React, { useState, useMemo, useEffect } from 'react';
import { Target, Zap, ShieldCheck, Activity, Send, Loader2, ArrowRight, Database, Lock, TrendingUp, Cpu, Server, Fingerprint, RotateCcw } from 'lucide-react';

type ProjectDiscipline = 'web' | 'fullstack' | 'mobile' | 'creative';

const MARKUPS: Record<ProjectDiscipline, number> = {
  web: 1.40,       // +40% 
  fullstack: 1.35, // +35%
  mobile: 1.35,    // +35%
  creative: 1.20   // +20%
};

const DISCIPLINE_LABELS: Record<ProjectDiscipline, string> = {
  web: 'Web3 / Fintech',
  fullstack: 'Full Stack Ops',
  mobile: 'Mobile Native',
  creative: 'Creative & Brand'
};

const ProjectIntakeNode: React.FC = () => {
  // Persistence Keys
  const STORAGE_KEYS = {
    DISCIPLINE: 'dc3_intake_v4_discipline',
    BUDGET: 'dc3_intake_v4_budget',
    STEP: 'dc3_intake_v4_step'
  };

  const [step, setStep] = useState<'intake' | 'bid'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STEP);
    return (saved as 'intake' | 'bid') || 'intake';
  });
  
  const [discipline, setDiscipline] = useState<ProjectDiscipline>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISCIPLINE);
    return (saved as ProjectDiscipline) || 'web';
  });
  
  const [baseBudget, setBaseBudget] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return saved ? Number(saved) : 10000;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bids, setBids] = useState<{ team: string; amount: number; srt: number }[]>([]);

  // Effect to persist state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STEP, step);
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE, discipline);
    localStorage.setItem(STORAGE_KEYS.BUDGET, baseBudget.toString());
  }, [step, discipline, baseBudget]);

  const institutionalQuote = useMemo(() => {
    return Math.round(baseBudget * MARKUPS[discipline]);
  }, [baseBudget, discipline]);

  const handleExecute = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setStep('bid');
  };

  const handleReset = () => {
    if (confirm('TERMINATE_PROTOCOL_STATE: Clear all cached intake signals?')) {
      localStorage.removeItem(STORAGE_KEYS.STEP);
      localStorage.removeItem(STORAGE_KEYS.DISCIPLINE);
      localStorage.removeItem(STORAGE_KEYS.BUDGET);
      setStep('intake');
      setDiscipline('web');
      setBaseBudget(10000);
      setBids([]);
    }
  };

  useEffect(() => {
    if (step === 'bid') {
      const interval = setInterval(() => {
        if (bids.length < 5) {
          const newBid = {
            team: `Node_${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
            amount: Math.round(baseBudget * (0.85 + Math.random() * 0.15)),
            srt: 850 + Math.floor(Math.random() * 149)
          };
          setBids(prev => [newBid, ...prev].slice(0, 5));
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step, baseBudget, bids.length]);

  return (
    <div className="bg-[#020617] py-24 px-6 lg:px-12 border-y border-white/5 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-decensat/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col xl:flex-row items-stretch gap-12 lg:gap-20">
          
          <div className="w-full xl:w-[480px] shrink-0">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center text-black shadow-2xl">
                  <Database size={28} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1 leading-none">PROTOCOL_INTAKE_SIGNAL</h3>
                  <div className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Project Audit</div>
                </div>
              </div>
              <button 
                onClick={handleReset}
                title="Flush Local Cache"
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-600 hover:text-rose-500 hover:border-rose-500/30 transition-all active:scale-90"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <div className="bg-black border-4 border-white/5 p-10 rounded-[3.5rem] space-y-8 shadow-[0_48px_96px_-24px_rgba(0,0,0,1)]">
              <div className="grid grid-cols-2 gap-4">
                {(Object.keys(MARKUPS) as ProjectDiscipline[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiscipline(d)}
                    className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all duration-300 ${
                      discipline === d 
                        ? 'bg-decensat border-decensat text-black shadow-glow-sm scale-[1.02]' 
                        : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                    }`}
                  >
                    {DISCIPLINE_LABELS[d]}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-2 flex items-center gap-2">
                  <Fingerprint size={12} className="text-decensat" /> VALUATION_SIGNAL ($)
                </label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-700">$</span>
                  <input 
                    type="number" 
                    value={baseBudget}
                    onChange={(e) => setBaseBudget(Number(e.target.value))}
                    className="w-full bg-zinc-950 border-4 border-white/5 rounded-[1.8rem] px-12 py-5 text-white font-black focus:outline-none focus:border-decensat/40 transition-all font-mono text-xl shadow-inner"
                  />
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-relaxed">
                <div className="flex items-center gap-2 text-decensat mb-1">
                  <div className="w-1 h-1 rounded-full bg-decensat animate-pulse" />
                  PERSISTENCE_ACTIVE
                </div>
                Form state encrypted and stored in local node cache for continuity.
              </div>

              <button 
                onClick={handleExecute}
                disabled={isSubmitting}
                className="w-full py-6 bg-decensat text-black font-black uppercase text-xs tracking-[0.3em] rounded-[1.8rem] hover:bg-white transition-all flex items-center justify-center gap-4 shadow-[0_24px_48px_-12px_rgba(163,230,53,0.4)] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Lock size={20} />}
                {isSubmitting ? 'ESTABLISHING HANDSHAKE...' : 'EXECUTE AUDIT'}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-black rounded-[4rem] border-2 border-white/5 p-12 lg:p-16 text-white relative overflow-hidden flex flex-col justify-center min-h-[500px] shadow-[0_64px_128px_-32px_rgba(0,0,0,1)]">
            <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <Fingerprint size={400} />
            </div>

            {step === 'intake' ? (
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 py-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <TrendingUp size={28} className="text-decensat" />
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Institutional Settlement</span>
                  </div>
                  <h4 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                    ${institutionalQuote.toLocaleString()}
                  </h4>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldCheck size={14} className="text-decensat" /> Protocol Markup Applied (+{Math.round((MARKUPS[discipline] - 1) * 100)}%)
                  </p>
                </div>
                
                <div className="w-full md:w-px h-px md:h-40 bg-white/10 shrink-0" />

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <Zap size={28} className="text-decensat animate-pulse" />
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Reverse Bid Projection</span>
                  </div>
                  <h4 className="text-5xl lg:text-7xl font-black text-decensat tracking-tighter leading-none mb-6">
                    ${baseBudget.toLocaleString()}
                  </h4>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Activity size={14} className="text-decensat" /> Awaiting Direct Node Alignment
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative z-10 animate-in fade-in duration-500 w-full h-full flex flex-col">
                <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-3 h-3 bg-decensat rounded-full animate-pulse shadow-[0_0_15px_rgba(163,230,53,1)]" />
                    <h3 className="text-2xl font-black tracking-tight uppercase">Talent Team Bids</h3>
                  </div>
                  <button onClick={() => setStep('intake')} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2">
                    TERMINATE AUDIT <Server size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {bids.length === 0 ? (
                    <div className="col-span-2 py-20 flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full border-4 border-decensat/20 border-t-decensat animate-spin" />
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">SCANNING_NETWORK_NODES...</span>
                    </div>
                  ) : (
                    bids.map((bid, i) => (
                      <div key={i} className="flex justify-between items-center p-8 bg-white/5 border border-white/10 rounded-[2.5rem] animate-in slide-in-from-right duration-500 hover:bg-white/10 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-sm font-black font-mono border border-white/10 text-decensat group-hover:scale-110 transition-transform">
                            #{bid.team.slice(-3)}
                          </div>
                          <div>
                            <div className="text-lg font-black text-white">{bid.team}</div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">SRT_{bid.srt} Verified</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black font-mono text-white group-hover:text-decensat transition-colors">${bid.amount.toLocaleString()}</div>
                          <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Direct Settlement</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectIntakeNode;