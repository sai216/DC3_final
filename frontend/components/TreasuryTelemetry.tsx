import React from 'react';
import { TrendingUp, PieChart, Info } from 'lucide-react';

const TreasuryTelemetry: React.FC = () => {
  const currentDay = 94;
  const progress = (currentDay / 120) * 100;
  const isGaugePhase = currentDay >= 90;

  return (
    <div className="bg-white border-4 border-slate-200 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">TREASURY_TELEMETRY</h4>
        <div className="px-3 py-1 bg-juice-100 text-juice-700 text-[9px] font-black rounded-lg">LIVE_SYNC</div>
      </div>
      <div className="mb-10 text-center">
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Payout Window</div>
        <div className="text-6xl font-black text-slate-950 font-mono tracking-tighter tabular-nums">
            {120 - currentDay} <span className="text-2xl">DAYS</span>
        </div>
      </div>
      <div className="space-y-8">
        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-100">
           <div className={`h-full transition-all duration-1000 ease-out ${isGaugePhase ? 'bg-emerald-500' : 'bg-juice-600'}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 hover:border-juice-300 transition-all">
              <TrendingUp size={20} className="text-juice-600 mb-4" />
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Pool Total</div>
              <div className="text-xl font-black font-mono">$1.42M</div>
           </div>
           <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 hover:border-juice-300 transition-all">
              <PieChart size={20} className="text-blue-600 mb-4" />
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Yield Avg</div>
              <div className="text-xl font-black font-mono">14.2%</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryTelemetry;