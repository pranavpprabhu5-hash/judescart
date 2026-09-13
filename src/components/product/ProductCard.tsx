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
      <div className="group relative flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
        {/* Thumbnail */}
        <Link href={`/products/${product.slug}`} className="relative w-full sm:w-56 h-64 sm:h-52 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant={product.badge === 'Sale' ? 'sale' : product.badge === 'New' ? 'new' : 'blue'}>
                {product.badge}
              </Badge>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#0066FF] font-bold">{product.category}</span>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="text-base font-sans font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Draw Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {(product.drawTier === 'platinum' || product.drawTier === 'tier-1') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-300/80">
                🎟️ Platinum Draw
              </span>
            )}
            {(product.drawTier === 'gold' || product.drawTier === 'tier-2') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-700 border border-blue-300/80">
                🎟️ Gold Draw
              </span>
            )}
            {(product.drawTier === 'silver' || product.drawTier === 'tier-3') && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-700 border border-slate-300/80">
                🎟️ Silver Draw
              </span>
            )}
            {product.brand === 'JUDES' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-300">
                👑 Brand JUDES: Bumper Draw
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>

          {/* Price & Actions */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-[#0A192F]">{formatAmount(product.price)}</span>
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
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                title="Quick View"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4 text-slate-600" />
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
                    : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                )}
                title={inCompare ? 'Remove from comparison' : 'Compare product'}
                aria-label="Compare"
              >
                <Scale className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-2 rounded-full border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-700 transition-colors"
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
      className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-white dark:bg-[#0E1A30] border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 pointer-events-none scale-90 sm:scale-100 origin-top-left">
            <Badge variant={product.badge === 'Sale' ? 'sale' : product.badge === 'New' ? 'new' : 'blue'}>
              {product.badge}
            </Badge>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-slate-200/80 text-slate-700 hover:text-rose-600 hover:bg-white transition-all active:scale-90"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn('w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors', isFavorited && 'fill-rose-500 text-rose-500')} />
        </button>

        {/* Compare Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inCompare) removeFromCompare(product.id);
            else addToCompare(product);
          }}
          className={cn(
            'absolute top-8.5 right-2 sm:top-12 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-md shadow-xs border transition-all active:scale-90',
            inCompare
              ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-md'
              : 'bg-white/90 border-slate-200/80 text-slate-700 hover:text-[#0066FF] hover:bg-white'
          )}
          title={inCompare ? 'Remove from comparison' : 'Compare product'}
          aria-label="Compare product"
        >
          <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Quick Add / Quick View Overlay on Hover */}
        <div
          className={cn(
            'absolute inset-x-3 bottom-3 z-20 transition-all duration-300 transform',
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
          )}
        >
          {!showQuickAdd ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openQuickView(product);
                }}
                className="p-2.5 rounded-xl bg-white/95 text-slate-800 hover:text-[#0066FF] text-xs font-bold shadow-md hover:bg-white transition-all flex items-center justify-center cursor-pointer border border-slate-200"
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
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#0066FF] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:bg-[#0052CC] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>
            </div>
          ) : (
            <div
              className="bg-white/98 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl space-y-2 animate-in fade-in-50 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                <span>Select Size:</span>
                <span className="text-[#0066FF]">{selectedColor}</span>
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
                          : 'border-slate-200 text-slate-700 hover:border-[#0066FF] bg-slate-50'
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
                className="w-full py-2 rounded-lg bg-[#0A192F] text-white text-xs font-bold hover:bg-[#0066FF] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                <span>{isAdded ? 'Added to Bag!' : 'Confirm Add'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1">
            <span className="uppercase tracking-wider font-bold text-[#0066FF]">{product.category}</span>
            <div className="scale-75 sm:scale-100 origin-right">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            </div>
          </div>

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-sans font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#0066FF] dark:group-hover:text-[#38BDF8] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Draw Eligibility Badges */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5 sm:pt-1">
            {(product.drawTier === 'platinum' || product.drawTier === 'tier-1') && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-amber-500/10 text-amber-700 border border-amber-300/80">
                🎟️ Platinum
              </span>
            )}
            {(product.drawTier === 'gold' || product.drawTier === 'tier-2') && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-blue-500/10 text-blue-700 border border-blue-300/80">
                🎟️ Gold
              </span>
            )}
            {(product.drawTier === 'silver' || product.drawTier === 'tier-3') && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-slate-500/10 text-slate-700 border border-slate-300/80">
                🎟️ Silver
              </span>
            )}
            {product.brand === 'JUDES' && (
              <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold bg-amber-50 text-amber-900 border border-amber-300">
                👑 JUDES
              </span>
            )}
          </div>

          <p className="hidden sm:block text-xs text-slate-500 line-clamp-1 mt-0.5">{product.tagline}</p>
        </div>

        {/* Colors & Price */}
        <div className="pt-1.5 sm:pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          {/* Swatches */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.name)}
                title={c.name}
                className={cn(
                  'w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full border transition-all',
                  selectedColor === c.name
                    ? 'ring-1 sm:ring-2 ring-[#0066FF] ring-offset-1 scale-110'
                    : 'border-slate-300 dark:border-slate-600 hover:scale-105'
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 text-right">
            <span className="text-xs sm:text-sm font-extrabold text-[#0A192F] dark:text-white">
              {formatAmount(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
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
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-xs flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex-1 py-1.5 px-2 rounded-lg bg-[#0066FF] active:bg-[#0052CC] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer"
          >
            {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span className="truncate">{isAdded ? 'Added!' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
