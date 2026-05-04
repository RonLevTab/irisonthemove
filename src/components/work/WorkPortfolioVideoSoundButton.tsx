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
 * Spacing is shared everywhere (travel grid + triple rows): same gap under each video,
 * Phone: tighter under the pill + slightly tighter under the video; desktop unchanged.
 */
const workVideoSoundButtonSpacing =
  "mx-auto mt-2 mb-0 shrink-0 sm:mt-3 sm:mb-1.5 md:mb-2";

export function WorkPortfolioVideoSoundButton({
  muted,
  onPress,
  className,
}: WorkPortfolioVideoSoundButtonProps) {
  return (
    <button
      type="button"
      className={cn(soundToggleButtonClassName(workVideoSoundButtonSpacing), className)}
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
