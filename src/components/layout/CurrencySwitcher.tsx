'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { CURRENCIES } from '@/lib/mock-data';
import { CurrencyCode } from '@/types/currency';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useStore();
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

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-stone-500" />
        <span>{currency} ({CURRENCIES[currency].symbol})</span>
        <ChevronDown className={cn('w-3 h-3 text-stone-400 transition-transform duration-150', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
            Select Currency
          </div>
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrency(c.code as CurrencyCode);
                setIsOpen(false);
              }}
              className={cn(
                'flex items-center justify-between w-full px-3 py-2 text-xs text-left transition-colors',
                currency === c.code
                  ? 'bg-stone-100 font-semibold text-stone-900'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              )}
            >
              <span>{c.code} – {c.name}</span>
              <span className="text-stone-400">{c.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
