'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, Trophy, Crown, Gift, ArrowRight, Award, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { LuckyDrawWheel } from './LuckyDrawWheel';
import { cn } from '@/lib/utils';

export function LuckyDrawModal() {
  const { isLuckyDrawOpen, closeLuckyDraw } = useStore();
  const [activeTab, setActiveTab] = useState<'regular-draws' | 'spin-wheel'>('regular-draws');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLuckyDrawOpen) {
        closeLuckyDraw();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLuckyDrawOpen, closeLuckyDraw]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isLuckyDrawOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLuckyDrawOpen]);

  if (!isLuckyDrawOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeLuckyDraw}
        className="fixed inset-0 bg-[#0A192F]/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0A192F] via-[#0F274A] to-[#0066FF] px-6 py-4 text-white flex items-center justify-between relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />

          <div className="flex items-center gap-2.5 z-10">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs text-amber-400 border border-white/10">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-widest uppercase text-cyan-300">
                  JudesCart Official Draws
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                  Automatic Entry
                </span>
              </div>
              <h3 className="font-sans text-lg sm:text-xl font-black text-white leading-tight">
                3 Regular Draws + JUDES Bumper Draw
              </h3>
            </div>
          </div>

          <button
            onClick={closeLuckyDraw}
            className="z-10 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close lucky draw"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('regular-draws')}
            className={cn(
              'py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'regular-draws'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>3 Profit Draws &amp; Bumper</span>
          </button>
          <button
            onClick={() => setActiveTab('spin-wheel')}
            className={cn(
              'py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'spin-wheel'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Prize Wheel</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'regular-draws' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 font-normal">
                Every purchase automatically earns verified draw tickets based on product profit margins, plus grand bumper entries for our own in-house brand <strong>JUDES</strong>:
              </p>

              {/* Tier 1 */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-300/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    Tier 1 Mega Platinum Draw
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-black">
                    Profit &gt; ₹500
                  </span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Drawn <strong>Monthly</strong>. Grand Prizes: Apple iPhone 16 Pro Max, MacBook Air M3, and ₹50,000 Cash Spree.
                </p>
              </div>

              {/* Tier 2 */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-300/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#0066FF]" />
                    Tier 2 Gold Draw
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0066FF] text-white font-mono text-[10px] font-black">
                    Profit ₹250–₹500
                  </span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Drawn <strong>Bi-Weekly</strong>. Grand Prizes: Apple Watch Series 10, Sony WH-1000XM5, and ₹20,000 Vouchers.
                </p>
              </div>

              {/* Tier 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-500/10 border border-slate-300/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-cyan-600" />
                    Tier 3 Silver Draw
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-700 text-white font-mono text-[10px] font-black">
                    Profit ₹100–₹250
                  </span>
                </div>
                <p className="text-[11px] text-slate-700">
                  Drawn <strong>Every Sunday</strong>. Grand Prizes: Apple AirPods 4, Marshall Speakers, and ₹5,000 Store Credit.
                </p>
              </div>

              {/* Bumper Draw */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A192F] to-[#0F2850] text-white space-y-1.5 border border-amber-400/50 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
                    Mega Bumper Draw (Every 6 to 12 Months)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-[#0A192F] font-black uppercase">
                    Brand JUDES
                  </span>
                </div>
                <p className="text-xs text-slate-200">
                  Includes <strong>only products from JudesCart’s own brand JUDES</strong>. Mega Jackpot: Brand New Luxury EV/Car, International Tour, &amp; ₹5,00,000 Cash!
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link
                  href="/lucky-draw"
                  onClick={closeLuckyDraw}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25"
                >
                  <span>Explore Full Draw Portal &amp; Ticket Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/products?brand=JUDES"
                  onClick={closeLuckyDraw}
                  className="py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0A192F] text-xs font-black transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Shop Brand JUDES</span>
                </Link>
              </div>
            </div>
          ) : (
            <LuckyDrawWheel onPrizeClaimed={closeLuckyDraw} />
          )}
        </div>

        {/* Modal Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" />
            Verifiable automated ticket numbers generated on checkout
          </span>
          <Link
            href="/lucky-draw"
            onClick={closeLuckyDraw}
            className="font-bold text-[#0066FF] hover:underline"
          >
            Draw Rules &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
