"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export type WorkCategoryTripleVideo =
  | { videoSrc: string; title?: string }
  | { placeholder: true; title?: string };

type WorkCategoryTripleVideoRowProps = {
  videos: WorkCategoryTripleVideo[] | undefined;
  className?: string;
  /**
   * Inside a larger bordered shell (e.g. hotels): no per-clip frame so the block reads as one unit.
   */
  variant?: "default" | "embedded";
};

/**
 * Three reel-style slots (MP4 or placeholder). Shown only when `videos.length === 3`.
 * Placeholder slots keep the same frame for “coming soon” until a file is ready.
 * — Muted + loop + `playsInline` for real clips; play/pause follows viewport visibility.
 */
export function WorkCategoryTripleVideoRow({
  videos,
  className,
  variant = "default",
}: WorkCategoryTripleVideoRowProps) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (!videos || videos.length !== 3) return;
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

  if (!videos || videos.length !== 3) return null;

  const embedded = variant === "embedded";

  return (
    <div
      className={cn(
        "grid min-w-0 w-full max-w-full",
        embedded
          ? "grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-1 min-[1200px]:gap-1"
          : "grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 min-[1200px]:gap-6",
        className,
      )}
    >
      {videos.map((item, index) => {
        const isPlaceholder = "placeholder" in item && item.placeholder;
        const clip = !isPlaceholder && "videoSrc" in item ? item : null;
        const key = clip ? `${clip.videoSrc}-${index}` : `placeholder-${index}`;
        return (
          <div
            key={key}
            className={cn(
              "relative aspect-[3/4] min-h-0 w-full min-w-0 overflow-hidden",
              embedded
                ? "rounded-none border-0 bg-transparent shadow-none"
                : "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
            )}
          >
            {isPlaceholder ? (
              <div
                className="flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] px-4 text-center"
                role="status"
                aria-label={item.title?.trim() || "Coming soon"}
              >
                <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[var(--color-primary)] sm:text-xs">
                  Coming soon
                </span>
              </div>
            ) : clip ? (
              <video
                ref={(el) => {
                  refs.current[index] = el;
                }}
                src={clip.videoSrc}
                className="h-full w-full object-cover object-bottom"
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                aria-label={clip.title?.trim() || "Portfolio video clip"}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
