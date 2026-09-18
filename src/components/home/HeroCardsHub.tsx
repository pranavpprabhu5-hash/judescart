'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  Calendar,
  Headphones,
  Shirt,
  ArrowRight,
  ShoppingBag,
  Check,
  Bell,
  BellRing,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Tag,
  Copy,
  Pause,
  Play,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface OfferCampaign {
  id: 'flash-deals' | 'autumn-sale' | 'tech-blowout' | 'luxury-fashion';
  label: string;
  shortLabel: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  borderClass: string;
  glowClass: string;
}

const RUNNING_OFFERS: OfferCampaign[] = [
  {
    id: 'flash-deals',
    label: 'Flash Deals',
    shortLabel: 'Flash Deals',
    tagline: 'Up to 35% OFF Today',
    badge: '⚡ Limited Time Drops',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    icon: Flame,
    accentColor: 'text-amber-400',
    bgGradient: 'from-[#1c0c02] via-[#2d1205] to-[#120501]',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(245,158,11,0.25)]',
  },
  {
    id: 'autumn-sale',
    label: 'Autumn Mega Sale',
    shortLabel: 'Mega Sale',
    tagline: 'Up to 60% Storewide',
    badge: '🍂 Live Event Countdown',
    badgeColor: 'bg-indigo-500/20 text-cyan-300 border-indigo-400/40',
    icon: Calendar,
    accentColor: 'text-cyan-400',
    bgGradient: 'from-[#0a122e] via-[#142259] to-[#060b1c]',
    borderClass: 'border-indigo-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(99,102,241,0.25)]',
  },
  {
    id: 'tech-blowout',
    label: 'Tech Blowout',
    shortLabel: 'Tech Sale',
    tagline: 'Extra 15% OFF Audio & Gear',
    badge: '🎧 Electronics Event',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    icon: Headphones,
    accentColor: 'text-blue-400',
    bgGradient: 'from-[#07132e] via-[#0d2254] to-[#040b1a]',
    borderClass: 'border-blue-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(59,130,246,0.25)]',
  },
  {
    id: 'luxury-fashion',
    label: 'Fashion & Leather',
    shortLabel: 'Fashion',
    tagline: 'Save Up to 50% Off',
    badge: '✨ Handcrafted Luxury',
    badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    icon: Shirt,
    accentColor: 'text-amber-300',
    bgGradient: 'from-[#1c1007] via-[#2d1b0c] to-[#120904]',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(217,119,6,0.25)]',
  },
];

const AUTO_ROTATE_INTERVAL = 6500; // 6.5 seconds per slide

