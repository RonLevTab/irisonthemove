import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollToTopOnRoute } from "@/components/layout/ScrollToTopOnRoute";
import { PhotoLightboxProvider } from "@/components/ui/PhotoLightbox";
import { getSiteConfig } from "@/lib/content";
import { platformOsScript } from "@/lib/platformOsScript";
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
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon-32x32.png",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: {
      title: site.title,
    },
  };
}

/** Explicit 1:1 device scale so Safari (and other browsers) lay out at “100%” zoom by default. */
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

  // Font variable classes live on <body> so next/font hashes don’t hydration-warn on <html>.
  return (
    <html lang="en" className="h-full">
      <body
        className={`${dmSans.variable} ${fontCormorant.variable} ${fontLogoScript.variable} ${fontBrandSubtitle.variable} flex min-h-full flex-col font-sans antialiased`}
        data-deploy-sha={process.env.VERCEL_GIT_COMMIT_SHA ?? "local"}
      >
        <Script
          id="platform-os"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: platformOsScript }}
        />
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
