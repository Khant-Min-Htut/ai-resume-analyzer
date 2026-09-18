import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  productionBrowserSourceMaps: false,

  compress: true,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
