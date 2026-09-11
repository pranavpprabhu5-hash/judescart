'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';
import { Order } from '@/types/user';
import { CheckCircle2, Package, Printer, ArrowRight, Truck, MapPin, Sparkles, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OrderTrackingMap } from '@/components/checkout/OrderTrackingMap';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { user, formatAmount } = useStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Trigger celebratory JudesCart confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0066FF', '#0A192F', '#38BDF8', '#60A5FA', '#FFFFFF'],
    });

    if (orderId) {
      const found = user.orders.find((o) => o.id === orderId);
      if (found) setOrder(found);
      else if (user.orders.length > 0) setOrder(user.orders[0]);
    } else if (user.orders.length > 0) {
      setOrder(user.orders[0]);
    }
  }, [orderId, user.orders]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const currentOrder = order || user.orders[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      {/* Header Celebration */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 ring-8 ring-emerald-50 mb-2">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest font-bold text-[#0066FF]">
            Order Confirmed
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-stone-900">
            Thank you for shopping with JudesCart!
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-md mx-auto">
            Order <strong className="font-mono text-stone-900 font-bold">#{currentOrder ? currentOrder.id : orderId || 'JC-98421'}</strong> has been registered with our priority dispatch team.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 hover:bg-stone-100 text-xs font-semibold text-stone-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-600 text-xs font-bold text-white transition-colors shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Interactive Live Parcel Radar */}
      <OrderTrackingMap order={currentOrder} />

      {/* Itemized Order Receipt */}
      {currentOrder && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <h3 className="font-serif text-base font-medium text-stone-900">Receipt Details</h3>
            <span className="font-mono text-xs text-stone-500">{currentOrder.date}</span>
          </div>

          {/* Items */}
          <div className="divide-y divide-stone-100">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-4">
                <div className="relative w-12 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <h4 className="font-medium text-stone-900 truncate">{item.name}</h4>
                  <p className="text-stone-500 mt-0.5">{item.color} • {item.size} • Qty {item.quantity}</p>
                </div>
                <span className="text-xs font-semibold text-stone-900">
                  {formatAmount(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-stone-900">{formatAmount(currentOrder.subtotal)}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Savings</span>
                <span>-{formatAmount(currentOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping ({currentOrder.shippingMethod?.name || 'Standard'})</span>
              <span>
                {currentOrder.shipping === 0 ? (
                  <span className="text-emerald-700 font-medium">Complimentary</span>
                ) : (
                  formatAmount(currentOrder.shipping)
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax</span>
              <span className="font-medium text-stone-900">{formatAmount(currentOrder.tax)}</span>
            </div>
            {currentOrder.giftPackaging?.enabled && (
              <div className="flex justify-between text-purple-900 font-medium">
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-purple-600" />
                  <span>Deluxe Gift Packaging</span>
                </span>
                <span>{formatAmount(currentOrder.giftPackaging.fee || 4.99)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-sans font-extrabold text-[#0A192F] pt-3 border-t border-slate-200">
              <span>Total Paid</span>
              <span>{formatAmount(currentOrder.total)}</span>
            </div>
          </div>

          {/* Deluxe Gift Packaging & Handwritten Note Banner */}
          {currentOrder.giftPackaging?.enabled && (
            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                  <Gift className="w-4 h-4 text-purple-600" />
                  <span>Deluxe JudesCart Gift Packaging Included</span>
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                  Midnight Navy Box + Satin Ribbon
                </span>
              </div>

              {currentOrder.giftPackaging.note && (
                <div className="mt-2">
                  <p className="text-[11px] font-semibold text-purple-900 mb-1">Your Handwritten Greeting Note:</p>
                  <p className="text-xs italic text-purple-900 bg-white p-3 rounded-lg border border-purple-100 shadow-2xs">
                    &ldquo;{currentOrder.giftPackaging.note}&rdquo;
                  </p>
                </div>
              )}

              {currentOrder.giftPackaging.hidePriceReceipt && (
                <p className="text-[10px] text-purple-700 font-medium pt-1">
                  🔒 Gift receipt active: Prices have been omitted from the courier invoice slip.
                </p>
              )}
            </div>
          )}

          {/* Shipping Address Summary */}
          {currentOrder.shippingAddress && (
            <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
              <div>
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-1">
                  Recipient Destination
                </h4>
                <p>{currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}</p>
                <p>{currentOrder.shippingAddress.street} {currentOrder.shippingAddress.apartment}</p>
                <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.postalCode}</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] mb-1">
                  Payment Method
                </h4>
                <p className="capitalize">Method: {currentOrder.paymentMethod.type.replace('_', ' ')}</p>
                <p>Card Ending: •••• {currentOrder.paymentMethod.last4 || '4242'}</p>
                <p className="text-emerald-700 font-medium mt-1">Payment Status: Verified</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-stone-400">Loading order receipt...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
