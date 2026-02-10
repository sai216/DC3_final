import React from 'react';
import { Bundle } from '../types';
import { X, Check, Server, Shield, Users, Clock } from 'lucide-react';

interface BundleComparisonProps {
  selectedBundles: Bundle[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

const BundleComparison: React.FC<BundleComparisonProps> = ({ selectedBundles, onClose, onRemove }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-node-900 border border-white/10 rounded-2xl w-full max-w-7xl h-[85vh] flex flex-col shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-node-900 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Server size={24} className="text-juice-500" />
              Compare Solutions
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Analyzing {selectedBundles.length} selected bundles side-by-side.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Comparison Area */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="flex min-w-max">
            
            {/* Labels Column (Sticky Left) */}
            <div className="sticky left-0 z-20 bg-node-900/95 border-r border-white/10 w-48 lg:w-64 flex-shrink-0 backdrop-blur">
              <div className="h-24 border-b border-white/5"></div> {/* Spacer for bundle headers */}
              
              <div className="divide-y divide-white/5 text-sm font-medium text-gray-400">
                <div className="h-16 flex items-center px-6 bg-node-800/30">Price</div>
                <div className="h-16 flex items-center px-6">Billing</div>
                <div className="h-16 flex items-center px-6 bg-node-800/30">Tier</div>
                <div className="h-16 flex items-center px-6">Timeline</div>
                <div className="h-16 flex items-center px-6 bg-node-800/30">Team Composition</div>
                <div className="min-h-[160px] p-6 flex items-start">Deliverables</div>
                <div className="min-h-[120px] p-6 bg-node-800/30 flex items-start">Tech Stack</div>
                <div className="h-24 p-6 flex items-center">Licensing</div>
                <div className="h-16 flex items-center px-6 bg-node-800/30">SLA</div>
              </div>
            </div>

            {/* Bundle Columns */}
            {selectedBundles.map((bundle) => (
              <div key={bundle.id} className="w-80 lg:w-96 flex-shrink-0 border-r border-white/5 bg-node-900">
                {/* Header */}
                <div className="h-24 p-4 border-b border-white/10 flex flex-col justify-between sticky top-0 bg-node-900 z-10">
                   <div className="flex justify-between items-start gap-2">
                     <h3 className="font-bold text-white leading-tight">{bundle.name}</h3>
                     <button onClick={() => onRemove(bundle.id)} className="text-gray-600 hover:text-red-400 transition-colors">
                       <X size={16} />
                     </button>
                   </div>
                   <div className="flex gap-2">
                     {bundle.tags.slice(0, 2).map(tag => (
                       <span key={tag} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500">{tag}</span>
                     ))}
                   </div>
                </div>

                <div className="divide-y divide-white/5 text-sm">
                  {/* Price */}
                  <div className="h-16 flex items-center px-6 bg-node-800/30">
                    <span className="text-xl font-bold text-white">{bundle.prices[0].formatted}</span>
                  </div>

                  {/* Billing */}
                  <div className="h-16 flex items-center px-6 text-gray-300">
                     {bundle.prices[0].billingType === 'recurring' ? 'Monthly Retainer' : 'One-Time Project'}
                  </div>

                  {/* Tier */}
                  <div className="h-16 flex items-center px-6 bg-node-800/30">
                    <span className={`px-2 py-1 rounded text-xs border ${
                      bundle.tier === 'Performance Platform' ? 'border-purple-500/30 text-purple-300 bg-purple-500/10' :
                      bundle.tier === 'aMVP' ? 'border-blue-500/30 text-blue-300 bg-blue-500/10' :
                      'border-gray-500/30 text-gray-300 bg-white/5'
                    }`}>
                      {bundle.tier}
                    </span>
                  </div>

                  {/* Timeline */}
                  <div className="h-16 flex items-center px-6 text-gray-300">
                     <Clock size={14} className="mr-2 text-juice-400"/> {bundle.timeline}
                  </div>

                  {/* Team */}
                  <div className="h-16 flex items-center px-6 bg-node-800/30 text-gray-300">
                     <Users size={14} className="mr-2 text-juice-400"/>
                     {bundle.team.length} Roles ({bundle.team.reduce((a, b) => a + b.count, 0)} Total)
                  </div>

                  {/* Deliverables */}
                  <div className="min-h-[160px] p-6">
                    <ul className="space-y-2">
                      {bundle.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                          <Check size={12} className="text-green-500 mt-0.5 shrink-0"/>
                          <span className="leading-tight">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stack */}
                  <div className="min-h-[120px] p-6 bg-node-800/30">
                    <div className="flex flex-wrap gap-1.5">
                      {bundle.stack.map(s => (
                        <span key={s} className="px-2 py-1 bg-node-900 border border-white/10 rounded text-xs text-blue-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Licensing */}
                  <div className="h-24 p-6 flex items-center text-xs text-gray-400 leading-relaxed">
                     {bundle.licensing}
                  </div>

                  {/* SLA */}
                  <div className="h-16 flex items-center px-6 bg-node-800/30 text-xs text-juice-300 font-mono">
                     <Shield size={12} className="mr-2"/> {bundle.sla}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleComparison;