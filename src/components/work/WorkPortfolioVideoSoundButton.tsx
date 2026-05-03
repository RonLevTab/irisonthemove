"use client";

import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";

import { cn } from "@/lib/utils";

type WorkPortfolioVideoSoundButtonProps = {
  muted: boolean;
  onPress: () => void;
  className?: string;
};

/**
 * Same speaker control pattern as homepage reels (`InteractiveReelVideos`):
 * tap toggles mute; icon shows the action (high = currently muted / tap for sound).
 */
export function WorkPortfolioVideoSoundButton({
  muted,
  onPress,
  className,
}: WorkPortfolioVideoSoundButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "mx-auto mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[0_6px_18px_rgba(90,45,50,0.1)] transition-[color,background-color,border-color,box-shadow] hover:border-[var(--color-primary)] hover:bg-[var(--color-background)] hover:shadow-[0_10px_22px_rgba(90,45,50,0.15)] sm:mt-3 sm:h-10 sm:w-10",
        className,
      )}
      aria-pressed={!muted}
      aria-label={
        muted
          ? "Turn sound on and play video from the start"
          : "Mute and play video from the start"
      }
      onClick={onPress}
    >
      {muted ? (
        <FaVolumeHigh
          className="h-[1rem] w-[1rem] sm:h-[1.05rem] sm:w-[1.05rem]"
          aria-hidden
        />
      ) : (
        <FaVolumeXmark
          className="h-[1rem] w-[1rem] sm:h-[1.05rem] sm:w-[1.05rem]"
          aria-hidden
        />
      )}
    </button>
  );
}
