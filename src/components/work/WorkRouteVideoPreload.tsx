"use client";

import { useEffect } from "react";

import { getWorkOnlyVideoWarmupPreloadHrefs } from "@/lib/videoWarmupPreloadHrefs";

/**
 * My Work opent: preload hints in vaste volgorde — restaurants, hotels, travel rij 1, rij 2.
 */
export function WorkRouteVideoPreload() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    const hrefs = getWorkOnlyVideoWarmupPreloadHrefs();

    hrefs.forEach((href, i) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = href;
      if (i < 6) link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      for (const link of links) link.remove();
    };
  }, []);

  return null;
}
