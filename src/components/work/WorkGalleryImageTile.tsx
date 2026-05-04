"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

/** Hoelang de caption na een tik zichtbaar blijft op mobiel (~3s). */
const CAPTION_AUTO_HIDE_MS = 2_000;

export function WorkGalleryImageTile({
  item,
  sizes,
  isPriorityImage,
  figureCornerClass,
  imageCornerClass,
}: WorkGalleryImageTileProps) {
  const [captionOpen, setCaptionOpen] = useState(false);
  const hideCaptionAfterTapRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (hideCaptionAfterTapRef.current) {
        clearTimeout(hideCaptionAfterTapRef.current);
      }
    },
    [],
  );

  const flashCaptionOnTap = () => {
    if (hideCaptionAfterTapRef.current) {
      clearTimeout(hideCaptionAfterTapRef.current);
    }
    setCaptionOpen(true);
    hideCaptionAfterTapRef.current = setTimeout(() => {
      setCaptionOpen(false);
      hideCaptionAfterTapRef.current = null;
    }, CAPTION_AUTO_HIDE_MS);
  };
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

  return (
    <figure
      data-gallery-hover-tile
      role={hasCaption ? "button" : undefined}
      tabIndex={hasCaption ? 0 : undefined}
      aria-expanded={hasCaption ? captionOpen : undefined}
      aria-label={hasCaption ? captionSummary : undefined}
      onClick={() => {
        if (!hasCaption) return;
        if (typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches) {
          return;
        }
        flashCaptionOnTap();
      }}
      onKeyDown={(e) => {
        if (!hasCaption) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches) {
            return;
          }
          flashCaptionOnTap();
        }
      }}
      className={cn(
        figureCornerClass,
        "work-gallery-tile group relative isolate outline-none focus-visible:outline-none",
        "min-h-0 w-full min-w-0 overflow-hidden rounded-none border-0 bg-[var(--color-surface)]",
        "max-[899px]:aspect-[3/4] min-[900px]:h-full",
        hasCaption && captionOpen && "work-gallery-tile--caption-open",
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
        quality={isPriorityImage ? 90 : 82}
        priority={isPriorityImage}
        loading={isPriorityImage ? "eager" : "lazy"}
        fetchPriority={isPriorityImage ? "high" : "auto"}
        draggable={false}
      />
      {hasCaption ? (
        <div className="work-gallery-tile-overlays pointer-events-none absolute inset-0 z-[1]" aria-hidden>
          <div className={workGalleryImageGradientClass} />
          <div className={cn(workGalleryImageHoverWashClass, figureCornerClass)} />
          <div className={workGalleryCaptionWrapClass}>
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
        </div>
      ) : null}
    </figure>
  );
}
