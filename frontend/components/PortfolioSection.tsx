/***import React, { useState, useRef, useEffect, memo } from 'react';
import { Database, Zap, ArrowUpRight, Cpu, Layers, CheckCircle2, FileText, ChevronDown, Activity, ShieldCheck, Globe, Cpu as CpuIcon, BarChart3, TrendingUp, Network, ExternalLink, Target, Sparkles, Fingerprint, Lock, ArrowRight, Radio, ShieldAlert } from 'lucide-react';
import { PORTFOLIO_IMAGES } from '../assets/images/registry';

interface PortfolioItem {
  id: string;
  name: string;
  systemType: string;
  executionScope: string;
  clientStage: 'MVP' | 'Growth' | 'Enterprise' | 'Internal';
  signals: string[];
  year: string;
  demoUrl: string;
  caseStudyUrl: string;
  longDescription: string;
  bgImage: string;
}

const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'dc-01', name: 'QUANTUM LEDGER', systemType: 'Financial Settlement Rails', executionScope: 'Infrastructure Engineering', clientStage: 'Enterprise', signals: ['High-Throughput', 'L2_Optimized', 'Audit_Locked'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://fundio.vc',
    longDescription: 'HARDENED, HIGH-THROUGHPUT SETTLEMENT PROTOCOL FOR INSTITUTIONAL TREASURY OPERATIONS. BUILT ON MODULAR ARCHITECTURE WITH ZERO-LATENCY GOALS.',
    bgImage: PORTFOLIO_IMAGES.QUANTUM_LEDGER
  },
  {
    id: 'dc-02', name: 'VOX ORCHESTRATOR', systemType: 'Agentic Workflow Engine', executionScope: 'Design + Core Dev', clientStage: 'Growth', signals: ['LLM_Native', 'Real-time_Sync', 'BDR_Enabled'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/vox',
    longDescription: 'AUTONOMOUS COGNITIVE ORCHESTRATION LAYER FOR SUPPLY CHAIN OPTIMIZATION. SYNCHRONIZES LLM-DRIVEN AGENTS WITH LEGACY ERP SYSTEMS TO AUTOMATE COMPLEX DECISION-MAKING LOOPS.',
    bgImage: PORTFOLIO_IMAGES.VOX_ORCHESTRATOR
  },
  {
    id: 'dc-03', name: 'BOTANICAL CMS', systemType: 'Asset Management', executionScope: 'Full System Re-architect', clientStage: 'Internal', signals: ['Sovereign_Control', 'Static_Edge', 'SRT_Integrated'], year: '2023', demoUrl: '#', caseStudyUrl: 'https://decensat.com/botanical',
    longDescription: 'INTERNAL CULTURE-FIRST ASSET MANAGEMENT SYSTEM. UTILIZING LOCALIZED EDGE NODES AND SOVEREIGN IDENTITY-LINKED ACCESS CONTROL FOR PRINCIPAL-LEVEL NODES.',
    bgImage: PORTFOLIO_IMAGES.BOTANICAL_CMS
  },
  {
    id: 'dc-04', name: 'NEXUS RESERVE', systemType: 'Liquidity Aggregator', executionScope: 'Protocol Engineering', clientStage: 'Enterprise', signals: ['Yield_Managed', 'L1/L2_Rails', 'Risk_Verified'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/nexus',
    longDescription: 'INSTITUTIONAL LIQUIDITY LAYER FOR DECENTRALIZED TREASURY MANAGEMENT. FEATURES AUTOMATED YIELD REBALANCING AND RISK MITIGATION PROTOCOLS.',
    bgImage: PORTFOLIO_IMAGES.NEXUS_RESERVE
  },
  {
    id: 'dc-05', name: 'HYPER VAULT', systemType: 'Secure Custody Protocol', executionScope: 'Security Architecture', clientStage: 'Enterprise', signals: ['Biometric', 'ZK-Proof', 'Cold_Storage'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/hyper-vault',
    longDescription: 'ADVANCED ASSET ISOLATION PROTOCOL PROVIDING BIOMETRIC-LINKED HARDWARE SECURITY FOR HIGH-VALUE VENTURE ASSETS.',
    bgImage: PORTFOLIO_IMAGES.HYPER_VAULT
  },
  {
    id: 'dc-06', name: 'NEURAL BRIDGE', systemType: 'AI Data Interop', executionScope: 'Technical Implementation', clientStage: 'Growth', signals: ['Native_Interop', 'Sub-Sec_Latency', 'Distributed'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/neural-bridge',
    longDescription: 'DATA BRIDGING BETWEEN LEGACY SYSTEMS AND AGENTIC LLM NODES. ENSURES HIGH-FIDELITY SIGNAL PARITY ACROSS DISPARATE DATABASES.',
    bgImage: PORTFOLIO_IMAGES.NEURAL_BRIDGE
  },
  {
    id: 'dc-07', name: 'AETHER DEX', systemType: 'Decentralized Exchange', executionScope: 'Full Stack Build', clientStage: 'MVP', signals: ['Deep_Liquidity', 'Gas_Optimized', 'Hyper_Scale'], year: '2023', demoUrl: '#', caseStudyUrl: 'https://decensat.com/aether',
    longDescription: 'LIQUIDITY OPTIMIZED DEX WITH LOW-SLIPPAGE ROUTING AND INSTITUTIONAL ORDER MATCHING FOR INSTITUTIONAL-SCALE TRADES.',
    bgImage: PORTFOLIO_IMAGES.AETHER_DEX
  },
  {
    id: 'dc-08', name: 'TITAN MESH', systemType: 'Global Node Infra', executionScope: 'Network Strategy', clientStage: 'Enterprise', signals: ['Infinite_Uptime', 'Global_Distro', 'Resilient'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/titan',
    longDescription: 'GEOGRAPHICALLY DISTRIBUTED SERVER CLUSTERS FOR RESILIENT DAPP HOSTING AND DECENTRALIZED CLOUD COMPUTE ORCHESTRATION.',
    bgImage: PORTFOLIO_IMAGES.TITAN_MESH
  },
  {
    id: 'dc-09', name: 'SOLARIS ERP', systemType: 'Venture Ops System', executionScope: 'Managed Services', clientStage: 'Internal', signals: ['Strict_Logic', 'Unified_Ops', 'Settled_Draw'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/solaris',
    longDescription: 'UNIFIED EXECUTION SYSTEM FOR VENTURE MANAGEMENT AND RESOURCE ALLOCATION. OPTIMIZED FOR MULTI-TENANT WORKFLOW TRACKING.',
    bgImage: PORTFOLIO_IMAGES.SOLARIS_ERP
  },
  {
    id: 'dc-10', name: 'ORACLE NODE', systemType: 'Data Feed', executionScope: 'Technical Implementation', clientStage: 'Growth', signals: ['Signed_Data', 'High_Signal', 'Verified_Auth'], year: '2024', demoUrl: '#', caseStudyUrl: 'https://decensat.com/oracle',
    longDescription: 'INSTITUTIONAL DATA INGESTION LAYER FOR REAL-TIME MARKET SIGNALS. VERIFIED PROOF OF DELIVERY FOR EXTERNAL DATA CONSUMPTION.',
    bgImage: PORTFOLIO_IMAGES.ORACLE_NODE
  }
];

const ProjectCard = memo(({ item, isSelected, onSelect }: { item: PortfolioItem, isSelected: boolean, onSelect: (id: string) => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleAction = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(item.id); }}
      className={`group bg-zinc-950 border-2 rounded-[3.5rem] p-8 lg:p-12 flex flex-col transition-all duration-700 ease-expo relative overflow-hidden transform-gpu outline-none min-h-[620px] h-auto ${
        isSelected 
          ? 'border-decensat shadow-[0_0_100px_rgba(163,230,53,0.3)] ring-4 ring-decensat/10 ring-offset-4 ring-offset-zinc-950 scale-[1.01]' 
          : 'border-white/5 hover:border-decensat/40 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] focus-visible:ring-4 focus-visible:ring-decensat focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950'
      }`}
      style={{
        transform: `perspective(2000px) rotateX(${mousePos.y * -6}deg) rotateY(${mousePos.x * 6}deg)`
      }}
    >
   
      <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
        <img 
          src={item.bgImage} 
          alt="" 
          className="w-full h-full object-cover grayscale transition-transform duration-[2000ms] group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
       
        <div className="flex justify-between items-start mb-8">
          <div className="px-4 py-1.5 border border-white/10 bg-white/5 rounded-lg text-[9px] font-mono text-slate-500 uppercase tracking-widest group-hover:text-decensat group-hover:border-decensat/30 transition-all">
            RECORD_{item.id.replace('-', '_').toUpperCase()}
          </div>
          <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${isSelected ? 'bg-decensat text-black shadow-glow-md' : 'bg-white/5 border border-white/10 text-slate-400 group-hover:bg-decensat group-hover:text-black group-hover:border-decensat'}`}>
            {item.clientStage}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-decensat transition-colors leading-none italic">
            {item.name}
          </h4>
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em] flex items-center gap-3">
             <Activity size={12} className="text-decensat animate-pulse" /> {item.systemType}
          </div>
        </div>

        
        <div className="mb-8">
            <button 
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 px-6 py-3 rounded-xl transition-all active:scale-95 group/btn outline-none focus-visible:ring-2 focus-visible:ring-decensat ${expanded ? 'bg-white/10 text-white' : 'bg-white/5 text-decensat hover:bg-decensat hover:text-black'}`}
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse project details" : "Expand project details"}
            >
              <span>{expanded ? '[TERMINATE_EXPANSION]' : '[INJECT_DETAILS]'}</span>
              <div className={`transition-transform duration-500 ${expanded ? 'rotate-180' : 'rotate-0'}`}>
                <ChevronDown size={14} strokeWidth={3} />
              </div>
            </button>
        </div>

        <div className={`relative transition-all duration-700 ease-expo overflow-hidden ${expanded ? 'max-h-[400px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
          <div className="pl-6 grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
            {item.signals.map((signal, idx) => (
              <div key={idx} className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <CheckCircle2 size={12} className="text-decensat" /> {signal}
              </div>
            ))}
          </div>
        </div>

       
        <div className="mt-auto pt-10 border-t border-white/5 bg-black/20 rounded-[2.5rem] p-8 relative group/desc">
          <p className="text-sm lg:text-base text-slate-400 font-bold leading-relaxed uppercase tracking-tight italic border-l-4 border-decensat/30 pl-6 pr-24">
            {item.longDescription}
          </p>
          <a 
            href={item.caseStudyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-6 right-8 flex items-center gap-2 px-3 py-1.5 bg-decensat/10 border border-decensat/20 rounded-lg text-[9px] font-black text-decensat uppercase tracking-widest hover:bg-decensat hover:text-black transition-all shadow-glow-sm"
          >
            <FileText size={12} />
            CASE_STUDY
          </a>
        </div>
      </div>
      
      <div className="mt-4 pt-8 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
             <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest mb-1">RELEASE_IDX</span>
             <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">{item.year}</span>
          </div>
        </div>
        
        <button 
          onClick={(e) => handleAction(e, item.demoUrl)}
          className="w-14 h-14 rounded-2xl bg-white/5 border-2 border-white/10 flex items-center justify-center text-slate-800 hover:text-decensat hover:border-decensat/40 hover:bg-decensat/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-decensat focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:scale-90 group/action shadow-xl"
          aria-label={`Open Dynamic Demo for ${item.name}`}
        >
          <ArrowUpRight size={28} className="transition-transform duration-700 group-hover:action:translate-x-1 group-hover:action:-translate-y-1" />
        </button>
      </div>
    </div>
  );
});

const PortfolioSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="max-w-[1920px] mx-auto px-6 sm:px-12 lg:px-20 py-24 relative">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      
      <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-l-[12px] border-decensat pl-12 animate-in slide-in-from-left duration-1000">
        <div className="max-w-4xl">
          <h3 className="text-2xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-8 italic">
            Execution <span className="text-decensat not-italic">Index</span>
          </h3>
          <p className="text-xl lg:text-3xl text-slate-400 font-bold leading-tight uppercase tracking-tight max-w-3xl">
            Deterministic build history and protocol-verified proof of delivery. High-fidelity benchmarks for modern venture architecture.
          </p>
        </div>
        <div className="hidden lg:flex flex-col items-end gap-4 text-right shrink-0">
           <div className="text-[11px] font-black text-slate-700 uppercase tracking-[0.6em]">CLUSTER_RELIABILITY</div>
           <div className="text-7xl font-black text-white font-mono tracking-tighter shadow-glow-sm">99.98%</div>
           <div className="flex items-center gap-3 px-4 py-1.5 bg-decensat/10 rounded-lg border border-decensat/30">
              <ShieldCheck size={14} className="text-decensat" />
              <span className="text-[9px] font-black text-decensat uppercase tracking-widest">SRT_SYNC_STABLE</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 items-stretch">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-900/40 border-2 border-white/5 rounded-[3.5rem] h-[640px] animate-pulse relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
            </div>
          ))
        ) : (
          PORTFOLIO_DATA.map(item => (
            <ProjectCard 
              key={item.id} 
              item={item} 
              isSelected={selectedId === item.id} 
              onSelect={(id) => setSelectedId(id === selectedId ? null : id)} 
            />
          ))
        )}
      </div>

      <div className="mt-32 flex flex-col items-center justify-center text-center space-y-10">
         <div className="w-px h-24 bg-gradient-to-b from-decensat to-transparent" />
         <div className="space-y-4">
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Ready to synchronize your node?</h4>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">AWAITING_INSTITUTIONAL_HANDSHAKE</p>
         </div>
         <button className="px-16 py-8 bg-decensat text-black rounded-3xl font-black uppercase text-xs tracking-[0.5em] hover:bg-white transition-all shadow-[0_32px_64px_-16px_rgba(163,230,53,0.5)] active:scale-95 group flex items-center gap-6 outline-none focus-visible:ring-4 focus-visible:ring-decensat focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950">
            Execute_System_Audit <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
         </button>
      </div>
    </section>
  );
};

export default PortfolioSection;  ***/