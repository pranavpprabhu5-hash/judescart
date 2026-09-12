'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, KeyRound, ArrowRight, ArrowLeft, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLockScreenProps {
  onUnlock: (pin: string) => boolean;
  currentSlug?: string;
}

export function AdminLockScreen({ onUnlock, currentSlug = 'portal' }: AdminLockScreenProps) {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length < 4) {
        const nextPin = pin + digit;
        setPin(nextPin);
        setError(null);

        if (nextPin.length === 4) {
          // Auto-verify on 4th digit
          setTimeout(() => {
            const success = onUnlock(nextPin);
            if (success) {
              setIsSuccess(true);
            } else {
              setError('Invalid Passcode. Please try again.');
              setIsShaking(true);
              setTimeout(() => {
                setIsShaking(false);
                setPin('');
              }, 600);
            }
          }, 150);
        }
      }
    },
    [pin, onUnlock]
  );

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
    setError(null);
  }, []);

  // Capture physical keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDelete, handleClear]);

  const handleManualUnlock = () => {
    if (pin.length === 0) {
      setError('Please enter your 4-digit Master Passcode.');
      return;
    }
    const success = onUnlock(pin);
    if (success) {
      setIsSuccess(true);
    } else {
      setError('Invalid Passcode. Please try again.');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glass Vault Card */}
      <div
        className={cn(
          'w-full max-w-md bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 relative z-10 transition-all duration-300',
          isShaking && 'animate-shake border-red-500/50 shadow-red-500/10',
          isSuccess && 'border-emerald-500/50 shadow-emerald-500/20'
        )}
      >
        {/* Official JudesCart Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/logo-icon.png"
                alt="JudesCart Logo"
                fill
                sizes="40px"
                priority
                className="object-contain"
              />
            </div>
            <span className="font-sans text-2xl font-black tracking-tight text-white flex items-center select-none">
              Judes<span className="text-[#0066FF]">Cart</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#38BDF8] text-xs font-semibold tracking-wider uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Command Center Gatekeeper</span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-white">Administrative Security Vault</h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            Enter your Master Passcode to access store telemetry, order fulfillment, and draw operations.
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-4 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={cn(
                  'w-4 h-4 rounded-full border-2 transition-all duration-200',
                  isFilled
                    ? 'bg-amber-400 border-amber-400 scale-110 shadow-lg shadow-amber-400/50'
                    : 'border-zinc-700 bg-zinc-900/50',
                  error && 'border-red-500 bg-red-500/20',
                  isSuccess && 'border-emerald-400 bg-emerald-400'
                )}
              />
            );
          })}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center justify-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-3 mb-4 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigit(num)}
              className="h-14 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 active:bg-amber-500/20 border border-white/5 hover:border-amber-500/30 text-xl font-semibold text-zinc-100 flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl bg-zinc-900/30 hover:bg-zinc-800/60 active:bg-zinc-700/50 border border-white/5 text-xs font-semibold text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-all duration-150 active:scale-95 uppercase tracking-wider"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/80 active:bg-amber-500/20 border border-white/5 hover:border-amber-500/30 text-xl font-semibold text-zinc-100 flex items-center justify-center transition-all duration-150 active:scale-95 shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-zinc-900/30 hover:bg-zinc-800/60 active:bg-zinc-700/50 border border-white/5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-all duration-150 active:scale-95"
          >
            ⌫
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleManualUnlock}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 mb-4"
        >
          <KeyRound className="w-4 h-4" />
          <span>Unlock Command Center</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </button>

        {/* Security Info & Default Hint */}
        <div className="text-center pt-2 border-t border-white/5 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Default Master PIN: <strong className="text-amber-400 font-mono">2026</strong> (configurable in settings)</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-300 transition-colors mt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit and return to JUDES Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
