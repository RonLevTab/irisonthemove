"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

import { useWorkPageVideoAudioOptional } from "@/components/work/WorkPageVideoAudioContext";
import { WorkPortfolioVideoSoundButton } from "@/components/work/WorkPortfolioVideoSoundButton";
import { usePlayPortfolioVideoOnVisible } from "@/components/work/usePlayPortfolioVideoOnVisible";
import { withAssetPath } from "@/lib/assetPath";
import { inlineLoopingVideoProps } from "@/lib/inlineVideoHtmlProps";
import { stripVideoMediaFragment } from "@/lib/stripVideoMediaFragment";
import { cn } from "@/lib/utils";

/** Onder bewegende beelden: warm donker tijdens decode. */
const WORK_VIDEO_OBJECT_CLASS =
  "h-full w-full bg-[#231a18] object-cover object-bottom transform-gpu";

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
  embedded,
}: {
  clip: { videoSrc: string; title?: string; poster?: string };
  embedded: boolean;
}) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const instanceId = useId();
  const audio = useWorkPageVideoAudioOptional();

  const videoSrc = withAssetPath(stripVideoMediaFragment(clip.videoSrc));
  const posterResolved = clip.poster?.trim()
    ? withAssetPath(clip.poster.trim())
    : undefined;

  usePlayPortfolioVideoOnVisible(shellRef, videoRef, videoSrc);

  useLayoutEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.defaultMuted = true;
    vid.muted = muted;
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");
  }, [clip.videoSrc, muted]);

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

  const shellClass = cn(
    "relative aspect-[3/4] min-h-0 w-full min-w-0 overflow-hidden",
    embedded
      ? "rounded-none border-0 bg-transparent shadow-none"
      : "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
  );

  return (
    <div className="flex min-w-0 w-full">
      <div ref={shellRef} className={shellClass}>
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterResolved}
          className={WORK_VIDEO_OBJECT_CLASS}
          {...inlineLoopingVideoProps}
          muted={muted}
          loop
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
 * Three reel-style slots (MP4 of placeholder). Afspelen start bij scroll-in vanaf frame 0.
 */
export function WorkCategoryTripleVideoRow({
  videos,
  className,
  variant = "default",
}: WorkCategoryTripleVideoRowProps) {
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
          : "grid-cols-1 gap-x-0 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-0 min-[1200px]:gap-x-6",
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
            <TripleRowVideoCell key={key} clip={clip} embedded={embedded} />
          );
        }

        return null;
      })}
    </div>
  );
}
