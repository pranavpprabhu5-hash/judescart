'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/types/cart';
import { useStore } from '@/context/StoreContext';
import { Trash2 } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart, formatAmount, closeCart } = useStore();

  return (
    <div className="flex items-center gap-3.5 py-4 border-b border-stone-100 last:border-b-0">
      {/* Thumbnail */}
      <Link
        href={`/products/${item.slug}`}
        onClick={closeCart}
        className="relative w-16 h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200"
      >
        <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.slug}`}
          onClick={closeCart}
          className="text-xs font-semibold text-stone-900 dark:text-white hover:text-[#0066FF] dark:hover:text-blue-400 transition-colors line-clamp-1"
        >
          {item.name}
        </Link>
        <p className="text-[11px] text-stone-500 mt-0.5">
          {item.color} • {item.size}
        </p>

        <div className="flex items-center justify-between mt-2.5">
          {/* Quantity Controls */}
          <div className="flex items-center border border-stone-200 rounded-full bg-white px-2 py-0.5">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors text-xs font-semibold"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-semibold text-stone-900">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="w-5 h-5 flex items-center justify-center text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Unit / Line Price */}
          <div className="text-right">
            <span className="text-xs font-semibold text-stone-950">
              {formatAmount(item.price * item.quantity)}
            </span>
            {item.quantity > 1 && (
              <span className="block text-[10px] text-stone-400">
                {formatAmount(item.price)} each
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={() => removeFromCart(item.id)}
        className="p-1.5 text-stone-300 hover:text-rose-600 transition-colors rounded-full hover:bg-stone-50"
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
