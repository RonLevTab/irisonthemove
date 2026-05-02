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
        className="sticky top-20 z-30 w-full border-0 bg-[var(--color-background)] py-4 shadow-none sm:py-5"
      >
        <DestinationsCountryMarquee cardMessage={cardMessage} />
      </section>

      <section
        aria-label="Destination photos"
        className="w-full bg-gradient-to-b from-[#f8f4ee]/75 from-0% via-[#faf7f3]/45 via-45% to-transparent px-3 pb-6 pt-0 sm:px-4 sm:pb-8 lg:px-5"
      >
        <DestinationsHeroGallery items={items} />
      </section>
    </>
  );
}
