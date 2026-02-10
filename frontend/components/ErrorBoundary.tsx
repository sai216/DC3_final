'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCcw, Terminal, Lock, Activity } from 'lucide-react';

interface Props {
  // children is passed by React when wrapping other components
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch rendering errors in the component tree.
 */
// FIX: Extend Component directly and explicitly declare props/state to resolve missing property errors in the compiler.
class ErrorBoundary extends Component<Props, State> {
  // FIX: Explicitly declaring props and state properties to resolve "Property does not exist" errors.
  public props: Props;
  public state: State = {
    hasError: false,
    error: null
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CRITICAL_SYSTEM_HALT:", error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };

  public render() {
    // FIX: Accessing this.props and this.state which are now explicitly declared and inherited.
    const { children } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      return (
        <div className="fixed inset-0 z-[9999] bg-[#020617] flex items-center justify-center p-6 font-sans overflow-hidden">
          {/* Background Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[120px] animate-pulse" />
          
          <div className="max-w-2xl w-full bg-black border-[4px] border-rose-500/20 rounded-[3rem] p-10 lg:p-16 relative z-10 shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center text-center space-y-10">
              {/* Alert Glyph */}
              <div className="w-24 h-24 rounded-[2.5rem] bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center text-rose-500 shadow-2xl relative">
                <ShieldAlert size={48} strokeWidth={2.5} className="animate-pulse" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full border border-rose-500/40 flex items-center justify-center">
                  <Activity size={14} className="text-rose-500" />
                </div>
              </div>

              {/* Error Headers */}
              <div className="space-y-4">
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.6em] font-mono">
                  [!] SYSTEM_HALT_DETECTION [!]
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                  Protocol <span className="text-rose-500 not-italic">Breach</span>
                </h1>
                <p className="text-slate-500 text-sm lg:text-base font-bold uppercase tracking-tight leading-relaxed max-w-md mx-auto">
                  A fatal instruction has compromised the active node sequence. Technical telemetry recorded to local ledger.
                </p>
              </div>

              {/* Technical Trace */}
              <div className="w-full bg-zinc-950 border border-white/5 rounded-2xl p-6 text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Terminal size={40} />
                </div>
                <div className="flex items-center gap-3 mb-4 text-[9px] font-black text-slate-700 uppercase tracking-widest border-b border-white/5 pb-2">
                  <Lock size={12} /> Diagnostic_Payload_v4.5
                </div>
                <div className="font-mono text-[10px] text-rose-400/80 break-all leading-relaxed bg-black/40 p-4 rounded-lg border border-rose-500/10">
                  {error?.name}: {error?.message?.slice(0, 150)}...
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={this.handleReset}
                className="w-full py-6 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_24px_48px_-12px_rgba(244,63,94,0.3)] flex items-center justify-center gap-4 active:scale-95 group"
              >
                <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
                RE_INITIALIZE_UPLINK
              </button>
              
              <div className="text-[8px] font-black text-slate-800 uppercase tracking-[0.3em]">
                Reference_Node: {window.location.hostname.toUpperCase()} // ERROR_ISOLATED
              </div>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
