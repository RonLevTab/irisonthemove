import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getHomepageContent } from "@/lib/homepageContent";
import { getSiteConfig } from "@/lib/siteContent";

/** Match globals.css --color-primary */
const PRIMARY = "#5a2d32";
const HEADER_BG = "#faf4ed";

/** Same families as `src/lib/brandFonts.ts` (Google Fonts, TTF). */
const FONT_URLS = {
  castoro:
    "https://fonts.gstatic.com/s/castorotitling/v10/buEupouwccj03leTfjUAhEZWlrNqYg.ttf",
  cormorantItalic500:
    "https://fonts.gstatic.com/s/cormorant/v24/H4c0BXOCl9bbnla_nHIq6oGzilJm9otsA9kQmfdq6A.ttf",
  monsieur:
    "https://fonts.gstatic.com/s/monsieurladoulaise/v20/_Xmz-GY4rjmCbQfc-aPRaa4pqV340p7EZl5e.ttf",
} as const;

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
  const [site, home] = await Promise.all([getSiteConfig(), getHomepageContent()]);

  const bgBuf = await loadPublicImageBytes(home.hero.backgroundImage);
  const bgDataUrl = `data:image/jpeg;base64,${bgBuf.toString("base64")}`;

  const [castoro, cormorantItalic, monsieur] = await Promise.all([
    fetch(FONT_URLS.castoro).then((r) => r.arrayBuffer()),
    fetch(FONT_URLS.cormorantItalic500).then((r) => r.arrayBuffer()),
    fetch(FONT_URLS.monsieur).then((r) => r.arrayBuffer()),
  ]);

  const taglineLines = home.hero.tagline
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const taglineShort =
    taglineLines.length >= 2
      ? `${taglineLines[0]} ${taglineLines[1]}`
      : (taglineLines[0] ?? site.tagline.replace(/\n/g, " "));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: HEADER_BG,
        }}
      >
        {/* Top bar — same feel as nav / wordmark row */}
        <div
          style={{
            width: "100%",
            height: 132,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 44,
            paddingRight: 44,
            backgroundColor: HEADER_BG,
            borderBottom: `1px solid rgba(90, 45, 50, 0.1)`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "Monsieur La Doulaise",
                fontSize: 58,
                color: PRIMARY,
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
              }}
            >
              Iris
            </span>
            <span
              style={{
                fontFamily: "Castoro Titling",
                fontSize: 13,
                fontWeight: 400,
                color: PRIMARY,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: 4,
                opacity: 0.95,
              }}
            >
              ON THE MOVE
            </span>
          </div>
          <span
            style={{
              fontFamily: "Cormorant",
              fontSize: 22,
              fontStyle: "italic",
              fontWeight: 500,
              color: PRIMARY,
              maxWidth: 520,
              textAlign: "right",
              lineHeight: 1.25,
              opacity: 0.9,
            }}
          >
            {home.hero.eyebrow}
          </span>
        </div>

        {/* Hero photo — same asset as homepage hero background */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            width: "100%",
            minHeight: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgDataUrl}
            alt=""
            width={1200}
            height={498}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "30% center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(250,244,237,0.42) 0%, transparent 32%, transparent 58%, rgba(58,36,32,0.12) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 36,
              transform: "translateX(-50%)",
              display: "flex",
              maxWidth: 920,
              padding: "18px 28px",
              backgroundColor: "rgba(255,255,255,0.94)",
              borderRadius: 14,
              boxShadow: "0 12px 40px rgba(58,36,32,0.12)",
            }}
          >
            <span
              style={{
                fontFamily: "Cormorant",
                fontSize: 26,
                fontStyle: "italic",
                fontWeight: 500,
                color: PRIMARY,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              &#x201C;{taglineShort}&#x201D;
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Castoro Titling", data: castoro, weight: 400, style: "normal" },
        { name: "Cormorant", data: cormorantItalic, weight: 500, style: "italic" },
        { name: "Monsieur La Doulaise", data: monsieur, weight: 400, style: "normal" },
      ],
    },
  );
}
