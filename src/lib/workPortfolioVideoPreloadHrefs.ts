import workPage from "@/content/work-page.json";

import { withAssetPath } from "@/lib/assetPath";
import { stripVideoMediaFragment } from "@/lib/stripVideoMediaFragment";

/** Absoluut pad voor `<link rel="preload" as="video">` — zelfde URL als `<video src>` (incl. `?v=`). */
export function getWorkPortfolioVideoPreloadHrefs(): string[] {
  const urls = new Set<string>();

  for (const cat of workPage.categories) {
    const triple = cat.tripleVideos;
    if (Array.isArray(triple)) {
      for (const entry of triple) {
        if (
          entry &&
          typeof entry === "object" &&
          "videoSrc" in entry &&
          typeof (entry as { videoSrc: string }).videoSrc === "string"
        ) {
          const raw = (entry as { videoSrc: string }).videoSrc;
          const href = withAssetPath(stripVideoMediaFragment(raw));
          if (href) urls.add(href);
        }
      }
    }
    const grid = cat.travelGridVideos;
    if (Array.isArray(grid)) {
      for (const entry of grid) {
        if (
          entry &&
          typeof entry === "object" &&
          "videoSrc" in entry &&
          typeof (entry as { videoSrc: string }).videoSrc === "string"
        ) {
          const href = withAssetPath(
            stripVideoMediaFragment((entry as { videoSrc: string }).videoSrc),
          );
          if (href) urls.add(href);
        }
      }
    }
  }

  return Array.from(urls);
}

/** Eerste travel-grid clip (/work Travel guides), voor gerichte preload op desktop. */
export function getFirstTravelGridVideoPreloadHref(): string | null {
  for (const cat of workPage.categories) {
    const grid = cat.travelGridVideos;
    if (!Array.isArray(grid) || grid.length === 0) continue;
    for (const entry of grid) {
      if (
        entry &&
        typeof entry === "object" &&
        "videoSrc" in entry &&
        typeof (entry as { videoSrc: string }).videoSrc === "string"
      ) {
        const raw = (entry as { videoSrc: string }).videoSrc.trim();
        if (!raw) continue;
        return withAssetPath(stripVideoMediaFragment(raw));
      }
    }
  }
  return null;
}
