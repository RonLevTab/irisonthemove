"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useWorkPageVideoAudioOptional } from "@/components/work/WorkPageVideoAudioContext";
import { WorkPortfolioVideoSoundButton } from "@/components/work/WorkPortfolioVideoSoundButton";
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

const NEAR_VIEW_ROOT_MARGIN = "520px 0px";

function TripleRowVideoCell({
  clip,
  index,
  videoRefs,
  embedded,
}: {
  clip: { videoSrc: string; title?: string };
  index: number;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  embedded: boolean;
}) {
  const cellRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [muted, setMuted] = useState(true);
  const instanceId = useId();
  const audio = useWorkPageVideoAudioOptional();

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
      { rootMargin: NEAR_VIEW_ROOT_MARGIN, threshold: 0 },
    );
    io.observe(cell);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const cell = cellRef.current;
    if (!cell) return;
    const bump = () => {
      const r = cell.getBoundingClientRect();
      const vh =
        typeof window !== "undefined"
          ? window.innerHeight || document.documentElement.clientHeight
          : 0;
      if (r.bottom > -160 && r.top < vh + 520) {
        setShouldLoad(true);
      }
    };
    bump();
    const t = window.setTimeout(bump, 80);
    const t2 = window.setTimeout(bump, 400);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
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
      { rootMargin: "120px 0px", threshold: 0 },
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
    <div className="flex min-w-0 w-full flex-col items-center">
      <div
        ref={cellRef}
        className={cn(
          "relative aspect-[3/4] min-h-0 w-full min-w-0 overflow-hidden",
          embedded
            ? "rounded-none border-0 bg-transparent shadow-none"
            : "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
        )}
      >
        <video
          ref={setVideoRef}
          src={shouldLoad ? clip.videoSrc : undefined}
          className="h-full w-full object-cover object-bottom"
          muted={muted}
          loop
          playsInline
          autoPlay
          preload={shouldLoad ? "auto" : "none"}
          aria-label={clip.title?.trim() || "Portfolio video clip"}
        />
      </div>
      <WorkPortfolioVideoSoundButton muted={muted} onPress={handleSoundPress} />
    </div>
  );
}

/**
 * Three reel-style slots (MP4 or placeholder). Shown only when `videos.length === 3`.
 * Placeholder slots keep the same frame for “coming soon” until a file is ready.
 * — Muted + loop + `playsInline` for real clips; play/pause follows viewport visibility.
 * Real clips defer `src` until near the viewport to avoid stacking full preloads on the work page.
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
