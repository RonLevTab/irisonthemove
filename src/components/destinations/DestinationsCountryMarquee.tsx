"use client";

import React from "react";

import { VISITED_COUNTRIES } from "@/lib/destinationGalleryCountries";
import {
  brandSubtitleClassName,
  brandWordmarkNavSubtitleTextSizeClassName,
} from "@/lib/brandFonts";
import { cn } from "@/lib/utils";

const VISITED_COUNTRY_COUNT = VISITED_COUNTRIES.length;

const MARQUEE_CLASS = "destinations-country-marquee-h-track";

/** ~25% faster than 90s (~0.75× duration). */
const MARQUEE_DURATION_SECONDS = 68;

/**
 * Identical list segments joined by SeparatorDot. Must be >= 2. Seamless loop uses
 * translateX(-100%/N): one period = one segment + one dot (see CountryMarqueeStrip).
 */
const MARQUEE_LOOP_SEGMENTS = 4;

const SEPARATOR_FADE =
  "linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(90,45,50,0.05) 28%, rgba(90,45,50,0.34) 50%, rgba(90,45,50,0.05) 72%, transparent 90%, transparent 100%)";

const SEPARATOR_FADE_H =
  "linear-gradient(to right, transparent 0%, rgba(90,45,50,0.12) 22%, rgba(90,45,50,0.28) 50%, rgba(90,45,50,0.12) 78%, transparent 100%)";

const TICKER_HORIZONTAL_MASK =
  "linear-gradient(90deg, transparent 0%, black 9%, black 91%, transparent 100%)";

function SeparatorDot() {
  /* Fixed rem so size stays visible when country labels use small logo-matched type */
  return (
    <span
      className="mx-3 inline-flex shrink-0 select-none items-center justify-center px-0.5 text-[1.75rem] leading-none text-[#8a6d50] sm:mx-4 sm:px-1 sm:text-[2.05rem]"
      aria-hidden
    >
      ·
    </span>
  );
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function CountriesVisitedPanel() {
  const [displayCount, setDisplayCount] = React.useState(0);
  const reduceMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const max = VISITED_COUNTRY_COUNT;
    if (reduceMotion) {
      setDisplayCount(max);
      return;
    }
    let current = 0;
    setDisplayCount(0);
    const stepMs = 58;
    const id = window.setInterval(() => {
      current += 1;
      setDisplayCount(Math.min(current, max));
      if (current >= max) clearInterval(id);
    }, stepMs);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <div
      className="inline-flex shrink-0 flex-col items-center justify-center gap-1 py-1 text-center sm:min-w-[6.5rem] sm:gap-1.5 sm:px-3"
      role="status"
      aria-live="polite"
      aria-label={`${VISITED_COUNTRY_COUNT} countries visited`}
    >
      <div className="flex h-10 min-w-[2.5ch] items-center justify-center overflow-hidden sm:h-11">
        <span className="inline-block text-center font-text-3 text-3xl font-bold tabular-nums leading-none tracking-normal text-[var(--color-primary)] sm:text-4xl">
          {displayCount}
        </span>
      </div>
      <p className="font-text-3 max-w-[9rem] text-[0.55rem] font-bold uppercase leading-tight tracking-[0.18em] text-[var(--color-primary)] sm:text-[0.62rem]">
        countries visited
      </p>
    </div>
  );
}

function CountryListRow({ loopKey }: { loopKey: string }) {
  return (
    <>
      {VISITED_COUNTRIES.map((c, index) => (
        <React.Fragment key={`${c.id}-${loopKey}`}>
          {index > 0 ? <SeparatorDot /> : null}
          <span className="shrink-0 whitespace-nowrap">{c.label}</span>
        </React.Fragment>
      ))}
    </>
  );
}

