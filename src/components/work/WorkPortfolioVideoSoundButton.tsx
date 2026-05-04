"use client";

import {
  brandSubtitleClassName,
} from "@/lib/brandFonts";
import { cn } from "@/lib/utils";

type WorkPortfolioVideoSoundButtonProps = {
  muted: boolean;
  onPress: () => void;
  className?: string;
};

/**
 * Pill control — warm oak-style border that strengthens on hover; Castoro “On The Move” scale,
 * slightly tighter than the earlier icon pills.
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
        "mx-auto mt-2 inline-flex shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))] bg-[var(--color-surface)] px-2.5 py-1.5 font-normal uppercase tracking-[0.18em] text-[var(--color-primary)] shadow-[0_5px_16px_rgba(90,45,50,0.09)] outline-none transition-[color,background-color,border-color,box-shadow] hover:border-[var(--color-primary)] hover:bg-[var(--color-background)] hover:shadow-[0_8px_22px_rgba(90,45,50,0.14)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] sm:mt-3 sm:px-3 sm:py-1.5",
        brandSubtitleClassName,
        "text-[0.54rem] sm:text-[0.58rem]",
        className,
      )}
      aria-pressed={!muted}
      aria-label={
        muted
          ? "Sound on — play video with audio from the start"
          : "Sound off — mute video"
      }
      onClick={onPress}
    >
      {muted ? "Sound on" : "Sound off"}
    </button>
  );
}
