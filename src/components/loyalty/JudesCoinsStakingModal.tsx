'use client';

import React, { useState } from 'react';
import {
  X,
  Coins,
  Lock,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Gift,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface JudesCoinsStakingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STAKING_TIERS = [
  {
    days: 7,
    name: '7-Day Sprint Vault',
    apy: 12,
    ticketBonus: '1x Silver Draw Ticket',
    badge: 'Short-Term Flex',
    border: 'border-blue-300 dark:border-blue-800/60',
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
  },
  {
    days: 14,
    name: '14-Day Growth Vault',
    apy: 24,
    ticketBonus: '1x Gold Draw Ticket',
    badge: 'Most Popular',
    border: 'border-amber-400 dark:border-amber-600/60',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
  },
  {
    days: 30,
    name: '30-Day Royal Vault',
    apy: 48,
    ticketBonus: '1x Platinum Draw Ticket',
    badge: 'Maximum Yield',
    border: 'border-purple-400 dark:border-purple-600/60',
    bg: 'bg-purple-50/60 dark:bg-purple-950/20',
  },
];

export function JudesCoinsStakingModal({ isOpen, onClose }: JudesCoinsStakingModalProps) {
  const { judesCoins, coinStakes, stakeCoins, claimMaturedStake } = useStore();

  const [selectedDuration, setSelectedDuration] = useState<number>(14);
  const [stakeAmount, setStakeAmount] = useState<number>(250);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTier = STAKING_TIERS.find((t) => t.days === selectedDuration) || STAKING_TIERS[1];
  const projectedReward = Math.round((stakeAmount * currentTier.apy) / 100 * (currentTier.days / 365));

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    if (stakeAmount > judesCoins) {
      setFeedback('⚠️ Insufficient JudesCoins balance to complete this stake.');
      return;
    }

    const success = stakeCoins(stakeAmount, selectedDuration);
    if (success) {
      setFeedback(`🎉 Successfully staked ${stakeAmount} JudesCoins in the ${currentTier.name}!`);
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback('⚠️ Staking failed. Please check your balance and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  JudesCoins VIP Staking Hub
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                  Up to 48% APY
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lock coins to earn guaranteed token yield and complimentary lucky draw tickets
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

        {/* Content */}
        <div className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          {/* Balance card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-400/5 to-purple-500/10 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="w-6 h-6 text-amber-500" />
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Available Balance</span>
                <div className="font-black text-lg text-slate-900 dark:text-white font-mono">
                  {judesCoins.toLocaleString()} <span className="text-xs font-bold text-amber-600">JudesCoins</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Stakes</span>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                {coinStakes.filter((s) => s.status !== 'claimed').length} Vaults Running
              </span>
            </div>
          </div>

          {/* Staking Form */}
          <form onSubmit={handleStake} className="space-y-4">
            {/* Choose Lockup Duration */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                1. Select Staking Vault &amp; Lockup Duration
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {STAKING_TIERS.map((tier) => (
                  <button
                    key={tier.days}
                    type="button"
                    onClick={() => setSelectedDuration(tier.days)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedDuration === tier.days
                        ? `${tier.border} ${tier.bg} shadow-md scale-[1.02] ring-2 ring-amber-400/50`
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">{tier.days} Days</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                        {tier.apy}% APY
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium truncate">{tier.name}</div>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <Gift className="w-3 h-3 shrink-0" />
                      <span className="truncate">+{tier.ticketBonus}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  2. Enter Staking Amount
                </label>
                <div className="flex gap-1.5">
                  {[250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setStakeAmount(preset)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-bold text-slate-700 dark:text-slate-300"
                    >
                      {preset} Coins
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStakeAmount(judesCoins)}
                    className="px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 text-[10px] font-bold text-amber-800 dark:text-amber-300"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={50}
                  max={judesCoins}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold focus:ring-2 focus:ring-[#0066FF]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                  JudesCoins
                </span>
              </div>
            </div>

            {/* Projected Returns Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Lockup Period:</span>
                <span className="font-bold text-slate-900 dark:text-white">{currentTier.days} Days</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Annualized Rate (APY):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">+{currentTier.apy}% APY</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Complimentary Raffle Ticket:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{currentTier.ticketBonus}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center font-bold text-slate-900 dark:text-white">
                <span>Estimated Returns at Maturity:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  +{projectedReward} JudesCoins ({stakeAmount + projectedReward} Total)
                </span>
              </div>
            </div>

            {feedback && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-medium animate-in fade-in">
                {feedback}
              </div>
            )}

            <button
              type="submit"
              disabled={judesCoins < 50}
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              Lock &amp; Stake {stakeAmount} JudesCoins
            </button>
          </form>

          {/* Active Stakes Ledger */}
          {coinStakes.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Your Active &amp; Matured Stakes ({coinStakes.length})
                </span>
              </div>

              <div className="space-y-2">
                {coinStakes.map((stake) => (
                  <div
                    key={stake.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{stake.amount} Coins</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-400">
                          {stake.durationDays}d @ {stake.apy}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Started: {stake.startDate} • Est. Yield: +{stake.returnCoins} Coins • {stake.drawTicketAwarded}
                      </div>
                    </div>

                    <div>
                      {stake.status === 'claimed' ? (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-[10px] font-bold">
                          Claimed ✓
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            claimMaturedStake(stake.id);
                            setFeedback(`🎉 Claimed stake ${stake.id} yield +${stake.returnCoins} JudesCoins!`);
                          }}
                          className="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          Claim Matured
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
