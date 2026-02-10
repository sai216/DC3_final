
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Zap, ShieldCheck, Cpu, ArrowRight, User, Link, ExternalLink, Terminal, Activity } from 'lucide-react';
import { generateSuraResponseStream } from '../services/geminiService';
import { ChatMessage } from '../types';

const SuraSidebarAgent: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Hi there. I can help with your next steps. How can I assist?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: textToSend, timestamp: Date.now() };
    const historySnapshot = [...messages, userMsg];
    setMessages(historySnapshot);
    setInput('');
    setLoading(true);
    window.dispatchEvent(new CustomEvent('ai-activity', { detail: true }));

    // Add model message placeholder
    const modelTimestamp = Date.now() + 1;
    setMessages(prev => [...prev, { role: 'model', text: '', timestamp: modelTimestamp }]);

    try {
      const result = await generateSuraResponseStream(
        historySnapshot,
        (chunk) => {
          setMessages(prev => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === 'model') {
              last.text += chunk;
            }
            return next;
          });
        },
        'eligibility'
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
      console.error(e);
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === 'model' && !last.text) {
          last.text = "Sorry, something went wrong. Please try again.";
        }
        return next;
      });
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent('ai-activity', { detail: false }));
    }
  };

  return (
    <div className="mt-6 border-t border-white/5 pt-6">
      {!isActive ? (
        <button 
          onClick={() => setIsActive(true)}
          className="w-full p-4 bg-juice-900/20 border border-juice-500/30 rounded-xl hover:bg-juice-900/30 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-1">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-juice-500 flex items-center justify-center text-white shadow-lg shadow-juice-500/20 group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-white">Activate Sura Agent</div>
              <div className="text-[10px] text-juice-400 font-mono uppercase tracking-wider">WhatsApp BDR Integration</div>
            </div>
          </div>
        </button>
      ) : (
        <div className="bg-node-900 rounded-xl border border-white/10 flex flex-col h-[400px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
           {/* Terminal Header */}
           <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${loading ? 'bg-decensat animate-ping' : 'bg-green-500'}`} />
                 <span className={`text-[10px] font-mono ${loading ? 'text-decensat' : 'text-gray-400'}`}>
                   {loading ? 'RECEIVING_PACKETS' : 'Sura Agent'}
                 </span>
              </div>
              <button 
                onClick={() => setIsActive(false)}
                className="text-gray-600 hover:text-white transition-colors"
              >
                 <Zap size={12} />
              </button>
           </div>

           {/* Chat Content */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.role === 'model' ? 'bg-juice-600' : 'bg-node-700'}`}>
                      {m.role === 'model' ? <Cpu size={12} className="text-white"/> : <User size={12} className="text-white"/>}
                   </div>
                   <div className={`p-3 rounded-lg text-[11px] leading-relaxed max-w-[85%] relative ${m.role === 'model' ? 'bg-node-800 text-gray-300 border border-white/5' : 'bg-juice-600/20 text-white border border-juice-500/30'}`}>
                      <p className="whitespace-pre-wrap">{m.text || (loading && i === messages.length - 1 ? <div className="typing-dots"><span></span><span></span><span></span></div> : "")}</p>
                      
                      {/* Sub-bubble indicator for active streaming */}
                      {loading && i === messages.length - 1 && m.text && (
                        <div className="mt-2 flex items-center gap-1.5 opacity-50">
                           <Activity size={8} className="animate-pulse text-juice-400" />
                           <span className="text-[7px] font-mono uppercase tracking-tighter">Syncing_Packets...</span>
                        </div>
                      )}

                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                           <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                              <Link size={8} /> Sources
                           </div>
                           <div className="flex flex-wrap gap-1.5">
                              {m.sources.map((source, sIdx) => (
                                <a 
                                  key={sIdx}
                                  href={source.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-juice-400 hover:bg-juice-500/10 transition-all"
                                >
                                  <span className="truncate max-w-[100px]">{source.title || 'Signal Source'}</span>
                                  <ExternalLink size={6} />
                                </a>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              ))}
              {/* Initial Thinking Block (Shown when text is empty and loading) */}
              {loading && !messages[messages.length - 1]?.text && (
                <div className="flex gap-2 animate-in fade-in duration-300">
                   <div className="w-6 h-6 rounded-full bg-juice-600 flex items-center justify-center shrink-0">
                      <Terminal size={10} className="text-white animate-pulse"/>
                   </div>
                   <div className="p-3 rounded-lg bg-node-800 text-juice-400 text-[9px] font-mono border border-white/5 flex items-center gap-3">
                      <span className="uppercase font-black">SCRAPING_SIGNALS</span>
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                   </div>
                </div>
              )}
           </div>

           {/* Quick Actions */}
            {messages.length === 1 && !loading && (
             <div className="px-4 pb-2 flex flex-wrap gap-2">
               <button 
                onClick={() => handleSend("I need help getting started.")}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 hover:text-white hover:border-juice-500 transition-all"
               >
                 Get Started
               </button>
               <button 
                 onClick={() => handleSend("Show me the next steps.")}
                 className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 hover:text-white hover:border-juice-500 transition-all"
               >
                 Next Steps
               </button>
             </div>
            )}

           {/* Input Area */}
           <div className="p-3 border-t border-white/5 bg-black/20">
              <div className="flex gap-2">
                 <input 
                   type="text"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder={loading ? "Synthesizing response..." : "Signal intent..."}
                   disabled={loading}
                   className="flex-1 bg-node-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-juice-500 font-mono disabled:opacity-50"
                 />
                 <button 
                   onClick={() => handleSend()}
                   disabled={loading || !input.trim()}
                   className="p-2 bg-juice-600 text-white rounded-lg hover:bg-juice-500 transition-colors disabled:opacity-30"
                 >
                    {loading ? <Activity size={14} className="animate-spin" /> : <Send size={14} />}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SuraSidebarAgent;
