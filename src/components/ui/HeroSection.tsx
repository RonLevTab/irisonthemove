"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useId } from "react";

import { cn } from "@/lib/utils";

function HeroTaglineText({ text }: { text: string }) {
  const match = text.match(/^(Cinematic)(\s+)(.+)$/i);
  if (match) {
    return (
      <>
        <strong className="font-semibold not-italic text-black">{match[1]}</strong>
        {match[2]}
        {match[3]}
      </>
    );
  }
  return text;
}

/**
 * Two-line hero: opening “ before first line; closing ” after last word on line 2
 * (“…photography”). Use `\n` in CMS/JSON between lines.
 */
function HeroTaglineContent({ tagline }: { tagline: string }) {
  const lines = tagline
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (lines.length >= 2) {
    return (
      <span className="inline-flex max-w-full flex-col items-center gap-1 text-center">
        <span className="block min-w-0 max-w-full whitespace-nowrap px-0.5 text-center">
          <span aria-hidden className="select-none">
            {"\u201c"}
          </span>
          <HeroTaglineText text={lines[0]} />
        </span>
        <span className="block min-w-0 max-w-full whitespace-nowrap px-0.5 text-center">
          {lines[1]}
          <span aria-hidden className="select-none">
            {"\u201d"}
          </span>
        </span>
      </span>
    );
  }
  const single = (lines[0] ?? tagline).trim();
  return (
    <>
      <span aria-hidden className="select-none">
        {"\u201c"}
      </span>
      <HeroTaglineText text={single} />
      <span aria-hidden className="select-none">
        {"\u201d"}
      </span>
    </>
  );
}

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  tagline: string;
  description: string;
  backgroundImage: string;
  image: string;
  imageAlt: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
};

