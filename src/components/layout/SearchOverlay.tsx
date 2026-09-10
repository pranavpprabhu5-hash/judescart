'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { Search, X, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const TRENDING_SEARCHES = ['Headphones', 'Desk Lamp', 'Cashmere', 'Leather Tote', 'Chelsea Boot', 'Candle', 'Serum'];

export function SearchOverlay() {
  const { isSearchOpen, closeSearch, formatAmount } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A192F]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full bg-white border-b border-slate-200 shadow-xl px-4 py-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header & Input */}
          <div className="flex items-center gap-3 relative">
            <Search className="w-5 h-5 text-[#0066FF]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all products (e.g. headphones, lamp, cashmere, tote, boots)..."
              className="w-full text-base md:text-lg bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 font-normal"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeSearch}
              className="text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-slate-200 hover:border-[#0066FF] hover:text-[#0066FF] text-slate-700 transition-colors ml-2"
            >
              Esc
            </button>
          </div>

          {/* Quick Suggestions */}
          {!query && (
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] uppercase tracking-wider mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending JudesCart Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0066FF] text-slate-700 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Search Results */}
          {query && (
            <div className="mt-6 pt-4 border-t border-slate-100 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                <span>{isLoading ? 'Searching...' : `Found ${results.length} results`}</span>
                {results.length > 0 && (
                  <Link
                    href={`/products?q=${encodeURIComponent(query)}`}
                    onClick={closeSearch}
                    className="text-[#0066FF] hover:underline flex items-center gap-1 font-bold"
                  >
                    <span>View all results</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {results.length === 0 && !isLoading ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="text-sm font-semibold text-slate-700">No results found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for headphones, cardigan, boots, or lamp.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={closeSearch}
                      className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/80 hover:border-[#0066FF] hover:bg-blue-50/40 transition-all"
                    >
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#0066FF] font-bold truncate">
                          {product.category.replace('-', ' ')}
                        </p>
                        <h4 className="text-sm font-bold text-[#0A192F] truncate group-hover:text-[#0066FF] transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-[#0A192F]">
                            {formatAmount(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-slate-400 line-through">
                              {formatAmount(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
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
