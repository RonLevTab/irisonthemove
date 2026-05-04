"use client";

import React, { useEffect, useLayoutEffect } from "react";

import { DestinationsCountryMarquee } from "@/components/destinations/DestinationsCountryMarquee";
import { DestinationsHeroGallery } from "@/components/destinations/DestinationsHeroGallery";
import type { DestinationGalleryItem } from "@/types/content";

type DestinationsInteractiveProps = {
  items: DestinationGalleryItem[];
  cardMessage?: string;
};

export function DestinationsInteractive({
  items,
  cardMessage,
}: DestinationsInteractiveProps) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <div className="w-full min-w-0 overflow-x-hidden">
      <section
        aria-label="Countries visited"
        className="sticky top-[var(--nav-stack-height)] z-30 -mt-3 w-full min-w-0 max-w-[100vw] border-0 bg-[var(--color-background)] px-7 pt-0 pb-1 shadow-none sm:-mt-4 sm:px-10 sm:pb-1.5 lg:-mt-5 lg:px-16 lg:pt-0.5 lg:pb-2 xl:px-18"
      >
        <DestinationsCountryMarquee cardMessage={cardMessage} />
      </section>

      <section
        aria-label="Destination photos"
        className="-mt-6 w-full min-w-0 max-w-[100vw] bg-gradient-to-b from-[#f8f4ee]/75 from-0% via-[#faf7f3]/45 via-45% to-transparent px-3 pb-6 pt-0 sm:-mt-8 sm:px-4 sm:pb-8 lg:-mt-10 lg:px-5"
      >
        <DestinationsHeroGallery items={items} />
      </section>
    </div>
  );
}
