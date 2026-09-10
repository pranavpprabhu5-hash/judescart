export interface CartItem {
  id: string; // unique item id: `${productId}-${color}-${size}`
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  maxStock: number;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  estimatedTax: number;
  total: number;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
  isFreeShippingUnlocked: boolean;
}
