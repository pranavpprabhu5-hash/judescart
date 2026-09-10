'use client';

import React from 'react';
import { Sparkles, ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';

export function AnnouncementBar() {
  const { openLuckyDraw } = useStore();

  return (
    <div className="bg-[#0A192F] text-stone-200 text-xs py-2 px-4 transition-colors border-b border-blue-900/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-blue-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-medium">Welcome to JudesCart – Shop More. Live Better.</span>
        </div>

        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>Complimentary Express Delivery on orders over $99</span>
          <span className="hidden md:inline text-stone-500">•</span>
          <button
            onClick={openLuckyDraw}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-blue-500/20 text-amber-300 hover:text-white border border-amber-400/40 hover:border-amber-300 font-bold transition-all cursor-pointer"
          >
            <Gift className="w-3 h-3 text-amber-400 animate-bounce" />
            <span>Lucky Draws: 3 Profit Tiers + JUDES Bumper</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4 text-blue-300">
          <Link href="/lucky-draw" className="hover:text-amber-300 flex items-center gap-1 transition-colors font-medium">
            <span>Official Draw Hub</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
