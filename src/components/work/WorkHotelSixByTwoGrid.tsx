"use client";

import Image from "next/image";

import { brandSubtitleClassName } from "@/lib/brandFonts";
import { cn } from "@/lib/utils";

import type { WorkGalleryItem } from "@/components/work/WorkExpandingImageGrid";

const CELLS = 12;

const SIZES_HOTEL = "(max-width: 900px) 33vw, 17vw";

/** Split hover location text into stacked lines. */
function splitLocationLines(raw: string): string[] {
  const text = raw.trim();
  if (!text) return [];

  const commaLines = text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (commaLines.length > 1) {
    return commaLines;
  }

  const periodLines = text
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
  if (periodLines.length > 1) {
    return periodLines;
  }

  return [text];
}

const HOVER_LABEL_TYPE = cn(
  brandSubtitleClassName,
  "font-normal uppercase tracking-[0.11em]",
  "text-[#ebe3d9] [text-shadow:0_1px_12px_rgba(58,32,28,0.55),0_0_1px_rgba(42,24,22,0.35)]",
  "text-[0.38rem] leading-[1.15] sm:text-[0.42rem] min-[900px]:text-[0.44rem] min-[1200px]:text-[0.48rem]",
);

const OUTER_CORNER_AT_INDEX: Record<number, string> = {
  0: "min-[900px]:rounded-tl-[1.5rem]",
  5: "min-[900px]:rounded-tr-[1.5rem]",
  6: "min-[900px]:rounded-bl-[1.5rem]",
  11: "min-[900px]:rounded-br-[1.5rem]",
};

type WorkHotelSixByTwoGridProps = {
  items: WorkGalleryItem[];
};

/**
 * Hotels: **6×2** portrait tiles on desktop; below the `min-[900px]` breakpoint a **3×4** grid
 * (same 12 cells, narrow gutters).
 */
export function WorkHotelSixByTwoGrid({ items }: WorkHotelSixByTwoGridProps) {
  const slice = items.slice(0, CELLS);

  return (
    <div
      className={cn(
        "relative z-0 grid min-h-0 min-w-0 w-full",
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
        const locationLines = label ? splitLocationLines(label) : [];
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
              "group relative min-h-0 w-full min-w-0 overflow-hidden rounded-none border-0 bg-[var(--color-surface)]",
              "max-[899px]:aspect-[3/4] min-[900px]:h-full",
              OUTER_CORNER_AT_INDEX[index],
              label && "cursor-default",
            )}
          >
            <Image
              src={item.image}
              alt={item.imageAlt}
              fill
              className={cn(
                "object-cover transition-[opacity,filter] duration-300 ease-out",
                objectPositionClass,
                "group-hover:opacity-[0.68] group-hover:[filter:sepia(0.06)_saturate(0.96)_brightness(0.97)]",
                OUTER_CORNER_AT_INDEX[index] ?? "rounded-none",
              )}
              sizes={SIZES_HOTEL}
            />
            {label ? (
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-1 py-1.5 sm:px-1.5 sm:py-2",
                  "bg-transparent transition-[background-color] duration-300 ease-out",
                  "group-hover:bg-[color-mix(in_srgb,var(--color-primary)_22%,rgba(58,38,34,0.22))]",
                )}
                aria-hidden
              >
                <div
                  className={cn(
                    "max-w-[min(100%,10rem)] text-center opacity-0 transition-opacity duration-300 ease-out sm:max-w-[min(100%,12rem)]",
                    "group-hover:opacity-100",
                  )}
                >
                  <div
                    className={cn(
                      HOVER_LABEL_TYPE,
                      "flex flex-col items-center gap-y-0.5 text-pretty leading-snug tracking-[0.12em]",
                    )}
                  >
                    {locationLines.map((line) => (
                      <span key={line} className="block max-w-full text-pretty">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
