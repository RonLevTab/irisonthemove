import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTopOnRoute } from "@/components/layout/ScrollToTopOnRoute";
import { VideoEngagementWarmup } from "@/components/layout/VideoEngagementWarmup";
import { WebsiteVisitTracker } from "@/components/layout/WebsiteVisitTracker";
import { PhotoLightboxProvider } from "@/components/ui/PhotoLightbox";
import { getSiteConfig } from "@/lib/siteContent";
import {
  fontBrandSubtitle,
  fontCormorant,
  fontLogoScript,
} from "@/lib/brandFonts";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const iconVersion = "20260505h";
  const socialImage = "/opengraph-image";

  return {
    metadataBase: new URL(site.seo.siteUrl),
    title: {
      default: site.title,
      template: `%s | ${site.title}`,
    },
    description: site.description,
    keywords: [
      "travel influencer",
      "luxury travel",
      "solo female travel",
      "Europe travel",
      "travel collaborations",
      "travel content creator",
    ],
    openGraph: {
      title: site.title,
      description: site.description,
      url: site.seo.siteUrl,
      siteName: site.title,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "Iris On The Move — cinematic travel storytelling",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [socialImage],
    },
    /**
     * Explicit favicon links so tabs, bookmarks, and “Add to Home Screen” match the brand mark
     * from `public/images/site/favicon-source.svg` (regenerate PNGs: `npm run generate:favicons`).
     */
    icons: {
      /** PNG/ICO first for aggressive Safari/iOS favicon caches. */
      icon: [
        { url: `/favicon.ico?v=${iconVersion}` },
        { url: `/logo-icon-32x32.png?v=${iconVersion}`, sizes: "32x32", type: "image/png" },
        { url: `/logo-icon-16x16.png?v=${iconVersion}`, sizes: "16x16", type: "image/png" },
        { url: `/logo-icon.svg?v=${iconVersion}`, type: "image/svg+xml" },
        { url: `/favicon.svg?v=${iconVersion}`, type: "image/svg+xml" },
      ],
      shortcut: `/favicon.ico?v=${iconVersion}`,
      apple: [
        { url: `/apple-touch-icon.png?v=${iconVersion}`, sizes: "180x180", type: "image/png" },
        { url: `/apple-touch-icon-167x167.png?v=${iconVersion}`, sizes: "167x167", type: "image/png" },
        { url: `/apple-touch-icon-152x152.png?v=${iconVersion}`, sizes: "152x152", type: "image/png" },
        { url: `/apple-touch-icon-120x120.png?v=${iconVersion}`, sizes: "120x120", type: "image/png" },
      ],
      other: [
        { rel: "mask-icon", url: `/logo-icon.svg?v=${iconVersion}`, color: "#5a2d32" },
        { rel: "apple-touch-icon-precomposed", url: `/apple-touch-icon-precomposed.png?v=${iconVersion}` },
      ],
    },
    manifest: `/site.webmanifest?v=${iconVersion}`,
    appleWebApp: {
      title: site.title,
    },
  };
}

/**
 * Device-width layout; `globals.css` applies `html { zoom: 0.9 }` so the whole UI matches ~90%
 * browser zoom consistently without changing initial viewport scale (avoids stacking with CSS zoom).
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteConfig();

  // Font variable classes live on <body>. suppressHydrationWarning on the roots covers
  // extensions that touch the document before React loads and rare next/font dev drift.
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${fontCormorant.variable} ${fontLogoScript.variable} ${fontBrandSubtitle.variable} flex min-h-full flex-col font-sans antialiased`}
        data-deploy-sha={process.env.VERCEL_GIT_COMMIT_SHA ?? "local"}
        suppressHydrationWarning
      >
        <PhotoLightboxProvider>
          <WebsiteVisitTracker />
          <VideoEngagementWarmup />
          <Navbar
            instagramUrl={site.socialLinks.instagram}
            tiktokUrl={site.socialLinks.tiktok}
            email={site.email}
          />
          <ScrollToTopOnRoute />
          <main className="page-shell">{children}</main>
          <Footer
            instagramUrl={site.socialLinks.instagram}
            tiktokUrl={site.socialLinks.tiktok}
            email={site.email}
          />
        </PhotoLightboxProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: site.title,
                  url: site.seo.siteUrl,
                  description: site.description,
                },
                {
                  "@type": "Person",
                  name: site.title,
                  alternateName: site.name,
                  description: site.description,
                  email: site.email,
                  sameAs: [
                    site.socialLinks.instagram,
                    site.socialLinks.tiktok,
                  ],
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
