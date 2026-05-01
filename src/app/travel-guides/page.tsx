import type { Metadata } from "next";

import { BlogCard } from "@/components/ui/BlogCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTravelGuides } from "@/lib/content";

export const metadata: Metadata = {
  title: "Travel Guides",
  description: "Structured travel guides and itineraries from Iris on the Move.",
};

export default async function TravelGuidesPage() {
  const guides = await getTravelGuides();

  return (
    <>
      <section className="section-shell pt-20">
        <ScrollReveal className="space-y-6">
          <SectionHeading
            eyebrow="Travel Guides"
            title="Structured, but still dreamy"
            description="Guides are separate from blog posts so practical itineraries can grow independently from the journal."
          />
        </ScrollReveal>
      </section>

      <section className="section-shell">
        <div className="grid gap-6 lg:grid-cols-2">
          {guides.map((guide) => (
            <BlogCard
              key={guide.slug}
              href={`/travel-guides/${guide.slug}`}
              title={guide.title}
              excerpt={`${guide.excerpt} ${guide.duration} in ${guide.location}.`}
              image={guide.coverImage}
              imageAlt={guide.coverAlt}
              meta={`${guide.location} / ${guide.duration}`}
              tags={guide.tags}
            />
          ))}
        </div>
      </section>
    </>
  );
}
