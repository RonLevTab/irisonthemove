import type { Metadata } from "next";
import { FaCamera, FaEarthAmericas, FaPlane } from "react-icons/fa6";

import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { PhilosophyOakBorderCard } from "@/components/ui/PhilosophyOakBorderCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { brandSubtitleClassName } from "@/lib/brandFonts";
import { getAboutPageContent } from "@/lib/content";

/**
 * Horizontal shell only — no bottom padding so the cream card can run flush to the footer
 * with no body gradient strip between.
 */
const aboutPageInnerClassName =
  "relative mx-auto max-w-7xl overflow-visible px-6 pb-0 pt-0 sm:px-10 lg:px-12";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Iris — the story behind Iris on the Move, solo travel, content creation, and brand collaborations.",
};

/** Slightly stronger ink; compact leading between lines within each block. */
const bodyClassName =
  "font-text-3 text-[1.02rem] font-normal leading-[1.5] text-justify [hyphens:auto] text-[var(--color-foreground)]/88 sm:text-[1.08rem] sm:leading-[1.54]";

/**
 * Lead — same justification + hyphenation as body so lines run edge-to-edge without loose gaps;
 * NBSPs in JSON still keep short phrases together.
 */
const leadClassName = `${bodyClassName} mb-0`;

/**
 * About page eyebrow — same subtitle font as work `SectionHeading` eyebrow,
 * without `uppercase` so copy can stay sentence case.
 */
const aboutPageEyebrowClassName = `${brandSubtitleClassName} text-xs font-normal tracking-[0.2em] text-[var(--color-primary)] sm:text-[0.8125rem] sm:tracking-[0.19em]`;

/** Story headings (h1 + h2) — Castoro Titling like logo “On The Move”, uppercase. */
const aboutPageSectionTitleClassName = `${brandSubtitleClassName} text-sm font-bold uppercase leading-snug tracking-[0.14em] text-[var(--color-primary)] sm:text-base sm:tracking-[0.12em]`;

/** Card horizontal padding */
const cardPadX = "px-6 sm:px-9";

/** Section titles that get a hairline above the heading (see `about-page.json`). */
const aboutSectionTitlesWithStripeAbove = new Set([
  "Creating for brands & audience",
]);

/** Pull-quote scale — close to body copy so it sits “between the lines” of the columns. */
const philosophyQuoteClassName =
  "font-text-3 mx-auto w-full max-w-full whitespace-pre-line text-[0.94rem] font-normal italic leading-[1.44] tracking-[0.02em] text-[var(--color-foreground)]/88 sm:text-[0.98rem] sm:leading-[1.48]";

/** Invisible split: first segment beside the M, rest full width under the M (no float wrap). */
const LEAD_UNDER_CAP_BREAK = "\u2063";

function splitLeadAtUnderCap(text: string): [string, string] | null {
  const i = text.indexOf(LEAD_UNDER_CAP_BREAK);
  if (i === -1) return null;
  return [
    text.slice(0, i),
    text.slice(i + LEAD_UNDER_CAP_BREAK.length).trimStart(),
  ];
}

