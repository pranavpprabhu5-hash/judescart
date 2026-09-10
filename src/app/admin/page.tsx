'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';
import { Product, ProductCategory } from '@/types/product';
import { Order } from '@/types/user';
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
  Activity,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminCommandCenter() {
  const {
    products,
    updateProductStock,
    updateProductPrice,
    addProduct,
    deleteProduct,
    user,
    updateOrderStatus,
    promoCodes,
    createPromoCode,
    deletePromoCode,
    judesCoins,
    grantCustomerCoins,
    recentWinners,
    triggerAdminDraw,
    formatAmount,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'products' | 'luckydraw' | 'promos' | 'customers'>('analytics');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search states
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategory, setProductCategory] = useState<string>('all');

  // New Product Modal State
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('electronics');
  const [newProductPrice, setNewProductPrice] = useState<number>(149);
  const [newProductStock, setNewProductStock] = useState<number>(25);
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80');
  const [newProductIsJudes, setNewProductIsJudes] = useState(false);
  const [newProductDrawTier, setNewProductDrawTier] = useState<'platinum' | 'gold' | 'silver'>('gold');

  // New Promo Modal State
  const [isAddPromoOpen, setIsAddPromoOpen] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percentage' | 'fixed'>('percentage');
  const [newPromoVal, setNewPromoVal] = useState<number>(20);
  const [newPromoDesc, setNewPromoDesc] = useState('VIP Flash discount code');

  // Live Draw Trigger state
  const [drawTierSelect, setDrawTierSelect] = useState<'platinum' | 'gold' | 'silver' | 'bumper'>('platinum');
  const [lastDrawnWinner, setLastDrawnWinner] = useState<{ winnerName: string; prize: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
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

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderFilter === 'all') return allOrders;
    return allOrders.filter((o) => o.status.toLowerCase() === orderFilter.toLowerCase());
  }, [allOrders, orderFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = productCategory === 'all' || p.category === productCategory;
      const matchesQuery = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                           p.category.toLowerCase().includes(productSearch.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, productCategory, productSearch]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const slug = newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: newProductName,
      tagline: 'Handcrafted luxury and certified performance',
      description: 'Precision engineered for durability, modern functionality, and contemporary minimalist luxury aesthetics.',
      category: newProductCategory,
      brand: newProductIsJudes ? 'JUDES' : 'JudesCart Studio',
      isBumperEligible: newProductIsJudes,
      drawTier: newProductDrawTier,
      price: newProductPrice,
      originalPrice: Math.round(newProductPrice * 1.3),
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
    showToast(`✅ Created product "${newProd.name}" and added to active catalog!`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;
    const value = newPromoType === 'percentage' ? newPromoVal / 100 : newPromoVal;
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
    <div className="min-h-screen bg-[#070F1E] text-slate-100 font-sans">
      {/* Top Admin Telemetry Ribbon */}
      <header className="sticky top-0 z-40 bg-[#0A192F]/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
                  JC
                </div>
                <div>
                  <span className="font-bold text-sm sm:text-base text-white flex items-center gap-1.5">
                    Judes<span className="text-[#0066FF]">Cart</span>
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-blue-500/20 text-[#38BDF8] border border-blue-400/30 px-1.5 py-0.2 rounded-md">
                      Command Center
                    </span>
                  </span>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-semibold">Live Production Node</span>
                </span>
                <span>•</span>
                <span>iad1-cluster</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all text-xs font-semibold shadow-xs"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <div className="w-8 h-8 rounded-full border border-slate-700 overflow-hidden bg-slate-800 relative">
                <Image src={user.avatar} alt="Admin" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap',
              activeTab === 'analytics'
                ? 'border-[#0066FF] text-white bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Executive Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap',
              activeTab === 'orders'
                ? 'border-[#0066FF] text-white bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
          >
            <Truck className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Orders & Fulfillment ({allOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap',
              activeTab === 'products'
                ? 'border-[#0066FF] text-white bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
          >
            <Package className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Catalog & Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('luckydraw')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap',
              activeTab === 'luckydraw'
                ? 'border-amber-500 text-white bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Lucky Draw Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap',
              activeTab === 'promos'
                ? 'border-[#0066FF] text-white bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
          >
            <Tag className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Promotions & Vouchers</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={cn(
              'flex items-center gap-2 py-3 px-3.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap',
              activeTab === 'customers'
                ? 'border-[#0066FF] text-white bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>JudesCoins & VIP Ledger</span>
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
              <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Gross Store Revenue</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-[#38BDF8]">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                  {formatAmount(totalRevenue)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% vs last period</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Total Order Volume</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                  {totalOrdersCount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+99.8% fulfillment reliability</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Average Order Value</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                  {formatAmount(avgOrderValue)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <span>Boosted by Bundle Builder</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Active Lucky Draw Pool</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-amber-400 font-mono">
                  3,842 Entries
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>$10,000 Grand Bumper</span>
                </div>
              </div>
            </div>

            {/* Performance Graphs & Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Weekly Sales Chart */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">Weekly Sales Velocity</h3>
                    <p className="text-xs text-slate-400">Calculated across all departments</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    🟢 Peak Activity
                  </span>
                </div>

                <div className="pt-6 grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 border-b border-slate-800 pb-3">
                  {[
                    { day: 'Mon', val: 65, rev: '$14.2k' },
                    { day: 'Tue', val: 78, rev: '$18.1k' },
                    { day: 'Wed', val: 54, rev: '$12.0k' },
                    { day: 'Thu', val: 89, rev: '$22.4k' },
                    { day: 'Fri', val: 95, rev: '$28.9k' },
                    { day: 'Sat', val: 100, rev: '$34.5k' },
                    { day: 'Sun', val: 84, rev: '$20.8k' },
                  ].map((bar) => (
                    <div key={bar.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.rev}
                      </span>
                      <div
                        style={{ height: `${bar.val}%` }}
                        className="w-full max-w-[36px] rounded-t-lg bg-gradient-to-t from-[#0066FF] to-cyan-400 group-hover:brightness-125 transition-all"
                      />
                      <span className="text-xs font-bold text-slate-400 group-hover:text-white">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Shares */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-lg space-y-4">
                <h3 className="text-base font-bold text-white">Department Mix</h3>
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
                        <span className="text-slate-300 font-medium">{item.name}</span>
                        <span className="font-mono font-bold text-white">{item.pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
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
            {/* Orders Header & Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Fulfillment & Orders Radar</h2>
                <p className="text-xs text-slate-400">
                  Update live courier status to simulate customer live GPS tracking
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['all', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                      orderFilter === status
                        ? 'bg-[#0066FF] text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    )}
                  >
                    {status === 'all' ? 'All Orders' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Tracking Number</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Advance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-500">
                          No orders matching this filter
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-white">
                            #{order.id}
                            <span className="block text-[10px] text-slate-400 font-normal">{order.date}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-200 block">
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {order.shippingAddress.city}, {order.shippingAddress.country}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="relative w-8 h-8 rounded-md bg-slate-800 overflow-hidden border border-slate-700 shrink-0"
                                  title={`${item.name} (x${item.quantity})`}
                                >
                                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                              ))}
                              <span className="text-slate-400 text-[11px]">
                                {order.items.reduce((s, i) => s + i.quantity, 0)} pcs
                              </span>
                            </div>
                          </td>
                          <td className="p-4 font-mono font-bold text-white">
                            {formatAmount(order.total)}
                          </td>
                          <td className="p-4">
                            <Link
                              href={`/checkout/success?orderId=${order.id}`}
                              target="_blank"
                              className="font-mono text-[11px] text-[#38BDF8] hover:underline flex items-center gap-1"
                            >
                              <span>{order.trackingNumber}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </td>
                          <td className="p-4">
                            <span
                              className={cn(
                                'text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider',
                                order.status === 'Delivered' && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                                order.status === 'Out for Delivery' && 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
                                order.status === 'Shipped' && 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
                                order.status === 'Processing' && 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              )}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {order.status !== 'Delivered' && (
                                <button
                                  onClick={() => {
                                    const nextStatusMap: Record<Order['status'], Order['status']> = {
                                      Processing: 'Shipped',
                                      Shipped: 'Out for Delivery',
                                      'Out for Delivery': 'Delivered',
                                      Delivered: 'Delivered',
                                    };
                                    const next = nextStatusMap[order.status];
                                    updateOrderStatus(order.id, next);
                                    showToast(`Order #${order.id} advanced to "${next}"!`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-[11px] transition-all shadow-xs"
                                >
                                  Next Step →
                                </button>
                              )}
                              <select
                                value={order.status}
                                onChange={(e) => {
                                  const val = e.target.value as Order['status'];
                                  updateOrderStatus(order.id, val);
                                  showToast(`Order #${order.id} status updated to "${val}"`);
                                }}
                                className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg text-[11px] p-1 focus:outline-hidden"
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
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
                <h2 className="text-xl font-bold text-white">Product Catalog & Inventory</h2>
                <p className="text-xs text-slate-400">
                  Manage inventory levels, adjust prices live, or add new catalog items
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-[#0F172A] border border-slate-800">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search catalog by title, category, or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="apparel">Apparel</option>
                <option value="footwear">Footwear</option>
                <option value="leather-goods">Leather Goods</option>
                <option value="home-living">Home & Living</option>
                <option value="beauty">Beauty</option>
              </select>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl border border-slate-800 bg-[#0F172A] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Product Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Draw Tier</th>
                      <th className="p-4">Live Price</th>
                      <th className="p-4">Stock Units</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.map((prod) => {
                      const totalStock = prod.sizes.reduce((sum, s) => sum + s.stock, 0);

                      return (
                        <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
                                <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white text-xs line-clamp-1">{prod.name}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {prod.brand === 'JUDES' && (
                                    <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded-md">
                                      Brand JUDES
                                    </span>
                                  )}
                                  {prod.badge && (
                                    <span className="text-[9px] font-bold text-blue-300 bg-blue-500/20 px-1.5 py-0.2 rounded-md">
                                      {prod.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 capitalize text-slate-300">
                            {prod.category.replace('-', ' ')}
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                              {prod.drawTier || 'silver'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-white">
                            <div className="flex items-center gap-1.5">
                              <span>${prod.price}</span>
                              <button
                                onClick={() => {
                                  const newPrice = prompt(`Enter new price for ${prod.name}:`, prod.price.toString());
                                  if (newPrice && !isNaN(parseFloat(newPrice))) {
                                    updateProductPrice(prod.id, parseFloat(newPrice));
                                    showToast(`Updated ${prod.name} price to $${newPrice}`);
                                  }
                                }}
                                className="p-1 rounded text-slate-500 hover:text-white"
                                title="Edit Price"
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
                                className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700"
                              >
                                -
                              </button>
                              <span
                                className={cn(
                                  'font-mono font-bold text-xs min-w-[28px] text-center',
                                  totalStock <= 3 ? 'text-rose-400' : 'text-slate-200'
                                )}
                              >
                                {totalStock}
                              </span>
                              <button
                                onClick={() => {
                                  updateProductStock(prod.id, totalStock + 5);
                                  showToast(`Stock increased to ${totalStock + 5}`);
                                }}
                                className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-slate-700"
                              >
                                +
                              </button>
                              {totalStock <= 3 && (
                                <span className="text-[10px] text-rose-400 font-bold uppercase">Low</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/products/${prod.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
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
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
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

        {/* ================= TAB 4: LUCKY DRAW SIMULATOR ================= */}
        {activeTab === 'luckydraw' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white">Lucky Draw Campaign & Simulator</h2>
              <p className="text-xs text-slate-400">
                Trigger simulated live draws, audit recent winners wall, and configure jackpot parameters
              </p>
            </div>

            {/* Campaign Controls Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trigger Live Winner Simulator */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Trophy className="w-5 h-5" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Instant Live Draw Engine
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trigger an instantaneous draw. The system will select a verified customer ticket, award a flagship
                  prize, and broadcast it to the live winners wall!
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Select Draw Pool Tier:</label>
                  <select
                    value={drawTierSelect}
                    onChange={(e) => setDrawTierSelect(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="platinum">Platinum Tier (iPhone 16 Pro Max, MacBooks)</option>
                    <option value="gold">Gold Tier (Sony WH-1000XM5, Apple Watch)</option>
                    <option value="silver">Silver Tier (AirPods 4 ANC, Store Credits)</option>
                    <option value="bumper">Brand JUDES Mega Bumper (Mercedes-Benz C-Class)</option>
                  </select>
                </div>

                <button
                  onClick={handleTriggerDraw}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all cursor-pointer active:scale-98"
                >
                  🎲 Run Live Winner Draw Now
                </button>

                {lastDrawnWinner && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1 animate-in zoom-in-95">
                    <p className="font-bold">🎉 Winner Broadcasted!</p>
                    <p className="text-[11px] text-slate-300">
                      <strong>{lastDrawnWinner.winnerName}</strong> won{' '}
                      <strong className="text-amber-300">{lastDrawnWinner.prize}</strong>
                    </p>
                  </div>
                )}
              </div>

              {/* Pool Status */}
              <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Jackpot Telemetry</h3>
                  <Crown className="w-4 h-4 text-amber-400" />
                </div>
                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Total Entries In Pool:</span>
                    <span className="font-mono font-black text-amber-400 text-sm">3,842</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Grand Bumper Draw Date:</span>
                    <span className="font-mono font-bold text-white">Dec 31, 2026</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">Wheel Free Spins Given:</span>
                    <span className="font-mono font-bold text-emerald-400">1,280 Daily Spins</span>
                  </div>
                </div>
              </div>

              {/* Quick Link to Wheel */}
              <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Customer Arena</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    View the customer-facing lucky wheel with ticking countdown and recent winner feed.
                  </p>
                </div>
                <Link
                  href="/lucky-draw"
                  target="_blank"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>Open /lucky-draw Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Recent Winners Ledger */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Winners Wall Ledger ({recentWinners.length} verified)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentWinners.map((winner) => (
                  <div
                    key={winner.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-400/40 shrink-0">
                      <Image src={winner.avatar} alt={winner.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white truncate">{winner.name}</p>
                        <span className="text-[10px] uppercase font-bold text-amber-400">{winner.tier}</span>
                      </div>
                      <p className="text-amber-200/90 font-medium text-[11px] truncate">{winner.prize}</p>
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
                <h2 className="text-xl font-bold text-white">Promotions & Flash Vouchers</h2>
                <p className="text-xs text-slate-400">
                  Create and manage discount codes for checkout redemption
                </p>
              </div>

              <button
                onClick={() => setIsAddPromoOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all"
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
                  className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg space-y-3 relative group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-base font-black text-white px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30 text-[#38BDF8]">
                        {promo.code}
                      </span>
                      <p className="text-xs text-slate-400 mt-2">{promo.description}</p>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {promo.discountType === 'percentage'
                        ? `${Math.round(promo.discountValue * 100)}% OFF`
                        : `$${promo.discountValue} OFF`}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Status: <strong className="text-emerald-400">Active</strong></span>
                    <button
                      onClick={() => {
                        deletePromoCode(promo.code);
                        showToast(`Deleted promo code ${promo.code}`);
                      }}
                      className="text-rose-400 hover:text-rose-300 transition-colors p-1"
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

        {/* ================= TAB 6: CUSTOMERS & REWARDS ================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-white">Customers & JudesCoins Ledger</h2>
              <p className="text-xs text-slate-400">
                Inspect customer account tiers and grant instant JudesCoins rewards
              </p>
            </div>

            {/* Customer Card */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/50">
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{user.name}</h3>
                      <span className="text-[10px] font-bold text-amber-950 bg-amber-400 px-2 py-0.5 rounded-full uppercase">
                        Platinum VIP
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      grantCustomerCoins(250);
                      showToast(`🪙 Airdropped +250 JudesCoins to ${user.name}!`);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Airdrop +250 Coins</span>
                  </button>
                  <button
                    onClick={() => {
                      grantCustomerCoins(500);
                      showToast(`🪙 Airdropped +500 JudesCoins to ${user.name}!`);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Airdrop +500 Coins</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Current Coins Balance</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {judesCoins.toLocaleString()}
                    </span>
                    <span className="text-slate-400">Coins</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Total Lifetime Orders</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white font-mono">{user.orders.length}</span>
                    <span className="text-slate-400">Completed</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Default Shipping Address</span>
                  <p className="text-slate-300 font-medium mt-1">
                    {user.savedAddresses[0]?.street}, {user.savedAddresses[0]?.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Catalog Product</h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solis Titanium ANC Earbuds"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="apparel">Apparel</option>
                    <option value="footwear">Footwear</option>
                    <option value="leather-goods">Leather Goods</option>
                    <option value="home-living">Home & Living</option>
                    <option value="beauty">Beauty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Draw Tier</label>
                  <select
                    value={newProductDrawTier}
                    onChange={(e) => setNewProductDrawTier(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="platinum">Platinum (&gt;$500)</option>
                    <option value="gold">Gold ($250-$500)</option>
                    <option value="silver">Silver ($100-$250)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price (USD)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isJudesBrand"
                  checked={newProductIsJudes}
                  onChange={(e) => setNewProductIsJudes(e.target.checked)}
                  className="rounded text-[#0066FF] focus:ring-0"
                />
                <label htmlFor="isJudesBrand" className="text-slate-300 font-medium">
                  Flag as Brand &quot;JUDES&quot; (Eligible for Mega Bumper Jackpot)
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold shadow-md"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD PROMO ================= */}
      {isAddPromoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Promo Code</h3>
              <button
                onClick={() => setIsAddPromoOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FLASH30"
                  value={newPromoCode}
                  onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={newPromoType}
                    onChange={(e) => setNewPromoType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Value {newPromoType === 'percentage' ? '(e.g. 25 for 25%)' : '($ USD)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPromoVal}
                    onChange={(e) => setNewPromoVal(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-hidden focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={newPromoDesc}
                  onChange={(e) => setNewPromoDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden focus:border-[#0066FF]"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPromoOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold shadow-md"
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
