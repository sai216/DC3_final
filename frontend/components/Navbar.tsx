import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Activity, Cpu, Zap, Target, LayoutGrid, Radio, ChevronRight, Fingerprint, ShieldCheck, BookOpen } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  cartCount?: number;
  activeId?: string;
  onNavigate?: (id: string) => void;
  onMenuClick?: () => void;
  currentUser?: UserProfile | null;
  onConsoleClick?: () => void;
  isLoggingIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount = 0, 
  activeId, 
  onNavigate, 
  onMenuClick,
  currentUser, 
  onConsoleClick,
  isLoggingIn 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [systemTime, setSystemTime] = useState('');

  useEffect(() => {
    const updateTime = () => setSystemTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const navLinks = [
    { id: 'portfolio', label: 'Portfolio', icon: Target },
    { id: 'creative', label: 'Capabilities', icon: Zap },
    { id: 'node-infrastructure', label: 'Network', icon: Activity },
    { id: 'help', label: 'Logic', icon: BookOpen },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate?.(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[100] bg-[#020617]/90 backdrop-blur-xl border-b border-white/5" aria-label="Primary site navigation">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20 lg:h-28">
          {/* Logo & Sidebar Trigger */}
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-10">
            <button 
              onClick={onMenuClick}
              className="p-3 text-white hover:text-decensat transition-all group relative outline-none focus-visible:ring-2 focus-visible:ring-decensat rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10"
              aria-label="Open Navigation Sidebar"
            >
              <Menu size={22} className="group-hover:scale-110 transition-transform duration-500" />
            </button>

            <button 
              className="flex items-center gap-3 sm:gap-4 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-decensat rounded-2xl p-1" 
              aria-label="Decensat Home"
              onClick={() => handleLinkClick('hero')}
            >
              <div className="h-9 w-9 sm:h-12 sm:w-12 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center transition-all duration-500 border-2 border-transparent group-hover:border-white group-hover:scale-110 shadow-2xl transform -rotate-6">
                <span className="text-black font-black italic text-xs sm:text-base">D3</span>
              </div>
              <div className="hidden xs:flex flex-col leading-none text-left">
                <span className="text-white font-black text-sm sm:text-base lg:text-lg tracking-tighter uppercase group-hover:text-decensat transition-colors">Decensat</span>
              </div>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden xl:block bg-black/40 border border-white/10 rounded-full p-1.5 shadow-2xl backdrop-blur-3xl">
            <ul className="flex items-center gap-1.5" role="list">
              {navLinks.map((link) => {
                const isActive = activeId === link.id;
                return (
                  <li key={link.id}>
                    <button
                      onClick={() => handleLinkClick(link.id)}
                      className={`relative px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all group flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-decensat ${
                        isActive ? 'text-black' : 'text-slate-400 hover:text-white'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className={`absolute inset-0 rounded-full transition-all duration-500 ease-expo ${
                        isActive ? 'bg-decensat shadow-[0_0_20px_rgba(163,230,53,0.5)] opacity-100 scale-100' : 'bg-white/0 opacity-0 scale-90 group-hover:bg-white/5 group-hover:opacity-100 group-hover:scale-100'
                      }`} />
                      <link.icon size={14} className={`relative z-10 transition-colors duration-500 ${isActive ? 'text-black' : 'text-decensat/60 group-hover:text-decensat'}`} />
                      <span className="relative z-10">{link.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Action Hub */}
          <div className="flex items-center gap-3 sm:gap-6 lg:gap-12">
            <div className="hidden lg:flex items-center gap-10 pr-10 border-r border-white/10">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2.5">
                  <Radio size={12} className="text-decensat animate-pulse" />
                  <span className="text-[11px] text-white font-mono font-black tracking-[0.2em]">{systemTime}</span>
                </div>
                <span className="text-[7px] text-slate-700 font-bold tracking-[0.5em] uppercase mt-1 text-right">LINK_SECURE</span>
              </div>
            </div>

            <button 
              onClick={() => currentUser ? onConsoleClick?.() : handleLinkClick('project-assessment')}
              disabled={isLoggingIn}
              className="group h-11 sm:h-14 px-5 sm:px-12 bg-decensat hover:bg-white text-black rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] transition-all active:scale-95 shadow-[0_16px_32px_-8px_rgba(163,230,53,0.5)] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoggingIn ? <Activity className="animate-spin" size={14} /> : currentUser ? <LayoutGrid size={14} /> : <ShieldCheck size={14} />}
              <span className="truncate max-w-[65px] xs:max-w-[100px] lg:max-w-none">{isLoggingIn ? 'Syncing...' : currentUser ? 'Console' : 'Start Audit'}</span>
              {!currentUser && !isLoggingIn && <ChevronRight size={12} className="hidden sm:block group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;