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
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Tag,
  Copy,
  Pause,
  Play,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types/product';

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
  const { products, formatAmount, addToCart, applyPromo } = useStore();

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

  const [activeDealIndex, setActiveDealIndex] = useState(0);
  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);

  const activeDeal = discountedProducts[activeDealIndex] || discountedProducts[0];
  const discountPercent =
    activeDeal?.originalPrice && activeDeal.originalPrice > activeDeal.price
      ? Math.round(((activeDeal.originalPrice - activeDeal.price) / activeDeal.originalPrice) * 100)
      : 20;

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.colors?.[0]?.name || 'Standard';
    const size = product.sizes?.[0]?.name || 'Standard';
    addToCart(product, color, size, 1);
    setAddedItemEffect(product.id);
    setTimeout(() => setAddedItemEffect(null), 2200);
  };

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

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

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
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-2.5 mb-2 sm:mb-5">
        <div>
          <h1 className="font-sans text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Running Offers &amp; Price Drops
          </h1>
        </div>
        <p className="hidden sm:block text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Take advantage of limited-time seasonal savings, instant catalog discounts, and exclusive department coupon codes.
        </p>
      </div>



      {/* =========================================================================
          2. FULL-WIDTH IMMERSIVE RUNNING OFFERS STAGE
          ========================================================================= */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`group/slider relative w-full rounded-2xl sm:rounded-3xl overflow-hidden text-white transition-all duration-500 select-none border ${currentOffer.borderClass} ${currentOffer.glowClass}`}
      >
        {/* Dynamic Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentOffer.bgGradient} transition-colors duration-700 ease-in-out`}
        />

        {/* Ambient Radial Lighting Overlays */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/40 rounded-full blur-3xl pointer-events-none" />

        {/* FLOATING SIDE NAVIGATION ARROWS (Zoom-in on Hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-1.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 sm:bg-slate-950/60 sm:hover:bg-slate-900/90 backdrop-blur-md border border-white/25 hover:border-white/60 text-white flex items-center justify-center shadow-xl shadow-black/40 transition-all duration-300 ease-out hover:scale-125 active:scale-95 cursor-pointer opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:!opacity-100 group/btn"
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
          className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 sm:bg-slate-950/60 sm:hover:bg-slate-900/90 backdrop-blur-md border border-white/25 hover:border-white/60 text-white flex items-center justify-center shadow-xl shadow-black/40 transition-all duration-300 ease-out hover:scale-125 active:scale-95 cursor-pointer opacity-80 sm:opacity-0 sm:group-hover/slider:opacity-100 hover:!opacity-100 group/btn"
          aria-label="Next offer slide"
          title="Next offer"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </button>

        {/* Hero Slide Contents */}
        <div className="relative z-10 px-4 sm:px-12 lg:px-12 py-2.5 sm:py-6 min-h-0 sm:min-h-[410px] flex flex-col justify-between">
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
                <div className="lg:col-span-7 space-y-2 sm:space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400 mb-0.5 sm:mb-1">
                      <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 animate-pulse" />
                      <span>Immediate Price Drops • Live Today</span>
                    </div>
                    <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                      Flash Deals &amp; Daily Price Reductions
                    </h2>
                    <p className="hidden sm:block text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed max-w-xl">
                      Grab immediate manufacturer discounts on high-demand electronics, apparel, and lifestyle items.
                      Stock is strictly limited with real-time stock reservations.
                    </p>
                  </div>

                  {/* Interactive Active Deal Card */}
                  {activeDeal && (
                    <div className="p-2 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="relative w-11 h-11 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/20">
                          <Image
                            src={activeDeal.images[0]}
                            alt={activeDeal.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-1 left-1 px-1 sm:px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-black bg-rose-600 text-white leading-none">
                            -{discountPercent}%
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${activeDeal.slug}`}
                            className="text-xs sm:text-sm font-bold text-white hover:text-amber-300 transition-colors line-clamp-1 block"
                          >
                            {activeDeal.name}
                          </Link>
                          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                            <span className="text-xs sm:text-base font-black text-amber-300">
                              {formatAmount(activeDeal.price)}
                            </span>
                            {activeDeal.originalPrice && (
                              <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                                {formatAmount(activeDeal.originalPrice)}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-emerald-300 font-semibold block truncate">
                            ✓ Ready to Dispatch • Free Shipping
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleQuickAdd(activeDeal, e)}
                          className={`flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                            addedItemEffect === activeDeal.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-98 shadow-xs'
                          }`}
                        >
                          {addedItemEffect === activeDeal.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>Quick Add Deal</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/products/${activeDeal.slug}`}
                          className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                        >
                          Details
                        </Link>
                      </div>

                      {/* Deal Selector Dots */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <span className="text-[10px] text-stone-400">
                          Deal {activeDealIndex + 1} of {discountedProducts.length}
                        </span>
                        <div className="flex items-center gap-1">
                          {discountedProducts.slice(0, 4).map((_, dIdx) => (
                            <button
                              key={dIdx}
                              onClick={() => setActiveDealIndex(dIdx)}
                              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                                activeDealIndex === dIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/30 hover:bg-white/60'
                              }`}
                              aria-label={`Show deal ${dIdx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-1">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      <span>Explore All Discounted Catalog Products</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Right Side Visual (Tablet & Desktop) */}
                <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[300px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl group">
                  <Image
                    src={activeDeal?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85'}
                    alt="Flash Deals Spotlight"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#110501] via-[#110501]/40 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold shadow-md">
                    Up to {discountPercent}% OFF
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
                <div className="lg:col-span-7 space-y-2 sm:space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-300 mb-0.5 sm:mb-1">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                      <span>Autumn Season Kickoff • Starts in 3 Days</span>
                    </div>
                    <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                      Autumn Mega Sale Event
                    </h2>
                    <p className="hidden sm:block text-xs sm:text-sm text-indigo-100/90 mt-2 leading-relaxed max-w-xl">
                      Save up to 60% storewide across all 6 departments. Lock in VIP early access and claim an extra 20%
                      off coupon code right now.
                    </p>
                  </div>

                  {/* Countdown Timer Widget */}
                  <div className="p-2.5 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-indigo-200">
                      <span className="font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                        Sale Starts In:
                      </span>
                      <span className="font-semibold text-cyan-300">September 21, 10:00 AM EST</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 sm:gap-3 text-center">
                      <div className="bg-black/50 rounded-lg sm:rounded-xl p-1 sm:p-2 border border-indigo-400/30">
                        <span className="block text-base sm:text-2xl font-black text-white leading-none">
                          {String(saleTimeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-indigo-200 uppercase font-bold mt-0.5 sm:mt-1 block">Days</span>
                      </div>
                      <div className="bg-black/50 rounded-lg sm:rounded-xl p-1 sm:p-2 border border-indigo-400/30">
                        <span className="block text-base sm:text-2xl font-black text-white leading-none">
                          {String(saleTimeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-indigo-200 uppercase font-bold mt-0.5 sm:mt-1 block">Hours</span>
                      </div>
                      <div className="bg-black/50 rounded-lg sm:rounded-xl p-1 sm:p-2 border border-indigo-400/30">
                        <span className="block text-base sm:text-2xl font-black text-white leading-none">
                          {String(saleTimeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-indigo-200 uppercase font-bold mt-0.5 sm:mt-1 block">Mins</span>
                      </div>
                      <div className="bg-black/50 rounded-lg sm:rounded-xl p-1 sm:p-2 border border-indigo-400/30">
                        <span className="block text-base sm:text-2xl font-black text-cyan-300 leading-none">
                          {String(saleTimeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[8px] sm:text-[9px] text-indigo-200 uppercase font-bold mt-0.5 sm:mt-1 block">Secs</span>
                      </div>
                    </div>

                    {/* Coupon Pill with One-Click Copy */}
                    <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-950/60 border border-indigo-400/30 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                        <div>
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block">CODE: JUDES20</span>
                          <span className="text-[8px] sm:text-[9px] text-indigo-200">20% off all department selections</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyCode('JUDES20')}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode === 'JUDES20' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode === 'JUDES20' ? 'Applied!' : 'Apply'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5 sm:pt-1">
                      <button
                        onClick={() => setReminderActive(!reminderActive)}
                        className={`flex-1 py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          reminderActive
                            ? 'bg-indigo-600 text-white border border-indigo-400'
                            : 'bg-white/20 hover:bg-white/30 text-white border border-white/20 active:scale-98'
                        }`}
                      >
                        {reminderActive ? (
                          <>
                            <BellRing className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                            <span>Alert Set!</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-200" />
                            <span>Set Reminder</span>
                          </>
                        )}
                      </button>

                      <Link
                        href="/products"
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Side Visual (Tablet & Desktop) */}
                <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[300px] rounded-2xl overflow-hidden border border-indigo-500/30 shadow-xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=85"
                    alt="Upcoming Mega Autumn Bash Sale"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/50 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-extrabold shadow-md">
                    Upcoming Super Event
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">5-Day Massive Event</span>
                    <span className="font-bold text-cyan-300">September 18 Launch</span>
                  </div>
                </div>
              </>
            )}

            {/* =========================================================================
                SLIDE 2: ELECTRONICS & TECH BLOWOUT
                ========================================================================= */}
            {activeSlide === 2 && (
              <>
                <div className="lg:col-span-7 space-y-2 sm:space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-400 mb-0.5 sm:mb-1">
                      <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                      <span>Audio &amp; Smart Tech Clearance • Extra 15% OFF</span>
                    </div>
                    <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                      Electronics &amp; Audio Super Sale{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-200 to-indigo-300">
                        Top Gear Slashed
                      </span>
                    </h2>
                    <p className="hidden sm:block text-xs sm:text-sm text-blue-100/85 mt-2 leading-relaxed max-w-xl">
                      Upgrade your daily soundstage and productivity setup. Save big on active noise cancelling studio
                      headphones, smart watches, portable speakers, and ambient lighting.
                    </p>
                  </div>

                  {/* Tech Offer Highlights */}
                  <div className="grid grid-cols-2 gap-2 max-w-lg">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-blue-400/20 space-y-0.5 sm:space-y-1">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">SonicPro Studio ANC</span>
                      <span className="text-[9px] sm:text-[11px] text-blue-200 block truncate">40h Battery • Spatial</span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5">$299.00 (Save $50)</span>
                    </div>

                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-blue-400/20 space-y-0.5 sm:space-y-1">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">ProTrack Ultra GPS</span>
                      <span className="text-[9px] sm:text-[11px] text-blue-200 block truncate">AMOLED • Titanium</span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5">$399.00 (Save $50)</span>
                    </div>
                  </div>

                  {/* Coupon Pill */}
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-950/60 border border-blue-400/30 flex items-center justify-between max-w-lg">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-300" />
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block">CODE: TECHBONUS</span>
                        <span className="text-[8px] sm:text-[9px] text-blue-200">Extra 15% off electronics</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode('TECHBONUS')}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold bg-blue-500 hover:bg-blue-400 text-white transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === 'TECHBONUS' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'TECHBONUS' ? 'Applied!' : 'Apply'}</span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                    <Link
                      href="/products?category=electronics"
                      className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:brightness-110 text-white shadow-md shadow-blue-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span>Shop Electronics</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                    </Link>

                    <Link
                      href="/products"
                      className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
                    >
                      <span>All Categories</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side Visual (Tablet & Desktop) */}
                <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[300px] rounded-2xl overflow-hidden border border-blue-500/30 shadow-xl group">
                  <Image
                    src={electronicsDeal?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85'}
                    alt="Electronics & Tech Deals"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040b1a] via-[#040b1a]/50 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-md">
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
                <div className="lg:col-span-7 space-y-2 sm:space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 mb-0.5 sm:mb-1">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                      <span>Apparel, Leather &amp; Footwear • Up to 50% Off</span>
                    </div>
                    <h2 className="text-base sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                      Designer Apparel &amp; Italian Leather Clearance
                    </h2>
                    <p className="hidden sm:block text-xs sm:text-sm text-amber-100/85 mt-2 leading-relaxed max-w-xl">
                      Indulge in artisanal full-grain leather bags, pure cashmere outerwear, and tailored footwear.
                      Premium craftsmanship backed by complimentary worldwide delivery over $99.
                    </p>
                  </div>

                  {/* Fashion Offer Highlights */}
                  <div className="grid grid-cols-2 gap-2 max-w-lg">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 sm:space-y-1">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">Heritage Weekender</span>
                      <span className="text-[9px] sm:text-[11px] text-amber-200/80 block truncate">Tuscan Cowhide</span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5">$395.00 (Save $85)</span>
                    </div>

                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 sm:space-y-1">
                      <span className="text-[11px] sm:text-xs font-bold text-white block truncate">Cashmere Overcoat</span>
                      <span className="text-[9px] sm:text-[11px] text-amber-200/80 block truncate">Italian Wool</span>
                      <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5">$595.00 (Save $105)</span>
                    </div>
                  </div>

                  {/* Coupon Pill */}
                  <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-950/60 border border-amber-400/30 flex items-center justify-between max-w-lg">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block">CODE: SAVE50</span>
                        <span className="text-[8px] sm:text-[9px] text-amber-200">$50 off cart over $250</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode('SAVE50')}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === 'SAVE50' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCode === 'SAVE50' ? 'Applied!' : 'Apply'}</span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                    <Link
                      href="/products?category=apparel"
                      className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <Shirt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                      <span>Shop Fashion</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                    </Link>

                    <Link
                      href="/products?category=leather-goods"
                      className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-amber-400/30 text-amber-200 hover:text-white transition-all active:scale-95"
                    >
                      <span>Leather Goods</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side Visual (Tablet & Desktop) */}
                <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[300px] rounded-2xl overflow-hidden border border-amber-400/30 shadow-xl group">
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

          {/* BOTTOM QUICK-SWITCH MINI DOCK */}
          <div className="pt-2 sm:pt-4 mt-2 sm:mt-4 border-t border-white/10">
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {RUNNING_OFFERS.map((camp, idx) => {
                const Icon = camp.icon;
                const isSelected = activeSlide === idx;

                return (
                  <button
                    key={camp.id}
                    onClick={() => goToSlide(idx)}
                    className={`p-1 sm:p-2.5 rounded-lg sm:rounded-xl text-center sm:text-left transition-all duration-300 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-0.5 sm:gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-white/25 border border-white/40 shadow-sm'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 sm:w-6 sm:h-6 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white text-slate-900' : 'bg-white/10 text-white'
                      }`}
                    >
                      <Icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <div className="min-w-0 w-full">
                      <span className="text-[9px] sm:text-xs font-bold truncate block text-white text-center sm:text-left">
                        <span className="sm:hidden">{camp.shortLabel}</span>
                        <span className="hidden sm:inline">{camp.label}</span>
                      </span>
                      <span className="hidden sm:block text-[9px] sm:text-[10px] truncate text-white/70">
                        {camp.tagline}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
