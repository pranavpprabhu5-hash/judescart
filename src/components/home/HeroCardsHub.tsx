'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Flame, 
  Calendar, 
  Trophy, 
  Crown, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Bell, 
  BellRing, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Gift,
  Award,
  Zap,
  Tag
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types/product';

export function HeroCardsHub() {
  const { products, formatAmount, addToCart, openLuckyDraw } = useStore();

  // --------------------------------------------------------------------------
  // CARD 1: ITEMS WITH OFFERS
  // --------------------------------------------------------------------------
  // Filter products with real discounts (originalPrice > price)
  const discountedProducts = useMemo(() => {
    const list = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    return list.length > 0 ? list : products.slice(0, 3);
  }, [products]);

  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);

  const activeDeal = discountedProducts[activeDealIndex] || discountedProducts[0];
  const discountPercent = activeDeal?.originalPrice && activeDeal.originalPrice > activeDeal.price
    ? Math.round(((activeDeal.originalPrice - activeDeal.price) / activeDeal.originalPrice) * 100)
    : 20;

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.colors?.[0]?.name || 'Standard';
    const size = product.sizes?.[0]?.name || 'Standard';
    addToCart(product, color, size, 1);
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 2000);
  };

  // --------------------------------------------------------------------------
  // CARD 2: UPCOMING SALE DAYS COUNTDOWN
  // --------------------------------------------------------------------------
  const [reminderActive, setReminderActive] = useState(false);
  const [saleTimeLeft, setSaleTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 38,
    seconds: 42,
  });

  useEffect(() => {
    // Target: 3 days, 14 hours from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(targetDate.getHours() + 14);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        setSaleTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setSaleTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------------------------------
  // CARD 3: LUCKY DRAWS WEEKLY COUNTDOWN
  // --------------------------------------------------------------------------
  const [weeklyDrawDays, setWeeklyDrawDays] = useState({ days: 2, hours: 18, mins: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setWeeklyDrawDays((prev) => {
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59 };
        return prev;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* SECTION HEADER BADGE & TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Curated Homepage Spotlight</span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover JudesCart Campaigns
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Explore today&apos;s hottest price drops, upcoming sale dates, weekly lucky draws, and the signature Brand JUDES bumper jackpot.
        </p>
      </div>

      {/* 4 CARDS DISPLAYED ALL AT ONCE (COMPACT RESPONSIVE SNAP-RAIL ON MOBILE / GRID ON DESKTOP) */}
      <div className="flex md:grid md:grid-cols-2 xl:grid-cols-4 overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 items-stretch pb-2 px-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        
        {/* =========================================================================
            CARD 1: ITEMS WITH OFFERS (Deals Showcase)
            ========================================================================= */}
        <div className="w-[70vw] max-w-[260px] sm:w-[280px] md:w-auto shrink-0 snap-center group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-b from-[#1c0d02] via-[#2a1304] to-[#120701] border border-amber-500/30 shadow-lg shadow-amber-950/20 hover:border-amber-400/60 transition-all duration-300 text-white">
          {/* Subtle Ambient Background Image with Dark Glow */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image
              src={activeDeal?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
              alt="Special Offers"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120701] via-[#120701]/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-2 sm:space-y-2.5 md:space-y-3">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Special Offers</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/90 text-white">
                Save Up To {discountPercent}%
              </span>
            </div>

            <div>
              <h2 className="font-sans text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight">
                Discounted &amp; Flash Deals
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 line-clamp-1">
                Handpicked premium products on immediate discount.
              </p>
            </div>

            {/* Interactive Deal Preview Box */}
            {activeDeal && (
              <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/20">
                    <Image
                      src={activeDeal.images[0]}
                      alt={activeDeal.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded text-[8px] font-black bg-rose-600 text-white leading-none">
                      -{discountPercent}%
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${activeDeal.slug}`}
                      className="text-[11px] font-bold text-white hover:text-amber-300 transition-colors line-clamp-1 block"
                      title={activeDeal.name}
                    >
                      {activeDeal.name}
                    </Link>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-xs font-black text-amber-300">
                        {formatAmount(activeDeal.price)}
                      </span>
                      {activeDeal.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          {formatAmount(activeDeal.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-emerald-300 font-semibold block">
                      In Stock • Ready to Ship
                    </span>
                  </div>
                </div>

                {/* Quick Add To Cart Button */}
                <button
                  onClick={(e) => handleQuickAdd(activeDeal, e)}
                  className={`w-full py-1.5 px-2.5 rounded-md font-bold text-[11px] flex items-center justify-center gap-1 transition-all duration-200 shadow-xs ${
                    addedItemEffect === activeDeal.id
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/30'
                  }`}
                >
                  {addedItemEffect === activeDeal.id ? (
                    <>
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3 h-3" />
                      <span>Quick Add Deal</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Deal Switcher Dots / Controls */}
            {discountedProducts.length > 1 && (
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[9px] text-stone-400 font-medium">
                  Deal {activeDealIndex + 1} of {discountedProducts.length}
                </span>
                <div className="flex items-center gap-1">
                  {discountedProducts.slice(0, 4).map((deal, idx) => (
                    <button
                      key={deal.id}
                      onClick={() => setActiveDealIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        activeDealIndex === idx
                          ? 'w-4 bg-amber-400'
                          : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Show deal ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card Footer CTA */}
          <div className="relative z-10 pt-2.5 mt-2 border-t border-white/10">
            <Link
              href="/products"
              className="group/link flex items-center justify-between text-[11px] font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <span>Explore All Catalog Offers</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: UPCOMING SALE DAYS (Flash & Festival Calendar)
            ========================================================================= */}
        <div className="w-[70vw] max-w-[260px] sm:w-[280px] md:w-auto shrink-0 snap-center group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-b from-[#0a1128] via-[#11193d] to-[#070b1c] border border-indigo-500/30 shadow-lg shadow-indigo-950/20 hover:border-indigo-400/60 transition-all duration-300 text-white">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80"
              alt="Sale Calendar"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b1c] via-[#070b1c]/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-2 sm:space-y-2.5 md:space-y-3">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>Upcoming Sales</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-600/80 text-indigo-100">
                In 3 Days
              </span>
            </div>

            <div>
              <h2 className="font-sans text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight">
                Sale Days &amp; Events
              </h2>
              <p className="text-[11px] sm:text-xs text-indigo-200/80 mt-0.5 line-clamp-1">
                Judes Mega Autumn Bash arriving soon.
              </p>
            </div>

            {/* Live Countdown Clock Blocks */}
            <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[9px] font-extrabold text-indigo-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Autumn Bash Countdown</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
                  <span className="block text-sm font-black text-white leading-none">
                    {String(saleTimeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] text-indigo-200 uppercase font-bold">Days</span>
                </div>
                <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
                  <span className="block text-sm font-black text-white leading-none">
                    {String(saleTimeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] text-indigo-200 uppercase font-bold">Hours</span>
                </div>
                <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
                  <span className="block text-sm font-black text-white leading-none">
                    {String(saleTimeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] text-indigo-200 uppercase font-bold">Mins</span>
                </div>
                <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
                  <span className="block text-sm font-black text-cyan-300 leading-none">
                    {String(saleTimeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[8px] text-indigo-200 uppercase font-bold">Secs</span>
                </div>
              </div>
            </div>

            {/* Upcoming Event Schedule Pill */}
            <div className="p-1.5 rounded-md bg-white/5 border border-white/10 flex items-center justify-between text-[10px]">
              <span className="font-semibold text-slate-200 truncate">Sept 18–22: Mega Autumn Bash</span>
              <span className="font-bold text-amber-300 shrink-0 ml-1">Up to 60%</span>
            </div>

            {/* Interactive Reminder Button */}
            <button
              onClick={() => setReminderActive(!reminderActive)}
              className={`w-full py-1.5 px-2.5 rounded-md font-bold text-[11px] flex items-center justify-center gap-1 transition-all duration-200 shadow-xs ${
                reminderActive
                  ? 'bg-indigo-600 text-white border border-indigo-400'
                  : 'bg-white/15 hover:bg-white/25 text-indigo-200 border border-white/20'
              }`}
            >
              {reminderActive ? (
                <>
                  <BellRing className="w-3 h-3 text-amber-300" />
                  <span>Reminder Set!</span>
                </>
              ) : (
                <>
                  <Bell className="w-3 h-3 text-indigo-300" />
                  <span>Set Sale Alert</span>
                </>
              )}
            </button>
          </div>

          <div className="relative z-10 pt-2.5 mt-2 border-t border-white/10">
            <Link
              href="/products"
              className="group/link flex items-center justify-between text-[11px] font-bold text-indigo-300 hover:text-indigo-200 transition-colors"
            >
              <span>Preview Early-Bird Catalog</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: LUCKY DRAWS (Platinum, Gold & Silver)
            ========================================================================= */}
        <div className="w-[70vw] max-w-[260px] sm:w-[280px] md:w-auto shrink-0 snap-center group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-b from-[#02231c] via-[#04382c] to-[#011c16] border border-emerald-500/30 shadow-lg shadow-emerald-950/20 hover:border-emerald-400/60 transition-all duration-300 text-white">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80"
              alt="Lucky Draws"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#011c16] via-[#011c16]/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-2 sm:space-y-2.5 md:space-y-3">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Weekly Lucky Draws</span>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-600/90 text-white">
                3 Tiers
              </span>
            </div>

            <div>
              <h2 className="font-sans text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight">
                Shop &amp; Win Every Week
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-200/80 mt-0.5 line-clamp-1">
                Receive verified tickets for qualifying orders.
              </p>
            </div>

            {/* 3 Tier Snapshot Cards */}
            <div className="space-y-1.5">
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[9px]">
                    💎
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-white leading-none block">Platinum</span>
                    <span className="text-[9px] text-emerald-200">iPhone 16 Pro &amp; Macs</span>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded">
                  &gt;₹5,000
                </span>
              </div>

              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-[9px]">
                    🥇
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-white leading-none block">Gold</span>
                    <span className="text-[9px] text-emerald-200">Apple Watch &amp; Audio</span>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-blue-300 bg-blue-400/10 px-1.5 py-0.2 rounded">
                  ₹2,500+
                </span>
              </div>

              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[9px]">
                    🥈
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-white leading-none block">Silver</span>
                    <span className="text-[9px] text-emerald-200">AirPods &amp; Raffles</span>
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-cyan-300 bg-cyan-400/10 px-1.5 py-0.2 rounded">
                  ₹1,000+
                </span>
              </div>
            </div>

            {/* Direct Wheel Modal Trigger */}
            <button
              onClick={openLuckyDraw}
              className="w-full py-1.5 px-2.5 rounded-md font-bold text-[11px] flex items-center justify-center gap-1 transition-all duration-200 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xs"
            >
              <Trophy className="w-3 h-3 text-amber-200" />
              <span>Open Prize Wheel</span>
            </button>
          </div>

          <div className="relative z-10 pt-2.5 mt-2 border-t border-white/10">
            <Link
              href="/lucky-draw#regular-draws"
              className="group/link flex items-center justify-between text-[11px] font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              <span>Weekly Draw Rules</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            CARD 4: BUMPER DRAWS (Brand JUDES Exclusive)
            ========================================================================= */}
        <div className="w-[70vw] max-w-[260px] sm:w-[280px] md:w-auto shrink-0 snap-center group relative rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-b from-[#1b0633] via-[#2f0d57] to-[#120324] border border-amber-400/40 shadow-lg shadow-purple-950/30 hover:border-amber-300 transition-all duration-300 text-white">
          <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
              alt="Bumper Draw"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120324] via-[#120324]/80 to-transparent" />
          </div>

          <div className="relative z-10 space-y-2 sm:space-y-2.5 md:space-y-3">
            {/* Header Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/25 border border-amber-400/50 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
                <Crown className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>JUDES Exclusive</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                6–12 Mo
              </span>
            </div>

            <div>
              <h2 className="font-sans text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight">
                Grand Bumper Jackpot
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-200/90 mt-0.5 line-clamp-1">
                Every Brand JUDES product enters automatically.
              </p>
            </div>

            {/* Mega Jackpot Prize Highlights */}
            <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-amber-400/30 space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] text-white">
                <span className="w-5 h-5 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xs shrink-0">
                  🚗
                </span>
                <span className="font-bold text-amber-200 truncate">Luxury SUV &amp; Vehicle</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-white">
                <span className="w-5 h-5 rounded bg-pink-400/20 border border-pink-400/40 flex items-center justify-center text-xs shrink-0">
                  ✈️
                </span>
                <span className="font-bold text-pink-200 truncate">7-Day International Tour</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-white">
                <span className="w-5 h-5 rounded bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-xs shrink-0">
                  💰
                </span>
                <span className="font-bold text-yellow-200 truncate">₹5,00,000 Cash Spree</span>
              </div>
            </div>

            {/* Shop Brand JUDES CTA */}
            <Link
              href="/products?brand=JUDES"
              className="w-full py-1.5 px-2.5 rounded-md font-black text-[11px] flex items-center justify-center gap-1 transition-all duration-200 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-xs"
            >
              <Crown className="w-3 h-3 text-slate-950" />
              <span>Shop Brand JUDES</span>
            </Link>
          </div>

          <div className="relative z-10 pt-2.5 mt-2 border-t border-white/10">
            <Link
              href="/lucky-draw#bumper-draw"
              className="group/link flex items-center justify-between text-[11px] font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <span>View Bumper Draw Rules</span>
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

      {/* Mobile Horizontal Swipe Indicator */}
      <div className="md:hidden flex items-center justify-between pt-3 text-[11px] text-stone-500 dark:text-stone-400 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3 h-3 text-[#0066FF]" />
          <span>Swipe cards to explore all campaigns</span>
        </span>
        <div className="flex items-center gap-1">
          <span className="w-4 h-1.5 rounded-full bg-[#0066FF]" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        </div>
      </div>
    </section>
  );
}
