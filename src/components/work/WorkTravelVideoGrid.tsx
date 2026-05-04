"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useWorkPageVideoAudioOptional } from "@/components/work/WorkPageVideoAudioContext";
import { WorkPortfolioVideoSoundButton } from "@/components/work/WorkPortfolioVideoSoundButton";
import { cn } from "@/lib/utils";

type WorkTravelClip = { videoSrc: string; title?: string };

type WorkTravelVideoGridProps = {
  videos: WorkTravelClip[];
  stripAriaLabel: string;
  className?: string;
};

const NEAR_VIEW_ROOT_MARGIN = "520px 0px";

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

  /** Windows / grote monitors: extra check als IntersectionObserver net mist op eerste paint. */
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
          "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent",
          "shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
        )}
      >
        <video
          ref={setVideoRef}
          src={shouldLoad ? item.videoSrc : undefined}
          className="h-full w-full object-cover object-bottom"
          muted={muted}
          loop
          playsInline
          autoPlay
          preload={shouldLoad ? "auto" : "none"}
          aria-label={item.title?.trim() || "Travel portfolio video clip"}
        />
      </div>
      <WorkPortfolioVideoSoundButton muted={muted} onPress={handleSoundPress} />
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
          "grid min-w-0 w-full max-w-full grid-cols-1 gap-x-4 gap-y-10",
          "min-[640px]:grid-cols-2",
          "min-[1024px]:grid-cols-3 sm:gap-x-5 sm:gap-y-12 min-[1200px]:gap-x-6 min-[1200px]:gap-y-14",
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
