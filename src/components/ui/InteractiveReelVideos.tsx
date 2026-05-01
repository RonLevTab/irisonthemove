"use client";

import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";

export type ReelVideoItem = {
  /** Public URL under `/public`, e.g. `/videos/social/reel-1.mp4` */
  videoSrc: string;
  title: string;
  description: string;
};

type InteractiveReelVideosProps = {
  items: ReelVideoItem[];
};

/**
 * Expanding strip selector with self-hosted MP4s (no Instagram chrome or scroll).
 */
function paintFirstFrame(video: HTMLVideoElement) {
  const apply = () => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  };
  apply();
}

export function InteractiveReelVideos({ items }: InteractiveReelVideosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIsPlaying, setActiveIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    setActiveIsPlaying(true);
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === activeIndex) {
        void vid.play().catch(() => setActiveIsPlaying(false));
      } else {
        vid.pause();
      }
    });
  }, [activeIndex]);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:gap-0">
        <div className="flex flex-col gap-3 md:hidden">
          {items.map((item) => (
            <article
              key={`${item.videoSrc}-mobile`}
              className="relative aspect-[9/16] w-full overflow-hidden rounded-[1.25rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-[#0f0f0f] shadow-[0_10px_28px_rgba(75,64,56,0.08)]"
            >
              <video
                className="absolute inset-0 h-full w-full object-cover object-center"
                src={item.videoSrc}
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
                disablePictureInPicture
                aria-label={item.title}
                onLoadedData={(e) => paintFirstFrame(e.currentTarget)}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black from-[8%] via-black/75 to-transparent"
                aria-hidden
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-3 z-[2] px-4 pb-4 text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)] sm:bottom-4">
                <p className="text-[1.18rem] font-semibold leading-tight">{item.title}</p>
                <p className="mt-1.5 text-[1.03rem] leading-snug text-white/90">{item.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden min-h-[33rem] w-full overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-[var(--color-surface)] shadow-[0_16px_44px_rgba(75,64,56,0.07)] md:flex md:h-[min(72svh,48rem)] md:flex-row">
          {items.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={item.videoSrc}
                type="button"
                aria-expanded={isActive}
                aria-controls={`reel-panel-${index}`}
                id={`reel-tab-${index}`}
                className="group relative flex min-h-[4.5rem] flex-none flex-col justify-end overflow-hidden border-[var(--color-border)] text-left transition-[flex,box-shadow] duration-700 ease-in-out first:rounded-t-[1.5rem] last:rounded-b-[1.5rem] md:min-h-0 md:min-w-[72px] md:flex-1 md:rounded-none md:border-r md:border-b-0 md:last:border-r-0 md:first:rounded-l-[1.5rem] md:first:rounded-tr-none md:last:rounded-r-[1.5rem] md:last:rounded-bl-none"
                style={{
                  flex: isActive ? "5 1 0%" : "1.35 1 0%",
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
                  className="absolute inset-0 bg-[#0f0f0f]"
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
                      src={item.videoSrc}
                      playsInline
                      muted
                      loop
                      preload="auto"
                      disablePictureInPicture
                      aria-label={
                        isActive
                          ? `${activeIsPlaying ? "Pause" : "Play"} — ${item.title}`
                          : item.title
                      }
                      onLoadedData={(e) => paintFirstFrame(e.currentTarget)}
                      onPlay={() => {
                        if (index === activeIndex) setActiveIsPlaying(true);
                      }}
                      onPause={() => {
                        if (index === activeIndex) setActiveIsPlaying(false);
                      }}
                    />
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black from-[8%] via-black/75 to-transparent"
                    aria-hidden
                  />
                </div>

                <div className="relative z-[2] flex w-full items-center justify-center gap-3 px-3 py-4 md:justify-start md:px-4 md:py-5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/25 bg-black/55 text-white shadow-md backdrop-blur-sm"
                    onClick={(e) => {
                      if (!isActive) return;
                      e.stopPropagation();
                      const v = videoRefs.current[index];
                      if (!v) return;
                      if (v.paused) void v.play();
                      else v.pause();
                    }}
                  >
                    {isActive && activeIsPlaying ? (
                      <FaPause className="h-5 w-5" aria-hidden />
                    ) : (
                      <FaPlay className="h-5 w-5" aria-hidden />
                    )}
                  </span>
                  <div
                    className={`min-w-0 flex-1 text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)] ${!isActive ? "md:hidden" : ""}`}
                  >
                    <p className="truncate font-semibold leading-tight md:text-lg">
                      {item.title}
                    </p>
                    {isActive ? (
                      <p className="text-sm text-white/80">{item.description}</p>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
