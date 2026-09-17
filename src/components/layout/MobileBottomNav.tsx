'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { Home, SlidersHorizontal, Gift, Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();
  const {
    cartCount,
    openCart,
    wishlist,
    openDailyMystery,
    dailyMysteryClaimed,
  } = useStore();

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/products');
  const isWishlist = pathname === '/wishlist';

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#070F1E]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 px-2">
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            'flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 select-none',
            isHome
              ? 'text-[#0066FF] dark:text-[#38BDF8] font-bold'
              : 'text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          )}
          aria-label="Home"
        >
          <div className="relative">
            <Home className={cn('w-5 h-5', isHome && 'stroke-[2.5]')} />
            {isHome && (
              <span className="w-1 h-1 rounded-full bg-[#0066FF] dark:bg-[#38BDF8] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight">Home</span>
        </Link>

        {/* 2. Shop / Catalog */}
        <Link
          href="/products"
          className={cn(
            'flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 select-none',
            isShop
              ? 'text-[#0066FF] dark:text-[#38BDF8] font-bold'
              : 'text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          )}
          aria-label="Shop Catalog"
        >
          <div className="relative">
            <SlidersHorizontal className={cn('w-5 h-5', isShop && 'stroke-[2.5]')} />
            {isShop && (
              <span className="w-1 h-1 rounded-full bg-[#0066FF] dark:bg-[#38BDF8] absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight">Catalog</span>
        </Link>

        {/* 3. Daily Gift / Mystery Vault */}
        <button
          type="button"
          onClick={openDailyMystery}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-purple-600 dark:text-purple-400 hover:text-purple-700 active:scale-90 transition-all select-none relative cursor-pointer"
          aria-label="Daily Mystery Gift"
        >
          <div className="relative p-1 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-800/60">
            <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            {!dailyMysteryClaimed && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-ping" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold tracking-tight text-purple-700 dark:text-purple-300">
            Gift
          </span>
        </button>

        {/* 4. Wishlist */}
        <Link
          href="/wishlist"
          className={cn(
            'flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-90 select-none relative',
            isWishlist
              ? 'text-rose-600 dark:text-rose-400 font-bold'
              : 'text-stone-500 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white'
          )}
          aria-label="Wishlist"
        >
          <div className="relative">
            <Heart className={cn('w-5 h-5', isWishlist ? 'fill-rose-500 stroke-[2.5]' : '')} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-3.5 h-3.5 px-1 text-[9px] font-black text-white bg-rose-500 rounded-full shadow-xs">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight">Wishlist</span>
        </Link>

        {/* 5. Cart */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-stone-700 dark:text-slate-300 hover:text-[#0066FF] dark:hover:text-[#38BDF8] active:scale-90 transition-all select-none relative cursor-pointer"
          aria-label="Shopping Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-black text-white bg-[#0066FF] rounded-full shadow-xs animate-badge-pop">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium tracking-tight">Cart</span>
        </button>
      </div>
    </div>
  );
}
