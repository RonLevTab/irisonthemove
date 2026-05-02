import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentBlock } from "@/components/ui/ContentBlock";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className="section-shell pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <ScrollReveal className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              {new Date(post.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-[var(--color-primary)] sm:text-6xl">
              {post.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--color-foreground-muted)]">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal className="card-shell overflow-hidden p-3">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem]">
              <Image
                src={post.coverImage}
                alt={post.coverAlt}
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
          {post.blocks.map((block, index) => (
            <ScrollReveal key={`${post.slug}-${index}`}>
              <ContentBlock block={block} contentBlockIndex={index} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
