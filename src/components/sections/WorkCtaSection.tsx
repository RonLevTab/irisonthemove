import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ctaImageStripClassName } from "@/lib/ctaImageStripClassName";
import { cn } from "@/lib/utils";

type WorkCtaSectionProps = {
  title: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage: string;
};

/**
 * "Let's {emphasis} …" — first word after "Let's " is bold/roman, rest italic (matches hero tagline: one word stands out).
 */
function WorkCtaTitle({ title }: { title: string }) {
  const m = title.match(/^(Let's\s+)(\S+)(\s+.+)$/i);
  if (m) {
    return (
      <h2
        aria-label={title}
        className={cn(
          "font-text-3 text-balance text-center text-[clamp(1.4rem,3.6vw+0.2rem,2.35rem)] font-medium italic leading-[1.12] tracking-[0.04em] text-[var(--color-primary)]",
        )}
      >
        <span aria-hidden className="select-none">
          {"\u201c"}
        </span>
        {m[1]}
        <strong className="font-bold not-italic">{m[2]}</strong>
        {m[3]}
        <span aria-hidden className="select-none">
          {"\u201d"}
        </span>
      </h2>
    );
  }
  return (
    <h2
      aria-label={title}
      className="font-text-3 text-balance text-center text-[clamp(1.4rem,3.6vw+0.2rem,2.35rem)] font-medium italic leading-[1.12] tracking-[0.04em] text-[var(--color-primary)]"
    >
      <span aria-hidden className="select-none">
        {"\u201c"}
      </span>
      {title}
      <span aria-hidden className="select-none">
        {"\u201d"}
      </span>
    </h2>
  );
}

/**
 * Work page closing CTA — full-width background, moderate height cap, light veils,
 * solid surface card, centered. Photo uses object-fit cover inside the cap.
 */
export function WorkCtaSection({
  title,
  buttonLabel,
  buttonHref,
  backgroundImage,
}: WorkCtaSectionProps) {
  return (
    <section
      id="work-cta"
      className="relative isolate w-full overflow-hidden border-t-0 bg-transparent"
    >
      <div className={ctaImageStripClassName}>
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
            aria-hidden
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[var(--color-primary)]/[0.18]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[var(--color-background)]/40 via-[var(--color-background)]/10 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 py-6 min-[400px]:px-6 sm:px-8 sm:py-8 lg:px-10">
          <ScrollReveal className="flex w-full max-w-md justify-center sm:max-w-lg">
            <div
              className={cn(
                "mx-auto flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--color-border)] px-5 py-6 text-center",
                "bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm",
                "sm:gap-5 sm:rounded-2xl sm:px-7 sm:py-7",
              )}
            >
              <WorkCtaTitle title={title} />
              <Link href={buttonHref} className="primary-button inline-flex">
                {buttonLabel}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
