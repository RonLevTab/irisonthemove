import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/siteContent";

const HEADER_BG = "#faf4ed";

export const runtime = "nodejs";

export const alt = "Iris On The Move — cinematic travel storytelling";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

async function loadPublicImageBytes(publicRelPath: string): Promise<Buffer> {
  const key = publicRelPath.replace(/^\//, "");
  const isProductionBuild =
    process.env.NEXT_PHASE === "phase-production-build";

  /** Dev and `next build` — file is on disk; avoids fetch during static generation. */
  if (process.env.NODE_ENV === "development" || isProductionBuild) {
    return readFile(path.join(process.cwd(), "public", key));
  }

  /**
   * Production / Vercel: hero JPEG is a static asset — fetch from this deployment so the OG
   * route does not need `public/` files inside the Node function bundle.
   */
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : new URL((await getSiteConfig()).seo.siteUrl).origin;
  const res = await fetch(`${origin}/${key}`);
  if (!res.ok) {
    throw new Error(`OpenGraph hero fetch failed (${res.status}): ${origin}/${key}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

export default async function OpenGraphImage() {
  const logoBuf = await loadPublicImageBytes("/logo-icon.svg");
  const logoDataUrl = `data:image/svg+xml;base64,${logoBuf.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: HEADER_BG,
        }}
      >
        <img
          src={logoDataUrl}
          alt="Iris On The Move logo"
          width={420}
          height={420}
          style={{
            width: 420,
            height: 420,
            objectFit: "contain",
          }}
        />
      </div>
    ),
    size,
  );
}
