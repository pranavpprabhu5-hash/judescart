'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Zap,
  Gift,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function SignupPage() {
  const { isLoggedIn, user, signupCustomer } = useStore();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    if (password !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    if (!acceptTerms) {
      setFeedback({ type: 'error', message: 'Please accept the Terms of Service to proceed.' });
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const res = await signupCustomer({
        name,
        email,
        password,
        phone,
      });

      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
        setTimeout(() => {
          router.push('/');
        }, 800);
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to create customer account.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Perks Banner */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#0A192F] text-white shadow-xl min-h-[520px]">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center p-1 backdrop-blur-xs">
                <Image src="/logo-icon.png" alt="JudesCart" width={28} height={28} className="object-contain" />
              </div>
              <span className="font-extrabold tracking-tight text-white text-base">JudesCart VIP</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
              <Gift className="w-3.5 h-3.5" />
              <span>+200 Welcome Coins</span>
            </div>

            <h2 className="text-2xl font-black leading-snug tracking-tight text-white mb-3">
              Join JudesCart & unlock premium rewards from day one.
            </h2>
            <p className="text-xs text-blue-100 leading-relaxed">
              Create your free customer account in seconds to save delivery addresses, track courier dispatches, and spin the Lucky Draw wheel.
            </p>
          </div>

          <div className="space-y-3.5 my-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Free Express Shipping &gt; $99</p>
                <p className="text-blue-100 text-[11px]">Instant qualification on all registered carts</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">30-Day Hassle-Free Returns</p>
                <p className="text-blue-100 text-[11px]">Print prepaid return labels in one click</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Daily Mystery Box Claims</p>
                <p className="text-blue-100 text-[11px]">Free gifts &amp; discount vouchers everyday</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 flex items-center gap-2 text-[11px] text-blue-100">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Encrypted Member Data Protection</span>
          </div>
        </div>

        {/* Right Side: Sign Up Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0C1527] p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
          {isLoggedIn ? (
            <div className="text-center py-6 space-y-4">
              <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#0066FF] shadow-md">
                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Welcome, {user.name}!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You already have an active session associated with {user.email}.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/"
                  className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold transition-all shadow-xs"
                >
                  Start Exploring Products
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0066FF] dark:text-[#38BDF8] flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-amber-500" /> +200 Welcome Bonus
                </span>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                  Create Customer Account
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sign up in seconds to claim your welcome reward &amp; faster checkout.
                </p>
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

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Hayes"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address <span className="text-rose-500">*</span>
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
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label="Toggle password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 rounded text-[#0066FF] focus:ring-[#0066FF] border-slate-300"
                    />
                    <span>
                      I agree to the{' '}
                      <span className="text-[#0066FF] font-semibold underline">JudesCart Terms</span> and{' '}
                      <span className="text-[#0066FF] font-semibold underline">Privacy Policy</span>.
                    </span>
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
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Complete Registration & Claim +200 Coins</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-[#0066FF] font-bold hover:underline">
                  Sign In here
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
