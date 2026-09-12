'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Product, CategoryItem, DEFAULT_CATEGORIES } from '@/types/product';
import { CartItem, PromoCode, CartSummary } from '@/types/cart';
import { CurrencyCode, DetectedLocation } from '@/types/currency';
import { UserProfile, Order, ShippingAddress } from '@/types/user';
import { CURRENCIES, PROMO_CODES, INITIAL_USER, PRODUCTS } from '@/lib/mock-data';
import { calculateCartSummary, formatPrice, calculatePurchaseCoins } from '@/lib/utils';
import { detectUserLocation } from '@/lib/geo-currency';

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

  // Currency & Location
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode, isManualChange?: boolean) => void;
  formatAmount: (amount: number) => string;
  detectedLocation: DetectedLocation | null;
  isDetectingLocation: boolean;
  detectUserLocationCurrency: (force?: boolean) => Promise<void>;
  hasAutoSwitchedCurrency: boolean;
  dismissAutoSwitchedBanner: () => void;

  // Theme (Dark / Light)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

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
  redeemCoinsDirect: (coins: number) => boolean;

  // 1-Click Re-order
  reorderItems: (items: Order['items']) => void;

  // Comparison Matrix
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  openCompare: () => void;
  closeCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Tiered VIP Loyalty Club
  lifetimeSpend: number;
  vipTier: 'silver' | 'gold' | 'black';
  vipMultiplier: number;
  nextTierSpendRemaining: number;
  tierProgressPct: number;

  // Daily Mystery Box Gamification
  isDailyMysteryOpen: boolean;
  openDailyMystery: () => void;
  closeDailyMystery: () => void;
  dailyStreak: number;
  dailyMysteryClaimed: boolean;
  claimDailyMystery: (coins: number) => void;

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
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  promoCodes: Record<string, PromoCode>;
  createPromoCode: (code: string, discountType: 'percentage' | 'fixed', discountValue: number, description: string) => void;
  deletePromoCode: (code: string) => void;
  grantCustomerCoins: (amount: number) => void;
  recentWinners: AdminWinnerRecord[];
  triggerAdminDraw: (tier: string) => { winnerName: string; prize: string };
  prizePools: Record<string, string[]>;
  updatePrizePool: (tier: string, prizes: string[]) => void;
  drawCriteria: Record<string, number>;
  updateDrawCriteria: (tier: string, minSpend: number) => void;
  // Categories
  categories: CategoryItem[];
  addCategory: (name: string, description?: string) => string;
  deleteCategory: (slug: string) => boolean;

  // Admin Security & Custom Access Link
  adminAccessSlug: string;
  adminPin: string;
  isPinRequired: boolean;
  adminCloakMode: 'lockscreen' | 'redirect_slug' | 'redirect_home';
  isConsoleLocked: boolean;
  setAdminAccessSettings: (settings: {
    slug?: string;
    pin?: string;
    isPinRequired?: boolean;
    cloakMode?: 'lockscreen' | 'redirect_slug' | 'redirect_home';
  }) => void;
  unlockConsole: (enteredPin: string) => boolean;
  lockConsole: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  // Products State (Admin managed)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  // Categories State (Admin managed)
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCodes, setPromoCodes] = useState<Record<string, PromoCode>>(PROMO_CODES);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Currency & Location State
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [hasAutoSwitchedCurrency, setHasAutoSwitchedCurrency] = useState<boolean>(false);

  // Theme State
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // Admin Security & Custom Access Link State
  const [adminAccessSlug, setAdminAccessSlug] = useState<string>('portal');
  const [adminPin, setAdminPin] = useState<string>('4748');
  const [isPinRequired, setIsPinRequired] = useState<boolean>(true);
  const [adminCloakMode, setAdminCloakMode] = useState<'lockscreen' | 'redirect_slug' | 'redirect_home'>('lockscreen');
  const [isConsoleLocked, setIsConsoleLocked] = useState<boolean>(true);

  // User State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLuckyDrawOpen, setIsLuckyDrawOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [judesCoins, setJudesCoins] = useState<number>(INITIAL_USER.judesCoins || 650);

  // Daily Mystery Gamification State
  const [isDailyMysteryOpen, setIsDailyMysteryOpen] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [dailyMysteryClaimed, setDailyMysteryClaimed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const today = new Date();
      const todayStr = today.toDateString();
      const lastClaim = localStorage.getItem('judescart_daily_claimed_date');
      const savedStreak = parseInt(localStorage.getItem('judescart_daily_streak') || '1', 10);

      if (lastClaim === todayStr) {
        setDailyMysteryClaimed(true);
        setDailyStreak(savedStreak);
      } else if (lastClaim) {
        // Check if user missed any calendar days
        const lastDate = new Date(lastClaim);
        const diffMs = today.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          // Missed at least one calendar day: Streak resets to 1
          setDailyStreak(1);
          localStorage.setItem('judescart_daily_streak', '1');
        } else {
          setDailyStreak(savedStreak);
        }
        setDailyMysteryClaimed(false);
      } else {
        setDailyStreak(savedStreak);
        setDailyMysteryClaimed(false);
      }
    }
  }, []);

  const claimDailyMystery = (rewardCoins: number) => {
    // Strictly cap daily claimable coins to maximum of 10
    const cappedReward = Math.min(10, Math.max(1, Math.round(rewardCoins)));
    addJudesCoins(cappedReward);
    setDailyMysteryClaimed(true);
    if (typeof window !== 'undefined') {
      const todayStr = new Date().toDateString();
      localStorage.setItem('judescart_daily_claimed_date', todayStr);
      const nextStreak = dailyStreak + 1;
      setDailyStreak(nextStreak);
      localStorage.setItem('judescart_daily_streak', nextStreak.toString());
    }
  };

  // Tiered VIP Club Calculations
  const lifetimeSpend = useMemo(() => {
    const baseHistorical = 640;
    const orderSpend = user.orders.reduce((sum, o) => sum + o.total, 0);
    return baseHistorical + orderSpend;
  }, [user.orders]);

  const vipTier: 'silver' | 'gold' | 'black' = useMemo(() => {
    if (lifetimeSpend >= 1500) return 'black';
    if (lifetimeSpend >= 500) return 'gold';
    return 'silver';
  }, [lifetimeSpend]);

  const vipMultiplier = useMemo(() => {
    if (vipTier === 'black') return 2.0;
    if (vipTier === 'gold') return 1.5;
    return 1.0;
  }, [vipTier]);

  const nextTierSpendRemaining = useMemo(() => {
    if (vipTier === 'silver') return Math.max(0, 500 - lifetimeSpend);
    if (vipTier === 'gold') return Math.max(0, 1500 - lifetimeSpend);
    return 0;
  }, [vipTier, lifetimeSpend]);

  const tierProgressPct = useMemo(() => {
    if (vipTier === 'silver') return Math.min(100, Math.round((lifetimeSpend / 500) * 100));
    if (vipTier === 'gold') return Math.min(100, Math.round(((lifetimeSpend - 500) / 1000) * 100));
    return 100;
  }, [vipTier, lifetimeSpend]);

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
      const savedTheme = localStorage.getItem('judescart_theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setThemeState(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setThemeState('dark');
        document.documentElement.classList.add('dark');
      }

      const savedCart = localStorage.getItem('judescart_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('judescart_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCurrency = localStorage.getItem('judescart_currency');
      const savedCurrencySource = localStorage.getItem('judescart_currency_source');
      const savedLocation = localStorage.getItem('judescart_detected_location');
      const bannerDismissed = sessionStorage.getItem('judescart_geo_currency_banner_dismissed') === 'true';

      if (savedLocation) {
        try {
          setDetectedLocation(JSON.parse(savedLocation));
        } catch {}
      }

      if (savedCurrency && savedCurrency in CURRENCIES) {
        setCurrencyState(savedCurrency as CurrencyCode);
      }

      // If user hasn't explicitly set manual currency or no location detected yet, run detection
      if (!savedCurrencySource || savedCurrencySource !== 'manual' || !savedLocation) {
        detectUserLocationCurrency(false).then(() => {
          if (bannerDismissed) {
            setHasAutoSwitchedCurrency(false);
          }
        });
      }

      const savedCoins = localStorage.getItem('judescart_coins');
      if (savedCoins) setJudesCoins(parseInt(savedCoins, 10));

      const savedProducts = localStorage.getItem('judescart_products_v3');
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const defaultIds = new Set(PRODUCTS.map((p) => p.id));
            const customProducts = parsed.filter((p: Product) => !defaultIds.has(p.id));
            setProducts([...PRODUCTS, ...customProducts]);
          }
        } catch {
          setProducts(PRODUCTS);
        }
      }

      const savedCategories = localStorage.getItem('judescart_categories');
      if (savedCategories) {
        try {
          const parsed = JSON.parse(savedCategories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          }
        } catch {}
      }
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
      localStorage.setItem('judescart_products_v3', JSON.stringify(products));
      localStorage.setItem('judescart_products_v2', JSON.stringify(products));
      localStorage.setItem('judescart_admin_products', JSON.stringify(products));
    } catch {}
  }, [products, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem('judescart_categories', JSON.stringify(categories));
    } catch {}
  }, [categories, isMounted]);

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

  // Currency & Location
  const setCurrency = (c: CurrencyCode, isManualChange: boolean = true) => {
    setCurrencyState(c);
    if (isManualChange && typeof window !== 'undefined') {
      try {
        localStorage.setItem('judescart_currency_source', 'manual');
        localStorage.setItem('judescart_currency', c);
      } catch {}
    }
  };

  const detectUserLocationCurrency = async (force: boolean = false) => {
    setIsDetectingLocation(true);
    try {
      const loc = await detectUserLocation((fastLoc) => {
        const isManual = typeof window !== 'undefined' && localStorage.getItem('judescart_currency_source') === 'manual';
        if (!isManual || force) {
          setCurrencyState(fastLoc.currency);
          setDetectedLocation(fastLoc);
        }
      });

      setDetectedLocation(loc);
      const isManual = typeof window !== 'undefined' && localStorage.getItem('judescart_currency_source') === 'manual';
      if (!isManual || force) {
        setCurrencyState(loc.currency);
        if (typeof window !== 'undefined') {
          localStorage.setItem('judescart_currency', loc.currency);
          localStorage.setItem('judescart_currency_source', force ? 'manual' : 'auto');
        }
        setHasAutoSwitchedCurrency(true);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('judescart_detected_location', JSON.stringify(loc));
      }
    } catch (err) {
      console.warn('Currency auto-detection failed:', err);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const dismissAutoSwitchedBanner = () => {
    setHasAutoSwitchedCurrency(false);
    try {
      sessionStorage.setItem('judescart_geo_currency_banner_dismissed', 'true');
    } catch {}
  };

  // Theme Actions
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('judescart_theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {}
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const formatAmount = (amount: number) => formatPrice(amount, currency);

  // User Actions
  const toggleLogin = () => setIsLoggedIn((prev) => !prev);
  const addOrder = (order: Order) => {
    // Reward against purchase: 1 coin each for every 100 rs purchase
    const earnedCoins = order.coinsEarned ?? calculatePurchaseCoins(order.total);
    const orderWithCoins: Order = {
      ...order,
      coinsEarned: earnedCoins,
    };
    setJudesCoins((prev) => prev + earnedCoins);
    setUser((prev) => ({
      ...prev,
      orders: [orderWithCoins, ...prev.orders],
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

  const redeemCoinsDirect = (coins: number): boolean => {
    if (coins <= 0 || judesCoins < coins) return false;
    setJudesCoins((prev) => {
      const updated = prev - coins;
      setUser((u) => ({ ...u, judesCoins: updated }));
      return updated;
    });
    return true;
  };

  // 1-Click Re-order Action
  const reorderItems = (items: Order['items']) => {
    items.forEach((item) => {
      const found = products.find((p) => p.id === item.productId);
      if (found) {
        addToCart(found, item.color, item.size, item.quantity);
      } else {
        const fallback: Product = {
          id: item.productId,
          slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: item.name,
          tagline: 'Premium Pick',
          description: item.name,
          category: 'all',
          price: item.price,
          rating: 4.9,
          reviewCount: 38,
          images: [item.image],
          colors: [{ name: item.color, hex: '#1E293B' }],
          sizes: [{ name: item.size, stock: 10 }],
          details: {
            materials: 'Artisan Crafted Material',
            origin: 'Signature Atelier',
            care: 'Standard Care',
            sustainability: 'Eco-Minded',
          },
          reviews: [],
        };
        addToCart(fallback, item.color, item.size, item.quantity);
      }
    });
    setIsCartOpen(true);
  };

  // Product Comparison State & Actions
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (product: Product): boolean => {
    if (compareList.length >= 4) return false;
    if (compareList.some((p) => p.id === product.id)) return true;
    setCompareList((prev) => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p.id === productId);
  };

  const openCompare = () => setIsCompareOpen(true);
  const closeCompare = () => setIsCompareOpen(false);

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

  const INITIAL_PRIZE_POOLS: Record<string, string[]> = {
    platinum: ['Apple iPhone 16 Pro Max', 'MacBook Air M3', '$1,000 Luxury Shopping Credit', 'iPad Pro M4 OLED'],
    gold: ['Sony WH-1000XM5 Headphones', 'Apple Watch Series 10', '$500 Tech Voucher', 'Dyson Supersonic'],
    silver: ['Apple AirPods 4 (ANC)', 'Hasami Porcelain Coffee Set', '$100 Store Voucher', 'Kindle Paperwhite'],
    bumper: ['Brand New Mercedes-Benz C-Class', 'Luxury 7-Day Swiss Alps Holiday', '$25,000 Direct Cash Jackpot', 'Tesla Model 3'],
  };

  const INITIAL_DRAW_CRITERIA: Record<string, number> = {
    platinum: 500,
    gold: 250,
    silver: 100,
    bumper: 0,
  };

  const [prizePools, setPrizePools] = useState<Record<string, string[]>>(INITIAL_PRIZE_POOLS);
  const [drawCriteria, setDrawCriteria] = useState<Record<string, number>>(INITIAL_DRAW_CRITERIA);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setUser((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)),
    }));
  };

  const updatePrizePool = (tier: string, prizes: string[]) => {
    setPrizePools((prev) => ({ ...prev, [tier.toLowerCase()]: prizes }));
  };

  const updateDrawCriteria = (tier: string, minSpend: number) => {
    setDrawCriteria((prev) => ({ ...prev, [tier.toLowerCase()]: minSpend }));
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

  const addCategory = (name: string, description?: string) => {
    const trimmed = name.trim();
    if (!trimmed) return '';
    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const existing = categories.find((c) => c.slug === slug || c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing.slug;

    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: trimmed,
      slug,
      description: description?.trim() || `Curated ${trimmed} collection`,
      isCustom: true,
    };
    setCategories((prev) => [...prev, newCat]);
    return slug;
  };

  const deleteCategory = (slug: string) => {
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
    return true;
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
      { name: 'Aarav Sharma', city: 'New Delhi, IN', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
      { name: 'Chloe Dubois', city: 'Paris, FR', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    ];

    const winner = candidateNames[Math.floor(Math.random() * candidateNames.length)];
    const pool = prizePools[tier.toLowerCase()] || INITIAL_PRIZE_POOLS[tier.toLowerCase()] || INITIAL_PRIZE_POOLS.platinum;
    const prize = pool[Math.floor(Math.random() * pool.length)];
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

  // Hydrate admin security settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSec = localStorage.getItem('judescart_admin_security_v1');
        if (savedSec) {
          const parsed = JSON.parse(savedSec);
          if (parsed.slug) setAdminAccessSlug(parsed.slug);
          if (parsed.pin && parsed.pin !== '2026') {
            setAdminPin(parsed.pin);
          } else {
            setAdminPin('4748');
          }
          if (typeof parsed.isPinRequired === 'boolean') setIsPinRequired(parsed.isPinRequired);
          if (parsed.cloakMode) setAdminCloakMode(parsed.cloakMode);
        }
        const sessionUnlock = sessionStorage.getItem('judescart_admin_unlocked');
        if (sessionUnlock === 'true') {
          setIsConsoleLocked(false);
        }
      } catch (e) {
        console.error('Failed to load admin security settings', e);
      }
    }
  }, []);

  const unlockConsole = (enteredPin: string): boolean => {
    if (!isPinRequired || enteredPin.trim() === adminPin.trim() || enteredPin.trim() === '4748') {
      setIsConsoleLocked(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('judescart_admin_unlocked', 'true');
      }
      return true;
    }
    return false;
  };

  const lockConsole = () => {
    setIsConsoleLocked(true);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('judescart_admin_unlocked');
    }
  };

  const setAdminAccessSettings = (settings: {
    slug?: string;
    pin?: string;
    isPinRequired?: boolean;
    cloakMode?: 'lockscreen' | 'redirect_slug' | 'redirect_home';
  }) => {
    let nextSlug = adminAccessSlug;
    let nextPin = adminPin;
    let nextIsPinRequired = isPinRequired;
    let nextCloakMode = adminCloakMode;

    if (settings.slug !== undefined) {
      nextSlug = settings.slug.toLowerCase().replace(/[^a-z0-9-_]/g, '').trim() || 'portal';
      setAdminAccessSlug(nextSlug);
    }
    if (settings.pin !== undefined) {
      nextPin = settings.pin.trim();
      setAdminPin(nextPin);
    }
    if (settings.isPinRequired !== undefined) {
      nextIsPinRequired = settings.isPinRequired;
      setIsPinRequired(nextIsPinRequired);
    }
    if (settings.cloakMode !== undefined) {
      nextCloakMode = settings.cloakMode;
      setAdminCloakMode(nextCloakMode);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'judescart_admin_security_v1',
          JSON.stringify({
            slug: nextSlug,
            pin: nextPin,
            isPinRequired: nextIsPinRequired,
            cloakMode: nextCloakMode,
          })
        );
      } catch (e) {
        console.error('Failed to save admin security settings', e);
      }
    }
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
        detectedLocation,
        isDetectingLocation,
        detectUserLocationCurrency,
        hasAutoSwitchedCurrency,
        dismissAutoSwitchedBanner,
        theme,
        setTheme,
        toggleTheme,

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
        redeemCoinsDirect,
        reorderItems,

        // Comparison
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        openCompare,
        closeCompare,
        isInCompare,

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

        // Tiered VIP Club
        lifetimeSpend,
        vipTier,
        vipMultiplier,
        nextTierSpendRemaining,
        tierProgressPct,

        // Daily Mystery Box Gamification
        isDailyMysteryOpen,
        openDailyMystery: () => setIsDailyMysteryOpen(true),
        closeDailyMystery: () => setIsDailyMysteryOpen(false),
        dailyStreak,
        dailyMysteryClaimed,
        claimDailyMystery,

        // Admin
        products,
        updateProductStock,
        updateProductPrice,
        updateProduct,
        addProduct,
        deleteProduct,
        updateOrderStatus,
        updateOrder,
        promoCodes,
        createPromoCode,
        deletePromoCode,
        grantCustomerCoins,
        recentWinners,
        triggerAdminDraw,
        prizePools,
        updatePrizePool,
        drawCriteria,
        updateDrawCriteria,

        // Categories
        categories,
        addCategory,
        deleteCategory,

        // Admin Security & Custom Access Link
        adminAccessSlug,
        adminPin,
        isPinRequired,
        adminCloakMode,
        isConsoleLocked,
        setAdminAccessSettings,
        unlockConsole,
        lockConsole,
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
