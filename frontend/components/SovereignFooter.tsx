import React, { useState } from 'react';
import { Globe, ArrowRight, Instagram, Twitter, Linkedin, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';

const SovereignFooter: React.FC = () => {
  return (
    <footer className="bg-[#020617] py-24 px-6 lg:px-12 border-t border-white/5 text-white relative overflow-hidden transition-all duration-700">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-decensat/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1920px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 bg-decensat rounded-2xl flex items-center justify-center text-black shadow-2xl shadow-decensat/20 transition-transform hover:scale-110">
                <span className="font-black text-xl italic">DC3</span>
              </div>
              <span className="text-white font-black text-3xl tracking-tighter uppercase leading-tight whitespace-pre-line">
                Decensat Design{"\n"}& Development
              </span>
            </div>
            <p className="text-slate-500 text-xl leading-relaxed max-w-xl mb-12 font-bold uppercase tracking-tight">
              HIGH-PERFORMANCE BUILDS & MANAGED TECHNICAL SERVICES UNIFING A SINGLE EXECUTION SYSTEM.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 lg:gap-10">
              <div className="flex gap-4">
                {[Instagram, Twitter, Linkedin, MessageCircle].map((Icon, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-decensat transition-all cursor-pointer group hover:-translate-y-1">
                    <Icon size={20} className="text-slate-500 group-hover:text-decensat" />
                  </div>
                ))}
              </div>
              
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              
              {/* Link: Founder|Affiliate Voices */}
              <a href="#" className="flex items-center gap-4 px-6 py-3.5 bg-white/5 border border-white/10 rounded-xl hover:border-decensat hover:bg-decensat hover:text-black transition-all group font-mono text-[10px] font-black uppercase tracking-[0.4em]">
                 Founder|Affiliate Voices <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 text-[11px] uppercase tracking-[0.4em] border-l-4 border-decensat pl-4">Network Hubs</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
              <li><a href="#" className="hover:text-decensat transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Strategy Principal Node</a></li>
              <li><a href="#" className="hover:text-decensat transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Web3 Treasury Tech</a></li>
              <li><a href="#" className="hover:text-decensat transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Full Stack Operations</a></li>
              <li><a href="#" className="hover:text-decensat transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> AI Workflow Automation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black mb-8 text-[11px] uppercase tracking-[0.4em] border-l-4 border-blue-500 pl-4">Learner Pathways</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
              {/* Updated Link: L2L SPECIALIST CONTENT */}
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> L2L SPECIALIST CONTENT</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Phase 0-4 Audits</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Reputation Index (SRT)</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group"><ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" /> Node ID Provisioning</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">
            <ShieldCheck size={14} className="text-decensat" />
            © 2024 DECENSAT DESIGN. POWERED BY ASSURATIVE.AI
          </div>
          <div className="flex flex-wrap gap-8 lg:gap-12 text-[10px] font-mono font-black uppercase tracking-[0.3em] text-slate-500">
             <span className="hover:text-white transition-colors cursor-pointer">PRIVACY_PROTOCOL</span>
             <span className="hover:text-white transition-colors cursor-pointer">TERMS_OF_SIGNAL</span>
             <span className="hover:text-white transition-colors cursor-pointer">COOKIE_NODES</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SovereignFooter;