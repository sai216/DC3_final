import { 
  Plus, Trash2, Lock, Zap, Cpu, ArrowRight, ShieldCheck, 
  Wallet, X, Loader2, Sparkles, Database, CreditCard, 
  Coins, Landmark, FileText, Receipt, CheckCircle2,
  Calendar, Key, Settings, Info, ShieldAlert, Fingerprint, ExternalLink, AlertCircle, Building2, UserCircle2, Activity, Globe,
  Terminal
} from 'lucide-react';

import React, { useMemo, useState, useEffect } from 'react';
import { SERVICES_CATALOG } from '../constants';
import { CartItem, KycStatus, QuotePaymentTerms, SettlementRail } from '../types';
import SwipeableActionWrapper from './SwipeableActionWrapper';
import { PRICING_CONFIG } from '../core/pricing.config';

interface Builder443Props {
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
}

const STRIPE_FEE_MULTIPLIER = 1.03333; // 3.333% Fee
const OVERRIDE_THRESHOLD = 58800;

const MULTI_USDC_RAILS = [
  { id: 'crypto_wallet' as SettlementRail, label: 'Web3 Wallet', sub: 'Priority Handshake', latency: 'Instant', color: 'text-decensat', icon: Wallet },
  { id: 'usdc_solana' as SettlementRail, label: 'USDC (Solana)', sub: 'Sub-400ms Finality', latency: 'Fastest', color: 'text-decensat', icon: Coins },
  { id: 'usdc_base' as SettlementRail, label: 'USDC (Base)', sub: 'L2 Scaling Native', latency: '2s', color: 'text-blue-500', icon: Database },
  { id: 'usdc_eth' as SettlementRail, label: 'USDC (Ethereum)', sub: 'L1 Enterprise Grade', latency: '12s', color: 'text-indigo-400', icon: ShieldCheck },
];

