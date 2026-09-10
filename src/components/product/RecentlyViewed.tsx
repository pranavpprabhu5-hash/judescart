'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { History, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RecentlyViewedProps {
  currentProductId?: string;
}

const STORAGE_KEY = 'judescart_recently_viewed';

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadRecent() {
      if (typeof window === 'undefined') return;

      try {
        let history: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

        // If currentProductId is provided, prepend it to history and deduplicate
        if (currentProductId) {
          history = [currentProductId, ...history.filter((id) => id !== currentProductId)].slice(0, 8);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        }

        // Filter out current product for the display list
        const idsToFetch = history.filter((id) => id !== currentProductId).slice(0, 4);

        if (idsToFetch.length === 0) {
          // If user has no previous items, fetch featured items as fallback
          const featured = await api.getFeaturedProducts();
          setProducts(featured.filter((p) => p.id !== currentProductId).slice(0, 4));
          return;
        }

        const all = await api.getProducts();
        const matched = idsToFetch
          .map((id) => all.find((p) => p.id === id))
          .filter(Boolean) as Product[];

        setProducts(matched);
      } catch (e) {
        console.error('Error loading recently viewed products', e);
      }
    }

    loadRecent();
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="space-y-6 pt-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#0066FF]" />
          <h3 className="font-sans text-xl font-extrabold text-[#0A192F]">
            Recently Viewed &amp; Recommended
          </h3>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-[#0066FF] hover:underline inline-flex items-center gap-1"
        >
          <span>Browse entire catalog</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
