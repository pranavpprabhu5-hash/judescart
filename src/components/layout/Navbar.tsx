'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { CurrencySwitcher } from './CurrencySwitcher';
import { ThemeToggle } from './ThemeToggle';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Headphones,
  Shirt,
  Sparkles,
  Home,
  Footprints,
  Briefcase,
  ArrowRight,
  SlidersHorizontal,
  Coins,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MegaMenuCategory {
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  subcategories: { name: string; href: string }[];
  featured: {
    title: string;
    subtitle: string;
    image: string;
    price: string;
    href: string;
  };
}

const DEPARTMENTS: MegaMenuCategory[] = [
  {
    label: 'All Products',
    href: '/products',
    icon: <SlidersHorizontal className="w-3.5 h-3.5" />,
    subcategories: [
      { name: 'Browse Full Catalog', href: '/products' },
      { name: 'New Arrivals', href: '/products?sort=newest' },
      { name: 'Best Selling Products', href: '/products?sort=featured' },
      { name: 'Top Customer Rated', href: '/products?sort=rating' },
    ],
    featured: {
      title: 'Universal Collection',
      subtitle: 'Over 10,000+ certified products across all categories',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
      price: 'From $45',
      href: '/products',
    },
  },
  {
    label: 'Electronics',
    href: '/products?category=electronics',
    badge: 'Popular',
    badgeColor: 'bg-blue-600 text-white',
    icon: <Headphones className="w-3.5 h-3.5" />,
    subcategories: [
      { name: 'ANC Wireless Headphones', href: '/products/sonicpro-wireless-noise-cancelling-headphones' },
      { name: 'Smart Desk Lighting & Qi', href: '/products/auraglow-smart-ambient-desk-lamp' },
      { name: 'Studio & High-Fidelity Audio', href: '/products?category=electronics' },
      { name: 'Workspace & Ergonomic Gear', href: '/products?category=electronics' },
    ],
    featured: {
      title: 'SonicPro Studio ANC',
      subtitle: '40mm beryllium acoustic drivers with 45h battery',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      price: '$299',
      href: '/products/sonicpro-wireless-noise-cancelling-headphones',
    },
  },
  {
    label: 'Fashion',
    href: '/products?category=apparel',
    icon: <Shirt className="w-3.5 h-3.5" />,
    subcategories: [
      { name: 'Mongolian Cashmere Knitwear', href: '/products/cashmere-oversized-cardigan' },
      { name: 'Virgin Melton Wool Coats', href: '/products/tailored-wool-cocoon-coat' },
      { name: 'Pure Mulberry Silk Charmeuse', href: '/products/silk-slip-dress-champagne' },
      { name: 'Everyday Wardrobe Staples', href: '/products?category=apparel' },
    ],
    featured: {
      title: 'Cashmere Oversized Cardigan',
      subtitle: 'Grade-A 2-ply Mongolian cashmere with horn buttons',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80',
      price: '$340',
      href: '/products/cashmere-oversized-cardigan',
    },
  },
  {
    label: 'Footwear',
    href: '/products?category=footwear',
    icon: <Footprints className="w-3.5 h-3.5" />,
    subcategories: [
      { name: 'Waterproof Suede Chelsea Boots', href: '/products/minimalist-chelsea-boot' },
      { name: 'Vibram Outsole Footwear', href: '/products/minimalist-chelsea-boot' },
      { name: 'Casual Handcrafted Loafers', href: '/products?category=footwear' },
      { name: 'All Footwear Collection', href: '/products?category=footwear' },
    ],
    featured: {
      title: 'Atelier Lugged Chelsea',
      subtitle: 'Weatherproof waxed suede with lightweight Vibram tread',
      image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=400&q=80',
      price: '$380',
      href: '/products/minimalist-chelsea-boot',
    },
  },
  {
    label: 'Leather Goods',
    href: '/products?category=leather-goods',
    icon: <Briefcase className="w-3.5 h-3.5" />,
    subcategories: [
      { name: 'Full-Grain Structured Totes', href: '/products/structured-tote-cognac' },
      { name: 'Padded Laptop Carriers (15")', href: '/products/structured-tote-cognac' },
      { name: 'Tuscan Vegetable-Tanned Bags', href: '/products?category=leather-goods' },
      { name: 'Accessories & Small Leather', href: '/products?category=leather-goods' },
    ],
    featured: {
      title: 'Sella Structured Tote',
      subtitle: 'Handcrafted in Florence with vegetable-tanned calfskin',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
      price: '$490',
      href: '/products/structured-tote-cognac',
    },
  },
  {
    label: 'Home & Living',
    href: '/products?category=home-living',
    icon: <Home className="w-3.5 h-3.5" />,
    subcategories: [
      { name: 'Hand-Poured Botanical Candles', href: '/products/botanical-sculpted-candle' },
      { name: 'Hasami Japanese Ceramic Sets', href: '/products/japanese-ceramic-pour-over-set' },
      { name: 'Artisan Porcelain Tableware', href: '/products?category=home-living' },
      { name: 'Home Fragrance & Diffusers', href: '/products?category=home-living' },
    ],
    featured: {
      title: 'Hesperis Botanical Candle',
      subtitle: 'Pure rapeseed & coconut wax, wild bergamot & cedarwood',
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=400&q=80',
      price: '$85',
      href: '/products/botanical-sculpted-candle',
    },
  },
  {
    label: 'Beauty',
    href: '/products?category=beauty',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    subcategories: [
      { name: 'Solis Cellular Replenish Oil', href: '/products/restorative-botanical-serum' },
      { name: 'Cold-Pressed Marula Formulations', href: '/products/restorative-botanical-serum' },
      { name: 'Clean Organic Skincare', href: '/products?category=beauty' },
      { name: 'All Beauty & Wellness', href: '/products?category=beauty' },
    ],
    featured: {
      title: 'Solis Replenish Oil',
      subtitle: 'Marula & Sea Buckthorn cellular facial nectar',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
      price: '$110',
      href: '/products/restorative-botanical-serum',
    },
  },
];

