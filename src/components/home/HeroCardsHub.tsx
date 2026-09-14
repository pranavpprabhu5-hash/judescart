'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types/product';

const CAMPAIGN_TABS = [
  { id: 'offers', label: 'Flash Deals', badgeColor: 'from-amber-500 to-orange-500', icon: Flame },
  { id: 'sales', label: 'Sale Events', badgeColor: 'from-indigo-500 to-blue-600', icon: Calendar },
  { id: 'draws', label: 'Lucky Draws', badgeColor: 'from-emerald-500 to-teal-600', icon: Trophy },
  { id: 'bumper', label: 'JUDES Jackpot', badgeColor: 'from-purple-500 to-amber-500', icon: Crown },
];

export function HeroCardsHub() {
  const { products, formatAmount, addToCart, openLuckyDraw } = useStore();

  // --------------------------------------------------------------------------
  // CARD 1: ITEMS WITH OFFERS (Deals Showcase)
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // MOBILE PARTIALLY OVERLAPPING CARDS CAROUSEL STATE & GESTURE LOGIC
  // --------------------------------------------------------------------------
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isHorizontalDragRef = useRef(false);
  const justSwipedRef = useRef(false);

  const handleNext = () => {
    setActiveCardIndex((prev) => (prev + 1) % 4);
    setDragOffset(0);
  };

  const handlePrev = () => {
    setActiveCardIndex((prev) => (prev - 1 + 4) % 4);
    setDragOffset(0);
  };

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalDragRef.current = false;
    setIsDragging(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // Detect horizontal drag vs vertical page scroll
    if (!isHorizontalDragRef.current) {
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isHorizontalDragRef.current = true;
        setIsDragging(true);
      }
    }

    if (isHorizontalDragRef.current) {
      // Elastic resistance
      setDragOffset(deltaX * 0.75);
    }
  };

  const onTouchEnd = () => {
    if (isHorizontalDragRef.current) {
      justSwipedRef.current = true;
      setTimeout(() => {
        justSwipedRef.current = false;
      }, 250);

      const threshold = 38;
      if (dragOffset < -threshold) {
        handleNext();
      } else if (dragOffset > threshold) {
        handlePrev();
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
    setIsDragging(false);
    isHorizontalDragRef.current = false;
  };

  // Mouse Drag Handlers (for Dev & Desktop preview)
  const isMouseDownRef = useRef(false);
  const onMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    touchStartXRef.current = e.clientX;
    touchStartYRef.current = e.clientY;
    isHorizontalDragRef.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    const deltaX = e.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 8) {
      isHorizontalDragRef.current = true;
      setIsDragging(true);
      setDragOffset(deltaX * 0.75);
    }
  };

  const onMouseUp = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      if (isHorizontalDragRef.current) {
        justSwipedRef.current = true;
        setTimeout(() => {
          justSwipedRef.current = false;
        }, 250);

        if (dragOffset < -38) {
          handleNext();
        } else if (dragOffset > 38) {
          handlePrev();
        } else {
          setDragOffset(0);
        }
      } else {
        setDragOffset(0);
      }
      setIsDragging(false);
      isHorizontalDragRef.current = false;
    }
  };

  // --------------------------------------------------------------------------
  // CARD RENDERERS
  // --------------------------------------------------------------------------
  const renderCard1 = (isMobile = false) => (
    <div className={`w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between ${isMobile ? 'p-3 sm:p-3.5' : 'p-3.5 sm:p-4 md:p-5 lg:p-6'} bg-gradient-to-b from-[#1c0d02] via-[#2a1304] to-[#120701] border border-amber-500/40 text-white relative select-none`}>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src={activeDeal?.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
          alt="Special Offers"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120701] via-[#120701]/80 to-transparent" />
      </div>

      <div className={`relative z-10 ${isMobile ? 'space-y-1.5' : 'space-y-2 sm:space-y-2.5 md:space-y-3'}`}>
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
          <h2 className={`font-sans ${isMobile ? 'text-sm sm:text-base' : 'text-sm sm:text-base md:text-lg lg:text-xl'} font-bold text-white leading-tight`}>
            Discounted &amp; Flash Deals
          </h2>
          {!isMobile && (
            <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 line-clamp-1">
              Handpicked premium products on immediate discount.
            </p>
          )}
        </div>

        {activeDeal && (
          <div className={`${isMobile ? 'p-1.5 sm:p-2 space-y-1.5' : 'p-2 sm:p-2.5 space-y-2'} rounded-lg bg-white/10 backdrop-blur-md border border-white/15`}>
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className={`relative ${isMobile ? 'w-9 h-9 sm:w-10 sm:h-10' : 'w-11 h-11 sm:w-12 sm:h-12'} rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/20`}>
                <Image
                  src={activeDeal.images[0]}
                  alt={activeDeal.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded text-[7px] sm:text-[8px] font-black bg-rose-600 text-white leading-none">
                  -{discountPercent}%
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${activeDeal.slug}`}
                  onClick={(e) => {
                    if (justSwipedRef.current) e.preventDefault();
                  }}
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
                {!isMobile && (
                  <span className="text-[9px] text-emerald-300 font-semibold block">
                    In Stock • Ready to Ship
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={(e) => {
                if (justSwipedRef.current) return;
                handleQuickAdd(activeDeal, e);
              }}
              className={`w-full ${isMobile ? 'py-1 px-2 text-[10px]' : 'py-1.5 px-2.5 text-[11px]'} rounded-md font-bold flex items-center justify-center gap-1 transition-all duration-200 shadow-xs cursor-pointer ${
                addedItemEffect === activeDeal.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/30 active:scale-98'
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

        {discountedProducts.length > 1 && (
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[8px] sm:text-[9px] text-stone-400 font-medium">
              Deal {activeDealIndex + 1} of {discountedProducts.length}
            </span>
            <div className="flex items-center gap-1">
              {discountedProducts.slice(0, 4).map((deal, idx) => (
                <button
                  key={deal.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (justSwipedRef.current) return;
                    setActiveDealIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
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

      <div className={`relative z-10 ${isMobile ? 'pt-1.5 mt-1' : 'pt-2 mt-2'} border-t border-white/10`}>
        <Link
          href="/products"
          onClick={(e) => {
            if (justSwipedRef.current) e.preventDefault();
          }}
          className={`group/link flex items-center justify-between ${isMobile ? 'text-[10px]' : 'text-[11px]'} font-bold text-amber-300 hover:text-amber-200 transition-colors`}
        >
          <span>Explore All Catalog Offers</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  const renderCard2 = (isMobile = false) => (
    <div className={`w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between ${isMobile ? 'p-3 sm:p-3.5' : 'p-3.5 sm:p-4 md:p-5 lg:p-6'} bg-gradient-to-b from-[#0a1128] via-[#11193d] to-[#070b1c] border border-indigo-500/40 text-white relative select-none`}>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80"
          alt="Sale Calendar"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b1c] via-[#070b1c]/80 to-transparent" />
      </div>

      <div className={`relative z-10 ${isMobile ? 'space-y-1.5' : 'space-y-2 sm:space-y-2.5 md:space-y-3'}`}>
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
          <h2 className={`font-sans ${isMobile ? 'text-sm sm:text-base' : 'text-sm sm:text-base md:text-lg lg:text-xl'} font-bold text-white leading-tight`}>
            Sale Days &amp; Events
          </h2>
          {!isMobile && (
            <p className="text-[11px] sm:text-xs text-indigo-200/80 mt-0.5 line-clamp-1">
              Judes Mega Autumn Bash arriving soon.
            </p>
          )}
        </div>

        <div className={`${isMobile ? 'p-1.5' : 'p-2 sm:p-2.5'} rounded-lg bg-white/10 backdrop-blur-md border border-white/15`}>
          <div className="text-[9px] font-extrabold text-indigo-300 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Autumn Bash Countdown</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
              <span className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-black text-white leading-none`}>
                {String(saleTimeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[7px] sm:text-[8px] text-indigo-200 uppercase font-bold">Days</span>
            </div>
            <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
              <span className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-black text-white leading-none`}>
                {String(saleTimeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[7px] sm:text-[8px] text-indigo-200 uppercase font-bold">Hours</span>
            </div>
            <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
              <span className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-black text-white leading-none`}>
                {String(saleTimeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[7px] sm:text-[8px] text-indigo-200 uppercase font-bold">Mins</span>
            </div>
            <div className="bg-black/40 rounded p-1 border border-indigo-400/20">
              <span className={`block ${isMobile ? 'text-xs' : 'text-sm'} font-black text-cyan-300 leading-none`}>
                {String(saleTimeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[7px] sm:text-[8px] text-indigo-200 uppercase font-bold">Secs</span>
            </div>
          </div>
        </div>

        <div className="p-1.5 rounded-md bg-white/5 border border-white/10 flex items-center justify-between text-[9px] sm:text-[10px]">
          <span className="font-semibold text-slate-200 truncate">Sept 18–22: Mega Autumn Bash</span>
          <span className="font-bold text-amber-300 shrink-0 ml-1">Up to 60%</span>
        </div>

        <button
          onClick={() => {
            if (justSwipedRef.current) return;
            setReminderActive(!reminderActive);
          }}
          className={`w-full ${isMobile ? 'py-1 px-2 text-[10px]' : 'py-1.5 px-2.5 text-[11px]'} rounded-md font-bold flex items-center justify-center gap-1 transition-all duration-200 shadow-xs cursor-pointer ${
            reminderActive
              ? 'bg-indigo-600 text-white border border-indigo-400'
              : 'bg-white/15 hover:bg-white/25 text-indigo-200 border border-white/20 active:scale-98'
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

      <div className={`relative z-10 ${isMobile ? 'pt-1.5 mt-1' : 'pt-2 mt-2'} border-t border-white/10`}>
        <Link
          href="/products"
          onClick={(e) => {
            if (justSwipedRef.current) e.preventDefault();
          }}
          className={`group/link flex items-center justify-between ${isMobile ? 'text-[10px]' : 'text-[11px]'} font-bold text-indigo-300 hover:text-indigo-200 transition-colors`}
        >
          <span>Preview Early-Bird Catalog</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  const renderCard3 = (isMobile = false) => (
    <div className={`w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between ${isMobile ? 'p-3 sm:p-3.5' : 'p-3.5 sm:p-4 md:p-5 lg:p-6'} bg-gradient-to-b from-[#02231c] via-[#04382c] to-[#011c16] border border-emerald-500/40 text-white relative select-none`}>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80"
          alt="Lucky Draws"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#011c16] via-[#011c16]/80 to-transparent" />
      </div>

      <div className={`relative z-10 ${isMobile ? 'space-y-1.5' : 'space-y-2 sm:space-y-2.5 md:space-y-3'}`}>
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
          <h2 className={`font-sans ${isMobile ? 'text-sm sm:text-base' : 'text-sm sm:text-base md:text-lg lg:text-xl'} font-bold text-white leading-tight`}>
            Shop &amp; Win Every Week
          </h2>
          {!isMobile && (
            <p className="text-[11px] sm:text-xs text-emerald-200/80 mt-0.5 line-clamp-1">
              Receive verified tickets for qualifying orders.
            </p>
          )}
        </div>

        <div className="space-y-1">
          <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-[9px]">
                💎
              </span>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-white leading-none block">Platinum Tier</span>
                <span className="text-[8px] sm:text-[9px] text-emerald-200">iPhone 16 Pro &amp; Macs</span>
              </div>
            </div>
            <span className="text-[8px] sm:text-[9px] font-extrabold text-amber-300 bg-amber-400/10 px-1.5 py-0.2 rounded">
              &gt;₹5,000
            </span>
          </div>

          <div className="p-1 sm:p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-emerald-400/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-[9px]">
                🥇
              </span>
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-white leading-none block">Gold Tier</span>
                <span className="text-[8px] sm:text-[9px] text-emerald-200">Apple Watch &amp; Audio</span>
              </div>
            </div>
            <span className="text-[8px] sm:text-[9px] font-extrabold text-blue-300 bg-blue-400/10 px-1.5 py-0.2 rounded">
              ₹2,500+
            </span>
          </div>

          {!isMobile && (
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
          )}
        </div>

        <button
          onClick={() => {
            if (justSwipedRef.current) return;
            openLuckyDraw();
          }}
          className={`w-full ${isMobile ? 'py-1 px-2 text-[10px]' : 'py-1.5 px-2.5 text-[11px]'} rounded-md font-bold flex items-center justify-center gap-1 transition-all duration-200 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-xs cursor-pointer active:scale-98`}
        >
          <Trophy className="w-3 h-3 text-amber-200" />
          <span>Open Prize Wheel</span>
        </button>
      </div>

      <div className={`relative z-10 ${isMobile ? 'pt-1.5 mt-1' : 'pt-2 mt-2'} border-t border-white/10`}>
        <Link
          href="/lucky-draw#regular-draws"
          onClick={(e) => {
            if (justSwipedRef.current) e.preventDefault();
          }}
          className={`group/link flex items-center justify-between ${isMobile ? 'text-[10px]' : 'text-[11px]'} font-bold text-emerald-300 hover:text-emerald-200 transition-colors`}
        >
          <span>Weekly Draw Rules</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  const renderCard4 = (isMobile = false) => (
    <div className={`w-full h-full rounded-2xl overflow-hidden flex flex-col justify-between ${isMobile ? 'p-3 sm:p-3.5' : 'p-3.5 sm:p-4 md:p-5 lg:p-6'} bg-gradient-to-b from-[#1b0633] via-[#2f0d57] to-[#120324] border border-amber-400/50 text-white relative select-none`}>
      <div className="absolute inset-0 z-0 opacity-25 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80"
          alt="Bumper Draw"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120324] via-[#120324]/80 to-transparent" />
      </div>

      <div className={`relative z-10 ${isMobile ? 'space-y-1.5' : 'space-y-2 sm:space-y-2.5 md:space-y-3'}`}>
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
          <h2 className={`font-sans ${isMobile ? 'text-sm sm:text-base' : 'text-sm sm:text-base md:text-lg lg:text-xl'} font-bold text-white leading-tight`}>
            Grand Bumper Jackpot
          </h2>
          {!isMobile && (
            <p className="text-[11px] sm:text-xs text-amber-200/90 mt-0.5 line-clamp-1">
              Every Brand JUDES product enters automatically.
            </p>
          )}
        </div>

        <div className={`${isMobile ? 'p-1.5 space-y-1' : 'p-2 space-y-1.5'} rounded-lg bg-white/10 backdrop-blur-md border border-amber-400/30`}>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white">
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xs shrink-0">
              🚗
            </span>
            <span className="font-bold text-amber-200 truncate">Luxury SUV &amp; Vehicle</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white">
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-pink-400/20 border border-pink-400/40 flex items-center justify-center text-xs shrink-0">
              ✈️
            </span>
            <span className="font-bold text-pink-200 truncate">7-Day International Tour</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-white">
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-xs shrink-0">
              💰
            </span>
            <span className="font-bold text-yellow-200 truncate">₹5,00,000 Cash Spree</span>
          </div>
        </div>

        <Link
          href="/products?brand=JUDES"
          onClick={(e) => {
            if (justSwipedRef.current) e.preventDefault();
          }}
          className={`w-full ${isMobile ? 'py-1 px-2 text-[10px]' : 'py-1.5 px-2.5 text-[11px]'} rounded-md font-black flex items-center justify-center gap-1 transition-all duration-200 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 shadow-xs active:scale-98`}
        >
          <Crown className="w-3 h-3 text-slate-950" />
          <span>Shop Brand JUDES</span>
        </Link>
      </div>

      <div className={`relative z-10 ${isMobile ? 'pt-1.5 mt-1' : 'pt-2 mt-2'} border-t border-white/10`}>
        <Link
          href="/lucky-draw#bumper-draw"
          onClick={(e) => {
            if (justSwipedRef.current) e.preventDefault();
          }}
          className={`group/link flex items-center justify-between ${isMobile ? 'text-[10px]' : 'text-[11px]'} font-bold text-amber-300 hover:text-amber-200 transition-colors`}
        >
          <span>View Bumper Draw Rules</span>
          <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );

  const cardRenderers = [renderCard1, renderCard2, renderCard3, renderCard4];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      {/* SECTION HEADER TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover JudesCart Campaigns
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Explore today&apos;s hottest price drops, upcoming sale dates, weekly lucky draws, and the signature Brand JUDES bumper jackpot.
        </p>
      </div>

      {/* =========================================================================
          1. MOBILE VIEW: STACKED CARD DECK (ONE ON TOP OF THE OTHER, NO PARTIAL OVERLAP)
          ========================================================================= */}
      <div className="block md:hidden pb-3">
        {/* Category Pill Switcher for direct jump */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none pb-2.5 pt-1 px-1">
          {CAMPAIGN_TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeCardIndex === idx;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCardIndex(idx);
                  setDragOffset(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-r ${tab.badgeColor} text-white shadow-md scale-102`
                    : 'bg-stone-200/70 dark:bg-slate-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-slate-700'
                }`}
                aria-label={`Jump to ${tab.label}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stacked Card Deck Stage (Cards stacked directly on top of each other, no side partial overlap) */}
        <div
          className="relative w-full max-w-[340px] sm:max-w-[370px] h-[260px] sm:h-[275px] mx-auto flex items-center justify-center select-none touch-pan-y cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {cardRenderers.map((renderer, idx) => {
            // Circular shortest distance from active card
            let diff = (idx - activeCardIndex + 4) % 4;

            let zIndex = 10;
            let scale = 0.92;
            let translateY = 12;
            let opacity = 0;
            let filter = 'brightness(0.7)';
            let pointerEvents: 'auto' | 'none' = 'none';
            let shadowClass = 'shadow-md';

            if (diff === 0) {
              // Active Front Card (Directly on top)
              zIndex = 30;
              scale = isDragging ? Math.max(0.96, 1 - Math.abs(dragOffset) * 0.0006) : 1;
              translateY = 0;
              opacity = 1;
              filter = 'brightness(1)';
              pointerEvents = 'auto';
              shadowClass = 'shadow-xl ring-1 ring-white/20';
            } else if (diff === 1) {
              // Card directly underneath active card in the deck
              zIndex = 20;
              const dragProgress = Math.min(1, Math.abs(dragOffset) / 140);
              scale = 0.96 + dragProgress * 0.04;
              translateY = 6 - dragProgress * 6;
              opacity = 0.85 + dragProgress * 0.15;
              filter = `brightness(${0.85 + dragProgress * 0.15})`;
              pointerEvents = 'none';
              shadowClass = 'shadow-md';
            } else if (diff === 2) {
              // 3rd card in stack
              zIndex = 10;
              scale = 0.92;
              translateY = 12;
              opacity = 0.35;
              filter = 'brightness(0.65)';
              pointerEvents = 'none';
            } else {
              // Back/Previous Card (diff === 3)
              zIndex = 5;
              scale = 0.88;
              translateY = 16;
              opacity = 0;
              pointerEvents = 'none';
            }

            const currentDragX = diff === 0 ? dragOffset : 0;

            return (
              <div
                key={idx}
                style={{
                  transform: `translate3d(${currentDragX}px, ${translateY}px, 0) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter,
                  pointerEvents,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease, filter 0.3s ease',
                  transformOrigin: 'center bottom',
                }}
                className={`absolute inset-0 w-full h-full rounded-2xl will-change-transform ${shadowClass}`}
              >
                {renderer(true)}
              </div>
            );
          })}
        </div>

        {/* Mobile Swipe Navigation Controls & Dot Indicators */}
        <div className="flex items-center justify-between mt-3 px-3 max-w-[340px] sm:max-w-[370px] mx-auto">
          {/* Previous Card Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Campaign Card"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-sm text-stone-700 dark:text-stone-300 hover:text-blue-600 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Active Dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((dotIdx) => {
              const isCurrent = activeCardIndex === dotIdx;
              return (
                <button
                  key={dotIdx}
                  onClick={() => {
                    setActiveCardIndex(dotIdx);
                    setDragOffset(0);
                  }}
                  aria-label={`Go to card ${dotIdx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'w-6 bg-[#0066FF]'
                      : 'w-1.5 bg-stone-300 dark:bg-slate-700 hover:bg-stone-400'
                  }`}
                />
              );
            })}
          </div>

          {/* Next Card Button */}
          <button
            onClick={handleNext}
            aria-label="Next Campaign Card"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 shadow-sm text-stone-700 dark:text-stone-300 hover:text-blue-600 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. DESKTOP VIEW: MULTI-COLUMN RESPONSIVE GRID (md: and above)
          ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        <div className="w-full h-full">{renderCard1(false)}</div>
        <div className="w-full h-full">{renderCard2(false)}</div>
        <div className="w-full h-full">{renderCard3(false)}</div>
        <div className="w-full h-full">{renderCard4(false)}</div>
      </div>
    </section>
  );
}
