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
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
  giftPackaging?: {
    enabled: boolean;
    note?: string;
    hidePriceReceipt?: boolean;
    fee: number;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  savedAddresses: ShippingAddress[];
  orders: Order[];
  judesCoins?: number;
}
