"use client";

import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  closingCtaButtonClassName,
  closingCtaCardClassName,
  closingCtaTitleClassName,
} from "@/lib/closingCtaCardTheme";
import { cn } from "@/lib/utils";

type VideoCtaSectionProps = {
  posterImage: string;
  quote: string;
  ctaLabel: string;
};

/** Min-height = volledige viewport onder de nav (`svh` = betrouwbaar op iOS). Geen inner strip-wrapper die kan collapsen. */
const videoCtaShellClassName = cn(
  /* Stay below Services (z-[5]) so cards are never covered if layers touch. */
  "relative isolate z-0 -mb-3 w-full overflow-hidden border-t-0 bg-[#231a18]",
  "scroll-mt-[var(--nav-stack-height,7rem)]",
  "min-h-[calc(100svh_-_var(--nav-stack-height,7rem))]",
  "sm:min-h-[min(94svh,100rem)]",
);

/** Bold "memories" in the homepage CTA quote (same style as "create" on Edits). */
function boldMemoriesInLine(text: string) {
  const parts = text.split(/(\bmemories\b)/i);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) =>
        /^memories$/i.test(part) ? (
          <strong key={`memories-${index}`} className="font-bold not-italic">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/**
 * Full-bleed visual block with poster image (placeholder for background video).
 */
export function VideoCtaSection({
  posterImage,
  quote,
  ctaLabel,
}: VideoCtaSectionProps) {
  const quoteLines = quote.split("\n").filter((line) => line.trim().length > 0);

  return (
    <section className={videoCtaShellClassName}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={posterImage}
          alt=""
          fill
          className="object-cover object-bottom"
          sizes="100vw"
          loading="eager"
          fetchPriority="low"
          aria-hidden
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[#2a1512]/[0.26]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[var(--color-background)]/34 via-[var(--color-background)]/10 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 py-4 min-[400px]:px-6 sm:px-8 sm:py-8 lg:px-10">
        <ScrollReveal className="flex w-full justify-center">
          <div className={closingCtaCardClassName}>
            <p className={closingCtaTitleClassName}>
              {quoteLines.map((line, index) => (
                <span key={line} className="block whitespace-nowrap">
                  {index === 0 ? (
                    <span aria-hidden className="select-none">
                      {"\u201c"}
                    </span>
                  ) : null}
                  {boldMemoriesInLine(line)}
                  {index === quoteLines.length - 1 ? (
                    <span aria-hidden className="select-none">
                      {"\u201d"}
                    </span>
                  ) : null}
                </span>
              ))}
            </p>
            <Link href="/contact" className={closingCtaButtonClassName}>
              {ctaLabel}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
