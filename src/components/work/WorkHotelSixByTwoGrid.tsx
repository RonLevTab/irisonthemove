"use client";

import { cn } from "@/lib/utils";
import { WorkGalleryImageTile } from "@/components/work/WorkGalleryImageTile";

import type { WorkGalleryItem } from "@/components/work/WorkExpandingImageGrid";

const CELLS = 12;

const SIZES_HOTEL = "(max-width: 900px) 33vw, 17vw";

const OUTER_CORNER_AT_INDEX: Record<number, string> = {
  0: "min-[900px]:rounded-tl-[1.5rem]",
  5: "min-[900px]:rounded-tr-[1.5rem]",
  6: "min-[900px]:rounded-bl-[1.5rem]",
  11: "min-[900px]:rounded-br-[1.5rem]",
};

type WorkHotelSixByTwoGridProps = {
  items: WorkGalleryItem[];
  /** Number of initially visible images to preload for the first work section. */
  priorityFirstImages?: number;
};

/**
 * Hotels: **6×2** portrait tiles on desktop; below the `min-[900px]` breakpoint a **3×4** grid
 * (same 12 cells, narrow gutters).
 */
export function WorkHotelSixByTwoGrid({
  items,
  priorityFirstImages = 0,
}: WorkHotelSixByTwoGridProps) {
  const slice = items.slice(0, CELLS);

  return (
    <div
      className={cn(
        "relative z-0 grid min-h-0 min-w-0 w-full",
        "max-[899px]:overflow-hidden max-[899px]:rounded-[1.5rem]",
        "max-[899px]:border max-[899px]:border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)]",
        "max-[899px]:bg-[var(--color-surface)]",
        "max-[899px]:shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
        "grid-cols-3 gap-1",
        "max-[899px]:[grid-auto-rows:1fr]",
        "min-[900px]:grid-cols-6 min-[900px]:grid-rows-2",
        "min-[900px]:[grid-template-columns:repeat(6,minmax(0,1fr))] min-[900px]:[grid-template-rows:repeat(2,minmax(0,1fr))] min-[900px]:gap-1",
        "min-[900px]:w-full min-[900px]:max-w-full",
        "min-[900px]:[aspect-ratio:9/4]",
      )}
    >
      {slice.map((item, index) => (
        <WorkGalleryImageTile
          key={`hotel-tile-${item.image}-${index}`}
          item={item}
          sizes={SIZES_HOTEL}
          isPriorityImage={index < priorityFirstImages}
          figureCornerClass={OUTER_CORNER_AT_INDEX[index]}
          imageCornerClass={OUTER_CORNER_AT_INDEX[index] ?? "rounded-none"}
        />
      ))}
    </div>
  );
}
