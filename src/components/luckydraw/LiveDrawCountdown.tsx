'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Crown, Gift, Sparkles, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function LiveDrawCountdown() {
  const [selectedTier, setSelectedTier] = useState<'silver' | 'gold' | 'platinum' | 'bumper'>('silver');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 2, hours: 14, minutes: 28, seconds: 45 });

  // Calculate dynamic time for the selected tier
  useEffect(() => {
    // Offset targets for demo realism
    const baseSeconds =
      selectedTier === 'silver' ? 2 * 86400 + 14 * 3600 + 1720 :
      selectedTier === 'gold' ? 10 * 86400 + 6 * 3600 + 940 :
      selectedTier === 'platinum' ? 20 * 86400 + 18 * 3600 + 430 :
      142 * 86400 + 9 * 3600;

    let remaining = baseSeconds;

    const interval = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTier]);

  const tierConfig = {
    silver: {
      name: 'Silver Draw',
      frequency: 'Weekly Every Sunday (8:00 PM EST)',
      prizeHighlight: 'Apple AirPods 4 + ₹5,000 Cash Raffles',
      accentColor: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      icon: <Gift className="w-5 h-5 text-cyan-400" />,
      entryThreshold: 'Entries earned on all orders over $50',
    },
    gold: {
      name: 'Gold Draw',
      frequency: 'Bi-Weekly (Every Alternate Thursday)',
      prizeHighlight: 'Apple Watch Series 10 + Sony XM5 Studio Audio',
      accentColor: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
      icon: <Sparkles className="w-5 h-5 text-blue-400" />,
      entryThreshold: 'Entries earned on all orders over $100',
    },
    platinum: {
      name: 'Platinum Draw',
      frequency: 'Monthly Luxury Jackpot (1st of Month)',
      prizeHighlight: 'Apple iPhone 16 Pro Max + M3 MacBook Air',
      accentColor: 'from-amber-400 via-yellow-400 to-amber-600',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      icon: <Trophy className="w-5 h-5 text-amber-400" />,
      entryThreshold: 'Entries earned on flagship orders over $250',
    },
    bumper: {
      name: 'Mega Bumper Draw',
      frequency: 'Semi-Annual Grand Event (Exclusive to Brand JUDES)',
      prizeHighlight: 'Luxury SUV Car + Foreign Vacation + ₹5,00,000 Cash',
      accentColor: 'from-purple-500 via-pink-500 to-amber-500',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      icon: <Crown className="w-5 h-5 text-yellow-300" />,
      entryThreshold: 'All purchases of JudesCart in-house brand JUDES',
    },
  };

  const current = tierConfig[selectedTier];

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#0A192F] border border-blue-900/50 shadow-2xl p-6 sm:p-10 text-white">
      {/* Background ambient lighting */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#0066FF]/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Tier Selector & Info */}
        <div className="space-y-4 text-center lg:text-left flex-1">
          {/* Tier Switcher Pills */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-900/80 border border-slate-800 gap-1">
            {(['silver', 'gold', 'platinum', 'bumper'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedTier === tier
                    ? 'bg-[#0066FF] text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tier === 'bumper' ? '👑 Bumper' : tier}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${current.badgeBg}`}>
              {current.icon}
              <span>{current.name}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Countdown
            </span>
          </div>

          <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Next Draw in Progress
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            Grand Prize: <strong className="text-amber-300">{current.prizeHighlight}</strong>. {current.entryThreshold}.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-600 text-xs font-bold text-white transition-all shadow-md active:scale-95"
            >
              <span>Shop Eligible Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Provably Fair Cryptographic Draw</span>
            </div>
          </div>
        </div>

        {/* Right Side: Digital Countdown Digits */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-16 sm:w-20 h-20 sm:h-24 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 shadow-inner flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
                <span className="font-mono text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200">
                  {String(digit.value).padStart(2, '0')}
                </span>
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-950/60" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
                {digit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
