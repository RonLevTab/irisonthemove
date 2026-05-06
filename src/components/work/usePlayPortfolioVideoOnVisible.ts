"use client";

import type { RefObject } from "react";
import { useEffect } from "react";

/**
 * Start vanaf het eerste frame, bewegend, wanneer de kaart in beeld scrollt;
 * pauzeren als hij weer weg is (mobiel + desktop).
 */
export function usePlayPortfolioVideoOnVisible(
  shellRef: RefObject<HTMLDivElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  srcKey: string,
) {
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) {
          try {
            v.currentTime = 0;
          } catch {
            /* ignore */
          }
          void v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      {
        threshold: 0.14,
        rootMargin: "12% 0px -5% 0px",
      },
    );

    io.observe(shell);
    return () => io.disconnect();
  }, [srcKey, shellRef, videoRef]);
}