export function HeroSection({
  eyebrow: _eyebrow,
  title,
  tagline,
  description,
  backgroundImage,
  image,
  imageAlt,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  const archClipId = useId().replace(/:/g, "");

  return (
    <section
      className={cn(
        "relative isolate flex flex-col justify-start overflow-x-clip overflow-y-visible px-6 pb-0 pt-10 max-sm:pt-16 sm:px-10 sm:pb-0 sm:pt-8 lg:h-[calc(100svh-var(--nav-stack-height))] lg:max-h-[calc(100svh-var(--nav-stack-height))] lg:min-h-0 lg:flex lg:flex-col lg:justify-start lg:overflow-x-clip lg:overflow-y-visible lg:px-12 lg:py-0 lg:pb-0",
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#faf4ed]">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-[30%_center]"
          sizes="(max-width: 1024px) 100vw, min(100vw, 1280px)"
          priority
          fetchPriority="high"
          aria-hidden
        />
        {/*
          Wash over hero photo — same burgundy as wordmark (`--color-primary`), softly mixed
          into cream so it reads as one brand “fade”, not a flat grey overlay.
        */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#faf4ed]/95 via-[color-mix(in_srgb,var(--color-background)_91%,var(--color-primary)_9%)]/92 to-[color-mix(in_srgb,#ebe3dc_78%,var(--color-primary)_22%)]/88"
          aria-hidden
        />
      </div>

      <div className="mx-auto grid min-h-0 w-full max-w-[min(100%,96rem)] gap-8 px-0 py-0 max-lg:justify-items-center max-lg:items-center sm:gap-5 lg:h-full lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:grid-rows-[minmax(0,1fr)] lg:items-stretch lg:justify-items-stretch lg:gap-y-8 lg:gap-x-[clamp(1.75rem,3.2vw,3rem)] lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex min-w-0 w-full flex-col items-center justify-center self-center px-0 text-center lg:h-full lg:min-h-0 lg:items-start lg:justify-center lg:self-stretch lg:py-3"
        >
          <div className="mx-auto flex w-full max-w-none flex-col items-center gap-5 py-4 text-center sm:gap-5 sm:py-5 lg:mx-0 lg:w-max lg:max-w-full lg:items-center lg:gap-6 lg:py-0">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="hero-home-headline font-text-3 flex w-full justify-center text-center font-medium italic leading-[1.15] tracking-[0.04em] text-black"
            >
              <span className="sr-only">{title}. </span>
              <HeroTaglineContent tagline={tagline} />
            </motion.h1>
            <p className="hero-home-subhead font-text-3 my-4 w-full max-w-none text-balance text-center font-medium leading-relaxed tracking-[0.02em] text-pretty text-[var(--color-primary)] sm:my-5">
              {(() => {
                const sep = " ~ ";
                const i = description.lastIndexOf(sep);
                if (i === -1) return description;
                const copy = description.slice(0, i);
                const breakCandidates = [", authentic digital creativity", ", UGC", " and UGC"];
                const breakToken = breakCandidates.find((token) => copy.includes(token)) ?? null;
                const breakIndex = breakToken ? copy.indexOf(breakToken) : -1;
                if (breakIndex !== -1) {
                  const includeCommaInFirstLine = breakToken?.startsWith(",") ?? false;
                  const firstLine = includeCommaInFirstLine
                    ? copy.slice(0, breakIndex + 1)
                    : copy.slice(0, breakIndex);
                  const secondLine = includeCommaInFirstLine
                    ? copy.slice(breakIndex + 2)
                    : copy.slice(breakIndex + 1);
                  return (
                    <span className="flex w-full max-w-full flex-col gap-1 text-center">
                      <span className="block w-full text-center">{firstLine}</span>
                      <span className="block w-full text-center">
                        {secondLine}
                        {sep}
                        <strong className="font-bold text-[var(--color-primary)]">
                          {description.slice(i + sep.length)}
                        </strong>
                      </span>
                    </span>
                  );
                }
                return (
                  <span className="flex w-full max-w-full flex-col gap-1 text-center">
                    <span className="block w-full text-center">{copy}</span>
                    <span className="block w-full text-center">
                      {sep}
                    <strong className="font-bold text-[var(--color-primary)]">
                      {description.slice(i + sep.length)}
                    </strong>
                    </span>
                  </span>
                );
              })()}
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                className="primary-button text-[0.88rem] tracking-[0.14em] sm:text-[0.82rem] sm:tracking-[0.16em] lg:text-[0.9rem] lg:tracking-[0.18em]"
                href={primaryCta.href}
              >
                {primaryCta.label}
              </Link>
              <Link
                className="secondary-button text-[0.88rem] tracking-[0.14em] sm:text-[0.82rem] sm:tracking-[0.16em] lg:text-[0.9rem] lg:tracking-[0.18em]"
                href={secondaryCta.href}
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto flex w-full max-w-md shrink-0 flex-col items-stretch self-center min-h-0 overflow-hidden max-lg:overflow-hidden max-lg:mb-0 lg:mx-0 lg:flex lg:min-h-0 lg:h-full lg:max-w-none lg:flex-col lg:self-stretch lg:overflow-visible lg:px-0"
        >
          <svg
            className="pointer-events-none absolute h-0 w-0"
            aria-hidden
          >
            <defs>
              <clipPath
                id={archClipId}
                clipPathUnits="objectBoundingBox"
              >
                {/*
                  Roman arch: true semicircle on top (rounder tip), flat base.
                  Taller frame (aspect + max-h) extends the bottom half in px.
                */}
                <path d="M 0,1 L 0,0.5 A 0.5,0.5 0 0,1 1,0.5 L 1,1 Z" />
              </clipPath>
            </defs>
          </svg>
          <div
            className="relative aspect-[3/5] max-h-[min(92dvh,820px)] w-full overflow-visible bg-[#322a26] shadow-[0_20px_50px_rgba(58,36,32,0.18)] max-lg:overflow-hidden max-lg:bg-[var(--color-background)] lg:mx-0 lg:aspect-auto lg:flex-1 lg:min-h-0 lg:h-full lg:max-h-none lg:w-full lg:max-w-full lg:self-stretch lg:bg-transparent"
            style={{ clipPath: `url(#${archClipId})` }}
          >
            {/*
              Desktop: arch fills the right column (no gap of hero bg under the clip).
              Narrow: extra bottom span + scale so object-cover fills the arch foot.
            */}
            <div className="absolute inset-0 overflow-hidden max-lg:bottom-[-1px] lg:h-full">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover saturate-[0.92] max-lg:origin-bottom max-lg:object-bottom max-lg:object-[48%_88%] max-lg:scale-[1.14] max-lg:translate-y-0 lg:min-h-0 lg:scale-[1.02] lg:object-[48%_44%]"
              sizes="(max-width: 1024px) 100vw, min(54vw, 720px)"
              priority
              fetchPriority="high"
            />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
