'use client';

import React, { useState } from 'react';
import {
  X,
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  Coins,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Award,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface ReferralStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAST_REFERRALS = [
  { name: 'Marcus Vance', date: 'Sep 09, 2026', orderTotal: '₹14,990', rewardEarned: 250, status: 'Settled' },
  { name: 'Liam O’Connor', date: 'Sep 05, 2026', orderTotal: '₹8,499', rewardEarned: 250, status: 'Settled' },
  { name: 'Priya Sharma', date: 'Aug 28, 2026', orderTotal: '₹22,000', rewardEarned: 250, status: 'Settled' },
];

export function ReferralStudioModal({ isOpen, onClose }: ReferralStudioModalProps) {
  const { referralCode, referralStats } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = referralCode || 'JUDES-EV99';
  const shareUrl = `https://judescart.vercel.app/?ref=${code}`;
  const shareText = `Hey! Use my JudesCart referral code "${code}" to unlock 15% OFF luxury essentials, smart home tech, and automatic entry into the Apple iPhone 16 Pro lucky draw: ${shareUrl}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[#0066FF] dark:text-[#38BDF8]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Customer Referral Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8] text-[10px] font-black uppercase">
                  Double Rewards
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Give your friends 15% OFF and earn 250 JudesCoins + Lucky Draw entries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          {/* Share Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50/40 dark:from-slate-900 dark:to-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#0066FF] dark:text-[#38BDF8]">
                  Your Exclusive Referral Pass
                </span>
                <div className="font-mono font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wider mt-0.5">
                  {code}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white text-[11px] font-bold shadow-sm transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-white dark:text-black text-white text-[11px] font-bold shadow-sm transition-all active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>X / Share</span>
                </a>
              </div>
            </div>

            {/* Copy link input */}
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full pl-3.5 pr-24 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stats 3-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Friends Invited</span>
              <span className="font-mono font-black text-xl text-slate-900 dark:text-white">
                {referralStats?.totalReferred || 3}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">3 Active Shoppers</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Coins Earned</span>
              <span className="font-mono font-black text-xl text-amber-500">
                +{referralStats?.coinsEarned || 750}
              </span>
              <span className="text-[10px] text-amber-600 font-medium block mt-0.5">JudesCoins Awarded</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Next Milestone</span>
              <span className="font-mono font-black text-xl text-purple-600 dark:text-purple-400">
                2 More
              </span>
              <span className="text-[10px] text-purple-600 font-medium block mt-0.5">Unlocks 2x VIP Multiplier</span>
            </div>
          </div>

          {/* How Referral Program Works */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <Gift className="w-4 h-4 text-[#0066FF]" />
                <span>What Your Friends Get</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Instant 15% discount on their first checkout and an automatic entry ticket into the Sunday Silver Lucky Draw.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>What You Get</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                250 JudesCoins added to your VIP vault the moment their first package is delivered, plus 1 Golden Bumper Token for every 3 referrals.
              </p>
            </div>
          </div>

          {/* Recent Referral History Ledger */}
          <div className="space-y-3 pt-2">
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Referral Ledger History
            </span>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              {PAST_REFERRALS.map((r, i) => (
                <div key={i} className="p-3 bg-white dark:bg-slate-900/50 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">{r.name}</p>
                    <p className="text-[10px] text-slate-500">Joined on {r.date} • First order {r.orderTotal}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs">
                      +{r.rewardEarned} Coins
                    </span>
                    <span className="block text-[9px] text-slate-400 uppercase font-bold">{r.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
