"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type { WorkCategoryTripleVideo } from "@/components/work/WorkCategoryTripleVideoRow";
import { WorkCategoryTripleVideoRow } from "@/components/work/WorkCategoryTripleVideoRow";
import type { WorkGalleryItem } from "@/components/work/WorkExpandingImageGrid";
import { WorkHotelSixByTwoGrid } from "@/components/work/WorkHotelSixByTwoGrid";

type WorkHotelMediaWithVideosProps = {
  stripAriaLabel: string;
  items: WorkGalleryItem[];
  tripleVideos?: WorkCategoryTripleVideo[];
  priorityFirstImages?: number;
};

/**
 * Same layout contract as {@link WorkDualGridsWithTripleVideos}: the photo strip uses the
 * full section width, is measured with `ResizeObserver`, then three default-framed reels sit
 * below at matching width — only the grid differs (6×2 hotels vs dual 3×3).
 */
export function WorkHotelMediaWithVideos({
  stripAriaLabel,
  items,
  tripleVideos,
  priorityFirstImages = 0,
}: WorkHotelMediaWithVideosProps) {
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
        Same strip → reels rhythm as WorkDualGridsWithTripleVideos; minimal bottom padding
        on this wrapper so the next section doesn’t sit under a huge empty band.
      */}
      <div className="flex w-full max-w-full flex-col items-center gap-6 pb-2 max-md:gap-6 sm:gap-12 sm:pb-3 min-[1200px]:gap-14 min-[1200px]:pb-3">
        <div
          ref={stripRef}
          role="region"
          aria-label={stripAriaLabel}
          className="flex min-h-0 min-w-0 w-full flex-col min-[1200px]:items-center min-[1200px]:justify-center"
        >
          <WorkHotelSixByTwoGrid
            items={items}
            priorityFirstImages={priorityFirstImages}
          />
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
