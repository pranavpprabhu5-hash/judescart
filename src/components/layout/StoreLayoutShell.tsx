'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SlideOverCart } from '@/components/cart/SlideOverCart';
import { ProfileDrawer } from '@/components/layout/ProfileDrawer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { LuckyDrawModal } from '@/components/luckydraw/LuckyDrawModal';
import { FloatingLuckyDrawCTA } from '@/components/luckydraw/FloatingLuckyDrawCTA';
import { ProductQuickViewModal } from '@/components/product/ProductQuickViewModal';
import { DailyMysteryBoxModal } from '@/components/luckydraw/DailyMysteryBoxModal';
import { ProductComparisonDrawer } from '@/components/product/ProductComparisonDrawer';
import { CurrencyLocationBanner } from '@/components/layout/CurrencyLocationBanner';
import { JudesAIWidget } from '@/components/ai/JudesAIWidget';
import { InstallPwaPrompt } from '@/components/ui/InstallPwaPrompt';
import { CustomerAuthModal } from '@/components/auth/CustomerAuthModal';
import { WelcomeAuthPrompt } from '@/components/auth/WelcomeAuthPrompt';

export function StoreLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="min-h-screen flex flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <SlideOverCart />
      <ProfileDrawer />
      <CustomerAuthModal />
      <WelcomeAuthPrompt />
      <SearchOverlay />
      <LuckyDrawModal />
      <FloatingLuckyDrawCTA />
      <JudesAIWidget />
      <ProductQuickViewModal />
      <DailyMysteryBoxModal />
      <ProductComparisonDrawer />
      <CurrencyLocationBanner />
      <InstallPwaPrompt />
    </>
  );
}
