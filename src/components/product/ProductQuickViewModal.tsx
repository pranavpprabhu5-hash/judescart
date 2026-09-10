'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { RatingStars } from '@/components/ui/RatingStars';
import { Badge } from '@/components/ui/Badge';
import {
  X,
  ShoppingBag,
  Heart,
  Check,
  ArrowRight,
  Sparkles,
  Trophy,
  Crown,
  Gift,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductQuickViewModal() {
  const {
    quickViewProduct: product,
    closeQuickView,
    addToCart,
    formatAmount,
    isInWishlist,
    toggleWishlist,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors[0]?.name || '');
      const defSize = product.sizes.find((s) => s.stock > 0)?.name || product.sizes[0]?.name || '';
      setSelectedSize(defSize);
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const selectedSizeObj = product.sizes.find((s) => s.name === selectedSize);
  const isOutOfStock = selectedSizeObj ? selectedSizeObj.stock === 0 : false;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedColor, selectedSize, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      closeQuickView();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col lg:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-slate-100 text-slate-500 hover:text-slate-900 shadow-xs transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="lg:w-1/2 p-6 sm:p-8 bg-slate-50 flex flex-col justify-between space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-xs border border-slate-200">
            <Image
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.badge && (
                <Badge variant={product.badge.toLowerCase().includes('sale') ? 'sale' : 'default'}>
                  {product.badge}
                </Badge>
              )}
              {product.brand === 'JUDES' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-xs">
                  <Crown className="w-3 h-3" />
                  <span>JUDES Bumper</span>
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === i ? 'border-[#0066FF] shadow-xs scale-105' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Config & Add to Bag */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF] block">
                {product.category.replace('-', ' ')}
              </span>
              <h2 className="font-sans text-xl sm:text-2xl font-black text-[#0A192F] mt-1">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {product.tagline || product.description}
              </p>
            </div>

            {/* Rating & Draw Tier */}
            <div className="flex items-center justify-between gap-2 border-y border-slate-100 py-2.5">
              <div className="flex items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({product.reviewCount})</span>
              </div>

              {product.drawTier && (
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span>{product.drawTier} Draw</span>
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-[#0066FF]">
                {formatAmount(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {formatAmount(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            {product.colors.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Color:</span>
                  <span className="text-slate-500">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (c.imageIndex !== undefined) setActiveImageIndex(c.imageIndex);
                      }}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === c.name ? 'border-[#0066FF] ring-2 ring-blue-300 scale-110' : 'border-slate-300'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Size / Variant:</span>
                  {isOutOfStock && <span className="text-red-500 font-semibold">Out of Stock</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s.name}
                      disabled={s.stock === 0}
                      onClick={() => setSelectedSize(s.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === s.name
                          ? 'bg-[#0066FF] text-white shadow-xs'
                          : s.stock === 0
                          ? 'bg-slate-100 text-slate-300 border border-slate-200 line-through cursor-not-allowed'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || justAdded}
                className={`flex-1 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                  justAdded
                    ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                    : isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0066FF] hover:bg-blue-600 text-white shadow-blue-500/25'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                  isFavorited
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
                title="Wishlist"
              >
                <Heart className={cn('w-4 h-4', isFavorited && 'fill-current')} />
              </button>
            </div>

            <Link
              href={`/products/${product.slug}`}
              onClick={closeQuickView}
              className="w-full py-2 flex items-center justify-center gap-1 text-xs font-bold text-[#0066FF] hover:underline"
            >
              <span>View full product specs &amp; reviews</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
