'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Car,
  Plane,
  Coins,
  ShieldCheck,
  Pause,
  Play,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types/product';

interface CampaignTabInfo {
  id: 'offers' | 'sales' | 'draws' | 'bumper';
  label: string;
  tagline: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgGradient: string;
  borderClass: string;
  glowClass: string;
}

const CAMPAIGNS: CampaignTabInfo[] = [
  {
    id: 'offers',
    label: 'Flash Deals',
    tagline: 'Save up to 30%',
    badge: 'Limited Time Drops',
    icon: Flame,
    accentColor: 'text-amber-400',
    bgGradient: 'from-[#1a0b02] via-[#2d1205] to-[#110501]',
    borderClass: 'border-amber-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(245,158,11,0.25)]',
  },
  {
    id: 'sales',
    label: 'Sale Events',
    tagline: 'In 3 Days',
    badge: 'Mega Autumn Bash',
    icon: Calendar,
    accentColor: 'text-cyan-400',
    bgGradient: 'from-[#070e28] via-[#0d1c4e] to-[#04081c]',
    borderClass: 'border-indigo-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(99,102,241,0.25)]',
  },
  {
    id: 'draws',
    label: 'Weekly Draws',
    tagline: '3 Prize Tiers',
    badge: 'Sunday 8:00 PM',
    icon: Trophy,
    accentColor: 'text-emerald-400',
    bgGradient: 'from-[#021f18] via-[#04362b] to-[#01140f]',
    borderClass: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_35px_-5px_rgba(16,185,129,0.25)]',
  },
  {
    id: 'bumper',
    label: 'Grand Bumper Jackpot',
    tagline: 'Luxury SUV & ₹5 Lakhs',
    badge: '👑 Signature Jackpot',
    icon: Crown,
    accentColor: 'text-amber-300',
    bgGradient: 'from-[#160228] via-[#29084c] to-[#0d0118]',
    borderClass: 'border-amber-400/90 ring-1 ring-amber-300/40',
    glowClass: 'shadow-[0_0_50px_-5px_rgba(251,191,36,0.38),0_0_20px_rgba(245,158,11,0.25)]',
  },
];

const AUTO_ROTATE_INTERVAL = 7000; // 7 seconds per campaign slide

