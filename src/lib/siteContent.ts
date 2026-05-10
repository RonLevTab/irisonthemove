import { cache } from "react";

import siteData from "@/content/site.json";
import type { SiteConfig } from "@/types/content";

const site = siteData as SiteConfig;

/**
 * Where Formspree delivers notification emails is set in their dashboard for each form ID, not via this repo.
 *
 * Optionally set `NEXT_PUBLIC_FORMSPREE_FORM_ID` in Vercel (or `.env.local`) when you rotate the form.
 */
export function resolveFormspreeFormId(siteFormspreeId: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
  if (fromEnv) return fromEnv;
  return siteFormspreeId;
}

/** Site-wide config only — avoids pulling every JSON file into the root layout bundle. */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => site);
