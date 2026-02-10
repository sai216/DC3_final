import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, Briefcase, FileText, ShieldCheck, 
  Terminal, Activity, User, ChevronRight, Filter, 
  Search, Bell, MoreVertical, ExternalLink, AlertCircle,
  TrendingUp, Clock, Lock, ArrowLeft, RefreshCw,
  Database, ShieldAlert, CheckCircle2, History,
  Server, HardDrive, Network, X, MessageSquare,
  Bot, Globe, Zap, Mail, Smartphone, Target,
  Scale, Layers, DollarSign, Check, Settings, ToggleLeft, ToggleRight,
  Eye, Mail as MailIcon, ExternalLink as LaunchIcon, Edit3, Trash2, Send,
  Loader2, ListChecks, CheckCircle, Fingerprint, Shield,
  Coins, Info, Circle, AlertTriangle, ArrowUpDown, ChevronDown, Link as LinkIcon,
  Menu, FileJson, GitBranch, Cpu as CpuIcon, Github, BarChart3, Rocket, Cpu, Save, FileEdit,
  Workflow, ArrowRight, BookOpen, Trash, EyeOff, LayoutTemplate, PieChart, TrendingDown,
  Sliders, ShieldPlus, Cog, Braces, Binary
} from 'lucide-react';
import { UserProfile, Project, Quote, AuditLog, OutreachEvent, BdrLead, AutomationConfig, EmailSequenceTemplate, PendingEmail, AdminView, KycStatus, ProjectStatus, ProjectType, Urgency, ClientTier } from '../types';
import { RESEND_SEQUENCES } from '../core/email.config';
import { PRICING_CONFIG } from '../core/pricing.config';

interface AdminOpsDashboardProps {
  user: UserProfile;
  onExit: () => void;
}

const CLIENT_TIERS: ClientTier[] = ['MVP', 'PAYFI', 'WEB3', 'SME', 'SMB', 'FI', 'CRE', 'ELITE', 'VENTURE'];
const URGENCY_LEVELS: Urgency[] = ['standard', 'expedited', 'critical'];

const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'p-a12f', 
    uuid: '550e8400-e29b-41d4-a716-446655440000',
    userId: 'u-1', 
    projectType: 'development', 
    scope: { 
      'Frontend': 'Next.js 14 / Tailwind', 
      'Smart_Contracts': 'Foundry / Solidity', 
      'Infrastructure': 'AWS Nitro Enclaves' 
    }, 
    urgency: 'critical', 
    status: 'initiated', 
    createdAt: '2024-01-14T10:00:00Z',
    kycStatus: 'verified',
    clientTier: 'VENTURE',
    complexityScore: 9
  },
  { 
    id: 'p-d55x', 
    uuid: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    userId: 'u-5', 
    projectType: 'consulting', 
    scope: { 
      'Audit': 'Smart Contract Security', 
      'Compliance': 'KYC Integration' 
    }, 
    urgency: 'expedited', 
    status: 'assessment_complete', 
    complexityScore: 8, 
    createdAt: '2024-01-17T09:00:00Z',
    kycStatus: 'verified',
    clientTier: 'ELITE'
  },
  { 
    id: 'p-b93c', 
    uuid: 'b4a8e321-c124-4f9a-8e2b-f1234567890a',
    userId: 'u-2', 
    projectType: 'design', 
    scope: { 
      'Brand_System': 'Institutional Modern', 
      'Design_Ops': 'Figma Library v4', 
      'UX_Research': 'Technical Persona Mapping' 
    }, 
    urgency: 'standard', 
    status: 'quote_generated', 
    complexityScore: 7, 
    createdAt: '2024-01-15T11:20:00Z',
    kycStatus: 'verified',
    clientTier: 'SMB'
  }
];

const MOCK_EMAILS: PendingEmail[] = [
  {
    id: 'em-1',
    templateId: 'AUDIT_INITIATED',
    recipient: 'founder@scaleup.io',
    clientName: 'Alexander Scale',
    projectId: 'p-a12f',
    subject: '', 
    body: '', 
    status: 'pending',
    createdAt: new Date().toISOString(),
    clientTier: 'VENTURE'
  },
  {
    id: 'em-2',
    templateId: 'SETTLEMENT_PROPOSAL',
    recipient: 'finance@vanguard.io',
    clientName: 'Sarah Vanguard',
    projectId: 'p-b93c',
    subject: '',
    body: '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    clientTier: 'SMB'
  },
  {
    id: 'em-4',
    templateId: 'CDP_FINALIZED',
    recipient: 'ceo@techglobal.io',
    clientName: 'Julian Tech',
    projectId: 'p-f32k',
    subject: '',
    body: '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    clientTier: 'ELITE'
  },
  {
    id: 'em-3',
    templateId: 'WEEKLY_PROGRESS_SIGNAL',
    recipient: 'ops@quantum.io',
    clientName: 'Elena Quantum',
    projectId: 'p-d55x',
    subject: '',
    body: '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    clientTier: 'ELITE'
  }
];

const STATUS_ORDER: ProjectStatus[] = ['initiated', 'assessment_complete', 'quote_generated', 'closed'];

