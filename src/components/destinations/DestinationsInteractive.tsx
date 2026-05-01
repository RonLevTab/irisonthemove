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
        className="sticky top-20 z-30 w-full border-b border-[color-mix(in_srgb,var(--color-border)_50%,transparent)] bg-[#ebe5dc]/95 px-4 py-4 shadow-[0_6px_20px_rgba(75,64,56,0.04)] backdrop-blur-sm sm:px-6 sm:py-5"
      >
        <DestinationsCountryMarquee cardMessage={cardMessage} />
      </section>

      <section
        aria-label="Destination photos"
        className="w-full px-4 pb-16 sm:px-6 sm:pb-20"
      >
        <DestinationsHeroGallery items={items} />
      </section>
    </>
  );
}
