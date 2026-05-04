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
    <div className="w-full min-w-0">
      {/*
        Avoid wrapping this whole block in overflow-x-hidden: it forces overflow-y to clip and
        cuts off the top of the photo masonry. Marquee rows handle their own overflow.
      */}
      <section
        aria-label="Countries visited"
        className="sticky top-[var(--nav-stack-height)] z-30 w-full min-w-0 max-w-full border-0 bg-[var(--color-background)] px-7 pt-5 pb-5 shadow-none sm:px-10 sm:pt-6 sm:pb-6 lg:px-16 lg:pt-6 lg:pb-6 xl:px-18"
      >
        <DestinationsCountryMarquee cardMessage={cardMessage} />
      </section>

      <section
        aria-label="Destination photos"
        className="mt-0 w-full min-w-0 max-w-full bg-gradient-to-b from-[#f8f4ee]/75 from-0% via-[#faf7f3]/45 via-45% to-transparent px-3 pb-6 pt-0 sm:px-4 sm:pb-8 lg:px-5"
      >
        <DestinationsHeroGallery items={items} />
      </section>
    </div>
  );
}
