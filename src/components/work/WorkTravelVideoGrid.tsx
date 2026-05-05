"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useWorkPageVideoAudioOptional } from "@/components/work/WorkPageVideoAudioContext";
import { WorkPortfolioVideoSoundButton } from "@/components/work/WorkPortfolioVideoSoundButton";
import { withAssetPath } from "@/lib/assetPath";
import { inlineLoopingVideoProps } from "@/lib/inlineVideoHtmlProps";
import { cn } from "@/lib/utils";

type WorkTravelClip = { videoSrc: string; title?: string; poster?: string };

type WorkTravelVideoGridProps = {
  videos: WorkTravelClip[];
  stripAriaLabel: string;
  className?: string;
};

/**
 * One cell: volledige buffer (`preload="auto"`) zodat alle zichtbare clips meteen lopen — geen “bevroren” raster.
 * Afspelen via card-intersectie + `play()` (video-element observeren was onbetrouwbaar).
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const instanceId = useId();
  const audio = useWorkPageVideoAudioOptional();

  const videoSrcWithStartHint = (() => {
    const trimmed = item.videoSrc.trim();
    const hashIdx = trimmed.indexOf("#");
    const base = hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed;
    return `${base}#t=0.06`;
  })();
  const posterUrl = item.poster?.trim() ? item.poster.trim() : undefined;

  const setVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    videoRefs.current[index] = el;
  };

  useLayoutEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.defaultMuted = true;
    vid.muted = muted;
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");

    const tryPlay = () => void vid.play().catch(() => {});
    vid.addEventListener("loadeddata", tryPlay, { once: true });
    vid.addEventListener("canplay", tryPlay, { once: true });
    tryPlay();

    return () => {
      vid.removeEventListener("loadeddata", tryPlay);
      vid.removeEventListener("canplay", tryPlay);
    };
  }, [item.videoSrc, muted]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    let tries = 0;
    const maxTries = 24;
    const timer = window.setInterval(() => {
      if (!videoRef.current) return;
      if (!videoRef.current.paused) {
        window.clearInterval(timer);
        return;
      }
      void videoRef.current.play().catch(() => {});
      tries += 1;
      if (tries >= maxTries) {
        window.clearInterval(timer);
      }
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [item.videoSrc]);

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
          "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent",
          "shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
        )}
      >
        <video
          ref={setVideoRef}
          src={videoSrcWithStartHint}
          poster={posterUrl}
          className="h-full w-full bg-[color-mix(in_srgb,var(--color-primary)_24%,#201512)] object-cover object-bottom transform-gpu"
          {...inlineLoopingVideoProps}
          muted={muted}
          loop
          autoPlay
          preload="auto"
          aria-label={item.title?.trim() || "Travel portfolio video clip"}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            try {
              if (v.readyState >= HTMLMediaElement.HAVE_METADATA && v.currentTime < 0.08) {
                v.currentTime = 0.08;
              }
            } catch {
              /* ignore */
            }
            void v.play().catch(() => {});
          }}
          onLoadedData={(e) => {
            void e.currentTarget.play().catch(() => {});
          }}
        />
        <WorkPortfolioVideoSoundButton
          muted={muted}
          onPress={handleSoundPress}
          className="absolute bottom-4 left-1/2 z-[3] !m-0 -translate-x-1/2"
        />
      </div>
    </div>
  );
}

/**
 * Six self-hosted MP4s in a **2×3** grid — same reel-style card shell and playback behavior as
 * {@link WorkCategoryTripleVideoRow} (muted, loop, in-view play/pause). Videos use
 * `object-bottom` so on-screen text at the lower edge is not cropped by the 3:4 frame.
 * Clips use **eager** load so Work portfolio videos are buffered as soon as the page opens.
 */
export function WorkTravelVideoGrid({
  videos,
  stripAriaLabel,
  className,
}: WorkTravelVideoGridProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [gridInView, setGridInView] = useState(false);
  const [gridNearView, setGridNearView] = useState(false);
  const six = videos.slice(0, 6);

  if (six.length !== 6) {
    return null;
  }

  const preloadKey = six.map((v) => v.videoSrc).join("|");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const links: HTMLLinkElement[] = [];
    const seen = new Set<string>();

    for (const item of six) {
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
  }, [preloadKey, six]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setGridInView(!!entry?.isIntersecting);
      },
      { threshold: 0, rootMargin: "500px 0px 500px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setGridNearView(!!entry?.isIntersecting);
      },
      { threshold: 0, rootMargin: "1200px 0px 1200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!gridNearView) return;
    for (const vid of videoRefs.current) {
      if (!vid) continue;
      vid.preload = "auto";
      try {
        vid.load();
      } catch {
        /* ignore */
      }
    }
  }, [gridNearView, preloadKey]);

  useEffect(() => {
    if (!gridInView) return;
    const vids = videoRefs.current.filter((v): v is HTMLVideoElement => !!v);
    if (vids.length === 0) return;
    let cancelled = false;

    const waitForFirstFrame = (vid: HTMLVideoElement) =>
      new Promise<void>((resolve) => {
        if (vid.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          resolve();
          return;
        }
        const onReady = () => resolve();
        vid.addEventListener("loadeddata", onReady, { once: true });
        vid.addEventListener("canplay", onReady, { once: true });
      });

    const startInSync = async () => {
      await Promise.all(vids.map(waitForFirstFrame));
      if (cancelled) return;
      vids.forEach((vid) => {
        void vid.play().catch(() => {});
      });
    };

    void startInSync();
    return () => {
      cancelled = true;
    };
  }, [gridInView, preloadKey]);

  return (
    <div ref={gridRef} className="flex w-full justify-center">
      <div
        className={cn(
          "grid min-w-0 w-full max-w-full grid-cols-1 gap-x-4 gap-y-6 sm:gap-y-10",
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
