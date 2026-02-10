'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import AdminSidebar from '@/components/AdminSidebar';
import Hero from '@/components/Hero';
import PricingTiers from '@/components/PricingTiers';
import AiSolutionsSection from '@/components/AiSolutionsSection';
import SuccessList from '@/components/SuccessList';
import ExecutionIndexPortfolio from '@/components/ExecutionIndexPortfolio';
import HelpSection from '@/components/HelpSection';
import SovereignFooter from '@/components/SovereignFooter';
import WhatsAppSupport from '@/components/WhatsAppSupport';
import ProjectAssessmentHub from '@/components/ProjectAssessmentHub_NEW';
import Learn2LaunchPathway from '@/components/Learn2LaunchPathway';
import AiConcierge from '@/components/AiConcierge';
import { Menu, Radio, User as UserIcon, ShieldCheck, Fingerprint, Zap, Target, BookOpen, Rocket, ChevronDown } from 'lucide-react';
import { UserProfile, AuthStage } from '@/types';
import { SERVICE_TIERS } from '@/constants';

const Home: React.FC = () => {
  const router = useRouter();
  const { user: privyUser, login, logout } = usePrivy();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [systemTime, setSystemTime] = useState('');
  const mainRef = useRef<HTMLElement>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const sections = useMemo(() => [
    { id: 'hero', label: 'Home' },
    { id: 'node-infrastructure', label: 'Network' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'project-assessment', label: 'Audit' },
    { id: 'creative', label: 'Capabilities' },
    { id: 'ai-optimization', label: 'Automation' },
    { id: 'learn-to-launch', label: 'Talent' },
    { id: 'help', label: 'Logic' }
  ], []);

  const mainNavLinks = useMemo(() => [
    { id: 'portfolio', label: 'Portfolio', icon: Target },
    { id: 'project-assessment', label: 'Audit', icon: ShieldCheck },
    { id: 'creative', label: 'Capabilities', icon: Zap },
    { id: 'learn-to-launch', label: 'Talent', icon: Rocket },
    { id: 'help', label: 'Logic', icon: BookOpen }
  ], []);

  // Sync Privy user with local state
  useEffect(() => {
    if (privyUser) {
      const email = privyUser.email?.address || privyUser.phone?.number || 'unknown@user.com';
      const domain = email.includes('@') ? email.split('@')[1] : 'verified';
      
      setCurrentUser({
        userId: privyUser.id,
        email,
        businessDomain: domain,
        srt: 942,
        nodes: 12,
        tier: 'ELITE',
        authStage: AuthStage.ActiveQuoting,
        roles: ['user'],
        authTimestamp: Date.now(),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        authProvider: 'privy',
        jwtToken: 'jwt_' + Math.random().toString(36).substring(7)
      });
    } else {
      setCurrentUser(null);
    }
  }, [privyUser]);

  // System time update
  useEffect(() => {
    const updateTime = () => {
      setSystemTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const observerOptions = {
      root,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (!mainRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
    setIsScrolled(scrollTop > 20);
    const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(scrolled);
  }, []);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      setAvatarMenuOpen(false);
    }
  }, [logout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!avatarMenuRef.current) return;
      if (!avatarMenuRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };

    if (avatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [avatarMenuOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAvatarMenuOpen(false);
    };

    if (avatarMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [avatarMenuOpen]);

  // Navigation handler
  const handleNavigate = useCallback((id: string) => {
    const target = document.getElementById(id);
    const container = mainRef.current;
    if (target && container) {
      const headerOffset = typeof window !== 'undefined' && window.innerWidth < 1024 ? 64 : 112;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + container.scrollTop - headerOffset;

      container.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setSidebarOpen(false);
  }, []);

  // Login handler - routes to audit protocol
  const handleLogin = () => {
    const section = document.getElementById('project-assessment');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.dispatchEvent(new CustomEvent('start-audit-protocol'));
  };

  return (
    <div className="flex flex-col h-screen w-screen max-w-full bg-[#020617] overflow-hidden relative selection:bg-decensat selection:text-black antialiased">

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-[2000] transition-opacity duration-500 ease-expo ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-[85vw] max-sm:max-w-[300px] max-w-sm bg-zinc-950 transition-transform duration-700 ease-expo transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-white/5`}>
          <AdminSidebar 
            onNavigate={handleNavigate} 
            activeId={activeSection} 
            onClose={() => setSidebarOpen(false)} 
            user={currentUser}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Header/Navbar - Constrained with proper max-width */}
      <header className={`h-16 lg:h-28 w-full flex items-center justify-between z-[100] sticky top-0 transition-all duration-700 ease-expo shrink-0 ${
        isScrolled 
          ? 'bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 shadow-2xl' 
          : 'bg-transparent border-b border-white/0'
      }`}>
        <div className="w-full max-w-[2000px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 shrink-0 min-w-0">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 lg:p-2.5 text-white hover:text-decensat transition-all group relative outline-none focus-visible:ring-2 focus-visible:ring-decensat rounded-lg lg:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 shrink-0"
              aria-label="Open menu"
            >
              <Menu size={18} className="lg:size-5" />
            </button>
            
            <button 
              className="flex items-center gap-2 lg:gap-3 cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-decensat rounded-xl lg:rounded-2xl p-1 min-w-0" 
              onClick={() => handleNavigate('hero')}
              aria-label="Decensat home"
            >
              <div className="w-7 h-7 lg:w-9 lg:h-9 bg-white rounded-lg flex items-center justify-center text-black font-black italic text-[10px] lg:text-xs shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-white group-hover:scale-110 shrink-0">
                D3
              </div>
              <div className="hidden sm:flex flex-col text-left min-w-0">
                <span className="text-white font-black text-xs lg:text-sm xl:text-base uppercase tracking-tighter leading-none group-hover:text-decensat transition-colors truncate">Decensat</span>
              </div>
            </button>
          </div>
          
          {/* Center Navigation - Desktop Only with proper constraints */}
          <nav className="hidden xl:flex bg-black/40 border border-white/10 rounded-full backdrop-blur-2xl p-1.5 shadow-2xl mx-4 shrink-0">
            <ul className="flex items-center gap-1" role="list">
              {mainNavLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.id}>
                    <button 
                      onClick={() => handleNavigate(link.id)} 
                      className={`text-[9px] font-black uppercase tracking-[0.2em] transition-all relative px-4 xl:px-5 2xl:px-6 py-2.5 rounded-full flex items-center gap-2 outline-none group focus-visible:ring-2 focus-visible:ring-decensat whitespace-nowrap ${
                        isActive ? 'text-black' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full transition-all duration-500 ease-expo ${
                        isActive 
                          ? 'bg-decensat opacity-100 scale-100 shadow-glow-sm' 
                          : 'bg-white/0 opacity-0 scale-90 group-hover:bg-white/5 group-hover:opacity-100 group-hover:scale-100'
                      }`} />
                      
                      <link.icon size={12} className={`relative z-10 transition-colors duration-500 shrink-0 ${isActive ? 'text-black' : 'text-slate-400 dark:text-slate-500 group-hover:text-decensat'}`} />
                      <span className="relative z-10">{link.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Section - Properly constrained */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-6 xl:gap-8 shrink-0 min-w-0">
            {currentUser && (
              <div className="relative" ref={avatarMenuRef}>
                <button
                  onClick={() => setAvatarMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 h-9 w-auto sm:h-10 lg:h-12 px-2 rounded-full overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all outline-none focus-visible:ring-2 focus-visible:ring-decensat"
                  aria-label="Open user menu"
                  aria-expanded={avatarMenuOpen}
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 lg:h-11 lg:w-11 rounded-full overflow-hidden bg-white/5">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.email}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[10px] font-black uppercase text-white">
                        {currentUser.email.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <ChevronDown 
                    size={16} 
                    strokeWidth={3}
                    className={`transition-transform duration-200 ${avatarMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {avatarMenuOpen && (
                  <div className="absolute right-0 mt-3 w-44 rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl z-[200]">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Signed in</p>
                      <p className="text-xs text-white font-semibold truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        router.push('/c3');
                        setAvatarMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors border-b border-white/5"
                    >
                      C3 Page
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors rounded-b-2xl"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            {/* CTA Button - Properly sized */}
            <button 
              onClick={handleLogin} 
              className={`group h-9 sm:h-10 lg:h-12 xl:h-14 px-3 sm:px-5 lg:px-8 xl:px-12 rounded-lg lg:rounded-xl xl:rounded-2xl text-[8px] sm:text-[9px] font-black text-black bg-decensat hover:bg-white transition-all flex items-center justify-center gap-2 lg:gap-3 uppercase tracking-[0.2em] sm:tracking-[0.25em] active:scale-95 shadow-glow-md border border-black/10 transform-gpu relative overflow-hidden whitespace-nowrap shrink-0 ${!currentUser ? 'animate-pulse-subtle' : ''}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
              {currentUser ? (
                <>
                  <UserIcon size={14} className="shrink-0" />
                  <span className="hidden sm:inline truncate max-w-[60px] lg:max-w-[80px] xl:max-w-none">{currentUser.email.split('@')[0]}</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={14} className="shrink-0 group-hover:animate-pulse" />
                  <span className="hidden xs:inline">Start Audit</span>
                  <span className="xs:hidden">Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[1.5px] bg-white/5 w-full">
          <div className="h-full bg-decensat shadow-[0_0_15px_rgba(163,230,53,0.8)] transition-all duration-300 ease-out" style={{ width: `${scrollProgress}%` }} />
        </div>
      </header>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#020617] scroll-smooth shadow-inner will-change-scroll w-full" tabIndex={-1}>
        <section id="hero" className="contain-layout w-full">
          <Hero />
        </section>
        
        <div className="max-w-[1920px] mx-auto px-4 xs:px-6 sm:px-8 lg:px-12 xl:px-20 w-full">
          <section id="node-infrastructure" className="scroll-mt-16 lg:scroll-mt-28 py-10 xs:py-12 lg:py-24 contain-layout">
            <SuccessList />
          </section>

          <section id="portfolio" className="scroll-mt-16 lg:scroll-mt-28 py-12 lg:py-24 contain-layout">
            <ExecutionIndexPortfolio />
          </section>

          <section id="project-assessment" className="scroll-mt-16 lg:scroll-mt-28 py-12 lg:py-24 contain-layout">
            <ProjectAssessmentHub onLogin={currentUser ? undefined : handleLogin} />
          </section>

          <section id="creative" className="scroll-mt-16 lg:scroll-mt-28 contain-layout py-12 lg:py-24">
            <PricingTiers 
              title="Platform Capabilities" 
              subtitle="Creative, Full Stack development, Web3 & Fintech-integrated for modern platforms" 
              data={[...SERVICE_TIERS.BRANDING, ...SERVICE_TIERS.FULLSTACK, ...SERVICE_TIERS.WEB3]} 
              icon={<Zap size={44} />} 
              color="bg-decensat" 
              accentBorder="border-decensat" 
            />
          </section>
          
          <section id="ai-optimization" className="scroll-mt-16 lg:scroll-mt-28 py-12 lg:py-24 contain-layout">
            <AiSolutionsSection />
          </section>

          <section id="learn-to-launch" className="scroll-mt-16 lg:scroll-mt-28 py-12 lg:py-24 contain-layout">
            <Learn2LaunchPathway />
          </section>
          
          <section id="help" className="scroll-mt-16 lg:scroll-mt-28 py-10 xs:py-12 lg:py-24 contain-layout">
            <HelpSection />
          </section>
        </div>
        
        <SovereignFooter />
      </main>

      <WhatsAppSupport />
      <AiConcierge activeSection={activeSection} />
    </div>
  );
};

export default Home;