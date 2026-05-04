import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  /**
   * Static assets under `public/` are served by the CDN and must not be copied into every
   * serverless function bundle. Tracing them (via layout importing all content JSON with asset
   * paths) pushed `_not-found` over Vercel’s 300MB limit (~583MB with videos + images).
   */
  outputFileTracingExcludes: {
    "*": ["public/videos/**/*", "public/images/**/*"],
  },
  /** Browsers vragen standaard `/favicon.ico`; zonder eigen .ico toont Vercel het zwarte driehoekje. */
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/favicon-32x32.png",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
