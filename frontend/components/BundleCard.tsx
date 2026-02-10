
import React, { useState, useMemo } from 'react';
import { Bundle } from '../types';
import { 
  Check, Loader2, Rocket, Network, Cpu, Coins, Zap, 
  Target, ListChecks, ArrowUpRight, BarChart3, Sparkles, User, Bot
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface BundleCardProps {
  bundle: Bundle;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onAddToCart?: () => void;
  onLearnMore?: () => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ bundle, isSelected, onAddToCart, onLearnMore }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPricingTooltip, setShowPricingTooltip] = useState(false);

  const sparklineData = useMemo(() => [
    { value: 40 + Math.random() * 10 }, 
    { value: 55 + Math.random() * 15 }, 
    { value: 48 + Math.random() * 20 }, 
    { value: 75 + Math.random() * 10 }, 
    { value: 68 + Math.random() * 15 }, 
    { value: 92 + Math.random() * 5 }
  ], []);

  const handleInitialize = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (onAddToCart) onAddToCart();
    setIsSyncing(false);
  };

  const activePrice = bundle.prices[0];

  return (
    <div className={`bg-[#020617] border-2 rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden transition-all duration-700 ease-expo group flex flex-col h-full relative transform-gpu ${isSelected ? 'border-decensat shadow-glow-lime' : 'border-white/5 hover:border-decensat/30'}`}>
      
      {/* Header Artifact */}
      <div className="relative h-64 sm:h-80 overflow-hidden border-b-[6px] border-white/5 shrink-0 bg-black">
        <img 
          src={bundle.heroImage} 
          alt={bundle.name} 
          className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-grid-f4a opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
        
        <div className="absolute top-6 right-6">
           <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] text-decensat flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-decensat animate-pulse" />
              NODE_CLASS::{bundle.tier.toUpperCase().replace(/ /g, '_')}
           </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
           <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-decensat text-black text-[8px] font-black uppercase tracking-[0.3em] mb-3 shadow-glow-sm">
             <Zap size={10} className="animate-pulse" /> SYSTEM_ORCHESTRATION
           </div>
           <h3 className="text-3xl sm:text-4xl text-white font-black leading-none tracking-tighter mb-2 uppercase italic">
             {bundle.name}
           </h3>
           <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
             <span className="text-decensat">{bundle.category}</span>
           </div>
        </div>
      </div>

      {/* Pricing & Telemetry */}
      <div className="p-5 sm:p-6 bg-zinc-950/50 border-b border-white/5 flex items-center justify-between gap-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-grid-f4a opacity-10 pointer-events-none" />
         <div>
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
              <div 
                className="relative cursor-help inline-block"
                onMouseEnter={() => setShowPricingTooltip?.(true)}
                onMouseLeave={() => setShowPricingTooltip?.(false)}
              >
                <Coins size={12} className="text-decensat hover:text-white transition-colors duration-300" />
                
                {/* Tooltip */}
                {showPricingTooltip && (
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-64 bg-gradient-to-b from-black/98 to-black border border-decensat/70 rounded-xl p-4 text-white shadow-2xl shadow-decensat/30 z-50 backdrop-blur-md pointer-events-none">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-decensat/70 rotate-45" />
                    <span className="text-decensat font-black uppercase text-[7px] block mb-2 tracking-wider italic">Initial engagement</span>
                    <p className="text-[10px] font-bold leading-relaxed text-white italic">
                      Monthly execution → Creative, Brand, SEO & Content Strategy & Development
                    </p>
                  </div>
                )}
              </div>
              INITIAL_ENGAGEMENT
            </div>
            <div className="flex items-baseline gap-2">
               <span className="text-xs font-black text-decensat/50 font-mono">USDC</span>
               <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter font-mono">${activePrice.amount.toLocaleString()}</span>
            </div>
         </div>
      </div>

      {/* Content */}
      <div className="px-5 sm:px-6 pt-5 pb-5 flex-grow flex flex-col">
        <div className="space-y-4">
           <p className="text-[10px] sm:text-[12px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight italic border-l-2 border-decensat/30 pl-4">
             {bundle.description}
           </p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bundle.deliverables.map((d, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-black border border-white/5 hover:border-decensat/20 transition-all group/item">
                   <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-decensat transition-all duration-500 shrink-0">
                      <Check size={10} className="text-decensat group-hover/item:text-black" strokeWidth={4} />
                   </div>
                   <span className="text-[7px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest truncate">{d}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Terminal Action Area */}
        <div className="mt-auto pt-5 border-t border-white/5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onLearnMore}
            className="flex-1 h-[56px] rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95 bg-white/10 text-white hover:bg-white/20"
          >
            LEARN MORE
            <ArrowUpRight size={16} className="opacity-50" />
          </button>
          <button 
            onClick={handleInitialize}
            disabled={isSyncing}
            className={`flex-1 h-[56px] rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/btn active:scale-95 shadow-glow-md relative overflow-hidden ${
              isSyncing ? 'bg-zinc-900 text-decensat cursor-wait grayscale' : 'bg-decensat text-black hover:bg-white'
            }`}
          >
            {isSyncing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                SYNCING_PROTOCOL...
              </>
            ) : (
              <>
                BOOK A CALL
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BundleCard;
