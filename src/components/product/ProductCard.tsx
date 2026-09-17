'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { useStore } from '@/context/StoreContext';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { Heart, ShoppingBag, Check, Eye, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const {
    formatAmount,
    toggleWishlist,
    isInWishlist,
    addToCart,
    openQuickView,
    addToCompare,
    removeFromCompare,
    isInCompare,
  } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find((s) => s.stock > 0)?.name || product.sizes[0]?.name || ''
  );
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const hasSecondaryImage = product.images.length > 1;

  // Determine discount percent
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Determine current image
  const activeColorObj = product.colors.find((c) => c.name === selectedColor);
  const activeImageIndex = activeColorObj?.imageIndex ?? 0;
  const currentImage = isHovered && hasSecondaryImage ? product.images[1] : product.images[activeImageIndex] || product.images[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, selectedColor, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setShowQuickAdd(false);
    }, 1200);
  };

  if (viewMode === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E1A30] border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-400/60 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
        {/* Thumbnail */}
        <Link href={`/products/${product.slug}`} className="relative w-full sm:w-56 h-64 sm:h-52 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.badge && (
              <Badge variant={product.badge === 'Sale' ? 'sale' : product.badge === 'New' ? 'new' : 'blue'}>
                {product.badge}
              </Badge>
            )}
            {discountPercent && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white shadow-xs">
                -{discountPercent}%
              </span>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#0066FF] dark:text-blue-400 font-bold">{product.category}</span>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-base font-sans font-bold text-slate-900 dark:text-white group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Draw Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {(product.drawTier === 'platinum' || product.drawTier === 'tier-1') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/80 dark:border-amber-500/30">
                🎟️ Platinum Draw
              </span>
            )}
            {(product.drawTier === 'gold' || product.drawTier === 'tier-2') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300/80 dark:border-blue-500/30">
                🎟️ Gold Draw
              </span>
            )}
            {(product.drawTier === 'silver' || product.drawTier === 'tier-3') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-600/40">
                🎟️ Silver Draw
              </span>
            )}
            {product.brand === 'JUDES' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-600/60">
                👑 Brand JUDES: Bumper Draw
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{product.description}</p>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>In Stock • Ready for Express Dispatch</span>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-[#0A192F] dark:text-white">{formatAmount(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">{formatAmount(product.originalPrice)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickView(product);
                }}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                title="Quick View"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (inCompare) removeFromCompare(product.id);
                  else addToCompare(product);
                }}
                className={cn(
                  'p-2 rounded-full border transition-colors',
                  inCompare
                    ? 'bg-[#0066FF] border-[#0066FF] text-white'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                )}
                title={inCompare ? 'Remove from comparison' : 'Compare product'}
                aria-label="Compare"
              >
                <Scale className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={cn('w-4 h-4', isFavorited ? 'fill-rose-500 text-rose-500' : '')} />
              </button>
              <button
                onClick={handleQuickAdd}
                className="px-4 py-2 rounded-full bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052CC] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                <span>{isAdded ? 'Added' : 'Add to Bag'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-white dark:bg-[#0E1A30] border border-slate-200/90 dark:border-slate-800/90 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/60 dark:hover:border-blue-500/50 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square sm:aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Subtle Bottom Image Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-black/25 via-black/5 to-transparent pointer-events-none" />

        {/* Top Badges (Category badge & Discount pill) */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 pointer-events-none">
          {product.badge && (
            <Badge variant={product.badge === 'Sale' ? 'sale' : product.badge === 'New' ? 'new' : 'blue'}>
              {product.badge}
            </Badge>
          )}
          {discountPercent && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-rose-500 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-90 cursor-pointer"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors', isFavorited && 'fill-rose-500 text-rose-500')} />
        </button>

        {/* Compare Button (Desktop & Tablet only) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inCompare) removeFromCompare(product.id);
            else addToCompare(product);
          }}
          className={cn(
            'hidden sm:flex absolute top-12.5 right-3 z-10 p-2 rounded-full backdrop-blur-md shadow-sm border transition-all active:scale-90 items-center justify-center cursor-pointer',
            inCompare
              ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-md'
              : 'bg-white/90 dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-[#0066FF] hover:bg-white dark:hover:bg-slate-800'
          )}
          title={inCompare ? 'Remove from comparison' : 'Compare product'}
          aria-label="Compare product"
        >
          <Scale className="w-4 h-4" />
        </button>

        {/* Quick Add / Quick View Desktop Overlay on Hover */}
        <div
          className={cn(
            'hidden sm:block absolute inset-x-3 bottom-3 z-20 transition-all duration-300 transform',
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          )}
        >
          {!showQuickAdd ? (
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-700 shadow-xl">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickView(product);
                }}
                className="p-2.5 rounded-xl text-slate-800 dark:text-slate-200 hover:text-[#0066FF] dark:hover:text-blue-400 text-xs font-bold transition-all flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Quick View"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickAdd(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0066FF] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/25 hover:bg-[#0052CC] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>
            </div>
          ) : (
            <div
              className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-2 animate-in fade-in-50 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span>Select Size:</span>
                <span className="text-[#0066FF] dark:text-blue-400">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => {
                  const isOutOfStock = s.stock === 0;
                  const isSelected = selectedSize === s.name;
                  return (
                    <button
                      key={s.name}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSize(s.name)}
                      className={cn(
                        'px-2 py-1 rounded text-[11px] font-bold border transition-colors',
                        isSelected
                          ? 'border-[#0066FF] bg-[#0066FF] text-white'
                          : isOutOfStock
                          ? 'border-slate-200 text-slate-300 line-through cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#0066FF] bg-slate-50 dark:bg-slate-800'
                      )}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={handleQuickAdd}
                className="w-full py-2 rounded-xl bg-[#0A192F] dark:bg-blue-600 text-white text-xs font-bold hover:bg-[#0066FF] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                <span>{isAdded ? 'Added to Bag!' : 'Confirm Add'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[9px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1">
            <span className="uppercase tracking-wider font-bold text-[#0066FF] dark:text-blue-400">{product.category}</span>
            <div className="scale-75 sm:scale-95 origin-right">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            </div>
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-sans font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0066FF] dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Draw Eligibility Badges */}
          <div className="flex flex-wrap items-center gap-0.5 sm:gap-1 pt-0.5 sm:pt-1">
            {(product.drawTier === 'platinum' || product.drawTier === 'tier-1') && (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[7px] sm:text-[9px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/80 dark:border-amber-500/30">
                🎟️ Platinum
              </span>
            )}
            {(product.drawTier === 'gold' || product.drawTier === 'tier-2') && (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[7px] sm:text-[9px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-300/80 dark:border-blue-500/30">
                🎟️ Gold
              </span>
            )}
            {(product.drawTier === 'silver' || product.drawTier === 'tier-3') && (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[7px] sm:text-[9px] font-bold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-300/80 dark:border-slate-600/40">
                🎟️ Silver
              </span>
            )}
            {product.brand === 'JUDES' && (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[7px] sm:text-[9px] font-extrabold bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-600/60">
                👑 JUDES
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5 sm:pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="truncate">In Stock • Ships Today</span>
          </div>
        </div>

        {/* Colors & Price */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          {/* Swatches */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {product.colors.slice(0, 3).map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                title={c.name}
                className={cn(
                  'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border transition-all',
                  selectedColor === c.name
                    ? 'ring-1 sm:ring-2 ring-[#0066FF] ring-offset-1 sm:ring-offset-2 scale-110'
                    : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1 text-right">
            <span className="text-xs sm:text-base font-extrabold text-[#0A192F] dark:text-white">
              {formatAmount(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[9px] sm:text-xs text-slate-400 line-through">
                {formatAmount(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Touch-Friendly Mobile Action Bar (<sm only) */}
        <div className="sm:hidden pt-1.5 flex items-center gap-1 border-t border-slate-100 dark:border-slate-800/60">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(product);
            }}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs flex items-center justify-center cursor-pointer shrink-0 active:scale-90 transition-all"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleQuickAdd}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-lg text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all',
              isAdded ? 'bg-emerald-600' : 'bg-[#0066FF] active:bg-[#0052CC]'
            )}
          >
            {isAdded ? <Check className="w-3 h-3 stroke-[3]" /> : <ShoppingBag className="w-3 h-3" />}
            <span className="truncate">{isAdded ? 'Added' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
