import React, { useState, useEffect } from 'react';
import { SERVICE_JOBS, SRT_HISTORY } from '../constants';
import { JobStatus, ServiceJob } from '../types';
import { MapPin, Shield, Clock, Trophy, Lock, Zap, Briefcase, ShieldCheck, CheckCircle2, ChevronRight, X, Users, Activity, FileCheck, Loader2, ArrowRight, MessageSquare, Send, Code, BarChart3, TrendingUp } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface ServiceMarketplaceProps {
  activeRole: 'Employer' | 'Talent' | 'Investor' | 'Machine';
  setActiveRole: (role: 'Employer' | 'Talent' | 'Investor' | 'Machine') => void;
  activeTab: 'dashboard' | 'marketplace' | 'active' | 'architecture';
  setActiveTab: (tab: 'dashboard' | 'marketplace' | 'active' | 'architecture') => void;
}

const MY_PROFILES = [
  { id: 't1', name: 'Alice P.', role: 'Commercial Contractor', srt: 890, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'c1', name: 'Apex Const.', role: 'General Contractor', srt: 950, image: 'https://picsum.photos/id/1/200/200' }
];

const SRT_CHART_DATA = [
  { period: 'Week 1', score: 680 },
  { period: 'Week 2', score: 710 },
  { period: 'Week 3', score: 705 },
  { period: 'Week 4', score: 745 },
  { period: 'Week 5', score: 780 },
  { period: 'Current', score: 794 },
];

