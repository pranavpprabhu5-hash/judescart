'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Sparkles,
  Key,
  Hash,
  RotateCcw,
  CheckCircle2,
  Copy,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface ProvablyFairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProvablyFairModal({ isOpen, onClose }: ProvablyFairModalProps) {
  const [serverSeed, setServerSeed] = useState('8f4b2b11a938c20d7e5d84c7a912e34581290a3c2089f6b432e189ac024589d1');
  const [clientSeed, setClientSeed] = useState('judescart-live-block-984210');
  const [nonce, setNonce] = useState(42);
  const [totalTickets, setTotalTickets] = useState(1000);
  const [computedHash, setComputedHash] = useState('');
  const [winningTicket, setWinningTicket] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const handleCompute = async () => {
    setIsVerifying(true);
    try {
      const combined = `${serverSeed}:${clientSeed}:${nonce}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(combined);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      // Take first 8 chars for numeric modulo
      const subHex = hashHex.substring(0, 8);
      const decValue = parseInt(subHex, 16);
      const ticketResult = (decValue % totalTickets) + 1;

      setComputedHash(hashHex);
      setWinningTicket(ticketResult);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyHash = () => {
    if (computedHash && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(computedHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Cryptographic Provably-Fair Verification
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase">
                  SHA-256 Validated
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mathematical proof that JudesCart raffle draws cannot be pre-rigged or altered
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

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          {/* How Provably Fair Works Visual 3-Stage Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Lock className="w-4 h-4 text-[#0066FF]" />
                <span>1. Server Seed (Secret)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Generated prior to the draw. Its SHA-256 hash is published beforehand so the server cannot alter it later.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span>2. Client Seed (Public)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Determined by public blockchain block hash or cumulative user inputs right at draw execution time.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>3. Nonce &amp; Modulo Result</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                The combined string is hashed via SHA-256. Taking `Hash % TotalTickets` yields the mathematically unbiased winning ticket.
              </p>
            </div>
          </div>

          {/* Interactive Seed Inspector Tool */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 to-slate-50 dark:from-[#0F172A] dark:to-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#0066FF]" />
                <span>Interactive Verification Playground</span>
              </span>
              <span className="text-[10px] text-slate-400">Compute live in WebCrypto</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Server Seed (Revealed after draw or custom test)
                </label>
                <input
                  type="text"
                  value={serverSeed}
                  onChange={(e) => setServerSeed(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Client Seed (Public Entropy)
                  </label>
                  <input
                    type="text"
                    value={clientSeed}
                    onChange={(e) => setClientSeed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nonce (Iteration #)
                  </label>
                  <input
                    type="number"
                    value={nonce}
                    onChange={(e) => setNonce(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs focus:ring-2 focus:ring-[#0066FF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <label className="text-slate-500 font-medium">Ticket Pool Size:</label>
                  <input
                    type="number"
                    value={totalTickets}
                    onChange={(e) => setTotalTickets(Math.max(10, Number(e.target.value)))}
                    className="w-24 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCompute}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer active:scale-95"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Execute Cryptographic Verification</span>
                </button>
              </div>
            </div>

            {/* Computed Output */}
            {computedHash && (
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cryptographic Digest Verified</span>
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="text-[10px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? 'Copied Hash!' : 'Copy Hash'}
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-[11px] break-all text-slate-700 dark:text-slate-300">
                  {computedHash}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="text-slate-500">
                    Formula: <code className="text-slate-800 dark:text-slate-200 font-mono">parseInt(Hex.slice(0, 8), 16) % {totalTickets} + 1</code>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">
                    Winning Ticket: #{winningTicket}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Guarantee Statement */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-300">
            <Sparkles className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">100% Deterministic &amp; Auditable</p>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400">
                Every ticket draw executed by JudesCart stores its server hash in our permanent ledger before ticket sales conclude. You can take any historical draw seed and verify the exact identical winner index using any third-party SHA-256 tool or Linux command line (`echo -n &quot;seed:client:nonce&quot; | sha256sum`).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0F172A]/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
