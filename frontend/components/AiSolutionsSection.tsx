import React, { useState, useRef, useEffect } from 'react';
import { AI_OPTIMIZATION_NODES } from '../constants';
import { AiSolution } from '../types';
import { 
  MessageSquare, Zap, Globe, ArrowRight, Brain, Phone, 
  ChevronUp, ChevronDown, Package, Sparkles, Smartphone, X
} from 'lucide-react';

const IconMap = {
  MessageSquare,
  Zap,
  Globe,
  Brain,
  Phone,
};

const AiNodeCard: React.FC<{ item: AiSolution; onStartAudit: () => void; onLearnMore: (item: AiSolution) => void }> = ({ item, onStartAudit, onLearnMore }) => {
  const Icon = IconMap[item.iconName as keyof typeof IconMap] || Zap;
  
  return (
    <div 
      className="w-full bg-zinc-950 border-2 border-white/5 rounded-[1.5rem] p-5 sm:p-6 flex flex-col transition-all duration-500 hover:border-decensat/40 group relative overflow-hidden h-full"
    >

      <div className="flex justify-between items-start mb-5 gap-3">
        <div className="bg-decensat/10 border border-decensat/20 text-decensat px-3 py-1.5 rounded-lg text-center font-black text-[8px] uppercase tracking-[0.2em] w-fit">
          {item.headline}
        </div>
        <div className="flex items-baseline gap-2">
           <span className="text-xs font-black text-decensat/50 font-mono">USDC</span>
           <div className="text-2xl sm:text-3xl font-black text-white font-mono">
             {item.price === 0 ? 'Variable' : `$${item.price.toLocaleString()}`}
           </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-decensat border border-white/10">
          <Icon strokeWidth={2.5} className="w-6 h-6" />
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none uppercase">
          {item.title}
        </h3>
      </div>

      <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6 line-clamp-2 uppercase italic">
        {item.subHeadline}
      </p>

      <div className="flex-grow mb-6">
        <div className="flex items-center gap-2 mb-3">
           <Package className="w-3 h-3 text-decensat" />
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Enterprise_Bundle</span>
        </div>
        <div className="grid gap-2">
           {item.services?.slice(0, 4).map((service, i) => (
             <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-decensat/20 transition-all">
                <div className="w-1 h-1 rounded-full bg-decensat/40" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-wide">{service}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 mt-auto">
        <div className="flex flex-row gap-3">
          <button
            onClick={() => onLearnMore(item)}
            className="flex-1 py-3 px-4 sm:px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span>Learn More</span>
            <ArrowRight strokeWidth={3} className="w-4 h-4" />
          </button>
          <button
            onClick={onStartAudit}
            className="flex-1 py-3 px-4 sm:px-6 bg-decensat hover:bg-white text-black rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg"
          >
            <Smartphone size={18} />
            <span>Start Audit</span>
            <ArrowRight strokeWidth={3} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AiSolutionsSection: React.FC = () => {
  const [learnMoreItem, setLearnMoreItem] = useState<AiSolution | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const showArrows = AI_OPTIMIZATION_NODES.length > 3;
  const isReceptionist = learnMoreItem?.id === 'ai_receptionist';

  const scroll = (direction: 'up' | 'down') => {
    if (scrollRef.current) {
      const { scrollTop, clientHeight } = scrollRef.current;
      const scrollAmount = clientHeight * 0.7;
      scrollRef.current.scrollTo({
        top: direction === 'up' ? scrollTop - scrollAmount : scrollTop + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleLearnMore = (item: AiSolution) => {
    setLearnMoreItem(item);
  };

  const handleStartAuditFromModal = () => {
    setLearnMoreItem(null);
    requestAnimationFrame(() => {
      const section = document.getElementById('project-assessment');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.dispatchEvent(new CustomEvent('start-audit-protocol'));
    });
  };

  // Lock body scroll when modals are open
  useEffect(() => {
    if (learnMoreItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [learnMoreItem]);

  return (
    <section id="ai-optimization" className="py-2 sm:py-4 px-4 sm:px-6 lg:px-12 bg-[#020617] relative z-20 overflow-hidden">
      {/* Learn More Modal */}
      {learnMoreItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[200] flex items-start justify-center px-4 sm:px-6 py-8 sm:py-10 overflow-y-auto">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-decensat/40 rounded-3xl max-w-3xl w-full my-0 shadow-2xl shadow-decensat/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="sticky top-0 flex items-center justify-between p-6 sm:p-8 border-b border-white/10 bg-zinc-950/98 backdrop-blur-xl rounded-t-3xl z-10">
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight bg-gradient-to-r from-white to-decensat bg-clip-text text-transparent">
                {learnMoreItem.title}
              </h2>
              <button 
                onClick={() => setLearnMoreItem(null)}
                className="p-2.5 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-decensat/50 active:scale-95"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Price & Headline */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 p-6 rounded-2xl bg-gradient-to-br from-decensat/10 via-transparent to-transparent border border-decensat/20">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1.5 rounded-lg bg-decensat/20 border border-decensat/30 mb-3">
                    <p className="text-decensat text-xs font-black uppercase tracking-widest">{learnMoreItem.headline}</p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase leading-tight">{learnMoreItem.subHeadline}</h3>
                </div>
                <div className="text-right sm:text-center bg-black/40 px-6 py-4 rounded-xl border border-white/10">
                  <span className="text-xs font-black text-decensat/60 font-mono block mb-1">USDC</span>
                  <div className="text-3xl sm:text-4xl font-black text-decensat font-mono">
                    ${learnMoreItem.price.toLocaleString()}
                  </div>
                </div>
              </div>

              {isReceptionist ? (
                <>
                  <div className="bg-gradient-to-r from-decensat/5 to-transparent border-l-4 border-decensat pl-6 pr-6 py-6 rounded-r-xl">
                    <h4 className="text-xl sm:text-2xl font-black text-decensat uppercase tracking-wide mb-4">AI Receptionist</h4>
                    <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-medium">
                      Never miss another lead again. Every missed call is lost revenue. Your AI Receptionist answers every call, qualifies leads, books appointments, and sends follow-ups — 24/7, without breaks, sick days, or salary negotiations.
                    </p>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-4">
                    <h4 className="text-lg sm:text-xl font-black text-decensat uppercase tracking-wide">The Problem</h4>
                    <ul className="space-y-2 text-slate-200 text-base sm:text-lg leading-relaxed">
                      <li>Missed calls = missed revenue.</li>
                      <li>Hiring a receptionist costs $40K–$80K+ annually.</li>
                      <li>Inconsistent call handling hurts conversions.</li>
                      <li>After-hours leads go straight to voicemail — and never call back.</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-decensat/10 to-transparent border border-decensat/20 rounded-xl p-6 space-y-4">
                    <h4 className="text-lg sm:text-xl font-black text-decensat uppercase tracking-wide">The Solution</h4>
                    <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                      An AI-powered voice assistant that answers every call, qualifies leads, books appointments, and sends follow-ups — instantly, 24/7, without human error.
                    </p>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-4">
                    <h4 className="text-lg sm:text-xl font-black text-decensat uppercase tracking-wide">What It Does</h4>
                    <ul className="space-y-2 text-slate-200 text-base sm:text-lg leading-relaxed">
                      <li><span className="font-semibold text-white">Instant Response:</span> Answers every call within seconds, day or night.</li>
                      <li><span className="font-semibold text-white">Lead Qualification:</span> Asks the right questions to identify high-intent prospects.</li>
                      <li><span className="font-semibold text-white">Automatic Booking:</span> Syncs with your calendar and books appointments on the spot.</li>
                      <li><span className="font-semibold text-white">Follow-Up Automation:</span> Sends confirmation emails, reminders, and next steps without manual effort.</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-4">
                    <h4 className="text-lg sm:text-xl font-black text-decensat uppercase tracking-wide">Why It Works</h4>
                    <ul className="space-y-2 text-slate-200 text-base sm:text-lg leading-relaxed">
                      <li><span className="font-semibold text-white">Speed Wins:</span> The first business to respond wins the client. Your AI responds instantly.</li>
                      <li><span className="font-semibold text-white">No More Bottlenecks:</span> Your team focuses on closing deals, not answering phones.</li>
                      <li><span className="font-semibold text-white">24/7 Availability:</span> Leads don't wait for business hours. Neither should your response.</li>
                      <li><span className="font-semibold text-white">Consistency:</span> Every caller gets the same high-quality experience, every time.</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-decensat/10 to-transparent border border-decensat/20 rounded-xl p-6 space-y-4">
                    <h4 className="text-lg sm:text-xl font-black text-decensat uppercase tracking-wide">The Payoff</h4>
                    <ul className="space-y-2 text-slate-200 text-base sm:text-lg leading-relaxed">
                      <li>Never lose a lead to a missed call again.</li>
                      <li>Save $40K–$80K+ annually vs. hiring a receptionist.</li>
                      <li>Book more appointments without increasing headcount.</li>
                      <li>Free your team to focus on revenue-generating activities.</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 space-y-4">
                    <h4 className="text-lg sm:text-xl font-black text-decensat uppercase tracking-wide">How It Works</h4>
                    <div className="grid gap-3 text-slate-200 text-base sm:text-lg leading-relaxed">
                      <div><span className="font-semibold text-white">1. Setup:</span> We configure your AI receptionist with your FAQs, booking preferences, and qualification criteria.</div>
                      <div><span className="font-semibold text-white">2. Integration:</span> We sync it with your CRM, calendar, and communication tools.</div>
                      <div><span className="font-semibold text-white">3. Go Live:</span> Your AI starts answering calls, qualifying leads, and booking appointments — instantly.</div>
                      <div><span className="font-semibold text-white">4. Optimization:</span> We monitor performance and optimize scripts for maximum conversions.</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-decensat/10 to-transparent border-l-4 border-decensat pl-6 pr-6 py-5 rounded-r-xl">
                    <p className="text-slate-100 text-base sm:text-lg leading-relaxed">
                      <span className="font-bold text-white">Data Privacy & Security:</span> All conversations are encrypted and stored securely. Your AI adheres to GDPR and CCPA compliance standards.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Full Description */}
                  <div className="bg-gradient-to-r from-decensat/5 to-transparent border-l-4 border-decensat pl-6 pr-6 py-6 rounded-r-xl">
                    <h4 className="text-base font-black text-decensat uppercase tracking-wider mb-4">About This Solution</h4>
                    <p className="text-slate-100 text-base leading-relaxed font-medium">
                      {learnMoreItem.subHeadline} is an enterprise-grade automation solution designed to streamline your operations with cutting-edge AI technology. This comprehensive bundle includes all the tools and support you need to implement, customize, and optimize this solution for your specific business needs.
                    </p>
                  </div>

                  {/* Services List */}
                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                    <h4 className="text-base font-black text-decensat uppercase tracking-wider mb-5">Included Services</h4>
                    <div className="grid gap-3">
                      {learnMoreItem.services?.map((service, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-decensat/10 to-transparent border border-decensat/30 hover:border-decensat/50 transition-all">
                          <span className="text-sm font-bold text-slate-100 uppercase tracking-wide">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-gradient-to-br from-decensat/10 to-transparent border border-decensat/20 rounded-xl p-6">
                    <h4 className="text-base font-black text-decensat uppercase tracking-wider mb-5">Key Benefits</h4>
                    <ul className="space-y-3 text-slate-100 text-base font-medium">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-decensat" />
                        24/7 automated response and optimization
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-decensat" />
                        Enterprise-grade security and compliance
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-decensat" />
                        Seamless integration with existing systems
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-decensat" />
                        Dedicated support and optimization team
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="border-t border-white/10 pt-6 mt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => window.open('https://calendar.app.google/H8qgBthiAd8LoosDA', '_blank')}
                    className="flex-1 py-3 px-6 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 active:scale-95 border border-white/20 whitespace-nowrap"
                  >
                    <span>Book a Call</span>
                  </button>
                  <button 
                    onClick={handleStartAuditFromModal}
                    className="flex-1 py-3 px-6 bg-decensat hover:bg-white text-black rounded-full font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap shadow-lg"
                  >
                    <span>Start Audit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1920px] mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-decensat pl-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[9px] font-black uppercase tracking-widest w-fit mb-3">
              <Brain strokeWidth={3} className="w-3 h-3" />
              <span>AI Automation Bundles</span>
            </div>
            <h2 className="font-black text-white uppercase leading-[0.95]" style={{fontSize: 'clamp(1.15rem, 4vw, 2.35rem)', letterSpacing: '-0.04em', marginBottom: '0.5rem'}}>
              AI Automation <span className="text-decensat italic">Bundles</span>
            </h2>
            <p className="text-base text-slate-400 font-bold uppercase tracking-tight max-w-2xl italic">
              Modular AI solutions designed to automate, assist, and amplify.
            </p>
          </div>
          
          {showArrows && (
            <div className="hidden md:flex gap-4 shrink-0 pb-2">
               <button 
                  onClick={() => scroll('up')} 
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-xl"
               >
                  <ChevronUp strokeWidth={3} className="w-6 h-6 sm:w-7 sm:h-7" />
               </button>
               <button 
                  onClick={() => scroll('down')} 
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-xl"
               >
                  <ChevronDown strokeWidth={3} className="w-6 h-6 sm:w-7 sm:h-7" />
               </button>
            </div>
          )}
        </div>

        <div 
          ref={scrollRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-12 transition-all duration-500 ${showArrows ? 'lg:max-h-[1400px] overflow-y-auto no-scrollbar scroll-smooth' : ''}`}
        >
          {AI_OPTIMIZATION_NODES.map((item) => (
            <div key={item.id} className="h-full">
              <AiNodeCard item={item} onStartAudit={handleStartAuditFromModal} onLearnMore={handleLearnMore} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AiSolutionsSection;