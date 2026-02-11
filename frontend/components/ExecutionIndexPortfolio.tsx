import React, { useState, useRef, memo, useCallback, useEffect } from 'react';
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
  return (
    <div className="group relative w-full h-full transition-all duration-500 hover:scale-[1.02]">
      {/* Just the images - no border wrapper needed */}
      <img 
        src={toImageSrc(node.image)} 
        alt={node.name} 
        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-100 group-hover:opacity-0" 
      />
      <img 
        src={toImageSrc(node.hoverImage)} 
        alt={`${node.name} Hover`} 
        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 opacity-0 group-hover:opacity-100" 
      />
    </div>
  );
});

ProjectCard.displayName = 'ProjectCard';

const ExecutionIndexPortfolio: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 440;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => scrollElement.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  return (
    <section className="w-full bg-zinc-950 py-16 md:py-24 overflow-visible">
      <div className="w-full px-6 md:px-8 lg:px-12 space-y-10 md:space-y-14">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-8 border-decensat pl-6 md:pl-10">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase leading-tight mb-4">
              Execution <span className="text-decensat italic">Index</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 font-bold uppercase tracking-tight">
              Deterministic build history and protocol-verified proof of delivery.
            </p>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex gap-4 shrink-0">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-5 rounded-2xl border-2 transition-all ${
                canScrollLeft 
                  ? 'bg-white/5 border-white/20 text-white hover:bg-decensat hover:text-black hover:border-decensat' 
                  : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={26} strokeWidth={3} />
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-5 rounded-2xl border-2 transition-all ${
                canScrollRight 
                  ? 'bg-white/5 border-white/20 text-white hover:bg-decensat hover:text-black hover:border-decensat' 
                  : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={26} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Cards - NO CONTAINER BOX */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 lg:gap-8 py-6 px-2 snap-x snap-mandatory scrollbar-hide -mx-4 md:-mx-6 lg:-mx-10"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {PORTFOLIO_DATA.map(node => (
            <div 
              key={node.id} 
              className="flex-shrink-0 snap-center w-[85vw] sm:w-[380px] md:w-[420px] lg:w-[460px] px-2"
              style={{
                aspectRatio: '9 / 16'
              }}
            >
              <ProjectCard node={node} />
            </div>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex md:hidden justify-center items-center gap-2 animate-pulse">
          <ChevronLeft size={14} className="text-slate-600" />
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Swipe to explore</span>
          <ChevronRight size={14} className="text-slate-600" />
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ExecutionIndexPortfolio;