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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function ProfileDrawer() {
  const {
    isProfileOpen,
    closeProfile,
    user,
    isLoggedIn,
    toggleLogin,
    formatAmount,
    judesCoins,
    redeemCoinsForSpin,
    redeemCoinsForDiscount,
  } = useStore();

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
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md">
                  VIP
                </span>
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

        {/* JudesCoins Quick Bar */}
        <div className="px-5 py-2.5 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-amber-100 flex items-center justify-between">
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
          <button
            onClick={() => setActiveTab('rewards')}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1"
          >
            <span>Rewards Hub</span>
            <ArrowRight className="w-3 h-3" />
          </button>
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

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                      <span>Ordered {order.date}</span>
                      <span className="font-semibold text-stone-900">Total: {formatAmount(order.total)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 text-[11px] text-stone-600 border-t border-stone-100">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#0066FF]" />
                        <span>
                          Tracking: <strong className="font-mono text-slate-800">{order.trackingNumber}</strong>
                        </span>
                      </div>
                      <Link
                        href={`/checkout/success?orderId=${order.id}`}
                        onClick={closeProfile}
                        className="text-[11px] font-bold text-[#0066FF] hover:underline"
                      >
                        Track Live Radar →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4 text-xs">
              {/* Gold VIP Pass Card */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg overflow-hidden">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-extrabold text-amber-200 bg-black/20 px-2 py-0.5 rounded-full">
                      VIP Gold Rewards Pass
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                  </div>

                  <div>
                    <span className="text-xs text-amber-100 font-medium">Available Balance</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-black tracking-tight">{judesCoins.toLocaleString()}</span>
                      <span className="text-sm font-bold text-amber-200">Coins</span>
                    </div>
                    <p className="text-[11px] text-amber-100/90 mt-1">
                      Approx. value ${(judesCoins / 20).toFixed(2)} USD in store credits & spins
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] text-amber-100 font-medium">
                    <span>Earning Rate: 10 Coins / $1</span>
                    <span className="font-bold text-white">Tier: Platinum VIP</span>
                  </div>
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
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#0A192F]">Store Administration</h4>
                  <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Executive
                  </span>
                </div>
                <p className="text-stone-500">
                  Access the live inventory management, order fulfillment radar, lucky draw odds, and promo code generator.
                </p>
                <Link
                  href="/admin"
                  onClick={closeProfile}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#0066FF] hover:bg-blue-600 text-white font-bold transition-all shadow-xs"
                >
                  <span>Open Admin Command Center</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <h4 className="font-medium text-stone-900">Simulated Account Session</h4>
                <p className="text-stone-500">
                  You are currently logged in as a verified VIP client. You can toggle between guest and registered mode
                  to test checkout flows.
                </p>
                <button
                  onClick={toggleLogin}
                  className="mt-2 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-200 transition-colors font-medium"
                >
                  {isLoggedIn ? 'Switch to Guest Mode' : 'Log in as Eleanor Sterling'}
                </button>
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
          <button
            onClick={toggleLogin}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>{isLoggedIn ? 'Sign Out' : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
