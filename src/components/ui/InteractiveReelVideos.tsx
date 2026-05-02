"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { withAssetPath } from "@/lib/assetPath";

export type ReelVideoItem = {
  /** Public URL under `/public`, e.g. `/videos/social/reel-1.mp4` */
  videoSrc: string;
  /** Optional still — avoids black flash while MP4 loads (path under `public/`). */
  poster?: string;
  title: string;
  description: string;
};

type InteractiveReelVideosProps = {
  items: ReelVideoItem[];
};

/** Prefer starting near a keyframe so the first painted frame is in-color (not black). */
function videoSrcWithStartHint(src: string): string {
  const trimmed = src.trim();
  const hashIdx = trimmed.indexOf("#");
  const base = hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed;
  return `${base}#t=0.06`;
}

/**
 * Seek to an early frame so paused / narrow strips show real pixels (not decoder black).
 */
function paintPreviewFrame(video: HTMLVideoElement) {
  const applySeek = () => {
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;
    const dur = video.duration;
    const t =
      Number.isFinite(dur) && dur > 0
        ? Math.min(0.22, Math.max(0.04, dur * 0.02))
        : 0.08;
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
    };
    video.addEventListener("seeked", onSeeked, { once: true });
    try {
      video.currentTime = t;
    } catch {
      /* ignore */
    }
  };

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    applySeek();
  } else {
    video.addEventListener("loadedmetadata", applySeek, { once: true });
  }
}

export function InteractiveReelVideos({ items }: InteractiveReelVideosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playStripPreviews, setPlayStripPreviews] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updatePlayMode = () => setPlayStripPreviews(mediaQuery.matches);

    updatePlayMode();
    mediaQuery.addEventListener("change", updatePlayMode);

    return () => mediaQuery.removeEventListener("change", updatePlayMode);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (playStripPreviews || i === activeIndex) {
        void vid.play().catch(() => {});
      } else {
        vid.pause();
        requestAnimationFrame(() => paintPreviewFrame(vid));
      }
    });
  }, [activeIndex, playStripPreviews]);

  /** First paint for all reels once refs exist (desktop strips load paused). */
  useLayoutEffect(() => {
    const id = window.requestAnimationFrame(() => {
      videoRefs.current.forEach((vid) => {
        if (vid) paintPreviewFrame(vid);
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [items.length]);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:gap-0">
        <div className="flex h-[min(70svh,34rem)] min-h-[22rem] w-full flex-row overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-[var(--color-surface)] shadow-[0_16px_44px_rgba(75,64,56,0.07)] [--reel-active-flex:12_1_0%] [--reel-inactive-flex:0.55_1_0%] md:h-[min(72svh,48rem)] md:min-h-[33rem] md:flex-row md:[--reel-active-flex:5_1_0%] md:[--reel-inactive-flex:1.35_1_0%]">
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const posterUrl = item.poster?.trim()
              ? withAssetPath(item.poster.trim())
              : undefined;

            return (
              <button
                key={item.videoSrc}
                type="button"
                aria-expanded={isActive}
                aria-controls={`reel-panel-${index}`}
                id={`reel-tab-${index}`}
                className="group relative flex min-h-0 min-w-[2.05rem] flex-1 flex-col justify-end overflow-hidden border-r border-[var(--color-border)] text-left transition-[flex,box-shadow] duration-700 ease-in-out last:border-r-0 first:rounded-l-[1.5rem] last:rounded-r-[1.5rem] md:min-w-[72px] md:rounded-none md:border-r md:border-b-0 md:last:border-r-0 md:first:rounded-l-[1.5rem] md:first:rounded-tr-none md:last:rounded-r-[1.5rem] md:last:rounded-bl-none"
                style={{
                  flex: isActive
                    ? "var(--reel-active-flex)"
                    : "var(--reel-inactive-flex)",
                  boxShadow: isActive
                    ? "0 18px 42px rgba(75, 64, 56, 0.1)"
                    : "0 8px 22px rgba(75, 64, 56, 0.05)",
                  zIndex: isActive ? 10 : 1,
                }}
                onClick={() => {
                  if (activeIndex !== index) {
                    setActiveIndex(index);
                  }
                }}
              >
                <div
                  id={`reel-panel-${index}`}
                  className="absolute inset-0 bg-[var(--color-surface-strong)]"
                  aria-hidden={!isActive}
                >
                  <div
                    className={`absolute inset-0 ${isActive ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
                    onClick={
                      isActive
                        ? (e) => {
                            e.stopPropagation();
                            const v = videoRefs.current[index];
                            if (!v) return;
                            if (v.paused) void v.play();
                            else v.pause();
                          }
                        : undefined
                    }
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
                      src={videoSrcWithStartHint(item.videoSrc)}
                      poster={posterUrl}
                      playsInline
                      muted
                      loop
                      autoPlay={playStripPreviews || isActive}
                      preload="auto"
                      disablePictureInPicture
                      aria-label={item.title}
                      onLoadedMetadata={(e) => paintPreviewFrame(e.currentTarget)}
                      onLoadedData={(e) => paintPreviewFrame(e.currentTarget)}
                      onCanPlay={(e) => paintPreviewFrame(e.currentTarget)}
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black from-[8%] via-black/75 to-transparent"
                    aria-hidden
                  />
                </div>

                {isActive ? (
                  <div className="relative z-[2] flex w-full items-end justify-center px-3 py-4 text-left md:justify-start md:px-5 md:py-5">
                    <div className="min-w-0 max-w-full text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                      <p className="truncate font-semibold leading-tight md:text-lg">
                        {item.title}
                      </p>
                      <p className="text-sm text-white/80">{item.description}</p>
                    </div>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
