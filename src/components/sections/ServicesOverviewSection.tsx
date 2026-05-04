"use client";

import { PricingCard } from "@/components/ui/PricingCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { oakSectionBorderClassName } from "@/lib/sectionOakTheme";

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
      className={`relative isolate flex w-full items-center ${oakSectionBorderClassName} min-h-0 bg-[var(--color-background)] md:min-h-[calc(100svh-var(--nav-stack-height,7rem))] lg:min-h-0`}
    >
      <div className="mx-auto flex min-h-0 w-full max-w-[min(100%,96rem)] flex-col justify-start px-6 max-sm:pt-14 max-sm:pb-14 sm:max-md:pt-16 sm:max-md:pb-16 sm:px-10 md:min-h-[calc(100svh-var(--nav-stack-height,7rem))] md:justify-center md:pt-16 md:pb-16 lg:px-12 lg:pt-20 lg:pb-20">
        <ScrollReveal className="flex flex-col items-center gap-8 text-center sm:gap-7 lg:gap-8">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleVariant="editorialDual"
            stackGapClassName="gap-3 sm:gap-4"
          />

          <div className="mx-auto grid w-[92%] max-w-[29rem] grid-cols-1 auto-rows-fr items-stretch gap-8 sm:w-full sm:max-w-none sm:gap-8 lg:grid-cols-3 lg:gap-10">
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
