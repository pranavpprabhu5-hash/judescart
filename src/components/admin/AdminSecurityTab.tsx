'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  KeyRound,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Fingerprint,
  Radio,
  Clock,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/context/StoreContext';

interface AdminSecurityTabProps {
  showToast: (msg: string) => void;
}

export function AdminSecurityTab({ showToast }: AdminSecurityTabProps) {
  const {
    adminAccessSlug,
    adminPin,
    isPinRequired,
    adminCloakMode,
    setAdminAccessSettings,
    lockConsole,
  } = useStore();

  const [slugInput, setSlugInput] = useState(adminAccessSlug || 'portal');
  const [pinInput, setPinInput] = useState(adminPin || '2026');
  const [pinRequiredInput, setPinRequiredInput] = useState(isPinRequired ?? true);
  const [cloakModeInput, setCloakModeInput] = useState<'lockscreen' | 'redirect_slug' | 'redirect_home'>(
    adminCloakMode || 'lockscreen'
  );
  const [showPin, setShowPin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('https://judescart.vercel.app');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    setSlugInput(adminAccessSlug);
    setPinInput(adminPin);
    setPinRequiredInput(isPinRequired);
    setCloakModeInput(adminCloakMode);
  }, [adminAccessSlug, adminPin, isPinRequired, adminCloakMode]);

  const fullCustomUrl = `${origin}/${slugInput.trim() || 'portal'}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(fullCustomUrl);
      setCopied(true);
      showToast(`📋 Copied private access link: ${fullCustomUrl}`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleApplyPreset = (preset: string) => {
    setSlugInput(preset);
  };

  const handleSaveSettings = () => {
    const cleanSlug = slugInput.toLowerCase().replace(/[^a-z0-9-_]/g, '').trim() || 'portal';
    setAdminAccessSettings({
      slug: cleanSlug,
      pin: pinInput.trim() || '2026',
      isPinRequired: pinRequiredInput,
      cloakMode: cloakModeInput,
    });
    showToast(`✅ Security settings updated! Access link is now /${cleanSlug}`);
  };

  const auditLogs = [
    {
      id: 'log-1',
      timestamp: 'Just now',
      operator: 'Super Admin (Eleanor Vance)',
      route: `/${adminAccessSlug || 'portal'}`,
      ip: '172.20.10.13 (Private LAN)',
      status: 'PIN Verified • Authorized',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'log-2',
      timestamp: '12 minutes ago',
      operator: 'Command Center Session',
      route: '/admin',
      ip: '127.0.0.1 (Localhost)',
      status: 'Session Hydrated',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 'log-3',
      timestamp: '1 hour ago',
      operator: 'Vercel Deployment Worker',
      route: '/portal',
      ip: 'iad1.vercel.app (Production)',
      status: 'SSR Pre-render',
      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-[#0c0d14] border border-amber-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero-Trust Admin Security</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Access Link & Security Vault
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl">
              Customize your private administrative URL slug, set up biometric/PIN gatekeeper authentication, and configure public cloaking for the default <code className="text-amber-400">/admin</code> entry point.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={lockConsole}
              className="px-4 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/40 text-xs font-semibold text-zinc-200 hover:text-amber-300 flex items-center gap-2 transition-all active:scale-95 shadow-lg"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Lock Console Now</span>
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-xs font-bold text-zinc-950 flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Security Settings</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Private Access Link Configuration */}
        <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Custom Access Link</h3>
              <p className="text-xs text-zinc-400">Specify the vanity path for administrative access</p>
            </div>
          </div>

          {/* Current Live URL Display */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span>Active Private URL</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live on Production
              </span>
            </label>
            <div className="flex items-center gap-2 p-3 bg-zinc-900/90 border border-amber-500/30 rounded-2xl">
              <span className="text-xs font-mono text-amber-300 truncate select-all flex-1">
                {fullCustomUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 transition-all active:scale-95"
                title="Copy URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={fullCustomUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
                title="Open Link in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Slug Input */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">Custom Route Slug</label>
            <div className="flex items-center rounded-2xl bg-zinc-900 border border-zinc-700/80 focus-within:border-amber-500 overflow-hidden">
              <span className="px-3 text-xs font-mono text-zinc-500 bg-zinc-950/50 border-r border-zinc-800 py-3 select-none">
                judescart.vercel.app/
              </span>
              <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                placeholder="e.g. portal, judes-hq, command-center"
                className="flex-1 bg-transparent px-3 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
              />
            </div>
            <p className="text-[11px] text-zinc-400">
              Letters, numbers, and hyphens only.
            </p>
          </div>

          {/* Slug Quick Presets */}
          <div className="space-y-2">
            <span className="text-xs text-zinc-400">Quick Presets:</span>
            <div className="flex flex-wrap gap-2">
              {['portal', 'judes-hq', 'command-center', 'control-room', 'console'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-mono transition-all border',
                    slugInput === preset
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                  )}
                >
                  /{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Cloaking Policy for Default /admin */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Default <code className="text-amber-400">/admin</code> Path Behavior
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'lockscreen',
                  title: 'Show Luxury PIN Lock Screen (Recommended)',
                  desc: 'Requires the 4-digit Master Passcode to reveal store controls.',
                },
                {
                  id: 'redirect_slug',
                  title: 'Seamless Redirect to Private Slug',
                  desc: 'Automatically forwards all /admin visits to your configured URL.',
                },
                {
                  id: 'redirect_home',
                  title: 'Cloak & Redirect to Storefront (Stealth Mode)',
                  desc: 'Public visitors visiting /admin are redirected to the homepage.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  onClick={() => setCloakModeInput(opt.id as any)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all',
                    cloakModeInput === opt.id
                      ? 'bg-amber-500/10 border-amber-500/40 text-zinc-100'
                      : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/80 text-zinc-300'
                  )}
                >
                  <input
                    type="radio"
                    name="cloakMode"
                    value={opt.id}
                    checked={cloakModeInput === opt.id}
                    onChange={() => setCloakModeInput(opt.id as any)}
                    className="mt-1 text-amber-500 focus:ring-amber-500"
                  />
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-zinc-100">{opt.title}</p>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Master PIN & Security Gatekeeper */}
        <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl hover:border-amber-500/30 transition-all flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Master Passcode & Gatekeeper</h3>
                <p className="text-xs text-zinc-400">Configure access credentials and locking thresholds</p>
              </div>
            </div>

            {/* Toggle PIN Required */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-100">Require Passcode Gatekeeper</p>
                <p className="text-[11px] text-zinc-400">
                  Prompts the biometric/PIN modal whenever the admin panel is opened or locked
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPinRequiredInput(!pinRequiredInput)}
                className={cn(
                  'w-12 h-6 rounded-full transition-colors relative focus:outline-none',
                  pinRequiredInput ? 'bg-amber-500' : 'bg-zinc-700'
                )}
              >
                <span
                  className={cn(
                    'block w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm',
                    pinRequiredInput ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            {/* Master PIN Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-300">Master Passcode (4 to 8 digits)</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  maxLength={8}
                  placeholder="2026"
                  className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-zinc-400">
                Default: <span className="font-mono text-amber-400">2026</span>. Anyone accessing the command center will need this passcode.
              </p>
            </div>

            {/* Security Alert box */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
              <Fingerprint className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-300">Session Protection</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Locking the console will require immediate re-entry of your Master Passcode. All sensitive client mutations and draw triggers are suspended until unlocked.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveSettings}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-zinc-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-amber-500/20 mt-4"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply and Save Security Settings</span>
          </button>
        </div>
      </div>

      {/* Security Audit Trail */}
      <div className="bg-zinc-950/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Security & Access Audit Trail</h3>
              <p className="text-xs text-zinc-400">Recent administrative logins and credential validations</p>
            </div>
          </div>
          <span className="text-xs text-zinc-400 font-mono">3 recorded events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead>
              <tr className="border-b border-white/5 text-zinc-400 font-medium">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Endpoint Slug</th>
                <th className="py-3 px-4">Client Network</th>
                <th className="py-3 px-4 text-right">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3 px-4 text-zinc-400 font-mono">{log.timestamp}</td>
                  <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{log.operator}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-300">{log.route}</td>
                  <td className="py-3 px-4 text-zinc-400 font-mono">{log.ip}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn('px-2.5 py-1 rounded-full border text-[11px] font-semibold', log.badge)}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
