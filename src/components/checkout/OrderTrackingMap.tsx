'use client';

import React, { useState } from 'react';
import { Order } from '@/types/user';
import {
  Truck,
  Plane,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  RefreshCw,
  Navigation,
  ArrowRight,
  QrCode,
  Share2,
  Check,
  Radio,
  Thermometer,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderTrackingMapProps {
  order?: Order | null;
}

interface TransitCheckpoint {
  id: number;
  stage: string;
  location: string;
  facility: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  time: string;
  details: string;
  coordinates: { x: number; y: number };
  gps: string;
  telemetry: string;
}

export function OrderTrackingMap({ order }: OrderTrackingMapProps) {
  const [activeStage, setActiveStage] = useState<number>(2); // 1 = Packed, 2 = Transit, 3 = Regional, 4 = Delivered
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const waybill = order?.trackingNumber || 'DHL-391048192';
  const courier = order?.courierPartner || 'DHL Express';

  const checkpoints: TransitCheckpoint[] = [
    {
      id: 1,
      stage: 'Dispatch & Cleared',
      location: 'Milan, Italy',
      facility: 'JUDES European Logistics Hub (Facility #02)',
      status: 'completed',
      time: 'Sep 06, 04:30 AM',
      details: 'Automated barcode scanner verified. Custom luxury tamper-evident wax seal applied.',
      coordinates: { x: 15, y: 35 },
      gps: '45.4642° N, 9.1900° E',
      telemetry: '19.8°C • Optimal Climate',
    },
    {
      id: 2,
      stage: 'Air Cargo Express in Flight',
      location: 'Atlantic Corridor Flight JC-8812',
      facility: 'Airbus A350-900 Freight Hold',
      status: activeStage >= 2 ? (activeStage === 2 ? 'in_progress' : 'completed') : 'upcoming',
      time: 'Sep 08, 09:45 AM',
      details: 'Pressurized cargo hold transit. Real-time altitude 36,000 ft with climate stabilization.',
      coordinates: { x: 48, y: 48 },
      gps: '42.1120° N, 31.8490° W',
      telemetry: '18.2°C • Altitude 36,000 ft',
    },
    {
      id: 3,
      stage: 'Regional Sorting & Customs Scan',
      location: order?.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 'San Francisco, CA',
      facility: `${courier} Bay Area Sorting Center`,
      status: activeStage >= 3 ? (activeStage === 3 ? 'in_progress' : 'completed') : 'upcoming',
      time: activeStage >= 3 ? 'Sep 09, 02:15 PM' : 'Tomorrow (Estimated)',
      details: 'Customs cleared and assigned to local courier route vehicle for next-morning contactless delivery.',
      coordinates: { x: 75, y: 55 },
      gps: '37.7749° N, 122.4194° W',
      telemetry: '20.5°C • Ground Facility',
    },
    {
      id: 4,
      stage: 'Out for Priority Contactless Delivery',
      location: order?.shippingAddress ? `${order.shippingAddress.street}` : 'Customer Residence',
      facility: `Courier Van #094 (Driver: Marcus T.)`,
      status: activeStage >= 4 ? 'completed' : 'upcoming',
      time: activeStage >= 4 ? 'Today, 04:00 PM' : `${order?.estimatedDelivery || 'Sep 10, 2026'}`,
      details: 'Handover signature receipt and photo verification required.',
      coordinates: { x: 92, y: 30 },
      gps: '37.7833° N, 122.4167° W',
      telemetry: '21.0°C • Final Mile',
    },
  ];

  const currentCheckpoint = checkpoints[activeStage - 1] || checkpoints[0];
  const progressPercent = ((activeStage - 1) / (checkpoints.length - 1)) * 100;

  const handleAdvanceSimulation = () => {
    setActiveStage((prev) => (prev < 4 ? prev + 1 : 1));
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📦 Track my JudesCart order (${order?.id || 'JC-89102'}):\nCourier: ${courier}\nWaybill: ${waybill}\nStatus: ${currentCheckpoint.stage}\nTrack live: https://judescart.vercel.app/checkout/success`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyTracking = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`https://judescart.vercel.app/checkout/success?trk=${waybill}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0B132B] via-[#070F1E] to-[#040814] border border-blue-900/60 p-6 sm:p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[#0066FF]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/40 pb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0066FF]/30 to-cyan-400/20 border border-blue-500/40 flex items-center justify-center text-[#38BDF8] shrink-0 shadow-lg shadow-blue-500/10">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-base sm:text-lg font-black text-white tracking-tight">
                Live Courier Radar
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live GPS Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>{courier}:</span>
              <strong className="font-mono text-cyan-300 font-bold tracking-wider">{waybill}</strong>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsBarcodeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-zinc-200 border border-slate-700/80 hover:border-cyan-400/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verify Barcode</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Share via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleAdvanceSimulation}
            className="px-3 py-1.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-xs font-bold text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span>Step Stage ({activeStage}/4)</span>
          </button>
        </div>
      </div>

      {/* Visual Interactive Map Canvas */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-gradient-to-b from-slate-950 via-[#071326] to-[#050C1B] border border-blue-900/40 p-4 overflow-hidden shadow-inner">
        {/* Radar concentric circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-blue-500/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-blue-500/15 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        {/* SVG Route Trajectory */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <line
            x1="15%"
            y1="35%"
            x2="92%"
            y2="30%"
            stroke="#1e293b"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          <line
            x1="15%"
            y1="35%"
            x2={`${15 + progressPercent * 0.77}%`}
            y2={`${35 - (progressPercent / 100) * 5}%`}
            stroke="#0066FF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Dynamic Moving Courier Icon */}
        <div
          style={{
            left: `${15 + progressPercent * 0.77}%`,
            top: `${35 - (progressPercent / 100) * 5}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700 pointer-events-none"
        >
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-cyan-400/40 animate-ping" />
            <div className="w-8 h-8 rounded-full bg-cyan-400 text-zinc-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-400/50">
              {activeStage === 2 ? <Plane className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Checkpoint Nodes */}
        {checkpoints.map((cp) => {
          const isPassed = activeStage >= cp.id;
          const isCurrent = activeStage === cp.id;

          return (
            <div
              key={cp.id}
              onClick={() => setActiveStage(cp.id)}
              style={{ left: `${cp.coordinates.x}%`, top: `${cp.coordinates.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-10"
            >
              {isCurrent && (
                <span className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping" />
              )}

              <div
                className={cn(
                  'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md',
                  isCurrent
                    ? 'bg-[#0066FF] text-white ring-4 ring-blue-500/30 scale-110'
                    : isPassed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                )}
              >
                {cp.id === 1 && <Building2 className="w-4 h-4" />}
                {cp.id === 2 && <Plane className="w-4 h-4" />}
                {cp.id === 3 && <Truck className="w-4 h-4" />}
                {cp.id === 4 && <MapPin className="w-4 h-4" />}
              </div>

              <div className="mt-2 text-center whitespace-nowrap bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/5">
                <span className="font-sans text-[11px] font-bold text-white block">
                  {cp.location}
                </span>
                <span className="text-[9px] text-slate-400 block font-medium">
                  {cp.stage}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Stage Live Telemetry Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#38BDF8] font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Live GPS Coordinates</span>
          </div>
          <div className="font-mono text-sm font-bold text-white tracking-wider">
            {currentCheckpoint.gps}
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            {currentCheckpoint.facility}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Parcel Telemetry</span>
          </div>
          <div className="font-mono text-sm font-bold text-amber-300">
            {currentCheckpoint.telemetry}
          </div>
          <p className="text-[11px] text-slate-400">
            Hermetic seal intact • Zero tilt deviation
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Estimated Handover</span>
            </div>
            <div className="font-mono text-sm font-bold text-white mt-0.5">
              {order?.estimatedDelivery || 'Sep 10, 2026'}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopyTracking}
            className="text-[11px] text-cyan-300 hover:underline flex items-center gap-1 self-start cursor-pointer"
          >
            {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
            <span>{copiedLink ? 'Tracking URL Copied!' : 'Copy Live Tracking Link'}</span>
          </button>
        </div>
      </div>

      {/* Barcode / QR Modal */}
      {isBarcodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <QrCode className="w-4 h-4" />
                <span>Courier Verification Manifest</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBarcodeModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Simulated Code-128 Barcode */}
            <div className="p-4 rounded-2xl bg-white text-black space-y-2">
              <div className="h-16 flex items-center justify-center gap-1 overflow-hidden px-2">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1)}px` }}
                    className="h-full bg-black"
                  />
                ))}
              </div>
              <div className="font-mono text-xs tracking-widest font-black uppercase text-center">
                *{waybill}*
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Present this barcode or waybill to your {courier} courier driver upon priority handover.
            </p>

            <button
              type="button"
              onClick={() => setIsBarcodeModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-all"
            >
              Close Manifest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
