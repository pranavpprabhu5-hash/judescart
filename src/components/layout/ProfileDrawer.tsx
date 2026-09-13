'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import {
  X,
  Package,
  MapPin,
  Heart,
  LogOut,
  Truck,
  ExternalLink,
  ShieldCheck,
  Coins,
  Sparkles,
  Gift,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Printer,
  FileText,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Order } from '@/types/user';
import { JudesCoinsStakingModal } from '@/components/loyalty/JudesCoinsStakingModal';
import { ReferralStudioModal } from '@/components/loyalty/ReferralStudioModal';

export function ProfileDrawer() {
  const {
    isProfileOpen,
    closeProfile,
    user,
    isLoggedIn,
    toggleLogin,
    openAuthModal,
    logoutCustomer,
    formatAmount,
    judesCoins,
    redeemCoinsForSpin,
    redeemCoinsForDiscount,
    vipTier,
    lifetimeSpend,
    vipMultiplier,
    nextTierSpendRemaining,
    tierProgressPct,
    dailyStreak,
    openDailyMystery,
    dailyMysteryClaimed,
    reorderItems,
  } = useStore();

  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);
  const [isStakingModalOpen, setIsStakingModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'rewards' | 'addresses' | 'security'>('orders');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isProfileOpen) return null;

  const handleRedeemSpin = () => {
    const success = redeemCoinsForSpin();
    if (success) {
      setFeedback({
        type: 'success',
        message: '🎉 100 Coins redeemed! +1 Lucky Spin has been credited to your wheel.',
      });
    } else {
      setFeedback({
        type: 'error',
        message: 'Insufficient JudesCoins. You need at least 100 coins for a Lucky Spin.',
      });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleRedeemDiscount = () => {
    const success = redeemCoinsForDiscount(500);
    if (success) {
      setFeedback({
        type: 'success',
        message: '🏷️ 500 Coins redeemed! 25% OFF promo code (LUCKY25) applied to your cart.',
      });
    } else {
      setFeedback({
        type: 'error',
        message: 'Insufficient JudesCoins. You need at least 500 coins to claim 25% OFF.',
      });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0A192F]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={closeProfile} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0A192F]">{isLoggedIn ? user.name : 'Guest Customer'}</h3>
                {vipTier === 'black' ? (
                  <span className="text-[10px] font-extrabold text-amber-300 bg-slate-900 border border-amber-400/40 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    👑 Judes Black
                  </span>
                ) : vipTier === 'gold' ? (
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    🏆 Gold VIP
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    🛡️ Silver
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{isLoggedIn ? user.email : 'Browsing as visitor'}</p>
            </div>
          </div>
          <button
            onClick={closeProfile}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guest Welcoming Banner if Logged Out */}
        {!isLoggedIn && (
          <div className="m-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sign in to JudesCart</h4>
                <p className="text-[11px] text-slate-500">View your order history, delivery radar, &amp; coins</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => openAuthModal('login')}
                className="py-2 px-3 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs text-center shadow-xs transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="py-2 px-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-50/80 text-[#0066FF] font-bold text-xs text-center transition-colors cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* JudesCoins & Daily Gift Bar */}
        <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-600">
              <Coins className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-950">
                {judesCoins.toLocaleString()} <span className="text-[11px] font-medium text-amber-700">JudesCoins</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeProfile();
                openDailyMystery();
              }}
              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-100/70 hover:bg-purple-200/70 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
              title="Open Daily Mystery Gift"
            >
              <span>🎁 Day {dailyStreak}</span>
              {!dailyMysteryClaimed && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className="text-[11px] font-bold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-0.5"
            >
              <span>Perks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-5 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'py-3 border-b-2 transition-colors flex items-center gap-1.5 mr-4 whitespace-nowrap',
              activeTab === 'orders'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders ({user.orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={cn(
              'py-3 border-b-2 transition-colors flex items-center gap-1.5 mr-4 whitespace-nowrap',
              activeTab === 'rewards'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>Coins & Perks</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={cn(
              'py-3 border-b-2 transition-colors flex items-center gap-1.5 mr-4 whitespace-nowrap',
              activeTab === 'addresses'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Addresses</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={cn(
              'py-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap',
              activeTab === 'security'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={cn(
              'mx-5 mt-3 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2',
              feedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            )}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <p className="flex-1 font-medium">{feedback.message}</p>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {user.orders.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                user.orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-stone-900">#{order.id}</span>
                      <span
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider',
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded bg-stone-200 overflow-hidden shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-medium text-stone-800 truncate">{item.name}</p>
                            <p className="text-stone-500">
                              {item.color} • {item.size} • Qty {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-semibold text-stone-900">
                            {formatAmount(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 4-Step Interactive Timeline */}
                    <div className="pt-2 pb-1 border-t border-stone-200/80">
                      <div className="grid grid-cols-4 gap-1 text-center">
                        {[
                          { label: 'Confirmed', done: true },
                          { label: 'Processing', done: order.status === 'Processing' || order.status === 'Delivered' },
                          { label: 'In Transit', done: order.status === 'Delivered' },
                          { label: 'Delivered', done: order.status === 'Delivered' },
                        ].map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div
                              className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all mb-1',
                                step.done
                                  ? 'bg-emerald-500 text-white shadow-xs'
                                  : 'bg-slate-200 text-slate-500'
                              )}
                            >
                              {step.done ? '✓' : idx + 1}
                            </div>
                            <span className={cn('text-[9px] font-medium leading-tight', step.done ? 'text-slate-800 font-bold' : 'text-slate-400')}>
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                      <span>Ordered {order.date}</span>
                      <span className="font-semibold text-stone-900">Total: {formatAmount(order.total)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 text-[11px] text-stone-600 border-t border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#0066FF]" />
                        <span>
                          <strong className="font-mono text-slate-800">{order.trackingNumber}</strong>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="View & print official invoice"
                        >
                          <FileText className="w-3 h-3 text-slate-500" />
                          <span>Invoice</span>
                        </button>

                        <button
                          onClick={() => {
                            reorderItems(order.items);
                            setReorderSuccessId(order.id);
                            setTimeout(() => {
                              closeProfile();
                              setReorderSuccessId(null);
                            }, 600);
                          }}
                          className="px-2.5 py-1 rounded-md bg-[#0066FF] hover:bg-[#0052CC] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                          title="Add all items from this order back to bag"
                        >
                          <RefreshCw className={cn("w-3 h-3", reorderSuccessId === order.id && "animate-spin")} />
                          <span>{reorderSuccessId === order.id ? 'Added!' : 'Re-order'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4 text-xs">
              {/* Dynamic VIP Club Pass Card */}
              <div
                className={cn(
                  'relative p-5 rounded-2xl text-white shadow-lg overflow-hidden border',
                  vipTier === 'black'
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 border-amber-500/40 shadow-amber-950/20'
                    : vipTier === 'gold'
                    ? 'bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-600 border-amber-300/40'
                    : 'bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 border-slate-600/50'
                )}
              >
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-200 bg-black/30 px-2.5 py-0.5 rounded-full border border-white/10">
                      {vipTier === 'black' ? '👑 Judes Black Elite VIP' : vipTier === 'gold' ? '🏆 Judes Gold VIP' : '🛡️ Judes Silver Member'}
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  </div>

                  <div>
                    <span className="text-xs text-amber-100/90 font-medium">Available Balance</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black tracking-tight">{judesCoins.toLocaleString()}</span>
                      <span className="text-sm font-bold text-amber-200">Coins</span>
                    </div>
                    <p className="text-[11px] text-white/80 mt-1">
                      Reward: <strong className="text-amber-300">1 Coin per ₹100 spent</strong> ({vipMultiplier}x Tier Rate) • Approx ${(judesCoins / 20).toFixed(2)} store credit
                    </p>
                  </div>

                  {/* Tier Progress Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px] text-white/90">
                      <span>Lifetime Spend: {formatAmount(lifetimeSpend)}</span>
                      <span>{tierProgressPct}%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full transition-all duration-700"
                        style={{ width: `${tierProgressPct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-white/70">
                      {vipTier === 'black'
                        ? '✨ Highest VIP Tier reached! Concierge & permanent express delivery active.'
                        : `Spend ${formatAmount(nextTierSpendRemaining)} more to upgrade to ${vipTier === 'silver' ? 'Gold VIP' : 'Judes Black Elite'}.`}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-white/80">
                    <span>Perk: {vipTier === 'black' ? 'Free Express Delivery' : vipTier === 'gold' ? 'Priority Dispatch' : 'Free Standard Over $75'}</span>
                    <button
                      onClick={() => {
                        closeProfile();
                        openDailyMystery();
                      }}
                      className="text-amber-300 font-bold hover:underline cursor-pointer"
                    >
                      🎁 Daily Mystery Box (Max 10 Coins) →
                    </button>
                  </div>
                </div>
              </div>

              {/* VIP Loyalty Staking & Referral Dual Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Staking Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent border border-amber-300/70 dark:border-amber-700/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 rounded-xl bg-amber-500 text-white">
                        <Coins className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                        Up to 48% APY
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs mt-2">
                      JudesCoins Staking Vault
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Lock coins for 7, 14, or 30 days to earn guaranteed APY yields and free lucky draw tickets.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsStakingModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Open Staking Vault</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Referral Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent border border-blue-300/70 dark:border-blue-700/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 rounded-xl bg-[#0066FF] text-white">
                        <Gift className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                        Give 15%, Get 250
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs mt-2">
                      Customer Referral Studio
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Share your exclusive code <span className="font-mono font-bold text-[#0066FF]">JUDES-EV99</span> to earn 250 coins per friend.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsReferralModalOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Share Referral Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Redemption Hub */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-stone-500">
                  Instant Coin Redemptions
                </h4>

                {/* Perk 1: Lucky Spin */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-amber-500 text-white">
                        <Gift className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-stone-900 text-xs">+1 Lucky Spin Wheel Token</h5>
                        <p className="text-[11px] text-stone-500">Cost: 100 JudesCoins</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Spin the prize wheel for a guaranteed prize: free ANC headphones, up to 50% discount vouchers, or
                    free luxury gifts.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRedeemSpin}
                      disabled={judesCoins < 100}
                      className={cn(
                        'w-full py-2 px-3 rounded-lg text-xs font-bold transition-all',
                        judesCoins >= 100
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs cursor-pointer active:scale-98'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      )}
                    >
                      {judesCoins >= 100 ? 'Redeem for 100 Coins' : 'Need 100 Coins to Redeem'}
                    </button>
                    <Link
                      href="/lucky-draw"
                      onClick={closeProfile}
                      className="py-2 px-3 rounded-lg text-xs font-bold border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors whitespace-nowrap"
                    >
                      Spin Now →
                    </Link>
                  </div>
                </div>

                {/* Perk 2: 25% OFF Code */}
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[#0066FF] text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-stone-900 text-xs">Instant 25% OFF Order Coupon</h5>
                        <p className="text-[11px] text-stone-500">Cost: 500 JudesCoins</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Applies coupon code <strong>LUCKY25</strong> directly to your active cart for 25% off storewide.
                  </p>
                  <button
                    onClick={handleRedeemDiscount}
                    disabled={judesCoins < 500}
                    className={cn(
                      'w-full py-2 px-3 rounded-lg text-xs font-bold transition-all',
                      judesCoins >= 500
                        ? 'bg-[#0066FF] hover:bg-blue-600 text-white shadow-xs cursor-pointer active:scale-98'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    )}
                  >
                    {judesCoins >= 500 ? 'Redeem 500 Coins (25% OFF)' : 'Need 500 Coins to Redeem'}
                  </button>
                </div>
              </div>

              {/* How to Earn */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <h5 className="font-bold text-stone-800 text-xs">How to Earn More JudesCoins:</h5>
                <ul className="space-y-1.5 text-[11px] text-stone-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span><strong>Shop Anything:</strong> Earn 10 Coins for every $1 spent at checkout.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span><strong>Daily Visits:</strong> Check the Lucky Draw wheel every 24 hours.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span><strong>Leave Reviews:</strong> Earn 50 Coins per verified product review.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {user.savedAddresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200 bg-white space-y-1 text-xs text-stone-600"
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-stone-900 font-medium">
                      {addr.firstName} {addr.lastName}
                    </strong>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
                      Default
                    </span>
                  </div>
                  <p>
                    {addr.street} {addr.apartment}
                  </p>
                  <p>
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p>{addr.country}</p>
                  <p className="text-stone-400 pt-1">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <h4 className="font-medium text-stone-900">Customer Account Session</h4>
                <p className="text-stone-500">
                  {isLoggedIn
                    ? `Logged in as ${user.name} (${user.email}).`
                    : 'Currently browsing as guest visitor.'}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {isLoggedIn ? (
                    <button
                      onClick={() => {
                        logoutCustomer();
                        setFeedback({ type: 'success', message: 'You have been signed out successfully.' });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors font-medium flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out of Account</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => openAuthModal('login')}
                        className="px-3 py-1.5 rounded-lg bg-[#0066FF] text-white hover:bg-blue-600 transition-colors font-medium cursor-pointer text-xs"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => openAuthModal('signup')}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-200 transition-colors font-medium cursor-pointer text-xs"
                      >
                        Create Account
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <h4 className="font-medium text-stone-900">JudesCart VIP Support</h4>
                <p className="text-stone-500">
                  Have questions regarding your orders, electronics warranty, or returns? Reach out directly to your 24/7
                  concierge.
                </p>
                <a
                  href="mailto:support@judes-cart.com"
                  className="inline-flex items-center gap-1 text-[#0066FF] font-medium hover:underline"
                >
                  <span>Contact 24/7 VIP Support</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <Link
            href="/wishlist"
            onClick={closeProfile}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Wishlist</span>
          </Link>
          {isLoggedIn ? (
            <button
              onClick={() => {
                logoutCustomer();
                setFeedback({ type: 'success', message: 'Signed out successfully.' });
              }}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1 text-xs text-[#0066FF] hover:underline font-bold transition-colors cursor-pointer"
            >
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Official Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setSelectedInvoiceOrder(null)} aria-hidden="true" />

          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Invoice Header */}
            <div className="p-6 bg-[#0A192F] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Official Receipt</span>
                <h3 className="font-sans text-xl font-extrabold mt-0.5">JudesCart Tax Invoice</h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close invoice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice Details */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-900 text-sm">JudesCart Global Retail Ltd.</p>
                  <p className="text-slate-500">GSTIN: 27AABCJ8421K1Z5 • CIN: U52100MH2023PTC198421</p>
                  <p className="text-slate-500">742 Evergreen Terrace, Suite 400</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">Invoice #{selectedInvoiceOrder.id}</p>
                  <p className="text-slate-500">Date: {selectedInvoiceOrder.date}</p>
                  <p className="font-mono text-[11px] text-[#0066FF] font-semibold">
                    {selectedInvoiceOrder.trackingNumber}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2">Item</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoiceOrder.items.map((it) => (
                    <tr key={it.id}>
                      <td className="py-2.5 font-medium text-slate-800">
                        {it.name}
                        <span className="block text-[10px] text-slate-400">
                          {it.color} • {it.size}
                        </span>
                      </td>
                      <td className="py-2.5 text-center text-slate-600">{it.quantity}</td>
                      <td className="py-2.5 text-right text-slate-600">{formatAmount(it.price)}</td>
                      <td className="py-2.5 text-right font-semibold text-slate-900">
                        {formatAmount(it.price * it.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Financial Totals */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-right">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatAmount(selectedInvoiceOrder.subtotal)}</span>
                </div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-{formatAmount(selectedInvoiceOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping ({selectedInvoiceOrder.shippingMethod?.name || 'Standard'})</span>
                  <span>{selectedInvoiceOrder.shipping === 0 ? 'Complimentary' : formatAmount(selectedInvoiceOrder.shipping)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (8.5%)</span>
                  <span>{formatAmount(selectedInvoiceOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount Paid</span>
                  <span>{formatAmount(selectedInvoiceOrder.total)}</span>
                </div>
              </div>

              {/* Coin Rewards Record */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <span>🪙</span> JudesCoins Earned
                </span>
                <span className="font-mono font-bold text-amber-900">
                  +{selectedInvoiceOrder.coinsEarned || Math.floor((selectedInvoiceOrder.total * 86.5) / 100)} Coins
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP JudesCoins Staking Hub Modal */}
      <JudesCoinsStakingModal
        isOpen={isStakingModalOpen}
        onClose={() => setIsStakingModalOpen(false)}
      />

      {/* Customer Referral Studio Modal */}
      <ReferralStudioModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </div>
  );
}