/** Split on `\n\n` so continuation blocks can clear prior floats in columns. */
function AboutLeadParagraph({
  className,
  body,
  dropCap,
}: {
  className: string;
  body: string;
  dropCap?: boolean;
}) {
  const chunks = body
    .split(/\n\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const leadStart = (text: string) => {
    if (!dropCap) return text;
    const chars = Array.from(text);
    const first = chars[0];
    if (!first) return text;
    const rest = chars.slice(1).join("");
    return (
      <>
        <span className="about-lead-drop-cap-m">{first}</span>
        {rest}
      </>
    );
  };

  /** Full-width band inside the story column (drop cap + first line). */
  const paragraphClassName = dropCap
    ? `w-full min-w-0 break-inside-avoid ${className}`
    : className;

  const renderDropCapRowThenUnder = (
    headWithM: string,
    underCap: string,
    tailAfterDoubleBreak: string[],
  ) => {
    const chars = Array.from(headWithM);
    const letter = chars[0];
    const headRest = chars.slice(1).join("");
    return (
      <p className={paragraphClassName}>
        <span className="flex w-full min-w-0 items-start gap-2 sm:gap-3">
          <span className="about-lead-drop-cap-m about-lead-drop-cap-m--row">
            {letter}
          </span>
          <span className={`min-w-0 flex-1 ${className}`}>{headRest}</span>
        </span>
        <span
          className={`about-lead-cap-below-sentence about-lead-cap-below-sentence--first ${className}`}
        >
          {underCap}
        </span>
        {tailAfterDoubleBreak.map((block, i) => (
          <span
            key={`tail-${i}`}
            className={`about-lead-cap-below-sentence ${className}`}
          >
            {block}
          </span>
        ))}
      </p>
    );
  };

  if (chunks.length < 2) {
    const under = dropCap ? splitLeadAtUnderCap(body) : null;
    if (under) {
      const [head, below] = under;
      return renderDropCapRowThenUnder(head, below, []);
    }
    return <p className={paragraphClassName}>{leadStart(body)}</p>;
  }

  const [head, ...tail] = chunks;
  const under = dropCap ? splitLeadAtUnderCap(head) : null;
  if (under) {
    const [headOnly, below] = under;
    return renderDropCapRowThenUnder(headOnly, below, tail);
  }

  return (
    <p className={paragraphClassName}>
      {leadStart(head)}
      {tail.map((block, i) => (
        <span
          key={i}
          className="mt-0 block clear-both sm:mt-0"
        >
          {block}
        </span>
      ))}
    </p>
  );
}

export default async function AboutPage() {
  const about = await getAboutPageContent();
  const [firstSection, ...restSections] = about.sections;
  const [secondSection, thirdSection, fourthSection, fifthSection] =
    restSections;

  if (!firstSection) {
    return null;
  }

  return (
    <>
      <PhotoGallery className="mt-0 mb-8 w-full sm:mb-10 lg:mb-12" />
      <section className="relative isolate z-10 mt-0 w-full scroll-mt-20 sm:scroll-mt-24 -mb-4 bg-transparent pb-0 sm:-mb-5 lg:-mb-6">
        <div className={aboutPageInnerClassName}>
          <ScrollReveal className="overflow-visible">
            <article
              className={`card-shell about-main-card-flush-top relative z-10 mx-auto mb-0 w-full max-w-6xl overflow-visible pt-1 pb-16 sm:pt-2 sm:pb-20 lg:max-w-7xl lg:pt-3 lg:pb-24 ${cardPadX}`}
            >
            <header className="mb-7 flex w-full max-w-none flex-col pt-6 sm:mb-8 sm:pt-7 lg:mb-10 lg:pt-9">
              <p className={aboutPageEyebrowClassName}>About me</p>
            </header>

            <div className="w-full lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-8">
              {/* Col 1: “Where it all began” + “Traveling solo…” */}
              <div className="min-w-0 lg:border-r lg:border-[var(--color-border)] lg:pr-8">
                <h1
                  className={`${aboutPageSectionTitleClassName} mb-1 max-w-none text-balance text-left sm:mb-1.5`}
                >
                  {firstSection.title}
                </h1>
                <AboutLeadParagraph
                  className={leadClassName}
                  body={firstSection.body}
                  dropCap
                />
                {secondSection ? (
                  <div className="mt-4 border-t border-[var(--color-border)] pt-4 sm:mt-5 sm:pt-5">
                    <h2
                      className={`${aboutPageSectionTitleClassName} mb-1 text-balance text-left sm:mb-1.5`}
                    >
                      {secondSection.title}
                    </h2>
                    <p className={`${bodyClassName} mb-0`}>
                      {secondSection.body}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Col 2: “Where creativity…” + “Creating for brands…” */}
              <div className="min-w-0 mt-6 border-t border-[var(--color-border)] pt-4 sm:mt-7 sm:pt-5 lg:mt-0 lg:border-r lg:border-t-0 lg:pt-0 lg:pr-8">
                {thirdSection ? (
                  <>
                    <h2
                      className={`${aboutPageSectionTitleClassName} mb-1 text-balance text-left sm:mb-1.5`}
                    >
                      {thirdSection.title}
                    </h2>
                    <p className={`${bodyClassName} mb-0`}>
                      {thirdSection.body}
                    </p>
                  </>
                ) : null}
                {fourthSection ? (
                  <div
                    className={`mt-5 sm:mt-6${
                      aboutSectionTitlesWithStripeAbove.has(
                        fourthSection.title,
                      )
                        ? " border-t border-[var(--color-border)] pt-4 sm:pt-5"
                        : ""
                    }`}
                  >
                    <h2
                      className={`${aboutPageSectionTitleClassName} mb-1 text-balance text-left sm:mb-1.5`}
                    >
                      {fourthSection.title}
                    </h2>
                    <p className={`${bodyClassName} mb-0`}>
                      {fourthSection.body}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Col 3: “The bigger picture” + philosophy card */}
              <div className="min-w-0 mt-6 border-t border-[var(--color-border)] pt-4 sm:mt-7 sm:pt-5 lg:mt-0 lg:border-t-0 lg:pt-0">
                {fifthSection ? (
                  <>
                    <h2
                      className={`${aboutPageSectionTitleClassName} mb-1 text-balance text-left sm:mb-1.5`}
                    >
                      {fifthSection.title}
                    </h2>
                    <p className={`${bodyClassName} mb-0`}>
                      {fifthSection.body}
                    </p>
                  </>
                ) : null}
                <div
                  className="mt-8 flex w-full min-w-0 justify-center break-inside-avoid sm:mt-10 lg:mt-12"
                  role="region"
                  aria-label={`${about.philosophy.label} ${about.philosophy.headline}`}
                >
                  <PhilosophyOakBorderCard
                    className="w-[min(100%,17.5rem)] rounded-xl sm:w-[min(100%,19rem)] sm:rounded-2xl"
                    innerClassName="gap-2 px-3.5 pb-6 pt-6 sm:gap-2.5 sm:px-4 sm:pb-8 sm:pt-8"
                  >
                    <div className="flex flex-col items-center gap-1 sm:gap-1">
                      <span className="font-text-3 text-[0.58rem] font-bold uppercase leading-none tracking-[0.2em] text-[var(--color-primary)] sm:text-[0.625rem] sm:tracking-[0.19em]">
                        {about.philosophy.label}
                      </span>
                      <h2 className="font-text-3 max-w-full text-[0.8rem] font-bold uppercase leading-tight tracking-[0.13em] text-[var(--color-primary)] sm:text-[0.875rem] sm:tracking-[0.12em]">
                        {about.philosophy.headline}
                      </h2>
                    </div>
                    <p className={philosophyQuoteClassName}>
                      <span aria-hidden className="select-none">
                        {"\u201c"}
                      </span>
                      {about.philosophy.quote}
                      <span aria-hidden className="select-none">
                        {"\u201d"}
                      </span>
                    </p>
                    <div
                      className="flex w-full items-center justify-center gap-5 text-black opacity-90 sm:gap-6"
                      aria-hidden
                    >
                      <FaPlane className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      <FaEarthAmericas className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                      <FaCamera className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                    </div>
                  </PhilosophyOakBorderCard>
                </div>
              </div>
            </div>
            </article>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