const Builder443: React.FC<Builder443Props> = ({ cart, onAddToCart, onRemoveFromCart }) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [selectedRail, setSelectedRail] = useState<SettlementRail>('crypto_wallet');
  const [checkoutStep, setCheckoutStep] = useState<'schedule' | 'acceptance' | 'kyc' | 'payment' | 'success'>('schedule');
  const [kycStatus, setKycStatus] = useState<KycStatus>('idle');
  const [signature, setSignature] = useState('');
  
  // Simulated SysAdmin Override from local node storage
  const [adminOverride, setAdminOverride] = useState<number | null>(() => {
    const saved = localStorage.getItem('dc3_payment_override_v4');
    return saved ? Number(saved) : null;
  });

  const [kybData, setKybData] = useState({
    company: '',
    taxId: '',
    address: '',
    contactName: ''
  });

  const { subtotal, discount, final, freeItemIds } = useMemo(() => {
    let subtotal = 0;
    let discount = 0;
    const freeIds = new Set<string>();
    const sortedCart = [...cart].sort((a, b) => b.price - a.price);
    sortedCart.forEach((item, index) => {
      if ((index + 1) % 4 === 0) {
        freeIds.add(item.id);
        discount += item.price;
      }
    });
    subtotal = cart.reduce((acc, item) => acc + item.price, 0);
    return { subtotal, discount, final: subtotal - discount, freeItemIds: freeIds };
  }, [cart]);

  const dynamicTerms = useMemo((): QuotePaymentTerms => {
    const base = {
      kycStatus,
      requiresEscrow: kycStatus === 'rejected',
      adminOverrideActive: !!adminOverride && final <= OVERRIDE_THRESHOLD
    };

    // SYSADMIN OVERRIDE LOGIC
    if (adminOverride && final <= OVERRIDE_THRESHOLD) {
      const remainingPercent = 100 - adminOverride;
      return {
        ...base,
        advancePercentage: adminOverride,
        advanceAmount: final * (adminOverride / 100),
        remainingTerms: adminOverride === 100 ? 'Full Settlement Advance' : `${remainingPercent}% Post-Advance Draw`,
        installments: adminOverride === 100 ? [] : [
           { dueInDays: null, percentage: remainingPercent, amount: final * (remainingPercent / 100), trigger: 'delivery' as const }
        ]
      } as QuotePaymentTerms;
    }

    // AUTOMATED LOGIC (Post-KYC Verification)
    if (kycStatus === 'verified') {
      const defaultAdv = PRICING_CONFIG.DEFAULTS.ADVANCE_PERCENTAGE;
      return {
        ...base,
        advancePercentage: defaultAdv,
        advanceAmount: final * (defaultAdv / 100),
        remainingTerms: `${100 - defaultAdv}% over 90 days`,
        installments: [
          { dueInDays: 30, percentage: 28.33, amount: final * 0.2833 },
          { dueInDays: 60, percentage: 28.33, amount: final * 0.2833 },
          { dueInDays: 90, percentage: 28.34, amount: final * 0.2834 }
        ],
        earlyPayDiscount: { enabled: true, percentage: 10, windowDays: 5 }
      } as QuotePaymentTerms;
    } else if (kycStatus === 'rejected') {
      return {
        ...base,
        advancePercentage: 50,
        advanceAmount: final * 0.5,
        remainingTerms: '50% upon delivery',
        installments: [
          { dueInDays: null, percentage: 50, amount: final * 0.5, trigger: 'delivery' as const }
        ]
      } as QuotePaymentTerms;
    } else {
      return {
        ...base,
        advancePercentage: 100,
        advanceAmount: final,
        remainingTerms: 'Verification Pending',
        installments: []
      } as QuotePaymentTerms;
    }
  }, [final, kycStatus, adminOverride]);

  const stripeFinal = dynamicTerms.advanceAmount * STRIPE_FEE_MULTIPLIER;
  const currentFinal = selectedRail === 'stripe' ? stripeFinal : dynamicTerms.advanceAmount;

  const handleExecuteSqueeze = async () => {
    if (cart.length === 0 || isDeploying) return;
    setIsDeploying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDeploying(false);
    setShowCheckout(true);
    setCheckoutStep('schedule');
  };

  const handleInitiateKyc = async () => {
    if (!kybData.company || !kybData.taxId) return;
    setKycStatus('pending');
    setIsDeploying(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsDeploying(false);
    setCheckoutStep('kyc');
  };

  const simulateKycResult = async (result: 'verified' | 'rejected') => {
    setIsDeploying(true);
    await new Promise(r => setTimeout(r, 1500));
    setKycStatus(result);
    setIsDeploying(false);
    setCheckoutStep('payment');
  };

  const handleCommitPayment = async () => {
    setIsDeploying(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsDeploying(false);
    setCheckoutStep('success');
  };

  const CheckoutPortal = () => (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => !isDeploying && setShowCheckout(false)} />
      
      <div className="bg-zinc-950 border-[4px] lg:border-[6px] border-white/5 sm:rounded-[3rem] lg:rounded-[4rem] w-full max-w-5xl max-h-[90vh] relative z-10 flex flex-col shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-500">
        
        <div className="p-8 lg:p-14 border-b border-white/5 bg-black flex flex-col sm:flex-row items-center justify-between gap-6 lg:gap-8 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-decensat/5 pointer-events-none" />
          <div className="flex items-center gap-5 lg:gap-6 relative z-10">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-decensat flex items-center justify-center text-black shadow-glow-md shrink-0">
              <Landmark className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl lg:text-3xl font-black text-white uppercase tracking-tighter leading-none">Institutional Settlement</h3>
              <div className="flex items-center gap-3 mt-2">
                <div className={`w-2 h-2 rounded-full ${kycStatus === 'verified' ? 'bg-decensat' : kycStatus === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-[8px] lg:text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] font-black">
                  KYB: {kycStatus.toUpperCase()} // OVERRIDE: {dynamicTerms.adminOverrideActive ? 'LOCKED' : 'IDLE'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowCheckout(false)} className="p-3 lg:p-4 bg-white/5 text-slate-500 hover:text-white rounded-xl lg:rounded-2xl transition-all active:scale-95">
            <X className="w-6 h-6 lg:w-7 lg:h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-20 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
          
          {checkoutStep === 'schedule' && (
             <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
                <div className="space-y-4">
                   <h4 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter italic">Temporal Configuration</h4>
                   <p className="text-slate-400 text-lg font-bold leading-relaxed border-l-4 border-decensat pl-8 max-w-2xl">
                     Baseline sync date must align with principal node availability clusters. 72-hour provisioning buffer enforced.
                   </p>
                </div>
                <button 
                  onClick={() => setCheckoutStep('acceptance')}
                  className="w-full py-8 bg-decensat text-black font-black uppercase text-xs lg:text-sm tracking-[0.4em] rounded-[2rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-6"
                >
                  INITIALIZE_HANDSHAKE <ArrowRight className="w-6 h-6" />
                </button>
             </div>
          )}

          {checkoutStep === 'acceptance' && (
            <div className="space-y-10 lg:space-y-12 animate-in slide-in-from-right-8 duration-700">
               <div className="space-y-4">
                  <h4 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter">Acceptance Gate</h4>
                  <p className="text-slate-400 text-lg font-bold leading-relaxed">Provide institutional identification to trigger the CopperX business audit.</p>
               </div>
               <div className="bg-black/40 border-2 border-white/5 rounded-[3rem] p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      type="text" value={kybData.company} onChange={(e) => setKybData({...kybData, company: e.target.value})}
                      className="w-full bg-black border-2 border-white/10 rounded-2xl px-6 py-5 text-white font-black text-sm uppercase outline-none focus:border-decensat/40 transition-all"
                      placeholder="LEGAL_ENTITY_NAME"
                    />
                    <input 
                      type="text" value={kybData.taxId} onChange={(e) => setKybData({...kybData, taxId: e.target.value})}
                      className="w-full bg-black border-2 border-white/10 rounded-2xl px-6 py-5 text-white font-black text-sm uppercase outline-none focus:border-decensat/40 transition-all"
                      placeholder="TAX_IDENTIFICATION_ID"
                    />
                  </div>
                  <input 
                    type="text" value={signature} onChange={(e) => setSignature(e.target.value)}
                    className="w-full bg-black border-2 border-white/10 rounded-2xl px-8 py-8 text-3xl font-black text-decensat italic outline-none focus:border-decensat transition-all placeholder:text-slate-900"
                    placeholder="TYPE_FULL_NAME_TO_SIGN"
                  />
               </div>
               <button 
                  disabled={!signature || !kybData.company || isDeploying}
                  onClick={handleInitiateKyc}
                  className="w-full py-8 bg-decensat text-black font-black uppercase text-sm tracking-[0.4em] rounded-[2rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-6 active:scale-95 disabled:opacity-30"
                >
                  {isDeploying ? <Loader2 className="w-7 h-7 animate-spin" /> : <ShieldCheck className="w-7 h-7" />}
                  COMMIT_SIGNATURE_&_START_AUDIT
                </button>
            </div>
          )}

          {checkoutStep === 'kyc' && (
             <div className="space-y-12 animate-in zoom-in-95 duration-700">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-28 h-28 bg-decensat/10 rounded-[3rem] flex items-center justify-center text-decensat border-2 border-decensat/20 shadow-2xl relative">
                    <Fingerprint size={56} className="animate-pulse" />
                    <div className="absolute -top-3 -right-3 bg-blue-600 text-white p-2.5 rounded-xl shadow-xl">
                      <Building2 size={24} />
                    </div>
                  </div>
                  <h4 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter">CopperX <span className="text-decensat">Verification</span></h4>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="bg-black/60 border-2 border-white/5 rounded-[3rem] p-10 space-y-8 shadow-2xl">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                        <Activity size={14} className="text-decensat" /> Network Signal Tracking
                      </h5>
                      <div className="space-y-5">
                         {[
                           { label: 'KYB Entity Check', status: 'In Review', color: 'text-amber-500' },
                           { label: 'Sanctions / AML', status: 'Processing', color: 'text-amber-500' },
                           { label: 'Registry Sync', status: 'Locked', color: 'text-slate-600' }
                         ].map((s, i) => (
                           <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/5">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                              <span className={`text-[10px] font-mono font-black uppercase ${s.color}`}>{s.status}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="p-10 bg-zinc-900/50 border-2 border-white/5 rounded-[3rem] space-y-8 shadow-inner">
                      <div className="flex items-center gap-4">
                        <Terminal size={24} className="text-decensat" />
                        <h5 className="text-white font-black text-lg uppercase tracking-tight">Handshake Simulation</h5>
                      </div>
                      <p className="text-slate-500 text-xs font-bold uppercase leading-relaxed">Select a terminal output to proceed with the payment recalibration cycle.</p>
                      <div className="grid gap-4">
                        <button onClick={() => simulateKycResult('verified')} className="w-full py-5 bg-decensat text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-white transition-all shadow-glow-sm flex items-center justify-center gap-3"><CheckCircle2 size={18} /> SIM_VERIFIED_PASS</button>
                        <button onClick={() => simulateKycResult('rejected')} className="w-full py-5 bg-white/5 text-rose-500 border border-rose-500/20 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-rose-500/10 transition-all flex items-center justify-center gap-3"><AlertCircle size={18} /> SIM_AUDIT_FAILURE</button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {checkoutStep === 'payment' && (
             <div className="space-y-12 animate-in slide-in-from-right-8 duration-700">
                <div className="flex items-center justify-between">
                   <h4 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter italic">Settlement <span className="text-decensat">Rails</span></h4>
                   <div className="flex items-center gap-4">
                      {dynamicTerms.adminOverrideActive && (
                        <div className="px-5 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-pulse shadow-glow-md">
                           <ShieldAlert size={16} /> ADMIN_SECURITY_OVERRIDE
                        </div>
                      )}
                      <div className={`px-5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${kycStatus === 'verified' ? 'bg-decensat/10 border-decensat/30 text-decensat' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
                         <CheckCircle2 size={16} /> Identity_{kycStatus.toUpperCase()}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                   <div className="lg:col-span-7 space-y-8">
                      <div className="bg-black/60 border-2 border-white/5 rounded-[3.5rem] p-10 lg:p-14 space-y-10 shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform"><Receipt size={140} /></div>
                         
                         <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-end pb-8 border-b-2 border-white/5">
                               <div>
                                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3">Required_Advance_Draw</div>
                                  <div className="text-5xl lg:text-8xl font-black font-mono text-white tracking-tighter tabular-nums">
                                    ${currentFinal.toLocaleString()}
                                  </div>
                                  <div className="text-[9px] font-black text-decensat uppercase tracking-widest mt-2">{dynamicTerms.advancePercentage}% GROSS_VALUATION</div>
                               </div>
                            </div>
                            
                            <div className="space-y-6">
                               <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Settlement Schedule Logic</div>
                               <div className="grid gap-4">
                                  {dynamicTerms.installments.map((inst, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 lg:p-5 bg-white/5 rounded-2xl border border-white/5">
                                       <div className="flex items-center gap-4">
                                          <div className="w-2 h-2 rounded-full bg-decensat" />
                                          <span className="text-[11px] text-white font-bold uppercase">{inst.dueInDays ? `T+${inst.dueInDays} Days Post-Start` : 'Project Completion Signal'}</span>
                                       </div>
                                       <span className="text-[12px] font-mono text-slate-400 font-black">${inst.amount.toLocaleString()}</span>
                                    </div>
                                  ))}
                                  {dynamicTerms.installments.length === 0 && (
                                     <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Terminal settlement configuration (100% Advance)</div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="lg:col-span-5 space-y-6">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] pl-6 mb-4">Select_Asset_Rail (Prioritized)</div>
                      <div className="grid gap-4">
                        {MULTI_USDC_RAILS.map(rail => (
                          <button 
                            key={rail.id}
                            onClick={() => setSelectedRail(rail.id)}
                            className={`p-6 lg:p-8 rounded-[2.5rem] border-4 transition-all text-left flex items-start gap-6 group relative overflow-hidden transform-gpu active:scale-95 ${selectedRail === rail.id ? `bg-zinc-950 border-white shadow-[0_0_40px_rgba(255,255,255,0.1)]` : 'bg-black border-white/5 text-slate-500 hover:border-white/20'}`}
                          >
                             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 ${selectedRail === rail.id ? 'bg-white text-black border-white' : 'bg-zinc-900 text-slate-700 border-white/5'}`}>
                                <rail.icon size={28} />
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className={`text-xl font-black uppercase tracking-tight mb-1 ${selectedRail === rail.id ? 'text-white' : 'text-slate-500'}`}>{rail.label}</div>
                                <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">{rail.sub}</div>
                                <div className={`text-[8px] font-mono font-black mt-2 inline-block px-2 py-0.5 rounded border ${selectedRail === rail.id ? 'border-decensat/40 text-decensat' : 'border-white/10 text-slate-800'}`}>LATENCY: {rail.latency}</div>
                             </div>
                          </button>
                        ))}
                        
                        <button 
                          onClick={() => setSelectedRail('stripe')}
                          className={`p-6 lg:p-8 rounded-[2.5rem] border-4 transition-all text-left flex items-start gap-6 group relative overflow-hidden transform-gpu active:scale-95 ${selectedRail === 'stripe' ? 'bg-blue-600 border-blue-400 text-white shadow-glow-md' : 'bg-black border-white/5 text-slate-500 hover:border-white/20'}`}
                        >
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 ${selectedRail === 'stripe' ? 'bg-white text-blue-600 border-white' : 'bg-zinc-900 text-slate-700 border-white/5'}`}>
                              <CreditCard size={28} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="text-xl font-black uppercase tracking-tight mb-1">Institutional Card</div>
                              <div className="text-[9px] font-bold uppercase tracking-widest opacity-60">Stripe Rail Handshake</div>
                              <div className={`text-[8px] font-mono font-black mt-2 inline-block px-2 py-0.5 rounded border ${selectedRail === 'stripe' ? 'border-white/40 text-white' : 'border-white/10 text-slate-800'}`}>SURCHARGE: +3.333%</div>
                           </div>
                        </button>
                      </div>

                      <div className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] flex items-center justify-between mt-6">
                        <span className="text-xl font-black text-white uppercase tracking-tighter">Settlement Due</span>
                        <span className={`text-4xl font-mono font-black tracking-tighter ${selectedRail !== 'stripe' ? 'text-decensat' : 'text-white'}`}>
                          ${currentFinal.toLocaleString()}
                        </span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                   <button onClick={() => setCheckoutStep('kyc')} className="px-10 py-8 bg-white/5 text-slate-500 rounded-[2rem] font-black uppercase text-[10px] hover:text-white transition-all">Back_to_Audit</button>
                   <button 
                      onClick={handleCommitPayment}
                      disabled={isDeploying}
                      className="flex-1 py-8 bg-decensat text-black font-black uppercase text-sm tracking-[0.5em] rounded-[2rem] hover:bg-white transition-all shadow-glow-md flex items-center justify-center gap-6"
                    >
                      {isDeploying ? <Loader2 className="w-7 h-7 animate-spin" /> : <Lock className="w-7 h-7" />}
                      {isDeploying ? 'ESTABLISHING_RAIL...' : 'SIGN_&_EXECUTE_SETTLEMENT'}
                    </button>
                </div>
             </div>
          )}

          {checkoutStep === 'success' && (
             <div className="py-20 text-center space-y-12 animate-in zoom-in-95 duration-700">
                <div className="w-32 h-32 bg-decensat rounded-[3rem] flex items-center justify-center text-black mx-auto shadow-glow-md relative animate-success-ring">
                   <CheckCircle2 size={64} strokeWidth={3} className="animate-checkmark-success" />
                </div>
                <div className="space-y-6">
                   <h3 className="text-5xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none italic">Deployment <br/><span className="text-decensat not-italic">Authorized.</span></h3>
                   <p className="text-xl lg:text-3xl text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed uppercase tracking-tight">
                     Initial draw of <span className="text-white">${currentFinal.toLocaleString()}</span> recorded on the <span className="text-decensat">{selectedRail.toUpperCase()}</span> ledger. 
                     Node provisioning cluster: <span className="text-white">ACTIVE</span>.
                   </p>
                </div>
                <button onClick={() => setShowCheckout(false)} className="px-16 py-8 bg-white text-black font-black uppercase text-xs tracking-[0.5em] rounded-[2rem] hover:bg-decensat transition-all shadow-2xl">Enter_Control_Mesh</button>
             </div>
          )}
        </div>

        <div className="p-8 lg:p-10 border-t border-white/5 bg-black/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <ShieldCheck className="w-5 h-5 text-decensat" />
             <span className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.4em] font-black">Cryptographic_Settlement_Audit_Ready</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-decensat animate-pulse" />
             <span className="text-[9px] font-mono text-slate-700 uppercase tracking-[0.5em] font-black">Institutional_Trust_Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="builder" className="py-24 lg:py-40 px-4 lg:px-6 bg-[#020617] border-t border-white/5 relative overflow-hidden">
      {showCheckout && <CheckoutPortal />}
      <div className="absolute inset-0 bg-grid-f4a opacity-5 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="mb-24 flex flex-col gap-10 border-l-[12px] border-decensat pl-12 lg:pl-16">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 shadow-2xl w-fit">
            <Zap className="w-4 h-4 text-decensat animate-pulse" />
            <span>443_SMART_COLLATERAL_PROTOCOL</span>
          </div>
          <div className="max-w-4xl">
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-10">
              443 <span className="text-decensat italic">SMP</span>
            </h2>
            <p className="text-sm lg:text-base text-slate-400 font-bold leading-relaxed uppercase tracking-tight max-w-3xl">
              Self-configure your 443 Smart Collateral Contract. Multi-currency USDC integration enabled across Solana, Base, and Ethereum.
            </p>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-16 lg:gap-24 items-start">
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10">
              {SERVICES_CATALOG.map(service => (
                <button
                  key={service.id}
                  onClick={() => onAddToCart({ ...service, category: service.category })}
                  className="flex items-center justify-between p-8 lg:p-12 bg-black border-[3px] lg:border-4 border-white/5 rounded-[2.5rem] lg:rounded-[4rem] hover:border-decensat/40 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] transition-all duration-500 group text-left relative overflow-hidden active:scale-95"
                >
                  <div className="relative z-10 min-w-0 pr-6 lg:pr-10">
                    <h4 className="font-black text-white text-xl lg:text-2xl mb-1 lg:mb-2 truncate uppercase">{service.name}</h4>
                    <span className="text-[9px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">CATEGORY_{service.category.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-6 lg:gap-10 relative z-10 shrink-0">
                    <span className="text-xl lg:text-3xl font-black text-white font-mono tracking-tighter shadow-glow-sm">${service.price.toLocaleString()}</span>
                    <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-[2.5rem] bg-white/5 border-4 border-white/5 flex items-center justify-center group-hover:bg-decensat group-hover:text-black transition-all shadow-xl group-hover:rotate-12">
                      <Plus className="w-6 h-6 lg:w-9 lg:h-9" strokeWidth={3} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-full xl:w-[35rem] shrink-0 mt-12 xl:mt-0">
             <div className="bg-black border-4 border-white/5 rounded-[3rem] lg:rounded-[4.5rem] p-8 lg:p-16 sticky top-28 shadow-[0_48px_96px_-24px_rgba(0,0,0,1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <Database size={250} />
                </div>

                <div className="flex items-center justify-between mb-10 lg:mb-16 pb-8 lg:pb-10 border-b-4 lg:border-b-8 border-white/5">
                  <h3 className="text-3xl lg:text-4xl font-black text-white flex items-center gap-4 lg:gap-6 uppercase tracking-tighter">
                    <Wallet className="w-8 h-8 lg:w-10 lg:h-10 text-decensat"/> Cart
                  </h3>
                  <span className="text-[10px] lg:text-[12px] font-black bg-decensat text-black px-4 py-2 lg:px-6 lg:py-2.5 rounded-xl lg:rounded-2xl uppercase tracking-[0.3em] shadow-glow-sm">
                    {cart.length} NODES
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-20 lg:py-32 text-slate-700 border-4 lg:border-8 border-dashed border-white/5 rounded-[2.5rem] lg:rounded-[4rem] bg-white/5">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 bg-black rounded-2xl lg:rounded-[3rem] flex items-center justify-center mx-auto mb-8 lg:mb-10 text-slate-800 shadow-xl border border-white/5">
                       <Plus className="w-9 h-9 lg:w-12 lg:h-12" strokeWidth={3} />
                    </div>
                    <p className="text-[9px] lg:text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] lg:tracking-[0.5em]">SELECT_NODES_TO_BEGIN</p>
                  </div>
                ) : (
                  <div className="space-y-4 lg:space-y-6 mb-10 lg:mb-16 max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                    {cart.map((item) => {
                      const isFree = freeItemIds.has(item.id);
                      return (
                        <SwipeableActionWrapper
                          key={item.id}
                          onRightAction={() => onRemoveFromCart(item.id)}
                          onLeftAction={() => {}}
                          leftLabel="SYNC"
                          rightLabel="REMIT"
                          leftIcon={<Zap size={18} />}
                          rightIcon={<Trash2 size={18} />}
                        >
                          <div className={`flex justify-between items-center p-6 lg:p-10 rounded-2xl lg:rounded-[3rem] border-[3px] lg:border-4 transition-all duration-500 ${isFree ? 'bg-decensat/10 border-decensat shadow-[0_0_30px_rgba(163,230,53,0.2)] scale-[1.05]' : 'bg-white/5 border-white/5 hover:bg-black hover:border-decensat/40'}`}>
                            <div className="min-w-0 pr-6 lg:pr-10">
                              <div className="text-lg lg:text-xl font-black text-white uppercase tracking-tight">{item.name}</div>
                              {isFree && (
                                  <div className="flex items-center gap-2 mt-2">
                                      <Sparkles size={14} className="text-decensat animate-pulse" />
                                      <span className="text-[8px] lg:text-[10px] text-decensat font-black uppercase tracking-[0.2em] lg:tracking-[0.3em]">443_COLLATERAL_APPLIED</span>
                                  </div>
                              )}
                            </div>
                            <div className="flex items-center gap-5 lg:gap-8 shrink-0">
                              <span className={`text-xl lg:text-2xl font-black font-mono tracking-tighter ${isFree ? 'line-through text-slate-600' : 'text-white'}`}>
                                ${item.price.toLocaleString()}
                              </span>
                              <div className="hidden sm:block">
                                <button onClick={() => onRemoveFromCart(item.id)} className="text-slate-500 hover:text-rose-500 transition-all p-2 lg:p-3 bg-white/5 rounded-xl lg:rounded-2xl shadow-xl border-2 border-white/5 hover:border-rose-500/20 active:scale-90">
                                  <Trash2 className="w-[18px] h-[18px] lg:w-6 lg:h-6" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </SwipeableActionWrapper>
                      );
                    })}
                  </div>
                )}
                
                <div className="border-t-4 lg:border-t-8 border-white/5 pt-10 lg:pt-12 space-y-4 lg:space-y-5">
                  <div className="flex justify-between text-[10px] lg:text-[12px] font-black text-slate-600 uppercase tracking-[0.3em] lg:tracking-[0.4em] font-mono">
                    <span>Market Value</span>
                    <span className="text-slate-400">${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                     <div className="flex justify-between text-[10px] lg:text-[12px] font-black text-decensat uppercase tracking-[0.3em] lg:tracking-[0.4em] animate-in fade-in font-mono">
                      <span>443_COLLATERAL_REMIT</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-4xl lg:text-7xl font-black text-white pt-8 lg:pt-10 tracking-tighter uppercase leading-none">
                    <span>Final</span>
                    <span className="font-mono text-decensat shadow-glow-sm">${final.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleExecuteSqueeze}
                  disabled={isDeploying || cart.length === 0}
                  className={`w-full mt-12 lg:mt-16 text-black font-black text-xs lg:text-sm uppercase tracking-[0.4em] py-6 lg:py-8 rounded-2xl lg:rounded-[3rem] transition-all duration-500 flex items-center justify-center gap-4 lg:gap-6 shadow-[0_24px_48px_-12px_rgba(163,230,53,0.4)] relative overflow-hidden ${
                    isDeploying || cart.length === 0 ? 'bg-slate-800 opacity-50 cursor-not-allowed' : 'bg-decensat hover:bg-white active:scale-95'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                  {isDeploying ? <Loader2 size={16} className="w-6 h-6 lg:w-7 lg:h-7 animate-spin" /> : <Lock size={16} className="w-6 h-6 lg:w-7 lg:h-7" />}
                  <span>{isDeploying ? 'SYNCING_PROTOCOL...' : 'EXECUTE_SQUEEZE'}</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Builder443;