const AdminOpsDashboard: React.FC<AdminOpsDashboardProps> = ({ user, onExit }) => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [emails, setEmails] = useState<PendingEmail[]>(MOCK_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Automation State
  const [autoEmailEnabled, setAutoEmailEnabled] = useState(true);
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(true);
  const [enforcementLevel, setEnforcementLevel] = useState<'LOW' | 'MED' | 'STRICT'>('STRICT');

  // Status Picker Popover State
  const [activeStatusPicker, setActiveStatusPicker] = useState<string | null>(null);

  // Communication Gate State
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const [filterType, setFilterType] = useState<ProjectType | 'all'>('all');
  const [filterUrgency, setFilterUrgency] = useState<Urgency | 'all'>('all');
  const [filterTier, setFilterTier] = useState<ClientTier | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Persistence logic for SysAdmin Overrides
  const [overridePercentage, setOverridePercentage] = useState<number>(() => {
    const saved = localStorage.getItem('dc3_sysadmin_payment_override');
    return saved ? Number(saved) : PRICING_CONFIG.DEFAULTS.ADVANCE_PERCENTAGE;
  });
  const [overrideReason, setOverrideReason] = useState<string>(() => {
    return localStorage.getItem('dc3_sysadmin_override_reason') || '';
  });

  const OVERRIDE_REASON_REGEX = /^(AUTH|RISK|SLA|TECH): [A-Z0-9_\s]{10,}$/;
  const isOverrideValid = useMemo(() => {
    if (overridePercentage === PRICING_CONFIG.DEFAULTS.ADVANCE_PERCENTAGE) return true;
    return OVERRIDE_REASON_REGEX.test(overrideReason);
  }, [overridePercentage, overrideReason]);

  const isEmailEditValid = useMemo(() => {
    return editedSubject.trim().length >= 10 && editedSubject.trim().length <= 150 && editedBody.trim().length >= 50;
  }, [editedSubject, editedBody]);

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId) || null
  , [projects, selectedProjectId]);

  const selectedEmail = useMemo(() => 
    emails.find(e => e.id === selectedEmailId) || null
  , [emails, selectedEmailId]);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];
    if (filterType !== 'all') result = result.filter(p => p.projectType === filterType);
    if (filterUrgency !== 'all') result = result.filter(p => p.urgency === filterUrgency);
    if (filterTier !== 'all') result = result.filter(p => p.clientTier === filterTier);

    result.sort((a, b) => {
      const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    return result;
  }, [projects, filterType, filterUrgency, filterTier, sortOrder]);

  const generateDynamicBody = (email: PendingEmail) => {
    if (email.subject && email.body) {
      return { subject: email.subject, body: email.body, cta: null };
    }

    const template = RESEND_SEQUENCES.find(t => t.id === email.templateId);
    if (!template) return { subject: "TEMPLATE_NOT_FOUND", body: "TEMPLATE_NOT_FOUND", cta: null };
    
    let subject = template.subject;
    let body = template.body;
    
    const variationTier: UserProfile['tier'] = (email.clientTier === 'ELITE' || email.clientTier === 'VENTURE') ? email.clientTier : 'CORE';
    const tierText = template.tierVariations[variationTier];
    
    const placeholders: Record<string, string> = {
      '{{CLIENT_NAME}}': email.clientName || 'Principal Partner',
      '{{PROJECT_ID}}': email.projectId.toUpperCase(),
      '{{NODE_ID}}': email.projectId.split('-')[1].toUpperCase(),
      '{{SEGMENT_ID}}': email.clientTier.toUpperCase(),
      '{{CLIENT_TIER}}': email.clientTier,
      '{{SLA_LEVEL}}': email.clientTier === 'VENTURE' ? 'GOLD_UPLINK' : email.clientTier === 'ELITE' ? 'SILVER_SYNC' : 'BRONZE_BACKLOG',
      '{{TIMESTAMP_UTC}}': new Date().toISOString(),
      '{{LATENCY_INDEX}}': '42',
      '{{MATCH_SCORE}}': '98.4',
      '{{ADVANCE_PERCENT}}': overridePercentage.toString(),
      '{{PAYMENT_TERMS}}': PRICING_CONFIG.DEFAULTS.PAYMENT_TERMS,
      '{{EARLY_PAYOFF_DISCOUNT}}': '10',
      '{{LIQUIDITY_CODE}}': 'USDC_SOL_v4',
      '{{TOTAL_PRICE}}': '12500',
      '{{SETTLEMENT_RAIL}}': 'USDC_SOLANA',
      '{{UCP_HASH}}': 'ucp_0x' + Math.random().toString(16).slice(2, 10) + '...sync',
      '{{A2A_ID}}': 'a2a_' + Math.random().toString(36).slice(2, 8).toUpperCase() + '_LOCKED',
      '{{WEEK_START}}': 'Oct 21',
      '{{WEEK_END}}': 'Oct 27',
      '{{GH_SYNC_ID}}': 'gh-99a',
      '{{VELOCITY_INDEX}}': '1.24',
      '{{SRT_CHANGE}}': '14',
      '{{RELIABILITY_INDEX}}': '99',
      '{{COMMIT_COUNT}}': '24',
      '{{PR_COUNT}}': '4',
      '{{LINE_PARITY}}': '100',
      '{{ROADMAP_SUMMARY}}': 'Primary Auth Mesh completed. Reallocating to Treasury Rails.',
      '{{NEXT_STEP_1}}': 'Solana VM Integration',
      '{{NEXT_STEP_2}}': 'Sub-second Finality Testing',
      '{{NEXT_STEP_3}}': 'Audit Readiness Triage'
    };

    Object.entries(placeholders).forEach(([key, val]) => {
      subject = subject.replace(new RegExp(key, 'g'), val);
      body = body.replace(new RegExp(key, 'g'), val);
    });

    const fullBody = `${body}\n\n--- [TIER_PROTOCOL: ${email.clientTier}] ---\n${tierText}`;
    
    return { subject, body: fullBody, cta: null };
  };

  const handleStartEditEmail = () => {
    if (!selectedEmail) return;
    const { subject, body } = generateDynamicBody(selectedEmail);
    setEditedSubject(subject);
    setEditedBody(body);
    setIsEditingEmail(true);
  };

  const handleSaveEmailEdit = () => {
    if (!selectedEmailId || !isEmailEditValid) return;
    setEmails(prev => prev.map(e => 
      e.id === selectedEmailId 
        ? { ...e, subject: editedSubject, body: editedBody } 
        : e
    ));
    setIsEditingEmail(false);
  };

  const handleUpdateStatus = async (projectId: string, newStatus: ProjectStatus) => {
    setIsSaving(true);
    setActiveStatusPicker(null);
    await new Promise(r => setTimeout(r, 1200));
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    setIsSaving(false);
  };

  const handleUpdateTier = async (projectId: string, newTier: ClientTier) => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, clientTier: newTier } : p));
    setIsSaving(false);
  };

  const handleEmailAction = async (emailId: string, action: 'approved' | 'rejected') => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setEmails(prev => prev.map(e => e.id === emailId ? { ...e, status: action } : e));
    setIsSaving(false);
    setSelectedEmailId(null);
  };

  const handleApplyOverride = async () => {
    if (!isOverrideValid) {
      alert("SIGNAL_REJECTED: Protocol formatting violation in documentation field.");
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    localStorage.setItem('dc3_sysadmin_payment_override', overridePercentage.toString());
    localStorage.setItem('dc3_sysadmin_override_reason', overrideReason);
    setIsSaving(false);
  };

  const getStatusPill = (status: ProjectStatus) => {
    switch (status) {
      case 'closed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'quote_generated': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'assessment_complete': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-decensat/10 text-decensat border-decensat/20';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, roles: ['admin', 'ops', 'finance'] },
    { id: 'projects', label: 'Lifecycle', icon: Briefcase, roles: ['admin', 'ops'] },
    { id: 'approvals', label: 'Gate', icon: Mail, roles: ['admin', 'ops'] },
    { id: 'automation', label: 'Protocol', icon: Settings, roles: ['admin', 'ops'] },
    { id: 'architecture', label: 'Architecture', icon: Workflow, roles: ['admin'] },
    { id: 'audit', label: 'Audit Logs', icon: Terminal, roles: ['admin'] },
  ].filter(item => item.roles.some(r => user.roles.includes(r as any)));

  return (
    <div className="fixed inset-0 z-[5000] bg-[#020617] flex flex-col font-sans text-slate-200 overflow-hidden">
      <header className="h-16 border-b border-white/5 px-4 sm:px-8 flex items-center justify-between bg-black shrink-0 relative z-[60]">
        <div className="flex items-center gap-4 sm:gap-8">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white lg:hidden bg-white/5 rounded-lg border border-white/10">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-3 sm:gap-4">
             <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center text-black font-black italic shadow-xl">D3</div>
             <span className="text-white font-black text-xs sm:text-sm uppercase tracking-[0.2em] truncate">DC3 Admin Ops</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-decensat animate-pulse" />
          <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">SysAdmin</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className={`fixed inset-y-0 left-0 w-72 border-r border-white/5 bg-black flex flex-col p-8 shrink-0 z-[56] transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <nav className="space-y-2 flex-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id as AdminView); setIsSidebarOpen(false); setSelectedEmailId(null); setIsEditingEmail(false); }}
                className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
                  activeView === item.id 
                    ? 'bg-white/5 text-decensat border-white/5 shadow-glow-sm' 
                    : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                 <item.icon size={18} />
                 {item.label}
                 {item.id === 'approvals' && emails.filter(e => e.status === 'pending').length > 0 && (
                   <span className="ml-auto w-5 h-5 rounded-full bg-decensat text-black flex items-center justify-center text-[9px] font-black">{emails.filter(e => e.status === 'pending').length}</span>
                 )}
              </button>
            ))}
          </nav>
          <button onClick={onExit} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">
            <ArrowLeft size={18} /> Exit Console
          </button>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 bg-[#020617] relative custom-scrollbar">
          {activeView === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in duration-700">
               <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic border-b border-white/5 pb-8">Dashboard <span className="text-decensat not-italic">Overview</span></h2>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex items-center justify-between shadow-2xl group">
                     <div><div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Liquidity_Pool</div><div className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tighter">$4.2M</div></div>
                     <Coins size={40} className="text-decensat opacity-10 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex items-center justify-between shadow-2xl group">
                     <div><div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Active_Builds</div><div className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tighter">{projects.length}</div></div>
                     <Zap size={40} className="text-amber-500 opacity-10 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <div className="p-8 bg-black border border-white/5 rounded-[2.5rem] flex items-center justify-between shadow-2xl group">
                     <div><div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">SRA_Index</div><div className="text-4xl sm:text-6xl font-black text-white font-mono tracking-tighter">942</div></div>
                     <ShieldCheck size={40} className="text-blue-500 opacity-10 group-hover:opacity-40 transition-opacity" />
                  </div>
               </div>
            </div>
          )}

          {activeView === 'architecture' && (
            <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-1000">
               <div className="border-b border-white/5 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Decision <span className="text-decensat not-italic">Architecture</span></h2>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.4em] font-mono mt-2">AI-Governed_Capital_Allocation_&_Execution_Flow</p>
                  </div>
                  <div className="flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase text-slate-400">
                    <Activity size={12} className="text-decensat animate-pulse" /> SURA_C3_LAYER_ACTIVE
                  </div>
               </div>

               {/* DECISION TREE VISUALIZATION */}
               <div className="p-10 lg:p-20 bg-black border-2 border-white/5 rounded-[4rem] relative overflow-hidden shadow-3xl">
                  <div className="absolute inset-0 bg-grid-f4a opacity-5" />
                  <div className="relative z-10 space-y-16">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                          { id: 'inq', label: 'Project Inquiry', icon: Mail, sub: 'Scope + Timeline', stage: 1 },
                          { id: 'ai', label: 'Gemini Analysis', icon: Bot, sub: 'Financial Governance', active: true, stage: 2 },
                          { id: 'pay', label: 'Advance Triage', icon: Scale, sub: '15% | 50% | 100%', stage: 3 },
                          { id: 'tres', label: 'Treasury Audit', icon: Database, sub: 'Liquidity Scoring', stage: 4 }
                        ].map((node, i, arr) => (
                           <div key={node.id} className="relative group">
                              <div className={`p-8 rounded-3xl border-2 transition-all duration-700 flex flex-col items-center text-center gap-5 relative z-10 ${node.active ? 'bg-decensat border-decensat text-black shadow-glow-md scale-105' : 'bg-white/5 border-white/10 text-slate-500 group-hover:border-white/20'}`}>
                                 <node.icon size={32} strokeWidth={node.active ? 3 : 2} />
                                 <div>
                                    <div className="text-[11px] font-black uppercase tracking-widest leading-none mb-1.5">{node.label}</div>
                                    <div className={`text-[8px] font-bold uppercase ${node.active ? 'text-black/60' : 'text-slate-700'}`}>{node.sub}</div>
                                 </div>
                              </div>
                              {i < arr.length - 1 && (
                                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-0">
                                   <ChevronRight size={24} className="text-white/10 group-hover:text-decensat/40 transition-colors" />
                                </div>
                              )}
                           </div>
                        ))}
                     </div>

                     <div className="flex flex-col lg:flex-row items-center justify-center gap-12 pt-8">
                        <div className="w-full lg:w-1/3 p-8 bg-zinc-900 border-2 border-white/5 rounded-[2.5rem] space-y-6">
                           <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Rocket size={14} className="text-blue-500" /> Complexity Routing
                           </div>
                           <div className="space-y-3">
                              {[
                                { tier: 'Tier 1', label: 'Fast-Track', desc: '1-2 Nodes | 2wk Sprint', color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500' },
                                { tier: 'Tier 2', label: 'Standard', desc: '3-5 Nodes | 4wk Cycle', color: 'bg-amber-500/20 border-amber-500/30 text-amber-500' },
                                { tier: 'Tier 3', label: 'Enterprise', desc: '6+ Nodes | Multi-Phase', color: 'bg-rose-500/20 border-rose-500/30 text-rose-500' }
                              ].map(t => (
                                <div key={t.tier} className={`p-4 border-2 rounded-2xl flex justify-between items-center ${t.color}`}>
                                   <div className="text-[10px] font-black uppercase tracking-widest">{t.label}</div>
                                   <div className="text-[8px] font-bold uppercase">{t.desc}</div>
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="hidden lg:flex items-center text-white/5 shrink-0 px-8">
                           <ArrowRight size={40} />
                        </div>

                        <div className="w-full lg:w-2/3 grid sm:grid-cols-2 gap-6">
                           <div className="p-8 bg-decensat/5 border-2 border-decensat/20 rounded-[2.5rem] flex flex-col justify-center gap-4">
                              <div className="flex items-center gap-3">
                                 <Globe size={20} className="text-decensat" />
                                 <div className="text-[10px] font-black text-white uppercase tracking-widest">Global Payout Rail</div>
                              </div>
                              <div className="text-3xl font-black text-decensat font-mono tracking-tighter uppercase">Multi-Chain USDC</div>
                              <p className="text-[8px] text-slate-500 uppercase tracking-tight font-bold italic leading-relaxed">Automatic FX conversion and tax compliance baked into every node settlement.</p>
                           </div>
                           <div className="p-8 bg-blue-500/5 border-2 border-blue-500/20 rounded-[2.5rem] flex flex-col justify-center gap-4">
                              <div className="flex items-center gap-3">
                                 <Activity size={20} className="text-blue-500" />
                                 <div className="text-[10px] font-black text-white uppercase tracking-widest">Execution Dashboard</div>
                              </div>
                              <div className="text-3xl font-black text-blue-500 font-mono tracking-tighter uppercase">Real-Time Pulse</div>
                              <p className="text-[8px] text-slate-500 uppercase tracking-tight font-bold italic leading-relaxed">Milestone tracking, burn rate monitoring, and protocol-verified quality gates.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* COMPARISON METRICS SECTION */}
               <div className="grid lg:grid-cols-2 gap-12">
                  <div className="p-10 bg-zinc-950 border-2 border-white/5 rounded-[3.5rem] space-y-10 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><Target size={180} /></div>
                     <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic relative z-10">Strategic <span className="text-decensat">Unlock</span></h3>
                     
                     <div className="space-y-8 relative z-10">
                        <div className="space-y-4">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/10 pb-2">Manual Agency Bottlenecks</div>
                           <div className="grid grid-cols-2 gap-4">
                              {[
                                'Subjective Risk', 'Cash Flow Fog', 'Scope Leakage', 'Manual Contracts'
                              ].map(b => (
                                <div key={b} className="flex items-center gap-3 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
                                   <X size={14} className="text-rose-500" />
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{b}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="text-[10px] font-black text-decensat uppercase tracking-widest border-b border-decensat/20 pb-2">C3-Governed Accelerations</div>
                           <div className="grid grid-cols-2 gap-4">
                              {[
                                'Hour 1 Analysis', 'Auto-Settlement', 'Scope Finality', 'Global Velocity'
                              ].map(a => (
                                <div key={a} className="flex items-center gap-3 p-4 bg-decensat/10 border border-decensat/20 rounded-2xl">
                                   <Check size={14} className="text-decensat" />
                                   <span className="text-[9px] font-black text-white uppercase tracking-widest">{a}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-10 bg-black border-2 border-white/5 rounded-[3.5rem] flex flex-col justify-center gap-12 shadow-2xl relative overflow-hidden group">
                     <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity size={200} /></div>
                     <div className="grid grid-cols-2 gap-8 relative z-10">
                        {[
                          { label: 'Decision Speed', prev: '3 Days', next: '3 Hours', delta: '-96%', icon: Clock, color: 'text-decensat' },
                          { label: 'Payment Disputes', prev: '12/mo', next: '1/mo', delta: '-92%', icon: AlertCircle, color: 'text-rose-500' },
                          { label: 'On-Time Delivery', prev: '71%', next: '94%', delta: '+23%', icon: Rocket, color: 'text-blue-500' },
                          { label: 'Team Utilization', prev: '65%', next: '82%', delta: '+17%', icon: Activity, color: 'text-amber-500' }
                        ].map((m, i) => (
                           <div key={i} className="space-y-3 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/20 transition-all">
                              <div className="flex items-center gap-3">
                                 <m.icon size={16} className={m.color} />
                                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</div>
                              </div>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-2xl font-black text-white font-mono">{m.next}</span>
                                 <span className={`text-[9px] font-black uppercase ${m.delta.startsWith('+') ? 'text-emerald-500' : 'text-decensat'}`}>{m.delta}</span>
                              </div>
                              <div className="text-[7px] text-slate-700 font-mono uppercase tracking-widest">Baseline: {m.prev}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* STRATEGIC REALLOCATION MODEL */}
               <div className="p-10 lg:p-16 bg-zinc-950 border-2 border-white/5 rounded-[4rem] relative overflow-hidden shadow-3xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--decensat-lime)_0%,_transparent_70%)] opacity-[0.02]" />
                  <div className="relative z-10 space-y-12">
                     <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/10 pb-10">
                        <div>
                           <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter italic">Strategic <span className="text-decensat">Reallocation</span></h3>
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-2 italic leading-relaxed max-w-xl">
                              "The Decensat Decision Architecture doesn't just automate finance—it fundamentally reallocates cognitive and creative capital."
                           </p>
                        </div>
                        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-decensat">
                           <PieChart size={48} className="animate-pulse" />
                        </div>
                     </div>

                     <div className="grid lg:grid-cols-2 gap-20">
                        {/* BEFORE C3 */}
                        <div className="space-y-8">
                           <div className="flex items-center gap-4 text-slate-500">
                              <TrendingDown size={24} />
                              <div className="text-xs font-black uppercase tracking-[0.3em]">Before C3: Scattered Focus</div>
                           </div>
                           <div className="space-y-6">
                              {[
                                { label: 'Financial Oversight', val: 40, color: 'bg-rose-500/30' },
                                { label: 'Operational Firefighting', val: 30, color: 'bg-slate-700' },
                                { label: 'Client Management', val: 20, color: 'bg-slate-800' },
                                { label: 'Creative/Technical Work', val: 10, color: 'bg-decensat/20' }
                              ].map((item, i) => (
                                 <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                       <span>{item.label}</span>
                                       <span>{item.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-white/5 shadow-inner">
                                       <div className={`h-full transition-all duration-1000 ${item.color}`} style={{ width: `${item.val}%` }} />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* AFTER C3 */}
                        <div className="space-y-8">
                           <div className="flex items-center gap-4 text-decensat">
                              <TrendingUp size={24} />
                              <div className="text-xs font-black uppercase tracking-[0.3em]">After C3: Strategic Concentration</div>
                           </div>
                           <div className="space-y-6">
                              {[
                                { label: 'Financial Oversight', val: 5, color: 'bg-blue-500/40', sub: 'AI-Governed' },
                                { label: 'Operational Excellence', val: 10, color: 'bg-indigo-500/40', sub: 'System Optimized' },
                                { label: 'Client Partnership', val: 30, color: 'bg-white/20', sub: 'Strategic Advisory' },
                                { label: 'Creative & Technical Excellence', val: 55, color: 'bg-decensat shadow-glow-sm', sub: 'Innovation & Quality' }
                              ].map((item, i) => (
                                 <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                       <span className={item.val >= 30 ? 'text-white' : 'text-slate-500'}>{item.label} <span className="text-[8px] opacity-40 ml-2">[{item.sub}]</span></span>
                                       <span className={item.val >= 30 ? 'text-decensat' : 'text-slate-400'}>{item.val}%</span>
                                    </div>
                                    <div className="h-4 w-full bg-black rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
                                       <div className={`h-full rounded-full transition-all duration-1000 ${item.color}`} style={{ width: `${item.val}%` }} />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="mt-12 p-8 bg-black/40 border border-white/10 rounded-3xl">
                        <div className="flex items-start gap-6">
                           <div className="w-12 h-12 bg-decensat/10 rounded-2xl flex items-center justify-center text-decensat shrink-0 border border-decensat/20 shadow-xl">
                              <ShieldCheck size={24} />
                           </div>
                           <div className="space-y-2">
                              <div className="text-[11px] font-black text-white uppercase tracking-widest">The Decensat Transformation</div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed tracking-tight italic">
                                 We've moved from being a services business constrained by financial operations to becoming an execution platform powered by AI governance. 
                                 Finance is no longer a bottleneck—it's our competitive advantage. Our system handles calculation, enforcement, and compliance so our principals focus on creativity and innovation.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'approvals' && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-6 sm:pb-8 gap-6">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">Communication <span className="text-decensat not-italic">Gate</span></h2>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-1">Project_Manager_Approval_Queue_v1.5</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-400">
                      Syncing: Sol_VM_v4.7
                    </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                  <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                     <div className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4 pl-4 border-l-2 border-decensat">Pending_Signals</div>
                     <div className="grid gap-3 sm:gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                        {emails.filter(e => e.status === 'pending').map(email => {
                          const display = generateDynamicBody(email);
                          return (
                            <button 
                              key={email.id} 
                              onClick={() => { setSelectedEmailId(email.id); setIsEditingEmail(false); }} 
                              className={`p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 text-left transition-all relative overflow-hidden group ${selectedEmailId === email.id ? 'bg-black border-decensat shadow-glow-sm scale-[1.02]' : 'bg-black/40 border-white/5 hover:border-white/20'}`}
                            >
                               <div className="flex justify-between items-start mb-2 sm:mb-3">
                                 <span className="px-2.5 py-1 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">pending_review</span>
                                 <span className="text-[7px] sm:text-[8px] font-mono text-slate-700">T: {email.clientTier}</span>
                               </div>
                               <div className="text-white font-black text-[11px] sm:text-xs uppercase tracking-tight truncate mb-1">{display.subject}</div>
                               <div className="text-[8px] sm:text-[9px] font-bold text-slate-500 truncate italic">Target: {email.recipient}</div>
                               {(email.subject || email.body) && (
                                 <div className="mt-2 flex items-center gap-1.5">
                                   <FileEdit size={10} className="text-decensat" />
                                   <span className="text-[7px] font-black text-decensat uppercase tracking-widest">Modified Signal</span>
                                 </div>
                               )}
                            </button>
                          );
                        })}
                        {emails.filter(e => e.status === 'pending').length === 0 && (
                          <div className="p-10 border-2 border-dashed border-white/5 rounded-[2rem] text-center opacity-30">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Queue Clear</span>
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="lg:col-span-8">
                     {selectedEmail ? (
                       <div className="bg-black border-2 border-white/10 rounded-[2rem] sm:rounded-[3rem] min-h-[500px] flex flex-col shadow-3xl animate-in zoom-in-95 duration-500 overflow-hidden">
                          <div className="p-6 sm:p-10 border-b border-white/5 bg-zinc-900/50 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><MessageSquare size={120} /></div>
                             
                             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-6 relative z-10">
                                <div className="flex items-center gap-5">
                                   <div className="w-12 h-12 rounded-2xl bg-decensat/10 flex items-center justify-center text-decensat border border-decensat/20 shadow-xl">
                                      <Mail size={24} />
                                   </div>
                                   <div>
                                      <div className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Signal_Preview: {selectedEmail.templateId}</div>
                                      {isEditingEmail ? (
                                        <div className="text-decensat font-black text-[10px] uppercase tracking-widest flex items-center gap-2 animate-pulse">
                                          <Activity size={12} /> Principal_Editor_Mode
                                        </div>
                                      ) : (
                                        <h4 className="text-white font-black text-base sm:text-xl uppercase tracking-tighter leading-tight">{selectedEmail.subject || generateDynamicBody(selectedEmail).subject}</h4>
                                      )}
                                   </div>
                                </div>
                                <div className="flex gap-3 w-full sm:w-auto">
                                   {!isEditingEmail ? (
                                      <>
                                         <button onClick={() => handleEmailAction(selectedEmail.id, 'rejected')} className="flex-1 sm:flex-none px-5 py-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-black uppercase hover:bg-rose-500/20 transition-all">Reject</button>
                                         <button onClick={handleStartEditEmail} className="flex-1 sm:flex-none px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-[10px] font-black uppercase hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2"><Edit3 size={14}/> Edit Signal</button>
                                         <button onClick={() => handleEmailAction(selectedEmail.id, 'approved')} className="flex-1 sm:flex-none px-8 py-4 bg-decensat text-black rounded-xl text-[10px] font-black uppercase hover:bg-white transition-all shadow-glow-sm flex items-center justify-center gap-3 sm:gap-4 flex items-center justify-center gap-2"><Check size={16} strokeWidth={3}/> Approve & Send</button>
                                      </>
                                   ) : (
                                      <>
                                         <button onClick={() => setIsEditingEmail(false)} className="flex-1 sm:flex-none px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-slate-500 text-[10px] font-black uppercase hover:text-white transition-all">Abort_Edits</button>
                                         <button 
                                          disabled={!isEmailEditValid}
                                          onClick={handleSaveEmailEdit} 
                                          className={`flex-1 sm:flex-none px-10 py-4 rounded-xl text-[10px] font-black uppercase transition-all shadow-glow-sm flex items-center justify-center gap-2 ${isEmailEditValid ? 'bg-decensat text-black hover:bg-white' : 'bg-zinc-800 text-slate-700 cursor-not-allowed'}`}
                                         >
                                            <Save size={16}/> Save Draft_Signal
                                         </button>
                                      </>
                                   )}
                                </div>
                             </div>

                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-10 text-[10px] font-mono relative z-10">
                                <div className="flex flex-col gap-1.5">
                                   <span className="text-slate-600 uppercase tracking-widest text-[8px]">RECIPIENT_UPLINK:</span>
                                   <span className="text-white font-black uppercase border-b border-white/5 pb-1">{selectedEmail.recipient}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                   <span className="text-slate-600 uppercase tracking-widest text-[8px]">PROTOCOL_IDENT:</span>
                                   <span className="text-decensat font-black border-b border-decensat/10 pb-1">v4.8.0_RESEND_STRICT</span>
                                </div>
                             </div>
                          </div>

                          <div className="flex-1 p-6 sm:p-10 bg-zinc-950 font-mono text-[11px] leading-relaxed custom-scrollbar overflow-y-auto">
                             {isEditingEmail ? (
                               <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                                  <div className="space-y-2">
                                     <div className="flex justify-between items-center px-2">
                                        <label className="text-[9px] font-black text-decensat uppercase tracking-[0.3em]">SUBJECT_HEADER</label>
                                        <span className={`text-[8px] font-black ${editedSubject.length < 10 ? 'text-rose-500' : 'text-slate-600'}`}>{editedSubject.length}/150 [MIN: 10]</span>
                                     </div>
                                     <input 
                                        type="text" 
                                        maxLength={150}
                                        value={editedSubject}
                                        onChange={(e) => setEditedSubject(e.target.value)}
                                        className={`w-full bg-black border-2 rounded-xl px-6 py-4 text-xs text-white font-black uppercase outline-none transition-all shadow-inner ${editedSubject.length < 10 ? 'border-rose-500/40 focus:border-rose-500' : 'border-decensat/20 focus:border-decensat/50'}`}
                                     />
                                  </div>
                                  <div className="space-y-2">
                                     <div className="flex justify-between items-center px-2">
                                        <label className="text-[9px] font-black text-decensat uppercase tracking-[0.3em]">SIGNAL_BODY_TEXT</label>
                                        <span className={`text-[8px] font-black ${editedBody.length < 50 ? 'text-rose-500' : 'text-slate-600'}`}>{editedBody.length} CHRS [MIN: 50]</span>
                                     </div>
                                     <textarea 
                                        value={editedBody}
                                        onChange={(e) => setEditedBody(e.target.value)}
                                        className={`w-full min-h-[350px] bg-black border-2 rounded-2xl p-8 text-[11px] text-slate-300 font-mono leading-relaxed outline-none transition-all shadow-inner uppercase tracking-tight ${editedBody.length < 50 ? 'border-rose-500/40 focus:border-rose-500' : 'border-decensat/20 focus:border-decensat/50'}`}
                                     />
                                  </div>
                               </div>
                             ) : (
                               <div className="p-8 sm:p-12 bg-black border border-white/5 rounded-[2rem] text-slate-300 whitespace-pre-wrap shadow-inner relative overflow-hidden group/text animate-in fade-in duration-500">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-decensat/20" />
                                  {(selectedEmail.body || generateDynamicBody(selectedEmail).body)}
                               </div>
                             )}
                          </div>

                          <div className="p-4 sm:p-6 bg-black border-t border-white/5 flex items-center justify-between opacity-50 grayscale hover:grayscale-0 transition-all">
                             <div className="flex items-center gap-3">
                                <Terminal size={14} className="text-slate-600" />
                                <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Integrity_Check: v4.8 Pass</span>
                             </div>
                             <div className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                                Hash: {selectedEmail.id.split('-')[1]} // Stage: PM_AUDIT
                             </div>
                          </div>
                       </div>
                     ) : (
                       <div className="h-full min-h-[400px] bg-black/40 border-2 border-dashed border-white/5 rounded-[2rem] sm:rounded-[4rem] flex flex-col items-center justify-center p-12 sm:p-20 text-center">
                          <MailIcon size={64} className="text-slate-800 mb-8 opacity-20" />
                          <h4 className="text-white font-black text-xl sm:text-2xl uppercase tracking-tighter italic">GATE_LOCKED: SELECT_SIGNAL</h4>
                          <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-3 max-w-xs leading-relaxed">
                             Human attestation required for all automated project communication nodes.
                          </p>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          )}

          {activeView === 'projects' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
               <div className="flex flex-col gap-6 sm:flex-row sm:items-end justify-between border-b border-white/5 pb-8">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic">Lifecycle <span className="text-decensat not-italic">Registry</span></h2>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-mono uppercase tracking-[0.4em] mt-1">Manual_Phase_Migration_v4.2</p>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center bg-black/40 p-2 sm:p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="bg-black border border-white/10 rounded-lg px-3 py-1.5 text-[9px] font-black uppercase text-white outline-none focus:border-decensat cursor-pointer"><option value="all">ALL_DISCIPLINES</option><option value="development">DEVELOPMENT</option></select>
                    <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="p-2 bg-white/5 rounded-lg border border-white/10 text-slate-400 hover:text-decensat transition-all"><ArrowUpDown size={12} /></button>
                  </div>
               </div>
               
               <div className="bg-black border border-white/5 rounded-[1.5rem] sm:rounded-[3rem] overflow-visible shadow-[0_64px_128px_-32px_rgba(0,0,0,1)]">
                  <table className="w-full text-left min-w-[1000px]">
                     <thead>
                       <tr className="border-b border-white/5 bg-white/5">
                         <th className="px-6 sm:px-10 py-6 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Project_ID</th>
                         <th className="px-6 sm:px-10 py-6 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Tier</th>
                         <th className="px-6 sm:px-10 py-6 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Complexity</th>
                         <th className="px-6 sm:px-10 py-6 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Current_Phase</th>
                         <th className="px-6 sm:px-10 py-6 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {filteredAndSortedProjects.map(p => (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                             <td className="px-6 sm:px-10 py-8 font-mono text-[11px] sm:text-[12px] text-slate-300">#{p.id.split('-')[1].toUpperCase()}</td>
                             <td className="px-6 sm:px-10 py-8"><span className="text-[9px] sm:text-[10px] font-black text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10 uppercase tracking-widest">{p.clientTier}</span></td>
                             <td className="px-6 sm:px-10 py-8 font-mono text-[11px] sm:text-[12px] text-slate-400">{p.complexityScore ? `CX_${p.complexityScore.toString().padStart(2, '0')}` : '--'}</td>
                             <td className="px-6 sm:px-10 py-8">
                                <div className="relative inline-block">
                                  <div className="flex items-center gap-4">
                                     <div className={`px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusPill(p.status)}`}>
                                        {p.status.replace('_', ' ')}
                                     </div>
                                     <button 
                                      onClick={() => setActiveStatusPicker(activeStatusPicker === p.id ? null : p.id)}
                                      className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-decensat transition-all"
                                      title="Manually Update Status"
                                     >
                                        <Edit3 size={12} />
                                     </button>
                                  </div>
                                  
                                  {activeStatusPicker === p.id && (
                                    <div className="absolute left-0 top-full mt-2 w-56 bg-zinc-950 border-2 border-white/10 rounded-2xl shadow-3xl z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                       <div className="p-3 border-b border-white/5 bg-black/40 text-[8px] font-black text-slate-500 uppercase tracking-widest">Migrate_Phase</div>
                                       {STATUS_ORDER.map(status => (
                                          <button 
                                            key={status} 
                                            onClick={() => handleUpdateStatus(p.id, status)}
                                            className={`w-full text-left px-5 py-4 text-[9px] font-black uppercase tracking-widest border-b last:border-0 border-white/5 transition-all flex items-center justify-between group/row ${p.status === status ? 'bg-decensat/10 text-decensat' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                                          >
                                             {status.replace('_', ' ')}
                                             {p.status === status && <Check size={12} strokeWidth={4} />}
                                             {p.status !== status && <ArrowRight size={10} className="opacity-0 group-hover/row:opacity-100 transition-opacity" />}
                                          </button>
                                       ))}
                                    </div>
                                  )}
                                </div>
                             </td>
                             <td className="px-6 sm:px-10 py-8 text-right">
                                <button onClick={() => setSelectedProjectId(p.id)} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-decensat hover:text-black transition-all">Manage_Node</button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeView === 'automation' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
               <div className="border-b border-white/5 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Automation <span className="text-decensat not-italic">Configuration</span></h2>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.4em] font-mono mt-1">System_Orchestration_&_Enforcement_v4.5</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="px-4 py-2 bg-decensat/10 border border-decensat/20 rounded-xl text-[8px] font-black text-decensat uppercase tracking-widest flex items-center gap-2">
                        <ShieldPlus size={12} /> PROTOCOL_ACTIVE
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  <div className="lg:col-span-8 space-y-12">
                     
                     {/* Core Parameters Card */}
                     <div className="p-8 sm:p-12 bg-black border-2 border-white/5 rounded-[3rem] space-y-10 shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform"><Sliders size={160} /></div>
                        
                        <div className="relative z-10 space-y-10">
                           <div className="flex items-center gap-4 text-decensat font-black text-[11px] uppercase tracking-[0.4em] border-b border-white/10 pb-6">
                              <Cog size={18} className="animate-spin-slow" /> Core Orchestration Parameters
                           </div>

                           <div className="grid sm:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                 <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Advance_Protocol (%)</label>
                                    <span className="text-xl font-mono font-black text-white">{overridePercentage}%</span>
                                 </div>
                                 <input 
                                    type="range" min="10" max="100" step="5"
                                    value={overridePercentage}
                                    onChange={(e) => setOverridePercentage(Number(e.target.value))}
                                    className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-decensat"
                                 />
                                 <div className="flex justify-between text-[7px] text-slate-700 font-black uppercase tracking-widest">
                                    <span>Baseline (15%)</span>
                                    <span>Terminal (100%)</span>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Settlement_Cycle</label>
                                 </div>
                                 <div className="relative group">
                                    <select className="w-full bg-zinc-950 border-2 border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-white uppercase outline-none focus:border-decensat/40 transition-all cursor-pointer appearance-none">
                                       <option>Net 0 (Standard)</option>
                                       <option>Net 7 (Retention)</option>
                                       <option>Milestone Linked (Hybrid)</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none"><ChevronDown size={20} /></div>
                                 </div>
                              </div>
                           </div>

                           <div className="pt-8 border-t border-white/5">
                              <div className="grid sm:grid-cols-3 gap-6">
                                 {[
                                    { label: 'Auto-Assignment', desc: 'SURA routes nodes based on SRT', state: autoAssignmentEnabled, setter: setAutoAssignmentEnabled, icon: Network },
                                    { label: 'Signal Transmission', desc: 'Auto-send audited emails', state: autoEmailEnabled, setter: setAutoEmailEnabled, icon: Send },
                                    { label: '443 Enforcement', desc: 'Automatic de-risking triggers', state: true, setter: null, icon: ShieldCheck, locked: true }
                                 ].map((feat, i) => (
                                    <div key={i} className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-4 relative ${feat.state ? 'bg-decensat/5 border-decensat/20' : 'bg-white/5 border-white/5 opacity-50'}`}>
                                       <div className="flex items-center justify-between">
                                          <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${feat.state ? 'text-decensat' : 'text-slate-600'}`}>
                                             <feat.icon size={18} />
                                          </div>
                                          {feat.locked ? (
                                             <Lock size={12} className="text-slate-700" />
                                          ) : (
                                             <button onClick={() => feat.setter?.(!feat.state)}>
                                                {feat.state ? <ToggleRight className="text-decensat" size={32} /> : <ToggleLeft className="text-slate-700" size={32} />}
                                             </button>
                                          )}
                                       </div>
                                       <div>
                                          <div className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{feat.label}</div>
                                          <p className="text-[8px] text-slate-500 font-bold uppercase leading-tight italic">{feat.desc}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Workflow Triggers Dashboard */}
                     <div className="p-8 sm:p-12 bg-zinc-950 border-2 border-white/5 rounded-[3rem] space-y-10 shadow-3xl relative overflow-hidden">
                        <div className="absolute bottom-0 right-0 p-12 opacity-[0.02] pointer-events-none"><Braces size={200} /></div>
                        
                        <div className="relative z-10 space-y-8">
                           <div className="flex items-center justify-between border-b border-white/10 pb-6">
                              <div className="flex items-center gap-4 text-blue-500 font-black text-[11px] uppercase tracking-[0.4em]">
                                 <Braces size={18} /> Conditional Execution Rules
                              </div>
                              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">+ New Trigger</button>
                           </div>

                           <div className="space-y-4">
                              {[
                                 { id: 'T1', condition: 'Project_Budget > 50,000 USDC', action: 'Set Advance to 50%', active: true, type: 'Finance' },
                                 { id: 'T2', condition: 'Urgency == "Critical"', action: 'Bypass Lead Architect Review', active: false, type: 'Lifecycle' },
                                 { id: 'T3', condition: 'Node_Class == "Web3"', action: 'Enforce Multi-Sig Escrow', active: true, type: 'Security' },
                                 { id: 'T4', condition: 'Phase == "Initiated"', action: 'Trigger "Audit Initiated" Signal', active: true, type: 'Outreach' }
                              ].map((rule, i) => (
                                 <div key={i} className="group flex items-center justify-between p-6 bg-black border border-white/5 rounded-2xl hover:border-white/20 transition-all shadow-inner">
                                    <div className="flex items-center gap-6">
                                       <div className="text-[9px] font-mono font-black text-slate-800 uppercase tracking-widest">{rule.id}</div>
                                       <div className="w-1 h-10 bg-white/5 rounded-full" />
                                       <div>
                                          <div className="flex items-center gap-3 mb-1">
                                             <div className="text-[10px] font-mono text-blue-400 font-black uppercase">IF: {rule.condition}</div>
                                             <span className="text-[7px] font-black px-1.5 py-0.5 bg-zinc-900 border border-white/5 text-slate-600 rounded uppercase">{rule.type}</span>
                                          </div>
                                          <div className="text-[11px] font-black text-white uppercase tracking-widest">THEN: {rule.action}</div>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <button className="p-2 text-slate-700 hover:text-white transition-all"><Edit3 size={14}/></button>
                                       <button className="p-2 text-slate-700 hover:text-rose-500 transition-all"><Trash size={14}/></button>
                                       <div className={`w-2.5 h-2.5 rounded-full ${rule.active ? 'bg-decensat shadow-[0_0_10px_rgba(163,230,53,0.5)]' : 'bg-zinc-800'}`} />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                     
                     {/* Protocol Enforcement Level */}
                     <div className="p-8 sm:p-10 bg-black/40 border-2 border-white/5 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center gap-4 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] border-b border-white/10 pb-6">
                           <ShieldAlert size={18} className={enforcementLevel === 'STRICT' ? 'text-rose-500 animate-pulse' : ''} /> Integrity Enforcement
                        </div>
                        
                        <div className="grid gap-3">
                           {(['LOW', 'MED', 'STRICT'] as const).map(lvl => (
                              <button 
                                 key={lvl}
                                 onClick={() => setEnforcementLevel(lvl)}
                                 className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${enforcementLevel === lvl ? 'bg-rose-500/10 border-rose-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                              >
                                 <div className="flex items-center justify-between mb-2">
                                    <div className={`text-xs font-black uppercase tracking-widest ${enforcementLevel === lvl ? 'text-rose-500' : 'text-slate-500'}`}>{lvl} PROTOCOL</div>
                                    {enforcementLevel === lvl && <CheckCircle2 size={16} className="text-rose-500" />}
                                 </div>
                                 <p className="text-[8px] text-slate-600 font-bold uppercase leading-tight">
                                    {lvl === 'STRICT' ? 'Manual attestation required for all signal modifications.' : lvl === 'MED' ? 'Automated overrides permitted with audit log.' : 'Heuristic-only governance enabled.'}
                                 </p>
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Configuration Telemetry */}
                     <div className="p-8 sm:p-10 bg-zinc-950 border-2 border-white/5 rounded-[3rem] space-y-8 shadow-3xl">
                        <div className="flex items-center gap-4 text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] border-b border-white/10 pb-6">
                           <Binary size={18} /> System Metadata
                        </div>
                        
                        <div className="space-y-6">
                           {[
                              { label: 'Active Triggers', val: '14' },
                              { label: 'Daily Executions', val: '1,422' },
                              { label: 'Avg Latency', val: '42ms' },
                              { label: 'Enforcement Index', val: '0.994' }
                           ].map((item, i) => (
                              <div key={i} className="flex justify-between items-end">
                                 <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{item.label}</div>
                                 <div className="text-lg font-mono font-black text-white">{item.val}</div>
                              </div>
                           ))}
                        </div>

                        <button className="w-full py-5 bg-white/5 border-2 border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-3">
                           <RefreshCw size={14} /> Flush Logic Cache
                        </button>
                     </div>

                  </div>
               </div>

               {/* Footer Status Bar */}
               <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-40">
                  <div className="flex items-center gap-4 text-[9px] font-mono font-black text-slate-700 uppercase tracking-[0.5em]">
                     <Terminal size={14} /> SYS_SYNC_LOCKED: DC3_AUTO_v4.8.0
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-decensat animate-pulse" />
                     <span className="text-[9px] font-mono font-black text-decensat uppercase tracking-widest">Protocol Sync Nominal</span>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'audit' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-1000">
               <div className="border-b border-white/5 pb-8">
                  <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Audit <span className="text-decensat not-italic">Logs</span></h2>
                  <p className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-[0.4em] font-mono mt-2">Immutable_System_History_v4.5</p>
               </div>
               
               <div className="bg-black border-2 border-white/5 rounded-[2.5rem] overflow-hidden shadow-3xl">
                  <div className="p-8 border-b border-white/5 bg-zinc-950 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <Terminal size={20} className="text-decensat" />
                        <span className="text-[11px] font-black text-white uppercase tracking-widest">System_Event_Stream</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-600 hover:text-white transition-all"><RefreshCw size={16} /></button>
                        <button className="p-2 text-slate-600 hover:text-white transition-all"><Search size={16} /></button>
                     </div>
                  </div>
                  <div className="divide-y divide-white/5">
                     {[
                        { id: 'E-442', action: 'PROTOCOL_SYNC', detail: 'Node p-a12f migrated to Phase: closed', time: '14:22:04', actor: 'SYSTEM' },
                        { id: 'E-441', action: 'MANUAL_OVERRIDE', detail: 'Advance percentage set to 50% for p-b93c', time: '14:15:22', actor: 'SYS_ADMIN' },
                        { id: 'E-440', action: 'AUTH_HANDSHAKE', detail: 'Identity verified for user u-5', time: '13:55:10', actor: 'GATEWAY' },
                        { id: 'E-439', action: 'TRIGGER_ACTIVATED', detail: 'Email sequence "CDP_FINALIZED" transmitted', time: '12:30:44', actor: 'AUTO_OUTREACH' }
                     ].map(event => (
                        <div key={event.id} className="p-6 flex items-center gap-10 hover:bg-white/5 transition-colors group cursor-default">
                           <div className="w-16 text-[9px] font-mono font-black text-slate-700 uppercase tracking-widest shrink-0">{event.id}</div>
                           <div className="w-32 shrink-0">
                              <span className="text-[10px] font-black text-decensat uppercase tracking-widest px-2 py-1 bg-decensat/5 border border-decensat/20 rounded-md shadow-sm">{event.action}</span>
                           </div>
                           <div className="flex-1 text-[11px] font-bold text-slate-300 uppercase tracking-tight">{event.detail}</div>
                           <div className="w-32 text-right">
                              <div className="text-[10px] font-black text-white font-mono">{event.time}</div>
                              <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mt-1">Actor: {event.actor}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Management Drawer */}
      {selectedProject && (
        <div className="fixed inset-0 z-[6000] flex justify-end">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isSaving && setSelectedProjectId(null)} />
           <div className="w-full max-w-2xl bg-zinc-950 border-l border-white/10 relative z-10 p-8 sm:p-12 lg:p-16 shadow-2xl flex flex-col overflow-y-auto custom-scrollbar animate-in slide-in-from-right duration-500">
              <button onClick={() => setSelectedProjectId(null)} className="absolute top-6 right-6 sm:top-10 sm:right-10 p-3 text-slate-500 hover:text-white bg-white/5 rounded-xl transition-all"><X size={24} /></button>
              
              <div className="space-y-12">
                 <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-3">Principal_Node_Audit</div>
                    <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">NODE_{selectedProject.id.split('-')[1].toUpperCase()}</h3>
                    <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-col gap-1.5">
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">UUID_REF:</span>
                       <span className="text-[10px] font-mono text-decensat font-black truncate">{selectedProject.uuid}</span>
                    </div>
                 </div>

                 <div className="p-8 sm:p-10 bg-black border-2 border-white/5 rounded-[2.5rem] sm:rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Activity size={120} /></div>
                    <div className="relative z-10 space-y-6">
                       <div className="flex items-center gap-4 text-blue-500 font-black text-[11px] uppercase tracking-[0.4em] border-b border-white/10 pb-4">
                          <TrendingUp size={18} /> Lifecycle Phase Migration
                       </div>
                       <div className="grid gap-3">
                          {STATUS_ORDER.map((status) => {
                            const isActive = selectedProject.status === status;
                            return (
                              <button key={status} onClick={() => handleUpdateStatus(selectedProject.id, status)} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isActive ? 'bg-blue-500 border-blue-500 text-white shadow-glow-sm' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20 hover:text-white'}`}>
                                <span className="text-[11px] font-black uppercase tracking-widest">{status.replace('_', ' ')}</span>
                                {isActive && <Check size={16} strokeWidth={4} />}
                              </button>
                            );
                          })}
                       </div>
                    </div>
                 </div>

                 <div className="p-8 sm:p-10 bg-black border-2 border-white/5 rounded-[2.5rem] sm:rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform"><Layers size={120} /></div>
                    <div className="relative z-10 space-y-6">
                       <div className="flex items-center gap-4 text-decensat font-black text-[11px] uppercase tracking-[0.4em] border-b border-white/10 pb-4">
                          <Cpu size={18} /> Institutional Segment
                       </div>
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {CLIENT_TIERS.map(tier => (
                            <button key={tier} onClick={() => handleUpdateTier(selectedProject.id, tier)} className={`p-4 rounded-xl border-2 text-[9px] font-black uppercase transition-all ${selectedProject.clientTier === tier ? 'bg-decensat border-decensat text-black shadow-glow-sm' : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'}`}>
                              {tier}
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminOpsDashboard;