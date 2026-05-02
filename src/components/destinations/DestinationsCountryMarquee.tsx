"use client";

import React from "react";

import { VISITED_COUNTRIES } from "@/lib/destinationGalleryCountries";
import {
  brandSubtitleClassName,
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

/** Narrow edge fade — wide fades read as empty margin on Safari; keep soft feather only. */
const TICKER_MASK_EDGES =
  "linear-gradient(90deg, transparent 0%, black 3%, black 97%, transparent 100%)";

/**
 * Same edge fades + soft “hole” in the middle so labels vanish at the vertical rules
 * and reappear past them (nothing reads through the stat).
 */
const TICKER_MASK_EDGES_AND_CENTER =
  "linear-gradient(90deg, transparent 0%, black 3%, black 38%, transparent 42%, transparent 58%, black 62%, black 97%, transparent 100%)";

const TICKER_MASK_EDGES_AND_CENTER_MOBILE =
  "linear-gradient(90deg, transparent 0%, black 3%, black 8%, rgba(0,0,0,0.45) 16%, transparent 30%, transparent 70%, rgba(0,0,0,0.45) 84%, black 92%, black 97%, transparent 100%)";

function SeparatorDot() {
  /* Subtle middle dots — same spacing as country labels, lower contrast so landen leidend blijven */
  return (
    <span
      className="mx-3 inline-flex shrink-0 select-none items-center justify-center px-0.5 text-[1.2rem] font-light leading-none text-[var(--color-primary)]/28 sm:mx-4 sm:px-1 sm:text-[1.32rem] sm:text-[var(--color-primary)]/30 md:text-[1.42rem] md:text-[var(--color-primary)]/32"
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
      className="inline-flex shrink-0 flex-col items-center justify-center gap-1 text-center sm:gap-1.5 sm:px-1 [&_span]:[text-shadow:0_0_10px_#f4efe9,0_0_18px_#f2ede6,0_1px_0_rgba(255,255,255,0.8)] [&_p]:[text-shadow:0_0_8px_#f4efe9,0_0_14px_#f2ede6]"
      role="status"
      aria-live="polite"
      aria-label={`${VISITED_COUNTRY_COUNT} countries visited`}
    >
      <span className="inline-block min-w-[2.5ch] text-center font-text-3 text-3xl font-bold tabular-nums leading-none tracking-normal text-[var(--color-primary)] sm:text-4xl md:text-5xl">
        {displayCount}
      </span>
      <p className="font-text-3 mb-0 max-w-[10rem] text-[0.62rem] font-bold uppercase leading-tight tracking-[0.18em] text-[var(--color-primary)] sm:text-[0.68rem] md:text-xs">
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

function CountryMarqueeStrip({
  reduceMotion,
  className,
  clearTickerInCenter = false,
}: {
  reduceMotion: boolean;
  className?: string;
  /** Fade ticker out at center (paired vertical rules + stat). */
  clearTickerInCenter?: boolean;
}) {
  const loopShiftPercent = 100 / MARQUEE_LOOP_SEGMENTS;
  const [useMobileCenterMask, setUseMobileCenterMask] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setUseMobileCenterMask(mq.matches);

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

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
        maskImage: clearTickerInCenter
          ? useMobileCenterMask
            ? TICKER_MASK_EDGES_AND_CENTER_MOBILE
            : TICKER_MASK_EDGES_AND_CENTER
          : TICKER_MASK_EDGES,
        WebkitMaskImage: clearTickerInCenter
          ? useMobileCenterMask
            ? TICKER_MASK_EDGES_AND_CENTER_MOBILE
            : TICKER_MASK_EDGES_AND_CENTER
          : TICKER_MASK_EDGES,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }) as const,
    [clearTickerInCenter, useMobileCenterMask],
  );

  return (
    <div
      className={cn(
        "relative flex min-h-[2.5rem] w-full min-w-0 items-center overflow-hidden py-1 sm:min-h-[2.65rem] md:min-h-[2.85rem]",
        className,
      )}
      style={maskStyle}
      role="region"
      aria-label="Countries visited list"
    >
      {reduceMotion ? (
        <div className="flex w-full min-h-[2.5rem] items-center justify-center overflow-x-auto overflow-y-hidden sm:min-h-[2.65rem]">
          <div
            className={cn(
              brandSubtitleClassName,
              "flex w-max items-center gap-0 px-1 text-xs font-normal uppercase tracking-[0.17em] text-[var(--color-primary)]/90 sm:text-sm md:text-[0.95rem]",
            )}
          >
            <CountryListRow loopKey="static" />
          </div>
        </div>
      ) : (
        <div className="relative w-full min-w-0">
          <style dangerouslySetInnerHTML={{ __html: keyframesBlock }} />
          <div className="relative flex min-h-[2.5rem] items-center justify-start overflow-hidden sm:min-h-[2.65rem] md:min-h-[2.85rem]">
            <div
              className={cn(
                MARQUEE_CLASS,
                brandSubtitleClassName,
                "flex w-max items-center gap-0 px-1 text-xs font-normal uppercase tracking-[0.17em] text-[var(--color-primary)]/90 sm:text-sm md:text-[0.95rem]",
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
        "flex w-full min-w-0 max-w-none flex-col items-center gap-3 sm:gap-4",
        className,
      )}
    >
      <div
        className="relative w-full min-h-[5.25rem] overflow-hidden sm:min-h-[5.75rem] md:min-h-[6.25rem]"
        role="presentation"
      >
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 flex -translate-y-[34%] items-center justify-center">
          <CountryMarqueeStrip
            reduceMotion={reduceMotion}
            className="w-full py-0"
            clearTickerInCenter
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 flex min-h-[5.25rem] items-center justify-center py-3 sm:min-h-[5.75rem] sm:py-4 md:min-h-[6.25rem]">
          <div className="pointer-events-auto flex items-center justify-center gap-2.5 px-5 sm:gap-4 sm:px-7 md:gap-5 md:px-8">
            <CountriesVisitedPanel />
          </div>
        </div>
      </div>

      {note ? (
        <p className="max-w-2xl px-4 text-center font-text-3 text-sm font-bold leading-relaxed text-[var(--color-foreground-muted)] sm:px-6 sm:text-[0.95rem]">
          <span className="block text-pretty break-words">{note}</span>
        </p>
      ) : null}
    </div>
  );
}
