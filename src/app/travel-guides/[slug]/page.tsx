import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentBlock } from "@/components/ui/ContentBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getTravelGuideBySlug, getTravelGuides } from "@/lib/content";

type TravelGuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const guides = await getTravelGuides();

  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: TravelGuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getTravelGuideBySlug(slug);

  if (!guide) {
    return {};
  }

  return {
    title: guide.title,
    description: guide.excerpt,
  };
}

export default async function TravelGuideDetailPage({
  params,
}: TravelGuidePageProps) {
  const { slug } = await params;
  const guide = await getTravelGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <>
      <section className="section-shell pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <ScrollReveal className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              {guide.location} / {guide.duration}
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[var(--color-primary)] sm:text-6xl">
              {guide.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--color-foreground-muted)]">
              {guide.excerpt}
            </p>
            <div className="flex flex-wrap gap-2">
              {guide.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal className="card-shell overflow-hidden p-3">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem]">
              <Image
                src={guide.coverImage}
                alt={guide.coverAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                fetchPriority="high"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>
      <section className="section-shell pt-6">
        <div className="space-y-6">
          {guide.blocks.map((block, index) => (
            <ScrollReveal key={`${guide.slug}-${index}`}>
              <ContentBlock block={block} contentBlockIndex={index} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
