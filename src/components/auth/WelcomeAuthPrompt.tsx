'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Sparkles, Gift, X, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <aside
      aria-label="Welcome customer invitation"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto animate-in slide-in-from-bottom-6 fade-in duration-300"
    >
      <div className="relative p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-xl border border-blue-200/80 dark:border-blue-900/60 shadow-2xl shadow-blue-900/20 text-slate-900 dark:text-slate-100 overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0066FF] via-cyan-400 to-amber-400" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-blue-500 text-white flex items-center justify-center p-1 shadow-md shrink-0">
              <Image
                src="/logo-icon.png"
                alt="JudesCart"
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0066FF] dark:text-[#38BDF8] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Welcome
                </span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  +200 Coins
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                Welcome to JudesCart!
              </h3>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Maybe later"
            aria-label="Dismiss welcome prompt"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          Sign in now to earn <strong className="text-amber-600 dark:text-amber-400">200 welcome JudesCoins</strong>, save addresses, and access member deals—or continue browsing as a guest.
        </p>

        {/* Options: Login right away or maybe later */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleLoginRightAway}
            className="flex-1 py-2 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSignupRightAway}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0066FF] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-500" />
            <span>Join (+200)</span>
          </button>

          <button
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </aside>
  );
}
