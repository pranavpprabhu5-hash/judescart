'use client';

import React, { useState, useEffect } from 'react';
import { Order } from '@/types/user';
import { useStore } from '@/context/StoreContext';
import {
  X,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Calendar,
  FileText,
  Copy,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Send,
  QrCode,
} from 'lucide-react';

interface OrderEditModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (msg: string) => void;
}

const COURIER_OPTIONS = [
  { id: 'FedEx', name: 'FedEx Priority', prefix: 'FDX' },
  { id: 'DHL Express', name: 'DHL Express Global', prefix: 'DHL' },
  { id: 'BlueDart', name: 'BlueDart Air Apex', prefix: 'BDT' },
  { id: 'Delhivery', name: 'Delhivery Prime Surface', prefix: 'DLV' },
  { id: 'UPS', name: 'UPS Worldwide Saver', prefix: 'UPS' },
  { id: 'Judes Express', name: 'Judes Express Fleet', prefix: 'JEX' },
];

const STATUS_STEPS: Order['status'][] = [
  'Processing',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export function OrderEditModal({ order, isOpen, onClose, onSaved }: OrderEditModalProps) {
  const { updateOrder } = useStore();

  const [status, setStatus] = useState<Order['status']>('Processing');
  const [courier, setCourier] = useState<string>('Judes Express');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [estDelivery, setEstDelivery] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status || 'Processing');
      setCourier(order.courierPartner || 'Judes Express');
      setTrackingNumber(order.trackingNumber || '');
      setEstDelivery(order.estimatedDelivery || '');
      setNotes(order.shippingNotes || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleGenerateTracking = () => {
    const selected = COURIER_OPTIONS.find((c) => c.id === courier) || COURIER_OPTIONS[0];
    const randNum = Math.floor(100000000 + Math.random() * 900000000);
    const newTrk = `${selected.prefix}-${randNum}`;
    setTrackingNumber(newTrk);
  };

  const handleCopyTracking = () => {
    if (trackingNumber && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuickDeliveryPreset = (days: number) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    const formatted = target.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setEstDelivery(formatted);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrder(order.id, {
      status,
      courierPartner: courier,
      trackingNumber: trackingNumber.trim(),
      estimatedDelivery: estDelivery.trim() || order.estimatedDelivery,
      shippingNotes: notes.trim(),
    });

    if (onSaved) {
      onSaved(`🚚 Order ${order.id} fulfillment updated to "${status}" via ${courier}!`);
    }
    onClose();
  };

  const currentStepIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[#0066FF] dark:text-[#38BDF8]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Manage Order Fulfillment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Order <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{order.id}</span> • Customer: {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Visual Fulfillment Pipeline Stepper */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0F172A] border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span className="uppercase tracking-wider">Fulfillment Lifecycle Stage</span>
              <span className="text-[#0066FF] dark:text-[#38BDF8]">
                {status === 'Cancelled' ? 'Order Cancelled' : `${status}`}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {STATUS_STEPS.map((stepName, idx) => {
                const isPassed = currentStepIdx >= idx && status !== 'Cancelled';
                const isCurrent = status === stepName;

                return (
                  <button
                    type="button"
                    key={stepName}
                    onClick={() => setStatus(stepName)}
                    className={`py-2 px-1 rounded-xl text-center text-[10px] sm:text-xs font-bold transition-all border ${
                      isCurrent
                        ? 'bg-[#0066FF] text-white border-blue-600 shadow-md shadow-blue-500/25 scale-[1.02]'
                        : isPassed
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0066FF] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800/40 hover:bg-blue-100'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-700'
                    }`}
                  >
                    <div className="truncate">{stepName}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setStatus('Cancelled')}
                className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${
                  status === 'Cancelled'
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                }`}
              >
                Mark as Cancelled
              </button>

              <span className="text-[11px] text-slate-400">
                Click any stage above to advance or rollback
              </span>
            </div>
          </div>

          {/* Courier & Tracking Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Courier Partner */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Courier Partner
              </label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              >
                {COURIER_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Delivery */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Estimated Delivery Date</span>
                <span className="text-[10px] text-slate-400 font-normal">Presets:</span>
              </label>
              <div className="flex gap-1.5 mb-1">
                <button
                  type="button"
                  onClick={() => handleQuickDeliveryPreset(1)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                >
                  +1d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDeliveryPreset(3)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                >
                  +3d
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDeliveryPreset(5)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300"
                >
                  +5d
                </button>
              </div>
              <input
                type="text"
                value={estDelivery}
                onChange={(e) => setEstDelivery(e.target.value)}
                placeholder="e.g. Sep 18, 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>
          </div>

          {/* Tracking Number Input & Generator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Waybill / Tracking Number
              </label>
              <button
                type="button"
                onClick={handleGenerateTracking}
                className="text-[11px] font-bold text-[#0066FF] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Generate for {courier}</span>
              </button>
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. FDX-982184912 or JC-TRK-91283"
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
              />
              <button
                type="button"
                onClick={handleCopyTracking}
                className="absolute right-2 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-all"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Shipping & Dispatch Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Warehouse & Fulfillment Internal Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Packed in reinforced double-wall carton. Fragile electronics handle with care. Gate code verified."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          {/* Quick Communication & Dispatch Triggers */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">Customer Dispatch Notifier</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Notify {order.shippingAddress?.firstName || 'Customer'} via WhatsApp or SMS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `📦 *JudesCart Dispatch Alert*\n\nHello ${order.shippingAddress?.firstName || 'Valued Customer'},\nYour order *${order.id}* is currently *${status}* via ${courier}.\n\nWaybill: ${trackingNumber || 'JC-EXP-7729'}\nEst. Delivery: ${estDelivery || '3-5 Business Days'}\n\nTrack live: https://judescart.vercel.app/tracking`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white text-[11px] font-bold shadow-sm transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Alert</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (onSaved) {
                    onSaved(`📲 SMS Notification dispatched to +1 (555) 019-2834 for Order ${order.id}`);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-[11px] font-bold transition-all active:scale-95"
              >
                <Send className="w-3 h-3" />
                <span>Trigger SMS</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
            >
              Save Fulfillment Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
