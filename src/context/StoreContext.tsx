'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { CartItem, PromoCode, CartSummary } from '@/types/cart';
import { CurrencyCode } from '@/types/currency';
import { UserProfile, Order, ShippingAddress } from '@/types/user';
import { CURRENCIES, PROMO_CODES, INITIAL_USER } from '@/lib/mock-data';
import { calculateCartSummary, formatPrice } from '@/lib/utils';

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
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem('judescart_cart_items');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('judescart_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCurrency = localStorage.getItem('judescart_currency') as CurrencyCode;
      if (savedCurrency && CURRENCIES[savedCurrency]) setCurrencyState(savedCurrency);

      const savedUser = localStorage.getItem('judescart_user_profile');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.judesCoins !== undefined) setJudesCoins(parsed.judesCoins);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('judescart_cart_items', JSON.stringify(cart));
  }, [cart, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('judescart_wishlist', JSON.stringify(wishlist));
  }, [wishlist, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('judescart_currency', currency);
  }, [currency, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem('judescart_user_profile', JSON.stringify(user));
  }, [user, isMounted]);

  // Cart Actions
  const addToCart = (product: Product, color: string, size: string, quantity = 1) => {
    setCart((prev) => {
      const itemId = `${product.id}-${color}-${size}`;
      const existing = prev.find((item) => item.id === itemId);
      const selectedSizeObj = product.sizes.find((s) => s.name === size);
      const maxStock = selectedSizeObj ? selectedSizeObj.stock : 10;

      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxStock) }
            : item
        );
      }

      const newItem: CartItem = {
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
      };

      return [...prev, newItem];
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

    const found = PROMO_CODES[trimmed];
    if (found) {
      setAppliedPromo(found);
      return true;
    }

    setPromoError('Invalid promotion code. Try WELCOME10 or LUXE20');
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
