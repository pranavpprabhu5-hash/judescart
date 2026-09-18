'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
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
  if (isOpen) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center justify-end">
      {/* Sleek Judes AI Luxury Trigger */}
      <button
        onClick={onToggle}
        className={cn(
          'group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full cursor-pointer',
          'bg-gradient-to-r from-slate-950 via-[#0a152e] to-slate-900 text-white',
          'border border-white/20 hover:border-blue-400/60 shadow-xl shadow-black/40 hover:shadow-blue-500/20',
          'backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95'
        )}
        aria-label="Open Judes AI Shopping Assistant"
        title="Open Judes AI Assistant"
      >
        {/* Glowing Ambient Sparkle */}
        <div className="relative flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0066FF] to-cyan-400 flex items-center justify-center shadow-sm shadow-blue-500/40">
            <Sparkles className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse absolute -top-0.5 -right-0.5" />
        </div>

        {/* Text and Gradient AI Badge */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
            Judes
          </span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-xs">
            AI
          </span>
        </div>

        {unreadCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
        )}
      </button>
    </div>
  );
}
