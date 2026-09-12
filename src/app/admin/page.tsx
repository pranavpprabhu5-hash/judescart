'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';
import { Product, ProductCategory } from '@/types/product';
import { Order, UserProfile } from '@/types/user';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { CurrencySwitcher } from '@/components/layout/CurrencySwitcher';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  Tag,
  Users,
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  Truck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Coins,
  Crown,
  Trophy,
  Gift,
  RefreshCw,
  SlidersHorizontal,
  X,
  AlertCircle,
  AlertTriangle,
  Activity,
  DollarSign,
  Layers,
  ArrowRight,
  Download,
  FileSpreadsheet,
  Printer,
  Settings2,
  Eye,
  Award,
  Calendar,
  UserCheck,
} from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { CURRENCIES, INITIAL_USER } from '@/lib/mock-data';
import { CurrencyCode } from '@/types/currency';

// Modular Admin Modals
import { OrderInvoiceModal } from '@/components/admin/OrderInvoiceModal';
import { OrderEditModal } from '@/components/admin/OrderEditModal';
import { ProductEditModal } from '@/components/admin/ProductEditModal';
import { CustomerDetailModal } from '@/components/admin/CustomerDetailModal';
import { LuckyDrawConfigModal } from '@/components/admin/LuckyDrawConfigModal';

// Sample CRM Customer Directory
const CRM_CUSTOMERS: UserProfile[] = [
  INITIAL_USER,
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@baycapital.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    savedAddresses: [
      {
        firstName: 'Marcus',
        lastName: 'Vance',
        email: 'marcus.vance@baycapital.com',
        phone: '+1 (415) 892-4910',
        street: '88 Montgomery St, Suite 400',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94104',
        country: 'United States',
      },
    ],
    orders: [
      {
        id: 'JC-89102',
        date: 'Sep 09, 2026',
        items: [
          {
            id: 'ord-it-1',
            productId: 'lumina-desk-lamp',
            name: 'Lumina Minimalist Desk Lamp',
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
            color: 'Matte Brass',
            size: 'Standard Unit',
            price: 189,
            quantity: 1,
          },
        ],
        subtotal: 189,
        discount: 0,
        shipping: 0,
        tax: 15.12,
        total: 204.12,
        currency: 'USD',
        shippingAddress: {
          firstName: 'Marcus',
          lastName: 'Vance',
          email: 'marcus.vance@baycapital.com',
          phone: '+1 (415) 892-4910',
          street: '88 Montgomery St, Suite 400',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94104',
          country: 'United States',
        },
        shippingMethod: {
          id: 'express',
          name: 'Express Courier',
          estimatedDays: '2-3 business days',
          price: 15,
          description: 'Priority courier delivery',
        },
        paymentMethod: {
          type: 'card',
          last4: '8821',
          brand: 'Visa Signature',
        },
        status: 'Delivered',
        trackingNumber: 'FDX-882910481',
        estimatedDelivery: 'Sep 11, 2026',
        courierPartner: 'FedEx Priority',
        coinsEarned: 204,
      },
    ],
    judesCoins: 1420,
  },
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@techbridge.ca',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    savedAddresses: [
      {
        firstName: 'Sarah',
        lastName: 'Chen',
        email: 'sarah.chen@techbridge.ca',
        phone: '+1 (416) 720-3391',
        street: '120 Adelaide St W',
        city: 'Toronto',
        state: 'ON',
        postalCode: 'M5H 1T1',
        country: 'Canada',
      },
    ],
    orders: [
      {
        id: 'JC-77312',
        date: 'Sep 06, 2026',
        items: [
          {
            id: 'ord-it-2',
            productId: 'solis-anc-earbuds',
            name: 'Solis Titanium ANC Wireless Earbuds',
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
            color: 'Graphite Black',
            size: 'Standard Unit',
            price: 249,
            quantity: 1,
          },
        ],
        subtotal: 249,
        discount: 25,
        shipping: 0,
        tax: 29.12,
        total: 253.12,
        currency: 'USD',
        shippingAddress: {
          firstName: 'Sarah',
          lastName: 'Chen',
          email: 'sarah.chen@techbridge.ca',
          phone: '+1 (416) 720-3391',
          street: '120 Adelaide St W',
          city: 'Toronto',
          state: 'ON',
          postalCode: 'M5H 1T1',
          country: 'Canada',
        },
        shippingMethod: {
          id: 'standard',
          name: 'Standard Courier',
          estimatedDays: '3-5 business days',
          price: 0,
          description: 'Standard delivery',
        },
        paymentMethod: {
          type: 'apple_pay',
        },
        status: 'Delivered',
        trackingNumber: 'DHL-391048192',
        estimatedDelivery: 'Sep 10, 2026',
        courierPartner: 'DHL Express',
        coinsEarned: 253,
      },
    ],
    judesCoins: 980,
  },
];

