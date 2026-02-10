
import React, { useState, useEffect, useMemo } from 'react';
import { MessageSquare, X, ShieldCheck, Clock, ExternalLink, Sparkles, Send } from 'lucide-react';

const SUPPORT_PHONE = "+15550000000"; // Replace with actual Meta Business Number

const WhatsAppSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatus = useMemo(() => {
    // Standard Support Hours: 9 AM - 6 PM
    const isWorkingHours = (date: Date, offset: number) => {
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
      const local = new Date(utc + (3600000 * offset));
      const hours = local.getHours();
      return hours >= 9 && hours < 18;
    };

    const isEST = isWorkingHours(currentTime, -5); // EST (UTC-5)
    const isIST = isWorkingHours(currentTime, 5.5); // IST (UTC+5.5)

    return {
      active: isEST || isIST,
      est: isEST,
      ist: isIST
    };
  }, [currentTime]);

  const getTimeStrings = useMemo(() => {
    const format = (offset: number) => {
      const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
      return new Date(utc + (3600000 * offset)).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
      });
    };
    return { est: format(-5), ist: format(5.5) };
  }, [currentTime]);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[110] pointer-events-none">
      {/* Expanded Card */}
      <div className={`pointer-events-auto absolute bottom-20 left-0 w-[calc(100vw-2rem)] sm:w-80 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-2xl transition-all duration-500 origin-bottom-left ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-4'}`}>
        <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center bg-slate-50/50">
           <div className="flex items-center gap-3">
             <div className="p-2.5 bg-green-500 rounded-xl text-white shadow-lg shadow-green-500/20">
               <MessageSquare size={20} />
             </div>
             <div>
               <h4 className="text-sm font-black text-slate-950 uppercase tracking-widest">Support Hub</h4>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">Meta Business API</p>
             </div>
           </div>
           <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-950 transition-colors">
             <X size={24} />
           </button>
        </div>

        <div className="p-8 space-y-8">
           <div className="space-y-4">
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">EST Support (NYC)</span>
                <span className={getStatus.est ? 'text-green-600' : 'text-rose-600'}>{getTimeStrings.est}</span>
             </div>
             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500">IST Support (BLR)</span>
                <span className={getStatus.ist ? 'text-green-600' : 'text-rose-600'}>{getTimeStrings.ist}</span>
             </div>
           </div>

           <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${getStatus.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-rose-500'}`} />
                <span className="text-[11px] font-black text-slate-950 uppercase tracking-widest">
                  {getStatus.active ? 'Nodes Available Now' : 'Nodes Out-of-Sync'}
                </span>
             </div>
             <p className="text-[12px] text-slate-600 font-bold leading-relaxed">
               {getStatus.active 
                 ? "Direct line to advisory leads. Response time: sub-5 mins." 
                 : "Out of hours. Signal recorded. Response expected: 9AM local."}
             </p>
           </div>

           <a 
             href={`https://wa.me/${SUPPORT_PHONE.replace(/\+/g, '')}?text=Direct%20Advisory%20Inquiry%3A%20`}
             target="_blank"
             rel="noopener noreferrer"
             className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-slate-900 transition-all shadow-xl active:scale-95 group"
           >
             Connect Directly <Send size={16} className="text-juice-400 group-hover:translate-x-1 transition-transform" />
           </a>
        </div>

        <div className="p-4 bg-slate-50/50 border-t-2 border-slate-50 rounded-b-[2.5rem] flex items-center justify-center gap-2">
           <ShieldCheck size={14} className="text-green-600" />
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">End-to-End Encrypted Handshake</span>
        </div>
      </div>

      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto p-4 sm:p-5 rounded-full bg-slate-950 text-white shadow-2xl transition-all duration-300 active:scale-90 border-2 border-white/10 group ${isOpen ? 'rotate-90' : 'hover:scale-110'}`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} className="text-juice-400" />}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatus.active ? 'bg-green-400' : 'bg-rose-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-4 w-4 ${getStatus.active ? 'bg-green-500' : 'bg-rose-500'}`}></span>
        </span>
      </button>
    </div>
  );
};

export default WhatsAppSupport;
