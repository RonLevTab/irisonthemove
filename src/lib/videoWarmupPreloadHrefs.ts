import homepage from "@/content/homepage.json";
import workPage from "@/content/work-page.json";

import { withAssetPath } from "@/lib/assetPath";
import { stripVideoMediaFragment } from "@/lib/stripVideoMediaFragment";

function normalizeVideoHref(raw: string): string {
  return withAssetPath(stripVideoMediaFragment(raw.trim()));
}

function pushUnique(out: string[], seen: Set<string>, raw: string) {
  const h = normalizeVideoHref(raw);
  if (!h || seen.has(h)) return;
  seen.add(h);
  out.push(h);
}

/**
 * Portfolio-workpagina (`/work`): restaurants → hotels → travel bovenste rij (3) → onderste rij (3).
 * Zelfde URL’s maar niet dubbel in de array ( eerste positie telt).
 */
export function getWorkOnlyVideoWarmupPreloadHrefs(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  const restaurants = workPage.categories.find((c) => c.id === "restaurants");
  if (restaurants?.tripleVideos) {
    for (const t of restaurants.tripleVideos) pushUnique(out, seen, t.videoSrc);
  }

  const hotels = workPage.categories.find((c) => c.id === "hotels");
  if (hotels?.tripleVideos) {
    for (const t of hotels.tripleVideos) pushUnique(out, seen, t.videoSrc);
  }

  const travel = workPage.categories.find((c) => c.id === "travel");
  const grid = travel?.travelGridVideos;
  if (Array.isArray(grid) && grid.length > 0) {
    const top = grid.slice(0, 3);
    const bottom = grid.slice(3, 6);
    for (const v of top) pushUnique(out, seen, v.videoSrc);
    for (const v of bottom) pushUnique(out, seen, v.videoSrc);
  }

  return out;
}

/**
 * Eerste bezoek / layout-warmup: eerst 6 homepage-reels, daarna dezelfde
 * work-volgorde als {@link getWorkOnlyVideoWarmupPreloadHrefs}.
 */
export function getFullSiteVideoWarmupPreloadHrefs(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const r of homepage.socialProof.reels) {
    pushUnique(out, seen, r.videoSrc);
  }

  for (const h of getWorkOnlyVideoWarmupPreloadHrefs()) {
    pushUnique(out, seen, h);
  }

  return out;
}
