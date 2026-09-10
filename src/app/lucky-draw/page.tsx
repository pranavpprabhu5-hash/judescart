'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Trophy,
  Crown,
  Gift,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calculator,
  Flame,
  Award,
  Zap,
  ShoppingBag,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/mock-data';
import { Product } from '@/types/product';
import { useStore } from '@/context/StoreContext';
import { cn } from '@/lib/utils';
import { LiveDrawCountdown } from '@/components/luckydraw/LiveDrawCountdown';
import { RecentWinnersTicker } from '@/components/luckydraw/RecentWinnersTicker';

interface DrawTierInfo {
  id: 'platinum' | 'gold' | 'silver';
  name: string;
  badge: string;
  badgeColor: string;
  borderHover: string;
  tierHighlight: string;
  schedule: string;
  nextDrawDate: string;
  grandPrizes: string[];
  description: string;
  icon: React.ReactNode;
}

const REGULAR_DRAWS: DrawTierInfo[] = [
  {
    id: 'platinum',
    name: 'Platinum Draw',
    badge: 'Monthly Luxury Draw',
    badgeColor: 'bg-amber-500/15 text-amber-800 border-amber-300',
    borderHover: 'hover:border-amber-400',
    tierHighlight: 'Flagship Tech & Luxury Collections',
    schedule: 'Drawn Monthly (1st of Every Month)',
    nextDrawDate: 'October 1, 2026',
    grandPrizes: [
      'Apple iPhone 16 Pro Max 256GB',
      'Apple MacBook Air M3 (Space Black)',
      'Sony Bravia 65" 4K HDR Smart OLED',
      '₹50,000 JudesCart Shopping Spree',
    ],
    description:
      'Our highest tier! Automatically unlocked whenever you purchase any premium product (including flagship audio, virgin wool coats, and fine Italian leather).',
    icon: <Trophy className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 'gold',
    name: 'Gold Draw',
    badge: 'Bi-Weekly Premium Draw',
    badgeColor: 'bg-blue-500/15 text-blue-800 border-blue-300',
    borderHover: 'hover:border-blue-400',
    tierHighlight: 'Smart Gear, Designer Boots & Apparel',
    schedule: 'Drawn Bi-Weekly (Every 14 Days)',
    nextDrawDate: 'September 24, 2026',
    grandPrizes: [
      'Apple Watch Series 10 (Cellular)',
      'Sony WH-1000XM5 Wireless Headphones',
      'Dyson Supersonic Hair Dryer',
      '₹20,000 JudesCart Cash Voucher',
    ],
    description:
      'Mid-tier luxury draw! Earn entries with every purchase of smart ambient living gear, luxury boots, and curated apparel.',
    icon: <Award className="w-5 h-5 text-[#0066FF]" />,
  },
  {
    id: 'silver',
    name: 'Silver Draw',
    badge: 'Weekly Sunday Draw',
    badgeColor: 'bg-slate-500/15 text-slate-800 border-slate-300',
    borderHover: 'hover:border-slate-400',
    tierHighlight: 'Everyday Essentials & Lifestyle Goods',
    schedule: 'Drawn Weekly (Every Sunday 8 PM)',
    nextDrawDate: 'Sunday, September 14, 2026',
    grandPrizes: [
      'Apple AirPods 4 with ANC',
      'Marshall Emberton II Bluetooth Speaker',
      'Ninja Precision Air Fryer',
      '₹5,000 JudesCart Store Credit',
    ],
    description:
      'Our weekly volume draw! Every accessible purchase enters you into the Sunday evening cash and gadget raffle.',
    icon: <Gift className="w-5 h-5 text-cyan-600" />,
  },
];

