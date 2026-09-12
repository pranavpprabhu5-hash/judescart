import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { StoreLayoutShell } from '@/components/layout/StoreLayoutShell';

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
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/logo-icon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/logo-icon.png' },
    ],
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
    <html lang="en" className={`${inter.variable} ${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/logo-icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('judescart_theme');
                  // Default to light mode; only activate dark mode if user explicitly saved 'dark'
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F8FAFC] dark:bg-[#070F1E] text-slate-900 dark:text-slate-100 selection:bg-[#0066FF] selection:text-white transition-colors duration-200">
        <StoreProvider>
          <StoreLayoutShell>{children}</StoreLayoutShell>
        </StoreProvider>
      </body>
    </html>
  );
}
