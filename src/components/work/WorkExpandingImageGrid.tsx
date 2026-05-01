"use client";

import Image from "next/image";

import { brandSubtitleClassName } from "@/lib/brandFonts";
import { cn } from "@/lib/utils";

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
};

/**
 * 3×3 of tiles; every cell and the full block use portrait 3:4 (width:height),
 * not square. Desktop: size from the section height (width = 3/4 of height)
 * so flex layout does not override aspect and read as 1:1.
 */
const SIZES_SINGLE = "(max-width: 900px) 100vw, 33vw";
const SIZES_HALF = "(max-width: 1199px) 100vw, 20vw";

/** Same radius as `InteractiveReelVideos` — 3×3 corner cells only (indices 0,2,6,8 / 1,3,7,9). */
const OUTER_CORNER_AT_INDEX: Record<number, string> = {
  0: "min-[900px]:rounded-tl-[1.5rem]",
  2: "min-[900px]:rounded-tr-[1.5rem]",
  6: "min-[900px]:rounded-bl-[1.5rem]",
  8: "min-[900px]:rounded-br-[1.5rem]",
};

/** `Venue, City, Country` → three lines (splits on last two `", "` segments). */
function splitVenueCityCountry(raw: string): {
  venue: string;
  city: string;
  country: string;
} | null {
  const text = raw.trim();
  const last = text.lastIndexOf(", ");
  if (last <= 0) return null;
  const country = text.slice(last + 2).trim();
  const rest = text.slice(0, last).trim();
  const mid = rest.lastIndexOf(", ");
  if (mid <= 0) return null;
  const city = rest.slice(mid + 2).trim();
  const venue = rest.slice(0, mid).trim();
  if (!venue || !city || !country) return null;
  return { venue, city, country };
}

const HOVER_LABEL_TYPE = cn(
  brandSubtitleClassName,
  "font-normal uppercase tracking-[0.11em]",
  "text-[#ebe3d9] [text-shadow:0_1px_12px_rgba(58,32,28,0.55),0_0_1px_rgba(42,24,22,0.35)]",
  "text-[0.42rem] leading-[1.15] sm:text-[0.46rem] min-[900px]:text-[0.48rem] min-[1200px]:text-[0.52rem]",
);

export function WorkExpandingImageGrid({
  items,
  gridSlot = "single",
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
          "grid-cols-1 gap-1 p-0 sm:max-[899px]:grid-cols-2 sm:max-[899px]:gap-1.5",
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
          const triple = label ? splitVenueCityCountry(label) : null;
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
                "group relative min-h-0 w-full min-w-0 overflow-hidden border-0 bg-[var(--color-surface)]",
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
                sizes={sizeHint}
              />
              {label ? (
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-1.5 py-2 sm:px-2 sm:py-2.5",
                    "bg-transparent transition-[background-color] duration-300 ease-out",
                    "group-hover:bg-[color-mix(in_srgb,var(--color-primary)_22%,rgba(58,38,34,0.22))]",
                  )}
                  aria-hidden
                >
                  <div
                    className={cn(
                      "max-w-[min(100%,12.5rem)] text-center opacity-0 transition-opacity duration-300 ease-out sm:max-w-[min(100%,14rem)] min-[1200px]:max-w-[min(100%,15rem)]",
                      "group-hover:opacity-100",
                    )}
                  >
                    {triple ? (
                      <div
                        className={cn(
                          HOVER_LABEL_TYPE,
                          "flex flex-col items-center gap-y-0.5 sm:gap-y-1",
                        )}
                      >
                        <span className="block max-w-full text-pretty">
                          {triple.venue}
                        </span>
                        <span className="block max-w-full text-pretty">
                          {triple.city}
                        </span>
                        <span className="block max-w-full text-pretty">
                          {triple.country}
                        </span>
                      </div>
                    ) : (
                      <p
                        className={cn(
                          HOVER_LABEL_TYPE,
                          "text-pretty leading-snug tracking-[0.14em] sm:tracking-[0.16em]",
                        )}
                      >
                        {label}
                      </p>
                    )}
                  </div>
                </div>
              ) : null}
            </figure>
          );
        })}
      </div>
    </div>
  );
}
