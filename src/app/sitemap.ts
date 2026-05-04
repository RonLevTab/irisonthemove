import type { MetadataRoute } from "next";

import { getBlogPosts, getDestinations, getTravelGuides } from "@/lib/content";
import { getSiteConfig } from "@/lib/siteContent";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, destinations, posts, guides] = await Promise.all([
    getSiteConfig(),
    getDestinations(),
    getBlogPosts(),
    getTravelGuides(),
  ]);
  const staticRoutes = [
    "",
    "/work",
    "/about",
    "/destinations",
    "/blog",
    "/travel-guides",
    "/contact",
  ];

  const staticEntries = staticRoutes.map((route) => ({
    url: `${site.seo.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  })) satisfies MetadataRoute.Sitemap;

  const destinationEntries = destinations.map((destination) => ({
    url: `${site.seo.siteUrl}/destinations/${destination.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogEntries = posts.map((post) => ({
    url: `${site.seo.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guideEntries = guides.map((guide) => ({
    url: `${site.seo.siteUrl}/travel-guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  return [...staticEntries, ...destinationEntries, ...blogEntries, ...guideEntries];
}
