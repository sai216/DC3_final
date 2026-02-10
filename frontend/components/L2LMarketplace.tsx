import React, { useState, useMemo } from 'react';
import { TrackType, L2LOffering, Discipline, CartItem } from '../types';
import { isOfferingAvailable } from '../services/l2lService';
import { 
  ShoppingBag, Star, Users, Clock, ShieldCheck, 
  ChevronRight, ArrowRight, Zap, Info, Loader2,
  Lock, Globe, Video, Headphones, BarChart3, Database,
  Cpu, Layout, CheckCircle2, Shield, Calendar, ListChecks,
  Target, Sparkles, Terminal, Rocket
} from 'lucide-react';
import TreasuryTracker from './TreasuryTracker';

// Enhanced Interface for Bundle Metadata
interface JuiceBundleOffering extends L2LOffering {
  deliverables?: string[];
  sla?: string;
  timelineDetails?: string;
  isBundle?: boolean;
  performanceIndex?: string;
}

const PRODUCE_ITEMS: JuiceBundleOffering[] = [
  {
    id: 'l2l_1',
    name: 'Web3 Core Sprint',
    type: TrackType.Commerce,
    icon: '🍎',
    tier: 'tier_1',
    durationWeeks: 6,
    price: 15000,
    description: 'A 6-week atomic dev sprint for protocol optimization and smart contract hardening.',
    isBundle: true,
    performanceIndex: '9.4',
    deliverables: [
      'Protocol Integrity Audit',
      'Gas Optimization Matrix',
      'Hardened Security Layer',
      'Deployment Manifest'
    ],
    sla: '99.9% Uptime Handshake',
    timelineDetails: '6-Week Atomic Sprint Cycle',
    team: {
        id: 'team_a',
        name: 'Alpha Node',
        usesFullStack: true,
        projectManager: { id: 'p1', name: 'Marco R.', discipline: Discipline.FullstackDev, age: 28, phase: 5, yearsInternship: 3, yearsNonInternship: 5, commerceCompletions: 4, learningCompletions: 2, image: '', srt: 920 },
        developers: [
            { id: 'p2', name: 'Sara L.', discipline: Discipline.Web3Dev, age: 24, phase: 4, yearsInternship: 2, yearsNonInternship: 3, commerceCompletions: 1, learningCompletions: 0, image: '', srt: 880 },
            { id: 'p3', name: 'David O.', discipline: Discipline.Web3Dev, age: 26, phase: 4, yearsInternship: 2, yearsNonInternship: 3, commerceCompletions: 2, learningCompletions: 0, image: '', srt: 895 }
        ]
    }
  },
  {
    id: 'l2l_2',
    name: 'Protocol Security Node',
    type: TrackType.Learning,
    icon: '🍊',
    tier: 'tier_2',
    durationWeeks: 1.5,
    price: 999,
    description: '10-day high-intensity cryptographic security course led by elite Juice Node talent.',
    isBundle: true,
    performanceIndex: '9.9',
    deliverables: [
      'SRT Certification Signal',
      'Direct Peer Code Review',
      'Privy Knowledge Access',
      'Execution Frameworks'
    ],
    sla: 'Institutional Support Node',
    timelineDetails: '10-Day Deep Dive Protocol',
    instructor: { id: 'p1', name: 'Marco R.', discipline: Discipline.FullstackDev, age: 28, phase: 5, yearsInternship: 3, yearsNonInternship: 5, commerceCompletions: 4, learningCompletions: 2, image: '', srt: 920 },
    studentCensus: 42,
    avgRating: 4.9
  },
  {
    id: 'l2l_3',
    name: 'Infrastructure Cluster',
    type: TrackType.Commerce,
    icon: '🍍',
    tier: 'tier_2',
    durationWeeks: 12,
    price: 45000,
    description: '12-week complex architecture build for scaling nodes and global platform orchestration.',
    isBundle: true,
    performanceIndex: '9.7',
    deliverables: [
      'Global Node Mesh Setup',
      'Auth Registry v4 Sync',
      'Institutional Bridge Logic',
      'Scaling Load Analysis'
    ],
    sla: 'Institutional Grade Resilience',
    timelineDetails: '12-Week Scaling Protocol',
    team: {
        id: 'team_b',
        name: 'Bravo Node',
        usesFullStack: true,
        projectManager: { id: 'p4', name: 'Elena B.', discipline: Discipline.Architect, age: 31, phase: 5, yearsInternship: 4, yearsNonInternship: 6, commerceCompletions: 8, learningCompletions: 5, image: '', srt: 950 },
        developers: [
            { id: 'p5', name: 'Ken J.', discipline: Discipline.Web3Dev, age: 29, phase: 4, yearsInternship: 2, yearsNonInternship: 4, commerceCompletions: 6, learningCompletions: 1, image: '', srt: 910 },
            { id: 'p6', name: 'Yuki S.', discipline: Discipline.FullstackDev, age: 25, phase: 4, yearsInternship: 3, yearsNonInternship: 3, commerceCompletions: 4, learningCompletions: 0, image: '', srt: 890 },
            { id: 'p7', name: 'Tom H.', discipline: Discipline.UiUx, age: 27, phase: 4, yearsInternship: 2, yearsNonInternship: 3, commerceCompletions: 5, learningCompletions: 2, image: '', srt: 905 }
        ]
    }
  },
  {
    id: 'l2l_4',
    name: 'Venture Logic Pod',
    type: TrackType.Learning,
    icon: '🍌',
    tier: 'tier_1',
    durationWeeks: 1,
    price: 299,
    description: '1-week interactive deep-dive into high-fidelity building and reputation routing principles.',
    isBundle: false,
    performanceIndex: '9.2',
    instructor: { id: 'p4', name: 'Elena B.', discipline: Discipline.Architect, age: 31, phase: 5, yearsInternship: 4, yearsNonInternship: 6, commerceCompletions: 8, learningCompletions: 5, image: '', srt: 950 },
    studentCensus: 156,
    avgRating: 5.0
  }
];

