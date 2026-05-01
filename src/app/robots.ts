import type { MetadataRoute } from "next";

import { getSiteConfig } from "@/lib/content";

export const dynamic = "force-static";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteConfig();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.seo.siteUrl}/sitemap.xml`,
    host: site.seo.siteUrl,
  };
}
