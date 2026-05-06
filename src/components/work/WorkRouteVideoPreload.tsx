"use client";

import { useEffect } from "react";

import { getWorkPortfolioVideoPreloadHrefs } from "@/lib/workPortfolioVideoPreloadHrefs";

/**
 * My Work opent: preload hints voor de eerste zichtbare set; de rest laadt pas op scroll.
 */
export function WorkRouteVideoPreload() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const hrefs = getWorkPortfolioVideoPreloadHrefs();

    hrefs.forEach((href, i) => {
      if (i >= 3) return;
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
