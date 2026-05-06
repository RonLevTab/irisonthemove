import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  /** Kleinere JS-importen voor veel gebruikte packages (tree-shake vriendelijker). */
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    /** Lang cache op CDN voor geoptimaliseerde `/ _next/image` — sneller bij tweede bezoek. */
    minimumCacheTTL: 60 * 60 * 24 * 31,
    deviceSizes: [640, 750, 828, 1080, 1200, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
  /**
   * Live (Vercel): agressieve cache op het CDN voor `public/videos` en `public/images`.
   * Eerste bezoek blijft netwerk-limited; tweede bezoek en edge-hits zijn veel sneller — dichter bij localhost.
   * Nieuwe MP4 zonder andere URL: bump `?v=` in JSON zodat browsers/CDN het juiste bestand halen.
   */
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=604800, s-maxage=31536000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=2592000, s-maxage=31536000, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
