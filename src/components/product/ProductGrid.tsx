'use client';

import React from 'react';
import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, viewMode = 'grid', columns = 3 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/50 p-8">
        <PackageSearch className="w-12 h-12 mx-auto text-stone-400 mb-3" />
        <h3 className="text-base font-serif text-stone-900">No products found</h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          We couldn&apos;t find any atelier pieces matching your selected filters. Try clearing or expanding your criteria.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode="list" />
        ))}
      </div>
    );
  }

  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colClasses[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode="grid" />
      ))}
    </div>
  );
}
