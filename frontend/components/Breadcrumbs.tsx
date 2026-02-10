import React from 'react';
import { ChevronRight, Hash } from 'lucide-react';

interface BreadcrumbsProps {
  activeId: string;
  sections: { id: string, label: string }[];
  onNavigate: (id: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ activeId, sections, onNavigate }) => {
  const currentSection = sections.find(s => s.id === activeId);
  
  return (
    <nav className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl shadow-inner animate-in fade-in slide-in-from-left-4 duration-700">
      <button 
        onClick={() => onNavigate('hero')}
        className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-[0.2em] font-mono group"
      >
        DC3_ROOT
      </button>
      
      <ChevronRight size={10} className="text-slate-800" />
      
      <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] font-mono">
        INFRA_NODES
      </div>

      <ChevronRight size={10} className="text-slate-800" />

      <div className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] font-mono bg-decensat/10 px-3 py-1 rounded-lg border border-decensat/20">
        <Hash size={10} className="text-decensat" />
        <span className="text-decensat shadow-glow-sm">
          {currentSection?.label.toUpperCase().replace(' ', '_') || 'INITIALIZING'}
        </span>
      </div>
    </nav>
  );
};

export default Breadcrumbs;