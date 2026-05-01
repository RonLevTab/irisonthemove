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
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-12 sm:px-10 lg:px-12 lg:pt-12 lg:pb-16">
        <ScrollReveal className="flex flex-col items-center gap-6 text-center lg:gap-7">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleVariant="editorialDual"
            stackGapClassName="gap-3 sm:gap-4"
          />

          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
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
