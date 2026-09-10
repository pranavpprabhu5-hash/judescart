'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Gift,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  ShoppingBag,
  Percent,
  Truck,
  Zap,
  Award,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { cn } from '@/lib/utils';

export interface Prize {
  id: string;
  label: string;
  sublabel: string;
  code?: string;
  type: 'discount' | 'shipping' | 'voucher' | 'spins';
  color: string;
  textColor: string;
  icon: React.ReactNode;
  probabilityWeight: number; // weighted odds
}

export const PRIZES: Prize[] = [
  {
    id: 'lucky-25',
    label: '25% OFF',
    sublabel: 'Storewide Pass',
    code: 'LUCKY25',
    type: 'discount',
    color: '#0066FF', // JudesCart Electric Blue
    textColor: '#FFFFFF',
    icon: <Sparkles className="w-4 h-4 text-amber-300" />,
    probabilityWeight: 10,
  },
  {
    id: 'free-ship',
    label: 'FREE SHIP',
    sublabel: 'Express Courier',
    code: 'FREESHIP',
    type: 'shipping',
    color: '#0A192F', // Deep Navy
    textColor: '#38BDF8',
    icon: <Truck className="w-4 h-4 text-emerald-400" />,
    probabilityWeight: 20,
  },
  {
    id: 'welcome-15',
    label: '15% OFF',
    sublabel: 'Any Product',
    code: 'WELCOME15',
    type: 'discount',
    color: '#2563EB', // Royal Blue
    textColor: '#FFFFFF',
    icon: <Percent className="w-4 h-4 text-blue-200" />,
    probabilityWeight: 25,
  },
  {
    id: 'lucky-50',
    label: '$50 GIFT',
    sublabel: 'Orders over $200',
    code: 'LUCKY50',
    type: 'voucher',
    color: '#7C3AED', // Royal Violet
    textColor: '#FFFFFF',
    icon: <Gift className="w-4 h-4 text-amber-300" />,
    probabilityWeight: 10,
  },
  {
    id: 'tech-bonus',
    label: '15% TECH',
    sublabel: 'Electronics & Audio',
    code: 'TECHBONUS',
    type: 'discount',
    color: '#0284C7', // Sky Blue
    textColor: '#FFFFFF',
    icon: <Zap className="w-4 h-4 text-amber-300" />,
    probabilityWeight: 20,
  },
  {
    id: 'bonus-spin',
    label: '+1 SPIN',
    sublabel: 'Free Retry',
    type: 'spins',
    color: '#F59E0B', // Bright Amber Gold
    textColor: '#0A192F',
    icon: <RotateCcw className="w-4 h-4 text-stone-900" />,
    probabilityWeight: 15,
  },
  {
    id: 'mystery-10',
    label: '10% + GIFT',
    sublabel: 'Mystery Surprise',
    code: 'MYSTERY10',
    type: 'discount',
    color: '#0F172A', // Slate Dark
    textColor: '#38BDF8',
    icon: <Award className="w-4 h-4 text-cyan-300" />,
    probabilityWeight: 25,
  },
  {
    id: 'lucky-20',
    label: '20% OFF',
    sublabel: 'All Departments',
    code: 'LUCKY20',
    type: 'discount',
    color: '#1D4ED8', // Rich Blue
    textColor: '#FFFFFF',
    icon: <Flame className="w-4 h-4 text-orange-400" />,
    probabilityWeight: 15,
  },
];

interface LuckyDrawWheelProps {
  onPrizeClaimed?: () => void;
  className?: string;
}

