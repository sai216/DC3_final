import React, { useState, useRef, useMemo, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { usePrivy } from '@privy-io/react-auth';
import { authAPI, auditAPI, authTokenStore } from '@/services/apiService';
import { isValidE164, normalizePhone } from '@/core/validation';
import { 
  Zap, ArrowRight, Loader2, ShieldCheck, Network, Mail, Fingerprint, Activity, X, ShieldAlert, Check, MessageSquare, Calendar, Video, Cpu, FileText, Database, Target, Linkedin, Info, Clock, AlertCircle, FileCode, PlayCircle, Presentation, Lock, Terminal, Sparkles, Timer, RefreshCw, XCircle, AlertTriangle, User, Globe, Share2, Headphones, Layers, Binary, Bot, CheckCircle2, Shield,
  ArrowUpRight, Upload, CheckCircle, Send, BookOpen, Phone, Eye, UserCheck, Link2
} from 'lucide-react';

// NEW FLOW - All steps in the new flow
type Step = 'audit_protocol' | 'privy_auth' | 'goals_and_video' | 'linkedin_phone_validation' | 'google_meet_booking' | 'confirmation_email';
const STEPS: Step[] = ['audit_protocol', 'privy_auth', 'goals_and_video', 'linkedin_phone_validation', 'google_meet_booking', 'confirmation_email'];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

const formatTimeSlot = (slot: string) => {
  const [rawHour, rawMinute] = slot.split(':').map((value) => Number(value));
  if (Number.isNaN(rawHour) || Number.isNaN(rawMinute)) {
    return slot;
  }
  const hour12 = rawHour % 12 || 12;
  const period = rawHour >= 12 ? 'PM' : 'AM';
  return `${hour12}:${String(rawMinute).padStart(2, '0')} ${period}`;
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCalendarDays = (monthDate: Date) => { 
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: Array<Date | null> = [];

  for (let i = 0; i < startOffset; i += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
};

/* OLD FLOW - COMMENTED OUT - NO LONGER IN USE
type Step = 'initiation' | 'intent' | 'materials' | 'identity' | 'verification' | 'privy_handshake' | 'scheduling' | 'summary';
const STEPS: Step[] = ['initiation', 'intent', 'materials', 'identity', 'verification', 'privy_handshake', 'scheduling', 'summary'];
*/

//  STRONG VALIDATION FUNCTIONS
const validateLinkedInUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url.trim()) {
    return { valid: false, error: '[!] ERROR: LinkedIn URL is required' };
  }
  
  // Must contain linkedin.com
  if (!url.includes('linkedin.com')) {
    return { valid: false, error: '[!] ERROR: Must be a valid LinkedIn URL (linkedin.com)' };
  }
  
  // Must be a profile URL with /in/ or /company/
  const profilePattern = /linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+/;
  if (!profilePattern.test(url)) {
    return { valid: false, error: '[!] ERROR: Must be a valid LinkedIn profile URL (linkedin.com/in/... or linkedin.com/company/...)' };
  }
  
  // Check for valid URL format
  try {
    new URL(url);
  } catch {
    return { valid: false, error: '[!] ERROR: Invalid URL format. Must start with http:// or https://' };
  }
  
  return { valid: true };
};

const validateInternationalPhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { valid: false, error: '[!] ERROR: Phone number is required' };
  }

  const cleanPhone = normalizePhone(phone);

  if (!cleanPhone.startsWith('+')) {
    return { 
      valid: false, 
      error: '[!] ERROR: Must include country code starting with + (e.g., +1 for USA 🇺🇸, +55 for Brazil 🇧🇷)' 
    };
  }

  if (!isValidE164(cleanPhone)) {
    return { 
      valid: false, 
      error: '[!] ERROR: Invalid international phone format. Must be + followed by country code and phone number (e.g., +13051234567 or +5511987654321)' 
    };
  }

  return { valid: true };
};

const ProtocolSyncOverlay = ({ message = "Synchronizing_Protocol..." }: { message?: string }) => (
  <div className="absolute inset-0 z-[6001] flex items-center justify-center bg-[#020617]/90 backdrop-blur-md animate-in fade-in duration-300">
    <div className="flex flex-col items-center gap-6">
      <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border-4 border-decensat/10 border-t-decensat animate-spin" />
      <div className="text-[7px] sm:text-[10px] font-black text-decensat uppercase tracking-[0.4em] sm:tracking-[0.5em] animate-pulse font-mono text-center px-6">{String(message)}</div>
    </div>
  </div>
);

