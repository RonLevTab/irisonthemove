"use client";

import { soundToggleButtonClassName } from "@/lib/soundToggleButtonClassName";
import { cn } from "@/lib/utils";

type WorkPortfolioVideoSoundButtonProps = {
  muted: boolean;
  onPress: () => void;
  className?: string;
};

/**
 * Pill control — warm oak hover border; Castoro label centered in the pill.
 */
export function WorkPortfolioVideoSoundButton({
  muted,
  onPress,
  className,
}: WorkPortfolioVideoSoundButtonProps) {
  return (
    <button
      type="button"
      className={cn(soundToggleButtonClassName("mx-auto mt-2 sm:mt-3"), className)}
      aria-pressed={!muted}
      aria-label={
        muted
          ? "Sound on — play video with audio from the start"
          : "Sound off — mute video"
      }
      onClick={onPress}
    >
      <span className="block w-full text-center leading-none">
        {muted ? "Sound on" : "Sound off"}
      </span>
    </button>
  );
}
