'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Sparkles,
  CheckCircle2,
  Crown,
  Layers,
  ShoppingBag,
  Palette,
} from 'lucide-react';
import { Product } from '@/types/product';
import { useStore } from '@/context/StoreContext';

interface MonogramCustomizerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
  onApplied?: (msg: string) => void;
}

export function MonogramCustomizerModal({
  product,
  isOpen,
  onClose,
  selectedColor,
  selectedSize,
  quantity = 1,
  onApplied,
}: MonogramCustomizerModalProps) {
  const { addToCart, openCart } = useStore();

  const [initials, setInitials] = useState('E.V.');
  const [foilColor, setFoilColor] = useState<'gold' | 'silver' | 'blind'>('gold');
  const [position, setPosition] = useState<'bottom_right' | 'center'>('bottom_right');

  if (!isOpen || !product) return null;

  const colorToUse = selectedColor || product.colors?.[0]?.name || 'Standard';
  const sizeToUse = selectedSize || product.sizes?.[0]?.name || 'Standard';

  const handleApplyAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInitials = initials.trim().toUpperCase() || 'J.C.';
    addToCart(product, colorToUse, sizeToUse, quantity, {
      initials: cleanInitials,
      foilColor,
    });

    if (onApplied) {
      onApplied(`✨ Bespoke Monogram "${cleanInitials}" (${foilColor}) added to bag!`);
    }
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Bespoke Atelier Monogramming
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase">
                  Complimentary Personalization
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hand-debossed metallic foil monogramming for {product.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          {/* Live Product Canvas Preview */}
          <div className="md:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-inner">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />

              {/* Realistic Foiled Monogram Overlay */}
              <div
                className={`absolute transition-all duration-300 pointer-events-none ${
                  position === 'center'
                    ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                    : 'bottom-6 right-6'
                }`}
              >
                <div
                  className={`px-3 py-1.5 rounded-lg backdrop-blur-xs font-serif font-black tracking-[0.25em] text-lg sm:text-xl uppercase shadow-lg border ${
                    foilColor === 'gold'
                      ? 'text-amber-200 bg-amber-950/70 border-amber-400/80 shadow-amber-500/20 [text-shadow:_0_1px_2px_rgba(251,191,36,0.6)]'
                      : foilColor === 'silver'
                      ? 'text-slate-100 bg-slate-950/70 border-slate-300/80 shadow-slate-400/20 [text-shadow:_0_1px_2px_rgba(255,255,255,0.8)]'
                      : 'text-zinc-400 bg-black/80 border-zinc-700 shadow-inner [text-shadow:_inset_0_1px_1px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  {initials.trim().toUpperCase() || 'J.C.'}
                </div>
              </div>

              {/* Live Preview Watermark */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 text-white font-mono text-[9px] uppercase tracking-wider backdrop-blur-xs">
                Live Atelier Preview
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Hand-crafted debossing with genuine heat-set foil leaf
            </p>
          </div>

          {/* Form Options */}
          <form onSubmit={handleApplyAndAdd} className="md:col-span-6 space-y-4 text-xs">
            {/* Initials Input */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enter Monogram Initials (1 to 4 Characters)
              </label>
              <input
                type="text"
                maxLength={4}
                value={initials}
                onChange={(e) => setInitials(e.target.value.toUpperCase())}
                placeholder="e.g. E.V. or J.C."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-serif font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0066FF]"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Traditional style includes periods (e.g. &ldquo;M.V.&rdquo;) or clean modern letters (&ldquo;MV&rdquo;).
              </p>
            </div>

            {/* Foil Type Selection */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Foil Stamp Finish
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'gold', name: '24K Gold Foil', color: 'bg-amber-400', desc: 'Warm metallic shimmer' },
                  { id: 'silver', name: 'Sterling Silver', color: 'bg-slate-300', desc: 'Cool platinum gloss' },
                  { id: 'blind', name: 'Blind Deboss', color: 'bg-stone-800', desc: 'Inkless deep pressure' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFoilColor(f.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      foilColor === f.id
                        ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-xs ring-2 ring-amber-400/40'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-3 h-3 rounded-full ${f.color} shadow-xs`} />
                      <span className="font-bold text-[11px] truncate">{f.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 block leading-tight">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Position Selection */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Debossing Placement
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPosition('bottom_right')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    position === 'bottom_right'
                      ? 'border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/30 font-bold text-[#0066FF]'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="text-[11px] font-bold">Lower Corner</div>
                  <div className="text-[10px] text-slate-400 font-normal">Subtle &amp; understated</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPosition('center')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    position === 'center'
                      ? 'border-[#0066FF] bg-blue-50/60 dark:bg-blue-950/30 font-bold text-[#0066FF]'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <div className="text-[11px] font-bold">Center Crest</div>
                  <div className="text-[10px] text-slate-400 font-normal">Prominent luxury focal point</div>
                </button>
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Confirm Monogram &amp; Add to Bag</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
