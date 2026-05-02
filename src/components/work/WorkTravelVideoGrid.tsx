"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type WorkTravelClip = { videoSrc: string; title?: string };

type WorkTravelVideoGridProps = {
  videos: WorkTravelClip[];
  stripAriaLabel: string;
  className?: string;
};

const NEAR_VIEW_ROOT_MARGIN = "260px 0px";

/**
 * One cell: defer `src` until the tile is near the viewport so six MP4s don’t all download at once.
 * Playback is driven from the **card** intersection + explicit `play()` — observing `<video>` was unreliable (ref / ratio timing).
 */
function TravelGridVideoCell({
  item,
  index,
  videoRefs,
}: {
  item: WorkTravelClip;
  index: number;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
}) {
  const cellRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    videoRefs.current[index] = el;
  };

  useLayoutEffect(() => {
    const cell = cellRef.current;
    if (!cell) {
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: NEAR_VIEW_ROOT_MARGIN, threshold: 0.01 },
    );
    io.observe(cell);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!shouldLoad) {
      return;
    }
    const vid = videoRef.current;
    const cell = cellRef.current;
    if (!vid || !cell) {
      return;
    }

    const tryPlay = () => void vid.play().catch(() => {});

    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          tryPlay();
        } else {
          vid.pause();
        }
      },
      { rootMargin: "100px 0px", threshold: 0.01 },
    );
    io.observe(cell);

    vid.addEventListener("loadeddata", tryPlay, { once: true });
    vid.addEventListener("canplay", tryPlay, { once: true });
    tryPlay();

    return () => {
      io.disconnect();
      vid.removeEventListener("loadeddata", tryPlay);
      vid.removeEventListener("canplay", tryPlay);
    };
  }, [shouldLoad]);

  return (
    <div
      ref={cellRef}
      className={cn(
        "relative aspect-[3/4] min-h-0 w-full min-w-0 overflow-hidden",
        "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent",
        "shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
      )}
    >
      <video
        ref={setVideoRef}
        src={shouldLoad ? item.videoSrc : undefined}
        className="h-full w-full object-cover object-bottom"
        muted
        loop
        playsInline
        autoPlay
        preload={shouldLoad ? "auto" : "none"}
        aria-label={item.title?.trim() || "Travel portfolio video clip"}
      />
    </div>
  );
}

/**
 * Six self-hosted MP4s in a **2×3** grid — same reel-style card shell and playback behavior as
 * {@link WorkCategoryTripleVideoRow} (muted, loop, in-view play/pause). Videos use
 * `object-bottom` so on-screen text at the lower edge is not cropped by the 3:4 frame.
 * Clips load **lazily** so they don’t all compete for bandwidth on first paint.
 */
export function WorkTravelVideoGrid({
  videos,
  stripAriaLabel,
  className,
}: WorkTravelVideoGridProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const six = videos.slice(0, 6);

  if (six.length !== 6) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
      <div
        className={cn(
          "grid min-w-0 w-full max-w-full grid-cols-1 gap-4",
          "min-[640px]:grid-cols-2",
          "min-[1024px]:grid-cols-3 sm:gap-5 min-[1200px]:gap-6",
          className,
        )}
        aria-label={stripAriaLabel}
      >
        {six.map((item, index) => (
          <TravelGridVideoCell
            key={`${item.videoSrc}-${index}`}
            item={item}
            index={index}
            videoRefs={videoRefs}
          />
        ))}
      </div>
    </div>
  );
}
