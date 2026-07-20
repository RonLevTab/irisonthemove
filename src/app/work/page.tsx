import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { WorkPageVideoAudioProvider } from "@/components/work/WorkPageVideoAudioContext";
import { WorkRouteVideoPreload } from "@/components/work/WorkRouteVideoPreload";
import { WorkDualGridsWithTripleVideos } from "@/components/work/WorkDualGridsWithTripleVideos";
import { WorkExpandingImageGrid } from "@/components/work/WorkExpandingImageGrid";
import { WorkHotelMediaWithVideos } from "@/components/work/WorkHotelMediaWithVideos";
import { WorkTravelInstagramReels } from "@/components/work/WorkTravelInstagramReels";
import { WorkTravelVideoGrid } from "@/components/work/WorkTravelVideoGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getWorkPageContent } from "@/lib/content";
import { getSiteConfig } from "@/lib/siteContent";
import { getWebsiteVisitCount } from "@/lib/websiteVisits";
import { cn } from "@/lib/utils";
import {
  oakSectionBorderClassName,
  oakSectionBorderTopClassName,
} from "@/lib/sectionOakTheme";

export const revalidate = 120;

const ResultsSection = dynamic(() =>
  import("@/components/sections/ResultsSection").then((m) => m.ResultsSection),
);
const WorkCtaSection = dynamic(() =>
  import("@/components/sections/WorkCtaSection").then((m) => m.WorkCtaSection),
);

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();

  return {
    title: "My work",
    description: `${site.title} — portfolio of UGC photos and short-form video for restaurants, hotels, and travel.`,
  };
}

/**
 * Work categories follow the same section shell as the homepage
 * (e.g. `ServicesOverviewSection`: oak edge-fade rules + wide inner shell).
 */
export default async function WorkPage() {
  const work = await getWorkPageContent();
  const visitCount = await getWebsiteVisitCount();
  const results = work.results
    ? {
        ...work.results,
        website: work.results.website
          ? { ...work.results.website, totalVisits: visitCount }
          : undefined,
      }
    : undefined;

  return (
    <WorkPageVideoAudioProvider>
      <WorkRouteVideoPreload />
      <div className="relative min-h-0">
      <h1 className="sr-only">{work.intro.title}</h1>

      {work.categories.map((category, index) => {
        const isTravelVideoGrid =
          category.id === "travel" && category.travelGridVideos?.length === 6;
        const isTravelInstagram =
          category.id === "travel" &&
          category.instagramReels?.length === 6 &&
          !isTravelVideoGrid;
        const isTravelSpecial = isTravelVideoGrid || isTravelInstagram;
        const isDualGrids =
          (category.id === "travel" || category.id === "restaurants") &&
          !isTravelSpecial;
        const isHotels = category.id === "hotels";

        return (
          <section
            key={category.id}
            id={category.id}
            className={cn(
              "relative isolate w-full",
              oakSectionBorderClassName,
              "bg-[var(--color-background)]",
              index > 0 && oakSectionBorderTopClassName,
              "overflow-x-clip",
            )}
          >
            <div
              className="mx-auto flex w-full max-w-[min(100%,118rem)] flex-col gap-8 sm:gap-12 lg:gap-14 px-7 pt-10 pb-12 sm:px-10 lg:px-14 lg:pt-12 lg:pb-16 xl:px-16 2xl:px-18"
            >
              <ScrollReveal className="flex w-full flex-col items-center text-center">
                <SectionHeading
                  align="center"
                  eyebrow={work.intro.eyebrow}
                  title={category.title}
                  titleVariant="editorialDual"
                  editorialDualEyebrowClassName="text-[0.64rem] sm:text-[0.74rem] md:text-[0.84rem] lg:text-[0.94rem]"
                  stackGapClassName="gap-3 sm:gap-4"
                  className="w-full max-w-5xl"
                  innerClassName="!max-w-2xl"
                />
              </ScrollReveal>

              <div
                className="relative isolate w-full min-h-0 min-w-0"
              >
                <div
                  className={cn(
                    "w-full min-h-0 min-w-0 min-[900px]:min-w-0",
                    isDualGrids || isHotels || isTravelSpecial
                      ? "overflow-x-clip overflow-y-visible"
                      : "overflow-hidden",
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto flex w-full min-h-0 min-w-0",
                      "min-[900px]:max-w-full",
                      !isDualGrids && "min-[900px]:max-h-full",
                      isDualGrids
                        ? "lg:min-h-0"
                        : isHotels
                          ? "min-[900px]:min-h-0"
                          : isTravelSpecial
                            ? "min-h-0"
                            : "min-[900px]:h-[calc(100dvh-4.5rem)] min-[900px]:items-center min-[900px]:justify-center",
                    )}
                  >
                    {isTravelVideoGrid && category.travelGridVideos ? (
                      <WorkTravelVideoGrid
                        stripAriaLabel={`${category.title}: two rows of three travel reels`}
                        videos={category.travelGridVideos}
                      />
                    ) : isTravelInstagram && category.instagramReels ? (
                      <WorkTravelInstagramReels
                        stripAriaLabel={`${category.title}: two rows of three Instagram reels`}
                        urls={category.instagramReels}
                      />
                    ) : isDualGrids ? (
                      <WorkDualGridsWithTripleVideos
                        stripAriaLabel={`${category.title}: two 3 by 3 grids`}
                        items={category.items}
                        tripleVideos={category.tripleVideos}
                        priorityFirstImages={index === 0 ? 6 : 0}
                        prioritySecondGridImages={0}
                      />
                    ) : isHotels ? (
                      <WorkHotelMediaWithVideos
                        stripAriaLabel={`${category.title}: six by two photo grid and reels`}
                        items={category.items}
                        tripleVideos={category.tripleVideos}
                        priorityFirstImages={index === 0 ? 6 : 0}
                      />
                    ) : (
                      <WorkExpandingImageGrid
                        items={category.items}
                        priorityFirstImages={index === 0 ? 6 : 0}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {results ? <ResultsSection {...results} /> : null}

      <WorkCtaSection
        title={work.cta.title}
        buttonLabel={work.cta.buttonLabel}
        buttonHref={work.cta.buttonHref}
        backgroundImage={work.cta.backgroundImage}
      />
    </div>
    </WorkPageVideoAudioProvider>
  );
}
