/**
 * ==============================================================================
 * NEXT.JS CONFIGURATION - SHETA (ሽታ) PERFUMES
 * ==============================================================================
 * CodeOps Day 43 Performance & Remote Host Configuration:
 * - images.remotePatterns: Explicitly allow trusted image hosts (Unsplash)
 *   to eliminate unauthorized external asset loads and optimize responsive sizes.
 * - reactStrictMode: Enforces React best practices and lifecycle hygiene.
 * ==============================================================================
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    // High-efficiency modern formats
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
