import type { Metadata } from "next";
import { FaCamera, FaEarthAmericas, FaPlane } from "react-icons/fa6";

import { PhotoGallery } from "@/components/ui/PhotoGallery";
import { PhilosophyOakBorderCard } from "@/components/ui/PhilosophyOakBorderCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getAboutPageContent } from "@/lib/content";

/**
 * Horizontal shell only — no bottom padding so the cream card can run flush to the footer
 * with no body gradient strip between.
 */
const aboutPageInnerClassName =
  "relative mx-auto w-full max-w-[min(100%,96rem)] overflow-visible px-5 pb-0 pt-0 sm:px-8 lg:px-10";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Iris — the story behind Iris on the Move, solo travel, content creation, and brand collaborations.",
};

/** Story body — Cormorant; kleur/uitvullen via `.about-bordeaux-body` + `.about-bordeaux-story` in globals. */
const bodyClassName =
  "about-bordeaux-body font-text-3 text-[1.06rem] font-normal leading-[1.52] text-justify [hyphens:auto] sm:text-[1.14rem] sm:leading-[1.56]";

/** Lead — same as body (justified under the drop cap). */
const leadClassName = `${bodyClassName} mb-0`;

/** Pull-quote — bordeaux-tinted ink */
const philosophyQuoteClassName =
  "about-philosophy-quote font-text-3 mx-auto w-full max-w-full whitespace-pre-line text-balance text-[0.98rem] font-medium italic leading-[1.52] tracking-[0.02em] sm:text-[1.03rem] sm:leading-[1.56] lg:text-[1.06rem] lg:leading-[1.58]";

/**
 * Eyebrow + section titles — same type scale as Work `SectionHeading` `editorialDual`
 * (“Portfolio” / “Hotels & Airbnbs”): `font-text-3`, medium weight, wide tracking.
 * Color stays black on About (Work uses bordeaux on those lines).
 */
const aboutPageEyebrowClassName =
  "font-text-3 text-[0.72rem] font-medium uppercase leading-none tracking-[0.26em] text-black sm:text-[0.82rem] sm:tracking-[0.24em] md:text-[0.92rem] lg:text-[1.02rem]";

const aboutPageSectionTitleClassName =
  "font-text-3 about-bordeaux-heading max-w-full text-[clamp(0.48rem,calc(1.62vw+0.20rem),1.26rem)] font-medium uppercase leading-[1.12] tracking-[0.18em] text-black";