export function HeroCardsHub() {
  const { products, formatAmount, applyPromo } = useStore();

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // OFFER 1: Flash Deals (Curated discounted items)
  // --------------------------------------------------------------------------
  const discountedProducts = useMemo(() => {
    const list = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    return list.length > 0 ? list : products.slice(0, 4);
  }, [products]);

  const firstDeal = discountedProducts[0];
  const secondDeal = discountedProducts[1] || discountedProducts[0];

  // --------------------------------------------------------------------------
  // OFFER 2: Autumn Mega Sale Countdown
  // --------------------------------------------------------------------------
  const [reminderActive, setReminderActive] = useState(false);
  const [saleTimeLeft, setSaleTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 38,
    seconds: 42,
  });

  useEffect(() => {
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
  // OFFER 3 & 4 Products
  // --------------------------------------------------------------------------
  const electronicsDeal = useMemo(() => {
    return products.find((p) => p.category === 'electronics') || products[0];
  }, [products]);

  const fashionDeal = useMemo(() => {
    return products.find((p) => p.category === 'apparel' || p.category === 'leather-goods') || products[1];
  }, [products]);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
    } catch {}
    applyPromo(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // --------------------------------------------------------------------------
  // Navigation & Autoplay
  // --------------------------------------------------------------------------
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % RUNNING_OFFERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + RUNNING_OFFERS.length) % RUNNING_OFFERS.length);
  }, []);

  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  // Touch Swipe Gesture Handlers
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const currentOffer = RUNNING_OFFERS[activeSlide];

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Offers Banner"
      className={`group/slider relative w-full overflow-hidden text-white transition-all duration-500 select-none border-b ${currentOffer.borderClass} ${currentOffer.glowClass}`}
    >
      {/* Dynamic Background Gradient (Full Bleed End-to-End) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentOffer.bgGradient} transition-colors duration-700 ease-in-out`}
      />

      {/* Ambient Radial Lighting Overlays */}
      <div className="absolute -top-28 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-20 w-96 h-96 bg-black/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* FLOATING SIDE NAVIGATION ARROWS (Floating at viewport edges) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 sm:bg-slate-950/60 sm:hover:bg-slate-900/90 backdrop-blur-md border border-white/25 hover:border-white/60 text-white flex items-center justify-center shadow-xl shadow-black/40 transition-all duration-300 ease-out hover:scale-125 active:scale-95 cursor-pointer opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:!opacity-100 group/btn"
        aria-label="Previous offer slide"
        title="Previous offer"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 sm:bg-slate-950/60 sm:hover:bg-slate-900/90 backdrop-blur-md border border-white/25 hover:border-white/60 text-white flex items-center justify-center shadow-xl shadow-black/40 transition-all duration-300 ease-out hover:scale-125 active:scale-95 cursor-pointer opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:!opacity-100 group/btn"
        aria-label="Next offer slide"
        title="Next offer"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
      </button>

      {/* Hero Slide Contents - Centered inside max-w-7xl with side padding */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-12 lg:px-14 py-3.5 sm:py-6 lg:py-7 min-h-[340px] sm:min-h-[520px] lg:min-h-[485px] lg:h-[495px] flex flex-col justify-between">
          {/* Top Info Bar inside Hero */}
          <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider backdrop-blur-md border ${currentOffer.badgeColor}`}
              >
                {React.createElement(currentOffer.icon, {
                  className: 'w-3 h-3 sm:w-3.5 sm:h-3.5 text-current animate-pulse',
                })}
                <span>{currentOffer.badge}</span>
              </div>
            </div>

            {/* Auto-rotation pause/play toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all active:scale-90 cursor-pointer"
              title={isPlaying ? 'Pause auto-rotation' : 'Resume auto-rotation'}
              aria-label={isPlaying ? 'Pause auto-rotation' : 'Resume auto-rotation'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>

          {/* MAIN SLIDE BODY: TWO COLUMNS (Content & Interactive Widget vs Visual Media) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1">
            {/* =========================================================================
                SLIDE 0: FLASH DEALS (Immediate Discounts)
                ========================================================================= */}
            {activeSlide === 0 && (
              <>
                <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 min-h-[220px] sm:min-h-[250px] lg:h-[385px] flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400 mb-0.5 sm:mb-1 h-4 sm:h-5">
                      <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 animate-pulse shrink-0" />
                      <span className="truncate">Flash Price Drops • Live Today</span>
                    </div>
                    <div className="h-[2.5rem] sm:h-[3.75rem] lg:h-[4.5rem] flex items-center">
                      <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug line-clamp-2">
                        Flash Deals &amp; Daily Price Reductions
                      </h1>
                    </div>
                    <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-stone-300 mt-1.5 sm:mt-2 leading-relaxed max-w-xl line-clamp-2 h-[2.5rem] sm:h-[2.75rem] lg:h-[3rem]">
                      Grab immediate manufacturer discounts on high-demand electronics, apparel, and lifestyle items.
                      Stock is strictly limited with real-time stock reservations.
                    </p>
                  </div>

                  {/* Flash Deals Highlights (Standardized 2-card grid) */}
                  <div className="grid grid-cols-2 gap-2 max-w-lg">
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                        {firstDeal?.name || 'SonicPro Studio ANC'}
                      </span>
                      <span className="text-[9px] sm:text-[11px] text-amber-200 block truncate">
                        ⚡ Instant Flash Drop
                      </span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">
                        {firstDeal ? formatAmount(firstDeal.price) : '$299.00'} (Save {firstDeal?.originalPrice ? formatAmount(firstDeal.originalPrice - firstDeal.price) : '$50'})
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                        {secondDeal?.name || 'HydroSmart Vacuum Flask'}
                      </span>
                      <span className="text-[9px] sm:text-[11px] text-amber-200 block truncate">
                        ⚡ Limited Reserve
                      </span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">
                        {secondDeal ? formatAmount(secondDeal.price) : '$39.00'} (Save {secondDeal?.originalPrice ? formatAmount(secondDeal.originalPrice - secondDeal.price) : '$20'})
                      </span>
                    </div>
                  </div>

                  {/* Coupon Pill */}
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-950/60 border border-amber-400/30 flex items-center justify-between max-w-lg h-[44px] sm:h-[50px]">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                      <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block truncate">CODE: FLASH35</span>
                        <span className="text-[8px] sm:text-[9px] text-amber-200 block truncate">Up to 35% off flash catalog items</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode('FLASH35')}
                      className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-md text-[9px] sm:text-[10px] font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                    >
                      {copiedCode === 'FLASH35' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'FLASH35' ? 'Applied!' : 'Apply'}</span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                    <Link
                      href="/products"
                      className="h-8 sm:h-10 px-3.5 sm:px-5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                      <span>Shop Flash Deals</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                    </Link>

                    <Link
                      href="/products"
                      className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
                    >
                      <span>Explore Catalog</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side Visual (Tablet & Desktop) */}
                <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[385px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
                  <Image
                    src={firstDeal?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85'}
                    alt="Flash Deals Spotlight"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#110501] via-[#110501]/40 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold shadow-md">
                    Up to 35% OFF
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">24-Hour Flash Guarantee</span>
                    <span className="font-bold text-amber-300">Live Today</span>
                  </div>
                </div>
              </>
            )}

            {/* =========================================================================
                SLIDE 1: AUTUMN MEGA SALE (Storewide Savings)
                ========================================================================= */}
            {activeSlide === 1 && (
              <>
                <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 min-h-[220px] sm:min-h-[250px] lg:h-[385px] flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-300 mb-0.5 sm:mb-1 h-4 sm:h-5">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">Autumn Mega Event • Starts in 3 Days</span>
                    </div>
                    <div className="h-[2.5rem] sm:h-[3.75rem] lg:h-[4.5rem] flex items-center">
                      <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug line-clamp-2">
                        Autumn Mega Sale &amp; Seasonal Storewide Clearance
                      </h1>
                    </div>
                    <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-indigo-100/90 mt-1.5 sm:mt-2 leading-relaxed max-w-xl line-clamp-2 h-[2.5rem] sm:h-[2.75rem] lg:h-[3rem]">
                      Save up to 60% storewide across all 6 departments. Lock in VIP early access and claim an extra 20%
                      off coupon code right now.
                    </p>
                  </div>

                  {/* Mega Sale Highlights (Standardized 2-card grid with live timer) */}
                  <div className="grid grid-cols-2 gap-2 max-w-lg">
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-indigo-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">Storewide Catalog</span>
                      <span className="text-[9px] sm:text-[11px] text-indigo-200 block truncate">All 6 Departments</span>
                      <span className="text-[11px] sm:text-xs font-black text-cyan-300 block pt-0.5 truncate">Up to 60% OFF</span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-indigo-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">Event Starts In</span>
                      <span className="text-[9px] sm:text-[11px] text-indigo-200 block truncate">September 21 Launch</span>
                      <span className="text-[11px] sm:text-xs font-black text-cyan-300 font-mono block pt-0.5 truncate">
                        {saleTimeLeft.days}d {saleTimeLeft.hours}h {saleTimeLeft.minutes}m {saleTimeLeft.seconds}s
                      </span>
                    </div>
                  </div>

                  {/* Coupon Pill */}
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-indigo-950/60 border border-indigo-400/30 flex items-center justify-between max-w-lg h-[44px] sm:h-[50px]">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                      <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block truncate">CODE: JUDES20</span>
                        <span className="text-[8px] sm:text-[9px] text-indigo-200 block truncate">20% off all department selections</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode('JUDES20')}
                      className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-md text-[9px] sm:text-[10px] font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                    >
                      {copiedCode === 'JUDES20' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'JUDES20' ? 'Applied!' : 'Apply'}</span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                    <Link
                      href="/products"
                      className="h-8 sm:h-10 px-3.5 sm:px-5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600 hover:brightness-110 text-white shadow-md shadow-indigo-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span>Shop Mega Sale</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                    </Link>

                    <button
                      onClick={() => setReminderActive(!reminderActive)}
                      className={`h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 cursor-pointer ${
                        reminderActive
                          ? 'bg-indigo-600 text-white border border-indigo-400'
                          : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
                      }`}
                    >
                      {reminderActive ? (
                        <>
                          <BellRing className="w-3.5 h-3.5 text-amber-300" />
                          <span>Alert Set!</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5 text-indigo-200" />
                          <span>Set Reminder</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Side Visual (Tablet & Desktop) */}
                <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[385px] rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=85"
                    alt="Upcoming Mega Autumn Bash Sale"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/50 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-extrabold shadow-md">
                    Upcoming Super Event
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">5-Day Massive Event</span>
                    <span className="font-bold text-cyan-300">September 21 Launch</span>
                  </div>
                </div>
              </>
            )}

            {/* =========================================================================
                SLIDE 2: ELECTRONICS & TECH BLOWOUT
                ========================================================================= */}
            {activeSlide === 2 && (
              <>
                <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 min-h-[220px] sm:min-h-[250px] lg:h-[385px] flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-400 mb-0.5 sm:mb-1 h-4 sm:h-5">
                      <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">Tech Gear Blowout • Extra 15% OFF</span>
                    </div>
                    <div className="h-[2.5rem] sm:h-[3.75rem] lg:h-[4.5rem] flex items-center">
                      <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug line-clamp-2">
                        Electronics &amp; Audio Super Sale Top Gear Slashed
                      </h1>
                    </div>
                    <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-blue-100/85 mt-1.5 sm:mt-2 leading-relaxed max-w-xl line-clamp-2 h-[2.5rem] sm:h-[2.75rem] lg:h-[3rem]">
                      Upgrade your daily soundstage and productivity setup. Save big on active noise cancelling studio
                      headphones, smart watches, portable speakers, and ambient lighting.
                    </p>
                  </div>

                  {/* Tech Offer Highlights (Standardized 2-card grid) */}
                  <div className="grid grid-cols-2 gap-2 max-w-lg">
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-blue-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">SonicPro Studio ANC</span>
                      <span className="text-[9px] sm:text-[11px] text-blue-200 block truncate">40h Battery • Spatial</span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">$299.00 (Save $50)</span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-blue-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">ProTrack Ultra GPS</span>
                      <span className="text-[9px] sm:text-[11px] text-blue-200 block truncate">AMOLED • Titanium</span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">$399.00 (Save $50)</span>
                    </div>
                  </div>

                  {/* Coupon Pill */}
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-950/60 border border-blue-400/30 flex items-center justify-between max-w-lg h-[44px] sm:h-[50px]">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                      <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block truncate">CODE: TECHBONUS</span>
                        <span className="text-[8px] sm:text-[9px] text-blue-200 block truncate">Extra 15% off electronics</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode('TECHBONUS')}
                      className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-md text-[9px] sm:text-[10px] font-bold bg-blue-500 hover:bg-blue-400 text-white transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                    >
                      {copiedCode === 'TECHBONUS' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'TECHBONUS' ? 'Applied!' : 'Apply'}</span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                    <Link
                      href="/products?category=electronics"
                      className="h-8 sm:h-10 px-3.5 sm:px-5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:brightness-110 text-white shadow-md shadow-blue-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span>Shop Electronics</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                    </Link>

                    <Link
                      href="/products"
                      className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
                    >
                      <span>All Categories</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side Visual (Tablet & Desktop) */}
                <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[385px] rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl group">
                  <Image
                    src={electronicsDeal?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85'}
                    alt="Electronics & Tech Deals"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040b1a] via-[#040b1a]/50 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-md">
                    Tech Category Special
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">100% Genuine Guaranteed</span>
                    <span className="font-bold text-cyan-300">Free Express Delivery</span>
                  </div>
                </div>
              </>
            )}

            {/* =========================================================================
                SLIDE 3: LUXURY APPAREL & LEATHER STEALS
                ========================================================================= */}
            {activeSlide === 3 && (
              <>
                <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 min-h-[220px] sm:min-h-[250px] lg:h-[385px] flex flex-col justify-between">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 mb-0.5 sm:mb-1 h-4 sm:h-5">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Luxury Italian Goods • Up to 50% OFF</span>
                    </div>
                    <div className="h-[2.5rem] sm:h-[3.75rem] lg:h-[4.5rem] flex items-center">
                      <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug line-clamp-2">
                        Designer Apparel &amp; Italian Leather Clearance
                      </h1>
                    </div>
                    <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-amber-100/85 mt-1.5 sm:mt-2 leading-relaxed max-w-xl line-clamp-2 h-[2.5rem] sm:h-[2.75rem] lg:h-[3rem]">
                      Indulge in artisanal full-grain leather bags, pure cashmere outerwear, and tailored footwear.
                      Premium craftsmanship backed by complimentary worldwide delivery over $99.
                    </p>
                  </div>

                  {/* Fashion Offer Highlights (Standardized 2-card grid) */}
                  <div className="grid grid-cols-2 gap-2 max-w-lg">
                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">Heritage Weekender</span>
                      <span className="text-[9px] sm:text-[11px] text-amber-200/80 block truncate">Tuscan Cowhide</span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">$395.00 (Save $85)</span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">Cashmere Overcoat</span>
                      <span className="text-[9px] sm:text-[11px] text-amber-200/80 block truncate">Italian Wool</span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">$595.00 (Save $105)</span>
                    </div>
                  </div>

                  {/* Coupon Pill */}
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-950/60 border border-amber-400/30 flex items-center justify-between max-w-lg h-[44px] sm:h-[50px]">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                      <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block truncate">CODE: SAVE50</span>
                        <span className="text-[8px] sm:text-[9px] text-amber-200 block truncate">$50 off cart over $250</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode('SAVE50')}
                      className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-md text-[9px] sm:text-[10px] font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                    >
                      {copiedCode === 'SAVE50' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'SAVE50' ? 'Applied!' : 'Apply'}</span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                    <Link
                      href="/products?category=apparel"
                      className="h-8 sm:h-10 px-3.5 sm:px-5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                      <span>Shop Fashion</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                    </Link>

                    <Link
                      href="/products?category=leather-goods"
                      className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-amber-400/30 text-amber-200 hover:text-white transition-all active:scale-95"
                    >
                      <span>Leather Goods</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side Visual (Tablet & Desktop) */}
                <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[385px] rounded-2xl overflow-hidden border border-amber-400/30 shadow-2xl group">
                  <Image
                    src={fashionDeal?.images[0] || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85'}
                    alt="Luxury Fashion & Leather Collection"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120904] via-[#120904]/50 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-md">
                    Up to 50% OFF
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Handcrafted Artisanal Leather</span>
                    <span className="font-bold text-amber-300">Free 30-Day Returns</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Pagination Indicator Pills */}
          <div className="flex items-center justify-center gap-2 pt-2.5 sm:pt-3 pb-0.5">
            {RUNNING_OFFERS.map((offer, idx) => (
              <button
                key={offer.id}
                onClick={() => setActiveSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeSlide === idx
                    ? 'w-7 sm:w-8 h-1.5 bg-white shadow-xs'
                    : 'w-2 h-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}: ${offer.label}`}
                title={offer.label}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }
