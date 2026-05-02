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

export type WorkGalleryItem = {
  image: string;
  imageAlt: string;
  location: string;
  /** Vertical anchor for `object-cover` (default: center). */
  objectPosition?: "top" | "center" | "bottom";
};

const CELLS = 9;

type WorkExpandingImageGridProps = {
  items: WorkGalleryItem[];
  /** Slightly different `sizes` hint when a pair sits side by side. */
  gridSlot?: "single" | "half";
  /** Number of initially visible images to preload for the first work section. */
  priorityFirstImages?: number;
};

/**
 * 3×3 of tiles; every cell and the full block use portrait 3:4 (width:height),
 * not square. Desktop: size from the section height (width = 3/4 of height)
 * so flex layout does not override aspect and read as 1:1.
 */
const SIZES_SINGLE = "(max-width: 899px) 33vw, (max-width: 900px) 100vw, 33vw";
const SIZES_HALF = "(max-width: 899px) 33vw, (max-width: 1199px) 100vw, 20vw";

/** Same radius as `InteractiveReelVideos` — 3×3 corner cells only (indices 0,2,6,8 / 1,3,7,9). */
const OUTER_CORNER_AT_INDEX: Record<number, string> = {
  0: "min-[900px]:rounded-tl-[1.5rem]",
  2: "min-[900px]:rounded-tr-[1.5rem]",
  6: "min-[900px]:rounded-bl-[1.5rem]",
  8: "min-[900px]:rounded-br-[1.5rem]",
};

export function WorkExpandingImageGrid({
  items,
  gridSlot = "single",
  priorityFirstImages = 0,
}: WorkExpandingImageGridProps) {
  const slice = items.slice(0, CELLS);
  const sizeHint = gridSlot === "half" ? SIZES_HALF : SIZES_SINGLE;

  return (
    <div
      className={cn(
        "max-[899px]:overflow-hidden max-[899px]:rounded-[1.5rem]",
        "max-[899px]:border max-[899px]:border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)]",
        "max-[899px]:bg-[var(--color-surface)]",
        "max-[899px]:shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
        "min-[900px]:contents",
      )}
    >
      <div
        className={cn(
          "relative z-0 grid min-h-0 min-w-0",
          "w-full max-[899px]:max-w-full",
          "grid-cols-3 gap-1 p-0",
          "min-[900px]:h-full min-[900px]:max-h-full",
          "min-[900px]:w-auto min-[900px]:max-w-full",
          "min-[900px]:[aspect-ratio:3/4]",
          "min-[900px]:grid-cols-3 min-[900px]:grid-rows-3",
          "min-[900px]:[grid-template-columns:repeat(3,minmax(0,1fr))] min-[900px]:[grid-template-rows:repeat(3,minmax(0,1fr))] min-[900px]:gap-1",
          "min-[900px]:self-center",
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
              key={`work-tile-${gridSlot}-${item.image}-${index}`}
              className={cn(
                "group relative isolate min-h-0 w-full min-w-0 overflow-hidden border-0 bg-[var(--color-surface)]",
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
                sizes={sizeHint}
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
    </div>
  );
}
