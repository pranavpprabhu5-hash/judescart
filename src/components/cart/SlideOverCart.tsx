'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { CartItemRow } from './CartItemRow';
import { FreeShippingMeter } from './FreeShippingMeter';
import { X, ShoppingBag, ArrowRight, Tag, ShieldCheck, Lock } from 'lucide-react';
import { calculatePurchaseCoins } from '@/lib/utils';

export function SlideOverCart() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    isCartOpen,
    closeCart,
    cartSummary,
    formatAmount,
    appliedPromo,
    promoError,
    applyPromo,
    removePromo,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    const success = applyPromo(promoInput);
    setIsApplyingPromo(false);
    if (success) {
      setPromoInput('');
    }
  };

  const handleProceedCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0A192F]/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={closeCart} aria-hidden="true" />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-[#0A192F]">Your JudesCart Bag</h3>
              <span className="text-xs text-slate-500">{cartCount} items selected</span>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="px-5 pt-4">
          <FreeShippingMeter />
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-[#0066FF] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="font-sans text-lg font-bold text-slate-900">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore top electronics, apparel, footwear, leather goods, and home essentials.
              </p>
              <div className="pt-3">
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold hover:bg-[#0052CC] transition-colors shadow-sm"
                >
                  Explore All Products
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/80 space-y-4">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                  <div className="flex items-center gap-1.5 text-[#0066FF] font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Promo: <strong>{appliedPromo.code}</strong> applied ({appliedPromo.description})</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-slate-400 hover:text-slate-700 text-xs ml-2 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (try WELCOME10)"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl uppercase placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    disabled={!promoInput.trim() || isApplyingPromo}
                    className="px-4 py-2 bg-[#0A192F] text-white rounded-xl text-xs font-bold hover:bg-[#0066FF] disabled:opacity-40 transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatAmount(cartSummary.subtotal)}</span>
              </div>
              {cartSummary.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promotional Savings</span>
                  <span>-{formatAmount(cartSummary.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {cartSummary.isFreeShippingUnlocked ? (
                    <span className="text-emerald-700 font-bold">Complimentary</span>
                  ) : (
                    'Calculated at checkout'
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-semibold text-slate-900">{formatAmount(cartSummary.estimatedTax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#0A192F] pt-2 border-t border-slate-200">
                <span>Estimated Total</span>
                <span className="text-[#0066FF] text-lg">{formatAmount(cartSummary.total)}</span>
              </div>
            </div>

            {/* JudesCoins Purchase Reward Notice */}
            <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-sm">🪙</span>
                <span className="font-bold text-amber-950">
                  Earn +{calculatePurchaseCoins(cartSummary.total)} JudesCoins
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-700">
                1 coin / ₹100 spent
              </span>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleProceedCheckout}
              className="w-full py-3.5 rounded-full bg-[#0066FF] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0052CC] transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-[0.99]"
            >
              <Lock className="w-3.5 h-3.5 text-blue-200" />
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Trust reassurance */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
