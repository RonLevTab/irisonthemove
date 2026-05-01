"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type WorkTravelClip = { videoSrc: string; title?: string };

type WorkTravelVideoGridProps = {
  videos: WorkTravelClip[];
  stripAriaLabel: string;
  className?: string;
};

/**
 * Six self-hosted MP4s in a **2×3** grid — same reel-style card shell and playback behavior as
 * {@link WorkCategoryTripleVideoRow} (muted, loop, in-view play/pause). Videos use
 * `object-bottom` so on-screen text at the lower edge is not cropped by the 3:4 frame.
 * Width matches the restaurant/hotel work strips: full width of the section shell
 * (see {@link WorkDualGridsWithTripleVideos}).
 */
export function WorkTravelVideoGrid({
  videos,
  stripAriaLabel,
  className,
}: WorkTravelVideoGridProps) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const six = videos.slice(0, 6);

  useEffect(() => {
    if (six.length !== 6) return;
    const els = refs.current.filter(Boolean) as HTMLVideoElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "60px 0px", threshold: 0.2 },
    );

    els.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [videos]);

  if (six.length !== 6) return null;

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
          <div
            key={`${item.videoSrc}-${index}`}
            className={cn(
              "relative aspect-[3/4] min-h-0 w-full min-w-0 overflow-hidden",
              "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent",
              "shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
            )}
          >
            <video
              ref={(el) => {
                refs.current[index] = el;
              }}
              src={item.videoSrc}
              className="h-full w-full object-cover object-bottom"
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              aria-label={item.title?.trim() || "Travel portfolio video clip"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
