'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Package, MapPin, Heart, LogOut, CheckCircle2, Truck, ExternalLink, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function ProfileDrawer() {
  const { isProfileOpen, closeProfile, user, isLoggedIn, toggleLogin, formatAmount } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'security'>('orders');

  if (!isProfileOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0A192F]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={closeProfile} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
              <Image src={user.avatar} alt={user.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A192F]">{isLoggedIn ? user.name : 'Guest Customer'}</h3>
              <p className="text-xs text-slate-500">{isLoggedIn ? user.email : 'Browsing as visitor'}</p>
            </div>
          </div>
          <button
            onClick={closeProfile}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'py-3 border-b-2 transition-colors flex items-center gap-1.5 mr-5',
              activeTab === 'orders'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders ({user.orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={cn(
              'py-3 border-b-2 transition-colors flex items-center gap-1.5 mr-5',
              activeTab === 'addresses'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Addresses</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={cn(
              'py-3 border-b-2 transition-colors flex items-center gap-1.5',
              activeTab === 'security'
                ? 'border-[#0066FF] text-[#0066FF]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Preferences</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {user.orders.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                user.orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-stone-900">#{order.id}</span>
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider',
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      )}>
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded bg-stone-200 overflow-hidden shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-medium text-stone-800 truncate">{item.name}</p>
                            <p className="text-stone-500">{item.color} • {item.size} • Qty {item.quantity}</p>
                          </div>
                          <span className="text-xs font-semibold text-stone-900">
                            {formatAmount(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                      <span>Ordered {order.date}</span>
                      <span className="font-semibold text-stone-900">Total: {formatAmount(order.total)}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-600">
                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                      <span>Tracking: <strong className="font-mono">{order.trackingNumber}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {user.savedAddresses.map((addr, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-white space-y-1 text-xs text-stone-600">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-stone-900 font-medium">{addr.firstName} {addr.lastName}</strong>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">Default</span>
                  </div>
                  <p>{addr.street} {addr.apartment}</p>
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  <p className="text-stone-400 pt-1">{addr.phone}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <h4 className="font-medium text-stone-900">Simulated Account Session</h4>
                <p className="text-stone-500">
                  You are currently logged in as a verified VIP client. You can toggle between guest and registered mode to test checkout flows.
                </p>
                <button
                  onClick={toggleLogin}
                  className="mt-2 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-200 transition-colors font-medium"
                >
                  {isLoggedIn ? 'Switch to Guest Mode' : 'Log in as Eleanor Sterling'}
                </button>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <h4 className="font-medium text-stone-900">JudesCart VIP Support</h4>
                <p className="text-stone-500">
                  Have questions regarding your orders, electronics warranty, or returns? Reach out directly to your 24/7 concierge.
                </p>
                <a href="mailto:support@judes-cart.com" className="inline-flex items-center gap-1 text-[#0066FF] font-medium hover:underline">
                  <span>Contact 24/7 VIP Support</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <Link
            href="/wishlist"
            onClick={closeProfile}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Wishlist</span>
          </Link>
          <button
            onClick={toggleLogin}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>{isLoggedIn ? 'Sign Out' : 'Sign In'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