function CountryMarqueeStrip({ reduceMotion }: { reduceMotion: boolean }) {
  const loopShiftPercent = 100 / MARQUEE_LOOP_SEGMENTS;

  const keyframesBlock = `
    @keyframes destinations-country-marquee-h {
      0% { transform: translateX(0); }
      100% { transform: translateX(-${loopShiftPercent}%); }
    }
    .${MARQUEE_CLASS} {
      animation: destinations-country-marquee-h ${MARQUEE_DURATION_SECONDS}s linear infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .${MARQUEE_CLASS} {
        animation: none;
      }
    }
  `;

  const maskStyle = React.useMemo(
    () =>
      ({
        maskImage: TICKER_HORIZONTAL_MASK,
        WebkitMaskImage: TICKER_HORIZONTAL_MASK,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
      }) as const,
    [],
  );

  return (
    <div
      className="relative flex min-h-[2.25rem] w-full min-w-0 items-center overflow-hidden py-1 sm:min-h-[2.5rem]"
      style={maskStyle}
      role="region"
      aria-label="Countries visited list"
    >
      {reduceMotion ? (
        <div className="flex w-full min-h-[2rem] items-center justify-center overflow-x-auto overflow-y-hidden sm:min-h-[2.25rem]">
          <div
            className={cn(
              brandSubtitleClassName,
              brandWordmarkNavSubtitleTextSizeClassName,
              "flex w-max items-center gap-0 px-1 font-normal uppercase tracking-[0.18em] text-[var(--color-primary)]/90",
            )}
          >
            <CountryListRow loopKey="static" />
          </div>
        </div>
      ) : (
        <div className="relative w-full min-w-0">
          <style dangerouslySetInnerHTML={{ __html: keyframesBlock }} />
          <div className="relative flex min-h-[2rem] items-center justify-center overflow-hidden sm:min-h-[2.25rem]">
            <div
              className={cn(
                MARQUEE_CLASS,
                brandSubtitleClassName,
                brandWordmarkNavSubtitleTextSizeClassName,
                "flex w-max items-center gap-0 px-1 font-normal uppercase tracking-[0.18em] text-[var(--color-primary)]/90",
              )}
            >
              {Array.from({ length: MARQUEE_LOOP_SEGMENTS }, (_, i) => (
                <React.Fragment key={`marquee-seg-${i}`}>
                  <CountryListRow loopKey={`s${i}`} />
                  <SeparatorDot />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type DestinationsCountryMarqueeProps = {
  className?: string;
  cardMessage?: string;
};

export function DestinationsCountryMarquee({
  className,
  cardMessage,
}: DestinationsCountryMarqueeProps) {
  const reduceMotion = usePrefersReducedMotion();
  const note = cardMessage?.trim();

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-col items-center gap-3 sm:gap-4",
        className,
      )}
    >
      <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:gap-5 lg:gap-6">
        <div className="w-full min-w-0 sm:flex-1">
          <CountryMarqueeStrip reduceMotion={reduceMotion} />
        </div>

        <div
          className="ml-auto mr-0 block h-px w-full max-w-[14rem] shrink-0 sm:hidden"
          style={{ background: SEPARATOR_FADE_H }}
          aria-hidden
        />

        <div className="flex w-full flex-col items-center gap-0 sm:w-auto sm:flex-row sm:items-center sm:gap-4 md:gap-6 lg:gap-8">
          <div
            className="hidden h-14 w-px shrink-0 sm:block sm:self-center"
            style={{ background: SEPARATOR_FADE }}
            aria-hidden
          />
          <div className="flex w-full shrink-0 justify-center sm:w-auto sm:justify-end">
            <CountriesVisitedPanel />
          </div>
        </div>
      </div>

      {note ? (
        <p className="max-w-2xl px-0 text-center font-text-3 text-sm font-bold leading-relaxed text-[var(--color-foreground-muted)] sm:text-[0.95rem]">
          <span className="block text-pretty break-words">{note}</span>
        </p>
      ) : null}
    </div>
  );
}
