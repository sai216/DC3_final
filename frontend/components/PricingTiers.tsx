
import React, { useRef, useState } from 'react';
import { ChevronUp, ChevronDown, Zap, ShieldCheck, Activity, Target, X } from 'lucide-react';
import BundleCard from './BundleCard';
// Added comment: Missing import for UI_TEXTURES from the image registry
import { UI_TEXTURES } from '../assets/images/registry';

interface PricingTiersProps {
  title: string;
  subtitle: string;
  data: any[];
  icon: React.ReactNode;
  color: string;
  accentBorder: string;
}

const PricingTiers: React.FC<PricingTiersProps> = ({ title, subtitle, data = [], icon, color, accentBorder }) => {
  const [learnMoreItem, setLearnMoreItem] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const showArrows = data.length > 3;

  const scroll = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 sm:py-32 px-6 lg:px-12 bg-[#020617] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      
      {learnMoreItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-start justify-center px-4 sm:px-6 py-8 sm:py-10 overflow-y-auto">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-decensat/40 rounded-3xl max-w-3xl w-full my-0 shadow-2xl shadow-decensat/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="sticky top-0 flex items-center justify-between p-6 sm:p-8 border-b border-white/10 bg-zinc-950/98 backdrop-blur-xl rounded-t-3xl z-10">
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight bg-gradient-to-r from-white to-decensat bg-clip-text text-transparent">
                {learnMoreItem.name}
              </h2>
              <button 
                onClick={() => setLearnMoreItem(null)}
                className="p-2.5 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-decensat/50 active:scale-95"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {learnMoreItem.summary}
              </p>
              {learnMoreItem.features?.length > 0 && (
                <ul className="grid gap-2 text-slate-200 text-sm sm:text-base">
                  {learnMoreItem.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-decensat" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1920px] mx-auto w-full relative">
        {/* Header Block */}
        <div className={`mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10 border-l-[8px] ${accentBorder} pl-8 animate-in slide-in-from-left duration-1000`}>
          <div className="max-w-4xl">
              <h2 className="font-black text-white uppercase leading-[0.95]" style={{fontSize: 'clamp(1.15rem, 4vw, 2.35rem)', letterSpacing: '-0.04em', marginBottom: '1rem'}}>
                Platform <span className="text-decensat italic">Capabilities</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] sm:text-lg lg:text-2xl tracking-[0.2em] italic">{subtitle}</p>
            </div>
          
          {showArrows && (
            <div className="hidden md:flex gap-4 shrink-0 pb-2">
              <button 
                onClick={() => scroll('up')} 
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-2xl group"
              >
                <ChevronUp size={32} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
              </button>
              <button 
                onClick={() => scroll('down')} 
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-2xl group"
              >
                <ChevronDown size={32} strokeWidth={3} className="group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Bundle Grid */}
        <div 
          ref={scrollRef} 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 transition-all duration-500 ${showArrows ? 'lg:h-[1600px] overflow-y-auto scroll-smooth' : ''}`}
        >
          {data.map((item, idx) => {
            // Mapping incoming data to Bundle format for the BundleCard
            const bundleFormat = {
                id: item.id,
                slug: item.id,
                name: item.name,
                shortSummary: item.summary,
                description: item.summary,
                category: title,
                tags: item.features || [],
                heroImage: UI_TEXTURES.ABSTRACT_NODES,
                deliverables: item.features || [],
                timeline: 'T+SLA_WINDOW',
                jobDuration: 'Project Based',
                sla: '99.9%',
                team: [
                    { role: 'Principal Architect', count: 1, seniority: 'Lead', location: 'Onshore' },
                    { role: 'Node Developer', count: 2, seniority: 'Senior', location: 'Distributed' }
                ],
                licensing: 'IP Ownership',
                paymentTerms: 'UCP Settlement',
                usageRights: 'Unlimited',
                renewalPolicy: 'N/A',
                stack: item.features || [],
                prerequisites: [],
                prices: [{ id: 'p1', currency: 'USDC', amount: item.price, billingType: 'one-time', formatted: `$${item.price.toLocaleString()}` }],
                priceHistory: [],
                tier: item.tier,
                rating: 5,
                reviewCount: 10
            };

            return (
                <div key={idx} className="h-full">
                <BundleCard 
                    bundle={bundleFormat as any} 
                    onAddToCart={() => {
                      const section = document.getElementById('project-assessment');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      window.dispatchEvent(new CustomEvent('start-audit-protocol'));
                    }}
                    onLearnMore={() => setLearnMoreItem(item)}
                />
                </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingTiers;
