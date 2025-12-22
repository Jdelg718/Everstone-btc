import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // optimizeCss: true, // Requires 'critters' package
  },
  images: {
    unoptimized: true, // Simplify Docker image handling significantly
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all images for user convenience
      },
    ],
  },
};

export default nextConfig;
