import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  /** Many browsers still request `/favicon.ico` first; serve our PNG so tabs/bookmarks don’t fall back to an old/cached .ico. */
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/favicon-32x32.png" }];
  },
  /**
   * Static assets under `public/` are served by the CDN and must not be copied into every
   * serverless function bundle. Tracing them (via layout importing all content JSON with asset
   * paths) pushed `_not-found` over Vercel’s 300MB limit (~583MB with videos + images).
   */
  outputFileTracingExcludes: {
    "*": ["public/videos/**/*", "public/images/**/*"],
  },
};

export default nextConfig;
