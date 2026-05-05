"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useWorkPageVideoAudioOptional } from "@/components/work/WorkPageVideoAudioContext";
import { WorkPortfolioVideoSoundButton } from "@/components/work/WorkPortfolioVideoSoundButton";
import { withAssetPath } from "@/lib/assetPath";
import { inlineLoopingVideoProps } from "@/lib/inlineVideoHtmlProps";
import { cn } from "@/lib/utils";

export type WorkCategoryTripleVideo =
  | { videoSrc: string; title?: string; poster?: string }
  | { placeholder: true; title?: string };

type WorkCategoryTripleVideoRowProps = {
  videos: WorkCategoryTripleVideo[] | undefined;
  className?: string;
  /**
   * Inside a larger bordered shell (e.g. hotels): no per-clip frame so the block reads as one unit.
   */
  variant?: "default" | "embedded";
};

function TripleRowVideoCell({
  clip,
  index,
  videoRefs,
  embedded,
}: {
  clip: { videoSrc: string; title?: string; poster?: string };
  index: number;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  embedded: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const instanceId = useId();
  const audio = useWorkPageVideoAudioOptional();

  const videoSrcWithStartHint = (() => {
    const trimmed = clip.videoSrc.trim();
    const hashIdx = trimmed.indexOf("#");
    const base = hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed;
    return `${base}#t=0.06`;
  })();
  const posterUrl = clip.poster?.trim() ? clip.poster.trim() : undefined;

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    videoRefs.current[index] = el;
  };

  useLayoutEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const tryPlay = () => void vid.play().catch(() => {});
    vid.addEventListener("loadeddata", tryPlay, { once: true });
    vid.addEventListener("canplay", tryPlay, { once: true });
    tryPlay();

    return () => {
      vid.removeEventListener("loadeddata", tryPlay);
      vid.removeEventListener("canplay", tryPlay);
    };
  }, [clip.videoSrc]);

  useLayoutEffect(() => {
    if (!audio) return;
    const aid = audio.activeUnmutedId;
    if (aid === null || aid === instanceId) return;
    setMuted((m) => {
      if (m) return m;
      const v = videoRef.current;
      if (v) v.muted = true;
      return true;
    });
  }, [audio, audio?.activeUnmutedId, instanceId]);

  const handleSoundPress = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const nextMuted = !vid.muted;
    vid.currentTime = 0;

    if (!nextMuted && audio) {
      flushSync(() => {
        audio.claimUnmuted(instanceId);
      });
    } else if (nextMuted && audio) {
      audio.releaseUnmuted(instanceId);
    }

    vid.muted = nextMuted;
    void vid.play().catch(() => {});
    setMuted(nextMuted);
  };

  return (
    <div className="flex min-w-0 w-full">
      <div
        className={cn(
          "relative aspect-[3/4] min-h-0 w-full min-w-0 overflow-hidden",
          embedded
            ? "rounded-none border-0 bg-transparent shadow-none"
            : "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
        )}
      >
        <video
          ref={setVideoRef}
          src={videoSrcWithStartHint}
          poster={posterUrl}
          className="h-full w-full object-cover object-bottom transform-gpu"
          {...inlineLoopingVideoProps}
          muted={muted}
          loop
          autoPlay
          preload="auto"
          aria-label={clip.title?.trim() || "Portfolio video clip"}
        />
        <WorkPortfolioVideoSoundButton
          muted={muted}
          onPress={handleSoundPress}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
        />
      </div>
    </div>
  );
}

/**
 * Three reel-style slots (MP4 or placeholder). Shown only when `videos.length === 3`.
 * Placeholder slots keep the same frame for “coming soon” until a file is ready.
 * — Muted + loop + `playsInline` for real clips; play/pause follows viewport visibility.
 * Real clips load eagerly so the strip is ready as soon as visitors open My Work.
 */
export function WorkCategoryTripleVideoRow({
  videos,
  className,
  variant = "default",
}: WorkCategoryTripleVideoRowProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  if (!videos || videos.length !== 3) {
    return null;
  }

  const embedded = variant === "embedded";
  const preloadKey = videos
    .map((v) => ("videoSrc" in v ? v.videoSrc : "placeholder"))
    .join("|");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const links: HTMLLinkElement[] = [];
    const seen = new Set<string>();

    for (const item of videos) {
      if (!("videoSrc" in item)) continue;
      const trimmed = item.videoSrc.trim();
      const hashIdx = trimmed.indexOf("#");
      const href = withAssetPath(hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed);
      if (seen.has(href)) continue;
      seen.add(href);
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    }

    return () => {
      for (const l of links) l.remove();
    };
  }, [preloadKey, videos]);

  return (
    <div
      className={cn(
        "grid min-w-0 w-full max-w-full",
        embedded
          ? "grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-1 min-[1200px]:gap-1"
          : // One column (phone): vertical step matches WorkTravelVideoGrid (`gap-y-6` base); 3 cols = horizontal gaps only.
            "grid-cols-1 gap-x-0 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-0 min-[1200px]:gap-x-6",
        className,
      )}
    >
      {videos.map((item, index) => {
        const isPlaceholder = "placeholder" in item && item.placeholder;
        const clip = !isPlaceholder && "videoSrc" in item ? item : null;
        const key = clip ? `${clip.videoSrc}-${index}` : `placeholder-${index}`;

        if (isPlaceholder) {
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
              <div
                className="flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] px-4 text-center"
                role="status"
                aria-label={item.title?.trim() || "Coming soon"}
              >
                <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.2em] text-[var(--color-primary)] sm:text-xs">
                  Coming soon
                </span>
              </div>
            </div>
          );
        }

        if (clip) {
          return (
            <TripleRowVideoCell
              key={key}
              clip={clip}
              index={index}
              videoRefs={videoRefs}
              embedded={embedded}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
