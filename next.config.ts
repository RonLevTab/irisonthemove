import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: process.cwd(),
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
