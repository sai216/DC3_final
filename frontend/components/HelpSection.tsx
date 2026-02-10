import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, Zap, ShieldCheck, Cpu, Wallet, 
  Search, LifeBuoy, ShieldAlert, 
  ArrowRight, Lock, Fingerprint, Network, Activity, 
  UserCheck, Globe, Database, Terminal, Sparkles,
  Layers, Code2, Workflow, Binary, Info, BookOpen
} from 'lucide-react';
import { KNOWLEDGE_CONFIG } from '../core/knowledge.config';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon?: React.ElementType;
}

const CATEGORIES = [
  { id: 'Protocols', label: 'ALL PROTOCOLS', icon: LifeBuoy },
  { id: 'Architecture', label: 'SKILLS ARCHITECTURE', icon: Layers },
  { id: 'Infrastructure', label: 'FINTECH RAILS', icon: Cpu },
  { id: 'Economics', label: 'UCP SETTLEMENT LOGIC', icon: Wallet },
  { id: 'Nodes', label: 'PRINCIPAL NODES', icon: UserCheck },
];

const HelpSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(KNOWLEDGE_CONFIG.FAQS[0].id);
  const [activeKnowledgeNode, setActiveKnowledgeNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Protocols');
  const [isFiltering, setIsFiltering] = useState(false);

  const filteredFaqs = useMemo(() => {
    return (KNOWLEDGE_CONFIG.FAQS as unknown as any[]).filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  useEffect(() => {
    if (filteredFaqs.length > 0) {
      setIsFiltering(true);
      const timer = setTimeout(() => {
        setOpenId(filteredFaqs[0].id);
        setIsFiltering(false);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setOpenId(null);
    }
  }, [activeCategory, filteredFaqs.length]);

  return (
    <section id="help" className="bg-[#020617] border-y-[8px] border-white/5 pt-4 lg:pt-8 pb-12 lg:pb-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden transition-all duration-700 scroll-mt-24 sm:scroll-mt-32">
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      <div className="max-w-[1920px] mx-auto relative z-10">
        <div className="mb-12 flex flex-col gap-8 border-l-[12px] border-decensat pl-8 sm:pl-12 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl w-fit">
            <ShieldAlert size={14} className="text-decensat animate-pulse" />
            <span>KNOWLEDGE_REPOSITORY_V4.5.2 INSTITUTIONAL LOGIC</span>
          </div>
          <div className="max-w-4xl">
            <h2 className="font-black text-white uppercase leading-[0.95]" style={{fontSize: 'clamp(1.15rem, 4vw, 2.35rem)', letterSpacing: '-0.04em', marginBottom: '1rem'}}>
              Institutional <span className="text-decensat italic">Logic</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start mt-12 sm:mt-20">
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="relative group">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-decensat transition-colors" size={24} />
              <input 
                type="text" placeholder="Search Knowledge Nodes..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border-4 border-white/5 rounded-[2.5rem] pl-20 pr-8 py-6 sm:py-8 text-lg sm:text-xl font-black text-white focus:bg-zinc-900/50 focus:border-decensat/50 outline-none transition-all font-mono uppercase placeholder:text-slate-800"
              />
            </div>
            <div className="bg-black/60 border-4 border-white/5 rounded-[3.5rem] p-6 sm:p-10 space-y-6 shadow-2xl">
               <div className="grid gap-3 sm:gap-4">
                {CATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full flex items-center justify-between p-5 sm:p-6 rounded-[1.8rem] text-[10px] font-black transition-all border-2 ${activeCategory === cat.id ? 'bg-decensat border-decensat text-black' : 'bg-white/5 border-white/5 text-slate-500 hover:border-decensat/40'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`lg:col-span-8 space-y-8 transition-all duration-500 ${isFiltering ? 'opacity-30 blur-sm translate-y-4' : 'opacity-100'}`}>
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className={`group bg-black border-[3px] rounded-[3rem] transition-all overflow-hidden ${openId === faq.id ? 'border-decensat scale-[1.01]' : 'border-white/5'}`}>
                <button onClick={() => setOpenId(openId === faq.id ? null : faq.id)} className="w-full p-8 lg:p-14 text-left">
                  <h4 className="text-xl lg:text-2xl font-black tracking-tighter uppercase">{faq.question}</h4>
                </button>
                {openId === faq.id && (
                  <div className="px-8 lg:px-14 pb-10 lg:pb-14">
                    <p className="text-sm lg:text-base text-slate-300 leading-relaxed font-medium uppercase tracking-tight border-l-4 border-decensat/30 pl-6 lg:pl-8 max-w-4xl">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;