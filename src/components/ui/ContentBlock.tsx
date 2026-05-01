import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { InstagramEmbed } from "@/components/ui/InstagramEmbed";
import { brandScriptClassName } from "@/lib/brandFonts";
import type { ContentBlock as ContentBlockType } from "@/types/content";

type ContentBlockProps = {
  block: ContentBlockType;
};

export function ContentBlock({ block }: ContentBlockProps) {
  switch (block.type) {
    case "text":
      return (
        <article className="prose-shell card-shell p-8 sm:p-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.body}</ReactMarkdown>
        </article>
      );

    case "image":
      return (
        <figure className="card-shell overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={block.src}
              alt={block.alt}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 52rem"
              loading="lazy"
            />
          </div>
          {block.caption ? (
            <figcaption className="px-6 py-5 text-sm leading-7 text-[var(--color-foreground-muted)]">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "gallery":
      return (
        <div className="grid gap-6 md:grid-cols-2">
          {block.images.map((image) => (
            <figure key={`${image.src}-${image.alt}`} className="card-shell overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 767px) 100vw, 26rem"
                  loading="lazy"
                />
              </div>
              {image.caption ? (
                <figcaption className="px-6 py-4 text-sm leading-7 text-[var(--color-foreground-muted)]">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      );

    case "video":
      return (
        <div className="card-shell overflow-hidden p-4">
          <div
            className="video-embed"
            dangerouslySetInnerHTML={{ __html: block.embedHtml }}
          />
          {block.caption ? (
            <p className="px-2 pt-4 text-sm leading-7 text-[var(--color-foreground-muted)]">
              {block.caption}
            </p>
          ) : null}
        </div>
      );

    case "instagram":
      return <InstagramEmbed postUrl={block.postUrl} />;

    case "quote":
      return (
        <blockquote className="card-shell border-l-4 border-[var(--color-gold)] px-8 py-10">
          <p
            className={`${brandScriptClassName} text-4xl leading-tight text-[var(--color-primary)]`}
          >
            &quot;{block.text}&quot;
          </p>
          {block.author ? (
            <footer className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-gold)]">
              {block.author}
            </footer>
          ) : null}
        </blockquote>
      );

    case "cta":
      return (
        <div className="card-shell flex flex-col gap-6 px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-lg leading-8 text-[var(--color-foreground-muted)]">
            {block.text}
          </p>
          <Link href={block.buttonLink} className="primary-button">
            {block.buttonText}
          </Link>
        </div>
      );

    default:
      return null;
  }
}
