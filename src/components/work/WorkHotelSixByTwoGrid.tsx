"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  workGalleryCaptionPrimaryClass,
  workGalleryCaptionSecondaryClass,
  workGalleryCaptionWrapClass,
  workGalleryImageGradientClass,
  workGalleryImageHoverWashClass,
} from "@/lib/workGalleryImageCaptionClasses";
import {
  locationToThreeLines,
  workHoverLineClampClass,
  workHoverVenueNameClass,
} from "@/lib/workGalleryLocationLines";

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
      {slice.map((item, index) => {
        const label = item.location.trim();
        const { line1, line2, line3 } = label ? locationToThreeLines(label) : { line1: "", line2: "", line3: "" };
        const hasCaption = Boolean(line1 || line2 || line3);
        const isPriorityImage = index < priorityFirstImages;
        const objectPositionClass =
          item.objectPosition === "top"
            ? "object-top"
            : item.objectPosition === "bottom"
              ? "object-bottom"
              : "object-center";

        return (
          <figure
            key={`hotel-tile-${item.image}-${index}`}
            className={cn(
              "group relative isolate min-h-0 w-full min-w-0 overflow-hidden rounded-none border-0 bg-[var(--color-surface)]",
              "max-[899px]:aspect-[3/4] min-[900px]:h-full",
              OUTER_CORNER_AT_INDEX[index],
              hasCaption && "cursor-default",
            )}
          >
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              className={cn(
                "object-cover",
                objectPositionClass,
                OUTER_CORNER_AT_INDEX[index] ?? "rounded-none",
              )}
              sizes={SIZES_HOTEL}
              priority={isPriorityImage}
              loading={isPriorityImage ? "eager" : "lazy"}
            />
            {hasCaption ? (
              <>
                <div className={workGalleryImageGradientClass} aria-hidden />
                <div
                  className={cn(workGalleryImageHoverWashClass, OUTER_CORNER_AT_INDEX[index])}
                  aria-hidden
                />
                <div className={workGalleryCaptionWrapClass} aria-hidden>
                  {line1 ? (
                    <span className={cn(workGalleryCaptionPrimaryClass, workHoverVenueNameClass)}>
                      {line1}
                    </span>
                  ) : null}
                  {line2 ? (
                    <span className={cn(workGalleryCaptionSecondaryClass, workHoverLineClampClass)}>
                      {line2}
                    </span>
                  ) : null}
                  {line3 ? (
                    <span className={cn(workGalleryCaptionSecondaryClass, workHoverLineClampClass)}>
                      {line3}
                    </span>
                  ) : null}
                </div>
              </>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
