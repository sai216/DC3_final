import React, { useState } from 'react';
import { Send, ShieldCheck, MessageSquare, ArrowRight, Lock, CheckCircle2, Zap, Loader2, Rocket, AlertCircle } from 'lucide-react';

const IntentCapture: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // RFC 5322 Compliant Email Regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("RFC-compliant email format required for signal transmission.");
      return;
    }

    if (formState === 'submitting') return;
    setFormState('submitting');
    
    // Simulate Brevo/n8n submission
    setTimeout(() => {
      setFormState('success');
    }, 2000);
  };

  if (formState === 'success') {
    return (
      <section id="intent" className="py-32 px-4 bg-[#020617] border-y border-white/5 flex items-center justify-center">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-decensat/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-decensat/20 shadow-glow-sm">
            <CheckCircle2 size={48} className="text-decensat" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">Signal Received.</h2>
          <p className="text-slate-400 mb-10 leading-relaxed font-bold text-lg uppercase tracking-tight">
            Your intent has been successfully logged. A specialist or Sura instance will respond via WhatsApp if your profile aligns with our active venture nodes.
          </p>
          <button 
            onClick={() => setFormState('idle')}
            className="px-10 py-5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-[0.4em] hover:bg-decensat transition-all shadow-xl flex items-center gap-3 mx-auto active:scale-95"
          >
            Submit another request <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="intent" className="py-32 px-4 bg-[#020617] border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-decensat/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />
      
      <div className="max-w-[1920px] mx-auto relative z-10 px-6 sm:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-lg">
              <Zap size={14} className="animate-pulse" /> 
              <span>Start With Signal</span>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 leading-[1.05] tracking-tighter uppercase italic">
              Request Access, Resources, or a <br/><span className="text-decensat not-italic underline decoration-white/10 underline-offset-8">Technical Review.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed font-bold border-l-4 border-decensat pl-6 uppercase tracking-tight">
              Assurative.ai operates on high-intent signals. Provide your details below, and a specialist will respond if relevant to our current orchestration layer.
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-6 group bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:border-decensat/30 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-zinc-950 flex items-center justify-center text-decensat shrink-0 shadow-2xl border border-white/5 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={32} />
                </div>
                <div>
                   <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Venture-Safe Attribution</h4>
                   <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tight italic">Your data remains within the DC3 ecosystem. Attribution is tracked via secure nodes with full privacy compliance.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border-2 border-white/5 p-8 sm:p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 transition-transform duration-[2000ms]">
               <Zap size={200} className="text-white" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-4">FULL_IDENTITY_HANDLE</label>
                  <input 
                    type="text" 
                    name="FULL_NAME"
                    required
                    disabled={formState === 'submitting'}
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="e.g. ELENA BIRD"
                    className="w-full bg-zinc-950 border-2 border-white/10 rounded-2xl px-8 py-5 text-white font-black placeholder:text-slate-800 focus:outline-none focus:border-decensat/40 transition-all text-base uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-4">INGESTION_UPLINK (EMAIL)</label>
                  <input 
                    type="email" 
                    name="EMAIL"
                    required
                    disabled={formState === 'submitting'}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({...formData, email: e.target.value});
                      setError(null);
                    }}
                    placeholder="e.g. ELENA@BIRDARCH.IO"
                    className={`w-full bg-zinc-950 border-2 rounded-2xl px-8 py-5 text-white font-black placeholder:text-slate-800 focus:outline-none transition-all text-base uppercase ${error ? 'border-rose-500' : 'border-white/10 focus:border-decensat/40'}`}
                  />
                  {error && (
                    <p className="text-rose-500 text-[9px] font-black uppercase px-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle size={14} /> {error}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-4">WHATSAPP_UPLINK (E.164)</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      name="PHONE"
                      required
                      disabled={formState === 'submitting'}
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-zinc-950 border-2 border-white/10 rounded-2xl px-8 py-5 text-white font-black placeholder:text-slate-800 focus:outline-none focus:border-decensat/40 transition-all text-base font-mono"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2">
                      <CheckCircle2 size={20} className="text-decensat opacity-40" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl shadow-inner">
                <div className="flex items-center h-6 mt-1">
                  <input 
                    type="checkbox" 
                    id="consent"
                    required
                    disabled={formState === 'submitting'}
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    className="w-6 h-6 rounded-lg border-4 border-white/10 bg-black text-decensat focus:ring-decensat cursor-pointer disabled:opacity-50 appearance-none checked:bg-decensat transition-all relative after:content-[''] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white checked:after:content-['✓'] after:font-black"
                  />
                </div>
                <label htmlFor="consent" className="text-[11px] text-slate-300 leading-relaxed font-bold cursor-pointer uppercase tracking-tight italic">
                  I authorize technical contact regarding my request and acknowledge data handling protocols under the <span className="text-decensat underline decoration-decensat/30 underline-offset-4">Venture-Safe Attribution</span> agreement.
                </label>
              </div>

              <div className="space-y-4 pt-4">
                <button 
                  type="submit" 
                  disabled={formState === 'submitting'}
                  className={`w-full py-6 text-black font-black text-xs uppercase tracking-[0.5em] rounded-xl transition-all flex items-center justify-center gap-6 group/btn shadow-[0_24px_48px_-12px_rgba(163,230,53,0.3)] ${
                    formState === 'submitting' 
                      ? 'bg-zinc-800 text-slate-600 cursor-not-allowed opacity-80' 
                      : 'bg-decensat hover:bg-white active:scale-95'
                  }`}
                >
                  {formState === 'submitting' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> SYNCHRONIZING_SIGNAL...
                    </>
                  ) : (
                    <>
                      <span>TRANSMIT SECURE INTENT</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-4 text-[9px] text-slate-700 font-black uppercase tracking-[0.4em] font-mono">
                   <div className="h-px bg-white/5 flex-1" />
                   INTEGRITY_PROTOCOL_v1.1_ACTIVE
                   <div className="h-px bg-white/5 flex-1" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntentCapture;