'use client';

import React, { useState } from 'react';
import { Sparkles, Gift, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { cn } from '@/lib/utils';

export function FloatingLuckyDrawCTA() {
  const { openLuckyDraw, isLuckyDrawOpen } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);

  // If already open or dismissed for the session, hide button
  if (isLuckyDrawOpen || isDismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-5 z-40 flex items-center group animate-in slide-in-from-bottom-6 duration-500">
      {/* Pulse Beacon Wave */}
      <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0066FF] via-cyan-400 to-amber-400 opacity-60 blur-xs group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 animate-pulse pointer-events-none" />

      {/* Main Interactive Button */}
      <button
        onClick={openLuckyDraw}
        className={cn(
          'relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-2.5 rounded-full shadow-2xl cursor-pointer',
          'bg-gradient-to-r from-[#0A192F] via-[#0F2850] to-[#0066FF] text-white',
          'border-2 border-white/80 hover:border-cyan-300 transition-all duration-300',
          'hover:scale-105 active:scale-95 focus:outline-hidden'
        )}
        aria-label="Open Lucky Draw Wheel"
        title="Open Lucky Draws (Platinum, Gold, Silver & Bumper)"
      >
        {/* Animated Icon badge */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-[#0A192F] flex items-center justify-center shadow-md shrink-0">
          <Gift className="w-4 h-4 text-[#0A192F] animate-bounce" />
        </div>

        {/* Text Content (Hidden on small mobile, visible on tablet/desktop) */}
        <div className="text-left pr-1 hidden sm:block">
          <div className="flex items-center gap-1 leading-none">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">Lucky Draws</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-extrabold text-xs tracking-tight text-white block mt-0.5">
            Platinum, Gold, Silver &amp; Bumper
          </span>
        </div>

        <Sparkles className="w-4 h-4 text-cyan-300 shrink-0 hidden sm:block" />
      </button>

      {/* Dismiss micro-button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDismissed(true);
        }}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-800 text-white/70 hover:text-white flex items-center justify-center text-[10px] border border-white/40 shadow-xs transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
        title="Hide for now"
        aria-label="Dismiss lucky draw badge"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
