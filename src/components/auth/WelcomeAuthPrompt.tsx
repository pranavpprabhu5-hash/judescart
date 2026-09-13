'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Sparkles, Gift, X, ArrowRight, ShieldCheck, Truck, RotateCcw, Coins } from 'lucide-react';
import Image from 'next/image';

export function WelcomeAuthPrompt() {
  const { isLoggedIn, openAuthModal } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user is already logged in, do not show
    if (isLoggedIn) {
      setIsVisible(false);
      return;
    }

    // Check if dismissed in this session
    try {
      const dismissed = sessionStorage.getItem('judescart_welcome_auth_dismissed');
      if (!dismissed) {
        // Show after 1.2s delay for a delightful first impression
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore storage errors
    }
  }, [isLoggedIn]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('judescart_welcome_auth_dismissed', 'true');
    } catch {}
  };

  const handleLoginRightAway = () => {
    handleDismiss();
    openAuthModal('login');
  };

  const handleSignupRightAway = () => {
    handleDismiss();
    openAuthModal('signup');
  };

  if (!isVisible || isLoggedIn) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/65 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Backdrop Click to Close */}
      <div className="fixed inset-0" onClick={handleDismiss} aria-hidden="true" />

      {/* Closable Window on Top */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#0C1527] rounded-3xl shadow-2xl z-10 border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Window Top Ambient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0066FF] via-cyan-400 to-amber-400" />

        {/* Window Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center p-1.5 shadow-md shadow-blue-500/25 shrink-0">
              <Image
                src="/logo-icon.png"
                alt="JudesCart"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0066FF] dark:text-[#38BDF8] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Welcome to JudesCart
                </span>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  +200 Coins
                </span>
              </div>
              <h2 id="welcome-auth-title" className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                Sign in or Explore as Guest
              </h2>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close window (Maybe later)"
            aria-label="Close welcome window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Window Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Welcome Bonus Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Get 200 Welcome JudesCoins
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Unlock instant promo discounts, lucky draw tickets, and faster 1-click checkout.
              </p>
            </div>
          </div>

          {/* Quick Perks List */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
              <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Free Express &gt; $99</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
              <Coins className="w-4 h-4 text-amber-500 shrink-0" />
              <span>10 Coins / $1 Spent</span>
            </div>
          </div>

          {/* Action Buttons: Sign In / Create Account */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSignupRightAway}
              className="w-full py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gift className="w-4 h-4 text-amber-300" />
              <span>Create Account &amp; Claim 200 Coins</span>
            </button>

            <button
              onClick={handleLoginRightAway}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Sign In to Existing Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Maybe Later Option */}
          <div className="pt-2 text-center">
            <button
              onClick={handleDismiss}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Maybe Later — Continue Browsing as Guest
            </button>
          </div>
        </div>

        {/* Window Footer Security Indicator */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Official JudesCart Security
          </span>
          <span>Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
}
