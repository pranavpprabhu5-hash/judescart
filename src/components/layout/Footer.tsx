'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Truck, RefreshCw } from 'lucide-react';

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
    <footer className="bg-[#0A192F] text-stone-300 pt-16 pb-12 border-t border-blue-950">
      {/* Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-blue-900/40">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-900/40 text-blue-400 border border-blue-800/60">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Free Express Delivery</h4>
              <p className="text-xs text-stone-400 mt-1">Complimentary shipping across all departments on orders over $99.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-900/40 text-blue-400 border border-blue-800/60">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">30-Day Easy Returns</h4>
              <p className="text-xs text-stone-400 mt-1">No questions asked return policy with easy prepaid shipping labels.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-900/40 text-blue-400 border border-blue-800/60">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Curated Quality</h4>
              <p className="text-xs text-stone-400 mt-1">Every item rigorously evaluated for durability, performance, and aesthetic design.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-blue-900/40 text-blue-400 border border-blue-800/60">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Buyer Protection</h4>
              <p className="text-xs text-stone-400 mt-1">256-bit encrypted checkout and 100% money-back guarantee.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 bg-white rounded-xl p-1">
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
              JudesCart is your trusted all-in-one destination for premier consumer electronics, modern apparel, footwear, leather essentials, home living, and wellness. Curated for smart living.
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
                    placeholder="Enter your email"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-stone-900 border border-blue-900/60 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:border-[#0066FF]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0066FF] text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1 shrink-0 shadow-sm"
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
              <li><Link href="/products" className="hover:text-white transition-colors font-medium text-blue-400">Browse All Products</Link></li>
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
              <li>• Verified Manufacturer Warranties</li>
              <li>• Worldwide Tracked Express Dispatch</li>
              <li>• Price-Match Guarantee</li>
              <li>• Safe & Secure 256-Bit SSL Checkout</li>
              <li>• Millions of Happy Customers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-blue-950/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© 2026 JudesCart Inc. All rights reserved. Shop More. Live Better.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-stone-400 cursor-pointer">Privacy Notice</span>
          <span className="hover:text-stone-400 cursor-pointer">Terms of Use</span>
          <span className="hover:text-stone-400 cursor-pointer">Interest-Based Ads</span>
          <span className="hover:text-stone-400 cursor-pointer">Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
