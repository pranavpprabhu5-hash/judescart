'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Coins,
  Package,
  Heart,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DEFAULT_DEMO_USER } from '@/lib/auth-storage';

export default function LoginPage() {
  const { user, isLoggedIn, loginCustomer, logoutCustomer } = useStore();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setFeedback({ type: 'error', message: 'Please enter both your email and password.' });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const res = await loginCustomer(email, password);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setTimeout(() => {
          router.push('/');
        }, 800);
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'An error occurred during sign in.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setEmail(DEFAULT_DEMO_USER.email);
    setPassword(DEFAULT_DEMO_USER.password || 'judes123');
    setLoading(true);
    setFeedback(null);
    try {
      const res = await loginCustomer(
        DEFAULT_DEMO_USER.email,
        DEFAULT_DEMO_USER.password || 'judes123'
      );
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setTimeout(() => {
          router.push('/');
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Benefits Showcase */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-[#0A192F] via-[#0F172A] to-[#1E293B] text-white shadow-xl min-h-[480px]">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center p-1">
                <Image src="/logo-icon.png" alt="JudesCart" width={28} height={28} className="object-contain" />
              </div>
              <span className="font-extrabold tracking-tight text-white text-base">JudesCart VIP</span>
            </div>

            <h2 className="text-2xl font-black leading-snug tracking-tight text-white mb-3">
              One account for unlimited luxury & everyday essentials.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sign in to manage your orders, redeem JudesCoins for instant discounts, and access exclusive member flash deals.
            </p>
          </div>

          <div className="space-y-3.5 my-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-[#38BDF8] flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Earn 10 Coins / $1 Spent</p>
                <p className="text-slate-400 text-[11px]">Convert rewards into direct order discounts</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Live Courier Tracking</p>
                <p className="text-slate-400 text-[11px]">Real-time radar for every dispatch</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Sync Wishlist Across Devices</p>
                <p className="text-slate-400 text-[11px]">Keep your favorite items saved forever</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit Secure Customer Session</span>
          </div>
        </div>

        {/* Right Side: Sign In Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0C1527] p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
          {isLoggedIn ? (
            <div className="text-center py-6 space-y-4">
              <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#0066FF] shadow-md">
                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  You are signed in as {user.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Continue Shopping
                </Link>
                <button
                  type="button"
                  onClick={logoutCustomer}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0066FF] dark:text-[#38BDF8] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Welcome Back
                </span>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  Customer Sign In
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter your credentials below or use the 1-click test account.
                </p>
              </div>

              {/* Demo Account Quick-Fill */}
              <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Eleanor Sterling</span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-200/70 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      VIP Demo
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Preloaded account (650 coins)</p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  disabled={loading}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  1-Click Demo
                </button>
              </div>

              {feedback && (
                <div
                  className={`mb-4 p-3 rounded-2xl text-xs flex items-start gap-2.5 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <p className="flex-1 font-medium leading-relaxed">{feedback.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300"
                    />
                    <span>Remember my session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm shadow-md hover:shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Don&#39;t have an account yet?{' '}
                <Link href="/signup" className="text-[#0066FF] font-bold hover:underline">
                  Create Account & Claim +200 Coins
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
