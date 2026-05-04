import { cache } from "react";

import siteData from "@/content/site.json";
import type { SiteConfig } from "@/types/content";

const site = siteData as SiteConfig;

/** Site-wide config only — avoids pulling every JSON file into the root layout bundle. */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => site);
