import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/command-center', destination: '/portal' },
      { source: '/judes-hq', destination: '/portal' },
      { source: '/control-room', destination: '/portal' },
      { source: '/hq', destination: '/portal' },
      { source: '/console', destination: '/portal' },
    ];
  },
};

export default nextConfig;
