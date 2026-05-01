import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getSiteConfig } from "@/lib/content";
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
      images: [
        {
          url: site.seo.ogImage,
          width: 1600,
          height: 1000,
          alt: site.title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [site.seo.ogImage],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteConfig();

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${fontCormorant.variable} ${fontLogoScript.variable} ${fontBrandSubtitle.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Navbar
          instagramUrl={site.socialLinks.instagram}
          tiktokUrl={site.socialLinks.tiktok}
          email={site.email}
        />
        <main className="page-shell">{children}</main>
        <Footer
          instagramUrl={site.socialLinks.instagram}
          tiktokUrl={site.socialLinks.tiktok}
          email={site.email}
        />
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
