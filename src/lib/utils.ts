import { CURRENCIES } from './mock-data';
import { CurrencyCode } from '@/types/currency';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(amount: number, currencyCode: CurrencyCode = 'USD'): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.USD;
  return config.format(amount);
}

export function calculateCartSummary(
  subtotal: number,
  discountPercentage: number = 0,
  fixedDiscount: number = 0,
  shippingFee: number = 0
) {
  const freeShippingThreshold = 150;
  const promoDiscount = subtotal * discountPercentage + fixedDiscount;
  const taxableAmount = Math.max(0, subtotal - promoDiscount);
  const estimatedTax = taxableAmount * 0.085; // 8.5% standard tax
  const isFreeShippingUnlocked = subtotal >= freeShippingThreshold;
  const finalShipping = isFreeShippingUnlocked && shippingFee === 0 ? 0 : shippingFee;
  const amountUntilFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const total = Math.max(0, taxableAmount + finalShipping + estimatedTax);

  return {
    subtotal,
    discount: promoDiscount,
    shipping: finalShipping,
    estimatedTax,
    total,
    freeShippingThreshold,
    amountUntilFreeShipping,
    isFreeShippingUnlocked,
  };
}

/**
 * Calculates JudesCoins earned from a purchase.
 * Reward rule: Exactly 1 coin for every ₹100 of purchase.
 * Converts USD base price to INR using the official rate (86.5).
 */
export function calculatePurchaseCoins(amountInUSD: number): number {
  const inrRate = CURRENCIES.INR.rate || 86.5;
  const inrAmount = amountInUSD * inrRate;
  return Math.max(0, Math.floor(inrAmount / 100));
}

