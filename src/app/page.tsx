'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroCardsHub } from '@/components/home/HeroCardsHub';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Electronics & Audio',
    slug: 'electronics',
    tagline: 'High-fidelity acoustic drivers, studio audio & precision workspace essentials.',
    badge: 'EDITION 2026',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
    itemCount: '24 Pieces',
    gridClass: 'col-span-1 sm:col-span-2 lg:col-span-2 min-h-[160px] sm:min-h-[340px]',
  },
  {
    name: 'Apparel & Fashion',
    slug: 'apparel',
    tagline: 'Grade-A Mongolian cashmere, virgin Melton wool & pure mulberry silk.',
    badge: 'AUTUMN / WINTER',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=85',
    itemCount: '38 Pieces',
    gridClass: 'col-span-1 min-h-[145px] sm:min-h-[340px]',
  },
  {
    name: 'Footwear & Boots',
    slug: 'footwear',
    tagline: 'Weatherproof waxed suede, Goodyear welting & Vibram lug treads.',
    badge: 'HERITAGE CRAFT',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=700&q=85',
    itemCount: '19 Pairs',
    gridClass: 'col-span-1 min-h-[135px] sm:min-h-[300px]',
  },
  {
    name: 'Leather Goods & Bags',
    slug: 'leather-goods',
    tagline: 'Full-grain Tuscan calfskin, brass fittings & clean structured forms.',
    badge: 'TUSCAN LEATHER',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85',
    itemCount: '15 Bags',
    gridClass: 'col-span-1 min-h-[135px] sm:min-h-[300px]',
  },
  {
    name: 'Home, Living & Decor',
    slug: 'home-living',
    tagline: 'Japanese Hasami porcelain, cast iron accents & botanical wax candles.',
    badge: 'SCANDINAVIAN',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85',
    itemCount: '42 Objects',
    gridClass: 'col-span-1 min-h-[135px] sm:min-h-[300px]',
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty',
    tagline: 'Cold-pressed organic seed oils, cellular serums & restorative botanicals.',
    badge: 'BOTANICAL FORMULAS',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85',
    itemCount: '27 Formulas',
    gridClass: 'col-span-1 sm:col-span-2 lg:col-span-3 min-h-[140px] sm:min-h-[280px]',
  },
];

const FILTER_TABS = [
  { id: 'all', label: 'All Curations' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'apparel', label: 'Fashion' },
  { id: 'leather-goods', label: 'Leather Goods' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'home-living', label: 'Home & Living' },
] as const;

