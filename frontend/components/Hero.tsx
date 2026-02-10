import React, { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { UI_TEXTURES } from '../assets/images/registry';
import { MARKETING_CONFIG } from '../core/marketing.config';

interface HeroProps {
  onLearnMore?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLearnMore }) => {
  const handleScrollToCapabilities = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      const target = document.getElementById('creative');
      const container = document.querySelector('main');
      if (target && container) {
        const headerOffset = window.innerWidth < 1024 ? 80 : 110;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + container.scrollTop - headerOffset;
        container.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="relative min-h-[80vh] sm:min-h-screen flex flex-col justify-center overflow-hidden bg-black py-20 lg:py-32 transition-colors duration-500 transform-gpu">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.12]" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-screen">
          <img src={UI_TEXTURES.TECH_GRID_BG} alt="" className="w-full h-full object-cover grayscale" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xs:w-[450px] sm:w-[1200px] h-[280px] xs:h-[450px] sm:h-[1200px] bg-decensat/5 rounded-full blur-[60px] sm:blur-[200px] animate-pulse" />
      </div>

      <div className="mx-auto max-w-[1920px] px-6 lg:px-24 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          <div className="max-w-full lg:max-w-[90vw] mb-12 sm:mb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="text-[2.5rem] xs:text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8rem] font-black tracking-tighter leading-[0.8] uppercase">
              <span className="block text-white mb-2">{MARKETING_CONFIG.HERO.TITLE_MVP}</span>
              <span className="text-decensat italic relative inline-block">
                {MARKETING_CONFIG.HERO.TITLE_SCALE}
                <span className="absolute -bottom-2 sm:-bottom-6 left-0 w-full h-1 sm:h-3 bg-decensat/30" />
              </span>
            </h1>
            
            <div className="mt-12 sm:mt-24 flex flex-col items-center gap-12 sm:gap-16">
              <p className="text-section-sub uppercase max-w-4xl px-4 italic opacity-90 leading-tight">
                {MARKETING_CONFIG.HERO.SUBHEADLINE}
              </p>
              
              <button 
                onClick={handleScrollToCapabilities}
                className="group relative flex items-center gap-6 px-12 sm:px-16 py-6 sm:py-8 bg-white/5 border-2 border-white/10 hover:border-decensat hover:bg-decensat hover:text-black rounded-3xl text-[11px] sm:text-xs font-black uppercase tracking-[0.5em] transition-all duration-500 shadow-2xl active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
                <span>Explore Capabilities</span>
                <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(Hero);