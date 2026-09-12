'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Order } from '@/types/user';
import { useStore } from '@/context/StoreContext';
import { CURRENCIES } from '@/lib/mock-data';
import { X, Printer, CheckCircle2, ShieldCheck, Truck, Gift } from 'lucide-react';

interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderInvoiceModal({ order, isOpen, onClose }: OrderInvoiceModalProps) {
  const { currency, formatAmount } = useStore();
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const invoiceNumber = order.invoiceNumber || `JC-INV-${order.id.replace(/[^0-9]/g, '') || '94021'}`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto overflow-hidden print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Tax Invoice & Dispatch Slip
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/20 text-[#0066FF] dark:text-[#38BDF8] font-bold">
              {order.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div ref={printableRef} className="p-6 sm:p-10 space-y-8 print:p-0 print:space-y-6 text-sm">
          {/* Header Brand & Invoice Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center text-white font-black text-base shadow-sm">
                  JC
                </div>
                <span className="font-sans text-2xl font-black tracking-tight text-slate-900 dark:text-white print:text-black">
                  Judes<span className="text-[#0066FF]">Cart</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-medium">
                JudesCart Global Retail & Logistics Network Inc.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                GST / VAT: <span className="font-mono font-semibold">27AABCJ9841P1ZQ</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                support@judescart.com • https://judescart.vercel.app
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1 font-sans">
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50 mb-1">
                PAID & VERIFIED
              </div>
              <div className="text-lg sm:text-xl font-mono font-black text-slate-900 dark:text-white print:text-black">
                {invoiceNumber}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                Date: <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">{order.date}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                Order ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black">{order.id}</span>
              </p>
            </div>
          </div>

          {/* Shipping, Delivery & Tracking Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 print:text-slate-600 mb-1">
                Courier & Dispatch
              </div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white print:text-black">
                <Truck className="w-4 h-4 text-[#0066FF]" />
                <span>{order.courierPartner || 'Judes Express / FedEx'}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Speed: {order.shippingMethod?.name || 'Standard Courier'}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 print:text-slate-600 mb-1">
                Waybill / Tracking No.
              </div>
              <div className="font-mono font-extrabold text-[#0066FF] dark:text-[#38BDF8] print:text-black text-sm">
                {order.trackingNumber || 'JC-TRK-7849204'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Est. Delivery: <span className="font-semibold">{order.estimatedDelivery}</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 print:text-slate-600 mb-1">
                Payment Method
              </div>
              <div className="font-bold text-slate-900 dark:text-white print:text-black">
                {order.paymentMethod?.type === 'card'
                  ? `Credit/Debit Card ending in ${order.paymentMethod.last4 || '4242'}`
                  : order.paymentMethod?.type === 'apple_pay'
                  ? 'Apple Pay Instant'
                  : 'PayPal Express'}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Encrypted & Settled</span>
              </div>
            </div>
          </div>

          {/* Customer Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 print:border-slate-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2">
                Shipping Destination
              </h4>
              <p className="font-bold text-slate-900 dark:text-white print:text-black">
                {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 print:text-slate-700 mt-1">
                {order.shippingAddress?.street}
                {order.shippingAddress?.apartment ? `, ${order.shippingAddress.apartment}` : ''}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 print:text-slate-700">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
              </p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 print:text-slate-800 mt-1">
                {order.shippingAddress?.country}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Contact: {order.shippingAddress?.phone} • {order.shippingAddress?.email}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 print:border-slate-300">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-2">
                Order Fulfillment Status
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-extrabold text-sm text-slate-900 dark:text-white print:text-black">
                  {order.status}
                </span>
              </div>
              {order.shippingNotes && (
                <div className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/40 mt-1">
                  <span className="font-bold text-amber-900 dark:text-amber-300">Admin Note: </span>
                  {order.shippingNotes}
                </div>
              )}
              {order.giftPackaging?.enabled && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-xs text-purple-900 dark:text-purple-300 flex items-start gap-2">
                  <Gift className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Deluxe JudesCart Gift Packaging</span>
                    {order.giftPackaging.note && <p className="italic text-[11px] mt-0.5">&quot;{order.giftPackaging.note}&quot;</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden print:border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 print:bg-slate-100 print:text-black uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3.5">Product Description</th>
                  <th className="p-3.5">Color / Variant</th>
                  <th className="p-3.5">Size / Unit</th>
                  <th className="p-3.5 text-right">Price</th>
                  <th className="p-3.5 text-center">Qty</th>
                  <th className="p-3.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300 font-medium">
                {order.items.map((item, idx) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700 print:border-slate-300">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white print:text-black">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU: {item.productId?.slice(0, 10).toUpperCase() || 'JC-PROD'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 print:text-slate-800">
                        {item.color}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 print:text-slate-800">
                        {item.size}
                      </td>
                      <td className="p-3.5 text-right font-mono text-slate-700 dark:text-slate-300 print:text-black">
                        {formatAmount(item.price)}
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-900 dark:text-white print:text-black">
                        {item.quantity}
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900 dark:text-white print:text-black">
                        {formatAmount(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400 print:text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 print:text-black">
                  {formatAmount(order.subtotal)}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Promotional Discount</span>
                  <span className="font-mono font-medium">-{formatAmount(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-slate-400 print:text-slate-600">
                <span>Shipping & Handling</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 print:text-black">
                  {order.shipping === 0 ? 'FREE' : formatAmount(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 print:text-slate-600">
                <span>Estimated Tax (GST/VAT)</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 print:text-black">
                  {formatAmount(order.tax)}
                </span>
              </div>
              {order.giftPackaging?.enabled && (
                <div className="flex justify-between text-purple-600 dark:text-purple-400">
                  <span>Gift Packaging</span>
                  <span className="font-mono font-medium">+{formatAmount(order.giftPackaging.fee)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white print:text-black">
                <span>Total Amount Paid</span>
                <span className="text-base font-black font-mono text-[#0066FF] dark:text-[#38BDF8] print:text-black">
                  {formatAmount(order.total)}
                </span>
              </div>
              {order.coinsEarned && order.coinsEarned > 0 && (
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold text-right">
                  ★ Earned +{order.coinsEarned} JudesCoins on this order
                </div>
              )}
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="font-mono text-xl sm:text-2xl tracking-[0.35em] text-slate-400 select-none font-bold">
                ||| | |||| | ||| |||| | || |
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                {order.trackingNumber || 'JC-TRK-7849204'} • CERTIFIED DISPATCH
              </p>
            </div>

            <div className="text-[11px] text-slate-400 max-w-sm space-y-0.5">
              <p className="font-medium text-slate-600 dark:text-slate-300 print:text-slate-700">
                Thank you for shopping with JudesCart!
              </p>
              <p>Items eligible for 30-day return policy. For inquiries, email support@judescart.com.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
