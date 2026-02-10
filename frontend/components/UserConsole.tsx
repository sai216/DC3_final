
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ShieldCheck, Wallet, CreditCard, FileText, 
  History, Settings, Zap, ArrowRight, Lock, 
  RefreshCw, Coins, Landmark, Calendar, Database,
  TrendingUp, BarChart3, Bell, User, LayoutGrid, Menu, Cpu, Fingerprint, Activity, Terminal, Eye, Shield, CheckCircle2, Circle,
  Camera, Upload, ImageIcon, Sparkles, Loader2, Mail, Key, BellRing, ToggleLeft, ToggleRight, Save, AlertCircle,
  MessageSquare, LogOut, ExternalLink,
  // Fix: Added Info icon to imports from lucide-react
  Info
} from 'lucide-react';
import { UserProfile, Agreement, AuditLog, AuthStage } from '../types';
import SwipeableActionWrapper from './SwipeableActionWrapper';

interface UserConsoleProps {
  user: UserProfile;
  onClose: () => void;
  onLogout: () => void;
  onOpenAdmin?: () => void;
  onUpdateUser?: (updates: Partial<UserProfile>) => void;
  initialTab?: 'overview' | 'agreements' | 'audit' | 'settings';
}

const MOCK_AGREEMENTS: Agreement[] = [
  { id: 'AG-102', type: 'MANAGED_SERVICE_120D', status: 'ACTIVE', nextTriggerDate: 'Oct 24, 2024', value: '$12,500/mo', rail: 'USDC' },
  { id: 'AG-443', type: 'SMART_COLLATERAL_443', status: 'ACTIVE', nextTriggerDate: 'N/A', value: '$85,000 Lock', rail: 'USDC' }
];

const UserConsole: React.FC<UserConsoleProps> = ({ user, onClose, onLogout, onOpenAdmin, onUpdateUser, initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'agreements' | 'audit' | 'settings'>(initialTab);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isC3Authorized = user.authStage >= AuthStage.ProjectEngaged;

  const navItems = [
    { id: 'overview', label: 'Node Console', icon: LayoutGrid },
    { id: 'agreements', label: 'Escrow Rails', icon: FileText },
    { id: 'audit', label: 'Audit Stream', icon: Terminal },
    { id: 'settings', label: 'Node Settings', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500" onClick={onClose} />
      
      <div className="bg-zinc-950 sm:border-[4px] lg:border-[6px] border-white/5 sm:rounded-[3rem] lg:rounded-[4rem] w-full max-w-6xl h-full sm:h-[85vh] relative z-10 flex flex-col shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-500">
        
        <div className="flex h-full flex-col sm:flex-row">
          {/* Console Navigation Sidebar */}
          <div className="hidden sm:flex w-64 lg:w-72 flex-col bg-black border-r border-white/5 p-8 lg:p-10 shrink-0">
             <div className="flex items-center gap-4 mb-10 lg:mb-14">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/5 border border-white/10 p-0.5 overflow-hidden shadow-glow-sm shrink-0">
                   {user.avatarUrl ? (
                     <img src={user.avatarUrl} alt="" className="w-full h-full object-cover rounded-[inherit]" />
                   ) : (
                     <div className="w-full h-full bg-decensat/10 flex items-center justify-center text-decensat">
                        <Fingerprint size={24} />
                     </div>
                   )}
                </div>
                <div className="min-w-0">
                   <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">NODE_TIER: {user.tier}</div>
                   <div className="text-white font-black truncate text-sm uppercase tracking-tight">{user.email.split('@')[0]}</div>
                </div>
             </div>

             <nav className="space-y-3 lg:space-y-4 flex-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-decensat text-black shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}

                {isC3Authorized && (
                  <a
                    href="https://assurative.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-xl lg:rounded-2xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 transition-all mt-6"
                  >
                    <ExternalLink size={18} />
                    Open C3 Hub
                  </a>
                )}
             </nav>

             <button onClick={onLogout} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all font-mono">
                <LogOut size={18} />
                Disconnect Node
             </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative overflow-hidden">
             <div className="p-6 sm:p-8 lg:p-12 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
                <div>
                   <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase tracking-tighter">
                     Returning Account <span className="text-decensat italic sm:not-italic">Console</span>
                   </h2>
                   <div className="flex items-center gap-3 mt-1 px-3 py-1 rounded-lg bg-white/5 border border-white/10 w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-decensat animate-pulse" />
                      <span className="text-[8px] lg:text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em] font-black">Link_Stable: {user.email}</span>
                   </div>
                </div>
                <button onClick={onClose} className="p-3 bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all active:scale-90">
                   <X size={20} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-14 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       <div className="p-8 bg-black/60 border border-white/5 rounded-[2.5rem] flex flex-col gap-3">
                          <Fingerprint className="text-decensat w-6 h-6" />
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">SRT Reputation</div>
                          <div className="text-3xl font-mono font-black text-white">{user.srt}</div>
                       </div>
                       <div className="p-8 bg-black/60 border border-white/5 rounded-[2.5rem] flex flex-col gap-3">
                          <Activity className="text-blue-500 w-6 h-6" />
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Active Sync Nodes</div>
                          <div className="text-3xl font-mono font-black text-white">{user.nodes}</div>
                       </div>
                       <div className="p-8 bg-decensat rounded-[2.5rem] flex flex-col gap-3">
                          <Zap className="text-black w-6 h-6" />
                          <div className="text-[9px] font-black text-black/60 uppercase tracking-widest">Auth Protocol</div>
                          <div className="text-2xl font-black text-black">PRIVY_JWT_v1</div>
                       </div>
                    </div>

                    {!isC3Authorized && (
                      <div className="p-10 bg-blue-500/5 border-2 border-blue-500/20 rounded-[3rem] space-y-6">
                         <div className="flex items-center gap-4 text-blue-400 font-black text-xs uppercase tracking-widest">
                            <Info size={18} /> C3 Command Access Gated
                         </div>
                         <p className="text-slate-400 text-sm font-bold uppercase leading-relaxed tracking-tight italic">
                           Your Command & Control Center (C3) will activate upon formal relationship consummation. Access external project tracking, deep treasury rails, and sub-second USDC settlement tools at assurative.ai once engagement is established.
                         </p>
                         <button className="px-8 py-4 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-blue-500 transition-all shadow-xl">
                            Request Engagement Triage
                         </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500 max-w-3xl">
                    <div className="space-y-6">
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 border-l-2 border-decensat pl-4">
                          <User size={12} className="text-decensat" /> Node Identity Node
                       </div>
                       <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-inner">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Ingestion_Uplink (Email)</label>
                             <div className="p-5 bg-zinc-950 border border-white/5 rounded-xl text-sm text-white font-mono opacity-60">
                                {user.email}
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">Persistent_Account_ID (JWT)</label>
                             <div className="p-5 bg-zinc-950 border border-white/5 rounded-xl text-[8px] text-decensat font-mono break-all leading-relaxed">
                                {user.jwtToken || 'LOCKED_BY_PRIVY_PROTOCOL'}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserConsole;
