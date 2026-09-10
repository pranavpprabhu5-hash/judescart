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
} from 'lucide-react';

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
  coordinates: { x: number; y: number }; // percentage on SVG map
}

export function OrderTrackingMap({ order }: OrderTrackingMapProps) {
  const [activeStage, setActiveStage] = useState<number>(2); // 1 = Packed, 2 = Transit, 3 = Regional, 4 = Delivered

  const checkpoints: TransitCheckpoint[] = [
    {
      id: 1,
      stage: 'Dispatch & Cleared',
      location: 'Newark, NJ',
      facility: 'JudesCart Central Mega-Hub (Warehouse 04)',
      status: 'completed',
      time: 'Today, 04:30 AM',
      details: 'Automated barcode scanner verified. Custom packaging with tamper-evident seal applied.',
      coordinates: { x: 15, y: 35 },
    },
    {
      id: 2,
      stage: 'Air Cargo Flight in Transit',
      location: 'En Route to SFO',
      facility: 'Cargo Express Flight JC-8812',
      status: activeStage >= 2 ? (activeStage === 2 ? 'in_progress' : 'completed') : 'upcoming',
      time: 'Today, 09:45 AM',
      details: 'Loaded onto pressurized cargo hold. Cruising at 34,000 ft with real-time temperature monitoring.',
      coordinates: { x: 48, y: 48 },
    },
    {
      id: 3,
      stage: 'Regional Sorting & Scan',
      location: 'San Francisco, CA',
      facility: 'Bay Area Local Dispatch Center',
      status: activeStage >= 3 ? (activeStage === 3 ? 'in_progress' : 'completed') : 'upcoming',
      time: activeStage >= 3 ? 'Today, 02:15 PM' : 'Tomorrow (Estimated)',
      details: 'Arrival at local sorting facility. Sorted to neighborhood courier vehicle for morning dispatch.',
      coordinates: { x: 75, y: 55 },
    },
    {
      id: 4,
      stage: 'Out for Priority Delivery',
      location: order?.shippingAddress ? `${order.shippingAddress.city}, ${order.shippingAddress.state}` : 'San Francisco, CA',
      facility: 'Courier Van #094 (Driver: Marcus T.)',
      status: activeStage >= 4 ? 'completed' : 'upcoming',
      time: activeStage >= 4 ? 'Today, 04:00 PM' : `${order?.estimatedDelivery || 'In 2 Business Days'}`,
      details: 'Direct contactless handover to customer. Signature receipt & photo verification required.',
      coordinates: { x: 92, y: 30 },
    },
  ];

  const currentCheckpoint = checkpoints[activeStage - 1] || checkpoints[0];
  const progressPercent = ((activeStage - 1) / (checkpoints.length - 1)) * 100;

  const handleAdvanceSimulation = () => {
    setActiveStage((prev) => (prev < 4 ? prev + 1 : 1));
  };

  return (
    <div className="rounded-3xl bg-[#0A192F] border border-blue-900/60 p-6 sm:p-8 text-white space-y-6 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#0066FF]/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/40 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0066FF]/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-base sm:text-lg font-black text-white">
                Live Interactive Parcel Radar
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                GPS Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tracking Waybill: <strong className="font-mono text-cyan-300 font-bold">{order?.trackingNumber || 'JC-TRK-98234710'}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleAdvanceSimulation}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Advance Route Stage ({activeStage}/4)</span>
        </button>
      </div>

      {/* Visual Interactive Map Canvas */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-slate-900 via-[#071326] to-slate-950 border border-slate-800 p-4 overflow-hidden">
        {/* Grid lines styling */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

        {/* SVG Route Trajectory */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {/* Base Inactive Path */}
          <line
            x1="15%"
            y1="35%"
            x2="92%"
            y2="30%"
            stroke="#1e293b"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
          {/* Animated Active Line */}
          <line
            x1="15%"
            y1="35%"
            x2={`${15 + (progressPercent * 0.77)}%`}
            y2={`${35 - ((progressPercent / 100) * 5)}%`}
            stroke="#0066FF"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        {/* Checkpoint Nodes */}
        {checkpoints.map((cp) => {
          const isPassed = activeStage >= cp.id;
          const isCurrent = activeStage === cp.id;

          return (
            <div
              key={cp.id}
              onClick={() => setActiveStage(cp.id)}
              style={{ left: `${cp.coordinates.x}%`, top: `${cp.coordinates.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
            >
              {/* Ping Ring for current node */}
              {isCurrent && (
                <span className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping" />
              )}

              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                  isCurrent
                    ? 'bg-[#0066FF] text-white ring-4 ring-blue-500/30 scale-110'
                    : isPassed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {cp.id === 1 && <Building2 className="w-4 h-4" />}
                {cp.id === 2 && <Plane className="w-4 h-4" />}
                {cp.id === 3 && <Truck className="w-4 h-4" />}
                {cp.id === 4 && <MapPin className="w-4 h-4" />}
              </div>

              {/* Node Tooltip Label */}
              <div className="mt-2 text-center whitespace-nowrap">
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

      {/* Active Stage Detail Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#38BDF8]">
              Stage {activeStage} of 4: {currentCheckpoint.stage}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              {currentCheckpoint.time}
            </span>
          </div>

          <h4 className="font-sans text-sm sm:text-base font-bold text-white">
            {currentCheckpoint.facility}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {currentCheckpoint.details}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-slate-300 flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Priority Dispatch Guaranteed</span>
        </div>
      </div>
    </div>
  );
}
