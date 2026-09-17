'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroCardsHub } from '@/components/home/HeroCardsHub';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowUpRight,
  Zap,
  Headphones,
  Shirt,
  Footprints,
  Briefcase,
  Home,
  Star,
  CheckCircle2,
  Lock,
  Award,
} from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Electronics & Audio',
    slug: 'electronics',
    tagline: 'ANC Headphones, Qi Charging & Studio Sound',
    badge: '⚡ Flagship 2026',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
    itemCount: '24 Devices',
    gridClass: 'col-span-1 sm:col-span-2 lg:col-span-2 min-h-[160px] sm:min-h-[340px]',
  },
  {
    name: 'Apparel & Fashion',
    slug: 'apparel',
    tagline: 'Grade-A Cashmere, Melton Wool & Silk Charmeuse',
    badge: '✨ New Season',
    badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=85',
    itemCount: '38 Styles',
    gridClass: 'col-span-1 min-h-[145px] sm:min-h-[340px]',
  },
  {
    name: 'Footwear & Boots',
    slug: 'footwear',
    tagline: 'Weatherproof Waxed Suede & Vibram Outsoles',
    badge: '👞 Handcrafted',
    badgeColor: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=700&q=85',
    itemCount: '19 Pairs',
    gridClass: 'col-span-1 min-h-[135px] sm:min-h-[300px]',
  },
  {
    name: 'Leather Goods & Bags',
    slug: 'leather-goods',
    tagline: 'Tuscan Full-Grain Calfskin & Structured Totes',
    badge: '👑 Italian Craft',
    badgeColor: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85',
    itemCount: '15 Bags',
    gridClass: 'col-span-1 min-h-[135px] sm:min-h-[300px]',
  },
  {
    name: 'Home, Living & Decor',
    slug: 'home-living',
    tagline: 'Japanese Hasami Porcelain & Botanical Candles',
    badge: '🌿 Nordic Living',
    badgeColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85',
    itemCount: '42 Objects',
    gridClass: 'col-span-1 min-h-[135px] sm:min-h-[300px]',
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty',
    tagline: 'Pure Cold-Pressed Botanical Oils, Sea Buckthorn Nectar & Cellular Serums',
    badge: '🌸 Clean & Organic Formulas',
    badgeColor: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    itemCount: '27 Formulas',
    gridClass: 'col-span-1 sm:col-span-2 lg:col-span-3 min-h-[140px] sm:min-h-[280px]',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'All Curations', icon: Sparkles },
  { id: 'electronics', label: 'Electronics', icon: Headphones },
  { id: 'apparel', label: 'Fashion', icon: Shirt },
  { id: 'leather-goods', label: 'Leather Goods', icon: Briefcase },
  { id: 'footwear', label: 'Footwear', icon: Footprints },
  { id: 'home-living', label: 'Home & Living', icon: Home },
] as const;