export function HeroCardsHub() {
  const { products, formatAmount, addToCart, openLuckyDraw } = useStore();

  const [activeSlide, setActiveSlide] = useState<number>(3); // Start highlighted on Grand Bumper Jackpot or 0
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // --------------------------------------------------------------------------
  // CARD 1 DATA: Flash Deals / Products with Offers
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
  // CARD 2 DATA: Upcoming Sale Days Countdown
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
  // Slide Progression Handlers
  // --------------------------------------------------------------------------
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % CAMPAIGNS.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + CAMPAIGNS.length) % CAMPAIGNS.length);
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    setProgress(0);
  };

  // Auto rotation timer with progress calculation
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const stepMs = 50;
    const progressIncrement = (stepMs / AUTO_ROTATE_INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + progressIncrement;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  // Touch Swipe Gesture Handlers for Mobile & Tablet
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

  const currentCampaign = CAMPAIGNS[activeSlide];
  const isBumperActive = currentCampaign.id === 'bumper';

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 mb-3 sm:mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-[#0066FF] dark:text-[#38BDF8] text-[11px] font-extrabold uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Curated Showcase</span>
          </div>
          <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover JudesCart Campaigns
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Explore today&apos;s flash price drops, upcoming sale dates, weekly lucky draws, and the signature Brand JUDES bumper jackpot.
        </p>
      </div>

      {/* =========================================================================
          1. INTERACTIVE CAMPAIGN TABS (SLEEK SEGMENTED CONTROLLER)
          ========================================================================= */}
      <div className="bg-stone-200/60 dark:bg-slate-900/80 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-stone-200/80 dark:border-slate-800/90 mb-3 sm:mb-4 shadow-xs">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {/* Scrollable / Responsive Tab Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 flex-1">
            {CAMPAIGNS.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeSlide === idx;
              const isBumper = tab.id === 'bumper';

              return (
                <button
                  key={tab.id}
                  onClick={() => goToSlide(idx)}
                  className={`group relative flex items-center justify-between p-2 sm:px-3 sm:py-2.5 rounded-xl text-left transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? isBumper
                        ? 'bg-gradient-to-r from-[#210738] to-[#120324] text-white shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/90 border border-amber-300/40'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                      : isBumper
                      ? 'bg-gradient-to-r from-amber-500/10 via-purple-500/15 to-amber-500/10 hover:from-amber-500/20 hover:to-purple-500/25 border border-amber-400/60 ring-1 ring-amber-400/40 text-amber-900 dark:text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.18)]'
                      : 'hover:bg-white/70 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  }`}
                  aria-label={`Switch to ${tab.label}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isActive
                          ? isBumper
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 scale-105 shadow-xs'
                            : 'bg-[#0066FF] text-white scale-105 shadow-xs'
                          : isBumper
                          ? 'bg-amber-400/20 border border-amber-400/40 text-amber-400 group-hover:scale-105'
                          : 'bg-stone-200/80 dark:bg-slate-700/80 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs sm:text-[13px] font-bold truncate block ${
                            isBumper && !isActive ? 'text-amber-700 dark:text-amber-300 font-extrabold' : ''
                          }`}
                        >
                          {tab.label}
                        </span>
                        {isBumper && (
                          <span className="hidden xl:inline-flex px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shrink-0 animate-pulse">
                            Jackpot
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] sm:text-[11px] truncate block ${
                          isActive
                            ? isBumper
                              ? 'text-amber-300 font-semibold'
                              : 'text-[#0066FF] dark:text-[#38BDF8] font-semibold'
                            : isBumper
                            ? 'text-amber-600 dark:text-amber-400/90 font-medium'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        {tab.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Shimmer on Bumper Tab */}
                  {isBumper && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  )}

                  {/* Active Progress Bar Underneath Active Tab */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-75 ${
                          isBumper
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                            : 'bg-gradient-to-r from-[#0066FF] to-cyan-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Autoplay & Direction Controls */}
          <div className="hidden lg:flex items-center gap-1 shrink-0 pl-1 border-l border-stone-200 dark:border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Rotation' : 'Resume Rotation'}
              aria-label={isPlaying ? 'Pause Rotation' : 'Resume Rotation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={prevSlide}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Previous Campaign"
              aria-label="Previous Campaign"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Next Campaign"
              aria-label="Next Campaign"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. FULL-WIDTH IMMERSIVE HERO STAGE WITH DYNAMIC BACKGROUND TRANSITIONS
          ========================================================================= */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden text-white transition-all duration-500 select-none ${
          isBumperActive
            ? 'border-2 border-amber-400/90 ring-1 ring-amber-300/50 shadow-[0_0_50px_-5px_rgba(251,191,36,0.4),0_0_20px_rgba(245,158,11,0.25)] gold-glow-card'
            : `border ${currentCampaign.borderClass} ${currentCampaign.glowClass}`
        }`}
      >
        {/* Dynamic Background Gradient & Ambient Glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentCampaign.bgGradient} transition-colors duration-700 ease-in-out`}
        />

        {/* Ambient Radial Lighting Overlays */}
        {isBumperActive ? (
          <>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-black/40 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        {/* Hero Slider Slide Contents */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between">
          {/* Top Info Bar inside Hero */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-md ${
                  isBumperActive
                    ? 'bg-amber-400/20 border border-amber-400/60 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'bg-white/10 border border-white/20 text-white'
                }`}
              >
                {React.createElement(currentCampaign.icon, {
                  className: `w-3.5 h-3.5 ${isBumperActive ? 'text-amber-400 animate-pulse' : 'text-current'}`,
                })}
                <span>{currentCampaign.badge}</span>
              </div>

              {isBumperActive && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-xs">
                  <Crown className="w-3 h-3" />
                  <span>Mega Jackpot</span>
                </span>
              )}
            </div>

            {/* Slide Index Counter & Controls */}
            <div className="flex items-center gap-2 text-xs font-mono text-white/70">
              <span className="hidden sm:inline">Campaign</span>
              <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-white font-bold">
                0{activeSlide + 1} / 04
              </span>
              <div className="flex items-center gap-1 sm:ml-2">
                <button
                  onClick={prevSlide}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* MAIN SLIDE BODY: TWO COLUMNS (Content & Interactive Widget vs Visual Media) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1">
            {/* =========================================================================
                SLIDE 3: GRAND BUMPER JACKPOT
                ========================================================================= */}
            {activeSlide === 3 && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-300 mb-1">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Held Every 6–12 Months • Exclusive to Brand JUDES</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                      Grand Bumper Jackpot{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400">
                        Luxury SUV &amp; ₹5 Lakhs Cash
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-100/85 mt-2 leading-relaxed max-w-xl">
                      Experience JudesCart&apos;s ultimate shopping milestone. Every single checkout featuring our signature
                      in-house brand <strong className="text-amber-300 font-extrabold">JUDES</strong> automatically earns
                      verified draw tokens for our flagship prizes.
                    </p>
                  </div>

                  {/* 3 Luxury Prize Tiles with Gold Foil Accents */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-xl bg-gradient-to-b from-amber-400/20 via-white/5 to-transparent border border-amber-400/50 backdrop-blur-md flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 group hover:border-amber-300 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/30 border border-amber-400/60 flex items-center justify-center text-base shrink-0">
                        🚗
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-200 block">Luxury SUV</span>
                        <span className="text-[10px] text-amber-300/80 block">Grand Fleet Vehicle</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gradient-to-b from-pink-400/20 via-white/5 to-transparent border border-pink-400/40 backdrop-blur-md flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 group hover:border-pink-300 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-pink-400/30 border border-pink-400/60 flex items-center justify-center text-base shrink-0">
                        ✈️
                      </div>
                      <div>
                        <span className="text-xs font-black text-pink-200 block">7-Day World Tour</span>
                        <span className="text-[10px] text-pink-300/80 block">5-Star Holiday Package</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gradient-to-b from-yellow-400/20 via-white/5 to-transparent border border-yellow-400/50 backdrop-blur-md flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 group hover:border-yellow-300 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-yellow-400/30 border border-yellow-400/60 flex items-center justify-center text-base shrink-0">
                        💰
                      </div>
                      <div>
                        <span className="text-xs font-black text-yellow-200 block">₹5,00,000 Cash</span>
                        <span className="text-[10px] text-yellow-300/80 block">Direct Banking Spree</span>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href="/products?brand=JUDES"
                      className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-md shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <Crown className="w-4 h-4 text-slate-950" />
                      <span>Shop Brand JUDES to Enter</span>
                      <ArrowRight className="w-4 h-4 ml-0.5" />
                    </Link>

                    <Link
                      href="/lucky-draw#bumper-draw"
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-amber-400/40 text-amber-200 hover:text-white transition-all active:scale-95 cursor-pointer"
                    >
                      <span>View Bumper Draw Rules</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Side Visual Banner */}
                <div className="lg:col-span-5 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[300px] rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl shadow-amber-950/40 group">
                  <Image
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85"
                    alt="Brand JUDES Grand Bumper Jackpot Luxury SUV"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120324] via-[#120324]/50 to-transparent" />

                  {/* Floating Badges on Image */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/50 text-[11px] font-bold text-amber-300 flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>₹50+ Lakh Total Prize Pool</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-slate-200">100% Transparent Audited Draw</span>
                    </div>
                    <span className="font-extrabold text-amber-400">Next Bumper: Q4</span>
                  </div>
                </div>
              </>
            )}

            {/* =========================================================================
                SLIDE 0: FLASH DEALS & OFFERS
                ========================================================================= */}
            {activeSlide === 0 && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Immediate Price Drops • Limited Stock</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                      Flash Deals &amp; Exclusive Catalog Savings
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed max-w-xl">
                      Grab verified factory-direct discounts on top-tier electronics, designer apparel, and everyday
                      essentials. Deals refresh daily with limited quantities.
                    </p>
                  </div>

                  {/* Interactive Active Deal Card */}
                  {activeDeal && (
                    <div className="p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/20">
                          <Image
                            src={activeDeal.images[0]}
                            alt={activeDeal.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black bg-rose-600 text-white leading-none">
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
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-sm sm:text-base font-black text-amber-300">
                              {formatAmount(activeDeal.price)}
                            </span>
                            {activeDeal.originalPrice && (
                              <span className="text-xs text-stone-400 line-through">
                                {formatAmount(activeDeal.originalPrice)}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-emerald-300 font-semibold mt-0.5 block">
                            ✓ Ready to Dispatch • Free Shipping Available
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleQuickAdd(activeDeal, e)}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                            addedItemEffect === activeDeal.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-98 shadow-xs'
                          }`}
                        >
                          {addedItemEffect === activeDeal.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added to Cart!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Quick Add Deal to Cart</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/products/${activeDeal.slug}`}
                          className="px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
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

                {/* Right Side Visual */}
                <div className="lg:col-span-5 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[300px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl group">
                  <Image
                    src={activeDeal?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85'}
                    alt="Flash Deals Spotlight"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#110501] via-[#110501]/40 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold shadow-md">
                    Up to {discountPercent}% OFF
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">24-Hour Deal Guarantee</span>
                    <span className="font-bold text-amber-300">Live Today</span>
                  </div>
                </div>
              </>
            )}

            {/* =========================================================================
                SLIDE 1: SALE DAYS & COUNTDOWN
                ========================================================================= */}
            {activeSlide === 1 && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-cyan-400 mb-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>Live Seasonal Event Countdown</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                      JudesCart Mega Autumn Bash{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-300">
                        Up to 60% Storewide
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-xl">
                      Mark your calendar for our biggest seasonal shopping festival. Get early access to tiered vouchers,
                      double JudesCoins, and exclusive bundle price drops.
                    </p>
                  </div>

                  {/* 4-Box Countdown Timer */}
                  <div className="p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                        Sale Commences In:
                      </span>
                      <span className="text-[10px] text-slate-300">Sept 18 – Sept 22</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-black/50 rounded-xl p-2 border border-indigo-400/30">
                        <span className="block text-xl sm:text-2xl font-black text-white leading-none">
                          {String(saleTimeLeft.days).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] text-indigo-200 uppercase font-bold mt-1 block">Days</span>
                      </div>
                      <div className="bg-black/50 rounded-xl p-2 border border-indigo-400/30">
                        <span className="block text-xl sm:text-2xl font-black text-white leading-none">
                          {String(saleTimeLeft.hours).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] text-indigo-200 uppercase font-bold mt-1 block">Hours</span>
                      </div>
                      <div className="bg-black/50 rounded-xl p-2 border border-indigo-400/30">
                        <span className="block text-xl sm:text-2xl font-black text-white leading-none">
                          {String(saleTimeLeft.minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] text-indigo-200 uppercase font-bold mt-1 block">Minutes</span>
                      </div>
                      <div className="bg-black/50 rounded-xl p-2 border border-indigo-400/30">
                        <span className="block text-xl sm:text-2xl font-black text-cyan-300 leading-none">
                          {String(saleTimeLeft.seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[9px] text-indigo-200 uppercase font-bold mt-1 block">Seconds</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setReminderActive(!reminderActive)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                          reminderActive
                            ? 'bg-indigo-600 text-white border border-indigo-400'
                            : 'bg-white/20 hover:bg-white/30 text-white border border-white/20 active:scale-98'
                        }`}
                      >
                        {reminderActive ? (
                          <>
                            <BellRing className="w-3.5 h-3.5 text-amber-300" />
                            <span>Alert Set! You&apos;ll Be Notified</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3.5 h-3.5 text-indigo-200" />
                            <span>Set Sale Reminder Notification</span>
                          </>
                        )}
                      </button>

                      <Link
                        href="/products"
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Side Visual */}
                <div className="lg:col-span-5 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[300px] rounded-2xl overflow-hidden border border-indigo-500/30 shadow-xl group">
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
                SLIDE 2: WEEKLY LUCKY DRAWS
                ========================================================================= */}
            {activeSlide === 2 && (
              <>
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Every Sunday 8:00 PM • 3 Exclusive Tiers</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                      Shop &amp; Win Sunday Lucky Draws{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                        Apple Tech &amp; Cash Raffles
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/85 mt-2 leading-relaxed max-w-xl">
                      Turn everyday checkouts into verified winning tickets. Receive automated tokens based on your order
                      value for Sunday&apos;s live audited draw.
                    </p>
                  </div>

                  {/* 3 Tier Cards */}
                  <div className="space-y-2 max-w-lg">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xs">
                          💎
                        </span>
                        <div>
                          <span className="text-xs font-bold text-white block">Platinum Tier</span>
                          <span className="text-[10px] text-emerald-200">iPhone 16 Pro &amp; MacBook Pro</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                        Orders &gt;₹5,000
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-xs">
                          🥇
                        </span>
                        <div>
                          <span className="text-xs font-bold text-white block">Gold Tier</span>
                          <span className="text-[10px] text-emerald-200">Apple Watch &amp; Sony Wireless Audio</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-blue-300 bg-blue-400/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                        Orders &gt;₹2,500
                      </span>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs">
                          🥈
                        </span>
                        <div>
                          <span className="text-xs font-bold text-white block">Silver Tier</span>
                          <span className="text-[10px] text-emerald-200">AirPods &amp; Instant Cash Raffles</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold text-cyan-300 bg-cyan-400/20 px-2 py-0.5 rounded-full border border-cyan-400/30">
                        Orders &gt;₹1,000
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={openLuckyDraw}
                      className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-slate-950" />
                      <span>Open Prize Wheel &amp; Details</span>
                    </button>

                    <Link
                      href="/lucky-draw#regular-draws"
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95"
                    >
                      <span>Rules &amp; Verification</span>
                    </Link>
                  </div>
                </div>

                {/* Right Side Visual */}
                <div className="lg:col-span-5 relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[300px] rounded-2xl overflow-hidden border border-emerald-500/30 shadow-xl group">
                  <Image
                    src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=85"
                    alt="JudesCart Sunday Weekly Lucky Draws"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#01140f] via-[#01140f]/50 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-md">
                    Every Sunday Live
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">Sunday 8:00 PM Draw</span>
                    <span className="font-bold text-emerald-300">Verified On-Chain</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* =========================================================================
              BOTTOM QUICK-SWITCH MINI DOCK
              ========================================================================= */}
          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CAMPAIGNS.map((camp, idx) => {
                const Icon = camp.icon;
                const isSelected = activeSlide === idx;
                const isBumper = camp.id === 'bumper';

                return (
                  <button
                    key={camp.id}
                    onClick={() => goToSlide(idx)}
                    className={`p-2 sm:p-2.5 rounded-xl text-left transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? isBumper
                          ? 'bg-amber-400/30 border-2 border-amber-300 ring-2 ring-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                          : 'bg-white/25 border border-white/40 shadow-sm'
                        : isBumper
                        ? 'bg-amber-500/15 border-2 border-amber-400/80 ring-1 ring-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:bg-amber-500/25'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isBumper
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : isSelected
                          ? 'bg-white text-slate-900'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-[11px] sm:text-xs font-bold truncate block ${
                            isBumper ? 'text-amber-300 font-black' : 'text-white'
                          }`}
                        >
                          {camp.label}
                        </span>
                        {isBumper && <span className="text-[10px] shrink-0">👑</span>}
                      </div>
                      <span
                        className={`text-[9px] sm:text-[10px] truncate block ${
                          isBumper ? 'text-amber-200/90 font-bold' : 'text-white/70'
                        }`}
                      >
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
