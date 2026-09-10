'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useStore } from '@/context/StoreContext';
import { Plus, Check, ShoppingBag, Sparkles, Tag } from 'lucide-react';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  bundleItems: Product[];
}

export function FrequentlyBoughtTogether({ currentProduct, bundleItems }: FrequentlyBoughtTogetherProps) {
  const { addToCart, formatAmount, openCart } = useStore();

  // Pick up to 2 bundle items
  const items = [currentProduct, ...bundleItems.slice(0, 2)];

  // State of selected items (by product ID)
  const [selectedIds, setSelectedIds] = useState<string[]>(items.map((p) => p.id));
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (bundleItems.length === 0) return null;

  const toggleItem = (id: string) => {
    // Current product cannot be deselected to keep bundle relevant
    if (id === currentProduct.id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedProducts = items.filter((p) => selectedIds.includes(p.id));
  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const discountRate = selectedProducts.length >= 2 ? 0.15 : 0;
  const savings = subtotal * discountRate;
  const bundleTotal = subtotal - savings;

  const handleAddBundle = () => {
    setIsAdding(true);
    // Add each selected product to cart
    selectedProducts.forEach((prod) => {
      const defaultColor = prod.colors[0]?.name || 'Default';
      const defaultSize = prod.sizes.find((s) => s.stock > 0)?.name || prod.sizes[0]?.name || 'Standard';
      addToCart(prod, defaultColor, defaultSize, 1);
    });

    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      openCart();
    }, 800);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0066FF]">
            <Tag className="w-3.5 h-3.5" />
            <span>Curated Bundle Discount</span>
          </div>
          <h3 className="font-sans text-xl font-extrabold text-[#0A192F] mt-0.5">
            Frequently Bought Together
          </h3>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Save 15% on this combined bundle</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Products Visual Row */}
        <div className="lg:col-span-8 flex flex-wrap items-center gap-3 sm:gap-4">
          {items.map((prod, index) => {
            const isSelected = selectedIds.includes(prod.id);
            const isMain = prod.id === currentProduct.id;

            return (
              <React.Fragment key={prod.id}>
                {index > 0 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-400 font-bold shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                )}

                <div
                  onClick={() => toggleItem(prod.id)}
                  className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center w-36 sm:w-44 text-center group ${
                    isSelected
                      ? 'border-[#0066FF] bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                    <Image src={prod.images[0]} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  <div className="w-full flex items-center justify-center gap-1.5 mb-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isMain}
                      onChange={() => toggleItem(prod.id)}
                      className="rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF] cursor-pointer"
                    />
                    <span className="text-[10px] uppercase font-bold text-slate-500 truncate">
                      {isMain ? 'This Item' : 'Add-on'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 w-full">
                    {prod.name}
                  </h4>
                  <span className="text-xs font-black text-[#0066FF] mt-0.5">
                    {formatAmount(prod.price)}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Price & Add to Cart Callout */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Selected ({selectedProducts.length} items):</span>
              <span className="font-semibold text-slate-900">{formatAmount(subtotal)}</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>15% Bundle Savings:</span>
                <span>-{formatAmount(savings)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Price:</span>
              <div className="text-right">
                <span className="text-xl font-black text-[#0066FF] block">
                  {formatAmount(bundleTotal)}
                </span>
                {savings > 0 && (
                  <span className="text-[11px] text-slate-400 line-through">
                    {formatAmount(subtotal)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddBundle}
            disabled={isAdding || selectedProducts.length === 0}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-blue-500/25'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Bundle Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add {selectedProducts.length} Items to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
