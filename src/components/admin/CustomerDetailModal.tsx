'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserProfile, Order } from '@/types/user';
import { useStore } from '@/context/StoreContext';
import {
  X,
  User,
  Coins,
  Crown,
  Trophy,
  ShoppingBag,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  PlusCircle,
  FileText,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

interface CustomerDetailModalProps {
  customer: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice?: (order: Order) => void;
  onCoinsGranted?: (msg: string) => void;
}

export function CustomerDetailModal({
  customer,
  isOpen,
  onClose,
  onViewInvoice,
  onCoinsGranted,
}: CustomerDetailModalProps) {
  const { grantCustomerCoins, judesCoins, formatAmount, lifetimeSpend, vipTier, vipMultiplier } = useStore();

  const [coinAmount, setCoinAmount] = useState<number>(100);
  const [reason, setReason] = useState<string>('VIP Loyalty tier promotion');
  const [customReason, setCustomReason] = useState<string>('');

  if (!isOpen || !customer) return null;

  const currentCoins = customer.name === 'Eleanor Vance' ? judesCoins : (customer.judesCoins || 650);

  const handleGrantCoins = (e: React.FormEvent) => {
    e.preventDefault();
    if (coinAmount <= 0) return;

    grantCustomerCoins(coinAmount);
    const finalReason = reason === 'custom' ? (customReason.trim() || 'Admin Discretion') : reason;

    if (onCoinsGranted) {
      onCoinsGranted(`🪙 Granted +${coinAmount} JudesCoins to ${customer.name} (${finalReason})!`);
    }
  };

  const getTierBadge = () => {
    if (vipTier === 'black') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-amber-300 border border-amber-400/40 shadow-xs">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>VIP Black (2.0x Coins)</span>
        </span>
      );
    }
    if (vipTier === 'gold') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 shadow-xs">
          <Crown className="w-3.5 h-3.5 text-amber-500" />
          <span>VIP Gold (1.5x Coins)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shadow-xs">
        <Trophy className="w-3.5 h-3.5 text-slate-400" />
        <span>VIP Silver (1.0x Coins)</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#0066FF] shadow-xs">
              <Image src={customer.avatar} alt={customer.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {customer.name}
                </h3>
                {getTierBadge()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {customer.email}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> San Francisco, CA</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Metric Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Lifetime Spend
              </div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {formatAmount(lifetimeSpend)}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Orders Placed
              </div>
              <div className="text-lg font-black font-mono text-[#0066FF] dark:text-[#38BDF8]">
                {customer.orders?.length || 0}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 space-y-1">
              <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3 text-amber-500" />
                <span>JudesCoins</span>
              </div>
              <div className="text-lg font-black font-mono text-amber-800 dark:text-amber-300">
                {currentCoins.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Avg. Order Value
              </div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {formatAmount(customer.orders?.length ? lifetimeSpend / customer.orders.length : 0)}
              </div>
            </div>
          </div>

          {/* Interactive Grant JudesCoins Tool */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 dark:from-[#1E1B18] dark:via-[#26201A] dark:to-[#1E1B18] border border-amber-200 dark:border-amber-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-amber-500 text-slate-950">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Grant JudesCoins Loyalty Reward
                  </h4>
                  <p className="text-[11px] text-amber-700/90 dark:text-amber-400/80">
                    Credit rewards directly to customer&apos;s digital wallet with audit reason logging
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 font-mono">
                Current: {currentCoins}
              </span>
            </div>

            <form onSubmit={handleGrantCoins} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-900 dark:text-amber-300">
                  Coin Amount
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/60 font-mono text-xs font-bold text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setCoinAmount((prev) => prev + 50)}
                    className="px-2 py-2 rounded-xl bg-amber-200 dark:bg-amber-900/50 hover:bg-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold"
                  >
                    +50
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoinAmount((prev) => prev + 100)}
                    className="px-2 py-2 rounded-xl bg-amber-200 dark:bg-amber-900/50 hover:bg-amber-300 text-amber-900 dark:text-amber-200 text-xs font-bold"
                  >
                    +100
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-amber-900 dark:text-amber-300">
                  Reason / Campaign
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/60 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="VIP Loyalty tier promotion">VIP Loyalty tier promotion</option>
                  <option value="Order delay / Resolution compensation">Order delay compensation</option>
                  <option value="Community contest winner">Community contest winner</option>
                  <option value="Storefront review reward">Storefront review reward</option>
                  <option value="custom">Custom Reason...</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Grant {coinAmount} Coins</span>
                </button>
              </div>

              {reason === 'custom' && (
                <div className="sm:col-span-3 mt-1">
                  <input
                    type="text"
                    placeholder="Enter custom grant audit explanation..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700/60 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </form>
          </div>

          {/* Customer Order History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Order History & Invoices ({customer.orders?.length || 0})
              </h4>
              <span className="text-[11px] text-slate-400">Click any invoice to view and print</span>
            </div>

            <div className="space-y-2">
              {customer.orders?.map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0066FF] dark:text-[#38BDF8] flex items-center justify-center font-bold">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                          {ord.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-blue-100 text-[#0066FF] dark:bg-blue-950/60 dark:text-[#38BDF8]'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {ord.date} • {ord.items.length} items ({ord.items.map((i) => i.name).slice(0, 2).join(', ')})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        {formatAmount(ord.total)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ord.courierPartner || 'Judes Express'}
                      </div>
                    </div>

                    {onViewInvoice && (
                      <button
                        type="button"
                        onClick={() => onViewInvoice(ord)}
                        className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-[#0066FF] hover:text-white text-slate-600 dark:text-slate-300 transition-all text-xs font-semibold flex items-center gap-1"
                        title="Open Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Invoice</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-all"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
