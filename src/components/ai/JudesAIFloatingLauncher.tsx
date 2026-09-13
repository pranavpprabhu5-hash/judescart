'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, X, MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JudesAIFloatingLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function JudesAIFloatingLauncher({
  isOpen,
  onToggle,
  unreadCount = 0,
}: JudesAIFloatingLauncherProps) {
  const [showTeaser, setShowTeaser] = useState(true);

  // Auto-dismiss teaser bubble after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  if (isOpen) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center justify-end animate-in slide-in-from-bottom-5 duration-300">
      {/* Interactive Floating Teaser Bubble */}
      {showTeaser && (
        <div className="hidden sm:flex items-center gap-2.5 mr-3 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#0E1B2E] border border-blue-500/30 text-slate-800 dark:text-slate-100 shadow-xl text-xs font-medium backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <p className="line-clamp-1">
            Need styling advice or Lucky Draw tips? <span className="text-[#0066FF] dark:text-sky-400 font-bold">Ask JudesAI</span>
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5 rounded transition-colors"
            title="Dismiss tip"
            aria-label="Dismiss AI tip"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <div className="relative group">
        <button
          onClick={onToggle}
          className={cn(
            'relative flex items-center gap-2.5 p-2 sm:px-4 sm:py-3 rounded-full shadow-2xl cursor-pointer',
            'bg-[#0A192F] hover:bg-[#0F2850] text-white',
            'border border-slate-700 hover:border-blue-500 transition-all duration-300',
            'hover:scale-105 active:scale-95 focus:outline-hidden'
          )}
          aria-label="Open JudesAI Concierge"
          title="Ask JudesAI Shopping Concierge"
        >
          {/* Avatar Orb */}
          <div className="relative w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
            <Bot className="w-4 h-4 text-white" />
            <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Button Text */}
          <div className="text-left pr-1 hidden sm:block">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">JudesAI</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <span className="font-extrabold text-xs tracking-tight text-white block mt-0.5">
              Shopping Concierge
            </span>
          </div>

          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 group-hover:rotate-12 transition-transform" />

          {/* Unread Message / Alert Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
