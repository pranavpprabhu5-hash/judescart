'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Headphones,
  Shirt,
  Briefcase,
  Home,
  ArrowRight,
  ShoppingBag,
  Tag,
  Copy,
  Check,
  Pause,
  Play,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface OfferCampaign {
  id: 'electronics' | 'apparel' | 'leather-footwear' | 'home-living';
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
    id: 'electronics',
    label: 'Electronics & Audio',
    shortLabel: 'Electronics',
    tagline: 'Up to 45% OFF Category Event',
    badge: '⚡ Electronics & Audio Sale',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
    icon: Headphones,
    accentColor: 'text-blue-400',
    bgGradient: 'from-[#07132e] via-[#0d2254] to-[#040b1a]',
    borderClass: 'border-blue-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(59,130,246,0.25)]',
  },
  {
    id: 'apparel',
    label: 'Apparel & Fashion',
    shortLabel: 'Fashion',
    tagline: 'Up to 50% OFF Season Clearance',
    badge: '✨ Designer Fashion & Silks',
    badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
    icon: Shirt,
    accentColor: 'text-amber-300',
    bgGradient: 'from-[#1c1007] via-[#2d1b0c] to-[#120904]',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(217,119,6,0.25)]',
  },
  {
    id: 'leather-footwear',
    label: 'Leather & Footwear',
    shortLabel: 'Leather Goods',
    tagline: 'Flat 35% OFF Artisanal Craft',
    badge: '👑 Tuscan Leather & Footwear',
    badgeColor: 'bg-amber-600/20 text-amber-300 border-amber-500/40',
    icon: Briefcase,
    accentColor: 'text-amber-400',
    bgGradient: 'from-[#1a0f08] via-[#2c170a] to-[#100703]',
    borderClass: 'border-amber-600/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(217,119,6,0.25)]',
  },
  {
    id: 'home-living',
    label: 'Home & Living',
    shortLabel: 'Home Decor',
    tagline: 'Up to 45% OFF Home Refresh',
    badge: '🌿 Nordic Living & Modern Home',
    badgeColor: 'bg-indigo-500/20 text-cyan-300 border-indigo-400/40',
    icon: Home,
    accentColor: 'text-cyan-400',
    bgGradient: 'from-[#0a122e] via-[#142259] to-[#060b1c]',
    borderClass: 'border-indigo-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(99,102,241,0.25)]',
  },
];

const AUTO_ROTATE_INTERVAL = 6500; // 6.5 seconds per slide

