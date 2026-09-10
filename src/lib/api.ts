import { PRODUCTS, PROMO_CODES, INITIAL_USER } from './mock-data';
import { Product, FilterState, ProductReview } from '@/types/product';
import { PromoCode } from '@/types/cart';
import { Order, UserProfile } from '@/types/user';

// Keys for local storage persistence
const STORAGE_KEYS = {
  PRODUCTS: 'judescart_products_v2',
  USER: 'judescart_user_v2',
  ORDERS: 'judescart_orders_v2',
  WISHLIST: 'judescart_wishlist_v2',
};

function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const api = {
  // Products
  async getProducts(filters?: Partial<FilterState>): Promise<Product[]> {
    let items = getStorageItem<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    if (!items || items.length === 0) {
      items = PRODUCTS;
      setStorageItem(STORAGE_KEYS.PRODUCTS, items);
    }

    if (!filters) return items;

    return items.filter((product) => {
      // Category filter
      if (filters.category && filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }
      // Price range
      if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;
      // Rating
      if (filters.minRating !== undefined && product.rating < filters.minRating) return false;
      // Brand filter
      if (filters.brand && product.brand !== filters.brand) return false;
      // Draw Tier filter
      if (filters.drawTier && filters.drawTier !== 'all') {
        if (filters.drawTier === 'bumper') {
          if (!product.isBumperEligible && product.brand !== 'JUDES') return false;
        } else if (filters.drawTier === 'platinum' || filters.drawTier === 'tier-1') {
          if (product.drawTier !== 'platinum' && product.drawTier !== 'tier-1') return false;
        } else if (filters.drawTier === 'gold' || filters.drawTier === 'tier-2') {
          if (product.drawTier !== 'gold' && product.drawTier !== 'tier-2') return false;
        } else if (filters.drawTier === 'silver' || filters.drawTier === 'tier-3') {
          if (product.drawTier !== 'silver' && product.drawTier !== 'tier-3') return false;
        }
      }
      // In-stock
      if (filters.inStockOnly) {
        const hasStock = product.sizes.some((s) => s.stock > 0);
        if (!hasStock) return false;
      }
      // Search query
      if (filters.searchQuery && filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = product.description.toLowerCase().includes(q);
        const matchTag = product.tagline.toLowerCase().includes(q);
        const matchCat = product.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchTag && !matchCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const items = getStorageItem<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    return items.find((p) => p.slug === slug) || null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const items = getStorageItem<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    return items.filter((p) => p.isFeatured);
  },

  async getRelatedProducts(currentId: string, category: string): Promise<Product[]> {
    const items = getStorageItem<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    return items
      .filter((p) => p.id !== currentId && p.category === category)
      .slice(0, 4);
  },

  // Promo codes
  async validatePromoCode(code: string): Promise<PromoCode | null> {
    const normalized = code.trim().toUpperCase();
    return PROMO_CODES[normalized] || null;
  },

  // Reviews
  async addReview(productId: string, review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>): Promise<ProductReview> {
    const items = getStorageItem<Product[]>(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    const newRev: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      helpfulCount: 0,
    };

    const updated = items.map((p) => {
      if (p.id === productId) {
        const newReviews = [newRev, ...p.reviews];
        const avg = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
        return {
          ...p,
          reviews: newReviews,
          reviewCount: newReviews.length,
          rating: Number(avg.toFixed(2)),
        };
      }
      return p;
    });

    setStorageItem(STORAGE_KEYS.PRODUCTS, updated);
    return newRev;
  },

  // User & Orders
  getUserProfile(): UserProfile {
    return getStorageItem<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
  },

  async createOrder(orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber'>): Promise<Order> {
    const user = getStorageItem<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
    const newOrder: Order = {
      ...orderData,
      id: `JC-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Processing',
      trackingNumber: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    };

    const updatedUser = {
      ...user,
      orders: [newOrder, ...user.orders],
    };

    setStorageItem(STORAGE_KEYS.USER, updatedUser);
    return newOrder;
  },
};
