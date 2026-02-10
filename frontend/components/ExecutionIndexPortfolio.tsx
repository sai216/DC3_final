import React, { useState, useRef, memo, useCallback } from 'react';
import type { StaticImageData } from 'next/image';
import { 
  Database, ArrowUpRight, ChevronLeft, ChevronRight, ShieldCheck, FileText
} from 'lucide-react';

// Import local images
import alcoholic from '../assets/images/alcoholic.png';
import alcoholic1 from '../assets/images/alcoholic1.png';
import cafe from '../assets/images/cafe.png';
import cafe1 from '../assets/images/cafe1.png';
import entertainment from '../assets/images/entertainment.png';
import entertainment1 from '../assets/images/entertainment1.png';
import estate from '../assets/images/estate.png';
import estate1 from '../assets/images/estate1.png';
import financial from '../assets/images/financial.png';
import financial1 from '../assets/images/financial1.png';
import fintech from '../assets/images/fintech.png';
import fintech1 from '../assets/images/fintech1.png';
import hr from '../assets/images/hr.png';
import hr1 from '../assets/images/hr2.png'; // Using hr2.png as hover
import interior from '../assets/images/interior.png';
import interior1 from '../assets/images/interior1.png';
import media from '../assets/images/media.png';
import media1 from '../assets/images/media1.png';

interface ProjectNode {
  id: string;
  name: string;
  systemType: string;
  year: string;
  month: string;
  clientPartner: string;
  longDescription: string;
  image: string | StaticImageData;
  hoverImage: string | StaticImageData;
  caseStudyUrl?: string;
  techStack: string[];
}

const toImageSrc = (val: string | StaticImageData) =>
  typeof val === 'string' ? val : val.src;

