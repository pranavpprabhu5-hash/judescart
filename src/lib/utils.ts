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