export function LuckyDrawWheel({ onPrizeClaimed, className }: LuckyDrawWheelProps) {
  const { claimLuckyPrize } = useStore();

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [claimed, setClaimed] = useState(false);

  // Audio Context for synthetic mechanical tick and victory fanfare
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (typeof window === 'undefined') return;
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
  };

  const playTick = () => {
    if (!soundEnabled || !audioContextRef.current) return;
    try {
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // Audio not supported or blocked
    }
  };

  const playFanfare = () => {
    if (!soundEnabled || !audioContextRef.current) return;
    try {
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
        gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
      });
    } catch {
      // Audio not supported
    }
  };

  // Load spins count from localStorage with daily reset
  useEffect(() => {
    try {
      const savedDate = localStorage.getItem('judescart_spin_date');
      const today = new Date().toDateString();
      if (savedDate !== today) {
        localStorage.setItem('judescart_spin_date', today);
        localStorage.setItem('judescart_spins_left', '3');
        setSpinsLeft(3);
      } else {
        const savedSpins = localStorage.getItem('judescart_spins_left');
        setSpinsLeft(savedSpins !== null ? parseInt(savedSpins, 10) : 3);
      }
    } catch {
      setSpinsLeft(3);
    }
  }, []);

  // Update countdown to midnight reset
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeUntilReset(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger celebration confetti
  const triggerCelebration = () => {
    playFanfare();
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#0066FF', '#38BDF8', '#F59E0B'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#10B981', '#FFFFFF', '#0A192F'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#0066FF', '#7C3AED', '#F59E0B'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    initAudio();
    setIsSpinning(true);
    setWonPrize(null);
    setCopiedCode(false);
    setClaimed(false);

    // Weighted random selection
    const totalWeight = PRIZES.reduce((acc, p) => acc + p.probabilityWeight, 0);
    let rand = Math.random() * totalWeight;
    let selectedIndex = 0;

    for (let i = 0; i < PRIZES.length; i++) {
      if (rand < PRIZES[i].probabilityWeight) {
        selectedIndex = i;
        break;
      }
      rand -= PRIZES[i].probabilityWeight;
    }

    const prize = PRIZES[selectedIndex];

    // Decrement spins (unless prize is bonus spin, which adds one)
    const newSpins = prize.type === 'spins' ? spinsLeft : spinsLeft - 1;
    setSpinsLeft(newSpins);
    try {
      localStorage.setItem('judescart_spins_left', newSpins.toString());
    } catch {
      // Ignored
    }

    // Calculate rotation angle
    // 8 slices => each slice is 45 degrees
    // Pointer is located at the TOP (270 degrees in standard SVG or top needle)
    // Slice i center angle = i * 45 + 22.5
    const sliceAngle = 360 / PRIZES.length;
    const targetSliceCenter = selectedIndex * sliceAngle + sliceAngle / 2;

    // Slight organic jitter within the segment (+/- 14 degrees)
    const jitter = (Math.random() - 0.5) * 26;

    // Minimum 5 full rotations (1800 deg) for dramatic build-up
    const fullSpins = 5 + Math.floor(Math.random() * 2);
    // Pointer is at the top (needle pointing down at angle 270 deg)
    // When wheel rotates clockwise by R, the slice that ends at 270 is targetSliceCenter
    const currentRotMod = rotation % 360;
    let targetRotation = rotation + (360 - currentRotMod) + fullSpins * 360 + (270 - targetSliceCenter + jitter);
    if (targetRotation <= rotation) {
      targetRotation += 360;
    }

    setRotation(targetRotation);

    // Audio tick simulation while wheel decelerates
    const spinDuration = 4800; // ms
    const tickIntervals = [80, 100, 130, 170, 230, 320, 450, 650];
    let tickTime = 100;
    tickIntervals.forEach((gap, idx) => {
      setTimeout(() => {
        if (soundEnabled) playTick();
      }, tickTime);
      tickTime += gap * (idx + 1);
    });

    // Spin completes
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(prize);
      triggerCelebration();

      if (prize.type === 'spins') {
        const bonusUpdated = spinsLeft + 1;
        setSpinsLeft(bonusUpdated);
        try {
          localStorage.setItem('judescart_spins_left', bonusUpdated.toString());
        } catch {
          // Ignored
        }
      }
    }, spinDuration);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleApplyToCart = (code: string) => {
    claimLuckyPrize(code);
    setClaimed(true);
    if (onPrizeClaimed) onPrizeClaimed();
  };

  // Precompute SVG slice paths
  const slices = useMemo(() => {
    const totalSlices = PRIZES.length;
    const sliceAngle = (2 * Math.PI) / totalSlices;
    const radius = 180;
    const cx = 200;
    const cy = 200;

    return PRIZES.map((prize, idx) => {
      const startAngle = idx * sliceAngle;
      const endAngle = (idx + 1) * sliceAngle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      // Arc path
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

      // Text and icon position: along the bisector angle
      const midAngle = startAngle + sliceAngle / 2;
      const textRadius = 120;
      const textX = cx + textRadius * Math.cos(midAngle);
      const textY = cy + textRadius * Math.sin(midAngle);
      const textRotation = (midAngle * 180) / Math.PI + 90;

      return {
        pathData,
        prize,
        textX,
        textY,
        textRotation,
        idx,
      };
    });
  }, []);

  return (
    <div className={cn('relative flex flex-col items-center select-none', className)}>
      {/* Top Header Controls Bar */}
      <div className="w-full flex items-center justify-between gap-2 mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
            <span>{spinsLeft} Free Spin{spinsLeft !== 1 ? 's' : ''} Left</span>
          </span>
          {spinsLeft === 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Resets in {timeUntilReset}</span>
            </span>
          )}
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 text-slate-400 hover:text-slate-700 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-[#0066FF]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Wheel Stage Container */}
      <div className="relative w-76 h-76 sm:w-92 sm:h-92 flex items-center justify-center">
        {/* Outer Glowing Pulsing Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0066FF] via-cyan-400 to-amber-400 opacity-25 blur-xl pointer-events-none animate-pulse" />

        {/* Decorative Metallic Rim */}
        <div className="absolute inset-0 rounded-full p-2.5 bg-gradient-to-b from-slate-200 via-white to-slate-300 shadow-2xl border-4 border-slate-300/80 flex items-center justify-center">
          {/* Pegs / Bulbs around the perimeter */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-xs border border-amber-500"
                style={{
                  transform: `rotate(${angle}deg) translate(0, -172px)`,
                }}
              />
            );
          })}

          {/* Rotating SVG Wheel */}
          <div
            className="w-full h-full rounded-full overflow-hidden transition-transform duration-[4800ms] cubic-bezier(0.12, 0.8, 0.16, 1)"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Slices */}
              {slices.map((slice) => (
                <g key={slice.idx}>
                  <path
                    d={slice.pathData}
                    fill={slice.prize.color}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="transition-colors"
                  />
                  <g
                    transform={`translate(${slice.textX}, ${slice.textY}) rotate(${slice.textRotation})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <text
                      fill={slice.prize.textColor}
                      fontWeight="900"
                      fontSize="14"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      letterSpacing="0.05em"
                    >
                      {slice.prize.label}
                    </text>
                    <text
                      y="14"
                      fill={slice.prize.textColor}
                      opacity="0.85"
                      fontWeight="600"
                      fontSize="9"
                      letterSpacing="0.03em"
                    >
                      {slice.prize.sublabel}
                    </text>
                  </g>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Central Indicator Pointer (At Top, pointing inward down) */}
        <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none drop-shadow-md">
          <div className="w-7 h-9 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-xl border-2 border-white shadow-lg flex items-center justify-center transform origin-top animate-bounce duration-500">
            <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
          </div>
          <div className="w-0 h-0 border-x-[9px] border-x-transparent border-t-[12px] border-t-amber-600 -mt-1" />
        </div>

        {/* Center Spin Button / Hub */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || spinsLeft <= 0}
          className={cn(
            'absolute z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center p-1',
            'bg-gradient-to-tr from-[#0A192F] via-[#0066FF] to-cyan-400 text-white shadow-2xl border-4 border-white cursor-pointer',
            'transition-all duration-300 transform active:scale-95 group focus:outline-hidden',
            isSpinning && 'cursor-wait opacity-90 scale-95',
            spinsLeft <= 0 && !isSpinning && 'opacity-70 cursor-not-allowed bg-slate-400'
          )}
        >
          <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase group-hover:scale-110 transition-transform">
            {isSpinning ? 'SPINNING...' : spinsLeft <= 0 ? 'NO SPINS' : 'SPIN'}
          </span>
          <span className="text-[9px] text-cyan-200 font-semibold uppercase tracking-widest">
            {spinsLeft > 0 ? `${spinsLeft} LEFT` : 'COME BACK'}
          </span>
        </button>
      </div>

      {/* Prize Reveal Card */}
      {wonPrize && (
        <div className="mt-6 w-full p-5 bg-gradient-to-br from-white to-blue-50/70 border border-blue-200/90 rounded-2xl shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center text-xl font-black shadow-md shadow-blue-500/25 shrink-0">
                🎉
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider block">
                  Congratulations! You Won
                </span>
                <h4 className="text-lg font-extrabold text-[#0A192F]">
                  {wonPrize.label} • {wonPrize.sublabel}
                </h4>
              </div>
            </div>

            {wonPrize.code && (
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Code</span>
                <span className="px-2.5 py-1 bg-white border border-blue-200 rounded-lg font-mono font-bold text-[#0066FF] text-xs">
                  {wonPrize.code}
                </span>
              </div>
            )}
          </div>

          {wonPrize.code ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-100">
              <button
                onClick={() => handleCopyCode(wonPrize.code!)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Code ({wonPrize.code})</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleApplyToCart(wonPrize.code!)}
                className={cn(
                  'w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer',
                  claimed
                    ? 'bg-emerald-600 shadow-emerald-600/30'
                    : 'bg-[#0066FF] hover:bg-blue-700 shadow-blue-600/30'
                )}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{claimed ? 'Applied! Opening Cart...' : 'Apply Code Directly to Cart'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
              <p className="text-xs text-slate-600">
                You scored an extra free spin! Hit <strong>SPIN</strong> above to try again.
              </p>
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className="px-4 py-2 bg-[#0066FF] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Spin Again Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Micro-guarantee Footer */}
      <div className="mt-4 text-center text-[11px] text-slate-500 font-medium">
        ⚡ 100% Guaranteed Win • All coupons apply instantly at checkout
      </div>
    </div>
  );
}
