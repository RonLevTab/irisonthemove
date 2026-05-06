"use client";

import { useEffect } from "react";

import { isDesktopFinePointerMinMd } from "@/lib/desktopVideoBandwidthMode";
import { getWorkPortfolioVideoPreloadHrefs } from "@/lib/workPortfolioVideoPreloadHrefs";

/**
 * My Work opent: preload hints voor de eerste zichtbare set; de rest laadt pas op scroll.
 * Laptop: max 1 hint zodat bandbreedte niet meteen zes routes deelt met portfolio-clips.
 */
export function WorkRouteVideoPreload() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const hrefs = getWorkPortfolioVideoPreloadHrefs();
    const maxHints = isDesktopFinePointerMinMd() ? 1 : 3;

    hrefs.forEach((href, i) => {
      if (i >= maxHints) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = href;
      link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      for (const link of links) link.remove();
    };
  }, []);

  return null;
}
