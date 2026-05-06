"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

import { isDesktopFinePointerMinMd } from "@/lib/desktopVideoBandwidthMode";

/**
 * Start vanaf het eerste frame, bewegend, wanneer de kaart in beeld scrollt;
 * pauzeren als hij weer weg is (mobiel + desktop).
 * Op laptop: strengere drempel zodat minder tegels tegelijk “aan” springen (minder netwerk-strijd).
 */
export function usePlayPortfolioVideoOnVisible(
  shellRef: RefObject<HTMLDivElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  srcKey: string,
) {
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const strictDesktop = isDesktopFinePointerMinMd();
    const threshold = strictDesktop ? 0.4 : 0.14;
    const rootMargin = strictDesktop ? "4% 0px -22% 0px" : "12% 0px -5% 0px";

    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) {
          v.preload = "auto";
          try {
            v.currentTime = 0;
          } catch {
            /* ignore */
          }
          void v.play().catch(() => {});
        } else {
          v.pause();
          if (strictDesktop) v.preload = "metadata";
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    io.observe(shell);
    return () => io.disconnect();
  }, [srcKey, shellRef, videoRef]);
}
