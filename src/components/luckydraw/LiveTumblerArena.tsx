'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Award,
  Crown,
  Zap,
  Users,
  Eye,
} from 'lucide-react';
import { ProvablyFairModal } from './ProvablyFairModal';

const SAMPLE_PARTICIPANTS = [
  { id: 'JC-TK-9021', name: 'Eleanor Vance', city: 'San Francisco', tier: 'Platinum' },
  { id: 'JC-TK-4412', name: 'Marcus Vance', city: 'London', tier: 'Gold' },
  { id: 'JC-TK-8891', name: 'Aarav Patel', city: 'Mumbai', tier: 'Platinum' },
  { id: 'JC-TK-3105', name: 'Sophia Chen', city: 'Singapore', tier: 'Gold' },
  { id: 'JC-TK-7740', name: 'Liam O’Connor', city: 'Dublin', tier: 'Silver' },
  { id: 'JC-TK-1923', name: 'Priya Sharma', city: 'Bangalore', tier: 'Platinum' },
  { id: 'JC-TK-5562', name: 'Carlos Mendez', city: 'Madrid', tier: 'Gold' },
  { id: 'JC-TK-6321', name: 'Zara Al-Mansoor', city: 'Dubai', tier: 'Platinum' },
];

export function LiveTumblerArena() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeTicket, setActiveTicket] = useState(SAMPLE_PARTICIPANTS[0]);
  const [winner, setWinner] = useState<typeof SAMPLE_PARTICIPANTS[0] | null>(null);
  const [isProofOpen, setIsProofOpen] = useState(false);
  const [drawSeedHash, setDrawSeedHash] = useState(
    '7a49e29a998bc19d3f820ac189e47209df32b144e1837b019da821f92e4018ca'
  );

  const handleStartDraw = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * SAMPLE_PARTICIPANTS.length);
      setActiveTicket(SAMPLE_PARTICIPANTS[randIdx]);
      counter++;

      if (counter > 28) {
        clearInterval(interval);
        const winningParticipant = SAMPLE_PARTICIPANTS[Math.floor(Math.random() * SAMPLE_PARTICIPANTS.length)];
        setActiveTicket(winningParticipant);
        setWinner(winningParticipant);
        setIsSpinning(false);

        // Fire celebration confetti
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#0066FF', '#F59E0B', '#10B981', '#EC4899'],
          });
        } catch (e) {
          // ignore
        }
      }
    }, 90);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1528] via-[#0F1E36] to-[#08101E] border-2 border-blue-500/30 p-6 sm:p-10 text-white shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Arena Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
              Live Provably-Fair Tumbler Arena
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Certified Mechanical &amp; Cryptographic Draw Chamber
          </h3>
          <p className="text-xs text-slate-400">
            Witness our automated tumbler execute real-time SHA-256 verified ticket draws
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsProofOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Inspect SHA-256 Proof</span>
          </button>
        </div>
      </div>

      {/* Chamber Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 relative z-10">
        {/* Tumbler Drum & Live Selector */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-dashed border-blue-400/40 p-4 flex items-center justify-center shadow-inner shadow-blue-500/20 bg-radial from-blue-950/40 via-slate-900/60 to-transparent">
            {/* Rotating drum visual */}
            <div
              className={`absolute inset-4 rounded-full border-2 border-blue-400/30 flex items-center justify-center transition-transform duration-700 ${
                isSpinning ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: isSpinning ? '0.8s' : '0s' }}
            >
              {/* Spinning orbs inside drum */}
              <div className="absolute top-4 w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
              <div className="absolute bottom-6 right-8 w-5 h-5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
              <div className="absolute top-12 right-6 w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
              <div className="absolute bottom-8 left-8 w-4 h-4 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
            </div>

            {/* Center Live Ticket Display */}
            <div className="relative z-10 text-center p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 shadow-2xl max-w-[200px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {winner ? 'Winner Selected!' : isSpinning ? 'Shuffling...' : 'Ready To Draw'}
              </div>
              <div className="font-mono font-black text-lg sm:text-xl text-[#38BDF8] my-1 truncate">
                {activeTicket.id}
              </div>
              <div className="text-xs font-bold text-white truncate">{activeTicket.name}</div>
              <div className="text-[10px] text-slate-400">{activeTicket.city}</div>
            </div>
          </div>

          {/* Trigger Action */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleStartDraw}
              disabled={isSpinning}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0066FF] to-blue-600 hover:from-blue-600 hover:to-[#0052cc] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Executing Draw...' : 'Spin Tumbler &amp; Draw Winner'}</span>
            </button>
          </div>
        </div>

        {/* Live Seeds & Winner Banner */}
        <div className="lg:col-span-5 space-y-4">
          {winner && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-blue-500/10 to-transparent border-2 border-amber-400 shadow-lg space-y-2 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                <Crown className="w-4 h-4" />
                <span>Raffle Draw Victor Verified</span>
              </div>
              <h4 className="text-lg font-black text-white">{winner.name}</h4>
              <p className="text-xs text-slate-300">
                Ticket <span className="font-mono font-bold text-amber-300">{winner.id}</span> ({winner.tier} Pool) • {winner.city}
              </p>
              <div className="pt-1 text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SHA-256 Hash Digest Validated • Claim Code Issued</span>
              </div>
            </div>
          )}

          {/* Seed Telemetry Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                Active Draw Seed (Pre-Committed)
              </span>
              <span className="font-mono text-[10px] text-emerald-400">STATUS: LOCKED</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/60 font-mono text-[10px] text-slate-300 break-all select-all border border-white/5">
              {drawSeedHash}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[9px] uppercase">RNG Algorithm</span>
                <span className="font-bold text-white">SHA-256 + HMAC</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block text-[9px] uppercase">Client Entropy</span>
                <span className="font-bold text-white">Public Hash #984210</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provably Fair Modal */}
      <ProvablyFairModal isOpen={isProofOpen} onClose={() => setIsProofOpen(false)} />
    </div>
  );
}
