'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { RatingStars } from '@/components/ui/RatingStars';
import { calculatePurchaseCoins } from '@/lib/utils';
import {
  X,
  Scale,
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Crown,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductComparisonDrawer() {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isCompareOpen,
    openCompare,
    closeCompare,
    formatAmount,
    addToCart,
  } = useStore();

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Persistent Floating Dock (bottom right) */}
      {!isCompareOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0A192F]/95 backdrop-blur-md text-white shadow-2xl border border-white/20 flex items-center gap-3">
            {/* Thumbnails preview */}
            <div className="flex items-center -space-x-2">
              {compareList.map((prod) => (
                <div
                  key={prod.id}
                  className="relative w-8 h-8 rounded-full border-2 border-[#0A192F] overflow-hidden bg-slate-100"
                  title={prod.name}
                >
                  <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                </div>
              ))}
            </div>

            <div className="text-xs">
              <span className="font-bold text-amber-400 block sm:inline">Compare</span>{' '}
              <span className="text-slate-300 font-medium">({compareList.length}/4 items)</span>
            </div>

            <div className="flex items-center gap-1.5 pl-1">
              <button
                onClick={openCompare}
                className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare Now</span>
              </button>

              <button
                onClick={clearCompare}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Clear comparison list"
                aria-label="Clear comparison list"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Modal Comparison Matrix */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A192F]/75 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
          <div className="fixed inset-0" onClick={closeCompare} aria-hidden="true" />

          <div className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0A192F] via-[#112240] to-[#0A192F] text-white flex items-center justify-between shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Scale className="w-3.5 h-3.5" />
                  <span>JudesCart Product Intelligence</span>
                </div>
                <h3 className="font-sans text-xl sm:text-2xl font-extrabold mt-0.5">
                  Side-by-Side Product Comparison ({compareList.length} items)
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={clearCompare}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors cursor-pointer text-slate-300 hover:text-white"
                >
                  Clear All
                </button>
                <button
                  onClick={closeCompare}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close comparison modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Matrix Table */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="align-top">
                    <th className="w-44 p-3 text-xs font-bold uppercase tracking-wider text-slate-400 pb-6">
                      Feature / Specs
                    </th>
                    {compareList.map((prod) => (
                      <th key={prod.id} className="p-3 w-64 pb-6">
                        <div className="relative p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between h-full space-y-3">
                          <button
                            onClick={() => removeFromCompare(prod.id)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-rose-600 border border-slate-200 transition-colors cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-slate-100">
                            <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
                              {prod.brand || 'JUDES'}
                            </span>
                            <h4 className="font-sans font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 mt-0.5">
                              {prod.name}
                            </h4>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="font-extrabold text-sm sm:text-base text-slate-900">
                                {formatAmount(prod.price)}
                              </span>
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span className="text-xs text-slate-400 line-through">
                                  {formatAmount(prod.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* JudesCoins Reward Badge */}
                          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-between text-[11px]">
                            <span className="text-amber-900 font-bold flex items-center gap-1">
                              <span>🪙</span> +{calculatePurchaseCoins(prod.price)} Coins
                            </span>
                            <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                              Earn
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              const defaultColor = prod.colors[0]?.name || 'Standard';
                              const defaultSize =
                                prod.sizes.find((s) => s.stock > 0)?.name || prod.sizes[0]?.name || 'Standard';
                              addToCart(prod, defaultColor, defaultSize, 1);
                            }}
                            className="w-full py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {/* Rating & Reviews */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Customer Rating</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex items-center gap-1.5">
                          <RatingStars rating={p.rating} size="sm" />
                          <span className="font-bold text-slate-900">{p.rating}</span>
                          <span className="text-slate-400 text-[11px]">({p.reviewCount})</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Department</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 capitalize font-medium text-slate-800">
                        {p.category.replace('-', ' ')}
                      </td>
                    ))}
                  </tr>

                  {/* Stock & Sizing */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Available Sizes</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {p.sizes.map((s) => (
                            <span
                              key={s.name}
                              className={cn(
                                'px-2 py-0.5 rounded text-[10px] font-semibold border',
                                s.stock > 0
                                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                                  : 'bg-slate-100 text-slate-400 line-through'
                              )}
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Color Options */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Color Options</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="flex items-center gap-1.5">
                          {p.colors.map((c) => (
                            <span
                              key={c.name}
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                          <span className="text-[11px] text-slate-500">({p.colors.length} choices)</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Materials */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Materials</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-slate-800">
                        {p.details.materials}
                      </td>
                    ))}
                  </tr>

                  {/* Origin */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Origin &amp; Care</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3 text-slate-800">
                        <div>{p.details.origin}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5">{p.details.care}</div>
                      </td>
                    ))}
                  </tr>

                  {/* Lucky Draw / Bumper Tier */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Draw Qualification</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        {p.brand === 'JUDES' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                            <Crown className="w-3 h-3 text-amber-600" />
                            <span>Mega Bumper Token</span>
                          </span>
                        ) : p.drawTier === 'platinum' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px] border border-purple-300">
                            <Trophy className="w-3 h-3 text-purple-600" />
                            <span>Platinum Draw Ticket</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px] border border-blue-300">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            <span>Gold/Silver Draw Ticket</span>
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Delivery & Warranty */}
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Assurance</td>
                    {compareList.map((p) => (
                      <td key={p.id} className="p-3">
                        <div className="space-y-1 text-[11px] text-slate-700">
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <Check className="w-3 h-3" />
                            <span>Free Express Delivery Over $75</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <RotateCcw className="w-3 h-3 text-blue-600" />
                            <span>30-Day Effortless Returns</span>
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500">
                Tip: You can add up to 4 items simultaneously to compare features and JudesCoins rewards.
              </span>
              <button
                onClick={closeCompare}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Done Comparing
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
