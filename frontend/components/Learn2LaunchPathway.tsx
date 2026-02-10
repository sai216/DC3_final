import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Target, FileSearch, GraduationCap, BookOpen, Briefcase, 
  Rocket, Activity, ArrowRight, Sparkles, Terminal,
  ShieldCheck, User, Calendar, Check, Loader2, Lock, Mail, Smartphone,
  Globe, AlertCircle, RefreshCw, XCircle, Video, ListChecks, Info, Hash,
  Fingerprint, Link as LinkIcon, MoveRight, Ban, CheckCircle,
  Presentation, ChevronRight, MessageSquare, UserCheck, Send, CheckCircle2
} from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { MARKETING_CONFIG } from '../core/marketing.config';

const PhaseIcons = [Target, FileSearch, GraduationCap, BookOpen, Briefcase];

const Tooltip = ({ title, content }: { title: string, content: string }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 p-5 bg-[#080808] border border-decensat/30 rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,1)] z-50 animate-in fade-in zoom-in-95 duration-300">
    <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-2">
      <div className="shrink-0"><Info size={12} className="text-decensat" /></div>
      <span className="text-[9px] font-black text-white uppercase tracking-widest truncate">{String(title)}</span>
    </div>
    <p className="text-[10px] font-mono text-slate-400 uppercase leading-relaxed tracking-tight italic">
      {String(content)}
    </p>
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#080808] border-r border-b border-decensat/30 rotate-45" />
  </div>
);

const PitchSlide = () => (
  <div className="w-full bg-slate-900/50 border-2 border-white/10 rounded-[2.5rem] sm:rounded-[3rem] p-6 xs:p-8 sm:p-12 mb-10 relative overflow-hidden group shadow-2xl">
    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 pointer-events-none">
      <Presentation size={300} className="hidden xs:block" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-decensat rounded-xl flex items-center justify-center text-black font-black italic shrink-0">P1</div>
        <h4 className="text-xl xs:text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-tight">Verification Audit Protocol <span className="text-decensat font-mono font-normal text-[10px] xs:text-xs sm:text-sm ml-2 block xs:inline-block">(AGES 17–29)</span></h4>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-black/60 p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-white/5 space-y-4 sm:space-y-6">
          <div className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-blue-500" /> APPLICANT_SUBMISSION
          </div>
          <ul className="space-y-3 text-[10px] xs:text-[11px] sm:text-xs font-bold text-slate-300 uppercase tracking-tight">
            <li className="flex items-center gap-3"><ChevronRight size={12} className="text-blue-500" /> Age (17–29)</li>
            <li className="flex items-center gap-3"><ChevronRight size={12} className="text-blue-500" /> Skills & Interests</li>
            <li className="flex items-center gap-3 font-black text-white"><Video size={14} className="text-decensat" /> Mandatory Loom Video</li>
          </ul>
        </div>

        <div className="bg-decensat/5 p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-decensat/20 space-y-4 sm:space-y-6">
          <div className="text-[9px] sm:text-[10px] font-black text-decensat uppercase tracking-widest flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-decensat animate-pulse" /> AI_AUDIT_ENGINE
          </div>
          <p className="text-xs xs:text-sm font-black text-white uppercase leading-tight">Gemini 3 Verification Layer</p>
          <ul className="space-y-3 text-[9px] xs:text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-tight italic">
            <li>• Deterministic scoring</li>
            <li>• Mission alignment check</li>
            <li>• Maturity & accountability</li>
            <li>• Bias-resistant ruleset</li>
          </ul>
        </div>

        <div className="bg-black/60 p-6 sm:p-8 rounded-3xl sm:rounded-[2rem] border border-white/5 space-y-4 sm:space-y-6">
          <div className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500" /> CLEAR_OUTCOMES
          </div>
          <div className="space-y-3 sm:space-y-4">
             <div className="flex items-center gap-3 text-emerald-400 font-black text-[9px] xs:text-[10px]"><CheckCircle size={14} /> APPROVE (UP TO 9M PRE-18)</div>
             <div className="flex items-center gap-3 text-amber-400 font-black text-[9px] xs:text-[10px]"><RefreshCw size={14} /> DEFER (NEEDS CLARITY)</div>
             <div className="flex items-center gap-3 text-rose-400 font-black text-[9px] xs:text-[10px]"><Ban size={14} /> REJECT (INELIGIBLE)</div>
          </div>
        </div>
      </div>

      <div className="mt-8 xs:mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-black text-decensat uppercase tracking-[0.4em] sm:tracking-[0.5em] text-center sm:text-left leading-relaxed">"No Loom. No intent. No approval."</div>
        <div className="flex items-center gap-4 text-[7px] xs:text-[8px] font-mono text-slate-600 uppercase tracking-widest">
        </div>
      </div>
    </div>
  </div>
);

const Learn2LaunchPathway: React.FC = () => {
  const { login, user, authenticated } = usePrivy();
  const [privyLoading, setPrivyLoading] = useState(false);
  const [formStep, setFormStep] = useState<'EMAIL' | 'IDENT' | 'CLUSTERS' | 'CONTACT' | 'C3' | 'SUCCESS'>('EMAIL');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    dob: '',
    loomUrl: '',
    selectedClusters: [] as string[],
    whatsappNumber: '',
    telegramHandle: '',
    isAdult: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isPrivyAuthenticated, setIsPrivyAuthenticated] = useState(false);

  const isValidLoom = (url: string) => {
    return url.trim().startsWith('https://www.loom.com/share');
  };

  const checkEligibility = (dob: string) => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    const dateAt18 = new Date(birthDate.getFullYear() + 18, birthDate.getMonth(), birthDate.getDate());
    const nineMonthsBefore18 = new Date(dateAt18);
    nineMonthsBefore18.setMonth(nineMonthsBefore18.getMonth() - 9);
    const dateAt30 = new Date(birthDate.getFullYear() + 30, birthDate.getMonth(), birthDate.getDate());

    if (today >= dateAt30) {
      setFormError("SIGNAL_REJECTED: Age exceeds 30-year eligibility threshold.");
      return false;
    } else if (today >= nineMonthsBefore18) {
      setFormError(null);
      return true;
    } else {
      setFormError("SIGNAL_REJECTED: Temporal gap exceeds 9-month threshold.");
      return false;
    }
  };

  const handlePrivyLogin = () => {
    setIsSubmitting(true);
    setPrivyLoading(true);
    setFormError(null);
    try {
      // Privy login opens modal - user state will update after successful auth
      login({ loginMethods: ['email'] });
    } catch (error) {
      setFormError("[!] AUTHENTICATION_ERROR: Unable to initiate Privy login.");
      setIsSubmitting(false);
      setPrivyLoading(false);
    }
  };

  // Monitor Privy user authentication
  useEffect(() => {
    if (authenticated && user?.email && isPrivyAuthenticated === false) {
      // User has successfully authenticated with Privy
      const emailAddress = user.email.address;
      setFormData(prev => ({...prev, email: emailAddress}));
      setIsPrivyAuthenticated(true);
      setIsSubmitting(false);
      setPrivyLoading(false);
      setFormError(null);
      // Auto-advance to IDENT step
      setFormStep('IDENT');
    }
  }, [authenticated, user, isPrivyAuthenticated]);

  const handleNextToIdentity = () => {
    // If not authenticated, initiate Privy login
    if (!isPrivyAuthenticated) {
      handlePrivyLogin();
      return;
    }
    
    // Validate email format
    if (!formData.email.trim()) {
      setFormError("[!] EMAIL_REQUIRED: Email authentication is mandatory for protocol entry.");
      return;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setFormError("[!] VALIDATION_ERROR: INVALID_EMAIL_FORMAT. RFC-compliant uplink required.");
      return;
    }
    
    setFormError(null);
    setFormStep('IDENT');
  };

  const handleNextToClusters = () => {
    const missing = [];
    if (!formData.name.trim()) missing.push('NAME_IDENT');
    if (!formData.dob) missing.push('TEMPORAL_SIGNAL');
    
    if (!formData.loomUrl.trim()) {
      setFormError("[!] MANDATORY_REQUIREMENT: Loom video URL is MISSING. High-fidelity intent signal required.");
      return;
    } else if (!isValidLoom(formData.loomUrl)) {
      setFormError("[!] MANDATORY_REQUIREMENT: Loom video URL INVALID. Format: https://www.loom.com/share/...");
      return;
    }

    if (!formData.isAdult) missing.push('ADULT_VERIFICATION');

    if (missing.length > 0) {
      setFormError(`[!] MANDATORY_FIELD_MISSING: [${missing.join(' :: ')}]`);
      return;
    }

    const isEligible = checkEligibility(formData.dob);
    if (!isEligible) return;

    setFormError(null);
    setFormStep('CLUSTERS');
  };

  const toggleCluster = (cluster: string) => {
    setFormData(prev => ({
      ...prev,
      selectedClusters: prev.selectedClusters.includes(cluster)
        ? prev.selectedClusters.filter(c => c !== cluster)
        : [...prev.selectedClusters, cluster]
    }));
  };

  const handleNextToContact = () => {
    if (formData.selectedClusters.length === 0) {
      setFormError("[!] SELECT_AT_LEAST_ONE_CLUSTER: Technical focus required for node mapping.");
      return;
    }
    setFormError(null);
    setFormStep('CONTACT');
  };

  const handleNextToC3 = () => {
    const hasWhatsApp = formData.whatsappNumber.trim().startsWith('+');
    const hasTelegram = formData.telegramHandle.trim().length > 0;

    if (!hasWhatsApp && !hasTelegram) {
      setFormError("[!] CONTACT_REQUIRED: Either WhatsApp or Telegram handle is mandatory.");
      return;
    }

    if (hasWhatsApp && formData.whatsappNumber.length < 10) {
      setFormError("[!] INVALID_PHONE: Signal length insufficient. E.164 format required.");
      return;
    }

    if (hasTelegram && formData.telegramHandle.includes('@')) {
      setFormError("[!] TELEGRAM_FORMAT_ERROR: DO NOT INCLUDE '@' SYMBOL. EX: 'username' instead of '@username'");
      return;
    }

    setFormError(null);
    setFormStep('C3');
  };

  return (
    <section id="learn-to-launch" className="pt-6 sm:pt-12 pb-0 bg-transparent relative overflow-hidden px-4 sm:px-0 scroll-mt-24 sm:scroll-mt-32">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      
      <div className="max-w-[1920px] mx-auto relative z-10 sm:px-6 lg:px-12">
        
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-10 border-l-[6px] xs:border-l-[8px] border-decensat pl-5 sm:pl-8 animate-in slide-in-from-left duration-1000">
          <div className="max-w-4xl">
            <h2 className="font-black text-white uppercase leading-[0.95]" style={{fontSize: 'clamp(1.15rem, 4vw, 2.35rem)', letterSpacing: '-0.04em', marginBottom: '1rem'}}>
              Talent <span className="text-decensat italic">Pathway</span>
            </h2>
            <p className="text-xs xs:text-sm sm:text-lg lg:text-xl text-slate-400 font-bold leading-tight uppercase tracking-tight max-w-3xl">
              Deterministic intake protocol for participants aged 17–29. Placement is gated by a WhatsApp OTP adult community handshake.
            </p>
          </div>
        </div>

        <div className="mb-10 xs:mb-12 sm:mb-16 mt-4">
           <div className="flex items-center gap-4 mb-4 pl-4 border-l-4 border-slate-700">
              <span className="text-[9px] xs:text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] sm:tracking-[0.6em]">LIFECYCLE_SEQUENCE</span>
           </div>
           <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {MARKETING_CONFIG.L2L.PHASES.map((phase, idx) => {
               const Icon = PhaseIcons[idx] || Target;
               return (
                <div key={String(phase.id)} className="bg-black/40 backdrop-blur-sm border-2 border-white/5 p-4 sm:p-5 rounded-2xl group hover:border-decensat/20 transition-all flex flex-col items-start text-left relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-decensat group-hover:text-black transition-all">
                    <Icon size={18} />
                  </div>
                  <div className="text-[7px] font-mono text-slate-700 uppercase tracking-widest mb-1.5">Gate_0{String(phase.id)}</div>
                  <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tighter mb-2 italic leading-tight">{String(phase.title)}</h3>
                  <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-slate-600 font-bold leading-relaxed uppercase tracking-tight italic line-clamp-3">{String(phase.desc)}</p>
                </div>
               );
            })}
           </div>
        </div>

        <PitchSlide />

        <div className="grid lg:grid-cols-12 gap-8 xs:gap-10 sm:gap-20 items-start max-w-7xl mx-auto">
          <div className="lg:col-span-5 space-y-8 xs:space-y-10 lg:sticky lg:top-32">
             <div className="p-8 sm:p-12 bg-zinc-950 border-4 border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000"><UserCheck size={140} /></div>
                <div className="relative z-10 space-y-8">
                  
                  {formStep === 'EMAIL' && (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                      <div className="text-lg xs:text-xl sm:text-2xl font-black text-white uppercase tracking-tight italic truncate">Email_Authentication</div>
                      <p className="text-xs xs:text-sm sm:text-base text-slate-500 font-bold leading-relaxed uppercase tracking-tight">Authenticate via Privy to begin your talent verification journey.</p>
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl overflow-hidden max-w-full">
                           <ShieldCheck size={14} className="text-decensat animate-pulse shrink-0" />
                           <div className="flex-1 min-w-0 flex items-center">
                             <span className="text-[6px] xs:text-[7px] font-black text-slate-400 uppercase tracking-tighter truncate">
                               Privy Auth: {isPrivyAuthenticated ? 'VERIFIED' : 'PENDING'}
                             </span>
                           </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {formStep === 'IDENT' && (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                      <div className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">Identity_Uplink</div>
                      <p className="text-sm sm:text-lg text-slate-500 font-bold leading-relaxed uppercase tracking-tight">Provide baseline identity metadata to initialize the audit handshake.</p>
                      <div className="space-y-4">
                         <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                           <Fingerprint size={20} className="text-blue-500" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biometric_Sync: PASS</span>
                         </div>
                         <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                           <Calendar size={20} className="text-decensat" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age_Protocol: GATED</span>
                         </div>
                      </div>
                    </div>
                  )}

                  {formStep === 'CLUSTERS' && (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                      <div className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">Cluster_Mapping</div>
                      <p className="text-sm sm:text-lg text-slate-500 font-bold leading-relaxed uppercase tracking-tight">Select specialized technical clusters for reputation routing.</p>
                      <div className="p-6 bg-decensat/5 border border-decensat/20 rounded-[2rem] space-y-4">
                        <div className="flex items-center gap-3 text-decensat">
                          <Activity size={18} className="animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Real-time Node Allocation</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase">Your selections determine principal advisory matchmaking.</p>
                      </div>
                    </div>
                  )}

                  {formStep === 'CONTACT' && (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                      <div className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">Contact_Verification</div>
                      <p className="text-sm sm:text-lg text-slate-500 font-bold leading-relaxed uppercase tracking-tight">Provide WhatsApp or Telegram for community integration.</p>
                      <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                         <AlertCircle size={20} className="text-amber-500" />
                         <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">One Contact Method Required</span>
                      </div>
                    </div>
                  )}

                  {formStep === 'C3' && (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                      <div className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">C3_Integration</div>
                      <p className="text-sm sm:text-lg text-slate-500 font-bold leading-relaxed uppercase tracking-tight">Finalizing integration with C3 ecosystem...</p>
                      <div className="flex items-center gap-3 p-4 bg-decensat/10 border border-decensat/30 rounded-2xl">
                         <Loader2 size={20} className="text-decensat animate-spin" />
                         <span className="text-[10px] font-black text-decensat uppercase tracking-widest">Connecting to C3 Network</span>
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="lg:col-span-7 bg-black/60 border-2 border-white/5 rounded-[3rem] p-6 xs:p-8 sm:p-16 lg:p-20 shadow-3xl relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
             
             {formStep === 'EMAIL' && (
               <div className="space-y-8 xs:space-y-12 animate-in fade-in zoom-in-95 duration-700 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-decensat transition-colors" size={18} />
                       <input 
                          type="email" value={formData.email} onChange={e => { setFormData({...formData, email: e.target.value}); setFormError(null); }}
                          className="w-full bg-black border-2 border-white/10 rounded-2xl pl-16 pr-6 py-4 sm:py-6 text-sm text-white font-black uppercase outline-none focus:border-decensat/50 transition-all"
                          placeholder="YOUR_EMAIL@DOMAIN.IO"
                       />
                    </div>
                  </div>

                  {formError && (
                    <div className="p-4 sm:p-6 bg-rose-500/5 border-2 border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500 animate-in slide-in-from-top-2">
                       <AlertCircle size={20} className="shrink-0" />
                       <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-relaxed">{formError}</span>
                    </div>
                  )}

                  <button 
                    onClick={handleNextToIdentity}
                    disabled={isSubmitting || privyLoading}
                    className="px-8 py-3 bg-decensat text-black font-black uppercase text-xs tracking-wider rounded-lg hover:bg-white transition-all shadow-lg inline-flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting || privyLoading ? <Loader2 size={16} className="animate-spin" /> : 'AUTHENTICATE'} 
                    {!isSubmitting && !privyLoading && <ArrowRight size={16} strokeWidth={3} />}
                  </button>
               </div>
             )}

             {formStep === 'IDENT' && (
               <div className="space-y-8 xs:space-y-12 animate-in fade-in zoom-in-95 duration-700 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xs:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Full_Identity_Handle</label>
                      <div className="relative group">
                         <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-decensat transition-colors" size={18} />
                         <input 
                            type="text" value={formData.name} onChange={e => { setFormData({...formData, name: e.target.value}); setFormError(null); }}
                            className="w-full bg-black border-2 border-white/10 rounded-2xl pl-16 pr-6 py-4 sm:py-6 text-sm text-white font-black uppercase outline-none focus:border-decensat/50 transition-all"
                            placeholder="e.g. ELENA BIRD"
                         />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Birth_Date_Signal</label>
                      <div className="relative group">
                         <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-decensat transition-colors" size={18} />
                         <input 
                            type="date" value={formData.dob} 
                            onChange={e => { setFormData({...formData, dob: e.target.value}); checkEligibility(e.target.value); }}
                            className="w-full bg-black border-2 border-white/10 rounded-2xl pl-16 pr-6 py-4 sm:py-6 text-sm text-white font-black uppercase outline-none focus:border-decensat/50 transition-all appearance-none cursor-pointer"
                         />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Loom_Identity_Signal</label>
                      <div className="relative" onMouseEnter={() => setActiveTooltip('LOOM')} onMouseLeave={() => setActiveTooltip(null)}>
                         <Info size={12} className="text-slate-700 cursor-help hover:text-decensat transition-colors" />
                         {activeTooltip === 'LOOM' && <Tooltip title="Verification Protocol" content="Must start with: https://www.loom.com/share/" />}
                      </div>
                    </div>
                    <div className="relative group">
                       <Video className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-decensat transition-colors" size={18} />
                       <input 
                          type="url" value={formData.loomUrl} onChange={e => { setFormData({...formData, loomUrl: e.target.value}); setFormError(null); }}
                          className="w-full bg-black border-2 border-white/10 rounded-2xl pl-16 pr-6 py-4 sm:py-6 text-sm text-white font-mono focus:border-decensat/50 outline-none transition-all"
                          placeholder="https://www.loom.com/share/..."
                       />
                    </div>
                  </div>

                  <label className="flex items-start gap-6 cursor-pointer group bg-white/5 p-6 sm:p-8 rounded-[2rem] border border-white/10 hover:border-decensat/30 transition-all">
                    <div className="relative flex items-center h-6 mt-1">
                      <input 
                        type="checkbox" 
                        checked={formData.isAdult}
                        onChange={e => setFormData({...formData, isAdult: e.target.checked})}
                        className="w-8 h-8 rounded-xl border-4 border-white/10 bg-black text-decensat focus:ring-decensat cursor-pointer appearance-none checked:bg-decensat transition-all relative after:content-[''] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white checked:after:content-['✓'] after:font-black"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] sm:text-xs text-slate-300 font-bold uppercase leading-relaxed tracking-tight group-hover:text-white transition-colors italic">
                        I attest that I am 18 years of age or older (or within 9 months of my 18th birthday) and acknowledge the institutional audit terms.
                      </p>
                    </div>
                  </label>

                  {formError && (
                    <div className="p-4 sm:p-6 bg-rose-500/5 border-2 border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500 animate-in slide-in-from-top-2">
                       <AlertCircle size={20} className="shrink-0" />
                       <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-relaxed">{formError}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
                      <button onClick={() => setFormStep('EMAIL')} className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-500 rounded-lg font-black uppercase text-xs hover:text-white transition-all">Back</button>
                      <button 
                        onClick={handleNextToClusters}
                        className="px-8 py-3 bg-decensat text-black font-black uppercase text-xs tracking-wider rounded-lg hover:bg-white transition-all shadow-lg inline-flex items-center justify-center gap-2 active:scale-95"
                      >
                        CONTINUE <ArrowRight size={16} strokeWidth={3} />
                      </button>
                  </div>
               </div>
             )}

             {formStep === 'CLUSTERS' && (
                <div className="space-y-12 xs:space-y-16 animate-in slide-in-from-right-8 duration-700 relative z-10">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between px-4">
                        <label className="text-[11px] sm:text-sm font-black text-white uppercase tracking-[0.4em]">Cluster_Selection</label>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{formData.selectedClusters.length} SELECTED</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MARKETING_CONFIG.L2L.ROLES.map((role) => {
                          const isSelected = formData.selectedClusters.includes(role.id);
                          return (
                            <button
                              key={String(role.id)}
                              onClick={() => toggleCluster(String(role.id))}
                              className={`p-6 sm:p-8 rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group/role transform-gpu active:scale-95 ${
                                isSelected 
                                  ? 'bg-decensat border-decensat text-black shadow-glow-sm scale-[1.02]' 
                                  : 'bg-black border-white/5 text-slate-500 hover:border-white/20 hover:text-white'
                              }`}
                            >
                               <div className="flex justify-between items-start mb-3">
                                 <span className={`text-[8px] font-black uppercase tracking-widest ${isSelected ? 'text-black/60' : 'text-slate-600'}`}>Cluster_0{String(role.id).length}</span>
                                 {isSelected && <Check size={16} strokeWidth={4} />}
                               </div>
                               <div className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none mb-2">{String(role.label)}</div>
                               <p className={`text-[10px] font-bold uppercase tracking-tight leading-relaxed italic ${isSelected ? 'text-black/50' : 'text-slate-600'}`}>{String(role.desc)}</p>
                            </button>
                          );
                        })}
                      </div>
                   </div>

                   {formError && (
                    <div className="p-4 sm:p-6 bg-rose-500/5 border-2 border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500">
                       <AlertCircle size={20} className="shrink-0" />
                       <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">{formError}</span>
                    </div>
                  )}

                   <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
                      <button onClick={() => setFormStep('IDENT')} className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-500 rounded-lg font-black uppercase text-xs hover:text-white transition-all">Back</button>
                      <button 
                        onClick={handleNextToContact}
                        className="px-8 py-3 bg-decensat text-black font-black uppercase text-xs tracking-wider rounded-lg hover:bg-white transition-all shadow-lg inline-flex items-center justify-center gap-2 active:scale-95"
                      >
                        CONTINUE <ArrowRight size={16} strokeWidth={3} />
                      </button>
                   </div>
                </div>
             )}

             {formStep === 'CONTACT' && (
                <div className="space-y-12 xs:space-y-16 animate-in slide-in-from-right-8 duration-700 relative z-10">
                   <div className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 xs:gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">WhatsApp_Signal (E.164)</label>
                           <div className="relative group">
                              <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-decensat transition-colors" size={18} />
                              <input 
                                 type="tel" value={formData.whatsappNumber} onChange={e => { setFormData({...formData, whatsappNumber: e.target.value}); setFormError(null); }}
                                 className="w-full bg-black border-2 border-white/10 rounded-2xl pl-16 pr-6 py-4 sm:py-6 text-sm text-white font-mono focus:border-decensat/50 outline-none transition-all"
                                 placeholder="+1 555 000 0000"
                              />
                           </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4">Telegram_ID (Handle)</label>
                           <div className="relative group">
                              <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-decensat transition-colors" size={18} />
                              <input 
                                 type="text" value={formData.telegramHandle} onChange={e => { setFormData({...formData, telegramHandle: e.target.value}); setFormError(null); }}
                                 className="w-full bg-black border-2 border-white/10 rounded-2xl pl-16 pr-6 py-4 sm:py-6 text-sm text-white font-black uppercase outline-none focus:border-decensat/50 transition-all"
                                 placeholder="USERNAME_NODES"
                              />
                           </div>
                        </div>
                      </div>
                   </div>

                   {formError && (
                    <div className="p-4 sm:p-6 bg-rose-500/5 border-2 border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500">
                       <AlertCircle size={20} className="shrink-0" />
                       <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">{formError}</span>
                    </div>
                  )}

                   <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
                      <button onClick={() => setFormStep('CLUSTERS')} className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-500 rounded-lg font-black uppercase text-xs hover:text-white transition-all">Back</button>
                      <button 
                        onClick={handleNextToC3}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-decensat text-black font-black uppercase text-xs tracking-wider rounded-lg hover:bg-white transition-all shadow-lg inline-flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'INITIATE'} 
                        {!isSubmitting && <ArrowRight size={16} strokeWidth={3} />}
                      </button>
                   </div>
                </div>
             )}

             {formStep === 'C3' && (
               <div className="py-12 xs:py-20 text-center space-y-8 sm:space-y-12 animate-in zoom-in-95 duration-1000 relative z-10 h-full flex flex-col justify-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-1.5 sm:py-2 rounded-full bg-decensat/10 border border-decensat/30 text-decensat text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] mb-4 animate-pulse">
                       C3_INTEGRATION_ACTIVE
                    </div>
                    <h3 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-tight italic">
                    </h3>
                    <p className="text-sm sm:text-xl text-slate-500 font-bold max-w-lg mx-auto leading-relaxed uppercase tracking-tight">
                      C3 page integration is under development. Your data has been securely registered.
                    </p>
                  </div>
                  <button 
                    onClick={() => setFormStep('EMAIL')}
                    className="px-12 sm:px-20 py-5 sm:py-8 bg-white text-black font-black uppercase text-[10px] sm:text-xs tracking-[0.5em] rounded-[2rem] hover:bg-decensat transition-all shadow-2xl active:scale-95 self-center"
                  >
                    RESTART_PROTOCOL
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Learn2LaunchPathway;