'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  Crown,
  Headphones,
  Shirt,
  ShieldCheck,
  Truck,
  RefreshCw,
  PhoneCall,
  Pause,
  Play,
  Gift,
  Award,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FeaturePill {
  icon?: React.ReactNode;
  label: string;
  badge?: string;
}

export interface HeroSlide {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  badgeClass: string;
  headingPrefix: string;
  headingHighlight: string;
  headingGradient: string;
  description: string;
  featurePills: FeaturePill[];
  primaryCtaText: string;
  primaryCtaHref: string;
  primaryCtaClass: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  secondaryCtaClass: string;
  image: string;
  imageAlt: string;
  // Unique slide styling
  bgGradient: string;
  radialGlow: string;
  cardBorder: string;
  shadowColor: string;
  activeDotClass: string;
  arrowHoverClass: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'three-regular-draws',
    badge: 'Platinum, Gold & Silver Lucky Draws',
    badgeIcon: <Trophy className="w-3.5 h-3.5 text-amber-300" />,
    badgeClass: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40 shadow-emerald-950/40',
    headingPrefix: 'Shop & Win. ',
    headingHighlight: 'Platinum, Gold & Silver Draws.',
    headingGradient: 'from-amber-200 via-emerald-200 to-teal-200',
    description:
      'Earn guaranteed draw entries on every qualifying purchase. From weekly cash jackpots to flagship Apple tech, every qualifying order brings winning tickets.',
    featurePills: [
      {
        icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />,
        badge: 'Platinum Draw',
        label: 'Flagship iPhones & MacBooks',
      },
      {
        icon: <Award className="w-3.5 h-3.5 text-blue-300" />,
        badge: 'Gold Draw',
        label: 'Apple Watch & Sony Audio',
      },
      {
        icon: <Gift className="w-3.5 h-3.5 text-cyan-300" />,
        badge: 'Silver Draw',
        label: 'AirPods & Sunday Cash Raffles',
      },
    ],
    primaryCtaText: 'View Platinum, Gold & Silver Draws',
    primaryCtaHref: '/lucky-draw#regular-draws',
    primaryCtaClass:
      'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50',
    secondaryCtaText: 'Shop Eligible Products',
    secondaryCtaHref: '/products',
    secondaryCtaClass:
      'bg-emerald-950/60 border border-emerald-400/30 text-emerald-100 hover:bg-emerald-900/60 hover:border-emerald-300/50',
    image:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'JudesCart Platinum, Gold & Silver Lucky Draws System',
    bgGradient: 'from-[#02231c] via-[#053d30]/90 to-[#021f19]',
    radialGlow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    cardBorder: 'border-emerald-500/40',
    shadowColor: 'shadow-emerald-950/40',
    activeDotClass: 'bg-emerald-400 shadow-emerald-400/60',
    arrowHoverClass: 'hover:bg-emerald-600 hover:border-emerald-400',
  },
  {
    id: 'bumper-draw-judes',
    badge: 'Mega Bumper Draw • Every 6–12 Months • Exclusive to Brand JUDES',
    badgeIcon: <Crown className="w-3.5 h-3.5 text-amber-300" />,
    badgeClass: 'bg-purple-500/25 text-amber-200 border-amber-400/50 shadow-purple-950/40',
    headingPrefix: 'Grand Bumper Draw. ',
    headingHighlight: 'Exclusive to Brand JUDES.',
    headingGradient: 'from-amber-300 via-yellow-100 to-amber-400',
    description:
      'Held every 6 to 12 months! Every order of JudesCart’s signature in-house brand "JUDES" automatically enters you into the ultimate jackpot for luxury cars, foreign vacations, and mega cash rewards.',
    featurePills: [
      {
        icon: <Crown className="w-3.5 h-3.5 text-amber-400" />,
        badge: 'Jackpot Tier',
        label: 'Luxury Vehicle & SUV',
      },
      {
        icon: <Sparkles className="w-3.5 h-3.5 text-pink-300" />,
        badge: 'VIP Trip',
        label: '7-Day Luxury Holiday Abroad',
      },
      {
        icon: <Zap className="w-3.5 h-3.5 text-yellow-300" />,
        badge: 'Mega Cash',
        label: '₹5,00,000 Direct Cash Prize',
      },
    ],
    primaryCtaText: 'Shop Brand JUDES',
    primaryCtaHref: '/products?brand=JUDES',
    primaryCtaClass:
      'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50',
    secondaryCtaText: 'Bumper Draw Details',
    secondaryCtaHref: '/lucky-draw#bumper-draw',
    secondaryCtaClass:
      'bg-purple-950/60 border border-purple-400/40 text-purple-100 hover:bg-purple-900/60 hover:border-amber-300/50',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'JudesCart Mega Bumper Draw for Brand JUDES',
    bgGradient: 'from-[#19072e] via-[#2d0f52]/90 to-[#120422]',
    radialGlow: 'from-purple-500/25 via-amber-500/15 to-transparent',
    cardBorder: 'border-amber-500/40',
    shadowColor: 'shadow-purple-950/50',
    activeDotClass: 'bg-amber-400 shadow-amber-400/60',
    arrowHoverClass: 'hover:bg-amber-500 hover:text-slate-950 hover:border-amber-300',
  },
  {
    id: 'electronics-audio',
    badge: 'Next-Gen Electronics & Audiophile Gear',
    badgeIcon: <Headphones className="w-3.5 h-3.5 text-cyan-300" />,
    badgeClass: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40 shadow-cyan-950/40',
    headingPrefix: 'Pure Sound. ',
    headingHighlight: 'Unrivaled Immersion.',
    headingGradient: 'from-cyan-300 via-sky-200 to-indigo-300',
    description:
      'Immerse yourself in 45dB hybrid active noise cancellation, precision beryllium drivers, and smart ambient wireless lighting engineered for audiophile-grade fidelity.',
    featurePills: [
      {
        icon: <Headphones className="w-3.5 h-3.5 text-cyan-400" />,
        badge: 'SonicPro Studio',
        label: '45dB Hybrid Active Noise Cancelling',
      },
      {
        icon: <Zap className="w-3.5 h-3.5 text-blue-300" />,
        badge: 'Custom Drivers',
        label: 'Pure Beryllium Acoustic Diaphragms',
      },
      {
        icon: <Sparkles className="w-3.5 h-3.5 text-sky-300" />,
        badge: 'Endurance',
        label: '60-Hour Battery & Spatial Audio',
      },
    ],
    primaryCtaText: 'Shop Electronics',
    primaryCtaHref: '/products?category=electronics',
    primaryCtaClass:
      'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
    secondaryCtaText: 'View SonicPro ANC',
    secondaryCtaHref: '/products/sonicpro-wireless-noise-cancelling-headphones',
    secondaryCtaClass:
      'bg-blue-950/60 border border-cyan-400/30 text-cyan-100 hover:bg-blue-900/60 hover:border-cyan-300/50',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'SonicPro Studio Wireless Noise Cancelling Headphones',
    bgGradient: 'from-[#061026] via-[#0c1c45]/90 to-[#04091a]',
    radialGlow: 'from-cyan-500/20 via-blue-500/15 to-transparent',
    cardBorder: 'border-cyan-500/40',
    shadowColor: 'shadow-blue-950/50',
    activeDotClass: 'bg-cyan-400 shadow-cyan-400/60',
    arrowHoverClass: 'hover:bg-cyan-500 hover:border-cyan-300',
  },
  {
    id: 'apparel-leather',
    badge: 'Curated Fashion, Footwear & Italian Leather',
    badgeIcon: <Shirt className="w-3.5 h-3.5 text-rose-300" />,
    badgeClass: 'bg-rose-500/20 text-rose-200 border-rose-400/40 shadow-rose-950/40',
    headingPrefix: 'Effortless Style. ',
    headingHighlight: 'Timeless Craftsmanship.',
    headingGradient: 'from-rose-200 via-orange-200 to-amber-300',
    description:
      'Invest in heirloom-grade wardrobe staples: 100% Grade-A Mongolian cashmere sweaters, weatherproof Vibram Chelsea boots, and vegetable-tanned full-grain Italian leather bags.',
    featurePills: [
      {
        icon: <Shirt className="w-3.5 h-3.5 text-rose-300" />,
        badge: 'Pure Cashmere',
        label: '100% Grade-A Mongolian Wool',
      },
      {
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
        badge: 'All-Weather',
        label: 'Waterproof Vibram Chelsea Boots',
      },
      {
        icon: <Award className="w-3.5 h-3.5 text-orange-300" />,
        badge: 'Artisanal Bags',
        label: 'Full-Grain Vegetable Tanned Leather',
      },
    ],
    primaryCtaText: 'Shop Apparel & Footwear',
    primaryCtaHref: '/products?category=apparel',
    primaryCtaClass:
      'bg-gradient-to-r from-rose-500 via-pink-600 to-amber-600 hover:brightness-110 text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50',
    secondaryCtaText: 'Handcrafted Bags',
    secondaryCtaHref: '/products?category=leather-goods',
    secondaryCtaClass:
      'bg-rose-950/60 border border-rose-400/30 text-rose-100 hover:bg-rose-900/60 hover:border-rose-300/50',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=85',
    imageAlt: 'Modern curated fashion and leather collections at JudesCart',
    bgGradient: 'from-[#220a16] via-[#381123]/90 to-[#18060f]',
    radialGlow: 'from-rose-500/20 via-orange-500/10 to-transparent',
    cardBorder: 'border-rose-500/40',
    shadowColor: 'shadow-rose-950/50',
    activeDotClass: 'bg-rose-400 shadow-rose-400/60',
    arrowHoverClass: 'hover:bg-rose-600 hover:border-rose-400',
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const activeSlide = HERO_SLIDES[currentIndex];

  // Auto-advance timer (6s interval, paused on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // Touch gesture support for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* Dynamic Sliding Window Container with slide-reactive border & glow */}
      <div
        className={cn(
          'relative rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden text-white shadow-2xl transition-all duration-700 group border',
          activeSlide.cardBorder,
          activeSlide.shadowColor
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Sliding Track */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={cn(
                'w-full shrink-0 relative min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-gradient-to-b',
                slide.bgGradient
              )}
            >
              {/* Background Slide Image & Ambient Glow Overlays */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={idx === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className={cn(
                    'object-cover object-center opacity-25 transform transition-transform duration-1000',
                    currentIndex === idx ? 'scale-105' : 'scale-100'
                  )}
                />
                {/* Radial ambient glow specific to slide color */}
                <div
                  className={cn(
                    'absolute inset-0 bg-radial pointer-events-none opacity-80',
                    slide.radialGlow
                  )}
                />
                {/* Contrast gradient layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/70" />
              </div>

              {/* Slide Content Box */}
              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
                {/* Eyebrow Pill */}
                <div
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border text-xs font-bold uppercase tracking-wider shadow-md transition-all duration-300',
                    slide.badgeClass
                  )}
                >
                  {slide.badgeIcon}
                  <span>{slide.badge}</span>
                </div>

                {/* Main Heading */}
                <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                  {slide.headingPrefix}
                  <span
                    className={cn(
                      'text-transparent bg-clip-text bg-gradient-to-r font-black',
                      slide.headingGradient
                    )}
                  >
                    {slide.headingHighlight}
                  </span>
                </h1>

                {/* Subtitle / Description */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed">
                  {slide.description}
                </p>

                {/* Unique Slide Design Accents: Feature Pills */}
                {slide.featurePills && slide.featurePills.length > 0 && (
                  <div className="pt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
                    {slide.featurePills.map((pill, pIdx) => (
                      <div
                        key={pIdx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs text-slate-100 transition-colors shadow-xs"
                      >
                        {pill.icon}
                        {pill.badge && (
                          <span className="font-bold text-amber-300/90 border-r border-white/20 pr-2">
                            {pill.badge}
                          </span>
                        )}
                        <span className="font-medium text-slate-200">{pill.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
                  <Link
                    href={slide.primaryCtaHref}
                    className={cn(
                      'w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-2',
                      slide.primaryCtaClass
                    )}
                  >
                    <span>{slide.primaryCtaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href={slide.secondaryCtaHref}
                    className={cn(
                      'w-full sm:w-auto px-7 py-3.5 rounded-full backdrop-blur-md font-semibold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-2',
                      slide.secondaryCtaClass
                    )}
                  >
                    <span>{slide.secondaryCtaText}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Prev Button */}
        <button
          type="button"
          onClick={handlePrev}
          className={cn(
            'absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg opacity-80 hover:opacity-100',
            activeSlide.arrowHoverClass
          )}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Floating Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className={cn(
            'absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg opacity-80 hover:opacity-100',
            activeSlide.arrowHoverClass
          )}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Sliding Window Controls & Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-20 flex items-center justify-between px-6 sm:px-10">
          {/* Slide Indicator Dots / Pills */}
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300',
                  currentIndex === idx
                    ? cn('w-9 shadow-md', activeSlide.activeDotClass)
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide Number Counter & Play/Pause */}
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-slate-200 shadow-xs">
              0{currentIndex + 1} / 0{HERO_SLIDES.length}
            </div>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-slate-300 hover:text-white transition-colors"
              aria-label={isPaused ? 'Resume auto slide' : 'Pause auto slide'}
              title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Docked Trust Stats Bar directly anchored under the sliding window */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-7xl mx-auto">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-[#0A192F]">100% Authentic</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Certified Products</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-[#0A192F]">Free Express</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">On Orders Over $99</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-[#0A192F]">30-Day Easy</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Hassle-Free Returns</span>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3 transition-transform hover:-translate-y-0.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-[#0A192F]">24/7 VIP Support</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Always Here For You</span>
          </div>
        </div>
      </div>
    </div>
  );
}
