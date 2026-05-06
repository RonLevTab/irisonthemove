"use client";

import { useLayoutEffect } from "react";

import { getFullSiteVideoWarmupPreloadHrefs } from "@/lib/videoWarmupPreloadHrefs";
import { withAssetPath } from "@/lib/assetPath";

const PREFETCH_ROUTES = ["/work", "/contact"] as const;

function injectRoutePrefetchLinks() {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const origin = window.location.origin;
  for (const path of PREFETCH_ROUTES) {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = `${origin}${withAssetPath(path)}`;
    document.head.appendChild(link);
  }
}

function injectVideoPreloadLinks() {
  if (typeof document === "undefined") return;

  /**
   * Volgorde: 6× homepage reels → 3 restaurants → 3 hotels → 3 travel (boven) → 3 travel (onder).
   * Eerste zes hints krijgen `fetchpriority=high` zodat die MP4’s voorrang krijgen op de rest.
   */
  const hrefs = getFullSiteVideoWarmupPreloadHrefs();

  hrefs.forEach((href, i) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = href;
    if (i < 6) link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
  });
}

/**
 * Meteen bij binnenkomst op de site (eerste paint): video-preloads + route-prefetch,
 * parallel met dezelfde URL’s als in JSON (inclusief `?v=`).
 */
export function VideoEngagementWarmup() {
  useLayoutEffect(() => {
    injectRoutePrefetchLinks();
    injectVideoPreloadLinks();
  }, []);

  return null;
}
