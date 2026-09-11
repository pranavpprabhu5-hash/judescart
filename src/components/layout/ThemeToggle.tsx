'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex items-center gap-2 p-2 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-medium transition-all duration-200 border cursor-pointer select-none active:scale-95 shadow-2xs',
        isDark
          ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700/80 hover:text-amber-200'
          : 'bg-white/80 text-stone-700 border-stone-200/80 hover:bg-stone-100 hover:text-stone-900',
        className
      )}
      aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
      title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <Sun
          className={cn(
            'w-4 h-4 text-amber-500 transition-all duration-300 absolute inset-0',
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          )}
        />
        <Moon
          className={cn(
            'w-4 h-4 text-sky-400 transition-all duration-300 absolute inset-0',
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          )}
        />
      </div>

      {showLabel && (
        <span className="font-semibold text-xs tracking-tight">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
}