interface JuiceNodeMarketplaceProps {
  onAddToCart: (item: CartItem) => void;
}

const JuiceNodeMarketplace: React.FC<JuiceNodeMarketplaceProps> = ({ onAddToCart }) => {
  const [filter, setFilter] = useState<'all' | 'Services' | 'Knowledge'>('all');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return PRODUCE_ITEMS;
    const type = filter === 'Services' ? TrackType.Commerce : TrackType.Learning;
    return PRODUCE_ITEMS.filter(item => item.type === type);
  }, [filter]);

  const handleAdd = async (item: JuiceBundleOffering) => {
    const check = isOfferingAvailable(item);
    if (!check.available) {
        alert(`PROTOCOL REJECTION: ${check.reason}`);
        return;
    }
    
    setIsSyncing(item.id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onAddToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        category: 'Juice Node Asset',
        icon: item.icon
    });
    setIsSyncing(null);
  };

  return (
    <div id="juice-node-marketplace" className="py-24 sm:py-40 bg-[#020617] border-y-2 border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-decensat/5 rounded-full blur-[160px] -mr-64 -mt-64 pointer-events-none" />
      
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 sm:mb-24 gap-10">
          <div className="max-w-4xl border-l-[10px] sm:border-l-[16px] border-decensat pl-8 sm:pl-12 animate-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-2xl">
              <Cpu size={16} className="animate-pulse" />
              <span>DETERMINISTIC_TALENT_ECOSYSTEM</span>
            </div>
            <h2 className="text-5xl sm:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-10 uppercase italic">
              Juice Node <span className="text-decensat not-italic underline decoration-white/10 underline-offset-[12px]">Inventory</span>
            </h2>
            <p className="text-xl sm:text-3xl text-slate-400 font-bold leading-tight uppercase tracking-tight max-w-3xl">
              High-fidelity talent nodes and verified knowledge assets. Orchestrated at machine speed for institutional execution.
            </p>
          </div>
          
          <div className="flex bg-black/40 p-2 sm:p-3 rounded-[2.5rem] border-4 border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] backdrop-blur-3xl w-full sm:w-auto overflow-hidden">
            {(['all', 'Services', 'Knowledge'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-1 sm:flex-none px-6 sm:px-12 py-5 sm:py-7 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                  filter === t ? 'bg-decensat text-black shadow-glow-sm scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12">
          {filteredItems.map((item) => {
            const check = isOfferingAvailable(item);
            const isItemSyncing = isSyncing === item.id;

            return (
              <div 
                key={item.id} 
                className={`group bg-zinc-950 border-[3px] rounded-[3rem] sm:rounded-[4rem] p-8 lg:p-12 flex flex-col transition-all duration-700 relative overflow-hidden h-full transform-gpu ${
                  !check.available ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-decensat/40 hover:-translate-y-4 hover:shadow-[0_64px_128px_-32px_rgba(163,230,53,0.2)] border-white/5'
                }`}
              >
                {/* Visual Artifact Scanning */}
                <div className="absolute inset-x-0 h-1 top-0 bg-decensat/30 animate-scan opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-8 sm:mb-14">
                  <div className="text-7xl sm:text-9xl filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000">
                    {item.icon}
                  </div>
                  {item.performanceIndex && (
                    <div className="flex flex-col items-end gap-1">
                       <div className="text-[11px] font-black font-mono text-decensat">{item.performanceIndex}</div>
                       <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Perf_Index</div>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                     <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-xl border-2 ${
                       item.type === TrackType.Commerce ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-decensat/10 border-decensat/20 text-decensat'
                     }`}>
                       ID: {item.tier.toUpperCase()}
                     </span>
                     {item.avgRating && (
                       <div className="flex items-center gap-2 text-yellow-500 font-black text-sm">
                         <Star size={16} fill="currentColor" /> {item.avgRating}
                       </div>
                     )}
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none italic group-hover:not-italic transition-all duration-700">
                    {item.name}
                  </h3>
                  <p className="text-[11px] sm:text-[13px] text-slate-500 font-bold leading-relaxed mb-8 uppercase tracking-tight italic">
                    {item.description}
                  </p>
                  
                  {/* Detailed Manifest Section */}
                  <div className="space-y-4 mb-10 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4 text-slate-400">
                      <Clock size={18} className="text-decensat shrink-0" />
                      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">{item.durationWeeks} Weeks Delivery Velocity</span>
                    </div>
                    {item.team && (
                      <div className="flex items-center gap-4 text-slate-400">
                        <Users size={18} className="text-decensat shrink-0" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">{item.team.developers.length + 1} Principal Node Cluster</span>
                      </div>
                    )}
                    
                    {item.deliverables && (
                      <div className="pt-6 space-y-4">
                        <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2 flex items-center gap-3">
                           <ListChecks size={14} className="text-decensat" /> Technical_Manifest
                        </div>
                        <div className="grid gap-2.5">
                           {item.deliverables.slice(0, 3).map((d, i) => (
                             <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-decensat/20 transition-all">
                                <div className="w-1.5 h-1.5 rounded-full bg-decensat/40 shrink-0" />
                                <span className="text-[10px] font-mono text-slate-300 uppercase truncate font-bold">{d}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                   <div className="flex items-baseline justify-between mb-10">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Draw Valuation</span>
                        <div className="flex items-baseline gap-2 mt-1">
                           <span className="text-xs font-black text-decensat/50 font-mono">USDC</span>
                           <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tighter tabular-nums">${item.price.toLocaleString()}</span>
                        </div>
                      </div>
                      {item.sla && (
                         <div className="text-right">
                            <Shield size={16} className="text-blue-500 ml-auto mb-1 opacity-60" />
                            <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest block">SLA_GUARD</span>
                         </div>
                      )}
                   </div>
                   
                   <button 
                    onClick={() => handleAdd(item)}
                    disabled={!check.available || isItemSyncing}
                    className={`w-full h-20 rounded-[2rem] font-black text-[11px] sm:text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-6 shadow-2xl active:scale-95 transform-gpu ${
                      !check.available 
                        ? 'bg-zinc-950 text-slate-600 cursor-not-allowed border border-white/5' 
                        : 'bg-decensat text-black hover:bg-white shadow-glow-md'
                    }`}
                   >
                     {isItemSyncing ? (
                       <>
                         <Loader2 size={24} className="animate-spin" />
                         <span>SYNCING_PROTOCOL...</span>
                       </>
                     ) : (
                       <>
                         {/* FIX: Replaced potentially missing Rocket icon with the imported version */}
                         <Rocket size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                         <span>DEPLOY_ASSET</span>
                       </>
                     )}
                   </button>
                </div>

                {/* Restricted Access Mask */}
                {!check.available && (
                   <div className="absolute inset-0 bg-black/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-12 text-center z-30">
                      <div className="w-20 h-20 bg-rose-500/10 border-2 border-rose-500/30 rounded-3xl flex items-center justify-center mb-8 text-rose-500 shadow-2xl">
                        <Lock size={36} className="animate-pulse" />
                      </div>
                      <h4 className="text-white font-black uppercase text-sm tracking-[0.4em] mb-4">Auth_Failure</h4>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-tight mb-10 px-4">
                        Principal clearance required. Verified Phase 4 credentials must be present in the active handshake node.
                      </p>
                      <button className="px-10 py-4 border-2 border-decensat text-decensat rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-decensat hover:text-black transition-all active:scale-95">
                        REQUEST_CLEARANCE
                      </button>
                   </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Treasury Context Bar */}
        <div className="mt-32 grid lg:grid-cols-12 gap-12 sm:gap-20 items-center">
            <div className="lg:col-span-4 order-2 lg:order-1">
                <TreasuryTracker />
            </div>
            <div className="lg:col-span-8 bg-black p-12 sm:p-20 rounded-[4rem] sm:rounded-[6rem] text-white border-4 border-white/5 relative overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,1)] order-1 lg:order-2 group/treasury">
                <div className="absolute inset-0 bg-decensat/[0.02] opacity-0 group-hover/treasury:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none group-hover/treasury:scale-110 transition-transform duration-[2000ms]">
                    <BarChart3 size={400} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 sm:gap-20">
                    <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-[2.5rem] sm:rounded-[4rem] bg-white/5 border-[3px] border-white/10 flex items-center justify-center text-decensat shadow-glow-sm shrink-0 group-hover/treasury:border-decensat/50 transition-all duration-1000">
                        <BarChart3 className="w-12 h-12 sm:w-20 sm:h-20 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-4xl sm:text-6xl font-black mb-6 sm:mb-10 tracking-tighter uppercase leading-[0.9] italic group-hover/treasury:not-italic transition-all duration-700">
                           Shared Treasury <br/> <span className="not-italic text-decensat">Participation</span>
                        </h3>
                        <p className="text-xl sm:text-3xl text-slate-400 font-bold leading-tight sm:leading-relaxed mb-10 sm:mb-16 uppercase tracking-tight italic border-l-8 border-decensat/30 pl-8">
                            Every principal Juice Node co-earns from aggregate build revenue shares. Income draw protocol is adjusted based on verified SRT performance signals.
                        </p>
                        <div className="flex flex-wrap gap-6 sm:gap-12">
                            <div className="p-8 sm:p-12 bg-white/5 border-2 border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] hover:border-decensat/40 transition-all flex flex-col gap-2">
                                <div className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest font-mono">Performance Multiple</div>
                                <div className="text-4xl sm:text-6xl font-black font-mono text-decensat">1.14x</div>
                            </div>
                            <div className="p-8 sm:p-12 bg-white/5 border-2 border-white/5 rounded-[2.5rem] sm:rounded-[3.5rem] hover:border-blue-500/40 transition-all flex flex-col gap-2">
                                <div className="text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest font-mono">Aggregate Reserve</div>
                                <div className="text-4xl sm:text-6xl font-black font-mono text-blue-500">18.4%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default JuiceNodeMarketplace;