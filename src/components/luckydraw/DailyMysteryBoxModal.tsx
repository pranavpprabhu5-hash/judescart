'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';
import {
  Gift,
  X,
  Sparkles,
  Flame,
  CheckCircle2,
  Lock,
  Coins,
  Trophy,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MYSTERY_REWARDS = [
  {
    id: 1,
    title: 'Daily Coin Cache',
    coins: 6,
    bonus: '+1 Lucky Draw Spin Token',
    desc: '6 JudesCoins credited straight to your vault, plus a bonus spin token!',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 2,
    title: 'Jackpot Mystery Chest',
    coins: 10,
    bonus: 'Daily Max Cap (10 Coins)',
    desc: '10 JudesCoins (Maximum Daily Reward Limit) and automatic VIP draw ticket!',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    id: 3,
    title: 'Express Shopper Bundle',
    coins: 8,
    bonus: 'Free Priority Dispatch Code',
    desc: '8 JudesCoins plus complimentary express courier upgrade code (FASTJUDES)!',
    color: 'from-blue-600 to-cyan-600',
  },
];

const STREAK_DAYS = [
  { day: 1, reward: '2 Coins', active: true },
  { day: 2, reward: '4 Coins', active: true },
  { day: 3, reward: '6 Coins', active: true },
  { day: 4, reward: '8 Coins', active: false },
  { day: 5, reward: '10 Coins (Max)', active: false },
];

export function DailyMysteryBoxModal() {
  const {
    isDailyMysteryOpen,
    closeDailyMystery,
    dailyStreak,
    dailyMysteryClaimed,
    claimDailyMystery,
    openLuckyDraw,
  } = useStore();

  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [revealedReward, setRevealedReward] = useState<typeof MYSTERY_REWARDS[0] | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [countdown, setCountdown] = useState('14h 22m 10s');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${hours}h ${mins}m ${secs}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isDailyMysteryOpen) return null;

  const handlePickBox = (boxIndex: number) => {
    if (dailyMysteryClaimed || isOpening) return;

    setSelectedBox(boxIndex);
    setIsOpening(true);

    setTimeout(() => {
      const reward = MYSTERY_REWARDS[boxIndex % MYSTERY_REWARDS.length];
      setRevealedReward(reward);
      claimDailyMystery(reward.coins);
      setIsOpening(false);

      // Celebrate with confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#8B5CF6', '#3B82F6', '#10B981', '#FFFFFF'],
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={closeDailyMystery} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Banner Header */}
        <div className="relative bg-gradient-to-r from-[#0A192F] via-[#1E293B] to-[#0A192F] text-white p-6 pb-7">
          <button
            onClick={closeDailyMystery}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Daily Streak: Day {dailyStreak} • Max 10 Coins/Day</span>
          </div>

          <h3 className="font-sans text-2xl sm:text-3xl font-extrabold">
            Daily JudesCart Mystery Vault
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Open JudesCart everyday to claim your daily coins (capped at 10 coins max). Miss a day and your streak resets!
          </p>

          {/* Streak Track */}
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-5 gap-1.5">
            {STREAK_DAYS.map((s) => (
              <div
                key={s.day}
                className={cn(
                  'p-1.5 rounded-xl text-center border text-[10px] transition-all',
                  s.day <= dailyStreak
                    ? 'bg-amber-400/20 border-amber-400/60 text-amber-200 font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400'
                )}
              >
                <div className="text-[9px] uppercase tracking-wider">Day {s.day}</div>
                <div className="truncate text-[10px] mt-0.5">{s.reward.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {!dailyMysteryClaimed && !revealedReward ? (
            <div className="space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Choose 1 of 3 Mystery Chests:
              </span>

              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((idx) => {
                  const isSelected = selectedBox === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePickBox(idx)}
                      disabled={isOpening}
                      className={cn(
                        'group relative aspect-square rounded-2xl border-2 p-4 flex flex-col items-center justify-center transition-all cursor-pointer shadow-xs',
                        isSelected
                          ? 'border-[#0066FF] bg-blue-50/50 scale-105 animate-pulse'
                          : 'border-slate-200 hover:border-[#0066FF] hover:bg-slate-50 hover:-translate-y-1'
                      )}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                        <Gift className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 mt-2.5">
                        Chest #{idx + 1}
                      </span>
                      <span className="text-[10px] text-[#0066FF] font-semibold mt-0.5">
                        Tap to Open
                      </span>
                    </button>
                  );
                })}
              </div>

              {isOpening && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0066FF] pt-2 animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Unlocking your secret daily bounty...</span>
                </div>
              )}
            </div>
          ) : revealedReward ? (
            /* Revealed Reward State */
            <div className="text-center space-y-4 py-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-800 ring-8 ring-amber-50">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF]">
                  Vault Unlocked!
                </span>
                <h4 className="font-sans text-2xl font-extrabold text-slate-900">
                  +{revealedReward.coins} JudesCoins Claimed
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {revealedReward.desc}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 inline-flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>Bonus: {revealedReward.bonus}</span>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => {
                    closeDailyMystery();
                    openLuckyDraw();
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <span>Use on Lucky Wheel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={closeDailyMystery}
                  className="px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Already Claimed State */
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-600">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Today&apos;s Gift Claimed!</span>
                </span>
                <h4 className="font-sans text-xl font-bold text-slate-900">
                  Come Back Tomorrow for Day {dailyStreak + 1}
                </h4>
                <p className="text-xs text-slate-500">
                  Vault resets every midnight. Remember to open the platform everyday to keep your streak alive and claim up to 10 coins daily!
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Next chest unlocks in: {countdown}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
