export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type ShippingSpeed = 'standard' | 'express' | 'overnight';

export interface ShippingMethodOption {
  id: ShippingSpeed;
  name: string;
  estimatedDays: string;
  price: number;
  description: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  monogram?: {
    initials: string;
    foilColor: 'gold' | 'silver' | 'blind';
  };
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethodOption;
  paymentMethod: {
    type: 'card' | 'apple_pay' | 'paypal';
    last4?: string;
    brand?: string;
  };
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  trackingNumber: string;
  estimatedDelivery: string;
  courierPartner?: string;
  shippingNotes?: string;
  invoiceNumber?: string;
  giftPackaging?: {
    enabled: boolean;
    note?: string;
    hidePriceReceipt?: boolean;
    fee: number;
    boxType?: string;
    ribbonColor?: string;
    waxSeal?: string;
  };
  coinsEarned?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  password?: string;
  joinedDate?: string;
  role?: 'customer' | 'vip';
  savedAddresses: ShippingAddress[];
  orders: Order[];
  judesCoins?: number;
}
