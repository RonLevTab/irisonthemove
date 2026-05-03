import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

/** Full-viewport-ish strip: min-height on section so the image layer has real height (no cream gap). */
const workCtaShellClassName = cn(
  "relative isolate z-[1] -mb-3 w-full overflow-hidden border-t-0 bg-[#2a2523]",
  "min-h-[min(96svh,68rem)] sm:min-h-[min(94svh,100rem)]",
);

type WorkCtaSectionProps = {
  title: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage: string;
};

const workCtaTitleClassName = cn(
  "font-text-3 text-balance text-center text-[clamp(1.4rem,3.6vw+0.2rem,2.35rem)] font-medium italic leading-[1.12] tracking-[0.04em] text-[var(--color-primary)]",
);

/** One line: word after "Let's " is bold; optional remainder after that word stays italic. */
function WorkCtaTitleLine({ line }: { line: string }) {
  const restOfLine = line.match(/^(Let's\s+)(\S+)(\s+.+)$/i);
  if (restOfLine) {
    return (
      <>
        {restOfLine[1]}
        <strong className="font-bold not-italic">{restOfLine[2]}</strong>
        {restOfLine[3]}
      </>
    );
  }
  const letsOnlyTwo = line.match(/^(Let's\s+)(\S+)$/i);
  if (letsOnlyTwo) {
    return (
      <>
        {letsOnlyTwo[1]}
        <strong className="font-bold not-italic">{letsOnlyTwo[2]}</strong>
      </>
    );
  }
  return <>{line}</>;
}

/**
 * "Let's {emphasis} …" — first word after "Let's " is bold/roman (hero-style).
 * Use a newline in `title` for two stacked lines (see work-page.json cta).
 */
function WorkCtaTitle({ title }: { title: string }) {
  const lines = title
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    const ariaLabel = lines.join(" ");
    const last = lines.length - 1;
    return (
      <h2 aria-label={ariaLabel} className={workCtaTitleClassName}>
        <span className="flex flex-col items-center gap-1 sm:gap-1.5">
          <span className="block text-pretty">
            <span aria-hidden className="select-none">
              {"\u201c"}
            </span>
            <WorkCtaTitleLine line={lines[0]} />
          </span>
          {lines.slice(1, last).map((line, i) => (
            <span key={`cta-title-mid-${i}`} className="block text-pretty">
              <WorkCtaTitleLine line={line} />
            </span>
          ))}
          <span className="block text-pretty">
            <WorkCtaTitleLine line={lines[last]} />
            <span aria-hidden className="select-none">
              {"\u201d"}
            </span>
          </span>
        </span>
      </h2>
    );
  }

  const single = lines[0] ?? title;
  const m = single.match(/^(Let's\s+)(\S+)(\s+.+)$/i);
  if (m) {
    return (
      <h2 aria-label={single} className={workCtaTitleClassName}>
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
    <h2 aria-label={single} className={workCtaTitleClassName}>
      <span aria-hidden className="select-none">
        {"\u201c"}
      </span>
      {single}
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
    <section id="work-cta" className={workCtaShellClassName}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={backgroundImage}
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
        className="pointer-events-none absolute inset-0 z-[1] bg-[var(--color-primary)]/[0.18]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[var(--color-background)]/40 via-[var(--color-background)]/10 to-transparent"
        aria-hidden
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 py-6 min-[400px]:px-8 sm:px-10 sm:py-8 lg:px-12">
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
    </section>
  );
}
