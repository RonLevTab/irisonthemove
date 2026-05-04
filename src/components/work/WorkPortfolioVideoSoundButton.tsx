"use client";

import {
  brandSubtitleClassName,
  brandWordmarkNavSubtitleTextSizeClassName,
} from "@/lib/brandFonts";
import { cn } from "@/lib/utils";

type WorkPortfolioVideoSoundButtonProps = {
  muted: boolean;
  onPress: () => void;
  className?: string;
};

/**
 * Plain text control — same Castoro/small caps rhythm as “On The Move” in the wordmark.
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
        "mx-auto mt-2 inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 font-normal uppercase tracking-[0.18em] text-[var(--color-primary)] shadow-none outline-none transition-opacity hover:opacity-75 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] sm:mt-3",
        brandSubtitleClassName,
        brandWordmarkNavSubtitleTextSizeClassName,
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