export default function LuckyDrawPage() {
  const { formatAmount } = useStore();
  const [selectedTier, setSelectedTier] = useState<'platinum' | 'gold' | 'silver'>('platinum');
  const [simulatedProductId, setSimulatedProductId] = useState(PRODUCTS[0].id);

  const activeDrawInfo = REGULAR_DRAWS.find((d) => d.id === selectedTier) || REGULAR_DRAWS[0];
  const qualifyingProducts = PRODUCTS.filter((p) => {
    if (selectedTier === 'platinum') return p.drawTier === 'platinum' || p.drawTier === 'tier-1';
    if (selectedTier === 'gold') return p.drawTier === 'gold' || p.drawTier === 'tier-2';
    if (selectedTier === 'silver') return p.drawTier === 'silver' || p.drawTier === 'tier-3';
    return false;
  });
  const judesBrandProducts = PRODUCTS.filter((p) => p.brand === 'JUDES');
  const simulatedProduct = PRODUCTS.find((p) => p.id === simulatedProductId) || PRODUCTS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A192F] via-[#0D2342] to-[#0A192F] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/40">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#0066FF]/25 via-cyan-400/20 to-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-cyan-300 text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>JudesCart Official Draw Engine</span>
          </div>

          <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Platinum, Gold &amp; Silver Draws. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-amber-300">
              Plus The Brand JUDES Mega Bumper Draw.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            At JudesCart, every order earns you verifiable draw tickets! We feature <strong>Platinum, Gold &amp; Silver draws</strong>, plus an exclusive <strong>6 to 12 Month Grand Bumper Draw</strong> dedicated exclusively to our in-house brand <strong>JUDES</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Platinum Draw (Monthly)
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              Gold Draw (Bi-Weekly)
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Gift className="w-3.5 h-3.5 text-cyan-400" />
              Silver Draw (Weekly)
            </span>
            <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-purple-500/20 px-3 py-1.5 rounded-full border border-amber-400/30 text-amber-300">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Brand JUDES Bumper (Every 6–12M)
            </span>
          </div>
        </div>
      </section>

      {/* LIVE COUNTDOWN & RECENT WINNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 space-y-6">
        <LiveDrawCountdown />
        <RecentWinnersTicker />
      </section>

      {/* 2. PLATINUM, GOLD & SILVER DRAWS */}
      <section id="regular-draws" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF]">
                Tiered Reward Structure
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A192F] mt-1">
                The Platinum, Gold &amp; Silver Draws
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your draw eligibility is determined automatically by qualifying items in your cart.
              </p>
            </div>

            {/* Tier Selector Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
              {REGULAR_DRAWS.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    selectedTier === tier.id
                      ? 'bg-white text-[#0A192F] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  {tier.icon}
                  <span>{tier.name.replace(' Draw', '')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Tier Spotlight Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className={cn('px-3 py-1 rounded-full text-xs font-black border', activeDrawInfo.badgeColor)}>
                  {activeDrawInfo.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0066FF]" />
                  {activeDrawInfo.schedule}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0A192F]">{activeDrawInfo.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                  {activeDrawInfo.description}
                </p>
              </div>

              {/* Prize Pool showcase */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#0A192F] block">
                  Featured Grand Prizes In Next Draw ({activeDrawInfo.nextDrawDate}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeDrawInfo.grandPrizes.map((prize, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-2.5 text-xs font-bold text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{prize}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={`/products?draw=${activeDrawInfo.id}`}
                  className="py-3 px-5 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/25 flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Eligible Products For {activeDrawInfo.name}</span>
                </Link>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Next Draw on {activeDrawInfo.nextDrawDate}</span>
                </div>
              </div>
            </div>

            {/* Qualifying Products List for this tier */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#0A192F]">
                  Qualifying Products ({qualifyingProducts.length})
                </span>
                <span className="text-[10px] text-[#0066FF] font-bold">1 Order = 1 Ticket</span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {qualifyingProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="group p-3 rounded-xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-sm transition-all flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-extrabold text-[#0A192F]">{formatAmount(p.price)}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">Eligible Item</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066FF] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEGA BUMPER DRAW (EVERY 6 TO 12 MONTHS - BRAND JUDES EXCLUSIVE) */}
      <section id="bumper-draw" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A192F] via-[#0A2540] to-[#0A192F] text-white p-8 sm:p-12 lg:p-16 border-2 border-amber-400/40 shadow-2xl">
          {/* Decorative ambient background glows */}
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-br from-amber-400/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-widest uppercase">
                <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Held Every 6 to 12 Months • Mega Jackpot</span>
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                The Grand Bumper Draw. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
                  Exclusive to Brand &ldquo;JUDES&rdquo;.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Held every <strong>6 to 12 months</strong>, the JudesCart Grand Bumper Draw is our most prestigious event. Entry is strictly exclusive to customers who purchase items from JudesCart’s own signature in-house brand: <strong>JUDES</strong>.
              </p>

              {/* Bumper Prizes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/30 backdrop-blur-xs space-y-1">
                  <span className="text-2xl">🚗</span>
                  <h4 className="text-xs font-black uppercase text-amber-300">1st Mega Prize</h4>
                  <p className="text-xs text-white font-bold">Brand New Luxury Electric SUV / Car</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/30 backdrop-blur-xs space-y-1">
                  <span className="text-2xl">✈️</span>
                  <h4 className="text-xs font-black uppercase text-amber-300">2nd Mega Prize</h4>
                  <p className="text-xs text-white font-bold">7-Day International Luxury Tour for 2</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/30 backdrop-blur-xs space-y-1">
                  <span className="text-2xl">💰</span>
                  <h4 className="text-xs font-black uppercase text-amber-300">3rd Mega Prize</h4>
                  <p className="text-xs text-white font-bold">₹5,00,000 Direct Cash Grand Jackpot</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products?brand=JUDES"
                  className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#0A192F] text-xs font-black transition-all shadow-lg shadow-amber-400/25 flex items-center gap-2"
                >
                  <Crown className="w-4 h-4 text-[#0A192F]" />
                  <span>Shop Official &ldquo;JUDES&rdquo; Brand Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <span className="text-xs text-slate-300 font-medium">
                  Next Grand Bumper Draw in: <strong>178 Days (March 2027)</strong>
                </span>
              </div>
            </div>

            {/* Brand JUDES showcase cards */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-amber-300">
                  <Crown className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">Brand JUDES Collection</span>
                </div>
                <span className="text-[10px] text-slate-300">Bumper Eligible</span>
              </div>

              <div className="space-y-3">
                {judesBrandProducts.slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="group p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-3"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                      <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-extrabold text-amber-300">Brand JUDES</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-200">
                          Bumper Token
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate mt-0.5">
                        {item.name}
                      </h4>
                      <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                        {formatAmount(item.price)}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE DRAW TICKET SIMULATOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-[#0066FF]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF]">
                Ticket Calculator
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0A192F]">
                Test Which Draw Your Order Unlocks
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Select any product from the catalog below to test and see exactly which regular draw and bumper tokens you will be awarded at checkout.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
            {/* Selector */}
            <div className="lg:col-span-6 space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select a Product to Calculate:
              </label>
              <select
                value={simulatedProductId}
                onChange={(e) => setSimulatedProductId(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0066FF] cursor-pointer"
              >
                {PRODUCTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatAmount(item.price)}) — Brand: {item.brand || 'Partner'}
                  </option>
                ))}
              </select>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Retail Price:</span>
                  <span className="font-extrabold text-[#0A192F]">{formatAmount(simulatedProduct.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Brand Owner:</span>
                  <span className="font-bold text-slate-900">{simulatedProduct.brand || 'Partner Brand'}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-700 font-bold">Draw Tier Awarded:</span>
                  <span className="font-black text-[#0066FF] text-sm capitalize">
                    {simulatedProduct.drawTier ? `${simulatedProduct.drawTier.replace('tier-1', 'platinum').replace('tier-2', 'gold').replace('tier-3', 'silver')} Draw` : 'Standard Entry'}
                  </span>
                </div>
              </div>
            </div>

            {/* Result Card */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 to-slate-50 border-2 border-[#0066FF]/30 space-y-4 shadow-sm">
              <span className="text-xs font-black uppercase tracking-wider text-[#0066FF] block">
                Automatic Draw Entries Awarded:
              </span>

              <div className="space-y-2.5">
                {(simulatedProduct.drawTier === 'platinum' || simulatedProduct.drawTier === 'tier-1') && (
                  <div className="p-3.5 rounded-xl bg-white border border-amber-300 shadow-2xs flex items-center gap-3">
                    <span className="text-xl">🏆</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-amber-900">
                        1x Platinum Draw Ticket
                      </h4>
                      <p className="text-[11px] text-slate-500">Qualifies for Monthly iPhone 16 Pro &amp; MacBook Air draw</p>
                    </div>
                  </div>
                )}

                {(simulatedProduct.drawTier === 'gold' || simulatedProduct.drawTier === 'tier-2') && (
                  <div className="p-3.5 rounded-xl bg-white border border-blue-300 shadow-2xs flex items-center gap-3">
                    <span className="text-xl">🥇</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-blue-900">
                        1x Gold Draw Ticket
                      </h4>
                      <p className="text-[11px] text-slate-500">Qualifies for Bi-Weekly Apple Watch &amp; Sony Headphones draw</p>
                    </div>
                  </div>
                )}

                {(simulatedProduct.drawTier === 'silver' || simulatedProduct.drawTier === 'tier-3') && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-2xs flex items-center gap-3">
                    <span className="text-xl">🥈</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        1x Silver Draw Ticket
                      </h4>
                      <p className="text-[11px] text-slate-500">Qualifies for Weekly Sunday AirPods &amp; Cash Credit draw</p>
                    </div>
                  </div>
                )}

                {simulatedProduct.brand === 'JUDES' ? (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-400 shadow-2xs flex items-center gap-3">
                    <Crown className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black text-[#0A192F]">
                        1x Official JUDES Golden Bumper Draw Token
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Exclusive brand entry! Qualifies for the 6–12 Month Luxury Car &amp; ₹5,00,000 Grand Jackpot.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-[11px]">
                    ℹ️ This product is from an external partner. Buy any <strong>JUDES</strong> brand item to also unlock the 6–12 Month Mega Bumper Draw.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS 3-STEP GUIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0066FF]">Transparent Rules</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F]">
            How JudesCart Draw Entries Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-[#0A192F]">Automated Ticket Allocation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every item in your order is checked for draw eligibility (Platinum, Gold, or Silver). Digital tickets are attached directly to your order ID.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-[#0A192F]">JUDES Brand Bumper Token</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Whenever your cart includes products from JudesCart’s in-house brand &ldquo;JUDES&rdquo;, you automatically receive a Golden Bumper Token for the 6–12 month grand car &amp; cash jackpot.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-[#0A192F]">Verifiable Live RNG Draws</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Draws are executed using a verifiable random algorithm on our public portal. Winners are notified via SMS/email and prizes are dispatched to their registered address.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
