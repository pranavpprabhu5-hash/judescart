'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { CartItem, PromoCode, CartSummary } from '@/types/cart';
import { CurrencyCode } from '@/types/currency';
import { UserProfile, Order, ShippingAddress } from '@/types/user';
import { CURRENCIES, PROMO_CODES, INITIAL_USER, PRODUCTS } from '@/lib/mock-data';
import { calculateCartSummary, formatPrice } from '@/lib/utils';

export interface AdminWinnerRecord {
  id: string;
  name: string;
  city: string;
  avatar: string;
  prize: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bumper';
  date: string;
  orderId: string;
}

interface StoreContextType {
  // Cart
  cart: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, color: string, size: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  appliedPromo: PromoCode | null;
  promoError: string | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  cartSummary: CartSummary;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Currency
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatAmount: (amount: number) => string;

  // User & Orders
  user: UserProfile;
  isLoggedIn: boolean;
  toggleLogin: () => void;
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
  addOrder: (order: Order) => void;
  saveAddress: (address: ShippingAddress) => void;

  // JudesCoins Rewards
  judesCoins: number;
  addJudesCoins: (amount: number) => void;
  redeemCoinsForSpin: () => boolean;
  redeemCoinsForDiscount: (coins: number) => boolean;

  // Quick View Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Search overlay
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Lucky Draw
  isLuckyDrawOpen: boolean;
  openLuckyDraw: () => void;
  closeLuckyDraw: () => void;
  claimLuckyPrize: (code: string) => boolean;

  // Admin & Inventory Controls
  products: Product[];
  updateProductStock: (id: string, newStock: number) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  promoCodes: Record<string, PromoCode>;
  createPromoCode: (code: string, discountType: 'percentage' | 'fixed', discountValue: number, description: string) => void;
  deletePromoCode: (code: string) => void;
  grantCustomerCoins: (amount: number) => void;
  recentWinners: AdminWinnerRecord[];
  triggerAdminDraw: (tier: string) => { winnerName: string; prize: string };
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Products State (Admin managed)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState<Record<string, PromoCode>>(PROMO_CODES);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Currency State
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  // User State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLuckyDrawOpen, setIsLuckyDrawOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [judesCoins, setJudesCoins] = useState<number>(INITIAL_USER.judesCoins || 650);

