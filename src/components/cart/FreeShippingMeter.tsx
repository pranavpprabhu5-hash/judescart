'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export function FreeShippingMeter() {
  const { cartSummary, formatAmount } = useStore();
  const { freeShippingThreshold, amountUntilFreeShipping, isFreeShippingUnlocked, subtotal } = cartSummary;

  const percentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2">
      <div className="flex items-center justify-between text-xs">
        {isFreeShippingUnlocked ? (
          <div className="flex items-center gap-1.5 font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Complimentary Express Delivery Unlocked!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>
              Add <strong className="font-bold text-[#0066FF]">{formatAmount(amountUntilFreeShipping)}</strong> for Free Express Delivery
            </span>
          </div>
        )}
        <span className="text-[11px] font-bold text-[#0066FF]">{percentage}%</span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isFreeShippingUnlocked ? 'bg-emerald-600' : 'bg-gradient-to-r from-[#0066FF] to-[#38BDF8]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