const PORTFOLIO_DATA: ProjectNode[] = [
  {
    id: 'dc-03',
    name: 'ENTERTAINMENT',
    systemType: 'Media Broadcasting',
    year: '2025',
    month: 'NOVEMBER',
    clientPartner: 'StreamOne',
    longDescription: 'DIGITAL CONTENT DELIVERY NETWORK AND INTERACTIVE STREAMING INFRASTRUCTURE.',
    image: entertainment,
    hoverImage: entertainment1,
    caseStudyUrl: '#',
    techStack: ['Streaming', 'CDN', 'Media']
  },
  {
    id: 'dc-06',
    name: 'FINTECH',
    systemType: 'Digital Assets',
    year: '2025',
    month: 'MAY',
    clientPartner: 'NeoFinance',
    longDescription: 'NEXT-GENERATION FINTECH SOLUTIONS INTEGRATING BLOCKCHAIN AND TRADITIONAL FINANCE.',
    image: fintech,
    hoverImage: fintech1,
    caseStudyUrl: '#',
    techStack: ['Blockchain', 'DeFi', 'Integration']
  },
  {
    id: 'dc-04',
    name: 'REAL ESTATE',
    systemType: 'Property Management',
    year: '2025',
    month: 'JANUARY',
    clientPartner: 'Estate Corp',
    longDescription: 'VIRTUAL PROPERTY SHOWCASE AND ASSET MANAGEMENT DASHBOARD FOR HIGH-VALUE REAL ESTATE.',
    image: estate,
    hoverImage: estate1,
    caseStudyUrl: '#',
    techStack: ['Virtual Tour', 'Asset Mgmt', 'PropTech']
  },
  {
    id: 'dc-05',
    name: 'FINANCIAL',
    systemType: 'Banking Operations',
    year: '2025',
    month: 'APRIL',
    clientPartner: 'Bank Unified',
    longDescription: 'SECURE FINANCIAL TRANSACTION PROCESSING AND BANKING OPERATIONS MANAGEMENT SYSTEM.',
    image: financial,
    hoverImage: financial1,
    caseStudyUrl: '#',
    techStack: ['Security', 'Banking', 'FinOps']
  },
  {
    id: 'dc-09',
    name: 'MEDIA',
    systemType: 'Content Hub',
    year: '2025',
    month: 'JULY',
    clientPartner: 'News Network',
    longDescription: 'CENTRALIZED MEDIA AGGREGATION AND PUBLISHING WORKFLOW AUTOMATION SYSTEM.',
    image: media,
    hoverImage: media1,
    caseStudyUrl: '#',
    techStack: ['Publishing', 'CMS', 'Workflow']
  },
  {
    id: 'dc-07',
    name: 'HR SYSTEMS',
    systemType: 'Talent Management',
    year: '2025',
    month: 'DECEMBER',
    clientPartner: 'StaffDiff',
    longDescription: 'COMPREHENSIVE HUMAN RESOURCES INFORMATION SYSTEM WITH AI-DRIVEN TALENT ANALYTICS.',
    image: hr,
    hoverImage: hr1,
    caseStudyUrl: '#',
    techStack: ['HRIS', 'Analytics', 'AI']
  },
  {
    id: 'dc-02',
    name: 'CAFE',
    systemType: 'Hospitality Management',
    year: '2025',
    month: 'FEBRUARY',
    clientPartner: 'Coffee Chain X',
    longDescription: 'INTEGRATED POINT OF SALE AND CUSTOMER EXPERIENCE PLATFORM FOR MODERN RETAIL COFFEE OUTLETS.',
    image: cafe,
    hoverImage: cafe1,
    caseStudyUrl: '#',
    techStack: ['POS', 'CX', 'Retail']
  },
  {
    id: 'dc-08',
    name: 'INTERIOR',
    systemType: 'Design Studio',
    year: '2025',
    month: 'JUNE',
    clientPartner: 'Design Haus',
    longDescription: 'IMMERSIVE INTERIOR DESIGN VISUALIZATION AND PROJECT MANAGEMENT FOR STUDIOS.',
    image: interior,
    hoverImage: interior1,
    caseStudyUrl: '#',
    techStack: ['3D Viz', 'Design', 'Project Mgmt']
  },
  {
    id: 'dc-01',
    name: 'ALCOHOLIC',
    systemType: 'Supply Chain & Logistics',
    year: '2025',
    month: 'MARCH',
    clientPartner: 'Global Spirits',
    longDescription: 'ADVANCED INVENTORY TRACKING AND DISTRIBUTION NETWORK FOR REGULATED BEVERAGE INDUSTRIES.',
    image: alcoholic,
    hoverImage: alcoholic1,
    caseStudyUrl: '#',
    techStack: ['Supply Chain', 'Tracking', 'Logistics']
  }
];

