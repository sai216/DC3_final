import React from 'react';
import { ArrowRight, Zap, Layers, Sprout, Globe, TreePine, CloudRain, Sun, Waves, Database } from 'lucide-react';

const TalentBadge = ({ title, subtitle, icon: Icon, isDark = true, locations, bgColor }: { title: string, subtitle?: string, icon: any, isDark?: boolean, locations?: string[], bgColor?: string }) => (
  <div className="flex flex-col items-center w-full">
    <div className="w-px h-10 bg-slate-800" />
    <div className="w-4 h-4 rounded-full border-[3px] border-slate-700 bg-black -mt-0.5 z-10" />
    
    <div className={`w-full sm:w-[310px] rounded-[3rem] border-4 flex flex-col items-start p-8 lg:p-10 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_64px_128px_-32px_rgba(163,230,53,0.8)] relative overflow-hidden mt-3 group transform-gpu bg-black border-white/10 shadow-2xl`}>
      <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:scale-125 transition-transform duration-[1500ms] pointer-events-none transform-gpu">
        <Icon className="w-32 h-32" />
      </div>

      <div className="flex justify-between w-full items-start mb-6 relative z-10">
        <div className={`p-4 bg-black rounded-2xl border-2 border-white/10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-2xl`}>
          <Icon className={`w-10 h-10 ${bgColor || 'text-decensat'} transition-all`} strokeWidth={2.5} />
        </div>
      </div>
      
      <h3 className="text-lg lg:text-xl font-black text-white mb-2 tracking-tighter leading-tight uppercase group-hover:text-decensat transition-colors relative z-10">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[9px] font-bold text-slate-600 leading-relaxed mb-4 uppercase tracking-[0.2em] relative z-10">{subtitle}</p>
      )}

      {locations && (
        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
          {locations.map(loc => (
            <span key={loc} className="text-[8px] font-black bg-white/5 border border-white/10 text-slate-500 px-2.5 py-1 rounded-lg uppercase tracking-widest hover:border-decensat transition-colors">{loc}</span>
          ))}
        </div>
      )}
      
      <div className="mt-auto pt-6 border-t border-white/5 w-full flex items-center justify-between relative z-10">
        <div className="flex flex-col">
          <p className="text-[9px] font-black text-decensat uppercase tracking-[0.4em] flex items-center gap-2">
            <Zap size={10} className="animate-pulse" /> DEPLOY_ASSET
          </p>
        </div>
        <ArrowRight size={16} className="text-slate-700 group-hover:text-decensat group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </div>
);

const SuccessList: React.FC = () => {
  return (
    <section id="node-infrastructure" className="py-12 lg:py-20 px-6 lg:px-12 bg-[#020617] border-y-8 border-white/5 transition-colors duration-500 overflow-hidden min-h-fit flex flex-col justify-center">
      <div className="max-w-[1920px] mx-auto w-full">
        
        {/* Normalized Model Header */}
        <div className="mb-12 flex flex-col gap-8 border-l-[8px] border-decensat pl-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[9px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(163,230,53,0.15)] w-fit">
            <Sprout size={14} strokeWidth={3} className="animate-pulse" />
            <span>ARCHITECTURE_PROTOCOL_LOCKED</span>
          </div>
          <div className="max-w-4xl">
            <h2 className="font-black text-white uppercase leading-[0.95]" style={{fontSize: 'clamp(1.15rem, 4vw, 2.35rem)', letterSpacing: '-0.04em', marginBottom: '1rem'}}>
              Bundle <span className="text-decensat italic">Architecture</span>
            </h2>
            <p className="text-lg lg:text-2xl text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
              Operational friction pruned. High-fidelity delivery through refined node orchestration.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 xl:gap-20 items-start">
          {/* Left Feature Side */}
          <div className="lg:col-span-5">
            <div className="p-8 lg:p-10 bg-zinc-950/50 rounded-[3rem] border-2 border-white/5 mb-10 shadow-2xl group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                <Globe size={120} className="text-white" />
              </div>
              <h4 className="text-decensat font-black text-[10px] uppercase tracking-[0.5em] mb-8 flex items-center gap-4 opacity-70 relative z-10 font-mono">
                <Globe size={14} className="animate-spin-slow" /> Network_Trunk_Live
              </h4>
              <ul className="space-y-6 relative z-10">
                {[
                  { icon: Sun, label: 'Strategy Principal', sub: 'Brand Node', color: 'text-orange-400' },
                  { icon: Layers, label: 'Engineering Principal', sub: 'Ops Node', color: 'text-pink-400' },
                  { icon: TreePine, label: 'Performance Principal', sub: 'Native Node', color: 'text-decensat' },
                  { icon: CloudRain, label: 'Automation Principal', sub: 'Agent Node', color: 'text-purple-400' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6 group/item cursor-default items-center">
                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${item.color} shrink-0 border-2 border-white/5 group-hover/item:scale-110 transition-all duration-500 shadow-xl`}>
                      <item.icon size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="text-white font-black text-base block uppercase tracking-tight">{item.label}</span>
                      <span className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mt-0.5 block">{item.sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Graphical Side */}
          <div className="lg:col-span-7">
            <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start justify-start transform-gpu">
              {/* Infrastructure Column */}
              <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.6em] mb-4 text-center w-full">INFRA_PROTOCOL</div>
                <TalentBadge 
                  title="Web3 Fintech"
                  subtitle="Settlement Rails"
                  locations={['USA', 'UAE']}
                  icon={Waves}
                  bgColor="text-decensat"
                />
                <TalentBadge 
                  title="Full Stack Ops"
                  icon={Layers}
                  bgColor="text-pink-500"
                />
                <TalentBadge 
                  title="Mobile Native"
                  subtitle="High Performance"
                  icon={TreePine}
                  isDark
                  bgColor="text-decensat"
                />
              </div>

              {/* Strategy Column */}
              <div className="flex flex-col gap-4 md:pt-24 w-full md:w-auto">
                <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.6em] mb-4 text-center w-full">BRAND_PROTOCOL</div>
                <TalentBadge 
                  title="Creative Hub" 
                  subtitle="Identity Nodes"
                  icon={Sun}
                  bgColor="text-orange-500"
                />
                <TalentBadge 
                  isDark
                  title="AI Workflows" 
                  subtitle="Agentic Systems"
                  icon={CloudRain}
                  bgColor="text-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessList;