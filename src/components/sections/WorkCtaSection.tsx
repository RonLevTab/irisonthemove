import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  closingCtaButtonClassName,
  closingCtaCardClassName,
  closingCtaTitleClassName,
} from "@/lib/closingCtaCardTheme";
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

const workCtaTitleClassName = closingCtaTitleClassName;

/** Bold "create" in the CTA line (same emphasis as the old "Let's create" title). */
function boldCreateInLine(text: string) {
  const parts = text.split(/(\bcreate\b)/i);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, index) =>
        /^create$/i.test(part) ? (
          <strong key={`create-${index}`} className="font-bold not-italic">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** One line: word after "Let's " is bold; otherwise emphasize "create" when present. */
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
  return boldCreateInLine(line);
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
        {lines.map((line, index) => (
          <span key={line} className="block whitespace-nowrap">
            {index === 0 ? (
              <span aria-hidden className="select-none">
                {"\u201c"}
              </span>
            ) : null}
            <WorkCtaTitleLine line={line} />
            {index === last ? (
              <span aria-hidden className="select-none">
                {"\u201d"}
              </span>
            ) : null}
          </span>
        ))}
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

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 py-4 min-[400px]:px-6 sm:px-8 sm:py-8 lg:px-10">
        <ScrollReveal className="flex w-full justify-center">
          <div className={closingCtaCardClassName}>
            <WorkCtaTitle title={title} />
            <Link href={buttonHref} className={closingCtaButtonClassName}>
              {buttonLabel}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
