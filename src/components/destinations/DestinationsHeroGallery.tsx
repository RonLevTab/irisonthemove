"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { brandSubtitleClassName } from "@/lib/brandFonts";
import { withAssetPath } from "@/lib/assetPath";
import {
  balanceIntoColumns,
  tileHeightWeight,
  type MasonryEntry,
} from "@/lib/balanceMasonryColumns";
import { orderGalleryItemsForMasonry } from "@/lib/galleryDiversifyOrder";
import { displayAspectRatio } from "@/lib/galleryTileDisplay";
import type { DestinationGalleryItem } from "@/types/content";
import { cn } from "@/lib/utils";

/** Pick column count from the gallery’s real width (not the whole window), so Windows laptops with narrower browser chrome still get 5 columns when there’s room. */
function galleryColumnsForContainerWidth(widthPx: number): number {
  if (!Number.isFinite(widthPx) || widthPx < 420) {
    return 1;
  }
  if (widthPx < 660) {
    return 3;
  }
  return 5;
}

function useGalleryColumnCount(containerRef: React.RefObject<HTMLElement | null>): number {
  const [n, setN] = React.useState(2);

  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const read = () =>
      setN(galleryColumnsForContainerWidth(el.getBoundingClientRect().width));

    read();
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      setN(galleryColumnsForContainerWidth(w ?? el.getBoundingClientRect().width));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return n;
}

type TileSizeBucket = "large" | "mid" | "small";

function tileSizeBucket(item: DestinationGalleryItem): TileSizeBucket {
  const ratio = displayAspectRatio(item);
  if (!Number.isFinite(ratio) || ratio <= 0) {
    return "mid";
  }
  if (ratio < 0.9) {
    return "large";
  }
  if (ratio > 1.1) {
    return "small";
  }
  return "mid";
}

function rhythmColumnEntries(
  column: MasonryEntry<DestinationGalleryItem>[],
): MasonryEntry<DestinationGalleryItem>[] {
  const pool = column.slice();
  const out: MasonryEntry<DestinationGalleryItem>[] = [];

  while (pool.length > 0) {
    const previous = out[out.length - 1];
    const previousBucket = previous ? tileSizeBucket(previous.item) : null;
    const pickIndex = pool.findIndex(
      (entry) => tileSizeBucket(entry.item) !== previousBucket,
    );
    const [picked] = pool.splice(pickIndex >= 0 ? pickIndex : 0, 1);
    if (picked) {
      out.push(picked);
    }
  }

  return out;
}

type DestinationsHeroGalleryProps = {
  items: DestinationGalleryItem[];
  className?: string;
};

export function DestinationsHeroGallery({
  items,
  className,
}: DestinationsHeroGalleryProps) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const columnCount = useGalleryColumnCount(gridRef);

  const orderedItems = React.useMemo(
    () => orderGalleryItemsForMasonry(items),
    [items],
  );

  const entries = React.useMemo<MasonryEntry<DestinationGalleryItem>[]>(
    () =>
      orderedItems.map((item) => ({
        item,
        key: item.stableKey ?? item.src,
      })),
    [orderedItems],
  );

  const columns = React.useMemo(
    () => {
      const balanced = balanceIntoColumns(entries, columnCount, (it) =>
        tileHeightWeight(displayAspectRatio(it)),
      );

      return columnCount === 3 ? balanced.map(rhythmColumnEntries) : balanced;
    },
    [entries, columnCount],
  );

  const priorityKeys = React.useMemo(
    () => new Set(orderedItems.slice(0, 9).map((it) => it.stableKey ?? it.src)),
    [orderedItems],
  );

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center px-0 pb-0",
        className,
      )}
    >
      <div
        ref={gridRef}
        className={cn(
          "mx-auto flex w-full gap-2.5 sm:gap-5 lg:gap-6",
          columnCount >= 2 && "max-w-none",
          columnCount === 1 && "max-w-2xl flex-col",
          columnCount > 1 && "flex-row",
        )}
      >
        {columns.map((col, colIndex) => (
          <div
            key={colIndex}
            className={cn(
              "flex min-w-0 flex-col gap-2.5 sm:gap-5 lg:gap-6",
              columnCount > 1 && "flex-1",
            )}
          >
            {col.map((entry) => (
              <GalleryTile
                key={entry.key}
                item={entry.item}
                priority={priorityKeys.has(entry.key)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type GalleryTileProps = {
  item: DestinationGalleryItem;
  priority?: boolean;
};

function GalleryTile({ item, priority }: GalleryTileProps) {
  const [imgSrc, setImgSrc] = React.useState(() => withAssetPath(item.src));

  const handleError = () => {
    if (item.placeholder) {
      setImgSrc(withAssetPath(item.placeholder));
    }
  };

  const frame = (
    <AspectRatio
      ratio={displayAspectRatio(item)}
      className="bg-[var(--color-surface-strong)] rounded-xl border border-[var(--color-border)] shadow-[0_10px_32px_rgba(58,36,32,0.07)] transition-shadow duration-300 sm:rounded-2xl group-hover:shadow-[0_14px_40px_rgba(58,36,32,0.11)]"
    >
      <Image
        alt={item.alt}
        src={imgSrc}
        fill
        className="absolute inset-0 z-0 block size-full min-h-0 min-w-0 origin-center rounded-[inherit] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        sizes="(max-width: 419px) 100vw, (max-width: 659px) 33vw, 20vw"
        priority={priority}
        fetchPriority={priority ? "high" : "auto"}
        onError={handleError}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-gradient-to-t from-[rgba(50,43,39,0.82)] via-[rgba(50,43,39,0.15)] to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-2.5 z-[2] px-3 pb-2 pt-8 text-center sm:bottom-4 sm:px-4 sm:pb-2.5 sm:pt-9 md:bottom-5 md:pb-3">
        <p className="font-text-3 text-[0.86rem] font-semibold leading-tight tracking-wide text-[#fffbf7] drop-shadow-sm sm:text-lg md:text-[1.125rem]">
          {item.caption}
        </p>
        {item.captionLine2 ? (
          <p
            className={`${brandSubtitleClassName} mt-0.5 text-[0.62rem] font-normal uppercase leading-snug tracking-[0.14em] text-[#fffbf7]/90 sm:text-[0.875rem] sm:leading-normal sm:tracking-[0.16em] md:text-[0.95rem]`}
          >
            {item.captionLine2}
          </p>
        ) : null}
      </div>
    </AspectRatio>
  );

  return (
    <div className="group w-full">
      {item.href ? (
        <Link
          href={item.href}
          className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
        >
          {frame}
        </Link>
      ) : (
        frame
      )}
    </div>
  );
}
