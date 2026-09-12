'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StickyMobileCTAProps {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export function StickyMobileCTA({ product, selectedColor, selectedSize, quantity }: StickyMobileCTAProps) {
  const { formatAmount, addToCart } = useStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user scrolls down past 450px
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleAdd = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-13 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-sans font-bold text-slate-900 dark:text-white truncate">{product.name}</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-[#0A192F] dark:text-cyan-300">{formatAmount(product.price)}</span>
              <span>•</span>
              <span className="truncate">{selectedColor} / {selectedSize}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            'px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0 active:scale-95',
            isAdded ? 'bg-emerald-600 text-white' : 'bg-[#0066FF] text-white hover:bg-[#0052CC] shadow-blue-500/20'
          )}
        >
          {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          <span>{isAdded ? 'Added!' : 'Add to Bag'}</span>
        </button>
      </div>
    </div>
  );
}