const TESTIMONIALS = [
  {
    quote: "The SonicPro ANC headphones arrived in less than 48 hours. The build quality and soundstage rivals headphones double the price. JudesCart's curation is immaculate.",
    author: 'Sarah Montgomery',
    location: 'New York, USA',
    rating: 5,
    product: 'SonicPro Studio ANC Headphones',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    quote: 'The Sella Structured Tote in cognac leather is genuine artisanal work. You immediately notice the Tuscan calfskin grain and precision stitching. Highly impressed.',
    author: 'Marcus Vance',
    location: 'London, UK',
    rating: 5,
    product: 'Sella Structured Tote Cognac',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
  {
    quote: 'From customer support to the carbon-neutral packaging, JudesCart delivers an Apple-grade shopping experience. The botanical candle fills my entire studio.',
    author: 'Elena Rossi',
    location: 'Milan, Italy',
    rating: 5,
    product: 'Hesperis Sculpted Botanical Candle',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'electronics' | 'apparel' | 'leather-goods' | 'footwear' | 'home-living'>('all');

  useEffect(() => {
    async function loadData() {
      const items = await api.getFeaturedProducts();
      setFeaturedProducts(items);
    }
    loadData();
  }, []);

  const displayedProducts = activeTab === 'all'
    ? featuredProducts
    : featuredProducts.filter((p) => p.category === activeTab);

  return (
    <div className="space-y-14 sm:space-y-20 pb-20">
      {/* 1. HERO CAMPAIGN CARDS HUB (Interactive Offers Slider) */}
      <HeroCardsHub />

      {/* 2. CURATED DEPARTMENTS / ASYMMETRIC LUXURY BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              Shop by Department
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
              Explore rigorously verified consumer electronics, bespoke apparel, Tuscan leathers, and design-led home decor.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-[#0066FF] dark:text-blue-400 hover:border-[#0066FF] hover:bg-blue-50/50 dark:hover:bg-slate-700 transition-all shrink-0 self-start sm:self-auto shadow-xs"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-stone-200/80 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-500 flex flex-col justify-end p-4 sm:p-8 ${cat.gridClass}`}
            >
              {/* Image Background */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />

              {/* Dynamic Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070F1E] via-[#070F1E]/50 to-transparent group-hover:via-[#070F1E]/40 transition-colors duration-500" />

              {/* Top Floating Badge */}
              <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-10 flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold backdrop-blur-md border ${cat.badgeColor}`}>
                  {cat.badge}
                </span>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-md text-stone-300 border border-white/10">
                  {cat.itemCount}
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 text-white space-y-1 sm:space-y-2">
                <span className="text-[9px] sm:text-xs uppercase tracking-widest text-blue-400 font-bold block sm:hidden">
                  {cat.itemCount}
                </span>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans text-base sm:text-2xl font-black text-white group-hover:text-blue-300 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#0066FF] group-hover:border-[#0066FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <p className="text-[11px] sm:text-sm text-stone-300 line-clamp-1 max-w-lg font-normal">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS WITH LUXURY FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-[11px] uppercase tracking-widest font-bold text-amber-700 dark:text-amber-400 mb-2">
              <Zap className="w-3 h-3" />
              <span>Top Trending Picks</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              Featured at JudesCart
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Hand-picked bestsellers with verified customer satisfaction and manufacturer backing.
            </p>
          </div>

          {/* Luxury Filter Pills (Touch Momentum Edge-to-Edge Scroll on Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {FILTER_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/25 ring-2 ring-[#0066FF]/30'
                      : 'bg-white dark:bg-slate-800/90 text-stone-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:border-blue-400 hover:text-[#0066FF] dark:hover:text-blue-400'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-400 dark:text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={displayedProducts} columns={3} />
      </section>

      {/* 4. THE JUDESCART ADVANTAGE (LUXURY BENTO GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-xs uppercase tracking-widest font-bold text-[#0066FF] dark:text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The JudesCart Promise</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
            Designed for Modern Smart Living
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            We hold our catalog to uncompromising standards. Here is how we guarantee your satisfaction on every single order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Tile 1: Hero Tile (Span 2 cols on lg) */}
          <div className="lg:col-span-2 relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A192F] text-white p-5 sm:p-12 border border-blue-900/50 flex flex-col justify-between min-h-[240px] sm:min-h-[340px]">
            {/* Background Texture Overlay */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Clutter • 100% Vetted Curation</span>
              </div>
              <h3 className="font-sans text-2xl sm:text-3xl font-extrabold leading-tight max-w-xl text-white">
                Uncompromising Quality. Factory Direct. Fast Global Dispatch.
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-lg">
                At JudesCart, every headphone driver, cashmere stitch, and leather seam is evaluated for long-lasting performance before entering our collection.
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-blue-900/60 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-white">99.8% On-Time Fulfillment</span>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Certified Authentic</span>
                </div>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>Browse Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tile 2: Factory Direct Warranty */}
          <div className="bento-card rounded-2xl sm:rounded-3xl p-4.5 sm:p-8 flex flex-col justify-between space-y-3.5 sm:space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0066FF] dark:text-blue-400 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#0066FF]">100% Genuine</span>
                <h4 className="font-sans text-lg font-bold text-stone-900 dark:text-white mt-0.5">
                  1-Year Factory Warranty
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Every electronic gadget and lifestyle item comes with full manufacturer warranty coverage and dedicated replacement assistance.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              <span>Official Warranty Seal</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Guaranteed</span>
            </div>
          </div>

          {/* Tile 3: 30-Day Easy Returns */}
          <div className="bento-card rounded-2xl sm:rounded-3xl p-4.5 sm:p-8 flex flex-col justify-between space-y-3.5 sm:space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-xs">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-600">Zero Risk</span>
                <h4 className="font-sans text-lg font-bold text-stone-900 dark:text-white mt-0.5">
                  30-Day Hassle-Free Returns
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Changed your mind? Return eligible items within 30 days using prepaid shipping labels with instant automated refunds.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              <span>Instant Prepaid Labels</span>
              <span className="text-[#0066FF] dark:text-blue-400 font-bold">No Questions</span>
            </div>
          </div>

          {/* Tile 4: Carbon-Neutral & Eco Dispatch (Span 2 on lg) */}
          <div className="lg:col-span-2 bento-card rounded-2xl sm:rounded-3xl p-4.5 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                  Sustainable Logistics
                </span>
                <h4 className="font-sans text-lg font-bold text-stone-900 dark:text-white">
                  100% Carbon-Offset Delivery
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 max-w-lg leading-relaxed">
                  Every parcel is packaged with recycled, biodegradable materials and offset via certified global forestry programs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right">
                <span className="text-xs font-bold text-stone-900 dark:text-white block">Free Shipping</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">On all orders over $99</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED CUSTOMER TESTIMONIALS & TRUST SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-[11px] uppercase tracking-widest font-bold text-emerald-700 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Buyer Ratings</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
              Loved by 48,000+ Smart Shoppers
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span>4.9 / 5.0 Average Rating</span>
          </div>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bento-card rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between space-y-2.5 sm:space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-stone-200 dark:border-slate-700">
                  <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                    {t.author}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {t.location} • <span className="text-[#0066FF] dark:text-blue-400">{t.product}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Ribbon */}
        <div className="rounded-2xl bg-stone-100 dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 p-4 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Lock className="w-5 h-5 text-[#0066FF] shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-stone-900 dark:text-white">256-Bit SSL Encrypted</h5>
                <p className="text-[10px] text-stone-500">Bank-grade security on all checkouts</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Truck className="w-5 h-5 text-[#0066FF] shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-stone-900 dark:text-white">Tracked Express Delivery</h5>
                <p className="text-[10px] text-stone-500">Live SMS & email milestones</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <RefreshCw className="w-5 h-5 text-[#0066FF] shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-stone-900 dark:text-white">Easy 30-Day Returns</h5>
                <p className="text-[10px] text-stone-500">No questions asked guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Award className="w-5 h-5 text-[#0066FF] shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-stone-900 dark:text-white">100% Genuine Curation</h5>
                <p className="text-[10px] text-stone-500">Direct from vetted makers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECENTLY VIEWED CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <RecentlyViewed />
      </section>
    </div>
  );
}
