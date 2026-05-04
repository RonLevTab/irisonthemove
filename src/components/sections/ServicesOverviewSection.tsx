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
      <div className="mx-auto flex w-full max-w-[min(100%,96rem)] flex-1 flex-col justify-start px-6 pt-12 pb-12 sm:px-10 sm:max-md:pt-14 sm:max-md:pb-14 md:px-10 md:pt-16 md:pb-20 lg:px-12 lg:pt-20 lg:pb-24">
        <ScrollReveal className="flex w-full flex-col items-center gap-8 text-center">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleVariant="editorialDual"
            stackGapClassName="gap-3 sm:gap-4"
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
