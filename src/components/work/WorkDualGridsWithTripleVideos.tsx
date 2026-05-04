"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type { WorkCategoryTripleVideo } from "@/components/work/WorkCategoryTripleVideoRow";
import { WorkCategoryTripleVideoRow } from "@/components/work/WorkCategoryTripleVideoRow";
import type { WorkGalleryItem } from "@/components/work/WorkExpandingImageGrid";
import { WorkExpandingImageGrid } from "@/components/work/WorkExpandingImageGrid";

type WorkDualGridsWithTripleVideosProps = {
  stripAriaLabel: string;
  items: WorkGalleryItem[];
  tripleVideos?: WorkCategoryTripleVideo[];
  priorityFirstImages?: number;
};

/**
 * Two 3×3 grids plus an optional row of three videos. The video strip width is
 * bound to the measured width of the photo strip (ResizeObserver) so it never
 * extends past the grids — pure shrink-wrap + nested grids was not reliable.
 */
export function WorkDualGridsWithTripleVideos({
  stripAriaLabel,
  items,
  tripleVideos,
  priorityFirstImages = 0,
}: WorkDualGridsWithTripleVideosProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [stripWidthPx, setStripWidthPx] = useState<number | undefined>(undefined);

  const showVideos = Boolean(tripleVideos && tripleVideos.length === 3);

  useLayoutEffect(() => {
    if (!showVideos) return;
    const el = stripRef.current;
    if (!el) return;

    const read = () => {
      setStripWidthPx(Math.round(el.getBoundingClientRect().width));
    };

    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [showVideos]);

  return (
    <div className="flex w-full justify-center">
      {/*
        Strip → reels: same vertical steps as WorkTravelVideoGrid row gaps.
        Bottom padding stays light — work page section shell already adds outer padding.
      */}
      <div className="flex w-full max-w-full flex-col items-center gap-6 pb-2 max-md:gap-6 sm:gap-12 sm:pb-3 min-[1200px]:gap-14 min-[1200px]:pb-3">
        <div
          ref={stripRef}
          className="flex min-h-0 min-w-0 w-full flex-col gap-4 sm:gap-5 lg:flex-row lg:items-center lg:justify-center lg:gap-5 xl:gap-6"
          aria-label={stripAriaLabel}
        >
          <div className="min-[900px]:w-[calc((100%_-_1.25rem)/2)] min-[900px]:[aspect-ratio:3/4] min-[1200px]:w-[calc((100%_-_1.5rem)/2)] xl:w-[calc((100%_-_1.5rem)/2)]">
            <WorkExpandingImageGrid
              gridSlot="half"
              items={items.slice(0, 9)}
              priorityFirstImages={priorityFirstImages}
            />
          </div>
          <div className="min-[900px]:w-[calc((100%_-_1.25rem)/2)] min-[900px]:[aspect-ratio:3/4] min-[1200px]:w-[calc((100%_-_1.5rem)/2)] xl:w-[calc((100%_-_1.5rem)/2)]">
            <WorkExpandingImageGrid gridSlot="half" items={items.slice(9, 18)} />
          </div>
        </div>
        {showVideos && tripleVideos ? (
          <div
            className="relative z-[2] min-w-0 w-full shrink-0"
            style={
              stripWidthPx !== undefined
                ? { width: stripWidthPx, maxWidth: "100%" }
                : undefined
            }
          >
            <WorkCategoryTripleVideoRow videos={tripleVideos} className="w-full" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
