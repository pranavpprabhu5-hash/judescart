import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
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

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JudesCart | Shop More. Live Better. - All Products Superstore',
  description:
    'Shop all products at JudesCart. Discover top-rated electronics, tech gear, premium apparel, footwear, leather goods, smart home essentials, and beauty items.',
  keywords: ['JudesCart', 'online shopping', 'electronics', 'fashion', 'home goods', 'all products'],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'JudesCart | Shop More. Live Better.',
    description: 'The all-in-one destination for electronics, fashion, home essentials, and lifestyle products.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F8FAFC] text-slate-900 selection:bg-[#0066FF] selection:text-white">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SlideOverCart />
          <ProfileDrawer />
          <SearchOverlay />
          <LuckyDrawModal />
          <FloatingLuckyDrawCTA />
          <ProductQuickViewModal />
          <DailyMysteryBoxModal />
          <ProductComparisonDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