const TESTIMONIALS = [
  {
    quote: "The acoustic isolation and frequency balance on the SonicPro are genuinely impressive for daily studio monitoring. The industrial finish feels built to last.",
    author: 'David Keller',
    role: 'Acoustic Engineer',
    location: 'Berlin, DE',
    product: 'SonicPro Studio ANC',
  },
  {
    quote: 'The vegetable-tanned leather on the Sella Tote develops a remarkable patina over months of commuting. Clean edges and zero superfluous branding.',
    author: 'Clara Lindqvist',
    role: 'Architectural Designer',
    location: 'Stockholm, SE',
    product: 'Sella Structured Tote',
  },
  {
    quote: 'Rare to find an online store where the ceramics and cashmere are curated with this degree of restraint. Everything arrived in recyclable paper packing.',
    author: 'Julian Thorne',
    role: 'Design Director',
    location: 'London, UK',
    product: 'Hasami Ceramics & Knitwear',
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

      {/* 2. CURATED DEPARTMENTS / EDITORIAL GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-500 dark:text-stone-400 block mb-1">
              Curated Catalog
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              Shop by Department
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
              Precision acoustic hardware, Mongolian cashmere, vegetable-tanned leather, and Japanese ceramics.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold tracking-wider text-stone-900 dark:text-white hover:border-stone-400 hover:bg-stone-50 dark:hover:bg-slate-700 transition-all shrink-0 self-start sm:self-auto shadow-2xs"
          >
            <span>View All Works</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-stone-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-5 sm:p-8 ${cat.gridClass}`}
            >
              {/* Image Background */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Dynamic Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent group-hover:via-black/30 transition-colors duration-500" />

              {/* Top Floating Badge */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase bg-black/60 text-stone-200 backdrop-blur-md border border-white/15">
                  {cat.badge}
                </span>
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium bg-black/40 backdrop-blur-md text-stone-300 border border-white/10">
                  {cat.itemCount}
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 text-white space-y-1 sm:space-y-1.5">
                <span className="text-[9px] sm:text-xs uppercase tracking-widest text-stone-400 font-semibold block sm:hidden">
                  {cat.itemCount}
                </span>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base sm:text-2xl font-bold text-white group-hover:text-stone-200 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-300 line-clamp-1 max-w-lg font-light tracking-wide">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS WITH REFINED FILTER TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-500 dark:text-stone-400 block mb-1">
              Selected Works
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 dark:text-white">
              The Permanent Collection
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Enduring designs evaluated for material integrity, tactile pleasure, and long-term utility.
            </p>
          </div>

          {/* Minimalist Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 shadow-xs'
                      : 'bg-stone-100 dark:bg-slate-800/80 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-slate-700'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={displayedProducts} columns={3} />
      </section>

      {/* 4. THE JUDESCART STANDARD (EDITORIAL BRAND PILLARS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-900/60 p-6 sm:p-12 lg:p-16">
          <div className="max-w-3xl space-y-3 mb-10 sm:mb-14">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-500 dark:text-stone-400 block">
              Ethos &amp; Provenance
            </span>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight leading-tight">
              Retail Designed Around Material Integrity &amp; Restraint
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">
              We circumvent disposable consumer goods by collaborating directly with heritage tanneries, precision acoustic labs, and textile mills worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-stone-200 dark:border-slate-800">
            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700/60 shadow-2xs hover:shadow-md transition-all duration-300 space-y-3">
              <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-stone-700 dark:text-stone-300">
                01
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-wider uppercase text-stone-400 dark:text-stone-500 block mb-0.5">ORIGIN</span>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-white">
                  Direct Workshop Sourcing
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                Direct partnerships with verified workshops in Tuscany, Ulaanbaatar, and Shenzhen—eliminating distributor markups.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700/60 shadow-2xs hover:shadow-md transition-all duration-300 space-y-3">
              <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-stone-700 dark:text-stone-300">
                02
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-wider uppercase text-stone-400 dark:text-stone-500 block mb-0.5">MATERIALS</span>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-white">
                  Documented Composition
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                Full disclosure of every component: 2-ply Grade-A cashmere, vegetable-tanned leather, and beryllium drivers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700/60 shadow-2xs hover:shadow-md transition-all duration-300 space-y-3">
              <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-stone-700 dark:text-stone-300">
                03
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-wider uppercase text-stone-400 dark:text-stone-500 block mb-0.5">PACKAGING</span>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-white">
                  100% Recycled &amp; Plastic-Free
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                Dispatched in post-consumer recycled boxes sealed with water-activated paper tape and zero plastic fillers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-stone-200/80 dark:border-slate-700/60 shadow-2xs hover:shadow-md transition-all duration-300 space-y-3">
              <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-slate-700 flex items-center justify-center font-mono text-[11px] font-bold text-stone-700 dark:text-stone-300">
                04
              </div>
              <div>
                <span className="font-mono text-[10px] tracking-wider uppercase text-stone-400 dark:text-stone-500 block mb-0.5">GUARANTEE</span>
                <h4 className="font-display text-base font-bold text-stone-900 dark:text-white">
                  30-Day Living Guarantee
                </h4>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-light">
                Complimentary return shipping labels included with every order. Instant refunds upon carrier scan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NOTES FROM VERIFIED COLLECTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-500 dark:text-stone-400 block mb-1">
              Field Reports
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-stone-900 dark:text-white tracking-tight">
              Selected Reflections
            </h2>
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Archived long-term wear &amp; acoustic performance notes
          </div>
        </div>

        {/* Testimonials 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl sm:rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 flex flex-col justify-between space-y-5 shadow-2xs"
            >
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="pt-4 border-t border-stone-100 dark:border-slate-800 flex items-baseline justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-stone-900 dark:text-white">
                    {t.author}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-light">
                    {t.role} • {t.location}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  {t.product}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Discreet Service Badges Ribbon */}
        <div className="rounded-2xl bg-stone-50 dark:bg-slate-900/60 border border-stone-200/70 dark:border-slate-800 p-5 sm:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <h5 className="text-xs font-semibold text-stone-900 dark:text-white">Global Express Logistics</h5>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Dispatched within 24 business hours</p>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-stone-900 dark:text-white">30-Day Testing Period</h5>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Prepaid return label enclosed</p>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-stone-900 dark:text-white">Certified Workshop Origin</h5>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">100% genuine with factory warranty</p>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-stone-900 dark:text-white">256-Bit Encrypted Checkout</h5>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">Apple Pay, Google Pay &amp; credit card</p>
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
