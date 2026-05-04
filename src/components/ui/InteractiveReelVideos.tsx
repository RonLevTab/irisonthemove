"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";

import { withAssetPath } from "@/lib/assetPath";

function subscribeMobileStripMode(cb: () => void) {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getMobileStripMode() {
  return window.matchMedia("(max-width: 767px)").matches;
}

function subscribeFinePointerHover(cb: () => void) {
  const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getFinePointerHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

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
  /** Phone: zelfde groei als desktop — actieve reel breed, overige smalle stroken (start: video 1). */
  const playStripPreviews = useSyncExternalStore(
    subscribeMobileStripMode,
    getMobileStripMode,
    () => false,
  );
  /** Desktop (Mac / Windows + mouse): switch active reel on hover; phones / touch stay tap-only. */
  const reelHoverSwitchEnabled = useSyncExternalStore(
    subscribeFinePointerHover,
    getFinePointerHover,
    () => false,
  );
  /** Scroll happened (ignore autoplay-audio when block is visible on first paint). */
  const [userHasScrolled, setUserHasScrolled] = useState(false);
  /** True while the reels block intersects the viewport; false when scrolled past or above. */
  const [sectionInView, setSectionInView] = useState(false);
  /** User turned sound off via the Mute control (stays until they choose Sound on). */
  const [reelsMutedByUser, setReelsMutedByUser] = useState(false);
  /** User tapped a reel (allows sound in-section without waiting for scroll, e.g. huge screen). */
  const [reelTapEngaged, setReelTapEngaged] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const blockRef = useRef<HTMLDivElement>(null);
  /** Tracks last `sectionInView` so we detect “left block, then came back”. */
  const prevSectionInView = useRef<boolean | null>(null);

  /** Sound only inside “What I have been creating lately” — not on home load, not after scrolling away. */
  const reelsAudioEnabled = sectionInView && (userHasScrolled || reelTapEngaged);
  const reelsAudioActive = reelsAudioEnabled && !reelsMutedByUser;

  /** Don’t treat “already visible on first paint” as arrival — wait until the visitor actually scrolls. */
  useEffect(() => {
    const mark = () => setUserHasScrolled(true);
    window.addEventListener("scroll", mark, { passive: true });
    window.addEventListener("wheel", mark, { passive: true });
    window.addEventListener("touchmove", mark, { passive: true });
    return () => {
      window.removeEventListener("scroll", mark);
      window.removeEventListener("wheel", mark);
      window.removeEventListener("touchmove", mark);
    };
  }, []);

  /** Start fetching every reel MP4 as soon as the home page mounts (before the block scrolls into view). */
  const reelPreloadKey = items.map((i) => i.videoSrc).join("|");
  useEffect(() => {
    if (typeof document === "undefined") return;
    const links: HTMLLinkElement[] = [];
    const seen = new Set<string>();
    for (const item of items) {
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
      for (const l of links) {
        l.remove();
      }
    };
  }, [reelPreloadKey]);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setSectionInView(!!entry?.isIntersecting);
      },
      { threshold: 0.22, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * After scrolling past the block and returning, reel 1 (and its audio) starts from the beginning again.
   * Skips the first time the block becomes visible (`prev === null`) so the initial load is unchanged.
   */
  useLayoutEffect(() => {
    const prev = prevSectionInView.current;
    prevSectionInView.current = sectionInView;

    if (!sectionInView) return;
    const cameBackAfterLeaving = prev === false;
    if (!cameBackAfterLeaving) return;

    setActiveIndex(0);
    for (const vid of videoRefs.current) {
      if (!vid) continue;
      try {
        vid.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [sectionInView]);

  /** Unmute active strip only while `reelsAudioActive`; mute everything when section is left or user muted. */
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (!reelsAudioActive) {
        vid.muted = true;
        return;
      }
      if (i === activeIndex) {
        vid.volume = 1;
        vid.muted = false;
        void vid.play().catch(() => {});
      } else {
        vid.muted = true;
      }
    });
  }, [reelsAudioActive, activeIndex]);

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
  }, [activeIndex, playStripPreviews, reelsAudioActive]);

  /** First paint for all reels once refs exist (desktop strips load paused). */
  useLayoutEffect(() => {
    const id = window.requestAnimationFrame(() => {
      videoRefs.current.forEach((vid, i) => {
        if (!vid) return;
        const shouldPlayStrip = playStripPreviews || i === activeIndex;
        if (!shouldPlayStrip) {
          paintPreviewFrame(vid);
        }
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [items.length, playStripPreviews, activeIndex, reelsAudioActive]);

  return (
    <div
      ref={blockRef}
      className="flex h-full min-h-0 w-full flex-1 flex-col overflow-x-hidden"
    >
      {/*
        Smallere bak + iets hoger → actieve video minder “breed vierkant”, meer Reels-hoogte.
      */}
      <div className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-1 flex-col gap-2 md:gap-0 lg:max-w-5xl xl:max-w-6xl">
        <div
          className={`flex min-h-[20rem] flex-1 flex-row rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-[var(--color-surface)] shadow-[0_16px_44px_rgba(75,64,56,0.07)] [--reel-active-flex:12_1_0%] [--reel-inactive-flex:1.05_1_0%] max-md:overflow-hidden md:min-h-[32rem] md:[--reel-active-flex:5.5_1_0%] md:[--reel-inactive-flex:1.16_1_0%] ${
            playStripPreviews
              ? "max-md:[scrollbar-width:thin] md:overflow-hidden"
              : "overflow-hidden"
          }`}
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const posterUrl = item.poster?.trim()
              ? withAssetPath(item.poster.trim())
              : undefined;
            const shouldPlayThisStrip = playStripPreviews || isActive;
            const shouldPlayAudio = reelsAudioActive && isActive;
            /** All reels preload fully so switching strips / first paint never waits on cold buffer. */
            const preloadStrategy = "auto";

            const stripFlexStyle = {
              flex: isActive
                ? "var(--reel-active-flex)"
                : "var(--reel-inactive-flex)",
              ...(playStripPreviews ? { minWidth: 0 } : {}),
            } as const;

            return (
              <button
                key={item.videoSrc}
                type="button"
                aria-expanded={isActive}
                aria-controls={`reel-panel-${index}`}
                id={`reel-tab-${index}`}
                className="group relative flex min-h-0 min-w-[2.05rem] flex-1 flex-col justify-end overflow-hidden border-r border-[var(--color-border)] text-left transition-[flex,box-shadow] duration-700 ease-in-out last:border-r-0 first:rounded-l-[1.5rem] last:rounded-r-[1.5rem] max-md:min-w-0 max-md:flex-1 md:min-w-[2.5rem] md:flex-1 md:rounded-none md:border-r md:border-b-0 md:last:border-r-0 md:first:rounded-l-[1.5rem] md:first:rounded-tr-none md:last:rounded-r-[1.5rem] md:last:rounded-bl-none"
                style={{
                  ...stripFlexStyle,
                  boxShadow: isActive
                    ? "0 18px 42px rgba(75, 64, 56, 0.1)"
                    : "0 8px 22px rgba(75, 64, 56, 0.05)",
                  zIndex: isActive ? 10 : 1,
                }}
                onClick={() => {
                  setReelTapEngaged(true);
                  if (activeIndex !== index) {
                    setActiveIndex(index);
                  }
                }}
                onMouseEnter={() => {
                  if (!reelHoverSwitchEnabled) return;
                  setReelTapEngaged(true);
                  if (activeIndex !== index) {
                    setActiveIndex(index);
                  }
                }}
              >
                <div
                  id={`reel-panel-${index}`}
                  className="absolute inset-0 bg-black"
                  aria-hidden={!isActive}
                >
                  <div
                    className={`absolute inset-0 ${isActive ? "pointer-events-auto cursor-pointer" : "pointer-events-none"}`}
                    onClick={
                      isActive
                        ? (e) => {
                            e.stopPropagation();
                            setReelTapEngaged(true);
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
                      muted={!shouldPlayAudio}
                      loop
                      autoPlay={playStripPreviews || isActive}
                      preload={preloadStrategy}
                      disablePictureInPicture
                      aria-label={item.title}
                      onLoadedMetadata={(e) => {
                        const v = e.currentTarget;
                        if (!shouldPlayThisStrip) {
                          paintPreviewFrame(v);
                          return;
                        }
                        if (playStripPreviews) {
                          requestAnimationFrame(() => paintPreviewFrame(v));
                        }
                      }}
                      onLoadedData={(e) => {
                        const v = e.currentTarget;
                        if (!shouldPlayThisStrip) {
                          paintPreviewFrame(v);
                          return;
                        }
                        if (playStripPreviews) {
                          requestAnimationFrame(() => paintPreviewFrame(v));
                        }
                      }}
                      onCanPlay={(e) => {
                        if (!shouldPlayThisStrip) {
                          paintPreviewFrame(e.currentTarget);
                        }
                      }}
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

        {sectionInView ? (
          <div className="flex shrink-0 justify-start pt-1 pl-3 sm:pl-6 md:pl-8 md:pt-3">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[0_8px_24px_rgba(90,45,50,0.12)] transition-[color,background-color,border-color,box-shadow] hover:border-[var(--color-primary)] hover:bg-[var(--color-background)] hover:shadow-[0_12px_28px_rgba(90,45,50,0.18)] sm:h-11 sm:w-11"
              aria-pressed={reelsMutedByUser}
              aria-label={
                reelsMutedByUser ? "Turn sound on for reels" : "Mute reel audio"
              }
              onClick={() => {
                setReelsMutedByUser((m) => !m);
                setReelTapEngaged(true);
              }}
            >
              {reelsMutedByUser ? (
                <FaVolumeHigh
                  className="h-[1.05rem] w-[1.05rem] sm:h-[1.15rem] sm:w-[1.15rem]"
                  aria-hidden
                />
              ) : (
                <FaVolumeXmark
                  className="h-[1.05rem] w-[1.05rem] sm:h-[1.15rem] sm:w-[1.15rem]"
                  aria-hidden
                />
              )}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
