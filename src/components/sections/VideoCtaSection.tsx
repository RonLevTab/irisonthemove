"use client";

import Image from "next/image";
import { useState } from "react";

import { ContactFormModal } from "@/components/ui/ContactFormModal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { videoCtaImageStripClassName } from "@/lib/ctaImageStripClassName";

type VideoCtaSectionProps = {
  posterImage: string;
  quote: string;
  ctaLabel: string;
  formId: string;
};

/**
 * Full-bleed visual block with poster image (placeholder for background video).
 * Strip height: `videoCtaImageStripClassName` (full mobile viewport under nav).
 */
export function VideoCtaSection({
  posterImage,
  quote,
  ctaLabel,
  formId,
}: VideoCtaSectionProps) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <section className="relative isolate w-full overflow-hidden border-t-0 bg-transparent scroll-mt-[var(--nav-stack-height,7rem)]">
      <div className={videoCtaImageStripClassName}>
        <div className="absolute inset-0 -z-10">
          <Image
            src={posterImage}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            loading="eager"
            fetchPriority="low"
            aria-hidden
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[var(--color-primary)]/[0.28]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[var(--color-background)]/50 via-[var(--color-background)]/20 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 py-4 min-[400px]:px-6 sm:px-8 sm:py-8 lg:px-10">
          <ScrollReveal className="flex w-full justify-center">
            <div
              className="relative flex w-max max-w-[min(100%,26rem)] flex-col items-center gap-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-7 py-8 text-center shadow-sm sm:max-w-[min(100%,28rem)] sm:rounded-3xl sm:px-9 sm:py-9"
            >
              <p className="font-text-3 mx-auto w-max max-w-full whitespace-pre-line text-[clamp(1.05rem,2.85vw,2.15rem)] font-medium italic leading-[1.12] tracking-[0.04em] text-[var(--color-primary)]">
                <span aria-hidden className="select-none">
                  {"\u201c"}
                </span>
                {quote}
                <span aria-hidden className="select-none">
                  {"\u201d"}
                </span>
              </p>
              <button
                type="button"
                className="primary-button w-full min-w-0 justify-center sm:w-auto"
                onClick={() => setContactOpen(true)}
              >
                {ctaLabel}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>

      <ContactFormModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        formId={formId}
      />
    </section>
  );
}
