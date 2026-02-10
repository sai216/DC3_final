import React, { useState, useEffect } from 'react';
import { 
  Zap, ShieldCheck, Activity, Cpu, Rocket, 
  ChevronRight, X, Wallet, MessageSquare, 
  ArrowRight, Sparkles, Terminal, Network, ShieldAlert
} from 'lucide-react';

interface OnboardingStep {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  feature: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: "Deterministic Reputation",
    subtitle: "SRT_VERIFICATION_LAYER",
    description: "Decensat replaces CVs with SRT—Sovereign Reputation Tracking. Every node's performance is protocol-verified on-chain.",
    icon: ShieldCheck,
    color: "text-decensat",
    feature: "Reputation Routing"
  },
  {
    title: "443 Smart Stack",
    subtitle: "NODE_COLLATERAL_PROTOCOL",
    description: "Self-configure elite talent nodes. For every 4 nodes, 1 is de-risked through network-backed collateralization.",
    icon: Network,
    color: "text-purple-500",
    feature: "Optimized Scaling"
  }
];

const OnboardingFlow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('dc3_onboarded_v4');
    if (!hasOnboarded) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('dc3_onboarded_v4', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-0 sm:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-2xl animate-in fade-in duration-700" onClick={handleComplete}/>
      
      <div className="bg-zinc-950 w-full max-w-6xl max-h-full sm:max-h-[90dvh] sm:rounded-[3.5rem] relative z-10 shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] border-4 border-white/5 flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-700">
        
        {/* Left Side: Dynamic Graphic */}
        <div className="lg:w-[40%] bg-black p-10 lg:p-16 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-grid-f4a opacity-10 pointer-events-none" />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${step.color} opacity-10 blur-[100px] animate-pulse`} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
               <span className="text-white font-black text-xl uppercase tracking-tighter">System_Intro</span>
            </div>
            
            <div className="space-y-4">
              <div className="text-4xl lg:text-6xl font-black text-white leading-none uppercase tracking-tighter">{step.feature}</div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] font-mono">
             <ShieldAlert size={14} className="text-decensat" /> INTEGRITY_PROTOCOL_v4_ACTIVE
          </div>
        </div>

        {/* Right Side: content */}
        <div className="flex-1 p-10 lg:p-24 flex flex-col bg-zinc-950 relative">
          <div className="absolute top-10 right-10 flex gap-2">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-decensat shadow-glow-sm' : 'w-1.5 bg-white/10'}`} />
            ))}
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
            <div className={`w-20 h-20 lg:w-28 lg:h-28 rounded-[2rem] lg:rounded-[3rem] flex items-center justify-center mb-10 ${step.color} bg-white/5 border-2 border-white/5 shadow-2xl animate-in zoom-in-90 duration-500`}>
              <Icon size={48} strokeWidth={2} className="lg:size-14" />
            </div>
            <div className="space-y-3 mb-8">
               <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] font-mono">{step.subtitle}</span>
               <h3 className="text-4xl lg:text-7xl font-black text-white mb-4 tracking-tighter leading-tight uppercase italic sm:not-italic">{step.title}</h3>
            </div>
            <p className="text-xl lg:text-3xl text-slate-400 font-bold leading-relaxed mb-12 border-l-[10px] border-decensat pl-10 uppercase tracking-tight">{step.description}</p>
          </div>

          <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-8 mt-auto border-t border-white/5">
             <button onClick={handleComplete} className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] hover:text-white transition-colors py-3 px-6">Bypass_Intro</button>
             <button onClick={handleNext} className="w-full sm:w-auto group px-12 lg:px-16 py-6 lg:py-8 bg-decensat text-black rounded-full font-black text-xs lg:text-sm uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-6 active:scale-95 shadow-[0_24px_48px_-12px_rgba(163,230,53,0.3)] hover:bg-white">
               {currentStep === STEPS.length - 1 ? 'Execute_Login' : 'Sync_Next'}
               <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;