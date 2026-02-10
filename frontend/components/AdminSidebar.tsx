import React from 'react';
import { 
  X, 
  Cpu, 
  BookOpen, 
  User, 
  ShieldCheck, 
  Terminal, 
  Zap,
  Target,
  Globe,
  Activity,
  Rocket,
  Settings,
  Lock,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { UserProfile, AuthStage } from '../types';

interface AdminSidebarProps {
  onNavigate: (id: string) => void;
  activeId: string;
  onClose: () => void;
  user: UserProfile | null;
  onLogout?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  onNavigate, 
  activeId, 
  onClose, 
  user,
  onLogout
}) => {
  const isReturningVerified = user && (user.authStage >= AuthStage.PrivyHandshakeComplete);
  const isC3Authorized = user && (user.authStage >= AuthStage.ProjectEngaged);

  const menuItems = [
    { id: 'portfolio', label: 'Portfolio Index', icon: Target },
    { id: 'node-infrastructure', label: 'Architecture', icon: Globe },
    { id: 'project-assessment', label: 'Audit Protocol', icon: ShieldCheck },
    { id: 'creative', label: 'Capabilities', icon: Zap },
    { id: 'ai-optimization', label: 'AI Automation', icon: Activity },
    { id: 'learn-to-launch', label: 'Talent Pathway', icon: Rocket },
    { id: 'help', label: 'Logic KB', icon: BookOpen },
  ];

  const handleC3Trigger = () => {
    // Protocol Shift: Always route to the external Fintech provisioning solution
    // This ensures C3 Hub remains a gateway to institutional account management
    window.open('https://assurative.ai/auth/login', '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-white p-5 sm:p-8 lg:p-12 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-10 sm:mb-16 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-decensat rounded-2xl flex items-center justify-center text-black font-black italic shadow-glow-sm transform -rotate-6">
            D3
          </div>
          <div className="flex flex-col">
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2.5 sm:p-3 text-slate-500 hover:text-white transition-all bg-white/5 rounded-xl border border-white/10 hover:border-decensat/30 active:scale-90"
          aria-label="Close sidebar"
        >
          <X size={20} className="sm:size-[24px]" />
        </button>
      </div>

      <nav className="flex-1 space-y-1.5 sm:space-y-3 relative z-10 overflow-y-auto no-scrollbar pr-2">
        {menuItems.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 sm:gap-5 px-6 sm:px-8 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all group relative overflow-hidden ${
                isActive 
                  ? 'bg-decensat text-black shadow-glow-md translate-x-2' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5 hover:translate-x-1'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-black' : 'text-decensat opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110'} />
              <span className="relative z-10 truncate">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black animate-pulse shadow-[0_0_12px_rgba(0,0,0,0.8)] relative z-10" />
              )}
            </button>
          );
        })}

        <button
          onClick={handleC3Trigger}
          className="w-full flex items-center gap-4 sm:gap-5 px-6 sm:px-8 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] transition-all group relative overflow-hidden text-slate-500 hover:text-white hover:bg-white/5"
        >
          <Settings size={18} className="text-blue-500 animate-pulse" />
          <span className="relative z-10 truncate">C3 Hub</span>
          <ExternalLink size={12} className="ml-auto text-blue-500/50" />
        </button>
      </nav>

      <div className="mt-auto pt-6 sm:pt-10 border-t border-white/5 relative z-10">
        {user ? (
          <div className="space-y-4">
            <div className="w-full flex items-center gap-4 sm:gap-5 p-4 sm:p-6 bg-white/5 border border-white/10 rounded-[1.8rem] sm:rounded-[2.5rem] shadow-2xl">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-decensat/10 flex items-center justify-center text-decensat border border-decensat/30 shrink-0 shadow-glow-sm">
                <User size={20} className="sm:size-[24px]" />
              </div>
              <div className="text-left min-w-0 flex-1">
                <div className="text-[10px] sm:text-[12px] text-white font-black uppercase truncate tracking-tight">{user.email.split('@')[0]}</div>
                <div className="text-[7px] sm:text-[9px] text-decensat font-mono font-black uppercase tracking-widest mt-1">{isC3Authorized ? 'C3_ACTIVE' : (isReturningVerified ? 'VERIFIED' : 'GATED')}</div>
              </div>
            </div>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 sm:px-6 bg-white/5 border border-rose-500/30 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-black uppercase text-[9px] sm:text-[10px] tracking-[0.3em] rounded-[1.2rem] sm:rounded-2xl transition-all active:scale-95"
              >
                <LogOut size={16} className="sm:size-[18px]" />
                LOGOUT
              </button>
            )}
          </div>
        ) : (
          <button 
            onClick={() => onNavigate('project-assessment')}
            className="w-full py-5 sm:py-8 bg-decensat text-black font-black uppercase text-[10px] sm:text-[11px] tracking-[0.4em] sm:tracking-[0.5em] rounded-[1.2rem] sm:rounded-[2rem] hover:bg-white transition-all shadow-[0_24px_48px_-12px_rgba(163,230,53,0.4)] flex items-center justify-center gap-4 sm:gap-5 active:scale-95 group"
          >
            <ShieldCheck size={20} className="sm:size-[24px] group-hover:animate-pulse" />
            START_AUDIT
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;