"use client";

import { useEffect } from "react";

import { isDesktopFinePointerMinMd } from "@/lib/desktopVideoBandwidthMode";
import {
  getFirstTravelGridVideoPreloadHref,
  getWorkPortfolioVideoPreloadHrefs,
} from "@/lib/workPortfolioVideoPreloadHrefs";

/**
 * My Work opent: preload hints voor de eerste zichtbare set; de rest laadt pas op scroll.
 * Laptop: 1 × eerste portfolio-reel + 1 × eerste travel guide (anders blijven die 6 zwaar onderaan koud starten).
 * Mobiel: max 3 hints zoals eerder.
 */
export function WorkRouteVideoPreload() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const allHrefs = getWorkPortfolioVideoPreloadHrefs();
    const saveDesktop = isDesktopFinePointerMinMd();

    const hrefsToHint: string[] = [];
    if (saveDesktop) {
      const first = allHrefs[0];
      const travelLead = getFirstTravelGridVideoPreloadHref();
      if (first) hrefsToHint.push(first);
      if (travelLead && travelLead !== first) hrefsToHint.push(travelLead);
    } else {
      for (let i = 0; i < Math.min(3, allHrefs.length); i++) {
        hrefsToHint.push(allHrefs[i]);
      }
    }

    hrefsToHint.forEach((href) => {
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
