"use client";

import { useLayoutEffect } from "react";

import homepage from "@/content/homepage.json";
import { withAssetPath } from "@/lib/assetPath";
import { stripVideoMediaFragment } from "@/lib/stripVideoMediaFragment";

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

  const hrefs = new Set<string>();
  for (const r of homepage.socialProof.reels) {
    const href = withAssetPath(stripVideoMediaFragment(r.videoSrc));
    if (href) hrefs.add(href);
  }

  let i = 0;
  for (const href of hrefs) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = href;
    if (i < 2) link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    i += 1;
  }
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
