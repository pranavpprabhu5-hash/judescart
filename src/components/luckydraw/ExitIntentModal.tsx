'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Sparkles, Percent, ShoppingBag, ArrowRight, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function ExitIntentModal() {
  const { cart, cartCount, cartSummary, applyPromo, openCart, formatAmount } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Check if already displayed in this browser session
    const hasShown = sessionStorage.getItem('judescart_exit_intent_shown');
    if (hasShown) return;

    let eligible = false;
    // Wait at least 4 seconds after page load before arming exit-intent
    const timer = setTimeout(() => {
      eligible = true;
    }, 4000);

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when cursor moves to the top edge of the browser viewport
      if (e.clientY <= 8 && eligible) {
        const alreadyShown = sessionStorage.getItem('judescart_exit_intent_shown');
        if (!alreadyShown) {
          sessionStorage.setItem('judescart_exit_intent_shown', 'true');
          setIsOpen(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isOpen) return null;

  const handleClaimDiscount = () => {
    applyPromo('WELCOME15');
    setIsOpen(false);
    openCart();
  };

  const discountEstimate = cartSummary.subtotal * 0.15;
  const newEstimatedTotal = Math.max(0, cartSummary.subtotal - discountEstimate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-blue-100 animate-in zoom-in-95 duration-200">
        {/* Top Gradient Banner */}
        <div className="relative bg-gradient-to-r from-[#0066FF] via-blue-600 to-[#0A192F] p-6 text-white text-center overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 text-cyan-200 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Wait! Before You Leave
          </span>

          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Take 15% OFF Your Order
          </h3>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-sm mx-auto">
            Don&apos;t leave empty-handed. Claim coupon code <strong className="text-amber-300">WELCOME15</strong> or try your luck on our wheel!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* If items in cart, show bag preview */}
          {cartCount > 0 ? (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#0066FF]" />
                  Items Waiting in Your Bag ({cartCount})
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Save {formatAmount(discountEstimate)}
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {cart.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-stone-200 shrink-0">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="text-[11px] pr-2">
                      <p className="font-semibold text-stone-900 max-w-[110px] truncate">{item.name}</p>
                      <p className="text-stone-500 font-mono">{formatAmount(item.price)}</p>
                    </div>
                  </div>
                ))}
                {cart.length > 3 && (
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-stone-200 text-stone-600 text-xs font-bold shrink-0">
                    +{cart.length - 3}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs">
                <span className="text-stone-500">Total with 15% OFF:</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="line-through text-stone-400 font-mono">{formatAmount(cartSummary.subtotal)}</span>
                  <span className="text-base font-black text-[#0066FF] font-mono">{formatAmount(newEstimatedTotal)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Percent className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-stone-900">Instant VIP Voucher: WELCOME15</p>
                <p className="text-stone-500 mt-0.5">
                  Get 15% off across all high-grade electronics, bags, and luxury items today.
                </p>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <button
              onClick={handleClaimDiscount}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Apply 15% OFF & View Bag</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/lucky-draw"
              onClick={() => setIsOpen(false)}
              className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Or Spin the Wheel to Win up to 50% OFF</span>
            </Link>
          </div>

          {/* Opt-out link */}
          <div className="text-center pt-1">
            <button
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-stone-400 hover:text-stone-600 font-medium transition-colors cursor-pointer"
            >
              No thanks, I&apos;d prefer to pay full price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
