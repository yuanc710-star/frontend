import type { NextConfig } from "next";

// Optional BFF origin. When set, /auth/*, /api/* and /v1/* are proxied to the BFF so
// the browser stays same-origin (cookies/session) while the BFF handles Google sign-in.
const BFF_URL = process.env.BFF_URL;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js 16 uses Turbopack by default for dev and build (Webpack-compatible,
  // Rust-based). No separate bundler (Vite/Webpack) config is required.
  async rewrites() {
    // beforeFiles → proxy to the BFF *before* local routes (so the real BFF
    // overrides the dev-only /auth/login stand-in once BFF_URL is configured).
    return {
      beforeFiles: BFF_URL
        ? [
            { source: "/auth/:path*", destination: `${BFF_URL}/auth/:path*` },
            { source: "/api/:path*", destination: `${BFF_URL}/api/:path*` },
            { source: "/v1/:path*", destination: `${BFF_URL}/v1/:path*` },
          ]
        : [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