  // Recent Winners for Lucky Draw (Admin triggerable)
  const [recentWinners, setRecentWinners] = useState<AdminWinnerRecord[]>([
    {
      id: 'win-01',
      name: 'Vikram Mehta',
      city: 'Mumbai, IN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      prize: 'Apple iPhone 16 Pro Max',
      tier: 'platinum',
      date: '1 day ago',
      orderId: 'JC-91823',
    },
    {
      id: 'win-02',
      name: 'Emily Watson',
      city: 'London, UK',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      prize: 'Sony WH-1000XM5 Headphones',
      tier: 'gold',
      date: '2 days ago',
      orderId: 'JC-84729',
    },
    {
      id: 'win-03',
      name: 'Carlos Mendez',
      city: 'Austin, US',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      prize: 'Apple AirPods 4 (ANC)',
      tier: 'silver',
      date: '3 days ago',
      orderId: 'JC-77312',
    },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem('judescart_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('judescart_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCurrency = localStorage.getItem('judescart_currency');
      if (savedCurrency && savedCurrency in CURRENCIES) setCurrencyState(savedCurrency as CurrencyCode);

      const savedCoins = localStorage.getItem('judescart_coins');
      if (savedCoins) setJudesCoins(parseInt(savedCoins, 10));

      const savedProducts = localStorage.getItem('judescart_products_v2') || localStorage.getItem('judescart_admin_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('judescart_cart', JSON.stringify(cart));
    } catch {}
  }, [cart, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('judescart_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('judescart_currency', currency);
    } catch {}
  }, [currency, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('judescart_coins', judesCoins.toString());
    } catch {}
  }, [judesCoins, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('judescart_products_v2', JSON.stringify(products));
      localStorage.setItem('judescart_admin_products', JSON.stringify(products));
    } catch {}
  }, [products, isMounted]);

  // Cart Actions
  const addToCart = (product: Product, color: string, size: string, quantity = 1) => {
    const sizeVariant = product.sizes.find((s) => s.name === size);
    const maxStock = sizeVariant ? sizeVariant.stock : 10;
    const itemId = `${product.id}-${color}-${size}`.toLowerCase().replace(/\s+/g, '-');

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item));
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          color,
          size,
          quantity: Math.min(quantity, maxStock),
          maxStock,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  const applyPromo = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    setPromoError(null);

    const found = promoCodes[trimmed];
    if (found) {
      setAppliedPromo(found);
      return true;
    }

    setPromoError('Invalid promotion code. Try WELCOME10, LUCKY25, or WELCOME15');
    return false;
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const claimLuckyPrize = (code: string): boolean => {
    const success = applyPromo(code);
    if (success) {
      setIsLuckyDrawOpen(false);
      setIsCartOpen(true);
    }
    return success;
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSummary = useMemo(() => {
    const discPct = appliedPromo && appliedPromo.discountType === 'percentage' ? appliedPromo.discountValue : 0;
    const discFixed = appliedPromo && appliedPromo.discountType === 'fixed' ? appliedPromo.discountValue : 0;
    return calculateCartSummary(cartSubtotal, discPct, discFixed, 0);
  }, [cartSubtotal, appliedPromo]);

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Currency
  const setCurrency = (c: CurrencyCode) => setCurrencyState(c);
  const formatAmount = (amount: number) => formatPrice(amount, currency);

  // User Actions
  const toggleLogin = () => setIsLoggedIn((prev) => !prev);
  const addOrder = (order: Order) => {
    const earnedCoins = Math.floor(order.total * 10);
    setJudesCoins((prev) => prev + earnedCoins);
    setUser((prev) => ({
      ...prev,
      orders: [order, ...prev.orders],
      judesCoins: (prev.judesCoins || 0) + earnedCoins,
    }));
  };

  const addJudesCoins = (amount: number) => {
    setJudesCoins((prev) => {
      const updated = prev + amount;
      setUser((u) => ({ ...u, judesCoins: updated }));
      return updated;
    });
  };

  const redeemCoinsForSpin = (): boolean => {
    if (judesCoins < 100) return false;
    setJudesCoins((prev) => {
      const updated = prev - 100;
      setUser((u) => ({ ...u, judesCoins: updated }));
      return updated;
    });
    if (typeof window !== 'undefined') {
      const currentSpins = parseInt(localStorage.getItem('judescart_spins_left') || '3', 10);
      localStorage.setItem('judescart_spins_left', (currentSpins + 1).toString());
    }
    return true;
  };

  const redeemCoinsForDiscount = (coins: number): boolean => {
    if (judesCoins < coins) return false;
    setJudesCoins((prev) => {
      const updated = prev - coins;
      setUser((u) => ({ ...u, judesCoins: updated }));
      return updated;
    });
    applyPromo('LUCKY25');
    return true;
  };

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const saveAddress = (address: ShippingAddress) => {
    setUser((prev) => ({
      ...prev,
      savedAddresses: [address, ...prev.savedAddresses.filter((a) => a.street !== address.street)],
    }));
  };

  // ================= ADMIN ACTIONS =================
  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          sizes: p.sizes.map((s) => ({ ...s, stock: Math.max(0, newStock) })),
        };
      })
    );
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: Math.max(1, newPrice) } : p))
    );
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setUser((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  };

  const createPromoCode = (
    code: string,
    discountType: 'percentage' | 'fixed',
    discountValue: number,
    description: string
  ) => {
    const key = code.trim().toUpperCase();
    setPromoCodes((prev) => ({
      ...prev,
      [key]: {
        code: key,
        discountType,
        discountValue,
        description,
      },
    }));
  };

  const deletePromoCode = (code: string) => {
    const key = code.trim().toUpperCase();
    setPromoCodes((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const grantCustomerCoins = (amount: number) => {
    addJudesCoins(amount);
  };

  const triggerAdminDraw = (tier: string) => {
    const candidateNames = [
      { name: 'Marcus Vance', city: 'San Francisco, US', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
      { name: 'Sarah Chen', city: 'Toronto, CA', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
      { name: 'Devon Patel', city: 'London, UK', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
      { name: 'Elena Rostova', city: 'Berlin, DE', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
    ];
    const candidatePrizes: Record<string, string[]> = {
      platinum: ['Apple iPhone 16 Pro Max', 'MacBook Air M3', '$1,000 Luxury Shopping Credit'],
      gold: ['Sony WH-1000XM5 Headphones', 'Apple Watch Series 10', '$500 Tech Voucher'],
      silver: ['Apple AirPods 4 (ANC)', 'Hasami Porcelain Coffee Set', '$100 Store Voucher'],
      bumper: ['Brand New Mercedes-Benz C-Class', 'Luxury 7-Day Swiss Alps Holiday', '$25,000 Direct Cash Jackpot'],
    };

    const winner = candidateNames[Math.floor(Math.random() * candidateNames.length)];
    const prizes = candidatePrizes[tier.toLowerCase()] || candidatePrizes.platinum;
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    const newRecord: AdminWinnerRecord = {
      id: `win-${Date.now()}`,
      name: winner.name,
      city: winner.city,
      avatar: winner.avatar,
      prize,
      tier: tier.toLowerCase() as any,
      date: 'Just now',
      orderId: `JC-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setRecentWinners((prev) => [newRecord, ...prev]);
    return { winnerName: winner.name, prize };
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedPromo,
        promoError,
        applyPromo,
        removePromo,
        cartSummary,

        wishlist,
        toggleWishlist,
        isInWishlist,

        currency,
        setCurrency,
        formatAmount,

        user,
        isLoggedIn,
        toggleLogin,
        isProfileOpen,
        openProfile: () => setIsProfileOpen(true),
        closeProfile: () => setIsProfileOpen(false),
        addOrder,
        saveAddress,

        judesCoins,
        addJudesCoins,
        redeemCoinsForSpin,
        redeemCoinsForDiscount,

        quickViewProduct,
        openQuickView,
        closeQuickView,

        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),

        isLuckyDrawOpen,
        openLuckyDraw: () => setIsLuckyDrawOpen(true),
        closeLuckyDraw: () => setIsLuckyDrawOpen(false),
        claimLuckyPrize,

        // Admin
        products,
        updateProductStock,
        updateProductPrice,
        addProduct,
        deleteProduct,
        updateOrderStatus,
        promoCodes,
        createPromoCode,
        deletePromoCode,
        grantCustomerCoins,
        recentWinners,
        triggerAdminDraw,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
