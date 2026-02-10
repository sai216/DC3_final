
import React, { useState, useRef, useEffect } from 'react';
import { generateSuraResponseStream } from '../services/geminiService';
import { ChatMessage } from '../types';
import { 
  Bot, User, ShieldCheck, 
  Loader2, Terminal, Send, 
  Zap, Mic, MicOff, Crosshair, Target, X, ExternalLink, Link, Activity
} from 'lucide-react';

interface AiConciergeProps {
  activeSection?: string;
}

const AiConcierge: React.FC<AiConciergeProps> = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Initial greeting message added via useEffect to ensure it is part of the state
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: 'model', text: 'SURA_GUIDE_v4.02 initialized.\n\nI can assist with navigation through the Assessment Hub, exploring node clusters, or building your 443 stack. I am currently monitoring the active node context to provide surgical guidance.', timestamp: Date.now() }
      ]);
    }
  }, []);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTargeting, setIsTargeting] = useState(false);
  const [targetSelector, setTargetSelector] = useState('');
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    document.querySelectorAll('[data-sura-target="true"]').forEach(el => {
      el.removeAttribute('data-sura-target');
      const scanner = el.querySelector('.sura-hud-overlay');
      if (scanner) scanner.remove();
    });

    if (!isOpen) return;

    const effectiveTarget = activeTarget || `#${activeSection}`;

    if (effectiveTarget) {
      try {
        const element = document.querySelector(effectiveTarget);
        if (element) {
          element.setAttribute('data-sura-target', 'true');
          
          const overlay = document.createElement('div');
          overlay.className = 'sura-hud-overlay absolute inset-0 z-[60] pointer-events-none overflow-hidden';
          overlay.innerHTML = `
            <div class="absolute top-6 left-6 flex items-center gap-3 bg-decensat text-black px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] shadow-glow-sm animate-in fade-in zoom-in-95 duration-500">
               <span class="relative flex h-2 w-2">
                 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                 <span class="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
               </span> 
               SURA_CONTEXT_LOCKED
            </div>
            <div class="absolute bottom-6 right-6 text-decensat opacity-40 font-mono text-[8px] uppercase tracking-widest hidden md:block">
              NODE_ID: ${activeSection?.toUpperCase() || 'ROOT'} // SIGNAL_SYNC_STABLE
            </div>
          `;
          
          if (getComputedStyle(element).position === 'static') {
            (element as HTMLElement).style.position = 'relative';
          }
          element.appendChild(overlay);

          if (activeTarget && isTargeting) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } catch (e) {
        console.error("Invalid CSS selector provided to SURA:", effectiveTarget);
      }
    }
  }, [activeTarget, activeSection, isOpen, isTargeting]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const applyTarget = () => {
    if (targetSelector.trim()) {
      setActiveTarget(targetSelector);
      setIsTargeting(false);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: `PROTOCOL_TARGET_LOCKED: [${targetSelector}]. All subsequent signal processing will be isolated to this node context.`, 
        timestamp: Date.now() 
      }]);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const messageText = overrideText || input;
    if (!messageText.trim() || loading) return;

    if (isListening) recognitionRef.current?.stop();

    const userMsg: ChatMessage = { role: 'user', text: messageText, timestamp: Date.now() };
    const historySnapshot = [...messages, userMsg];
    setMessages(historySnapshot);
    setInput('');
    setLoading(true);

    const modelTimestamp = Date.now() + 1;
    setMessages(prev => [...prev, { role: 'model', text: '', timestamp: modelTimestamp }]);

    try {
      const currentContext = activeTarget || `#${activeSection}`;
      const result = await generateSuraResponseStream(
        historySnapshot,
        (chunkText) => {
          setMessages(prev => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === 'model') {
              last.text += chunkText;
            }
            return next;
          });
        },
        'general',
        currentContext
      );
      
      if (result.sources) {
        setMessages(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === 'model') {
            last.sources = result.sources;
          }
          return next;
        });
      }
    } catch (e) {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === 'model' && !last.text) {
          last.text = "Signal interference detected. System recalibrating.";
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[120] w-12 h-12 xs:w-14 xs:h-14 sm:w-20 sm:h-20 rounded-xl xs:rounded-2xl sm:rounded-[2rem] shadow-2xl transition-all duration-500 border-2 ${isOpen ? 'scale-0' : 'scale-100'} bg-slate-950 border-decensat/20 text-decensat hover:border-decensat hover:scale-110 active:scale-90 flex items-center justify-center transform-gpu`}
        aria-label="Activate Sura Concierge"
      >
        <Zap size={24} className="animate-pulse sm:w-7 sm:h-7" />
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-decensat rounded-full animate-ping" />
      </button>

      <div 
        className={`fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[130] w-[calc(100vw-2rem)] sm:w-[400px] bg-zinc-950 border-[3px] sm:border-4 border-white/10 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,1)] flex flex-col transition-all duration-500 origin-bottom-right transform-gpu ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '600px', maxHeight: '85vh' }}
        role="complementary"
        aria-label="Sura AI Concierge Interface"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between bg-black rounded-t-[1.8rem] sm:rounded-t-[2.2rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-decensat/5 pointer-events-none" />
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-decensat/10 border border-decensat/30 flex items-center justify-center text-decensat ${loading ? 'animate-pulse' : ''}`}>
              {loading ? <Activity size={16} className="animate-spin-slow sm:w-5 sm:h-5" /> : <Bot size={16} className="sm:w-5 sm:h-5" />}
            </div>
            <div className="flex flex-col">
               <span className="font-black text-white text-[10px] sm:text-xs uppercase tracking-widest leading-none">Sura Guide</span>
               <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5">
                  <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${loading ? 'bg-decensat animate-ping' : 'bg-decensat animate-pulse'}`} />
                  <span className={`text-[7px] sm:text-[8px] font-mono tracking-tighter uppercase font-black ${loading ? 'text-decensat' : 'text-slate-500'}`}>
                    {loading ? 'PROCESSING_SIGNAL' : 'Link Active // Sol_v4'}
                  </span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 relative z-10">
            <button 
              onClick={() => setIsTargeting(!isTargeting)}
              className={`p-2 rounded-lg transition-all ${isTargeting || activeTarget ? 'bg-decensat text-black' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              title="Specify Target Component"
            >
              <Crosshair size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all">
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Console View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-zinc-950/40">
           {(activeTarget || activeSection) && (
             <div className="sticky top-0 z-20 px-5 sm:px-6 py-1.5 sm:py-2 bg-decensat/90 backdrop-blur-md flex items-center justify-between shadow-lg">
               <div className="flex items-center gap-2">
                 <Target size={10} className="text-black sm:w-3 sm:h-3" />
                 <span className="text-[8px] sm:text-[9px] font-black text-black uppercase tracking-widest truncate max-w-[150px] sm:max-w-[200px]">
                   CONTEXT_SYNC: {activeTarget ? `MANUAL_[${activeTarget}]` : `AUTO_PHASE_${activeSection?.toUpperCase()}`}
                 </span>
               </div>
               <button onClick={() => setActiveTarget(null)} className="text-black hover:scale-110 transition-transform">
                 <X size={10} strokeWidth={3} className="sm:w-3 sm:h-3" />
               </button>
             </div>
           )}

           <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-1 sm:slide-in-from-bottom-2 duration-300`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all ${msg.role === 'model' ? 'bg-decensat/10 border-decensat/20 text-decensat' : 'bg-white/5 border-white/10 text-white'}`}>
                    {msg.role === 'model' ? <Bot size={12} className="sm:w-3.5 sm:h-3.5" /> : <User size={12} className="sm:w-3.5 sm:h-3.5" />}
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2 max-w-[88%] sm:max-w-[85%]">
                    <div className={`p-4 sm:p-5 rounded-2xl text-[10px] sm:text-[11px] md:text-xs whitespace-pre-wrap leading-relaxed shadow-2xl font-mono uppercase tracking-tight relative transition-all ${msg.role === 'model' ? 'bg-zinc-900/90 text-slate-200 border border-white/5 rounded-tl-none' : 'bg-decensat text-black border border-decensat rounded-tr-none'}`}>
                      {msg.text || (loading && idx === messages.length - 1 ? <div className="typing-dots"><span></span><span></span><span></span></div> : '')}
                      
                      {loading && idx === messages.length - 1 && msg.text && (
                        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/10">
                           <div className="w-1 h-1 rounded-full bg-decensat animate-ping" />
                           <span className="text-[7px] font-mono text-decensat uppercase tracking-widest animate-pulse">Synthesis_Active...</span>
                        </div>
                      )}

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 space-y-2">
                           <div className="flex items-center gap-2 text-[7px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
                              <Link size={8} className="sm:w-2.5 sm:h-2.5" /> Grounding_Nodes
                           </div>
                           <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {msg.sources.map((source, sIdx) => (
                                <a 
                                  key={sIdx}
                                  href={source.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/5 border border-white/10 rounded hover:bg-decensat/20 hover:border-decensat/30 transition-all group/link"
                                >
                                  <span className="text-[7px] sm:text-[8px] text-slate-400 group-hover/link:text-decensat font-mono truncate max-w-[100px] sm:max-w-[120px]">
                                    {source.title || source.uri}
                                  </span>
                                  <ExternalLink size={7} className="text-slate-600 group-hover/link:text-decensat sm:w-2 sm:h-2" />
                                </a>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && !messages[messages.length - 1]?.text && (
                 <div className="flex gap-3 sm:gap-4 animate-in slide-in-from-bottom-2 duration-300">
                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-decensat border border-decensat flex items-center justify-center text-black shadow-glow-sm">
                     <Bot size={12} className="animate-spin sm:w-3.5 sm:h-3.5" />
                   </div>
                   <div className="flex flex-col gap-1.5 sm:gap-2">
                      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 text-decensat text-[9px] sm:text-[10px] font-mono border border-white/5 rounded-tl-none flex items-center gap-3 sm:gap-4">
                        <Terminal size={12} className="animate-pulse sm:w-3.5 sm:h-3.5" />
                        <span className="tracking-widest uppercase font-black">Analyzing_Signal</span>
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                      <span className="text-[7px] sm:text-[8px] font-black text-slate-700 uppercase tracking-widest ml-1 italic">SURA_THINKING_v4.5</span>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
           </div>
        </div>

        {/* Input Interface */}
        <div className="p-4 sm:p-6 border-t border-white/5 bg-black/80 backdrop-blur-md rounded-b-[1.8rem] sm:rounded-b-[2.2rem]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleListening}
              className={`p-3 sm:p-4 rounded-xl transition-all flex items-center justify-center border ${isListening ? 'bg-decensat border-decensat text-black shadow-[0_0_20px_rgba(163,230,53,0.4)]' : 'bg-zinc-900 border-white/5 text-slate-500 hover:text-decensat hover:border-decensat/20'}`}
              title={isListening ? "Stop Listening" : "Vocal Uplink"}
            >
              {isListening ? <MicOff size={16} className="animate-pulse sm:w-4.5 sm:h-4.5" /> : <Mic size={16} className="sm:w-4.5 sm:h-4.5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Recording..." : "Signal intent..."}
              disabled={loading}
              className="flex-1 bg-zinc-900 border-2 border-white/5 rounded-xl px-4 sm:px-5 py-3 sm:py-4 text-[10px] sm:text-[11px] text-white font-mono placeholder:text-slate-700 focus:outline-none focus:border-decensat transition-all disabled:opacity-50"
            />
            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-3 sm:p-4 bg-decensat text-black rounded-xl hover:bg-white disabled:opacity-30 disabled:grayscale transition-all shadow-xl active:scale-95 flex items-center justify-center transform-gpu"
            >
              {loading ? <Loader2 size={16} className="animate-spin sm:w-4.5 sm:h-4.5" /> : <Send size={16} className="sm:w-4.5 sm:h-4.5" />}
            </button>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2">
             <ShieldCheck size={10} className="text-slate-600 sm:w-2.5 sm:h-2.5" />
             <span className="text-[7px] sm:text-[8px] font-mono text-slate-600 uppercase tracking-widest">End-to-End Encryption v1.1</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiConcierge;
