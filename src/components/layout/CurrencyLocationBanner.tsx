'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { CURRENCIES } from '@/lib/mock-data';
import { MapPin, X, Check, ArrowRight } from 'lucide-react';

export function CurrencyLocationBanner() {
  const {
    currency,
    detectedLocation,
    hasAutoSwitchedCurrency,
    dismissAutoSwitchedBanner,
  } = useStore();

  // Auto-dismiss after 9 seconds if user doesn't interact
  useEffect(() => {
    if (!hasAutoSwitchedCurrency) return;
    const timer = setTimeout(() => {
      dismissAutoSwitchedBanner();
    }, 9000);
    return () => clearTimeout(timer);
  }, [hasAutoSwitchedCurrency, dismissAutoSwitchedBanner]);

  if (!hasAutoSwitchedCurrency || !detectedLocation) {
    return null;
  }

  const currentConfig = CURRENCIES[currency] || CURRENCIES.USD;

  return (
    <aside
      role="region"
      aria-label="Location currency notification"
      className="fixed top-20 sm:top-auto sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)] animate-in fade-in slide-in-from-top-4 sm:slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div className="bg-[#0A192F]/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-base">
            {detectedLocation.flag || <MapPin className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-slate-200 truncate">
              Welcome from <span className="text-white font-bold">{detectedLocation.countryName}</span>!
            </p>
            <p className="text-slate-400 text-[11px] truncate">
              Prices automatically set to <span className="text-emerald-400 font-semibold">{currency} ({currentConfig.symbol})</span> based on your location.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={dismissAutoSwitchedBanner}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-[11px]"
          >
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Got it</span>
          </button>
          <button
            type="button"
            onClick={dismissAutoSwitchedBanner}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
