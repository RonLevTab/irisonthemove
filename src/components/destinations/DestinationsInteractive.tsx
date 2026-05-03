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
    <>
      <section
        aria-label="Countries visited"
        className="sticky top-[var(--nav-stack-height)] z-30 w-full border-0 bg-[var(--color-background)] px-7 pt-3 pb-1.5 shadow-none sm:px-10 sm:pb-2 lg:px-16 lg:pt-6 lg:pb-3 xl:px-18"
      >
        <DestinationsCountryMarquee cardMessage={cardMessage} />
      </section>

      <section
        aria-label="Destination photos"
        className="-mt-1 w-full bg-gradient-to-b from-[#f8f4ee]/75 from-0% via-[#faf7f3]/45 via-45% to-transparent px-3 pb-6 pt-0 sm:-mt-1.5 sm:px-4 sm:pb-8 lg:px-5"
      >
        <DestinationsHeroGallery items={items} />
      </section>
    </>
  );
}
