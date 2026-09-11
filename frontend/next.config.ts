import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for catching issues early (dev only)
  reactStrictMode: true,

  // Optimize production builds
  productionBrowserSourceMaps: false,

  // Compress responses
  compress: true,

  // Optimize external images (if any are added later)
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental performance features
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