export function Navbar() {
  const pathname = usePathname();
  const {
    cartCount,
    openCart,
    wishlist,
    openProfile,
    openSearch,
    user,
    isLoggedIn,
    judesCoins,
    vipTier,
    openDailyMystery,
    dailyMysteryClaimed,
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveMegaMenu(label);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  useEffect(() => {
    setActiveMegaMenu(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800 shadow-xs transition-all duration-200">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Left Side: Logo (Logo Only, No Name) + Options Icon + Search */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-1 min-w-0">
            {/* 1. Logo Only (No Name Text) at far left end */}
            <Link href="/" className="group flex items-center shrink-0 pr-0.5" aria-label="JudesCart Home">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
                <Image
                  src="/logo-icon.png"
                  alt="JudesCart Logo"
                  fill
                  sizes="36px"
                  priority
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            </Link>

            {/* 2. Options Icon (Menu Toggle) right next to Logo */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              aria-label="Toggle navigation menu"
              title="Menu & Options"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* 3. Search right next to Options */}
            {/* Mobile Search Button (<md) */}
            <button
              onClick={openSearch}
              className="md:hidden p-2 text-stone-700 dark:text-stone-300 hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-stone-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
              aria-label="Search catalog"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Desktop Search Input Trigger (>=md) */}
            <div className="hidden md:flex flex-1 max-w-md ml-1 lg:ml-2">
              <button
                onClick={openSearch}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs text-stone-500 dark:text-stone-400 bg-stone-100/90 dark:bg-slate-800/80 hover:bg-stone-200/80 dark:hover:bg-slate-700 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-slate-700 transition-all duration-150 shadow-2xs group"
                aria-label="Open search dialog"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-[#0066FF] group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-[11px] lg:text-xs">Search all products, brands & categories...</span>
                </div>
                <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-stone-400 bg-white dark:bg-slate-900 rounded border border-stone-200 dark:border-slate-700 shadow-2xs">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>

          {/* Right Side: Rest of Menu Bar Icons */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Currency Switcher */}
            <div className="hidden sm:block">
              <CurrencySwitcher />
            </div>

            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full text-stone-700 dark:text-stone-300 hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-stone-100 dark:hover:bg-slate-800 transition-all shrink-0"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#0066FF] rounded-full animate-badge-pop">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Daily Mystery Gift Button */}
            <button
              onClick={openDailyMystery}
              className="relative flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-900/60 dark:hover:to-indigo-900/60 border border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300 transition-all text-xs font-bold cursor-pointer shadow-2xs group shrink-0"
              title="Daily JudesCart Mystery Vault - Open Everyday to Claim"
            >
              <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Daily Gift</span>
              {!dailyMysteryClaimed && (
                <span className="w-2 h-2 rounded-full bg-rose-500 absolute -top-0.5 -right-0.5 animate-ping" />
              )}
            </button>

            {/* JudesCoins Loyalty Badge (Desktop Only) */}
            <button
              onClick={openProfile}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 transition-all text-xs font-bold group cursor-pointer shadow-2xs shrink-0"
              title="JudesCoins Rewards Balance - Click to Redeem"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>{judesCoins.toLocaleString()}</span>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-400 font-bold uppercase tracking-wider">Coins</span>
            </button>

            {/* User Profile */}
            <button
              onClick={openProfile}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full text-stone-700 dark:text-stone-300 hover:text-[#0066FF] dark:hover:text-[#38BDF8] hover:bg-stone-100 dark:hover:bg-slate-800 transition-all relative shrink-0"
              aria-label="Account Profile"
            >
              <User className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-semibold text-stone-800 dark:text-stone-200">
                {isLoggedIn ? user.name.split(' ')[0] : 'Sign In'}
              </span>
              {isLoggedIn && vipTier === 'black' ? (
                <span className="hidden sm:inline-block text-[9px] font-black px-1.5 py-0.2 bg-slate-900 text-amber-300 rounded border border-amber-400/40">
                  BLACK
                </span>
              ) : isLoggedIn && vipTier === 'gold' ? (
                <span className="hidden sm:inline-block text-[9px] font-black px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded border border-amber-200">
                  VIP
                </span>
              ) : null}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#0A192F] text-white hover:bg-[#0066FF] transition-all duration-150 active:scale-95 shadow-xs font-sans shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-xs font-bold tracking-wide">Cart</span>
              <span
                key={cartCount}
                className={cn(
                  'flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold rounded-full bg-[#0066FF] text-white',
                  cartCount > 0 && 'animate-badge-pop'
                )}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Beautified Desktop Navigation Bar / Department Ribbon */}
      <nav
        className="hidden lg:block bg-[#0F172A] border-t border-slate-800 border-b border-slate-900 text-white relative shadow-inner"
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center space-x-1 xl:space-x-2">
              {DEPARTMENTS.map((dept) => {
                const isActive = pathname === dept.href || (dept.href !== '/products' && pathname.includes(dept.href));
                const isHovered = activeMegaMenu === dept.label;

                return (
                  <div
                    key={dept.label}
                    className="relative py-1.5"
                    onMouseEnter={() => handleMouseEnter(dept.label)}
                  >
                    <Link
                      href={dept.href}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 select-none group',
                        isActive
                          ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/30'
                          : isHovered
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-200 hover:text-white hover:bg-slate-800/80'
                      )}
                    >
                      <span className={cn(isActive ? 'text-white' : 'text-[#38BDF8]')}>
                        {dept.icon}
                      </span>
                      <span>{dept.label}</span>
                      {dept.badge && (
                        <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider', dept.badgeColor || 'bg-[#0066FF] text-white')}>
                          {dept.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={cn(
                          'w-3 h-3 transition-transform duration-200 text-slate-400 group-hover:text-slate-200',
                          isHovered && 'rotate-180 text-white'
                        )}
                      />
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Quick Perks Ribbon on Right */}
            <div className="hidden xl:flex items-center gap-4 text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Free Delivery over $99
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300 hover:text-white transition-colors">30-Day Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Floating Mega-Menu Dropdown Panel */}
        {activeMegaMenu && (
          <div
            className="absolute top-full inset-x-0 bg-white/98 backdrop-blur-xl border-b border-stone-200/90 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            onMouseEnter={() => {
              if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {(() => {
                const current = DEPARTMENTS.find((d) => d.label === activeMegaMenu);
                if (!current) return null;

                return (
                  <div className="grid grid-cols-12 gap-8 items-center">
                    {/* Left: Subcategories Column */}
                    <div className="col-span-7 space-y-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#0066FF]">
                          {current.label} Directory
                        </span>
                        <h4 className="text-base font-bold text-[#0A192F] mt-0.5">
                          Explore Popular Collections
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {current.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setActiveMegaMenu(null)}
                            className="group flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all"
                          >
                            <span className="text-xs font-semibold text-stone-800 group-hover:text-[#0066FF] transition-colors">
                              {sub.name}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-[#0066FF] group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>

                      <div className="pt-2">
                        <Link
                          href={current.href}
                          onClick={() => setActiveMegaMenu(null)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:underline"
                        >
                          <span>View all {current.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>

                    {/* Right: Featured Product Card */}
                    <div className="col-span-5 border-l border-stone-100 pl-8">
                      <Link
                        href={current.featured.href}
                        onClick={() => setActiveMegaMenu(null)}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-blue-50/50 border border-stone-200/80 transition-all block"
                      >
                        <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-white shrink-0 border border-stone-200">
                          <Image
                            src={current.featured.image}
                            alt={current.featured.title}
                            fill
                            sizes="96px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                            Top Recommendation
                          </span>
                          <h5 className="text-sm font-bold text-stone-900 group-hover:text-[#0066FF] transition-colors truncate">
                            {current.featured.title}
                          </h5>
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {current.featured.subtitle}
                          </p>
                          <p className="text-xs font-bold text-stone-900 pt-1">
                            {current.featured.price}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </nav>

      {/* Beautified Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 sm:top-16 bottom-0 bg-stone-950/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-[#070F1E] border-b border-stone-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-slate-800">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-400 dark:text-slate-400">Settings</span>
              <div className="flex items-center gap-2">
                <CurrencySwitcher />
                <ThemeToggle />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              {DEPARTMENTS.map((dept) => (
                <Link
                  key={dept.label}
                  href={dept.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800/80 text-stone-800 dark:text-slate-200 hover:text-[#0066FF] dark:hover:text-[#38BDF8] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#0066FF] dark:text-[#38BDF8]">{dept.icon}</span>
                    <span className="text-sm font-semibold">{dept.label}</span>
                  </div>
                  {dept.badge && (
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', dept.badgeColor)}>
                      {dept.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Quick 2x2 Action Tiles on Mobile Drawer */}
            <div className="pt-3 border-t border-stone-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openProfile();
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/60 font-bold text-stone-900 dark:text-slate-100 hover:border-blue-300 transition-colors"
              >
                <User className="w-4 h-4 text-[#0066FF]" />
                <span className="truncate">{isLoggedIn ? user.name.split(' ')[0] : 'Sign In'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openDailyMystery();
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/40 font-bold text-purple-900 dark:text-purple-300 hover:border-purple-400 transition-colors relative"
              >
                <Gift className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span className="truncate">Daily Gift</span>
                {!dailyMysteryClaimed && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-2 right-2" />
                )}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openProfile();
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 font-bold text-amber-900 dark:text-amber-300 hover:border-amber-400 transition-colors"
              >
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span className="truncate">{judesCoins.toLocaleString()} Coins</span>
              </button>

              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900/60 font-bold text-stone-900 dark:text-slate-100 hover:border-rose-300 transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="truncate">Wishlist ({wishlist.length})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
