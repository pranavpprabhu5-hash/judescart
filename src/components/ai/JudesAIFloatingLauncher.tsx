'use client';

import React from 'react';
import { MessageSquareText } from 'lucide-react';
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
      {/* Discreet Concierge Trigger */}
      <button
        onClick={onToggle}
        className={cn(
          'relative flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg cursor-pointer',
          'bg-stone-900 hover:bg-black text-white dark:bg-slate-800 dark:hover:bg-slate-700',
          'border border-stone-700 dark:border-slate-600 transition-all duration-200',
          'hover:scale-102 active:scale-95'
        )}
        aria-label="Open Customer Concierge"
        title="JudesCart Concierge"
      >
        <MessageSquareText className="w-4 h-4 text-stone-200" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide text-stone-200">
          Concierge
        </span>

        {unreadCount > 0 && (
          <span className="w-2 h-2 rounded-full bg-blue-500" />
        )}
      </button>
    </div>
  );
}
