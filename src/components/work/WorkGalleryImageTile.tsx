"use client";

import Image from "next/image";
import { useState } from "react";

import type { WorkGalleryItem } from "@/components/work/WorkExpandingImageGrid";
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

export type WorkGalleryImageTileProps = {
  item: WorkGalleryItem;
  sizes: string;
  isPriorityImage: boolean;
  /** Corner radius classes for the `<figure>` (outer grid rounding). */
  figureCornerClass?: string;
  /** Same index map passed to `Image` for large-screen rounding. */
  imageCornerClass?: string;
};

export function WorkGalleryImageTile({
  item,
  sizes,
  isPriorityImage,
  figureCornerClass,
  imageCornerClass,
}: WorkGalleryImageTileProps) {
  const [captionOpen, setCaptionOpen] = useState(false);
  const label = item.location.trim();
  const { line1, line2, line3 } = label ? locationToThreeLines(label) : { line1: "", line2: "", line3: "" };
  const hasCaption = Boolean(line1 || line2 || line3);
  const objectPositionClass =
    item.objectPosition === "top"
      ? "object-top"
      : item.objectPosition === "bottom"
        ? "object-bottom"
        : "object-center";

  const captionSummary = [line1, line2, line3].filter(Boolean).join(", ");
  const showCaptionOnTouch = captionOpen ? "max-[899px]:!opacity-100" : "";

  return (
    <figure
      role={hasCaption ? "button" : undefined}
      tabIndex={hasCaption ? 0 : undefined}
      aria-expanded={hasCaption ? captionOpen : undefined}
      aria-label={hasCaption ? captionSummary : undefined}
      onClick={() => hasCaption && setCaptionOpen((v) => !v)}
      onKeyDown={(e) => {
        if (!hasCaption) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setCaptionOpen((v) => !v);
        }
      }}
      className={cn(
        figureCornerClass,
        "group relative isolate min-h-0 w-full min-w-0 overflow-hidden rounded-none border-0 bg-[var(--color-surface)]",
        "max-[899px]:aspect-[3/4] min-[900px]:h-full",
        hasCaption && "cursor-pointer min-[900px]:cursor-default",
      )}
    >
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        className={cn(
          "object-cover",
          objectPositionClass,
          imageCornerClass ?? "rounded-none",
        )}
        sizes={sizes}
        priority={isPriorityImage}
        loading={isPriorityImage ? "eager" : "lazy"}
        draggable={false}
      />
      {hasCaption ? (
        <>
          <div className={cn(workGalleryImageGradientClass, showCaptionOnTouch)} aria-hidden />
          <div
            className={cn(workGalleryImageHoverWashClass, figureCornerClass, showCaptionOnTouch)}
            aria-hidden
          />
          <div className={cn(workGalleryCaptionWrapClass, showCaptionOnTouch)} aria-hidden>
            {line1 ? (
              <span className={cn(workGalleryCaptionPrimaryClass, workHoverVenueNameClass)}>{line1}</span>
            ) : null}
            {line2 ? (
              <span className={cn(workGalleryCaptionSecondaryClass, workHoverLineClampClass)}>{line2}</span>
            ) : null}
            {line3 ? (
              <span className={cn(workGalleryCaptionSecondaryClass, workHoverLineClampClass)}>{line3}</span>
            ) : null}
          </div>
        </>
      ) : null}
    </figure>
  );
}
