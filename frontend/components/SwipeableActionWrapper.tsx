import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Trash2, Settings, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableActionWrapperProps {
  children: ReactNode;
  onLeftAction?: () => void;
  onRightAction?: () => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftLabel?: string;
  rightLabel?: string;
}

const SwipeableActionWrapper: React.FC<SwipeableActionWrapperProps> = ({
  children,
  onLeftAction,
  onRightAction,
  leftIcon,
  rightIcon,
  leftLabel = "ACTION",
  rightLabel = "REMIT"
}) => {
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [activeSide, setActiveSide] = useState<'none' | 'left' | 'right'>('none');
  const contentRef = useRef<HTMLDivElement>(null);
  const actionWidth = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Dampen the swipe if no action exists for that side
    let newTranslate = diff;
    if (diff > 0 && !onLeftAction) newTranslate = diff * 0.2;
    if (diff < 0 && !onRightAction) newTranslate = diff * 0.2;
    
    setTranslateX(newTranslate);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (Math.abs(translateX) > actionWidth * 0.6) {
      if (translateX > 0 && onLeftAction) {
        setTranslateX(actionWidth);
        setActiveSide('left');
      } else if (translateX < 0 && onRightAction) {
        setTranslateX(-actionWidth);
        setActiveSide('right');
      } else {
        setTranslateX(0);
        setActiveSide('none');
      }
    } else {
      setTranslateX(0);
      setActiveSide('none');
    }
  };

  const reset = () => {
    setTranslateX(0);
    setActiveSide('none');
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[3rem] group isolate">
      {/* Background Actions */}
      <div className="absolute inset-0 flex justify-between items-stretch">
        {/* Left Action (Reveal on swipe right) */}
        <button
          onClick={() => { onLeftAction?.(); reset(); }}
          className={`flex items-center gap-3 px-8 bg-decensat text-black transition-opacity duration-300 ${translateX > 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: actionWidth + 40 }}
        >
          {leftIcon || <Info size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest">{leftLabel}</span>
        </button>

        {/* Right Action (Reveal on swipe left) */}
        <button
          onClick={() => { onRightAction?.(); reset(); }}
          className={`flex items-center justify-end gap-3 px-8 bg-rose-500 text-white transition-opacity duration-300 ${translateX < 0 ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: actionWidth + 40 }}
        >
          <span className="text-[10px] font-black uppercase tracking-widest">{rightLabel}</span>
          {rightIcon || <Trash2 size={20} />}
        </button>
      </div>

      {/* Foreground Content */}
      <div
        ref={contentRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative z-10 transition-transform duration-500 ease-expo transform-gpu select-none touch-pan-y`}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)'
        }}
      >
        {children}
        
        {/* Visual Cue for mobile */}
        <div className="absolute inset-y-0 right-2 flex items-center opacity-20 pointer-events-none md:hidden">
           <ChevronLeft size={14} className="animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default SwipeableActionWrapper;