'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import {
  Search,
  X,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  Trophy,
  Check,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const TRENDING_SEARCHES = ['Headphones', 'Desk Lamp', 'Cashmere', 'Leather Tote', 'Chelsea Boot', 'Candle', 'Serum'];

const QUICK_CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', icon: '⚡' },
  { name: 'Apparel', slug: 'apparel', icon: '👔' },
  { name: 'Footwear', slug: 'footwear', icon: '👞' },
  { name: 'Leather Goods', slug: 'leather-goods', icon: '👜' },
  { name: 'Home & Living', slug: 'home-living', icon: '🏡' },
  { name: 'Beauty', slug: 'beauty', icon: '✨' },
];

export function SearchOverlay() {
  const router = useRouter();
  const { isSearchOpen, closeSearch, formatAmount, addToCart, openCart } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const matched = await api.getProducts({ searchQuery: query });
      setResults(matched);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      closeSearch();
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colors[0]?.name || 'Standard';
    const defaultSize = product.sizes[0]?.name || 'One Size';
    addToCart(product, defaultColor, defaultSize, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  const matchingCategories = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return QUICK_CATEGORIES.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A192F]/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full bg-white border-b border-slate-200 shadow-2xl px-4 py-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header & Search Bar */}
          <div className="flex items-center gap-3 relative">
            <Search className="w-5 h-5 text-[#0066FF] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type to search (e.g. headphones, boots, lamp, cashmere) — Press Enter to search all..."
              className="w-full text-base md:text-lg bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-normal"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeSearch}
              className="text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#0066FF] hover:text-[#0066FF] text-slate-700 transition-colors ml-1"
            >
              Esc
            </button>
          </div>

          {/* Quick Suggestions & Categories when query is empty */}
          {!query && (
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] uppercase tracking-wider mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Trending JudesCart Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0066FF] text-slate-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Browse by Department
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {QUICK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-xs font-bold text-slate-700 hover:text-[#0066FF] transition-all"
                    >
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live Predictive Search Results */}
          {query && (
            <div className="mt-5 pt-4 border-t border-slate-100 max-h-[65vh] overflow-y-auto pr-1">
              {/* Category Match Suggestions */}
              {matchingCategories.length > 0 && (
                <div className="mb-4 flex items-center gap-2 flex-wrap pb-3 border-b border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">Matching Departments:</span>
                  {matchingCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      onClick={closeSearch}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold border border-blue-200 hover:bg-[#0066FF] hover:text-white transition-colors"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name} Department</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>{isLoading ? 'Searching...' : `Found ${results.length} matching products`}</span>
                {results.length > 0 && (
                  <Link
                    href={`/products?q=${encodeURIComponent(query)}`}
                    onClick={closeSearch}
                    className="text-[#0066FF] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>View all {results.length} in Catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {results.length === 0 && !isLoading ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-700">No products found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for headphones, boots, lamp, cashmere, or watch.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      className="group relative flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-[#0066FF] hover:bg-blue-50/40 bg-white transition-all shadow-xs"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={closeSearch}
                        className="relative w-16 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0"
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-[#0066FF] font-bold truncate">
                            {product.category.replace('-', ' ')}
                          </span>
                          {product.drawTier && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 uppercase">
                              {product.drawTier}
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/products/${product.slug}`}
                          onClick={closeSearch}
                          className="block text-sm font-bold text-[#0A192F] truncate group-hover:text-[#0066FF] transition-colors"
                        >
                          {product.name}
                        </Link>

                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#0A192F]">
                              {formatAmount(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatAmount(product.originalPrice)}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(e, product)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                              addedProductId === product.id
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 hover:bg-[#0066FF] hover:text-white text-slate-700'
                            }`}
                            title="Quick Add to Cart"
                          >
                            {addedProductId === product.id ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <ShoppingBag className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1" onClick={closeSearch} />
    </div>
  );
}

