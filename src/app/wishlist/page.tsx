'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlistItems() {
      setLoading(true);
      const all = await api.getProducts();
      const saved = all.filter((p) => wishlist.includes(p.id));
      setProducts(saved);
      setLoading(false);
    }
    loadWishlistItems();
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-bold text-[#0066FF]">
          Saved Items
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#0A192F]">
          Your JudesCart Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          All your favorite electronics, fashion apparel, footwear, and home essentials saved in one place.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl shimmer-loading" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-sans text-lg font-bold text-[#0A192F]">Your wishlist is currently empty</h3>
          <p className="text-xs text-slate-500">
            Explore our collection and click the heart icon on any product to save it to your wishlist.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052CC] transition-colors shadow-md shadow-blue-500/20"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
