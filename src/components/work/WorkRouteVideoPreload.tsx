"use client";

import { useEffect } from "react";

import { getWorkPortfolioVideoPreloadHrefs } from "@/lib/workPortfolioVideoPreloadHrefs";

/**
 * My Work opent: preload hints voor alle portfolio-MP4’s (naast `preload="auto"` op de tags).
 */
export function WorkRouteVideoPreload() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const hrefs = getWorkPortfolioVideoPreloadHrefs();

    hrefs.forEach((href, i) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = href;
      if (i < 4) link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      for (const link of links) link.remove();
    };
  }, []);

  return null;
}
