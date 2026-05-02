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
      className={`relative isolate w-full ${oakSectionBorderClassName} bg-[var(--color-background)]`}
    >
      <div className="mx-auto w-full max-w-[min(100%,96rem)] px-6 pt-8 pb-9 sm:px-10 sm:pt-10 sm:pb-12 lg:px-12 lg:pt-12 lg:pb-16">
        <ScrollReveal className="flex flex-col items-center gap-4 text-center sm:gap-6 lg:gap-7">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleVariant="editorialDual"
            stackGapClassName="gap-3 sm:gap-4"
          />

          <div className="mx-auto grid w-full max-w-none grid-cols-1 auto-rows-fr items-stretch gap-4 sm:gap-8 lg:grid-cols-3 lg:gap-10">
            {items.map((item, index) => (
              <PricingCard
                key={item.title}
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
