'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { CURRENCIES } from '@/lib/mock-data';
import { CurrencyCode } from '@/types/currency';
import { ChevronDown, MapPin, Check, Sparkles, Loader2, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CurrencySwitcher({ className }: { className?: string }) {
  const {
    currency,
    setCurrency,
    detectedLocation,
    isDetectingLocation,
    detectUserLocationCurrency,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies = Object.values(CURRENCIES);
  const currentConfig = CURRENCIES[currency] || CURRENCIES.USD;
  const isAutoMatched = detectedLocation && detectedLocation.currency === currency;

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100/90 active:scale-95 transition-all border border-stone-200/80 bg-white/70 shadow-xs"
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none" role="img" aria-label={currentConfig.name}>
          {currentConfig.flag || '🌐'}
        </span>
        <span className="font-semibold text-stone-900 tracking-tight">{currency}</span>
        <span className="text-stone-400 font-mono text-[11px] font-normal">({currentConfig.symbol})</span>
        {isAutoMatched && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100"
            title={`Auto-matched to ${detectedLocation?.countryName || 'your location'}`}
          />
        )}
        <ChevronDown
          className={cn('w-3 h-3 text-stone-400 transition-transform duration-200 ml-0.5', isOpen && 'rotate-180 text-stone-700')}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
          {/* Header & Location Detection Status */}
          <div className="px-3.5 pt-1.5 pb-2 border-b border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Select Currency
              </span>
              {detectedLocation && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-[10px] font-medium text-emerald-700 border border-emerald-200/60">
                  <MapPin className="w-2.5 h-2.5" />
                  {detectedLocation.countryName}
                </span>
              )}
            </div>

            {/* Quick Auto-Detect Button */}
            <button
              type="button"
              disabled={isDetectingLocation}
              onClick={async () => {
                await detectUserLocationCurrency(true);
              }}
              className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0066FF] bg-blue-50/80 hover:bg-blue-100/80 disabled:opacity-50 rounded-xl transition-colors border border-blue-100"
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Detecting your location...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3 h-3" />
                  <span>Auto-detect from my location</span>
                </>
              )}
            </button>
          </div>

          {/* Currencies List */}
          <div className="py-1 max-h-72 overflow-y-auto divide-y divide-stone-50">
            {currencies.map((c) => {
              const isSelected = currency === c.code;
              const isDetectedForThis = detectedLocation?.currency === c.code;

              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCurrency(c.code as CurrencyCode, true);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center justify-between w-full px-3.5 py-2.5 text-xs text-left transition-all',
                    isSelected
                      ? 'bg-blue-50/60 text-[#0066FF] font-semibold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg leading-none" role="img" aria-label={c.name}>
                      {c.flag}
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900">{c.code}</span>
                        <span className="text-stone-400">·</span>
                        <span className="text-stone-600 truncate">{c.name}</span>
                      </div>
                      {isDetectedForThis && (
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 inline" />
                          Detected for your location
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-stone-100 text-stone-700">
                      {c.symbol}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#0066FF]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="px-3.5 pt-2 pb-1 border-t border-stone-100 text-[10px] text-stone-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Prices convert automatically based on real-time rates.</span>
          </div>
        </div>
      )}
    </div>
  );
}
