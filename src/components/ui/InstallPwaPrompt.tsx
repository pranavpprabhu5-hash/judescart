'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, Share, PlusSquare, Sparkles, Smartphone, CheckCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallPwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    }

    // 2. Check if already in standalone mode (already installed)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafariBrowser = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    const isIosSafari = isIosDevice && isSafariBrowser;
    setIsIOS(isIosSafari);

    // 4. Check dismissal in localStorage
    const dismissedAt = localStorage.getItem('judescart_pwa_dismissed_at');
    const isRecentlyDismissed =
      dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 7 * 24 * 60 * 60 * 1000;

    // 5. Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      if (!isRecentlyDismissed) {
        // Delay showing banner slightly for smooth UX
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 2500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS Safari and not dismissed, show banner after delay
    if (isIosSafari && !isRecentlyDismissed) {
      setIsInstallable(true);
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3500);
      return () => clearTimeout(timer);
    }

    // 6. Listen for app installed event
    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      setTimeout(() => setInstalledSuccess(false), 5000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 7. Listen for custom trigger from anywhere (e.g. Footer or Header)
    const handleTriggerPwa = () => {
      if (isIosSafari) {
        setShowIOSModal(true);
      } else if (deferredPrompt) {
        deferredPrompt.prompt();
      } else {
        setShowBanner(true);
      }
    };

    window.addEventListener('open-pwa-install', handleTriggerPwa);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-pwa-install', handleTriggerPwa);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      setShowBanner(false);
      return;
    }

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
        setDeferredPrompt(null);
      }
    } else {
      // Fallback instruction
      alert('To install JudesCart, tap your browser menu (⋮) and select "Install app" or "Add to Home Screen".');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('judescart_pwa_dismissed_at', Date.now().toString());
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Toast upon successful installation */}
      {installedSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">JudesCart installed successfully!</span>
        </div>
      )}

      {/* Floating PWA Install Banner */}
      {showBanner && (
        <div
          role="region"
          aria-label="Install JudesCart application"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white/95 dark:bg-[#0C192E]/95 backdrop-blur-xl border border-slate-200 dark:border-blue-900/60 rounded-2xl shadow-2xl p-4 transition-all duration-300 animate-in slide-in-from-bottom-6"
        >
          <div className="flex items-start gap-3.5">
            {/* App Icon */}
            <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden shadow-md border border-slate-200/80 dark:border-blue-800/60 bg-white dark:bg-[#070F1E] flex items-center justify-center p-1">
              <Image
                src="/icons/icon-192.png"
                alt="JudesCart App Icon"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            {/* Information */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0066FF] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> PWA Ready
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                Install JudesCart App
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                Instant loading, lightning-fast shopping & offline catalog browsing on your home screen.
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  aria-label="Dismiss install prompt"
                  className="px-2.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-blue-950/60 transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>

            {/* Dismiss Cross */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close install prompt"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0D1B2A] border border-slate-200 dark:border-blue-900/60 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-slate-900 dark:text-white relative">
            <button
              onClick={() => setShowIOSModal(false)}
              aria-label="Close instructions"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0066FF] p-2 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Image
                  src="/icons/icon-192.png"
                  alt="JudesCart App"
                  width={40}
                  height={40}
                  className="object-contain rounded-xl"
                />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Install JudesCart
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add to your iPhone / iPad Home Screen
                </p>
              </div>
            </div>

            <div className="space-y-4 my-5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3 bg-slate-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-slate-100 dark:border-blue-900/40">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-[#0066FF] flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Tap the Share button
                  </span>
                  Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> icon at the bottom of Safari.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-slate-100 dark:border-blue-900/40">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-[#0066FF] flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Add to Home Screen
                  </span>
                  Scroll down the menu and tap <strong className="text-slate-900 dark:text-white font-semibold">Add to Home Screen</strong> with the <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-blue-500" /> icon.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-slate-100 dark:border-blue-900/40">
                <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-[#0066FF] flex items-center justify-center shrink-0 font-bold">
                  3
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-slate-900 dark:text-white block">
                    Confirm Installation
                  </span>
                  Tap <strong className="text-blue-500 font-semibold">Add</strong> in the top right corner. You’re all set!
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
