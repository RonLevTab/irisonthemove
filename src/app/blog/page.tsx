import type { Metadata } from "next";

import { BlogCard } from "@/components/ui/BlogCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Travel notes, planning tips, and journal entries from Iris on the Move.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <section className="section-shell pt-20">
        <ScrollReveal className="space-y-6">
          <SectionHeading
            eyebrow="Blog"
            title="Travel notes with mood"
            description="These posts are stored in JSON for now so they are quick to add, edit, and expand before a fuller CMS is introduced."
          />
        </ScrollReveal>
      </section>

      <section className="section-shell">
        <ScrollReveal className="mb-8 flex flex-wrap gap-3">
          {[...new Set(posts.flatMap((post) => post.tags))].map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </ScrollReveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={post.title}
              excerpt={post.excerpt}
              image={post.coverImage}
              imageAlt={post.coverAlt}
              meta={new Date(post.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              tags={post.tags}
            />
          ))}
        </div>
      </section>
    </>
  );
}