const ProjectCard = memo(({ node }: { node: ProjectNode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => setMousePos({ x: 0, y: 0 }), []);

  return (
    <div
    ref={cardRef}
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 w-full snap-center group bg-gradient-to-b from-[#020617] to-[#0a0e1f] border-2 border-white/5 rounded-2xl sm:rounded-3xl lg:rounded-[3rem] p-0 flex flex-col transition-all duration-700 ease-expo relative overflow-hidden transform-gpu hover:border-decensat hover:shadow-[0_0_60px_rgba(163,230,53,0.5)] hover:scale-[1.02] min-h-[460px] sm:min-h-[540px] lg:min-h-[620px]">
      <div className="absolute inset-0 z-0 transition-transform duration-700 ease-out pointer-events-none" style={{ transform: `scale(1.1) translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}>
        <img src={toImageSrc(node.image)} alt={node.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0" />
        <img src={toImageSrc(node.hoverImage)} alt={`${node.name} Hover`} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-hover:brightness-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-100 group-hover:opacity-70 transition-opacity duration-700" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-5 sm:p-7 lg:p-10">

        <div className="mt-auto pt-5 sm:pt-7 border-t border-white/5 group-hover:border-decensat/30 transition-colors duration-500 flex flex-col gap-3 sm:gap-4 relative group/desc">
          <p className="text-slate-300 group-hover:text-white font-bold text-xs sm:text-sm lg:text-base uppercase tracking-tight leading-relaxed border-l-2 border-decensat/40 group-hover:border-decensat pl-4 sm:pl-6 pr-16 sm:pr-24 transition-all duration-500">
             {node.longDescription}
           </p>
           {node.caseStudyUrl && node.caseStudyUrl !== '#' && (
             <a 
                href={node.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 right-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-decensat/10 border border-decensat/20 rounded-lg text-[8px] sm:text-[9px] font-black text-decensat uppercase tracking-widest hover:bg-decensat hover:text-black transition-all shadow-glow-sm"
              >
                <FileText size={10} className="sm:w-3 sm:h-3" />
                CASE_STUDY
              </a>
           )}
        </div>
      </div>
      
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 pb-5 sm:pb-7 lg:pb-8 px-5 sm:px-7 lg:px-10 border-t border-white/5 group-hover:border-decensat/20 transition-colors duration-500 flex items-center justify-between group-hover:text-decensat relative z-10">
          <span className="text-[7px] sm:text-[8px] font-mono font-black text-slate-600 group-hover:text-decensat uppercase tracking-widest flex items-center gap-2 sm:gap-3 transition-colors duration-500"><ShieldCheck size={11} className="sm:w-[13px] sm:h-[13px] opacity-60 group-hover:opacity-100 group-hover:text-decensat transition-all duration-500" /> {node.month} {node.year}</span>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 group-hover:bg-decensat/20 group-hover:border-decensat group-hover:shadow-[0_0_20px_rgba(163,230,53,0.6)]">
            <ArrowUpRight size={18} className="sm:w-[22px] sm:h-[22px] transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-decensat" />
        </div>
      </div>
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const ExecutionIndexPortfolio: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / PORTFOLIO_DATA.length;
      scrollRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  };

  // Track scroll position for mobile navigation
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.scrollWidth / PORTFOLIO_DATA.length;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  }, []);

  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 lg:gap-10 border-l-[6px] sm:border-l-[8px] lg:border-l-[12px] border-decensat pl-4 sm:pl-8 lg:pl-12 animate-in slide-in-from-left duration-1000">
        <div className="max-w-4xl">
          <h2 className="font-black text-white uppercase leading-[0.95] mb-3 sm:mb-4" style={{fontSize: 'clamp(1.15rem, 4vw, 2.35rem)', letterSpacing: '-0.04em'}}>
            Execution <span className="text-decensat italic">Index</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-xl text-slate-400 font-bold leading-tight uppercase tracking-tight max-w-3xl">
            Deterministic build history and protocol-verified proof of delivery.
          </p>
        </div>

        {/* Desktop Scroll Arrow Buttons */}
        <div className="hidden md:flex gap-4 shrink-0">
          <button 
            onClick={() => scroll('left')} 
            className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-2xl group"
          >
            <ChevronLeft size={28} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform lg:w-8 lg:h-8" />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 text-slate-500 hover:text-decensat transition-all active:scale-90 shadow-2xl group"
          >
            <ChevronRight size={28} strokeWidth={3} className="group-hover:translate-x-1 transition-transform lg:w-8 lg:h-8" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-3 sm:gap-6 lg:gap-8 pb-6 sm:pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth px-3 sm:px-0"
      >
        {PORTFOLIO_DATA.map(node => (
          <div key={node.id} className="min-w-[86vw] xs:min-w-[78vw] sm:min-w-[340px] md:min-w-[380px] lg:min-w-[420px]">
            <ProjectCard node={node} />
          </div>
        ))}
      </div>

      {/* Mobile Navigation Dots */}
      <div className="flex md:hidden justify-center items-center gap-2 pb-4">
        {PORTFOLIO_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === index 
                ? 'w-8 h-2 bg-decensat' 
                : 'w-2 h-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Swipe Indicator (shows on first load) */}
      <div className="flex md:hidden justify-center items-center gap-2 pb-2 animate-pulse">
        <ChevronLeft size={16} className="text-slate-600" />
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Swipe to explore</span>
        <ChevronRight size={16} className="text-slate-600" />
      </div>
    </div>
  );
};

export default ExecutionIndexPortfolio;
