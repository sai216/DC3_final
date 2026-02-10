import React, { useState } from 'react';
import { generateSeoMetadata } from '../services/geminiService';
import { Search, Loader2, Check, Copy, Terminal, Zap, X, Sparkles, ShieldCheck } from 'lucide-react';
import { SeoMetadata } from '../types';

const SeoTool: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState<SeoMetadata | null>(null);
  const [copied, setCopied] = useState(false);

  const analyzeContent = async () => {
    setLoading(true);
    window.dispatchEvent(new CustomEvent('ai-activity', { detail: true }));
    
    // Dynamically capture content from the DOM
    const heroEl = document.getElementById('hero');
    const heroContent = heroEl?.innerText || "At Machine Speed. Deterministic Reputation Marketplace for Top Talent-on-Rails.";

    try {
      // Updated call signature to remove feedContent
      const result = await generateSeoMetadata(heroContent, "");
      setMetadata(result);
    } catch (e) {
      console.error("SEO Tool Error:", e);
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('ai-activity', { detail: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-36 right-4 sm:right-10 z-[120] p-4 rounded-2xl bg-slate-950 text-decensat border-2 border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-all group"
        title="Institutional Metadata Tool"
      >
        <Search size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-decensat opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-decensat"></span>
        </span>
      </button>

      {/* Analysis Panel */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 sm:right-10 z-[130] w-[calc(100vw-2rem)] sm:w-[450px] bg-zinc-950 border-4 border-white/10 rounded-[2.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-white/5 bg-black flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-decensat/10 flex items-center justify-center text-decensat border border-decensat/30">
                <Terminal size={24} />
              </div>
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest leading-none mb-1">SEO_Synthesizer</h4>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-decensat animate-pulse" />
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-black">Node_Scan: Active</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-zinc-950/40">
            {!metadata ? (
              <div className="py-12 text-center space-y-8">
                <div className="space-y-3">
                  <h3 className="text-white font-black text-xl uppercase tracking-tighter">Signal Analysis Required</h3>
                  <p className="text-slate-400 text-xs font-bold px-8 leading-relaxed uppercase tracking-widest opacity-80">Gemini will scan architectural and institutional signals to synthesize optimized metadata.</p>
                </div>
                <button 
                  onClick={analyzeContent}
                  disabled={loading}
                  className="w-full py-6 bg-decensat hover:bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 group"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} className="group-hover:animate-pulse" />}
                  {loading ? 'ANALYZING_NODES...' : 'EXECUTE_SEO_SCAN'}
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black text-decensat uppercase tracking-[0.4em]">Protocol_Title</label>
                    <button onClick={() => copyToClipboard(metadata.title)} className="text-slate-500 hover:text-white transition-all p-1 bg-white/5 rounded-lg border border-white/10">
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-5 bg-black border-2 border-white/5 rounded-2xl text-[11px] font-mono text-slate-100 leading-relaxed shadow-inner">
                    {metadata.title}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black text-decensat uppercase tracking-[0.4em]">Protocol_Description</label>
                    <button onClick={() => copyToClipboard(metadata.description)} className="text-slate-500 hover:text-white transition-all p-1 bg-white/5 rounded-lg border border-white/10">
                      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-5 bg-black border-2 border-white/5 rounded-2xl text-[11px] font-mono text-slate-100 leading-relaxed shadow-inner">
                    {metadata.description}
                  </div>
                </div>

                <button 
                  onClick={() => setMetadata(null)}
                  className="w-full py-4 bg-white/5 border-2 border-white/10 text-slate-500 hover:text-white hover:border-white/20 font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all"
                >
                  Flush and Re-analyze
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-black border-t border-white/5 flex items-center justify-center gap-3">
            <ShieldCheck size={14} className="text-decensat" />
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">Meta_Integrity_Verified_V2</span>
          </div>
        </div>
      )}
    </>
  );
};

export default SeoTool;