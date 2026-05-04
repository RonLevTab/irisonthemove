"use client";

import { cn } from "@/lib/utils";

type WorkPortfolioVideoSoundButtonProps = {
  muted: boolean;
  onPress: () => void;
  className?: string;
};

/**
 * Text control (same wording as homepage reels): tap toggles mute; label shows the action.
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
        "mx-auto mt-2 inline-flex shrink-0 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))] bg-[var(--color-surface)] px-3 py-2 font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[var(--color-primary)] shadow-[0_6px_18px_rgba(90,45,50,0.1)] transition-[color,background-color,border-color,box-shadow] hover:border-[var(--color-primary)] hover:bg-[var(--color-background)] hover:shadow-[0_10px_22px_rgba(90,45,50,0.15)] sm:mt-3 sm:px-4 sm:py-2.5 sm:text-xs sm:tracking-[0.16em]",
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
