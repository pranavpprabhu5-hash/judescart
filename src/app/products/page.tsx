'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Product, ProductCategory, FilterState } from '@/types/product';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useStore } from '@/context/StoreContext';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'All Products', value: 'all' },
  { label: 'Electronics & Audio', value: 'electronics' },
  { label: 'Apparel & Fashion', value: 'apparel' },
  { label: 'Footwear & Boots', value: 'footwear' },
  { label: 'Leather Goods & Bags', value: 'leather-goods' },
  { label: 'Home & Living', value: 'home-living' },
  { label: 'Beauty & Wellness', value: 'beauty' },
];

const DRAW_FILTERS = [
  { label: 'All Lucky Draws', value: 'all' },
  { label: '🎟️ Platinum Draw', value: 'platinum' },
  { label: '🎟️ Gold Draw', value: 'gold' },
  { label: '🎟️ Silver Draw', value: 'silver' },
  { label: '👑 Brand JUDES Bumper', value: 'bumper' },
] as const;

const SORT_OPTIONS = [
  { label: 'Featured Recommendations', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Customer Rating', value: 'rating' },
  { label: 'Newest Arrivals', value: 'newest' },
] as const;

function ProductListingContent() {
  const searchParams = useSearchParams();
  const { formatAmount } = useStore();

  const urlCategory = (searchParams.get('category') as ProductCategory) || 'all';
  const urlSearch = searchParams.get('q') || '';
  const urlBrand = searchParams.get('brand') || '';
  const urlDraw = searchParams.get('draw') || 'all';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(urlCategory);
  const [selectedDrawTier, setSelectedDrawTier] = useState<string>(urlDraw);
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(800);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('featured');

  // Sync when URL params change
  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory);
    if (urlBrand) setSelectedBrand(urlBrand);
    if (urlDraw) setSelectedDrawTier(urlDraw);
  }, [urlCategory, urlBrand, urlDraw]);

  // Load products based on current filters
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const items = await api.getProducts({
        category: selectedCategory,
        drawTier: selectedDrawTier as any,
        brand: selectedBrand || undefined,
        minPrice,
        maxPrice,
        minRating,
        inStockOnly,
        sortBy,
        searchQuery: urlSearch,
      });
      setProducts(items);
      setLoading(false);
    }
    fetchProducts();
  }, [selectedCategory, selectedDrawTier, selectedBrand, minPrice, maxPrice, minRating, inStockOnly, sortBy, urlSearch]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedDrawTier !== 'all') count++;
    if (selectedBrand) count++;
    if (minPrice > 0 || maxPrice < 800) count++;
    if (minRating > 0) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, selectedDrawTier, selectedBrand, minPrice, maxPrice, minRating, inStockOnly]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedDrawTier('all');
    setSelectedBrand('');
    setMinPrice(0);
    setMaxPrice(800);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-stone-400 font-bold">
          <span className="text-[#0066FF]">JudesCart Store</span>
          <span>/</span>
          <span className="text-stone-900">
            {CATEGORIES.find((c) => c.value === selectedCategory)?.label || 'All Products'}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-stone-900">
              All Products Catalog
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
              Shop top-rated electronics, fashion apparel, footwear, bags, home essentials, and beauty objects.
            </p>
          </div>
          <span className="text-xs text-stone-500">
            Showing <strong className="text-stone-900 font-bold">{products.length}</strong> items
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
        {/* Mobile filter button */}
        <button
          type="button"
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-800 hover:bg-stone-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Category Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0',
                selectedCategory === cat.value
                  ? 'bg-[#0066FF] text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Right side: Sorting & View Mode */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as FilterState['sortBy'])}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-[#0066FF] transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Grid/List View Toggle */}
          <div className="hidden sm:flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-white shadow-sm text-[#0066FF]' : 'text-slate-400 hover:text-slate-700'
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-white shadow-sm text-[#0066FF]' : 'text-slate-400 hover:text-slate-700'
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 font-semibold mr-1">Active filters:</span>
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-semibold">
              Category: {CATEGORIES.find((c) => c.value === selectedCategory)?.label}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedDrawTier !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              Draw: {DRAW_FILTERS.find((d) => d.value === selectedDrawTier)?.label.replace(/^[^\s]+\s/, '') || selectedDrawTier}
              <button onClick={() => setSelectedDrawTier('all')} className="hover:text-amber-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedBrand && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand('')} className="hover:text-purple-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(minPrice > 0 || maxPrice < 800) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-semibold">
              Price: {formatAmount(minPrice)} - {formatAmount(maxPrice)}
              <button onClick={() => { setMinPrice(0); setMaxPrice(800); }} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-semibold">
              {minRating}★ and above
              <button onClick={() => setMinRating(0)} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-semibold">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs text-[#0066FF] hover:text-[#0052CC] underline ml-2 font-bold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-sans text-sm font-bold text-[#0A192F]">Refine Selection</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#0066FF] hover:text-[#0052CC] underline font-semibold"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Category</h4>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    'flex items-center justify-between w-full py-2 px-2.5 rounded-xl text-xs transition-colors text-left',
                    selectedCategory === cat.value
                      ? 'bg-blue-50 font-bold text-[#0066FF]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <span>{cat.label}</span>
                  {selectedCategory === cat.value && <Check className="w-3.5 h-3.5 text-[#0066FF]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Lucky Draw Eligibility */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Lucky Draw Eligibility</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">New</span>
            </div>
            <div className="space-y-1">
              {DRAW_FILTERS.map((df) => (
                <button
                  key={df.value}
                  onClick={() => setSelectedDrawTier(df.value)}
                  className={cn(
                    'flex items-center justify-between w-full py-2 px-2.5 rounded-xl text-xs transition-colors text-left',
                    selectedDrawTier === df.value
                      ? 'bg-amber-50 font-bold text-amber-900 border border-amber-200/80'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <span className="truncate">{df.label}</span>
                  {selectedDrawTier === df.value && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold uppercase tracking-wider text-slate-700">Price Range</h4>
              <span className="font-bold text-[#0066FF]">
                Up to {formatAmount(maxPrice)}
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={800}
              step={25}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#0066FF] cursor-pointer"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{formatAmount(50)}</span>
              <span>{formatAmount(800)}</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Customer Rating</h4>
            <div className="space-y-1">
              {[0, 4.5, 4.8].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setMinRating(stars)}
                  className={cn(
                    'flex items-center justify-between w-full py-2 px-2.5 rounded-xl text-xs transition-colors text-left',
                    minRating === stars
                      ? 'bg-blue-50 font-bold text-[#0066FF]'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <span>{stars === 0 ? 'All Ratings' : `${stars}★ & above`}</span>
                  {minRating === stars && <Check className="w-3.5 h-3.5 text-[#0066FF]" />}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]"
              />
              <span>In-stock pieces only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl shimmer-loading" />
              ))}
            </div>
          ) : (
            <ProductGrid products={products} viewMode={viewMode} columns={3} />
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0A192F]/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-sans text-base font-bold text-[#0A192F]">Filter Products</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Category</h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={cn(
                      'flex items-center justify-between w-full py-2 px-3 rounded-xl text-xs transition-colors text-left',
                      selectedCategory === cat.value
                        ? 'bg-[#0066FF] text-white font-bold'
                        : 'text-slate-700 bg-slate-50'
                    )}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Lucky Draw Eligibility */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Lucky Draw Eligibility</h4>
              <div className="space-y-1">
                {DRAW_FILTERS.map((df) => (
                  <button
                    key={df.value}
                    onClick={() => setSelectedDrawTier(df.value)}
                    className={cn(
                      'flex items-center justify-between w-full py-2 px-3 rounded-xl text-xs transition-colors text-left',
                      selectedDrawTier === df.value
                        ? 'bg-amber-100 text-amber-950 font-bold'
                        : 'text-slate-700 bg-slate-50'
                    )}
                  >
                    <span>{df.label}</span>
                    {selectedDrawTier === df.value && <Check className="w-3.5 h-3.5 text-amber-700" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold uppercase tracking-wider text-slate-700">Max Price</h4>
                <span className="font-bold text-[#0066FF]">{formatAmount(maxPrice)}</span>
              </div>
              <input
                type="range"
                min={50}
                max={800}
                step={25}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0066FF]"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]"
                />
                <span>In-Stock Only</span>
              </label>
            </div>

            <div className="pt-6 border-t border-slate-100 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052CC] shadow-md shadow-blue-500/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-xs text-slate-400">Loading JudesCart catalog...</div>}>
      <ProductListingContent />
    </Suspense>
  );
}
