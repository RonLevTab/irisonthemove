"use client";

import type { ReactNode, VideoHTMLAttributes } from "react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { withAssetPath } from "@/lib/assetPath";
import { brandSubtitleClassName } from "@/lib/brandFonts";
import { inlineLoopingVideoProps } from "@/lib/inlineVideoHtmlProps";
import { stripVideoMediaFragment } from "@/lib/stripVideoMediaFragment";
import { soundToggleButtonClassName } from "@/lib/soundToggleButtonClassName";

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
  /** Rendered below the sound control with the same vertical rhythm (e.g. social icons). */
  footer?: ReactNode;
};

/** Eerste frame van de clip (geen `#t=`-offset). */
function reelVideoSrc(src: string): string {
  return withAssetPath(stripVideoMediaFragment(src));
}

/** Stilstaand voorbeeld in smalle strips: eerste shot. */
function paintPreviewFrame(video: HTMLVideoElement) {
  const applySeek = () => {
    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;
    try {
      video.currentTime = 0;
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

export function InteractiveReelVideos({ items, footer }: InteractiveReelVideosProps) {
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
  /** True while the reels block intersects the viewport; false when scrolled past or above. */
  const [sectionInView, setSectionInView] = useState(false);
  /**
   * Sound only after an explicit tap on “Sound on” — never from scrolling or from choosing a reel.
   * Resets when the block leaves the viewport.
   */
  const [reelsSoundOn, setReelsSoundOn] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const blockRef = useRef<HTMLDivElement>(null);
  const primedVideoIndicesRef = useRef<Set<number>>(new Set());
  /** Tracks last `sectionInView` so we detect “left block, then came back”. */
  const prevSectionInView = useRef<boolean | null>(null);

  const reelsAudioActive = sectionInView && reelsSoundOn;

  useEffect(() => {
    if (!sectionInView) {
      setReelsSoundOn(false);
    }
  }, [sectionInView]);

  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setSectionInView(!!entry?.isIntersecting);
      },
      { threshold: 0, rootMargin: "120px 0px 120px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const links: HTMLLinkElement[] = [];
    const seen = new Set<string>();

    for (const [index, item] of items.entries()) {
      const trimmed = item.videoSrc.trim();
      const hashIdx = trimmed.indexOf("#");
      const href = withAssetPath(hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed);
      if (seen.has(href)) continue;
      seen.add(href);
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = href;
      if (index < 2) link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);
      links.push(link);
    }

    return () => {
      for (const link of links) link.remove();
    };
  }, [items]);

  useEffect(() => {
    primedVideoIndicesRef.current.clear();
  }, [items]);

  /** Prime alleen rond de actieve reel zodra de sectie in beeld is. */
  useEffect(() => {
    if (items.length === 0 || !sectionInView) return;
    const nextIndex = (activeIndex + 1) % items.length;
    const orderedIndices = [activeIndex, nextIndex];
    const timers: number[] = [];

    orderedIndices.forEach((index, order) => {
      const timer = window.setTimeout(() => {
        const vid = videoRefs.current[index];
        if (!vid) return;
        vid.preload = "auto";
        if (primedVideoIndicesRef.current.has(index)) return;
        try {
          vid.load();
          primedVideoIndicesRef.current.add(index);
        } catch {
          /* ignore */
        }
      }, order * 120);
      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [items.length, activeIndex, sectionInView]);

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

  /** Newly active / hovered reel always restarts from 0 (not on sound-only toggles). */
  useLayoutEffect(() => {
    const v = videoRefs.current[activeIndex];
    if (!v) return;
    try {
      v.currentTime = 0;
    } catch {
      /* ignore */
    }
  }, [activeIndex]);

  /** Afspelen zodra referenties bestaan; op mobiel lopen alle strips gelijktijdig (smal/breed). */
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      const isActive = i === activeIndex;
      if (!sectionInView) {
        vid.muted = true;
        if (isActive) {
          void vid.play().catch(() => {});
        } else {
          vid.pause();
        }
        return;
      }
      vid.muted = !(reelsAudioActive && isActive);
      void vid.play().catch(() => {});
    });
  }, [activeIndex, sectionInView, reelsAudioActive, playStripPreviews]);

  /** Eerste frame / seek-hint na mount wanneer nodig. */
  useLayoutEffect(() => {
    const id = window.requestAnimationFrame(() => {
      videoRefs.current.forEach((vid) => {
        if (!vid) return;
        if (vid.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
          paintPreviewFrame(vid);
        }
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [items.length, playStripPreviews, activeIndex, reelsAudioActive]);

  return (
    <div
      ref={blockRef}
      className="flex w-full flex-col overflow-x-hidden max-md:h-auto max-md:flex-none md:h-auto md:min-h-0 md:flex-none"
    >
      <div
        role={footer ? "group" : undefined}
        aria-label={footer ? "Reel previews, sound, and social links" : undefined}
        className="mx-auto flex w-full max-w-6xl flex-col gap-4 max-md:w-full max-md:flex-none max-md:gap-4 md:h-auto md:min-h-0 md:flex-none md:gap-6 md:justify-start lg:max-w-7xl xl:max-w-[min(100%,90rem)]"
      >
        <div
          className="mx-auto flex min-h-0 w-full max-w-full max-md:w-[min(90vw,24rem)] max-md:aspect-[9/13] max-md:h-auto max-md:flex-1 flex-row overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-[#231a18] shadow-[0_16px_44px_rgba(75,64,56,0.07)] [--reel-active-flex:5.6_1_0%] [--reel-inactive-flex:0.72_1_0%] max-md:[--reel-active-flex:3.8_1_0%] max-md:[--reel-inactive-flex:1.4_1_0%] max-md:max-h-none max-md:flex-none max-md:self-center md:h-[min(46rem,calc(100svh-11rem))] md:min-h-0 md:flex-none md:bg-[var(--color-surface)] md:[--reel-active-flex:3.1_1_0%] md:[--reel-inactive-flex:1.1_1_0%]"
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index;
            const posterUrl = item.poster?.trim()
              ? withAssetPath(item.poster.trim())
              : undefined;
            const shouldPlayAudio = reelsAudioActive && isActive;
            const locationLabel = item.description.replace(/^reel\s*[—-]\s*/i, "ON LOCATION — ");
            const locationBreak = locationLabel.match(/^(.*?[—-])\s*(.*)$/);

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
                className={`group relative flex min-h-0 flex-1 flex-col justify-end overflow-hidden border-r border-[var(--color-border)] text-left transition-[flex,box-shadow] duration-700 ease-in-out last:border-r-0 first:rounded-l-[1.5rem] last:rounded-r-[1.5rem] max-md:border-r-0 max-md:flex-1 md:flex-1 md:rounded-none md:border-r md:border-b-0 md:last:border-r-0 md:first:rounded-l-[1.5rem] md:first:rounded-tr-none md:last:rounded-r-[1.5rem] md:last:rounded-bl-none ${
                  isActive ? "min-w-[2.35rem] max-md:min-w-0" : "min-w-[1.2rem] max-md:min-w-0"
                } md:min-w-[2.5rem]`}
                style={{
                  ...stripFlexStyle,
                  boxShadow: isActive
                    ? "0 18px 42px rgba(75, 64, 56, 0.1)"
                    : "0 8px 22px rgba(75, 64, 56, 0.05)",
                  zIndex: isActive ? 10 : 1,
                }}
                onClick={() => {
                  const target = videoRefs.current[index];
                  if (target) {
                    target.preload = "auto";
                    if (!primedVideoIndicesRef.current.has(index)) {
                      try {
                        target.load();
                        primedVideoIndicesRef.current.add(index);
                      } catch {
                        /* ignore */
                      }
                    }
                    target.muted = true;
                    void target.play().catch(() => {});
                  }
                  if (activeIndex !== index) {
                    setActiveIndex(index);
                  }
                }}
                onMouseEnter={() => {
                  if (!reelHoverSwitchEnabled) return;
                  if (activeIndex !== index) {
                    setActiveIndex(index);
                  }
                }}
              >
                <div
                  id={`reel-panel-${index}`}
                  className="absolute inset-0 bg-[#231a18]"
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
                      className="pointer-events-none absolute inset-0 h-full w-full bg-[#231a18] object-cover object-center transform-gpu"
                      src={reelVideoSrc(item.videoSrc)}
                      poster={posterUrl}
                      {...inlineLoopingVideoProps}
                      muted={!shouldPlayAudio}
                      loop
                      autoPlay
                      preload={sectionInView && (isActive || index === (activeIndex + 1) % items.length)
                        ? "auto"
                        : "metadata"}
                      {...(index < 2
                        ? ({ fetchPriority: "high" } as VideoHTMLAttributes<HTMLVideoElement>)
                        : ({ fetchPriority: "low" } as VideoHTMLAttributes<HTMLVideoElement>))}
                      aria-label={item.title}
                      onLoadedMetadata={(e) => {
                        const v = e.currentTarget;
                        if (playStripPreviews) {
                          requestAnimationFrame(() => paintPreviewFrame(v));
                        }
                        void v.play().catch(() => {});
                      }}
                      onLoadedData={(e) => {
                        const v = e.currentTarget;
                        if (playStripPreviews) {
                          requestAnimationFrame(() => paintPreviewFrame(v));
                        }
                        void v.play().catch(() => {});
                      }}
                      onCanPlay={(e) => {
                        void e.currentTarget.play().catch(() => {});
                      }}
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgb(90_45_50_/_0.55)] via-[rgb(90_45_50_/_0.32)] to-transparent"
                    aria-hidden
                  />
                </div>

                {isActive ? (
                  <div className="relative z-[2] flex w-full items-end justify-start px-3 py-4 md:px-5 md:py-5">
                    <div className="min-w-0 max-w-full text-left text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                      <p
                        className={`${brandSubtitleClassName} text-[0.54rem] font-semibold uppercase tracking-[0.1em] text-white/90 max-md:line-clamp-2 max-md:break-words max-md:leading-[1.34] md:truncate md:whitespace-nowrap md:text-[0.72rem] md:tracking-[0.12em] md:leading-[1.15]`}
                      >
                        {locationBreak ? (
                          <>
                            <span className="md:hidden">
                              {locationBreak[1]}
                              <br />
                              {locationBreak[2]}
                            </span>
                            <span className="hidden md:inline">{locationLabel}</span>
                          </>
                        ) : (
                          locationLabel
                        )}
                      </p>
                    </div>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        {sectionInView ? (
          <div className="flex w-full shrink-0 justify-center px-1">
            <button
              type="button"
              className={soundToggleButtonClassName(
                "sound-toggle-button--home sound-toggle-button--home-text",
              )}
              aria-pressed={reelsSoundOn}
              aria-label={
                reelsSoundOn ? "Sound off — mute reel audio" : "Sound on — play reel audio"
              }
              onClick={() => {
                setReelsSoundOn((v) => !v);
              }}
            >
              <span className="block w-full px-px text-center leading-[1.35]">
                {reelsSoundOn ? "Sound off" : "Sound on"}
              </span>
            </button>
          </div>
        ) : null}

        {footer ? (
          <div className="flex w-full shrink-0 justify-center px-1">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
