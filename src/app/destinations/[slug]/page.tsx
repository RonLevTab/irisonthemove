import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentBlock } from "@/components/ui/ContentBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  getDestinationBySlug,
  getDestinations,
} from "@/lib/content";
import { brandScriptClassName, brandSubtitleClassName } from "@/lib/brandFonts";
import { latestContentSectionStyle } from "@/lib/sectionOakTheme";

/** Matches About: room below the main card before the footer. */
const destinationPageInnerClassName =
  "relative mx-auto w-full max-w-[min(100%,96rem)] overflow-visible px-6 pb-6 pt-0 sm:px-10 sm:pb-8 sm:pt-1 lg:px-12 lg:pt-1";

const excerptClassName =
  "font-text-3 max-w-2xl text-[1.02rem] font-normal leading-[1.62] text-[var(--color-foreground)]/88 sm:text-[1.08rem] sm:leading-[1.66]";

const countryEyebrowClassName = `${brandSubtitleClassName} text-[0.62rem] font-normal uppercase tracking-[0.18em] text-[var(--color-primary)]/90 sm:text-xs`;

const cardPadX = "px-6 sm:px-9";

type DestinationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const destinations = await getDestinations();

  return destinations.map((destination) => ({
    slug: destination.slug,
  }));
}

export async function generateMetadata({
  params,
}: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return {};
  }

  return {
    title: destination.title,
    description: destination.excerpt,
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  return (
    <section
      className="relative isolate z-0 -mb-10 w-full scroll-mt-20 sm:-mb-12 sm:scroll-mt-24 lg:-mb-14"
      style={latestContentSectionStyle}
    >
      <div className={destinationPageInnerClassName}>
        <ScrollReveal className="overflow-visible">
          <article
            className={`about-main-card-square card-shell relative z-0 mx-auto w-full max-w-[52rem] -mt-8 overflow-visible pt-[calc(2.25rem+2rem)] pb-10 sm:-mt-10 sm:pt-[calc(2.75rem+2.5rem)] sm:pb-11 lg:-mt-12 lg:pt-[calc(2.75rem+3rem)] lg:pb-12 ${cardPadX} shadow-[0_20px_50px_rgba(58,36,32,0.08),0_36px_90px_rgba(58,36,32,0.1),inset_0_1px_0_rgba(255,255,255,0.72)]`}
          >
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-6">
                <p className={countryEyebrowClassName}>{destination.country}</p>
                <h1
                  className={`${brandScriptClassName} text-5xl leading-none text-[var(--color-primary)] sm:text-6xl lg:text-7xl`}
                >
                  {destination.title}
                </h1>
                <p className={excerptClassName}>{destination.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {destination.tags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative aspect-[4/5] overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)]">
                <Image
                  src={destination.coverImage}
                  alt={destination.coverAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  priority
                />
              </div>
            </div>
          </article>
        </ScrollReveal>

        <div className="mx-auto mt-8 max-w-[52rem] space-y-6 pb-10 sm:mt-10 sm:pb-12">
          {destination.blocks.map((block, index) => (
            <ScrollReveal key={`${destination.slug}-${index}`}>
              <ContentBlock block={block} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
