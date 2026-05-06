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

const WORK_VIDEO_OBJECT_CLASS =
  "h-full w-full bg-[#231a18] object-cover object-bottom transform-gpu";

type WorkTravelClip = { videoSrc: string; title?: string; poster?: string };

type WorkTravelVideoGridProps = {
  videos: WorkTravelClip[];
  stripAriaLabel: string;
  className?: string;
};

function TravelGridVideoCell({ item }: { item: WorkTravelClip }) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const instanceId = useId();
  const audio = useWorkPageVideoAudioOptional();

  const videoSrc = withAssetPath(stripVideoMediaFragment(item.videoSrc));
  const posterResolved = item.poster?.trim()
    ? withAssetPath(item.poster.trim())
    : undefined;

  usePlayPortfolioVideoOnVisible(shellRef, videoRef, videoSrc);

  useLayoutEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.defaultMuted = true;
    vid.muted = muted;
    vid.setAttribute("muted", "");
    vid.setAttribute("playsinline", "");
  }, [item.videoSrc, muted]);

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
    "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent",
    "shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
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
          preload="metadata"
          aria-label={item.title?.trim() || "Travel portfolio video clip"}
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

export function WorkTravelVideoGrid({
  videos,
  stripAriaLabel,
  className,
}: WorkTravelVideoGridProps) {
  const six = videos.slice(0, 6);

  if (six.length !== 6) {
    return null;
  }

  return (
    <div className="flex w-full justify-center">
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
          <TravelGridVideoCell key={`${item.videoSrc}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}