const ProjectAssessmentHub: React.FC<{ onLogin?: (email: string) => void }> = ({ onLogin }) => {
  const { login, logout, authenticated, user, ready, getAccessToken } = usePrivy();
  const [currentStep, setCurrentStep] = useState<Step>('audit_protocol');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quickBookOnly, setQuickBookOnly] = useState(false);
  const [ustTime, setUstTime] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [chatMessages, setChatMessages] = useState<Array<{from: string, message: string, time: string}>>([
    {from: 'support', message: 'Welcome! How can we help you today?', time: new Date().toLocaleTimeString()}
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const [submission, setSubmission] = useState({
    // NEW FLOW FIELDS
    goals: '',
    videoLink: '',
    loomLink: '',
    uploadedFiles: [] as Array<{ id?: string; url?: string; name: string; size: number; type: string }>,
    fileIds: [] as string[],
    email: '',
    linkedinUrl: '',
    phoneNumber: '',
    meetingDate: '',
    meetingTime: '',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    emailConfirmationSent: false,
    manifestId: '',
    identityId: '',
    meetingId: '',
  });

  const activeStepIndex = STEPS.indexOf(currentStep);
  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);

  const minDate = useMemo(() => {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(0, 0, 0, 0);
    return next;
  }, []);

  const isDateDisabled = (date: Date) => {
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const isWeekend = compareDate.getDay() === 0 || compareDate.getDay() === 6;
    return compareDate < minDate || isWeekend;
  };

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('en-US', { 
        timeZone: 'America/New_York',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
      setUstTime(String(time));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStartMeetBooking = () => {
      setQuickBookOnly(true);
      setErrors({});
      setCurrentStep('google_meet_booking');
    };

    window.addEventListener('start-gmeet-booking', handleStartMeetBooking);
    return () => window.removeEventListener('start-gmeet-booking', handleStartMeetBooking);
  }, []);

  // Sync Privy authentication state
  useEffect(() => {
    if (authenticated && user) {
      setIsAuthenticated(true);
      const email = user.email?.address || user.google?.email || '';
      if (email) {
        setSubmission(prev => ({ ...prev, email }));
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [authenticated, user]);

  useEffect(() => {
    const normalized = phoneValue ? `+${phoneValue}` : '';
    setSubmission((prev) => ({ ...prev, phoneNumber: normalized }));
  }, [phoneValue]);

  const handleNext = async () => {
    // Validation for each step
    if (currentStep === 'privy_auth') {
      if (!authenticated) {
        setErrors({ email: '[!] ERROR: Please authenticate with Privy to continue' });
        return;
      }
    }

    if (currentStep === 'goals_and_video') {
      if (!submission.goals.trim()) {
        setErrors({ goals: '[!] ERROR: Goals description is required' });
        return;
      }
      if (!submission.videoLink.trim() && !submission.loomLink.trim()) {
        setErrors({ videoLink: '[!] ERROR: Please provide either a regular video URL or a Loom link (choose one)' });
        return;
      }
    }

    if (currentStep === 'linkedin_phone_validation') {
      //  STRONG LinkedIn validation
      const linkedinValidation = validateLinkedInUrl(submission.linkedinUrl);
      if (!linkedinValidation.valid) {
        setErrors({ linkedinUrl: linkedinValidation.error || '[!] ERROR: Invalid LinkedIn URL' });
        return;
      }

      const phoneValidation = validateInternationalPhone(submission.phoneNumber);
      if (!phoneValidation.valid) {
        setErrors({ phoneNumber: phoneValidation.error || '[!] ERROR: Invalid phone number' });
        return;
      }
    }

    if (currentStep === 'google_meet_booking') {
      if (!submission.meetingDate || !submission.meetingTime) {
        setErrors({ meeting: '[!] ERROR: Please select both date and time for the meeting' });
        return;
      }
    }

    setIsLoading(true);
    setErrors({});
    let canAdvance = true;

    try {
      if (currentStep === 'privy_auth') {
        const accessToken = await getAccessToken();
        console.log('Privy accessToken being sent to backend:', accessToken);
        if (!accessToken) {
          setErrors({ email: '[!] ERROR: Failed to retrieve Privy access token' });
          canAdvance = false;
        } else {
          const { data, error } = await authAPI.authenticateWithPrivy(accessToken);
          const token = (data as { token?: string } | undefined)?.token;

          if (error || !token) {
            setErrors({ email: `[!] ERROR: ${error || 'Authentication failed'}` });
            canAdvance = false;
          } else {
            authTokenStore.set(token);
          }
        }
      }

      if (currentStep === 'goals_and_video' && canAdvance) {
        const { data, error } = await auditAPI.submitManifest({
          loomUrl: submission.loomLink || undefined,
          docsUrl: submission.videoLink || undefined,
          fileIds: submission.fileIds.length > 0 ? submission.fileIds : undefined,
        });

        const manifestId = (data as { manifestId?: string } | undefined)?.manifestId;
        if (error || !manifestId) {
          setErrors({ goals: `[!] ERROR: ${error || 'Failed to submit manifest'}` });
          canAdvance = false;
        } else {
          setSubmission((prev) => ({ ...prev, manifestId }));
        }
      }

      if (currentStep === 'linkedin_phone_validation' && canAdvance) {
        const { data, error } = await auditAPI.submitIdentity({
          linkedinUrl: submission.linkedinUrl,
          businessEmail: submission.email || undefined,
          whatsappNumber: submission.phoneNumber,
        });

        const identityId = (data as { identityId?: string } | undefined)?.identityId;
        if (error || !identityId) {
          // Allow direct transition to booking even if identity submission fails.
          setQuickBookOnly(true);
        } else {
          setSubmission((prev) => ({ ...prev, identityId }));
        }
      }

      if (currentStep === 'google_meet_booking' && canAdvance) {
        if (!quickBookOnly && (!submission.manifestId || !submission.identityId)) {
          setErrors({ meeting: '[!] ERROR: Missing audit manifest or identity. Please retry the previous steps.' });
          canAdvance = false;
        } else {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
          const { data, error } = await auditAPI.scheduleCall({
            date: submission.meetingDate,
            time: submission.meetingTime,
            timezone,
            duration: 60,
          });

          const meetingId = (data as { meetingId?: string } | undefined)?.meetingId;
          const meetingLink = (data as { googleMeetLink?: string } | undefined)?.googleMeetLink;

          if (error || !meetingId) {
            setErrors({ meeting: `[!] ERROR: ${error || 'Failed to schedule meeting'}` });
            canAdvance = false;
          } else if (quickBookOnly) {
            setSubmission((prev) => ({
              ...prev,
              meetingId,
              meetingLink: meetingLink || prev.meetingLink,
              emailConfirmationSent: true,
            }));
          } else {
            const submitResult = await auditAPI.submitAudit({
              manifestId: submission.manifestId,
              identityId: submission.identityId,
              meetingId,
              goals: {
                goals: submission.goals,
                videoLink: submission.videoLink,
                loomLink: submission.loomLink,
                fileIds: submission.fileIds,
              },
            });

            if (submitResult.error) {
              setErrors({ meeting: `[!] ERROR: ${submitResult.error}` });
              canAdvance = false;
            } else {
              setSubmission((prev) => ({
                ...prev,
                meetingId,
                meetingLink: meetingLink || prev.meetingLink,
                emailConfirmationSent: true,
              }));
            }
          }
        }
      }
    } finally {
      await new Promise(r => setTimeout(r, 400));
    }

    // Navigate to next step
    if (canAdvance && activeStepIndex < STEPS.length - 1) {
      const nextStep = STEPS[activeStepIndex + 1];
      setIsTransitioning(true);
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(nextStep);

      setIsTransitioning(false);
    }

    setIsLoading(false);
  };

  const handleBack = async () => {
    if (activeStepIndex > 0) {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 400));
      setCurrentStep(STEPS[activeStepIndex - 1]);
      setErrors({});
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    const { data, error } = await auditAPI.uploadFiles(files);

    if (error) {
      setErrors({ files: `[!] ERROR: ${error}` });
      setIsLoading(false);
      return;
    }

    const uploaded = (data as { files?: Array<{ id: string; url: string; name: string; size: number }> })?.files || [];

    setSubmission((prev) => ({
      ...prev,
      uploadedFiles: [
        ...prev.uploadedFiles,
        ...uploaded.map((file) => ({
          id: file.id,
          url: file.url,
          name: file.name,
          size: file.size,
          type: 'uploaded',
        })),
      ],
      fileIds: [...prev.fileIds, ...uploaded.map((file) => file.id)],
    }));

    setIsLoading(false);
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, {
        from: 'user',
        message: chatInput,
        time: new Date().toLocaleTimeString()
      }]);
      setChatInput('');
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          from: 'support',
          message: 'Thanks for your message! Our team will review your inquiry and get back to you shortly. Your meeting is confirmed for ' + (submission.meetingDate ? new Date(submission.meetingDate + ' ' + submission.meetingTime).toLocaleString() : 'the scheduled time') + '.',
          time: new Date().toLocaleTimeString()
        }]);
      }, 1000);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'audit_protocol':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 h-full flex flex-col justify-center py-6 sm:py-12">
            <div className="mb-6 sm:mb-12 border-l-[6px] sm:border-l-[10px] border-decensat pl-4 sm:pl-10">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl shrink-0">
                   <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8 text-decensat" />
                </div>
                <div>
                  <h3 className="text-xl xs:text-2xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-1.5 sm:mb-2 text-glow-lime">Audit <span className="text-decensat italic">Protocol</span></h3>
                  <p className="text-slate-500 font-bold uppercase text-[7px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em]">STATE: READY_FOR_ASSESSMENT</p>
                </div>
              </div>
            </div>

            <p className="text-sm xs:text-base sm:text-2xl text-slate-400 font-bold uppercase tracking-tight max-w-3xl mb-10 xs:mb-14 border-l-4 border-white/10 pl-4 sm:pl-10 ml-1 sm:ml-2 italic leading-relaxed">
              Welcome to our comprehensive audit process. We'll guide you through each step to understand your project goals and schedule a strategy session.
            </p>
            
            <div>
              <button 
                disabled={isLoading}
                onClick={handleNext} 
                className="px-8 py-3 bg-decensat text-black font-black uppercase text-xs tracking-wider rounded-lg hover:bg-white transition-all shadow-lg inline-flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'BEGIN ASSESSMENT'} 
                {!isLoading && <ArrowRight size={16} strokeWidth={3} />}
              </button>
            </div>
          </div>
        );

      case 'privy_auth':
        return (
          <div className="space-y-4 sm:space-y-6 animate-in zoom-in-95 duration-1000 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 py-8 max-w-xl mx-auto">
             <div className="space-y-2 sm:space-y-3">
                <h3 className="text-xl xs:text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic leading-none"><span className="text-decensat not-italic">Authentication</span></h3>
                <p className="text-xs xs:text-sm sm:text-base text-slate-400 font-bold uppercase leading-relaxed tracking-tight italic max-w-xl mx-auto">
                  Authenticate with your email to proceed
                </p>
             </div>

             <div className="w-full space-y-3">
                {!authenticated ? (
                  <>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => {
                          setErrors({});
                          login();
                        }}
                        disabled={!ready}
                        className="px-8 py-3 bg-decensat text-black font-black uppercase text-xs tracking-wider rounded-lg hover:bg-white transition-all shadow-lg inline-flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:bg-zinc-900 disabled:text-slate-700"
                      >
                        <Zap size={16} />
                        AUTHENTICATE
                      </button>
                    </div>
                    <p className="text-[9px] sm:text-xs text-slate-500 text-center font-bold uppercase tracking-wider">
                      Email or Google authentication supported
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3 text-decensat animate-in slide-in-from-top-2 bg-decensat/10 border border-decensat/30 rounded-xl p-4">
                      <CheckCircle size={20} />
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Authenticated Successfully</span>
                    </div>
                    <div className="bg-black/40 border-2 border-white/10 rounded-xl p-4 space-y-2">
                      <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">Authenticated As:</div>
                      <div className="text-sm text-white font-mono break-all">{user?.email?.address || user?.google?.email || 'User'}</div>
                    </div>
                  </div>
                )}
                {errors.email && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.email)}</p>}
             </div>

             <div className="flex flex-col sm:flex-row gap-3 w-full justify-between items-center">
              <button disabled={isLoading} onClick={handleBack} className="px-4 xs:px-6 py-3 xs:py-4 text-[10px] sm:text-xs font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button 
                onClick={handleNext}
                disabled={isLoading || !authenticated}
                className="px-6 xs:px-8 py-3 xs:py-4 bg-decensat text-black font-black uppercase text-[10px] xs:text-xs sm:text-sm tracking-[0.12em] sm:tracking-[0.3em] rounded-xl hover:bg-white transition-all shadow-glow-md inline-flex items-center justify-center gap-2 xs:gap-3 active:scale-95 transform-gpu disabled:opacity-50 disabled:bg-zinc-900 disabled:text-slate-700"
              >
                 {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} strokeWidth={4} />}
                 {isLoading ? 'PROCESSING...' : 'CONTINUE TO GOALS'}
              </button>
             </div>
          </div>
        );

      case 'goals_and_video':
        return (
          <div className="space-y-8 sm:space-y-12 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center py-6 sm:py-12">
            <div className="space-y-3">
              <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">What Are <span className="text-decensat not-italic">Your Goals?</span></h3>
              <p className="text-[10px] xs:text-xs sm:text-xl text-slate-500 font-bold uppercase tracking-tight">Tell us about your objectives</p>
              <p className="text-[9px] xs:text-[10px] sm:text-base text-slate-400 font-semibold tracking-tight">
                Submit a Loom video or any video URL below. <span className="text-decensat font-black">One video submission is mandatory.</span>
              </p>
            </div>

            <div className="relative">
               <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-3 block">Project Goals & Objectives</label>
               <textarea 
                disabled={isLoading}
                value={String(submission.goals)}
                onChange={(e) => { setSubmission({...submission, goals: e.target.value}); setErrors({}); }}
                placeholder="Describe your project goals, objectives, and what you hope to achieve..."
                className={`w-full min-h-[180px] xs:min-h-[220px] sm:min-h-[300px] bg-black/40 border-[2px] sm:border-[3px] rounded-[1.5rem] sm:rounded-[3rem] p-6 xs:p-8 sm:p-12 text-sm xs:text-base sm:text-2xl font-bold placeholder:text-slate-800 focus:outline-none transition-all tracking-tight leading-relaxed ${errors.goals ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5 focus:border-decensat/30'} disabled:opacity-50`}
              />
              {errors.goals && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase mt-4 ml-6 flex items-center gap-2 animate-in fade-in"><AlertCircle size={14}/> {String(errors.goals)}</p>}
            </div>

            <div className="space-y-4">
              <p className="text-[9px] xs:text-[10px] sm:text-xs font-black text-decensat uppercase tracking-[0.3em] flex items-center gap-2">
                <Info size={14} /> Submit ONE video option below
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Video size={16} className="text-decensat" /> Option 1: Loom Link
                  </label>
                  <input 
                    disabled={isLoading}
                    type="url" 
                    value={String(submission.loomLink)}
                    onChange={(e) => { setSubmission({...submission, loomLink: e.target.value}); setErrors({}); }}
                    placeholder="https://loom.com/share/..."
                    className={`w-full bg-black border-2 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white font-mono text-[10px] xs:text-sm sm:text-lg focus:outline-none transition-all ${errors.videoLink ? 'border-rose-500/40' : 'border-white/10 focus:border-decensat/40'} disabled:opacity-50`}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                    <Link2 size={16} className="text-blue-500" /> Option 2: Regular Video URL
                  </label>
                  <input 
                    disabled={isLoading}
                    type="url" 
                    value={String(submission.videoLink)}
                    onChange={(e) => { setSubmission({...submission, videoLink: e.target.value}); setErrors({}); }}
                    placeholder="https://youtube.com/... or https://drive.google.com/..."
                    className="w-full bg-black border-2 border-white/10 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 text-white font-mono text-[10px] xs:text-sm sm:text-lg focus:outline-none focus:border-decensat/40 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {errors.videoLink && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase ml-6 flex items-center gap-2 animate-in fade-in"><AlertCircle size={14}/> {String(errors.videoLink)}</p>}

            <div className="space-y-3">
              <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                <Upload size={16} className="text-emerald-500" /> File Uploads (Optional)
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                  disabled={isLoading}
                />
                <label 
                  htmlFor="fileUpload"
                  className="w-full bg-black/40 border-2 border-dashed border-white/10 rounded-xl xs:rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-decensat/40 transition-all"
                >
                  <Upload size={32} className="text-slate-600" />
                  <span className="text-slate-500 text-xs sm:text-base font-bold uppercase">Click to upload documents</span>
                </label>
              </div>
              {submission.uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  {submission.uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 bg-black/60 border border-white/10 rounded-xl p-3">
                      <FileText size={16} className="text-decensat" />
                      <span className="text-xs text-slate-300 font-mono flex-1 truncate">{file.name}</span>
                      <span className="text-[9px] text-slate-600 font-mono">{(file.size / 1024).toFixed(1)}KB</span>
                    </div>
                  ))}
                </div>
              )}
              {errors.files && (
                <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase ml-6 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle size={14}/> {String(errors.files)}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6 justify-between items-center">
              <button disabled={isLoading} onClick={handleBack} className="px-4 py-3 text-[10px] sm:text-xs font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="px-6 xs:px-8 py-3 xs:py-4 bg-decensat text-black font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] rounded-xl shadow-glow-md inline-flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'CONTINUE'} 
                {!isLoading && <ArrowRight size={18} strokeWidth={4} />}
              </button>
            </div>
          </div>
        );

      case 'linkedin_phone_validation':
        return (
          <div className="space-y-8 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-2xl py-6 sm:py-12 mx-auto">
            <div className="space-y-3">
               <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Validate <span className="text-decensat not-italic">Identity</span></h3>
               <p className="text-slate-400 text-xs sm:text-2xl font-bold leading-relaxed uppercase tracking-tight italic border-l-4 border-decensat/30 pl-4 sm:pl-8">
                 LinkedIn & Phone Verification Required
               </p>
            </div>
            
            <div className="space-y-5 sm:space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-500" />  LinkedIn Profile URL
                </label>
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.linkedinUrl ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 rounded-lg xs:rounded-xl bg-zinc-900 flex items-center justify-center text-slate-500 shrink-0 shadow-xl border border-white/5"><Linkedin size={18} className="sm:size-6" /></div>
                  <input 
                    disabled={isLoading}
                    type="url" 
                    value={String(submission.linkedinUrl)} 
                    onChange={(e) => { setSubmission({...submission, linkedinUrl: e.target.value}); setErrors({}); }}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="flex-1 bg-transparent px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6 text-xs xs:text-sm sm:text-lg font-black text-white focus:outline-none placeholder:text-slate-800 font-mono tracking-tight"
                  />
                </div>
                <div className="text-[8px] sm:text-[10px] text-slate-600 font-mono px-4 flex items-center gap-2">
                  <Info size={12} className="text-blue-500" />
                  Must be a valid LinkedIn profile URL (linkedin.com/in/... or linkedin.com/company/...)
                </div>
                {errors.linkedinUrl && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.linkedinUrl)}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                  <Phone size={16} className="text-emerald-500" />  International Phone (search + country flag)
                </label>
                <div className={`relative flex items-center bg-black/40 border-[2px] sm:border-[3px] rounded-xl xs:rounded-2xl sm:rounded-3xl p-2.5 xs:p-3 sm:p-5 transition-all focus-within:border-decensat/40 ${errors.phoneNumber ? 'border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.1)]' : 'border-white/5'} ${isLoading ? 'opacity-50' : ''}`}>
                  <div className="flex flex-1 flex-col px-3 xs:px-4 sm:px-8 py-3 xs:py-4 sm:py-6">
                    <PhoneInput
                      country="us"
                      enableSearch
                      value={phoneValue}
                      onChange={(value) => {
                        setPhoneValue(value || '');
                        setErrors({});
                      }}
                      inputProps={{
                        name: 'phone',
                        disabled: isLoading,
                        autoComplete: 'tel',
                        placeholder: 'Search country, then enter number',
                      }}
                      containerClass="w-full phone-input-transparent"
                      inputClass="!w-full !bg-transparent !text-white !font-black !text-xs sm:!text-lg !tracking-tight !py-3 sm:!py-4 !px-4 !pl-14 !border !border-white/10 !rounded-2xl !shadow-inner !placeholder:text-slate-800"
                      buttonClass="!bg-black/60 !border !border-white/10 !rounded-2xl !w-12 !h-12 sm:!h-14"
                      dropdownClass="!bg-zinc-950 !text-white !border !border-white/10 !rounded-2xl"
                      searchClass="!bg-black/70 !text-white !border !border-white/10 !rounded-xl !mx-3 !mt-3 !mb-2"
                    />
                  </div>
                </div>
                <div className="text-[8px] sm:text-[10px] text-slate-600 font-mono px-4 flex items-center gap-2">
                  <Globe size={12} className="text-decensat" />
                  Search country, then enter the local number.
                </div>
                {errors.phoneNumber && <p className="text-rose-500 text-[8px] sm:text-xs font-black uppercase px-4 xs:px-6 py-2 bg-rose-500/5 rounded-xl border border-rose-500/20 flex items-center gap-2 leading-tight animate-in slide-in-from-top-1"><AlertCircle size={14} className="shrink-0" /> {String(errors.phoneNumber)}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6 justify-between items-center">
              <button disabled={isLoading} onClick={handleBack} className="px-4 py-3 text-[10px] sm:text-xs font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button disabled={isLoading} onClick={handleNext} className="px-6 xs:px-8 py-3 xs:py-4 bg-decensat text-black font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] rounded-xl shadow-glow-md inline-flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'VALIDATE'} 
                {!isLoading && <ArrowRight size={20} strokeWidth={4} />}
              </button>
            </div>
          </div>
        );

      case 'google_meet_booking':
        return (
          <div className="space-y-8 xs:space-y-10 sm:space-y-16 animate-in slide-in-from-right-8 duration-700 h-full flex flex-col justify-center max-w-5xl py-6 sm:py-12 mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl xs:text-3xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-none italic">Book Your <span className="text-decensat not-italic">Meeting</span></h3>
                <div className="bg-black/80 border border-white/10 px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-2 xs:gap-3 sm:gap-4 shadow-3xl">
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-decensat animate-pulse" />
                   <span className="text-[9px] xs:text-[10px] sm:text-sm font-mono font-black text-white uppercase tracking-widest">{String(ustTime || '')} UST</span>
                </div>
              </div>
              <p className="text-[10px] xs:text-xs sm:text-2xl text-slate-500 font-bold uppercase tracking-tight italic border-l-4 border-decensat/30 pl-4 xs:pl-5 sm:pl-8">Schedule a Google Meet strategy session</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 xs:gap-8">
               <div className="space-y-4 xs:space-y-6">
                  <div className="space-y-3">
                     <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Calendar size={16} className="text-decensat" /> Select Date
                     </label>
                     <div className={`bg-black/60 border-2 rounded-2xl p-4 xs:p-5 ${errors.meeting ? 'border-rose-500/40' : 'border-white/10'}`}>
                       <div className="flex items-center justify-between mb-4">
                         <button
                           type="button"
                           onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                           className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-black uppercase"
                         >
                           Prev
                         </button>
                         <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                           {calendarMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                         </div>
                         <button
                           type="button"
                           onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                           className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 text-xs font-black uppercase"
                         >
                           Next
                         </button>
                       </div>
                       <div className="grid grid-cols-7 gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase">
                         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                           <div key={day} className="text-center">{day}</div>
                         ))}
                       </div>
                       <div className="mt-3 grid grid-cols-7 gap-2">
                         {calendarDays.map((day, index) => {
                           if (!day) {
                             return <div key={`empty-${index}`} className="h-9" />;
                           }

                           const dateKey = toDateKey(day);
                           const isSelected = submission.meetingDate === dateKey;
                           const disabled = isDateDisabled(day);

                           return (
                             <button
                               key={dateKey}
                               type="button"
                               disabled={disabled}
                               onClick={() => {
                                 setSubmission({ ...submission, meetingDate: dateKey });
                                 setErrors({});
                               }}
                               className={`h-9 rounded-lg text-xs font-black transition-all ${isSelected ? 'bg-decensat text-black' : 'bg-white/5 text-white'} ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-decensat/20'}`}
                             >
                               {day.getDate()}
                             </button>
                           );
                         })}
                       </div>
                       <div className="mt-3 text-[9px] text-slate-500 font-mono">
                         Weekends and past dates are disabled.
                       </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[9px] xs:text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Clock size={16} className="text-blue-500" /> Select Time
                     </label>
                     <div className={`bg-black/60 border-2 rounded-2xl p-4 xs:p-5 ${errors.meeting ? 'border-rose-500/40' : 'border-white/10'}`}>
                       <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                         {TIME_SLOTS.map((slot) => (
                           <button
                             key={slot}
                             type="button"
                             disabled={isLoading}
                             onClick={() => {
                               setSubmission({ ...submission, meetingTime: slot });
                               setErrors({});
                             }}
                             className={`px-2 py-2 rounded-lg text-[10px] sm:text-xs font-black transition-all ${submission.meetingTime === slot ? 'bg-decensat text-black' : 'bg-white/5 text-white hover:bg-blue-500/20'}`}
                           >
                            {formatTimeSlot(slot)}
                           </button>
                         ))}
                       </div>
                     </div>
                  </div>

                  {errors.meeting && (
                    <div className="p-4 xs:p-5 bg-rose-500/5 border-2 border-rose-500/20 rounded-xl animate-in shake duration-500">
                       <p className="text-rose-500 text-[9px] xs:text-[10px] sm:text-sm font-black uppercase flex items-center gap-3 italic leading-tight">
                          <ShieldAlert size={18} className="shrink-0" /> {String(errors.meeting)}
                       </p>
                    </div>
                  )}
               </div>

               <div className="bg-black/60 border border-white/10 rounded-[1.8rem] p-6 xs:p-8 sm:p-10 h-full shadow-3xl">
                  <h5 className="text-[8px] xs:text-[9px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
                     <Video size={16} className="text-decensat" /> Meeting Details
                  </h5>
                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                        <Calendar size={18} className="text-decensat shrink-0 mt-1" />
                        <div>
                           <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Date</div>
                           <div className="text-sm text-white font-mono">{submission.meetingDate || 'Not selected'}</div>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <Clock size={18} className="text-blue-500 shrink-0 mt-1" />
                        <div>
                           <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Time</div>
                          <div className="text-sm text-white font-mono">{submission.meetingTime ? formatTimeSlot(submission.meetingTime) : 'Not selected'}</div>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <Video size={18} className="text-emerald-500 shrink-0 mt-1" />
                        <div>
                           <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Platform</div>
                           <div className="text-sm text-white font-bold">Google Meet</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-4 xs:pt-6 justify-between items-center">
              <button disabled={isLoading} onClick={handleBack} className="px-4 py-3 text-[10px] sm:text-xs font-black uppercase text-slate-600 hover:text-white transition-colors disabled:opacity-30">Back</button>
              <button 
                 onClick={handleNext} 
                 disabled={!submission.meetingDate || !submission.meetingTime || isLoading} 
                 className="px-6 xs:px-8 py-3 xs:py-4 bg-decensat text-black font-black uppercase text-[10px] sm:text-xs tracking-[0.3em] rounded-xl shadow-glow-md inline-flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 disabled:bg-zinc-900 disabled:text-slate-700"
              >
                 {isLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} strokeWidth={3} />}
                 {isLoading ? 'BOOKING...' : 'CONFIRM_BOOKING'}
              </button>
            </div>
          </div>
        );

      case 'confirmation_email':
        return (
          <div className="space-y-10 sm:space-y-20 animate-in zoom-in-95 duration-500 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 py-12">
            <div className="space-y-6">
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-32 sm:h-32 bg-decensat rounded-[1.5rem] sm:rounded-[3rem] border-2 sm:border-4 border-black flex items-center justify-center mx-auto text-black shadow-glow-md animate-in zoom-in-50">
                 <Send size={32} className="sm:size-16" />
              </div>
              <h3 className="text-2xl sm:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">Confirmation <span className="text-decensat">Sent!</span></h3>
            </div>
            
            <div className="space-y-4 w-full max-w-2xl">
              <div className="p-6 xs:p-8 bg-black/60 border border-white/10 rounded-xl sm:rounded-2xl space-y-6">
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="text-decensat shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Meeting Date</div>
                        <div className="text-sm text-white font-mono">{submission.meetingDate && new Date(submission.meetingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-blue-500 shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-1">Time</div>
                        <div className="text-sm text-white font-mono">{submission.meetingTime ? formatTimeSlot(submission.meetingTime) : ''}</div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div id="project-assessment" className="min-h-0 bg-[#020617] flex flex-col relative overflow-hidden py-10 xs:py-16 sm:py-24 px-4 sm:px-12 max-w-[1920px] mx-auto w-full">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      
      {currentStep !== 'confirmation_email' && (
        <div className="flex gap-1 sm:gap-5 w-full mb-8 xs:mb-16 max-w-7xl mx-auto px-1 sm:px-0">
          {STEPS.filter(s => s !== 'confirmation_email').map((s, i) => (
            <div key={String(s)} className="flex-1 group flex flex-col gap-2 sm:gap-3">
              <div className="h-1 sm:h-1.5 rounded-full relative overflow-hidden bg-white/5 border border-white/5 shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ease-expo ${i <= activeStepIndex ? 'bg-decensat shadow-glow-sm' : 'bg-transparent'}`} 
                  style={{ width: i <= activeStepIndex ? '100%' : '0%' }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-1 relative max-w-7xl mx-auto w-full">
        <div className={`h-full transition-all duration-700 ease-expo transform-gpu ${isTransitioning || isLoading ? 'opacity-0 translate-y-6 blur-md' : 'opacity-100 translate-y-0 blur-0'}`}>
          {renderStepContent()}
        </div>
        {(isTransitioning || isLoading) && (
          <ProtocolSyncOverlay 
            message={isLoading ? "Processing..." : "Transitioning..."} 
          />
        )}
      </div>
    </div>
  );
};

export default ProjectAssessmentHub;
