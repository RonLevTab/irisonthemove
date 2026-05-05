"use client";

import { FaVolumeHigh, FaVolumeXmark } from "react-icons/fa6";

import { soundToggleButtonClassName } from "@/lib/soundToggleButtonClassName";
import { cn } from "@/lib/utils";

type WorkPortfolioVideoSoundButtonProps = {
  muted: boolean;
  onPress: () => void;
  className?: string;
};

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
      className={cn(
        soundToggleButtonClassName(workVideoSoundButtonSpacing),
        "bg-white text-[var(--color-primary)] shadow-[0_6px_16px_rgba(0,0,0,0.22)]",
        "aria-pressed:bg-[linear-gradient(135deg,var(--color-primary)_0%,#6a373d_54%,var(--color-primary-mid)_100%)] aria-pressed:text-white aria-pressed:shadow-[0_13px_32px_rgba(90,45,50,0.16)]",
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
      {muted ? (
        <FaVolumeXmark className="h-[0.95rem] w-[0.95rem] md:h-[1.05rem] md:w-[1.05rem]" aria-hidden />
      ) : (
        <FaVolumeHigh className="h-[0.95rem] w-[0.95rem] md:h-[1.05rem] md:w-[1.05rem]" aria-hidden />
      )}
    </button>
  );
}