const ServiceMarketplace: React.FC<ServiceMarketplaceProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const [currentScore] = useState(794);
  const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationStep, setApplicationStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  // Form State
  const [selectedProfileId, setSelectedProfileId] = useState(MY_PROFILES[0].id);
  const [bidAmount, setBidAmount] = useState('');
  const [drawSchedule, setDrawSchedule] = useState('0% Upfront');
  const [proposalMessage, setProposalMessage] = useState('');

  useEffect(() => {
    // Simulate initial data hydration
    const timer = setTimeout(() => setIsHydrating(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const openApplication = (job: ServiceJob) => {
    setSelectedJob(job);
    setBidAmount(job.budget.toString());
    setProposalMessage(`I have analyzed the technical specifications for ${job.title} and am confident in delivering high-fidelity results. My execution strategy prioritizes sub-second latency and deterministic outcomes.`);
    setIsApplicationOpen(true);
    setApplicationStep('form');
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    // Notify global loader
    window.dispatchEvent(new CustomEvent('ai-activity', { detail: true }));
    
    // Simulate bid broadcasting to the network
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    window.dispatchEvent(new CustomEvent('ai-activity', { detail: false }));
    setApplicationStep('success');
  };

  const closeApplication = () => {
    setIsApplicationOpen(false);
    setSelectedJob(null);
  };

  if (isHydrating) {
    return (
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="text-juice-500 animate-spin mb-6" />
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest animate-pulse">Synchronizing Marketplace Nodes...</h3>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 animate-in fade-in duration-700">
        
        {/* Status Bar */}
        <div className="mb-8 sm:mb-12 p-4 sm:p-5 bg-white rounded-2xl border-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between text-[9px] sm:text-[11px] font-black font-mono gap-4 shadow-sm uppercase tracking-widest">
           <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 w-full md:w-auto">
             <div className="flex items-center gap-2 text-blue-700">
               <Shield size={14} />
               <span>BASE CHAIN L2</span>
               <span className="text-slate-950 font-bold">:: ESCROW & SRT</span>
             </div>
             <div className="w-px h-5 bg-slate-300 hidden sm:block"></div>
             <div className="flex items-center gap-2 text-juice-700">
               <Zap size={14} />
               <span>SOLANA VM</span>
               <span className="text-slate-950 font-bold">:: POINTS (400ms)</span>
             </div>
           </div>
           <div className="flex items-center gap-2 text-green-700 font-black">
             <div className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
             NETWORK ACTIVE
           </div>
        </div>

        {/* Header */}
        <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-950 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6 shadow-xl">
              <Shield size={12} className="text-juice-400 sm:size-[14px]" />
              <span>Verified Talent Economy</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-950 mb-4 tracking-tighter leading-none">Marketplace for <span className="text-juice-600">Verified</span> Talent</h2>
            <p className="text-base sm:text-xl text-slate-950 max-w-2xl font-black leading-relaxed border-l-4 border-juice-500 pl-4 sm:pl-6">
              Professional reputation is verified by protocol to ensure performance-based hiring and deterministic outcomes.
            </p>
          </div>
          
          <div className="flex bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border-2 border-slate-200 overflow-x-auto no-scrollbar shadow-lg w-full md:w-auto">
            {[
              { id: 'dashboard', label: 'Reputation' },
              { id: 'marketplace', label: 'Reverse Auction' },
              { id: 'active', label: 'Contracting' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 md:flex-none px-4 sm:px-8 py-3.5 sm:py-4 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest ${
                  activeTab === tab.id 
                    ? 'bg-slate-950 text-white shadow-xl' 
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
            <div className="lg:col-span-1 bg-white border-2 border-slate-200 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 relative overflow-hidden flex flex-col shadow-xl">
              <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-juice-100/40 rounded-full blur-[60px] sm:blur-[80px] -mr-16 sm:-mr-24 -mt-16 sm:-mt-24 pointer-events-none" />
              <div className="flex items-center justify-between mb-8 sm:mb-10 relative z-10">
                <h3 className="text-slate-950 text-[9px] sm:text-xs font-black uppercase tracking-widest">Reputation Score (SRT)</h3>
                <Trophy className="text-yellow-700" size={24} />
              </div>
              <div className="flex items-end gap-3 sm:gap-5 mb-4 relative z-10">
                <span className="text-6xl sm:text-8xl font-black text-slate-950 tracking-tighter leading-none">{currentScore}</span>
                <span className="text-sm sm:text-lg text-green-700 mb-2 sm:mb-6 font-black flex items-center gap-1">
                  +294 <span className="text-slate-950 font-black ml-1 uppercase text-[8px] sm:text-[10px] tracking-widest">30d</span>
                </span>
              </div>
              <div className="h-32 sm:h-48 w-full -ml-4 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SRT_CHART_DATA}>
                    <Area type="monotone" dataKey="score" stroke="#b45309" strokeWidth={4} fill="#fbbf24" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-auto pt-6 sm:pt-8 border-t border-slate-100 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-800 border border-yellow-300 shrink-0">
                      <ShieldCheck size={24} className="sm:size-[28px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-slate-950 text-base sm:text-lg leading-tight truncate">Elite Node Pending</div>
                      <div className="text-[8px] sm:text-[10px] text-slate-950 font-black uppercase tracking-widest mt-0.5 truncate">Enterprise Unlock</div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border-2 border-slate-200 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                <FileCheck size={24} className="text-juice-600 sm:size-[28px]"/> Validation History
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {SRT_HISTORY.map((log) => (
                  <div key={log.id} className="bg-slate-50 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 hover:border-juice-300 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4 sm:mb-6 gap-2">
                      <h4 className="text-lg sm:text-xl font-black text-slate-950 leading-tight truncate">{log.jobName}</h4>
                      <span className="text-green-700 font-black font-mono text-base sm:text-xl shrink-0">+{log.change}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 text-[9px] sm:text-xs text-slate-950 mb-5 sm:mb-6">
                      <span className="bg-slate-950 text-white px-3 py-1.5 rounded-lg font-black uppercase tracking-widest w-fit">{log.reason}</span>
                      <span className="font-black flex items-center gap-1.5"><Clock size={12}/> {log.date}</span>
                    </div>
                    <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl text-[9px] sm:text-xs font-mono text-slate-300 border border-white/5 flex items-center gap-3">
                      <div className="px-2 py-0.5 bg-juice-600 text-white rounded text-[8px] font-black uppercase tracking-widest">Logic</div>
                      <span className="text-juice-200 font-bold truncate">{log.formula}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MARKETPLACE VIEW */}
        {activeTab === 'marketplace' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            <div className="space-y-6 sm:space-y-8">
              {SERVICE_JOBS.filter(j => j.status === JobStatus.Bidding || j.status === JobStatus.Completed).map(job => (
                <div key={job.id} className="bg-white border-2 border-slate-200 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden hover:border-juice-400 hover:shadow-xl transition-all group">
                  <div className="h-44 sm:h-56 bg-slate-100 relative overflow-hidden">
                     <img src={job.image} alt={job.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                     <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white border border-slate-200 px-3 sm:px-5 py-2 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-950 shadow-xl flex items-center gap-2">
                        <Lock size={12} className="text-juice-600" /> {job.nodeTier} REQUIREMENT
                     </div>
                     <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-white">
                           <MapPin size={16} className="text-juice-400 sm:size-[20px]" />
                           <span className="text-xs sm:text-sm font-black tracking-tight uppercase truncate max-w-[200px]">{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {job.requiredStack.map(tech => (
                              <span key={tech} className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest font-mono">
                                 {tech}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="p-6 sm:p-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 sm:mb-8 gap-4">
                       <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight group-hover:text-juice-600 transition-colors">{job.title}</h3>
                       <div className="text-left sm:text-right shrink-0">
                          <div className="text-[8px] sm:text-[10px] font-black text-slate-950 uppercase tracking-widest mb-1 sm:mb-2">Max Budget</div>
                          <span className="text-2xl sm:text-3xl font-black text-juice-600 font-mono">${job.budget.toLocaleString()}</span>
                       </div>
                    </div>

                    <div className="mb-8 p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-between">
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Technical Complexity</span>
                          <div className="flex gap-1">
                             {[1,2,3,4,5].map(i => (
                                <div key={i} className={`w-8 h-1.5 rounded-full ${i <= job.complexity ? 'bg-juice-600' : 'bg-slate-200'}`} />
                             ))}
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Velocity Target</span>
                          <div className="text-sm font-black text-slate-950">{job.days} Days</div>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-10 text-xs">
                       <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100">
                         <span className="block text-slate-950 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1.5">Principal</span>
                         <span className="text-slate-950 font-black truncate block">{job.owner}</span>
                       </div>
                       <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100">
                         <span className="block text-slate-950 text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1.5">Authority</span>
                         <span className="text-slate-950 font-black truncate block">{job.manager}</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => job.status === JobStatus.Bidding && openApplication(job)}
                      className={`w-full py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-[11px] sm:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 group/apply ${
                        job.status === JobStatus.Bidding 
                          ? 'bg-slate-950 hover:bg-slate-900 text-white shadow-xl hover:scale-[1.02] active:scale-0.98' 
                          : 'bg-slate-200 text-slate-700 cursor-not-allowed border border-slate-300'
                      }`}
                    >
                      {job.status === JobStatus.Bidding ? (
                        <>
                          Apply Now <ArrowRight size={18} className="group-hover/apply:translate-x-1 transition-transform" />
                        </>
                      ) : 'Auction Concluded'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 h-fit sticky top-24 hidden lg:block shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></div>
                 <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">Active Auction Hub</h3>
              </div>
              <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest mb-10">Real-time Node handshakes</p>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-[10px] font-black text-slate-950 px-6 pb-4 border-b border-slate-100 uppercase tracking-widest">
                   <span>Talent Node</span>
                   <span>Bid / Logic</span>
                </div>
                {SRT_HISTORY.slice(0, 3).map((log, i) => (
                  <div key={i} className={`flex justify-between items-center p-5 rounded-[2rem] transition-all border bg-slate-50 border-slate-100 hover:border-juice-300`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-950 font-black text-xs">#{i+1}</div>
                      <div>
                        <div className="text-slate-950 text-sm font-black truncate max-w-[120px]">{log.jobName}</div>
                        <div className="text-[9px] text-slate-950 font-black flex items-center gap-1.5 uppercase tracking-tight mt-0.5">
                          <span className="flex items-center gap-1 text-green-700 font-black"><TrendingUp size={10}/> +{log.change} SRT</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 font-black font-mono text-[10px]">{log.date}</div>
                      <div className="text-[9px] font-black text-juice-700 uppercase tracking-widest mt-0.5">{log.reason}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-950 rounded-[2rem] text-white">
                 <div className="flex items-center gap-3 mb-4">
                    <BarChart3 size={20} className="text-juice-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Network Intelligence</span>
                 </div>
                 <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                    "Institutional bid clusters for technical nodes show 14.2% average compression in project timelines when SRT exceeds 850."
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proposal Submission Modal */}
      {isApplicationOpen && selectedJob && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={closeApplication} />
          
          <div className="bg-white border-2 border-slate-200 rounded-t-[2.5rem] sm:rounded-[3.5rem] w-full max-w-3xl relative z-[101] shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 overflow-hidden max-h-[95dvh] flex flex-col">
            <div className="p-8 sm:p-12 border-b-2 border-slate-100 bg-slate-50 flex justify-between items-start shrink-0">
               <div className="min-w-0 pr-4">
                 <h3 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
                   {applicationStep === 'success' ? 'Signal Transmitted!' : 'Broadcasting Proposal'}
                 </h3>
                 <p className="text-slate-950 font-black mt-2 sm:mt-3 uppercase text-[10px] sm:text-sm tracking-[0.2em] flex items-center gap-2 truncate">
                    <Briefcase size={16} className="text-juice-600 shrink-0"/> {selectedJob.title}
                 </p>
               </div>
               <button onClick={closeApplication} className="p-3 sm:p-4 text-slate-600 hover:text-slate-950 transition-colors bg-white rounded-full border border-slate-200 shadow-sm shrink-0">
                 <X size={20} className="sm:size-[28px]" />
               </button>
            </div>

            <div className="overflow-y-auto p-8 sm:p-16 custom-scrollbar flex-1">
              {applicationStep === 'form' ? (
                <div className="space-y-10">
                   <div>
                     <label className="block text-[10px] sm:text-[11px] font-black text-slate-950 uppercase tracking-widest mb-4 sm:mb-6">Select Active Identity Node</label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                       {MY_PROFILES.map(profile => (
                         <div 
                           key={profile.id}
                           onClick={() => setSelectedProfileId(profile.id)}
                           className={`flex items-center gap-4 sm:gap-5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-4 cursor-pointer transition-all ${
                             selectedProfileId === profile.id 
                               ? 'bg-juice-50 border-juice-500 shadow-xl scale-[1.02]' 
                               : 'bg-white border-slate-100 hover:border-slate-300'
                           }`}
                         >
                            <img src={profile.image} alt={profile.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-slate-200 shrink-0 shadow-lg" />
                            <div className="flex-1 min-w-0">
                               <div className="text-base sm:text-lg font-black text-slate-950 truncate">{profile.name}</div>
                               <div className="text-[10px] text-slate-950 font-black uppercase tracking-tight mt-0.5 truncate">{profile.role}</div>
                            </div>
                            {selectedProfileId === profile.id && <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-juice-600 flex items-center justify-center text-white shrink-0 shadow-lg"><CheckCircle2 size={16} strokeWidth={3}/></div>}
                         </div>
                       ))}
                     </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                      <div>
                         <label className="block text-[10px] sm:text-[11px] font-black text-slate-950 uppercase tracking-widest mb-4">Bid Amount (USDC)</label>
                         <div className="relative">
                            <input 
                              type="number" 
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-6 sm:px-8 py-5 text-slate-950 font-black focus:outline-none focus:border-juice-500 transition-all text-xl sm:text-2xl font-mono shadow-inner"
                            />
                            <div className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 font-black text-slate-950 tracking-widest text-[10px]">USDC</div>
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] sm:text-[11px] font-black text-slate-950 uppercase tracking-widest mb-4">Draw Logic</label>
                         <div className="relative">
                            <select 
                              value={drawSchedule}
                              onChange={(e) => setDrawSchedule(e.target.value)}
                              className="w-full bg-slate-50 border-4 border-slate-100 rounded-2xl px-6 sm:px-8 py-5 text-slate-950 font-black focus:outline-none focus:border-juice-500 transition-all text-sm appearance-none shadow-inner cursor-pointer"
                            >
                                <option>0% Upfront (Standard)</option>
                                <option>10% Upfront (Reputation Lock)</option>
                                <option>20% Upfront (High Signal Node)</option>
                            </select>
                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={20} />
                         </div>
                      </div>
                   </div>

                   <div>
                      <label className="block text-[10px] sm:text-[11px] font-black text-slate-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Code size={14} className="text-juice-600" /> Direct Intelligence Signal / Strategy
                      </label>
                      <textarea 
                        value={proposalMessage}
                        onChange={(e) => setProposalMessage(e.target.value)}
                        className="w-full bg-slate-50 border-4 border-slate-100 rounded-[2rem] p-8 text-slate-950 font-black focus:outline-none focus:border-juice-500 transition-all text-sm min-h-[160px] font-mono leading-relaxed shadow-inner"
                        placeholder="Outline your technical approach and stack optimization..."
                      />
                   </div>

                   <button 
                     onClick={handleSubmitApplication}
                     disabled={isSubmitting}
                     className={`w-full py-6 sm:py-8 text-white font-black text-xs sm:text-sm uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 ${
                       isSubmitting 
                         ? 'bg-slate-700 cursor-not-allowed opacity-80' 
                         : 'bg-slate-950 hover:bg-slate-900 shadow-juice-600/10'
                     }`}
                   >
                     {isSubmitting ? (
                       <>
                         Broadcasting Proposal... <Loader2 size={24} className="animate-spin" />
                       </>
                     ) : (
                       <>
                         <Lock size={20} className="text-juice-400" /> BROADCAST PROPOSAL <Send size={20} />
                       </>
                     )}
                   </button>
                </div>
              ) : (
                <div className="py-12 sm:py-20 text-center animate-in zoom-in-95 duration-500">
                   <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-[3rem] flex items-center justify-center mx-auto mb-8 sm:mb-10 border-4 border-green-200 shadow-xl">
                      <CheckCircle2 size={48} className="text-green-700 sm:size-[64px]" strokeWidth={3} />
                   </div>
                   <h3 className="text-4xl sm:text-6xl font-black text-slate-950 mb-4 sm:mb-6 tracking-tighter leading-none">Signal Handshake.</h3>
                   <p className="text-slate-950 text-lg sm:text-2xl font-black mb-10 sm:mb-16 leading-relaxed max-w-lg mx-auto px-4">
                      Your technical proposal for <span className="text-juice-600 font-black">{selectedJob.title}</span> has been encrypted and broadcasted to the Principal node.
                   </p>
                   <button 
                     onClick={closeApplication}
                     className="w-full sm:w-auto px-12 sm:px-20 py-5 sm:py-7 bg-slate-100 hover:bg-slate-200 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-[2rem] transition-all border-2 border-slate-300 shadow-md"
                   >
                      Return to Feed
                   </button>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-center gap-3">
               <ShieldCheck size={18} className="text-green-600" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-950">WebSocket Handshake Active :: SOL_VM_V4</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceMarketplace;