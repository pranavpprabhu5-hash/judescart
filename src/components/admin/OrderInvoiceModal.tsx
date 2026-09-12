'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Order } from '@/types/user';
import { useStore } from '@/context/StoreContext';
import { CURRENCIES } from '@/lib/mock-data';
import { X, Printer, CheckCircle2, ShieldCheck, Truck, Gift, FileText, QrCode, Building2, MapPin, Phone, UserCheck } from 'lucide-react';

interface OrderInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderInvoiceModal({ order, isOpen, onClose }: OrderInvoiceModalProps) {
  const { currency, formatAmount } = useStore();
  const printableRef = useRef<HTMLDivElement>(null);
  const [docType, setDocType] = useState<'invoice' | 'manifest'>('invoice');

  if (!isOpen || !order) return null;

  const invoiceNumber = order.invoiceNumber || `JC-INV-${order.id.replace(/[^0-9]/g, '') || '94021'}`;
  const manifestId = `MNF-${order.id.replace(/[^0-9]/g, '') || '88301'}-EX`;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto overflow-hidden print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80 print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            {/* Document Switcher */}
            <div className="flex bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setDocType('invoice')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  docType === 'invoice'
                    ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-[#38BDF8] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Tax Invoice
              </button>
              <button
                onClick={() => setDocType('manifest')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  docType === 'manifest'
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Courier Manifest</span>
              </button>
            </div>
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
              <span>{docType === 'manifest' ? 'Print Manifest' : 'Print Invoice'}</span>
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

        {/* Printable Document Area */}
        <div ref={printableRef} className="p-6 sm:p-10 space-y-8 print:p-0 print:space-y-6 text-sm">
          {docType === 'manifest' ? (
            /* ================= COURIER MANIFEST & DISPATCH HAND-OFF SLIP ================= */
            <div className="space-y-6">
              {/* Manifest Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-slate-900 dark:border-slate-700 print:border-black">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black font-mono font-black text-xs uppercase tracking-wider">
                      OFFICIAL MANIFEST
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Carrier Hand-Off & Air Waybill
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white print:text-black">
                    Judes<span className="text-[#0066FF]">Cart</span> Logistics Network
                  </h2>
                  <p className="text-xs text-slate-500 print:text-slate-600">
                    Outbound Cargo Hand-Off Dispatch Slip • Hub: Central Hub Bay #4 (BLR-WH-04)
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono space-y-1">
                  <div className="text-xs text-slate-400">MANIFEST REF</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white print:text-black">
                    {manifestId}
                  </div>
                  <div className="text-xs text-slate-500">Date: {order.date}</div>
                </div>
              </div>

              {/* Waybill Barcode Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 print:border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Primary Air Waybill / Tracking Barcode
                  </div>
                  <div className="font-mono text-3xl sm:text-4xl tracking-[0.4em] font-black text-slate-900 dark:text-white print:text-black select-none">
                    ||| | |||| | ||| |||| | || |
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 print:text-black">
                    AWB: {order.trackingNumber || 'JC-TRK-7849204'} • {order.courierPartner || 'Judes Express Priority'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Weight</div>
                    <div className="font-mono font-black text-sm">1.35 KG</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Colli / Pcs</div>
                    <div className="font-mono font-black text-sm">1 CTN</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Handling</div>
                    <div className="font-mono font-bold text-xs text-amber-600">FRAGILE</div>
                  </div>
                </div>
              </div>

              {/* Sender & Recipient Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Consignor */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 print:border-slate-300">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>Consignor (Origin Facility)</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white print:text-black">
                    JudesCart Global Distribution Center
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mt-1 space-y-0.5">
                    <p>Dock 4, Industrial Logistics Corridor</p>
                    <p>Bangalore, Karnataka 560100, India</p>
                    <p>Tax Reg / GST: 27AABCJ9841P1ZQ</p>
                    <p className="font-mono">Dispatch Officer: Agent #4748</p>
                  </div>
                </div>

                {/* Consignee */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 print:border-slate-300">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0066FF] mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Consignee (Delivery Destination)</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white print:text-black">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mt-1 space-y-0.5">
                    <p>{order.shippingAddress?.street}</p>
                    {order.shippingAddress?.apartment && <p>{order.shippingAddress.apartment}</p>}
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                    </p>
                    <p>{order.shippingAddress?.country || 'India'}</p>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">
                      Phone: {order.shippingAddress?.phone || '+91 98840 28192'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Item Manifest Audit Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:border-slate-300">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 text-center">SKU / Code</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-center">Customization</th>
                      <th className="p-3 text-right">Declared Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200">
                    {order.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold text-slate-900 dark:text-white print:text-black">
                          {it.name}
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">
                          JC-SKU-{it.productId?.slice(0, 8) || 'STD'}
                        </td>
                        <td className="p-3 text-center font-bold">
                          {it.quantity}
                        </td>
                        <td className="p-3 text-center">
                          {it.monogram ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold">
                              Monogram: {it.monogram.initials} ({it.monogram.foilColor})
                            </span>
                          ) : (
                            <span className="text-slate-400">Standard</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-mono font-bold">
                          {formatAmount(it.price * it.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Hand-off Signoff Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800 print:border-slate-300">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 print:border-slate-300">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Warehouse Dispatch Hand-off
                  </div>
                  <div className="h-12 flex items-end font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ RELEASED & SEALED [Agent #4748]
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 text-[10px] text-slate-400">
                    JudesCart Dispatch Officer Sign & Date
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 print:border-slate-300">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Carrier Acceptance & Driver Scan
                  </div>
                  <div className="h-12 flex items-end font-mono text-xs text-slate-400 italic">
                    ____________________________________
                  </div>
                  <div className="border-t border-slate-300 dark:border-slate-700 pt-1 text-[10px] text-slate-400">
                    Carrier Agent / Driver Signature & Vehicle ID
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= STANDARD TAX INVOICE ================= */
            <>
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
                    Waybill / Tracking Number
                  </div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white print:text-black">
                    {order.trackingNumber || 'JC-TRK-7849204'}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                    Status: {order.status}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 print:text-slate-600 mb-1">
                    Delivery Estimate
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white print:text-black">
                    {order.estimatedDelivery || 'In Transit'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Signed delivery with tamper-seal
                  </div>
                </div>
              </div>

              {/* Billing & Shipping Address Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 text-xs">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 print:text-slate-600 mb-1">
                    Billed To:
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white print:text-black text-sm">
                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 print:text-slate-700">{order.shippingAddress?.street}</p>
                  {order.shippingAddress?.apartment && (
                    <p className="text-slate-600 dark:text-slate-400 print:text-slate-700">{order.shippingAddress?.apartment}</p>
                  )}
                  <p className="text-slate-600 dark:text-slate-400 print:text-slate-700">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 print:text-slate-700">{order.shippingAddress?.country || 'India'}</p>
                  {order.shippingAddress?.phone && (
                    <p className="text-slate-600 dark:text-slate-400 print:text-slate-700 font-mono">
                      Phone: {order.shippingAddress.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400 print:text-slate-600 mb-1">
                    Payment &amp; Transaction Details:
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white print:text-black text-sm">
                    {order.paymentMethod?.type === 'card'
                      ? `Card ending in ${order.paymentMethod.last4 || '4242'}`
                      : order.paymentMethod?.type === 'apple_pay'
                      ? 'Apple Pay Instant'
                      : 'Online Gateway'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 print:text-slate-700 font-mono">
                    TXN: JC-TXN-{order.id.replace(/[^0-9]/g, '') || '91823'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 print:text-slate-700">
                    Gateway: JudesPay Global Merchant Services
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Payment State: CAPTURED & SETTLED
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:border-slate-300">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 print:bg-slate-100 print:border-slate-300">
                    <tr>
                      <th className="p-3.5">Product Description</th>
                      <th className="p-3.5 text-right">Unit Price</th>
                      <th className="p-3.5 text-center">Qty</th>
                      <th className="p-3.5 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200">
                    {order.items.map((item, idx) => {
                      const lineTotal = item.price * item.quantity;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900 dark:text-white print:text-black">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-slate-400 print:text-slate-600">
                              SKU: JC-PRD-{item.productId?.slice(0, 8) || 'STD'} • {item.color || 'Standard'} / {item.size || 'Regular'}
                            </div>
                            {item.monogram && (
                              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                                Bespoke Monogram: &quot;{item.monogram.initials}&quot; ({item.monogram.foilColor} foil)
                              </div>
                            )}
                          </td>
                          <td className="p-3.5 text-right font-mono font-medium text-slate-700 dark:text-slate-300 print:text-black">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
