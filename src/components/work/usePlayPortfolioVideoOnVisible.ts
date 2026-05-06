"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

/**
 * Speelt af als de kaart in beeld is; pauzeert als je verder scrollt.
 * Geen “sync” die alle rijen tegelijk start — dat zorgt voor trage laadtijden (veel parallelle downloads).
 * Lichte herkans op play() na canplay; geen lange interval-loop.
 */
export function usePlayPortfolioVideoOnVisible(
  shellRef: RefObject<HTMLDivElement | null>,
  videoRef: RefObject<HTMLVideoElement | null>,
  srcKey: string,
) {
  const inViewRef = useRef(false);
  const wasIntersectingRef = useRef(false);
  const retryTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const clearRetries = () => {
      for (const t of retryTimersRef.current) clearTimeout(t);
      retryTimersRef.current = [];
    };

    const tryPlay = () => {
      const v = videoRef.current;
      if (!v || !inViewRef.current) return;
      void v.play().catch(() => {});
    };

    const startPlayback = (resetStart: boolean) => {
      const v = videoRef.current;
      if (!v) return;
      if (resetStart) {
        try {
          v.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
      tryPlay();
      clearRetries();
      const delays = [0, 90, 220, 450];
      for (const ms of delays) {
        retryTimersRef.current.push(
          setTimeout(() => {
            if (inViewRef.current) tryPlay();
          }, ms),
        );
      }
    };

    const onMediaReady = () => {
      if (inViewRef.current) tryPlay();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const intersecting = !!entry?.isIntersecting;
        const v = videoRef.current;

        if (!intersecting) {
          inViewRef.current = false;
          wasIntersectingRef.current = false;
          clearRetries();
          v?.pause();
          return;
        }

        inViewRef.current = true;
        const justEntered = !wasIntersectingRef.current;
        wasIntersectingRef.current = true;
        startPlayback(justEntered);
      },
      {
        threshold: 0,
        /** Klein genoeg dat niet alle clips tegelijk “in beeld” zijn; groot genoeg voor vlotte start. */
        rootMargin: "72px 0px 72px 0px",
      },
    );

    io.observe(shell);

    const vid = videoRef.current;
    vid?.addEventListener("canplay", onMediaReady);
    vid?.addEventListener("loadeddata", onMediaReady);

    return () => {
      io.disconnect();
      clearRetries();
      vid?.removeEventListener("canplay", onMediaReady);
      vid?.removeEventListener("loadeddata", onMediaReady);
    };
  }, [srcKey, shellRef, videoRef]);
}
