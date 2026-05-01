import { cache } from "react";

import blogPostsData from "@/content/blog-posts.json";
import destinationRegionsData from "@/content/destination-regions.json";
import destinationsGalleryData from "@/content/destinations-gallery.json";
import destinationsData from "@/content/destinations.json";
import homepageData from "@/content/homepage.json";
import siteData from "@/content/site.json";
import travelGuidesData from "@/content/travel-guides.json";
import aboutPageData from "@/content/about-page.json";
import workPageData from "@/content/work-page.json";
import type {
  BlogPost,
  Destination,
  HomepageContent,
  SiteConfig,
  TravelGuide,
  AboutPageContent,
  DestinationGalleryContent,
  DestinationRegionsExplorer,
  WorkPageContent,
} from "@/types/content";

const site = siteData as SiteConfig;
const homepage = homepageData as HomepageContent;
const aboutPage = aboutPageData as AboutPageContent;
const workPage = workPageData as WorkPageContent;
const destinationsGallery = destinationsGalleryData as DestinationGalleryContent;
const destinationRegionsExplorer =
  destinationRegionsData as DestinationRegionsExplorer;
const destinations = destinationsData as Destination[];
const blogPosts = [...(blogPostsData as BlogPost[])].sort((a, b) =>
  b.date.localeCompare(a.date),
);
const travelGuides = travelGuidesData as TravelGuide[];

export const getSiteConfig = cache(async (): Promise<SiteConfig> => site);

export const getHomepageContent = cache(
  async (): Promise<HomepageContent> => homepage,
);

export const getAboutPageContent = cache(
  async (): Promise<AboutPageContent> => aboutPage,
);

export const getWorkPageContent = cache(
  async (): Promise<WorkPageContent> => workPage,
);

export const getDestinations = cache(
  async (): Promise<Destination[]> => destinations,
);

export const getDestinationRegionsExplorer = cache(
  async (): Promise<DestinationRegionsExplorer> => destinationRegionsExplorer,
);

export const getDestinationsGallery = cache(
  async (): Promise<DestinationGalleryContent> => destinationsGallery,
);

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => blogPosts);

export const getTravelGuides = cache(
  async (): Promise<TravelGuide[]> => travelGuides,
);

export const getDestinationsByCountry = cache(
  async (country: string): Promise<Destination[]> =>
    destinations.filter((destination) => destination.country === country),
);

export const getDestinationBySlug = cache(
  async (slug: string): Promise<Destination | undefined> =>
    destinations.find((destination) => destination.slug === slug),
);

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | undefined> =>
    blogPosts.find((post) => post.slug === slug),
);

export const getTravelGuideBySlug = cache(
  async (slug: string): Promise<TravelGuide | undefined> =>
    travelGuides.find((guide) => guide.slug === slug),
);
