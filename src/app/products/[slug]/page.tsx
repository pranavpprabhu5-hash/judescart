'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { useStore } from '@/context/StoreContext';
import { ImageGallery } from '@/components/product/ImageGallery';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ReviewSection } from '@/components/product/ReviewSection';
import { StickyMobileCTA } from '@/components/product/StickyMobileCTA';
import { ProductCard } from '@/components/product/ProductCard';
import { Accordion, AccordionItemData } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { Button } from '@/components/ui/Button';
import {
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
  Share2,
  Trophy,
  Crown,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { formatAmount, addToCart, isInWishlist, toggleWishlist } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected variant state
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const item = await api.getProductBySlug(slug);
      if (!item) {
        setLoading(false);
        return;
      }

      setProduct(item);
      setSelectedColor(item.colors[0]?.name || '');
      const defaultSize = item.sizes.find((s) => s.stock > 0)?.name || item.sizes[0]?.name || '';
      setSelectedSize(defaultSize);

      // Related products
      const related = await api.getRelatedProducts(item.id, item.category);
      setRelatedProducts(related);
      setLoading(false);
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-[3/4] rounded-2xl shimmer-loading" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-6 w-1/3 shimmer-loading rounded" />
            <div className="h-10 w-3/4 shimmer-loading rounded" />
            <div className="h-6 w-1/4 shimmer-loading rounded" />
            <div className="h-28 w-full shimmer-loading rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const isFavorited = isInWishlist(product.id);
  const selectedSizeObj = product.sizes.find((s) => s.name === selectedSize);
  const isOutOfStock = selectedSizeObj ? selectedSizeObj.stock === 0 : false;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedColor, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Accordion Tabs Data
  const accordionItems: AccordionItemData[] = [
    {
      id: 'details-care',
      title: 'Details & Craftsmanship',
      content: (
        <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
          <p><strong className="text-stone-900">Materials:</strong> {product.details.materials}</p>
          <p><strong className="text-stone-900">Provenance:</strong> {product.details.origin}</p>
          <p><strong className="text-stone-900">Care Instructions:</strong> {product.details.care}</p>
          <p><strong className="text-stone-900">Environmental Integrity:</strong> {product.details.sustainability}</p>
        </div>
      ),
    },
    {
      id: 'shipping-returns',
      title: 'Complimentary Shipping & Returns',
      content: (
        <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
          <p>
            • <strong>Standard Delivery:</strong> 3–5 business days. Complimentary on all orders over $150.
          </p>
          <p>
            • <strong>Express Courier:</strong> 2 business days ($15, or complimentary over $300).
          </p>
          <p>
            • <strong>Returns & Exchanges:</strong> 30-day effortless home pickup. Items must be unworn with original tags attached.
          </p>
          <p>
            • <strong>Atelier Packaging:</strong> Signature hardboard presentation box with cotton dust bag.
          </p>
        </div>
      ),
    },
    {
      id: 'reviews',
      title: `Client Reviews (${product.reviewCount})`,
      content: (
        <ReviewSection
          productId={product.id}
          reviews={product.reviews}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      ),
    },
  ];

  return (
    <div className="pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-[#0066FF] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#0066FF] transition-colors">All Products</Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-[#0066FF] transition-colors uppercase font-medium"
          >
            {product.category.replace('-', ' ')}
          </Link>
          <span>/</span>
          <span className="text-[#0A192F] font-bold truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Details & Purchasing (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Header / Category & Badges */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest font-bold text-[#0066FF]">
                  {product.category.replace('-', ' ')}
                </span>
                {product.badge && (
                  <Badge variant={product.badge === 'Sale' ? 'sale' : product.badge === 'New' ? 'new' : 'default'}>
                    {product.badge}
                  </Badge>
                )}
              </div>

              <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A192F] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#0A192F]">
                    {formatAmount(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatAmount(product.originalPrice)}
                    </span>
                  )}
                </div>

                <span className="text-slate-300">•</span>

                <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              </div>
            </div>

            {/* Tagline & Short Description */}
            <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
              <p className="font-semibold text-slate-900">{product.tagline}</p>
              <p>{product.description}</p>
            </div>

            {/* Lucky Draw Rewards Callout Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-amber-50/60 border border-blue-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#0A192F] uppercase tracking-wider">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>JudesCart Lucky Draw Rewards</span>
                </div>
                <Link
                  href="/lucky-draw"
                  className="text-[11px] font-bold text-[#0066FF] hover:underline"
                >
                  Draw Rules &amp; Schedule &rarr;
                </Link>
              </div>

              <div className="space-y-1.5 text-xs">
                {product.drawTier === 'tier-1' && (
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-300/80 text-amber-900">
                    <span className="text-base">🎟️</span>
                    <div>
                      <strong className="block font-bold">Qualifies for Tier 1 Mega Draw (&gt;₹500 Profit)</strong>
                      <span className="text-[11px] text-amber-800">
                        This purchase automatically generates a Tier 1 Platinum Ticket for the monthly luxury gadget draw.
                      </span>
                    </div>
                  </div>
                )}
                {product.drawTier === 'tier-2' && (
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-blue-500/10 border border-blue-300/80 text-blue-900">
                    <span className="text-base">🎟️</span>
                    <div>
                      <strong className="block font-bold">Qualifies for Tier 2 Gold Draw (₹250–₹500 Profit)</strong>
                      <span className="text-[11px] text-blue-800">
                        This purchase generates a Tier 2 Gold Ticket for the bi-weekly audio &amp; fashion draw.
                      </span>
                    </div>
                  </div>
                )}
                {product.drawTier === 'tier-3' && (
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-slate-500/10 border border-slate-300/80 text-slate-900">
                    <span className="text-base">🎟️</span>
                    <div>
                      <strong className="block font-bold">Qualifies for Tier 3 Silver Draw (₹100–₹250 Profit)</strong>
                      <span className="text-[11px] text-slate-700">
                        This purchase generates a Tier 3 Silver Ticket for the weekly lifestyle &amp; living draw.
                      </span>
                    </div>
                  </div>
                )}
                {product.brand === 'JUDES' && (
                  <div className="flex items-start gap-2 p-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-blue-500/15 to-purple-500/15 border border-amber-400/80 text-[#0A192F]">
                    <Crown className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <strong className="block font-extrabold text-[#0A192F]">
                        Official Brand JUDES: Mega Bumper Draw Token!
                      </strong>
                      <span className="text-[11px] text-slate-700">
                        Includes automatic entry into the 6–12 month Grand Bumper Draw for luxury vehicles &amp; ₹5,00,000 cash!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Variant Selectors (Color & Size) */}
            <div className="pt-2 border-t border-slate-100">
              <VariantSelector
                colors={product.colors}
                sizes={product.sizes}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  size="lg"
                  className={cn(
                    'flex-1 shadow-lg py-3.5 rounded-xl font-bold transition-all',
                    isAdded
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-blue-500/25'
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 mr-1.5" />
                      <span>Added to Your Bag</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out in Selected Size</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-1.5" />
                      <span>Add to Bag • {formatAmount(product.price * quantity)}</span>
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={cn(
                    'p-3.5 rounded-xl border border-slate-200 hover:border-[#0066FF] transition-colors shadow-sm',
                    isFavorited ? 'bg-rose-50 border-rose-300 text-rose-600' : 'text-slate-700 hover:bg-blue-50/50'
                  )}
                  aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={cn('w-5 h-5', isFavorited ? 'fill-rose-500 text-rose-500' : '')} />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-[#0066FF] transition-colors text-slate-700 hover:bg-blue-50/50"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {copiedLink && (
                <p className="text-[11px] text-center text-emerald-700 font-semibold">
                  ✓ Link copied to clipboard
                </p>
              )}
            </div>

            {/* Reassurance Micro-Badges */}
            <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-slate-700 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#0066FF]" />
                <span className="font-medium">Free Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#0066FF]" />
                <span className="font-medium">30-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                <span className="font-medium">Buyer Protection</span>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="pt-2">
              <Accordion items={accordionItems} defaultOpenId="details-care" />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <StickyMobileCTA
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
      />

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-8">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest font-bold text-[#0066FF]">Curated For You</span>
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#0A192F]">
              Frequently Bought Together
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