export default function AdminCommandCenter() {
  const {
    products,
    updateProductStock,
    updateProductPrice,
    updateProduct,
    addProduct,
    deleteProduct,
    user,
    updateOrderStatus,
    updateOrder,
    promoCodes,
    createPromoCode,
    deletePromoCode,
    judesCoins,
    grantCustomerCoins,
    recentWinners,
    triggerAdminDraw,
    prizePools,
    updatePrizePool,
    drawCriteria,
    updateDrawCriteria,
    currency,
    setCurrency,
    formatAmount,
    categories,
    addCategory,
    deleteCategory,
    vipTier,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'categories' | 'luckydraw' | 'promos' | 'customers'>('analytics');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search states
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategory, setProductCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'judes'>('all');

  // Modals state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [selectedEditOrder, setSelectedEditOrder] = useState<Order | null>(null);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);

  const [selectedEditProduct, setSelectedEditProduct] = useState<Product | null>(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);
  const [isCustomerDetailModalOpen, setIsCustomerDetailModalOpen] = useState(false);

  const [isLuckyDrawConfigOpen, setIsLuckyDrawConfigOpen] = useState(false);

  // Category Management Modal State
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('electronics');
  const [isCustomCategoryInput, setIsCustomCategoryInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newProductCurrency, setNewProductCurrency] = useState<CurrencyCode>(currency || 'INR');
  const [newProductPrice, setNewProductPrice] = useState<number>(currency === 'INR' ? 2499 : 149);
  const [newProductStock, setNewProductStock] = useState<number>(25);
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80');
  const [newProductIsJudes, setNewProductIsJudes] = useState(false);
  const [newProductDrawTier, setNewProductDrawTier] = useState<'platinum' | 'gold' | 'silver'>('gold');

  // Keep modal currency in sync with store currency
  useEffect(() => {
    if (currency) {
      setNewProductCurrency(currency);
      setNewProductPrice((prev) => {
        if (!prev || prev === 149 || prev === 2499) {
          return currency === 'INR' ? 2499 : 149;
        }
        return prev;
      });
    }
  }, [currency]);

  // Smooth conversion when switching currency in Add Product form
  const handleProductCurrencyChange = (targetCurr: CurrencyCode) => {
    if (targetCurr === newProductCurrency) return;
    const oldRate = CURRENCIES[newProductCurrency]?.rate || 1;
    const newRate = CURRENCIES[targetCurr]?.rate || 1;
    const usdVal = (newProductPrice || 0) / oldRate;
    const converted = targetCurr === 'INR' || targetCurr === 'JPY'
      ? Math.round(usdVal * newRate)
      : Math.round(usdVal * newRate * 100) / 100;
    setNewProductCurrency(targetCurr);
    setNewProductPrice(converted || (targetCurr === 'INR' ? 2499 : 149));
  };

  // New Promo Modal State
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoVal, setNewPromoVal] = useState<number>(20);
  const [newPromoDesc, setNewPromoDesc] = useState('VIP Flash discount code');

  // Live Draw Trigger state
  const [drawTierSelect, setDrawTierSelect] = useState<'platinum' | 'gold' | 'silver' | 'bumper'>('platinum');
  const [lastDrawnWinner, setLastDrawnWinner] = useState<{ winnerName: string; prize: string } | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const exportCSV = (filename: string, rows: (string | number)[][]) => {
    if (typeof window === 'undefined') return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📥 Exported ${filename} successfully!`);
  };

  const handleExportOrdersCSV = () => {
    const rate = CURRENCIES[currency]?.rate || 1;
    const symbol = CURRENCIES[currency]?.symbol || '$';
    const headers = ['Order ID', 'Date', 'Customer Name', 'Items Count', 'Status', 'Courier', 'Tracking No', 'Shipping Method', 'Gift Wrapped', `Total (${symbol} ${currency})`];
    const rows = user.orders.map((o) => [
      o.id,
      o.date,
      `${o.shippingAddress?.firstName || user.name} ${o.shippingAddress?.lastName || ''}`.trim(),
      o.items.reduce((s, i) => s + i.quantity, 0),
      o.status,
      o.courierPartner || 'Judes Express',
      o.trackingNumber || '',
      o.shippingMethod?.name || 'Standard',
      o.giftPackaging?.enabled ? 'Yes (Deluxe)' : 'No',
      (o.total * rate).toFixed(2),
    ]);
    exportCSV(`judescart-orders-${currency.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
  };

  const handleExportCatalogCSV = () => {
    const rate = CURRENCIES[currency]?.rate || 1;
    const symbol = CURRENCIES[currency]?.symbol || '$';
    const headers = ['SKU / ID', 'Product Name', 'Category', 'Draw Tier', `Price (${symbol} ${currency})`, `Original Price (${symbol} ${currency})`, 'Stock Available', 'Brand JUDES', 'Rating'];
    const rows = products.map((p) => [
      p.id,
      p.name,
      p.category,
      p.drawTier || 'None',
      (p.price * rate).toFixed(2),
      (p.originalPrice ? p.originalPrice * rate : p.price * 1.3 * rate).toFixed(2),
      p.sizes.reduce((sum, s) => sum + s.stock, 0),
      p.brand === 'JUDES' ? 'Yes' : 'No',
      p.rating,
    ]);
    exportCSV(`judescart-catalog-${currency.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
  };

  const handleExportWinnersCSV = () => {
    const headers = ['Winner ID', 'Customer Name', 'City / Country', 'Prize Won', 'Draw Tier', 'Date Awarded', 'Order ID'];
    const rows = recentWinners.map((w) => [
      w.id,
      w.name,
      w.city,
      w.prize,
      w.tier.toUpperCase(),
      w.date,
      w.orderId,
    ]);
    exportCSV(`judescart-draw-winners-${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
  };

  // KPI Calculations
  const allOrders = user.orders;
  const totalRevenue = useMemo(() => {
    const baseRevenue = 124500;
    const orderSum = allOrders.reduce((sum, o) => sum + o.total, 0);
    return baseRevenue + orderSum;
  }, [allOrders]);

  const totalOrdersCount = 412 + allOrders.length;
  const avgOrderValue = totalRevenue / Math.max(1, totalOrdersCount);

  // Filtered Orders with search
  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      const matchesStatus = orderFilter === 'all' || o.status.toLowerCase() === orderFilter.toLowerCase();
      const query = orderSearchQuery.toLowerCase().trim();
      if (!query) return matchesStatus;

      const customerName = `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.toLowerCase();
      const matchesId = o.id.toLowerCase().includes(query);
      const matchesName = customerName.includes(query);
      const matchesTrk = o.trackingNumber ? o.trackingNumber.toLowerCase().includes(query) : false;
      const matchesCourier = o.courierPartner ? o.courierPartner.toLowerCase().includes(query) : false;

      return matchesStatus && (matchesId || matchesName || matchesTrk || matchesCourier);
    });
  }, [allOrders, orderFilter, orderSearchQuery]);

  // Filtered Products with category, query, and low-stock filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = productCategory === 'all' || p.category === productCategory;
      const matchesQuery = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                           p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
                           p.id.toLowerCase().includes(productSearch.toLowerCase());

      const totalStock = p.sizes.reduce((sum, s) => sum + s.stock, 0);
      let matchesStock = true;
      if (stockFilter === 'low') matchesStock = totalStock > 0 && totalStock <= 10;
      else if (stockFilter === 'out') matchesStock = totalStock === 0;
      else if (stockFilter === 'judes') matchesStock = p.brand === 'JUDES' || !!p.isBumperEligible;

      return matchesCategory && matchesQuery && matchesStock;
    });
  }, [products, productCategory, productSearch, stockFilter]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const rate = CURRENCIES[newProductCurrency]?.rate || 1;
    const baseUsdPrice = newProductCurrency === 'USD'
      ? (newProductPrice || 0)
      : Math.round(((newProductPrice || 0) / rate) * 100) / 100;

    let finalCategory = newProductCategory;
    if (isCustomCategoryInput && customCategoryName.trim()) {
      finalCategory = addCategory(customCategoryName.trim()) as any;
    }

    const slug = newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: newProductName,
      tagline: 'Handcrafted luxury and certified performance',
      description: 'Precision engineered for durability, modern functionality, and contemporary minimalist luxury aesthetics.',
      category: finalCategory,
      brand: newProductIsJudes ? 'JUDES' : 'JudesCart Studio',
      isBumperEligible: newProductIsJudes,
      drawTier: newProductDrawTier,
      price: baseUsdPrice,
      originalPrice: Math.round(baseUsdPrice * 1.3 * 100) / 100,
      rating: 4.9,
      reviewCount: 14,
      images: [newProductImage],
      colors: [{ name: 'Default Onyx', hex: '#1E293B' }],
      sizes: [{ name: 'Standard Unit', stock: newProductStock }],
      badge: 'New',
      isFeatured: true,
      details: {
        materials: 'Aerospace Alloy / Full-grain Tuscan Calfskin',
        origin: 'Milan, Italy',
        care: 'Spot clean with microfiber',
        sustainability: '100% Recyclable Packaging',
      },
      reviews: [],
    };

    addProduct(newProd);
    setIsAddProductOpen(false);
    setNewProductName('');
    setIsCustomCategoryInput(false);
    setCustomCategoryName('');
    showToast(`✅ Created "${newProd.name}" at ${CURRENCIES[newProductCurrency]?.symbol || ''}${newProductPrice} (${formatAmount(baseUsdPrice)})!`);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = addCategory(newCatName, newCatDesc);
    setIsAddCategoryOpen(false);
    setNewCatName('');
    setNewCatDesc('');
    showToast(`📁 Created category "${newCatName.trim()}" (slug: ${slug})!`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const rate = CURRENCIES[currency]?.rate || 1;
    const value = newPromoType === 'percentage' ? newPromoVal / 100 : newPromoVal / rate;
    createPromoCode(newPromoCode, newPromoType, value, newPromoDesc);
    setIsAddPromoOpen(false);
    setNewPromoCode('');
    showToast(`🎟️ Promo code "${newPromoCode.toUpperCase()}" created and active storewide!`);
  };

  const handleTriggerDraw = () => {
    const res = triggerAdminDraw(drawTierSelect);
    setLastDrawnWinner(res);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    showToast(`🎉 WINNER SELECTED! ${res.winnerName} won ${res.prize}!`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070F1E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Admin Telemetry Ribbon */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-xl transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  JC
                </div>
                <div>
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                    Judes<span className="text-[#0066FF]">Cart</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-blue-50 dark:bg-blue-500/20 text-[#0066FF] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-400/30 px-1.5 py-0.5 rounded-md">
                      Command Center
                    </span>
                  </span>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Live Production Node</span>
                </span>
                <span>•</span>
                <span>iad1-cluster</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Currency Switcher */}
              <div className="hidden sm:block">
                <CurrencySwitcher />
              </div>

              {/* Dark Mode Toggle */}
              <ThemeToggle />

              {/* View Storefront */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all text-xs font-semibold shadow-2xs"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                <Image src={user.avatar} alt="Admin" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'analytics'
                ? 'border-[#0066FF] text-[#0066FF] dark:text-white bg-blue-50/80 dark:bg-blue-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
            <span>Executive Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'orders'
                ? 'border-[#0066FF] text-[#0066FF] dark:text-white bg-blue-50/80 dark:bg-blue-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            )}
          >
            <Truck className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
            <span>Orders & Fulfillment ({allOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'products'
                ? 'border-[#0066FF] text-[#0066FF] dark:text-white bg-blue-50/80 dark:bg-blue-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            )}
          >
            <Package className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
            <span>Catalog & Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'categories'
                ? 'border-[#0066FF] text-[#0066FF] dark:text-white bg-blue-50/80 dark:bg-blue-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            )}
          >
            <Layers className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('luckydraw')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'luckydraw'
                ? 'border-amber-500 text-amber-600 dark:text-white bg-amber-50 dark:bg-amber-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            )}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Lucky Draw & Bumper</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'promos'
                ? 'border-[#0066FF] text-[#0066FF] dark:text-white bg-blue-50/80 dark:bg-blue-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            )}
          >
            <Tag className="w-3.5 h-3.5 text-[#0066FF] dark:text-[#38BDF8]" />
            <span>Promotions & Vouchers</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'customers'
                ? 'border-[#0066FF] text-[#0066FF] dark:text-white bg-blue-50/80 dark:bg-blue-500/10'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
            )}
          >
            <Coins className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Customers & CRM Ledger</span>
          </button>
        </div>
      </header>

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#0F172A] border border-blue-500/50 text-white text-xs font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Command Center Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= TAB 1: EXECUTIVE ANALYTICS ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Scorecards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Gross Store Revenue</span>
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[#0066FF] dark:text-[#38BDF8]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                  {formatAmount(totalRevenue)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% vs last period</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Total Order Volume</span>
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                  {totalOrdersCount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+99.8% fulfillment reliability</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Average Order Value</span>
                  <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                  {formatAmount(avgOrderValue)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Boosted by Multi-Currency & Rewards</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Active Lucky Draw Pool</span>
                  <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-600 dark:text-amber-400 font-mono">
                  3,842 Entries
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Brand JUDES Grand Bumper</span>
                </div>
              </div>
            </div>

            {/* CSV Data Portability & Reporting Export Hub */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-slate-50 to-blue-50/70 dark:from-[#0F172A] dark:via-[#1E293B]/80 dark:to-[#0F172A] border border-blue-200/80 dark:border-blue-500/20 shadow-xs dark:shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066FF] dark:text-[#38BDF8]">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Data Portability & Accounting Exports</span>
                </div>
                <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
                  Export Real-Time JudesCart Business Records
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Instant client-side CSV generation with full financial, inventory, and winner registries.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2.5">
                <button
                  onClick={handleExportOrdersCSV}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-blue-600/20 hover:bg-blue-50 dark:hover:bg-blue-600/30 border border-blue-200 dark:border-blue-500/40 text-[#0066FF] dark:text-[#38BDF8] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Orders CSV</span>
                </button>

                <button
                  onClick={handleExportCatalogCSV}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-emerald-600/20 hover:bg-emerald-50 dark:hover:bg-emerald-600/30 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Catalog CSV</span>
                </button>

                <button
                  onClick={handleExportWinnersCSV}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-amber-600/20 hover:bg-amber-50 dark:hover:bg-amber-600/30 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Winners CSV</span>
                </button>
              </div>
            </div>

            {/* Visual SVG Revenue Area Curve & Telemetry */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Trajectory Curve</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-[#0066FF] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-400/30">
                      Live Dynamic
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Continuous spline telemetry tracking store sales across all currencies
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                  {(['7d', '30d', '90d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setTimeRange(r)}
                      className={cn(
                        'px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer',
                        timeRange === r ? 'bg-[#0066FF] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      )}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive SVG Area Chart */}
              <div className="pt-2">
                <div className="relative w-full aspect-[21/9] sm:aspect-[28/9] max-h-64">
                  <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0066FF" stopOpacity="0.35" />
                        <stop offset="70%" stopColor="#0066FF" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="#0066FF" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="50%" stopColor="#0066FF" />
                        <stop offset="100%" stopColor="#818CF8" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="0" y1="40" x2="700" y2="40" stroke="#E2E8F0" className="dark:stroke-[#1E293B]" strokeDasharray="4 4" />
                    <line x1="0" y1="90" x2="700" y2="90" stroke="#E2E8F0" className="dark:stroke-[#1E293B]" strokeDasharray="4 4" />
                    <line x1="0" y1="140" x2="700" y2="140" stroke="#E2E8F0" className="dark:stroke-[#1E293B]" strokeDasharray="4 4" />
                    <line x1="0" y1="180" x2="700" y2="180" stroke="#CBD5E1" className="dark:stroke-[#334155]" />

                    {/* Area fill */}
                    <path
                      d="M 0 180 Q 70 140 140 150 T 280 110 T 420 80 T 560 50 T 700 30 L 700 180 L 0 180 Z"
                      fill="url(#areaGradient)"
                    />

                    {/* Stroke Spline */}
                    <path
                      d="M 0 180 Q 70 140 140 150 T 280 110 T 420 80 T 560 50 T 700 30"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Peak Point & Highlight */}
                    <circle cx="700" cy="30" r="5" fill="#38BDF8" className="animate-pulse" />
                    <circle cx="560" cy="50" r="4" fill="#0066FF" />
                    <circle cx="420" cy="80" r="4" fill="#0066FF" />
                    <circle cx="280" cy="110" r="4" fill="#0066FF" />
                    <circle cx="140" cy="150" r="4" fill="#0066FF" />
                  </svg>
                </div>

                {/* X-Axis labels */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>{timeRange === '7d' ? 'Day 1' : timeRange === '30d' ? '1st of Month' : 'Quarter Start'}</span>
                  <span>{timeRange === '7d' ? 'Day 3' : timeRange === '30d' ? '10th' : 'Month 2'}</span>
                  <span>{timeRange === '7d' ? 'Day 5' : timeRange === '30d' ? '20th' : 'Month 3'}</span>
                  <span className="text-[#0066FF] dark:text-[#38BDF8] font-bold">Today (Peak Run-Rate)</span>
                </div>
              </div>

              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Avg Daily Run Rate</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">{formatAmount(4850)} / day</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Conversion Rate</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">3.82% (+0.6%)</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Lucky Draw Engagement</span>
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">74.6% of shoppers</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">VIP Repeat Orders</span>
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400 font-mono mt-0.5">41.8% velocity</p>
                </div>
              </div>
            </div>

            {/* Performance Graphs & Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly Sales Chart */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Sales Velocity</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Calculated across all departments</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-full">
                    🟢 Peak Activity
                  </span>
                </div>

                <div className="pt-6 grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 border-b border-slate-200 dark:border-slate-800 pb-3">
                  {[
                    { day: 'Mon', val: 65, revUSD: 14200 },
                    { day: 'Tue', val: 78, revUSD: 18100 },
                    { day: 'Wed', val: 54, revUSD: 12000 },
                    { day: 'Thu', val: 89, revUSD: 22400 },
                    { day: 'Fri', val: 95, revUSD: 28900 },
                    { day: 'Sat', val: 100, revUSD: 34500 },
                    { day: 'Sun', val: 84, revUSD: 20800 },
                  ].map((bar) => (
                    <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatAmount(bar.revUSD)}
                      </span>
                      <div
                        style={{ height: `${bar.val}%` }}
                        className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-[#0066FF] to-cyan-400 group-hover:brightness-110 transition-all"
                      />
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Shares */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/80 shadow-xs dark:shadow-lg space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Mix</h3>
                <div className="space-y-3 pt-2">
                  {[
                    { name: 'Electronics & Audio', pct: 42, color: 'bg-blue-500' },
                    { name: 'Apparel & Streetwear', pct: 26, color: 'bg-indigo-500' },
                    { name: 'Footwear & Boots', pct: 16, color: 'bg-cyan-500' },
                    { name: 'Leather Goods', pct: 10, color: 'bg-amber-500' },
                    { name: 'Home & Living', pct: 6, color: 'bg-emerald-500' },
                  ].map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{item.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div style={{ width: `${item.pct}%` }} className={cn('h-full rounded-full', item.color)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ORDERS & FULFILLMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Orders Header & Search Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Fulfillment & Shipping Radar</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assign courier partners, issue waybills, generate official tax invoices, and control delivery progression
                </p>
              </div>

              <button
                onClick={handleExportOrdersCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Orders</span>
              </button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, Courier, or Tracking No..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['all', 'Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                      orderFilter === status
                        ? 'bg-[#0066FF] text-white shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                    )}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-xs dark:shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Courier & Tracking</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions & Invoicing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-400 dark:text-slate-500">
                          No orders matching this search or filter criteria
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                            #{order.id}
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal">{order.date}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-900 dark:text-slate-200 block">
                              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">
                              {order.shippingAddress?.city}, {order.shippingAddress?.country}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {order.items.slice(0, 3).map((item) => (
                                <div
                                  key={item.id}
                                  className="relative w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0"
                                  title={`${item.name} (x${item.quantity})`}
                                >
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <span className="text-[10px] text-slate-400 font-bold">
                                  +{order.items.length - 3}
                                </span>
                              )}
                              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium ml-1">
                                {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                            {formatAmount(order.total)}
                          </td>
                          <td className="p-4">
                            <div>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                <Truck className="w-3 h-3 text-[#0066FF]" />
                                <span>{order.courierPartner || 'Judes Express'}</span>
                              </span>
                              <div className="mt-1">
                                <Link
                                  href={`/checkout/success?orderId=${order.id}`}
                                  target="_blank"
                                  className="font-mono text-[11px] text-[#0066FF] dark:text-[#38BDF8] hover:underline flex items-center gap-1"
                                >
                                  <span>{order.trackingNumber || 'Unassigned'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                'text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider',
                                order.status === 'Delivered' && 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30',
                                order.status === 'Out for Delivery' && 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30',
                                order.status === 'Shipped' && 'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30',
                                order.status === 'Confirmed' && 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30',
                                order.status === 'Processing' && 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30',
                                order.status === 'Cancelled' && 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                              )}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Print Invoice Button */}
                              <button
                                onClick={() => {
                                  setSelectedInvoiceOrder(order);
                                  setIsInvoiceModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer"
                                title="Print Invoice / Packing Slip"
                              >
                                <Printer className="w-3.5 h-3.5 text-[#0066FF]" />
                                <span className="hidden sm:inline text-[11px]">Invoice</span>
                              </button>

                              {/* Fulfill / Edit Modal Button */}
                              <button
                                onClick={() => {
                                  setSelectedEditOrder(order);
                                  setIsEditOrderModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0066FF] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800/40 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                                title="Manage Fulfillment & Shipping"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline text-[11px]">Fulfill</span>
                              </button>

                              {/* Quick Step Advance */}
                              {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <button
                                  onClick={() => {
                                    const nextStatusMap: Record<Order['status'], Order['status']> = {
                                      Processing: 'Confirmed',
                                      Confirmed: 'Shipped',
                                      Shipped: 'Out for Delivery',
                                      'Out for Delivery': 'Delivered',
                                      Delivered: 'Delivered',
                                      Cancelled: 'Cancelled',
                                    };
                                    const next = nextStatusMap[order.status];
                                    updateOrderStatus(order.id, next);
                                    showToast(`Order #${order.id} advanced to "${next}"!`);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-[11px] transition-all shadow-xs cursor-pointer"
                                >
                                  Next →
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CATALOG & INVENTORY ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Catalog & Inventory Engine</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage inventory levels, variant options, pricing tiers, and low-stock replenishment alerts
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Filter & Stock Alert Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs dark:shadow-md">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search catalog by title, category, or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              {/* Stock Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setStockFilter('all')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                    stockFilter === 'all'
                      ? 'bg-[#0066FF] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setStockFilter('low')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1',
                    stockFilter === 'low'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                  )}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Low Stock (&le;10)</span>
                </button>
                <button
                  onClick={() => setStockFilter('out')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                    stockFilter === 'out'
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                  )}
                >
                  Out of Stock
                </button>
                <button
                  onClick={() => setStockFilter('judes')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1',
                    stockFilter === 'judes'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-amber-50/70 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40'
                  )}
                >
                  <Crown className="w-3 h-3 text-amber-500" />
                  <span>Brand JUDES</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category === cat.slug).length;
                    return (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0F172A] overflow-hidden shadow-xs dark:shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/90 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Draw Tier</th>
                      <th className="p-4">Live Price ({CURRENCIES[currency]?.symbol || '$'} {currency})</th>
                      <th className="p-4">Stock Units & Alerts</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredProducts.map((prod) => {
                      const totalStock = prod.sizes.reduce((sum, s) => sum + s.stock, 0);

                      return (
                        <tr key={prod.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                                <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1">{prod.name}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {prod.brand === 'JUDES' && (
                                    <span className="text-[9px] font-black uppercase text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-400/30 px-1.5 py-0.2 rounded-md">
                                      Brand JUDES (Bumper)
                                    </span>
                                  )}
                                  {prod.badge && (
                                    <span className="text-[9px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/30 px-1.5 py-0.2 rounded-md">
                                      {prod.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 capitalize text-slate-600 dark:text-slate-300">
                            {prod.category.replace('-', ' ')}
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                              {prod.drawTier || 'silver'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm">{formatAmount(prod.price)}</span>
                              <button
                                onClick={() => {
                                  setSelectedEditProduct(prod);
                                  setIsEditProductModalOpen(true);
                                }}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                title="Edit Product Specs"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  updateProductStock(prod.id, Math.max(0, totalStock - 1));
                                  showToast(`Stock reduced to ${totalStock - 1}`);
                                }}
                                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                              >
                                -
                              </button>
                              <span
                                className={cn(
                                  'font-mono font-bold text-xs min-w-[28px] text-center',
                                  totalStock <= 3 ? 'text-rose-500 dark:text-rose-400' : totalStock <= 10 ? 'text-amber-500' : 'text-slate-800 dark:text-slate-200'
                                )}
                              >
                                {totalStock}
                              </span>
                              <button
                                onClick={() => {
                                  updateProductStock(prod.id, totalStock + 5);
                                  showToast(`Stock increased to ${totalStock + 5}`);
                                }}
                                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                              >
                                +
                              </button>
                              {totalStock === 0 ? (
                                <span className="text-[10px] text-rose-500 font-bold uppercase bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                                  Out
                                </span>
                              ) : totalStock <= 5 ? (
                                <span className="text-[10px] text-rose-500 font-bold uppercase bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                                  Critical (&le;5)
                                </span>
                              ) : totalStock <= 10 ? (
                                <span className="text-[10px] text-amber-500 font-bold uppercase bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                                  Low Stock
                                </span>
                              ) : null}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Modal Button */}
                              <button
                                onClick={() => {
                                  setSelectedEditProduct(prod);
                                  setIsEditProductModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#0066FF] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800/40 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>

                              <Link
                                href={`/products/${prod.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                title="View on storefront"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                                    deleteProduct(prod.id);
                                    showToast(`Deleted ${prod.name}`);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3.5: CATEGORIES TAXONOMY ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Category Taxonomy & Departments</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Organize store departments, create custom product classifications, and inspect live inventory density
                </p>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Category</span>
              </button>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Departments</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{categories.length}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Custom User Categories</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {categories.filter((c) => c.isCustom).length}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Assigned Products</div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">{products.length}</div>
                </div>
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.slug).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center text-amber-500 font-bold text-sm">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                              {cat.name}
                            </h3>
                            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                              slug: {cat.slug}
                            </div>
                          </div>
                        </div>

                        <span
                          className={cn(
                            'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider',
                            cat.isCustom
                              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          )}
                        >
                          {cat.isCustom ? 'Custom' : 'Core'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">
                        {cat.description || `Catalog department featuring curated ${cat.name.toLowerCase()} products.`}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium">{count} products assigned</span>
                      {cat.isCustom && (
                        <button
                          onClick={() => {
                            if (confirm(`Delete custom category "${cat.name}"?`)) {
                              deleteCategory(cat.slug);
                              showToast(`Deleted category ${cat.name}`);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-600 dark:text-rose-400 text-[11px] font-semibold"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: LUCKY DRAW & BUMPER ================= */}
        {activeTab === 'luckydraw' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Lucky Draw & Bumper Console</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                    Live Randomizer
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control the Platinum, Gold, Silver regular draws and the signature Brand JUDES Mega Bumper draw
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsLuckyDrawConfigOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Settings2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Configure Prize Pools & Criteria</span>
                </button>

                <button
                  onClick={handleExportWinnersCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Winners</span>
                </button>
              </div>
            </div>

            {/* Tier Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Platinum */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                      Platinum Tier
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    &gt;{formatAmount(drawCriteria.platinum ?? 500)} spend
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Active Prize Pool:</div>
                  <ul className="text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1">
                    {(prizePools.platinum || ['iPhone 16 Pro Max', 'MacBook Air M3']).slice(0, 2).map((p, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="truncate">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Gold */}
              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                      Gold Tier
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                    &gt;{formatAmount(drawCriteria.gold ?? 250)} spend
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Active Prize Pool:</div>
                  <ul className="text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1">
                    {(prizePools.gold || ['Sony WH-1000XM5', 'Apple Watch Series 10']).slice(0, 2).map((p, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="truncate">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Silver */}
              <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-300/80 dark:border-blue-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#0066FF] dark:text-[#38BDF8]" />
                    <span className="font-bold text-xs uppercase tracking-wider text-blue-900 dark:text-blue-300">
                      Silver Tier
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400">
                    &gt;{formatAmount(drawCriteria.silver ?? 100)} spend
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Active Prize Pool:</div>
                  <ul className="text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1">
                    {(prizePools.silver || ['AirPods 4', 'Coffee Set']).slice(0, 2).map((p, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                        <span className="truncate">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mega Bumper */}
              <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-300/80 dark:border-purple-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-purple-900 dark:text-purple-300">
                      Mega Bumper
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400">
                    Brand JUDES Exclusive
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Jackpot Prize Pool:</div>
                  <ul className="text-xs font-semibold text-slate-800 dark:text-slate-200 space-y-1">
                    {(prizePools.bumper || ['Mercedes-Benz C-Class', 'Swiss Alps Trip']).slice(0, 2).map((p, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span className="truncate">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Simulation Trigger Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Live Randomizer Trigger
                  </h3>
                  <RefreshCw className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Trigger an on-demand verified cryptographic draw. Picks a customer from the qualifying pool and adds them to the verified winners registry.
                </p>

                <div className="space-y-3 pt-2">
                  <select
                    value={drawTierSelect}
                    onChange={(e) => setDrawTierSelect(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-hidden cursor-pointer"
                  >
                    <option value="platinum">Platinum Draw Tier (Flagship Tech)</option>
                    <option value="gold">Gold Draw Tier (Wearables & Audio)</option>
                    <option value="silver">Silver Draw Tier (Accessories & Cash)</option>
                    <option value="bumper">Brand JUDES Grand Bumper (Cars & VIP Trips)</option>
                  </select>

                  <button
                    onClick={handleTriggerDraw}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Trigger Verified Live Draw</span>
                  </button>
                </div>

                {lastDrawnWinner && (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/50 text-xs animate-in zoom-in-95">
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold tracking-wider">
                      Latest Winner Announced
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white mt-1">
                      {lastDrawnWinner.winnerName} won{' '}
                      <strong className="text-amber-600 dark:text-amber-300">{lastDrawnWinner.prize}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Pool Status & Schedule */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Jackpot Telemetry</h3>
                  <Crown className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                </div>
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Total Entries In Pool:</span>
                    <span className="font-mono font-black text-amber-500 dark:text-amber-400 text-sm">3,842</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Weekly Draw Schedule:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">Sundays @ 8:00 PM UTC</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Grand Bumper Draw Date:</span>
                    <span className="font-mono font-bold text-purple-600 dark:text-purple-400">Dec 31, 2026</span>
                  </div>
                </div>
              </div>

              {/* Quick Link to Customer Wheel */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Live Customer Arena</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    View the customer-facing lucky wheel with ticking countdown, prize tiers, and live winner tickers.
                  </p>
                </div>
                <Link
                  href="/lucky-draw"
                  target="_blank"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs text-center border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>Open /lucky-draw Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Recent Winners Ledger */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Winners Wall Ledger ({recentWinners.length} verified)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentWinners.map((winner) => (
                  <div
                    key={winner.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400/40 shrink-0">
                      <Image src={winner.avatar} alt={winner.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{winner.name}</p>
                        <span className="text-[10px] uppercase font-bold text-amber-500 dark:text-amber-400">{winner.tier}</span>
                      </div>
                      <p className="text-amber-700 dark:text-amber-300 font-medium text-[11px] truncate">{winner.prize}</p>
                      <p className="text-slate-500 text-[10px]">{winner.city} • {winner.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: PROMOTIONS & VOUCHERS ================= */}
        {activeTab === 'promos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Promotions & Flash Vouchers</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Create and manage discount codes for checkout redemption
                </p>
              </div>

              <button
                onClick={() => setIsAddPromoOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon Code</span>
              </button>
            </div>

            {/* Promo Codes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(promoCodes).map(([key, promo]) => (
                <div
                  key={key}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-lg space-y-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-base font-black px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-400/30 text-[#0066FF] dark:text-[#38BDF8]">
                        {promo.code}
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{promo.description}</p>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-transparent">
                      {promo.discountType === 'percentage'
                        ? `${Math.round(promo.discountValue * 100)}% OFF`
                        : `${formatAmount(promo.discountValue)} OFF`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Status: <strong className="text-emerald-600 dark:text-emerald-400">Active</strong></span>
                    <button
                      onClick={() => {
                        deletePromoCode(promo.code);
                        showToast(`Deleted promo code ${promo.code}`);
                      }}
                      className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors p-1 cursor-pointer"
                      title="Delete code"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: CUSTOMERS & CRM LEDGER ================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Customer Directory & JudesCoins CRM</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    VIP Loyalty Ledger
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Inspect customer order history, audit loyalty reward grants, and inspect VIP statuses
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    grantCustomerCoins(250);
                    showToast(`🪙 Airdropped +250 JudesCoins to active VIP Eleanor Vance!`);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Airdrop +250 Coins to VIP</span>
                </button>
              </div>
            </div>

            {/* Customer Directory Cards */}
            <div className="space-y-4">
              {CRM_CUSTOMERS.map((cust) => {
                const isCurrent = cust.name === user.name;
                const coinsBal = isCurrent ? judesCoins : (cust.judesCoins || 650);

                return (
                  <div
                    key={cust.email}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#0066FF] shadow-xs">
                          <Image src={cust.avatar} alt={cust.name} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                              {cust.name}
                            </h3>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#0066FF] dark:text-[#38BDF8]">
                                Active Account
                              </span>
                            )}
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              {isCurrent ? `VIP ${vipTier.toUpperCase()}` : 'VIP GOLD'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {cust.email} • {cust.savedAddresses[0]?.city}, {cust.savedAddresses[0]?.country}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setIsCustomerDetailModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>View Full CRM Profile</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[11px] text-slate-400">Total Completed Orders</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                          {cust.orders.length}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[11px] text-slate-400">JudesCoins Balance</span>
                        <div className="font-mono font-black text-amber-500 dark:text-amber-400 text-sm mt-0.5 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5" />
                          <span>{coinsBal.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[11px] text-slate-400">Last Order Placed</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5">
                          {cust.orders[0]?.date || 'Recent'}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[11px] text-slate-400">Lifetime Spent</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                          {formatAmount(cust.orders.reduce((sum, o) => sum + o.total, 0))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}

      {/* Printable Invoice Modal */}
      <OrderInvoiceModal
        order={selectedInvoiceOrder}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      {/* Order Fulfillment & Courier Edit Modal */}
      <OrderEditModal
        order={selectedEditOrder}
        isOpen={isEditOrderModalOpen}
        onClose={() => setIsEditOrderModalOpen(false)}
        onSaved={showToast}
      />

      {/* Product & Variant Stock Edit Modal */}
      <ProductEditModal
        product={selectedEditProduct}
        isOpen={isEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        onSaved={showToast}
      />

      {/* Customer CRM Profile & Coins Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        isOpen={isCustomerDetailModalOpen}
        onClose={() => setIsCustomerDetailModalOpen(false)}
        onViewInvoice={(ord) => {
          setSelectedInvoiceOrder(ord);
          setIsInvoiceModalOpen(true);
        }}
        onCoinsGranted={showToast}
      />

      {/* Lucky Draw & Bumper Prize Pools Configuration Modal */}
      <LuckyDrawConfigModal
        isOpen={isLuckyDrawConfigOpen}
        onClose={() => setIsLuckyDrawConfigOpen(false)}
        onSaved={showToast}
      />

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Catalog Product</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solis Titanium ANC Earbuds"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 dark:text-slate-300 font-semibold">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategoryInput(!isCustomCategoryInput)}
                      className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                    >
                      {isCustomCategoryInput ? 'Select list' : '+ New custom'}
                    </button>
                  </div>

                  {isCustomCategoryInput ? (
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gaming Gear"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0066FF]"
                    />
                  ) : (
                    <select
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value as ProductCategory)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                    >
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Lucky Draw Tier</label>
                  <select
                    value={newProductDrawTier}
                    onChange={(e) => setNewProductDrawTier(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="platinum">Platinum (&gt;{formatAmount(500)})</option>
                    <option value="gold">Gold ({formatAmount(250)} - {formatAmount(500)})</option>
                    <option value="silver">Silver ({formatAmount(100)} - {formatAmount(250)})</option>
                  </select>
                </div>
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 dark:text-slate-300 font-semibold">Price Currency</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      1 USD = {CURRENCIES[newProductCurrency]?.rate} {newProductCurrency}
                    </span>
                  </div>
                  <select
                    value={newProductCurrency}
                    onChange={(e) => handleProductCurrencyChange(e.target.value as CurrencyCode)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-hidden"
                  >
                    {Object.values(CURRENCIES).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Price in {newProductCurrency} ({CURRENCIES[newProductCurrency]?.symbol})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={newProductPrice || ''}
                    onChange={(e) => setNewProductPrice(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(parseInt(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newProductImage}
                    onChange={(e) => setNewProductImage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono text-[11px] focus:outline-hidden focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-400/30 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-200 block">JudesCart Own Brand &quot;JUDES&quot;</span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-300">Enables Bumper Draw Qualification</span>
                </div>
                <input
                  type="checkbox"
                  checked={newProductIsJudes}
                  onChange={(e) => setNewProductIsJudes(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/20 text-[#0066FF] dark:text-[#38BDF8]">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Category</h3>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Category Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luxury Timepieces, Smart Wearables, Perfumery"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#0066FF]"
                />
                {newCatName.trim() && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Generated slug: {newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short summary describing products in this category..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25 cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Promo Modal */}
      {isAddPromoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Promotion Voucher</h3>
              <button
                onClick={() => setIsAddPromoOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP25 or FESTIVE100"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ({CURRENCIES[currency]?.symbol || '$'} {currency})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Value {newPromoType === 'percentage' ? '(e.g. 25 for 25%)' : `(${CURRENCIES[currency]?.symbol || '$'} ${currency})`}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPromoVal}
                    onChange={(e) => setNewPromoVal(parseFloat(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newPromoDesc}
                  onChange={(e) => setNewPromoDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPromoOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold shadow-md cursor-pointer"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