/** Card horizontal padding */
const cardPadX = "px-8 sm:px-12 lg:px-16 xl:px-20";

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
      <PhotoGallery className="mx-auto w-full mt-2 mb-3 sm:mt-3 sm:mb-4 lg:mt-4 lg:mb-5" />
      <section className="relative isolate z-10 mt-0 w-full scroll-mt-20 sm:scroll-mt-24 bg-transparent pb-0">
        <div className={aboutPageInnerClassName}>
          <ScrollReveal className="overflow-visible">
            <article
              lang="en"
              className={`card-shell about-main-card-flush-top about-bordeaux-story relative z-10 mx-auto mb-0 w-full max-w-none overflow-visible pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 ${cardPadX}`}
            >
            <header className="about-bordeaux-masthead mb-10 flex w-full max-w-none flex-col pt-0 sm:mb-12 lg:mb-14">
              <p className={aboutPageEyebrowClassName}>About me</p>
            </header>

            <div className="about-three-col-grid w-full lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-x-10 lg:gap-y-0">
              {/* Kolom 1 + 2: alleen vaste gap-y — géén 2×2-grid (die maakte rij 1 even hoog en links een grote lege balk). */}
              <div className="flex min-h-0 min-w-0 flex-col gap-y-10 lg:pr-6">
                <div className="flex min-w-0 flex-col gap-0">
                  <h1
                    className={`${aboutPageSectionTitleClassName} max-w-none text-balance text-left`}
                  >
                    {firstSection.title}
                  </h1>
                  <AboutLeadParagraph
                    className={leadClassName}
                    body={firstSection.body}
                    dropCap
                  />
                </div>
                {secondSection ? (
                  <div className="flex flex-col gap-0">
                    <h2
                      className={`${aboutPageSectionTitleClassName} text-balance text-left`}
                    >
                      {secondSection.title}
                    </h2>
                    <p className={`${bodyClassName} mb-0`}>
                      {secondSection.body}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-12 flex min-h-0 min-w-0 flex-col gap-y-10 sm:mt-14 lg:mt-0 lg:pr-6 lg:pt-0">
                {thirdSection ? (
                  <div className="flex min-w-0 flex-col gap-0">
                    <h2
                      className={`${aboutPageSectionTitleClassName} text-balance text-left`}
                    >
                      {thirdSection.title}
                    </h2>
                    <p className={`${bodyClassName} mb-0`}>
                      {thirdSection.body}
                    </p>
                  </div>
                ) : null}
                {fourthSection ? (
                  <div className="flex flex-col gap-0">
                    <h2
                      className={`${aboutPageSectionTitleClassName} text-balance text-left`}
                    >
                      {fourthSection.title}
                    </h2>
                    <p className={`${bodyClassName} mb-0`}>
                      {fourthSection.body}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Col 3: “The bigger picture” + philosophy — op lg: kaart verticaal gecentreerd tussen laatste regel en sectie-onderkant */}
              <div className="mt-12 flex min-h-0 min-w-0 flex-col gap-y-10 sm:mt-14 lg:mt-0 lg:h-full lg:min-h-0 lg:gap-y-0 lg:pt-0">
                {fifthSection ? (
                  <div className="flex min-w-0 shrink-0 flex-col gap-0">
                    <h2
                      className={`${aboutPageSectionTitleClassName} text-balance text-left`}
                    >
                      {fifthSection.title}
                    </h2>
                    <p className={`${bodyClassName} mb-0`}>
                      {fifthSection.body}
                    </p>
                  </div>
                ) : null}
                <div
                  className="flex w-full min-w-0 justify-center break-inside-avoid lg:min-h-0 lg:flex-1 lg:flex-col lg:items-center lg:justify-center"
                  role="region"
                  aria-label={`${about.philosophy.label} ${about.philosophy.headline}`}
                >
                  <PhilosophyOakBorderCard
                    className="philosophy-quote-card--invert w-full max-w-[min(100%,15.75rem)] rounded-lg sm:max-w-[min(100%,16.75rem)] sm:rounded-xl lg:max-w-[min(100%,17.25rem)]"
                    innerClassName="relative z-10 gap-3.5 px-4 pb-6 pt-7 sm:gap-4 sm:px-5 sm:pb-8 sm:pt-8 lg:gap-5 lg:px-6 lg:pb-9 lg:pt-9"
                  >
                    <div className="flex w-full flex-col items-center gap-1 sm:gap-1.5">
                      <span className="font-text-3 text-[0.6rem] font-bold uppercase leading-none tracking-[0.19em] text-white/95 sm:text-[0.64rem] sm:tracking-[0.18em]">
                        {about.philosophy.label}
                      </span>
                      <h2 className="font-text-3 max-w-full text-[0.8rem] font-bold uppercase leading-tight tracking-[0.12em] text-white/95 sm:text-[0.86rem] lg:text-[0.92rem] lg:tracking-[0.11em]">
                        {about.philosophy.headline}
                      </h2>
                      <span
                        className="mt-1.5 h-px w-[min(9.25rem,82%)] max-w-full shrink-0 rounded-full bg-white/45 sm:mt-2"
                        aria-hidden
                      />
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
                      className="about-philosophy-icon-row flex w-full items-center justify-center gap-6 text-white/95 sm:gap-7"
                      aria-hidden
                    >
                      <FaPlane className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 lg:h-[1.05rem] lg:w-[1.05rem]" />
                      <FaEarthAmericas className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 lg:h-[1.05rem] lg:w-[1.05rem]" />
                      <FaCamera className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 lg:h-[1.05rem] lg:w-[1.05rem]" />
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
