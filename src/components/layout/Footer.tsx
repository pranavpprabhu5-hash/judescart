'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Truck, RefreshCw, Download, Lock } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#070F1E] text-stone-300 pt-16 pb-12 border-t border-blue-950/80 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Value Pillars (Luxury Frosted Cards) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-blue-900/40 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/50 hover:border-blue-600/60 hover:bg-blue-950/60 transition-all duration-300 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Free Express Delivery</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Complimentary priority dispatch on orders over $99.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/50 hover:border-blue-600/60 hover:bg-blue-950/60 transition-all duration-300 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Prepaid return labels with instant automated refunds.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/50 hover:border-blue-600/60 hover:bg-blue-950/60 transition-all duration-300 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Curated Quality</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">Every product certified for real-world performance.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-900/50 hover:border-blue-600/60 hover:bg-blue-950/60 transition-all duration-300 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Buyer Protection</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">256-bit encrypted checkout and 100% money-back guarantee.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 bg-white rounded-xl p-1 shadow-sm">
                <Image src="/logo.png" alt="JudesCart Logo" fill sizes="48px" className="object-contain" />
              </div>
              <div>
                <span className="font-sans text-2xl font-black tracking-tight text-white block leading-none">
                  Judes<span className="text-[#0066FF]">Cart</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-blue-400 font-bold">
                  Shop More. Live Better.
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              JudesCart is your trusted destination for premier consumer electronics, bespoke apparel, footwear, leather goods, and design-led home decor. Curated for modern living.
            </p>

            {/* Newsletter form */}
            <div className="pt-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-stone-200 mb-2">
                Join JudesCart Insider Club
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3.5 py-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Welcome to JudesCart Insiders! Check your inbox for 10% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-stone-900/90 border border-blue-900/70 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0066FF] text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1 shrink-0 shadow-sm btn-shine cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* All Departments Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">All Departments</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link href="/products?category=electronics" className="hover:text-white transition-colors">Electronics & Audio</Link></li>
              <li><Link href="/products?category=apparel" className="hover:text-white transition-colors">Apparel & Outerwear</Link></li>
              <li><Link href="/products?category=leather-goods" className="hover:text-white transition-colors">Leather Goods & Bags</Link></li>
              <li><Link href="/products?category=footwear" className="hover:text-white transition-colors">Footwear & Boots</Link></li>
              <li><Link href="/products?category=home-living" className="hover:text-white transition-colors">Home & Living</Link></li>
              <li><Link href="/products?category=beauty" className="hover:text-white transition-colors">Beauty & Self Care</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors font-medium text-blue-400">Browse Full Catalog</Link></li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><a href="#orders" className="hover:text-white transition-colors">Track Order Status</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">Shipping & Delivery Rates</a></li>
              <li><a href="#warranty" className="hover:text-white transition-colors">Returns & Refunds Center</a></li>
              <li><a href="#help" className="hover:text-white transition-colors">Help Center & FAQ</a></li>
              <li><a href="#support" className="hover:text-white transition-colors">24/7 Live Customer Support</a></li>
            </ul>
          </div>

          {/* JudesCart Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Why JudesCart</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-1.5"><span className="text-[#0066FF]">✓</span> 1-Year Factory Warranty</li>
              <li className="flex items-center gap-1.5"><span className="text-[#0066FF]">✓</span> Tracked Global Express Dispatch</li>
              <li className="flex items-center gap-1.5"><span className="text-[#0066FF]">✓</span> Price-Match Guarantee</li>
              <li className="flex items-center gap-1.5"><span className="text-[#0066FF]">✓</span> Safe & Encrypted 256-Bit SSL</li>
              <li className="flex items-center gap-1.5"><span className="text-[#0066FF]">✓</span> 48,000+ Happy Shoppers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods & Security Trust Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-blue-950/60 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-stone-300">Guaranteed Safe & Secure Checkout:</span>
        </div>

        {/* Payment Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-200">
            💳 VISA
          </span>
          <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-200">
            💳 Mastercard
          </span>
          <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-200">
            💳 AMEX
          </span>
          <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-200">
             Apple Pay
          </span>
          <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-200">
            GPay
          </span>
          <span className="px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[10px] font-bold text-stone-200">
            PayPal
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 border border-emerald-800/80 text-[10px] font-bold text-emerald-300">
            🔒 256-Bit SSL
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-blue-950/40 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4 relative z-10">
        <p>© 2026 JudesCart Inc. All rights reserved. Shop More. Live Better.</p>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-pwa-install'));
              }
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
          <span className="hover:text-stone-400 cursor-pointer">Privacy Notice</span>
          <span className="hover:text-stone-400 cursor-pointer">Terms of Use</span>
          <span className="hover:text-stone-400 cursor-pointer">Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
