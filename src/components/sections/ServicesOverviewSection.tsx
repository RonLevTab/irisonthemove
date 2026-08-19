"use client";

import { PricingCard } from "@/components/ui/PricingCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  oakSectionBorderClassName,
  oakSectionBorderTopClassName,
} from "@/lib/sectionOakTheme";

type ServiceItem = {
  title: string;
  description: string;
  features?: string[];
};

type ServicesOverviewSectionProps = {
  eyebrow: string;
  title: string;
  items: ServiceItem[];
};

export function ServicesOverviewSection({
  eyebrow,
  title,
  items,
}: ServicesOverviewSectionProps) {
  return (
    <section
      className={`relative isolate z-[5] flex w-full flex-col ${oakSectionBorderTopClassName} ${oakSectionBorderClassName} min-h-0 bg-[var(--color-background)]`}
    >
      {/*
        Same shell as Latest content: padding only, no full-viewport min-height + vertical center
        (Services used `items-center` + min-h which floated the block mid-air with huge gaps).
      */}
      <div className="mx-auto flex w-full max-w-[min(100%,96rem)] flex-1 flex-col justify-start px-6 pt-12 pb-12 sm:px-10 sm:max-md:pt-12 sm:max-md:pb-12 md:px-10 md:pt-14 md:pb-14 lg:px-12 lg:pt-16 lg:pb-16">
        <ScrollReveal className="flex w-full flex-col items-center gap-4 text-center max-md:gap-4 md:gap-7">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleVariant="editorialDual"
            stackGapClassName="gap-4 sm:gap-5"
          />

          <div className="mx-auto grid w-[92%] max-w-[29rem] grid-cols-1 auto-rows-fr items-stretch gap-5 sm:w-full sm:max-w-none sm:gap-8 lg:grid-cols-3 lg:gap-10">
            {items.map((item, index) => (
              <PricingCard
                key={item.title}
                href="/work"
                title={item.title}
                description={item.description}
                features={item.features}
                entranceDelay={index * 0.12}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
