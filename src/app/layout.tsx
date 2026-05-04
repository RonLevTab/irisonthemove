import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTopOnRoute } from "@/components/layout/ScrollToTopOnRoute";
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
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
    },
    /**
     * Explicit favicon links so tabs, bookmarks, and “Add to Home Screen” match the brand mark
     * from `public/images/site/favicon-source.svg` (regenerate PNGs: `npm run generate:favicons`).
     */
    icons: {
      /** PNG first — some Safari versions pick the first `icon` for the tab; SVG is a sharp fallback. */
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon-32x32.png",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
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
