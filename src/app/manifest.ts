import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JudesCart | Shop More. Live Better.',
    short_name: 'JudesCart',
    description:
      'Shop top-rated electronics, fashion, home essentials, and lifestyle products with lightning-fast delivery at JudesCart.',
    start_url: '/',
    display: 'standalone',
    background_color: '#070F1E',
    theme_color: '#0066FF',
    orientation: 'portrait-primary',
    categories: ['shopping', 'ecommerce', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/maskable-icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Explore Deals',
        short_name: 'Deals',
        description: 'Browse top trending deals',
        url: '/#deals',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Shopping Cart',
        short_name: 'Cart',
        description: 'View your cart',
        url: '/#cart',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