export function HeroCardsHub() {
  const { applyPromo } = useStore();

  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
    } catch {}
    applyPromo(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Navigation & Autoplay
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
      aria-label="Promotional Department Offers Banner"
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
        aria-label="Previous category slide"
        title="Previous department offer"
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
        aria-label="Next category slide"
        title="Next department offer"
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
              SLIDE 0: CONSUMER ELECTRONICS & SMART AUDIO CATEGORY
              ========================================================================= */}
          {activeSlide === 0 && (
            <>
              <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 min-h-[220px] sm:min-h-[250px] lg:h-[385px] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-400 mb-0.5 sm:mb-1 h-4 sm:h-5">
                    <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">Electronics &amp; Audio Department • Live Today</span>
                  </div>
                  <div className="h-[2.5rem] sm:h-[3.75rem] lg:h-[4.5rem] flex items-center">
                    <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug line-clamp-2">
                      Consumer Electronics &amp; Smart Audio Mega Deals
                    </h1>
                  </div>
                  <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-stone-300 mt-1.5 sm:mt-2 leading-relaxed max-w-xl line-clamp-2 h-[2.5rem] sm:h-[2.75rem] lg:h-[3rem]">
                    Save up to 45% across studio-grade active noise-cancelling headphones, titanium GPS smartwatches,
                    and high-fidelity home acoustics with verified manufacturer warranties.
                  </p>
                </div>

                {/* Category Highlights (2-card department breakdown) */}
                <div className="grid grid-cols-2 gap-2 max-w-lg">
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-blue-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                    <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                      Studio Audio &amp; Headphones
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-blue-200 block truncate">
                      40mm Beryllium • Spatial Sound
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">
                      Up to 40% OFF Category
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-blue-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                    <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                      Smartwatches &amp; Wearables
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-blue-200 block truncate">
                      Titanium GPS • AMOLED Displays
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">
                      Save Up to $100 Across Models
                    </span>
                  </div>
                </div>

                {/* Category Coupon Pill */}
                <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-blue-950/60 border border-blue-400/30 flex items-center justify-between max-w-lg h-[44px] sm:h-[50px]">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block truncate">CODE: TECHBONUS</span>
                      <span className="text-[8px] sm:text-[9px] text-blue-200 block truncate">Extra 15% off electronics category items</span>
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
                    <span>Shop All Electronics</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                  </Link>

                  <Link
                    href="/products?category=electronics"
                    className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
                  >
                    <span>Browse 24 Devices</span>
                  </Link>
                </div>
              </div>

              {/* Right Side Visual */}
              <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[385px] rounded-2xl overflow-hidden border border-blue-500/30 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85"
                  alt="Electronics & Audio Category Deals"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040b1a] via-[#040b1a]/40 to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-md">
                  Up to 45% OFF Category
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">100% Genuine Guaranteed</span>
                  <span className="font-bold text-cyan-300">Free Express Delivery</span>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              SLIDE 1: DESIGNER APPAREL & LUXURY FASHION CATEGORY
              ========================================================================= */}
          {activeSlide === 1 && (
            <>
              <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 min-h-[220px] sm:min-h-[250px] lg:h-[385px] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 mb-0.5 sm:mb-1 h-4 sm:h-5">
                    <Shirt className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Designer Apparel &amp; Fashion • Season Clearance</span>
                  </div>
                  <div className="h-[2.5rem] sm:h-[3.75rem] lg:h-[4.5rem] flex items-center">
                    <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug line-clamp-2">
                      Designer Apparel &amp; Luxury Cashmere Collection
                    </h1>
                  </div>
                  <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-amber-100/90 mt-1.5 sm:mt-2 leading-relaxed max-w-xl line-clamp-2 h-[2.5rem] sm:h-[2.75rem] lg:h-[3rem]">
                    Indulge in Grade-A 2-ply Mongolian cashmere knitwear, tailored virgin Melton wool overcoats, and pure
                    mulberry silk charmeuse dresses with complimentary global returns.
                  </p>
                </div>

                {/* Category Highlights */}
                <div className="grid grid-cols-2 gap-2 max-w-lg">
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                    <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                      Mongolian Cashmere Knitwear
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-amber-200 block truncate">
                      Grade-A 2-Ply • Horn Buttons
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">
                      Up to 50% OFF Knitwear
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                    <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                      Tailored Outerwear &amp; Silk
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-amber-200 block truncate">
                      Italian Melton Wool &amp; Charmeuse
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">
                      Save $80 - $150 on Coats
                    </span>
                  </div>
                </div>

                {/* Coupon Pill */}
                <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-950/60 border border-amber-400/30 flex items-center justify-between max-w-lg h-[44px] sm:h-[50px]">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block truncate">CODE: SAVE50</span>
                      <span className="text-[8px] sm:text-[9px] text-amber-200 block truncate">$50 off apparel orders over $250</span>
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
                    <span>Shop All Fashion</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                  </Link>

                  <Link
                    href="/products?category=apparel"
                    className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
                  >
                    <span>Explore 38 Styles</span>
                  </Link>
                </div>
              </div>

              {/* Right Side Visual */}
              <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[385px] rounded-2xl overflow-hidden border border-amber-400/30 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=85"
                  alt="Designer Fashion & Apparel Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120904] via-[#120904]/40 to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-md">
                  Up to 50% OFF Fashion
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Grade-A Natural Fibers</span>
                  <span className="font-bold text-amber-300">Free Worldwide Delivery</span>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              SLIDE 2: TUSCAN LEATHER GOODS & ARTISANAL FOOTWEAR CATEGORY
              ========================================================================= */}
          {activeSlide === 2 && (
            <>
              <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 min-h-[220px] sm:min-h-[250px] lg:h-[385px] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300 mb-0.5 sm:mb-1 h-4 sm:h-5">
                    <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">Leather Goods &amp; Footwear • Artisanal Craft</span>
                  </div>
                  <div className="h-[2.5rem] sm:h-[3.75rem] lg:h-[4.5rem] flex items-center">
                    <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug line-clamp-2">
                      Tuscan Full-Grain Leather &amp; Handcrafted Footwear
                    </h1>
                  </div>
                  <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-amber-100/90 mt-1.5 sm:mt-2 leading-relaxed max-w-xl line-clamp-2 h-[2.5rem] sm:h-[2.75rem] lg:h-[3rem]">
                    Handcrafted in Florence using vegetable-tanned full-grain cowhide leather, paired with weather-resistant
                    Vibram lugged Chelsea boots, briefcases, and artisanal casual loafers.
                  </p>
                </div>

                {/* Category Highlights */}
                <div className="grid grid-cols-2 gap-2 max-w-lg">
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                    <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                      Full-Grain Leather Totes &amp; Bags
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-amber-200 block truncate">
                      Tuscan Calfskin • Hand-stitched
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">
                      Flat 35% OFF Leather Bags
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-amber-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                    <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                      Weatherproof Chelsea Boots
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-amber-200 block truncate">
                      Lightweight Vibram Outsoles
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-amber-300 block pt-0.5 truncate">
                      Save Up to $90 on Footwear
                    </span>
                  </div>
                </div>

                {/* Coupon Pill */}
                <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-950/60 border border-amber-400/30 flex items-center justify-between max-w-lg h-[44px] sm:h-[50px]">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block truncate">CODE: JUDES20</span>
                      <span className="text-[8px] sm:text-[9px] text-amber-200 block truncate">20% off all leather &amp; footwear items</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyCode('JUDES20')}
                    className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-md text-[9px] sm:text-[10px] font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                  >
                    {copiedCode === 'JUDES20' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'JUDES20' ? 'Applied!' : 'Apply'}</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                  <Link
                    href="/products?category=leather-goods"
                    className="h-8 sm:h-10 px-3.5 sm:px-5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                    <span>Shop Leather Goods</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                  </Link>

                  <Link
                    href="/products?category=footwear"
                    className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-amber-400/30 text-amber-200 hover:text-white transition-all active:scale-95"
                  >
                    <span>Explore Footwear</span>
                  </Link>
                </div>
              </div>

              {/* Right Side Visual */}
              <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[385px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85"
                  alt="Handcrafted Leather Goods & Footwear"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120904] via-[#120904]/40 to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black shadow-md">
                  Flat 35% OFF Leather
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">100% Genuine Tuscan Cowhide</span>
                  <span className="font-bold text-amber-300">Free 30-Day Returns</span>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              SLIDE 3: MODERN HOME & NORDIC LIVING CATEGORY
              ========================================================================= */}
          {activeSlide === 3 && (
            <>
              <div className="lg:col-span-7 space-y-2.5 sm:space-y-4 min-h-[220px] sm:min-h-[250px] lg:h-[385px] flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-300 mb-0.5 sm:mb-1 h-4 sm:h-5">
                    <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">Home &amp; Living • Interior Refresh Specials</span>
                  </div>
                  <div className="h-[2.5rem] sm:h-[3.75rem] lg:h-[4.5rem] flex items-center">
                    <h1 className="text-base sm:text-2xl lg:text-3xl xl:text-4xl font-black text-white tracking-tight leading-snug line-clamp-2">
                      Modern Home Accents, Ambient Lighting &amp; Decor
                    </h1>
                  </div>
                  <p className="hidden sm:block text-xs sm:text-sm lg:text-base text-indigo-100/90 mt-1.5 sm:mt-2 leading-relaxed max-w-xl line-clamp-2 h-[2.5rem] sm:h-[2.75rem] lg:h-[3rem]">
                    Reimagine your home sanctuary with Japanese Hasami porcelain tableware, botanical aromatherapy
                    scents, and architectural smart ambient lighting with complementary gift packaging.
                  </p>
                </div>

                {/* Category Highlights */}
                <div className="grid grid-cols-2 gap-2 max-w-lg">
                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-indigo-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                    <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                      Smart Ambient Lighting &amp; Lamps
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-indigo-200 block truncate">
                      AuraGlow Smart Desk Luminaires
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-cyan-300 block pt-0.5 truncate">
                      Up to 45% OFF Lighting
                    </span>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-indigo-400/20 space-y-0.5 h-[68px] sm:h-[80px] flex flex-col justify-center">
                    <span className="text-[11px] sm:text-xs font-bold text-white block truncate">
                      Porcelain, Tableware &amp; Scents
                    </span>
                    <span className="text-[9px] sm:text-[11px] text-indigo-200 block truncate">
                      Japanese Hasami &amp; Nordic Decor
                    </span>
                    <span className="text-[11px] sm:text-xs font-black text-cyan-300 block pt-0.5 truncate">
                      Save Up to 35% on Decor
                    </span>
                  </div>
                </div>

                {/* Coupon Pill */}
                <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-indigo-950/60 border border-indigo-400/30 flex items-center justify-between max-w-lg h-[44px] sm:h-[50px]">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-2">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] sm:text-[11px] font-mono font-bold text-white block truncate">CODE: WELCOME15</span>
                      <span className="text-[8px] sm:text-[9px] text-indigo-200 block truncate">15% off all Home &amp; Living collections</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyCode('WELCOME15')}
                    className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-md text-[9px] sm:text-[10px] font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                  >
                    {copiedCode === 'WELCOME15' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode === 'WELCOME15' ? 'Applied!' : 'Apply'}</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                  <Link
                    href="/products?category=home-living"
                    className="h-8 sm:h-10 px-3.5 sm:px-5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-black flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-600 hover:brightness-110 text-white shadow-md shadow-indigo-500/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    <span>Shop Home &amp; Living</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                  </Link>

                  <Link
                    href="/products?category=home-living"
                    className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
                  >
                    <span>Explore 42 Objects</span>
                  </Link>
                </div>
              </div>

              {/* Right Side Visual */}
              <div className="hidden sm:block lg:col-span-5 relative w-full aspect-[16/9] lg:aspect-auto lg:h-[385px] rounded-2xl overflow-hidden border border-indigo-500/30 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85"
                  alt="Home Living & Scandinavian Decor Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04081c] via-[#04081c]/40 to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-extrabold shadow-md">
                  Home Refresh • Up to 45% OFF
                </div>
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Japanese Hasami Porcelain</span>
                  <span className="font-bold text-cyan-300">Complimentary Gift Packaging</span>
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
