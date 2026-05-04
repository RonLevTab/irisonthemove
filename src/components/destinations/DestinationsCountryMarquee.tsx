"use client";

import React from "react";

import { VISITED_COUNTRIES } from "@/lib/destinationGalleryCountries";
import { cn } from "@/lib/utils";

const VISITED_COUNTRY_COUNT = VISITED_COUNTRIES.length;

/**
 * Country ticker achter het statblok — zelfde schaal/gewicht/tracking als vroeger
 * (Castoro-era layout), maar met Cormorant (`font-text-3`) zoals nu gewenst.
 */
const countryMarqueeTypographyClassName =
  "font-text-3 text-xs font-normal uppercase leading-none tracking-[0.17em] sm:text-sm md:text-[0.95rem]";

/** Same scale as portfolio eyebrow but bold — “countries visited” label. */
const countriesVisitedLabelClassName =
  "font-text-3 font-bold uppercase leading-none tracking-[0.28em] text-[0.64rem] sm:tracking-[0.26em] sm:text-[0.74rem] md:text-[0.84rem] lg:text-[0.94rem]";

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

/** Lichte randen — kort vervagen zodat landen langer leesbaar blijven. */
const TICKER_MASK_EDGES =
  "linear-gradient(90deg, transparent 0%, black 2%, black 98%, transparent 100%)";

/**
 * Smal transparant gat (tekst weg achter stat); spiegelsymmetrisch rond 50% voor gelijke
 * witruimte links/rechts. Smallere 43–57%-band = woorden langer zichtbaar dichter bij 20/label.
 */
const TICKER_MASK_EDGES_AND_CENTER =
  "linear-gradient(90deg, transparent 0%, black 1.5%, black 34%, rgba(0,0,0,0.38) 39%, rgba(0,0,0,0.07) 41.5%, transparent 43%, transparent 57%, rgba(0,0,0,0.07) 58.5%, rgba(0,0,0,0.38) 61%, black 66%, black 98.5%, transparent 100%)";

/**
 * Telefoon: breder volledig transparant midden (27–73%) + kortere feather, zodat landennamen
 * niet meer door de gelezen tekst achter 20 / label komen — desktop blijft strakker.
 */
const TICKER_MASK_EDGES_AND_CENTER_MOBILE =
  "linear-gradient(90deg, transparent 0%, black 1.5%, black 15%, rgba(0,0,0,0.52) 19.5%, rgba(0,0,0,0.12) 23.5%, transparent 27%, transparent 73%, rgba(0,0,0,0.12) 76.5%, rgba(0,0,0,0.52) 80.5%, black 85%, black 98.5%, transparent 100%)";

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
      className="inline-flex shrink-0 flex-col items-center justify-center gap-2 text-center sm:gap-2.5 sm:px-1 [&_span]:[text-shadow:0_1px_0_rgba(255,255,255,0.92),0_0_6px_rgba(244,239,233,0.65)] [&_p]:[text-shadow:0_1px_0_rgba(255,255,255,0.88),0_0_4px_rgba(244,239,233,0.6)]"
      role="status"
      aria-live="polite"
      aria-label={`${VISITED_COUNTRY_COUNT} countries visited`}
    >
      <span className="inline-block min-w-[2.75ch] text-center font-text-3 text-4xl font-bold tabular-nums leading-none tracking-normal text-[var(--color-primary)] sm:text-5xl md:text-6xl">
        {displayCount}
      </span>
      <p
        className={cn(
          "mb-0 max-w-none whitespace-nowrap text-center text-[var(--color-primary)]",
          countriesVisitedLabelClassName,
        )}
      >
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
        "relative flex min-h-[2.65rem] w-full min-w-0 items-center overflow-hidden py-0 sm:min-h-[2.85rem] md:min-h-[3rem]",
        className,
      )}
      dir="ltr"
      style={maskStyle}
      role="region"
      aria-label="Countries visited list"
    >
      {reduceMotion ? (
        <div className="destinations-marquee-reduced-strip flex w-full min-h-[2.65rem] items-center justify-center overflow-x-auto overflow-y-hidden sm:min-h-[2.85rem]">
          <div className="translate-y-1 sm:translate-y-1.5">
            <div
              className={cn(
                countryMarqueeTypographyClassName,
                "flex w-max items-center gap-0 px-1 text-[var(--color-primary)]/[0.78]",
              )}
            >
              <CountryListRow loopKey="static" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full min-w-0">
          <style dangerouslySetInnerHTML={{ __html: keyframesBlock }} />
          <div className="relative flex min-h-[2.65rem] items-center justify-start overflow-hidden sm:min-h-[2.85rem] md:min-h-[3rem]">
            <div className="translate-y-1 sm:translate-y-1.5">
              <div
                className={cn(
                  MARQUEE_CLASS,
                  countryMarqueeTypographyClassName,
                  "flex w-max items-center gap-0 px-1 text-[var(--color-primary)]/[0.78]",
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
        "flex w-full min-w-0 max-w-none flex-col items-center gap-2 sm:gap-3",
        className,
      )}
    >
      <div
        className="relative isolate z-0 -mb-5 w-full -translate-y-[1.375rem] overflow-visible sm:-mb-5 sm:-translate-y-[1.625rem] md:-translate-y-[1.875rem]"
        role="presentation"
      >
        {/*
          Geen extra px hier: sectie heeft al gelijke zij-padding; voorkomt dat het midden
          van de band en het midden van de w-screen strip visueel uit elkaar drijven.
        */}
        <div className="flex w-full justify-center px-0">
          {/*
            Ref. layout: één hoge band; marquee + stat beiden verticaal gecentreerd in
            dezelfde box → landenlijst op het midden van 20 + label samen (niet het smalle
            top-50% kader alleen rond de cijfers).
          */}
          <div className="relative flex w-full max-w-none min-h-[5.75rem] items-center justify-center py-4 sm:min-h-[6.35rem] sm:py-5 md:min-h-[6.95rem] md:py-6">
            {/*
              Geen w-screen: 100vw + scrollbar verschuift het masker-midden t.o.v. het statblok
              (meer lucht links dan rechts). Strip = bandbreedte = zelfde basis als 20/label.
            */}
            <div className="pointer-events-none absolute inset-0 z-[1] flex min-w-0 items-center justify-center overflow-x-clip overflow-y-visible">
              <CountryMarqueeStrip
                reduceMotion={reduceMotion}
                className="min-w-0 py-0"
                clearTickerInCenter
              />
            </div>
            <div className="relative z-[2] flex items-center justify-center">
              <CountriesVisitedPanel />
            </div>
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
