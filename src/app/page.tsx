'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroSlider } from '@/components/home/HeroSlider';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, ArrowUpRight, Zap, Headphones, Laptop, Shirt, Watch, Home, Sparkle } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'Electronics & Audio',
    slug: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    itemCount: '24 Devices',
  },
  {
    name: 'Apparel & Fashion',
    slug: 'apparel',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80',
    itemCount: '38 Styles',
  },
  {
    name: 'Footwear & Boots',
    slug: 'footwear',
    image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80',
    itemCount: '19 Pairs',
  },
  {
    name: 'Leather Goods & Bags',
    slug: 'leather-goods',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    itemCount: '15 Bags',
  },
  {
    name: 'Home, Living & Decor',
    slug: 'home-living',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    itemCount: '42 Objects',
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    itemCount: '27 Formulas',
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
    <div className="space-y-12 sm:space-y-14 pb-20">
      {/* 1. HERO SLIDING WINDOW (Framed, non full-bleed) */}
      <HeroSlider />

      {/* 2. CURATED DEPARTMENTS / CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#0066FF]">All Departments</span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Shop by Department
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-[#0066FF] hover:text-blue-800 flex items-center gap-1.5 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[16/11] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex flex-col justify-end p-6"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/40 to-transparent" />
              <div className="relative z-10 text-white space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-blue-300 font-bold">{cat.itemCount}</span>
                <h3 className="font-sans text-xl font-bold group-hover:translate-x-1 transition-transform duration-200">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID WITH QUICK DEPARTMENT FILTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#0066FF]">Top Trending Picks</span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Featured at JudesCart
            </h2>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(['all', 'electronics', 'apparel', 'leather-goods', 'footwear', 'home-living'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 ${
                  activeTab === tab
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {tab === 'all' ? 'All Products' : tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <ProductGrid products={displayedProducts} columns={3} />
      </section>

      {/* 5. JUDESCART PROMISE & ADVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#0A192F] text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-14 lg:p-16 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-blue-400">
                <Zap className="w-4 h-4" />
                <span>The JudesCart Advantage</span>
              </div>

              <h2 className="font-sans text-3xl sm:text-4xl font-extrabold leading-tight">
                Curated Excellence. Unbeatable Speed. Shop More. Live Better.
              </h2>

              <p className="text-sm text-stone-300 leading-relaxed font-normal">
                At JudesCart, we eliminate the clutter of low-quality online storefronts. Every single item across our consumer tech, apparel, leather, footwear, and home collections is vetted for real-world excellence.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-900/60 text-xs text-stone-300">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Factory-Direct Warranty</h4>
                  <p className="text-[11px] text-stone-400 mt-1">Full 1-year manufacturer guarantee on all electronics and premium gear.</p>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Carbon-Neutral Dispatch</h4>
                  <p className="text-[11px] text-stone-400 mt-1">Every delivery is 100% carbon-offset in eco-friendly protective packaging.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-blue-400 transition-colors"
                >
                  <span>Explore the complete JudesCart catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-square lg:aspect-auto min-h-[360px]">
              <Image
                src="https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=85"
                alt="Modern electronics and lifestyle products at JudesCart"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
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
