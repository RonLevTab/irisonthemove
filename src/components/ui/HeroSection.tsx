"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useId } from "react";

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
    <section className="relative isolate flex flex-col justify-center overflow-x-clip overflow-y-visible px-4 pt-10 pb-0 sm:px-6 sm:py-8 sm:pb-6 lg:h-[calc(100svh-var(--nav-stack-height))] lg:max-h-[calc(100svh-var(--nav-stack-height))] lg:min-h-0 lg:flex lg:flex-col lg:justify-start lg:overflow-x-clip lg:overflow-y-visible lg:px-6 lg:py-0 lg:pb-0 xl:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#faf4ed]">
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#faf4ed]/97 via-[#f5ebe3]/91 to-[#f3e9de]"
          aria-hidden
        />
      </div>

      <div className="mx-auto grid min-h-0 w-full max-w-[min(100%,96rem)] gap-10 px-0 py-0 max-lg:justify-items-center max-lg:items-center sm:gap-5 lg:h-full lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:grid-rows-[minmax(0,1fr)] lg:items-stretch lg:justify-items-stretch lg:gap-8 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex min-w-0 w-full flex-col items-center justify-center self-center text-center lg:h-full lg:min-h-0 lg:self-stretch lg:py-3"
        >
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-3 py-5 text-center sm:gap-5 sm:px-5 sm:py-5 lg:max-w-none lg:gap-6 lg:px-0 lg:py-0">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="hero-home-headline font-text-3 flex w-full justify-center text-center font-medium italic leading-[1.15] tracking-[0.04em] text-black"
            >
              <span className="sr-only">{title}. </span>
              <HeroTaglineContent tagline={tagline} />
            </motion.h1>
            <p className="hero-home-subhead font-text-3 w-full max-w-none text-balance font-medium leading-relaxed tracking-[0.02em] text-[var(--color-primary)]">
              {(() => {
                const sep = " ~ ";
                const i = description.lastIndexOf(sep);
                if (i === -1) return description;
                const copy = description.slice(0, i);
                const breakAt = ", UGC";
                const breakIndex = copy.indexOf(breakAt);
                if (breakIndex !== -1) {
                  return (
                    <span className="inline-flex max-w-full flex-col items-center gap-1 text-center">
                      <span>{copy.slice(0, breakIndex + 1)}</span>
                      <span>
                        {copy.slice(breakIndex + 2)}
                        {sep}
                        <strong className="font-bold text-[var(--color-primary)]">
                          {description.slice(i + sep.length)}
                        </strong>
                      </span>
                    </span>
                  );
                }
                return (
                  <span className="inline-flex max-w-full flex-col items-center gap-1 text-center">
                    <span>{copy}</span>
                    <span>
                      {sep}
                    <strong className="font-bold text-[var(--color-primary)]">
                      {description.slice(i + sep.length)}
                    </strong>
                    </span>
                  </span>
                );
              })()}
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="primary-button text-[0.82rem] tracking-[0.14em] sm:text-[0.78rem] sm:tracking-[0.18em]"
                href={primaryCta.href}
              >
                {primaryCta.label}
              </Link>
              <Link
                className="secondary-button text-[0.82rem] tracking-[0.14em] sm:text-[0.78rem] sm:tracking-[0.18em]"
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
          className="relative z-10 mx-auto flex w-full max-w-md shrink-0 flex-col items-stretch self-center min-h-0 lg:mx-0 lg:h-full lg:max-w-none lg:self-stretch lg:px-8 xl:px-12"
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
            className="relative aspect-[2/11] max-h-[min(80svh,900px)] w-full overflow-hidden shadow-[0_20px_50px_rgba(58,36,32,0.18)] lg:mx-auto lg:aspect-[2/3] lg:h-[calc(100%+7rem)] lg:max-h-none lg:min-h-0 lg:w-auto lg:max-w-[42rem] lg:-translate-y-3"
            style={{ clipPath: `url(#${archClipId})` }}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="origin-center object-cover object-[center_32%] scale-[1.16] -translate-y-[7%] lg:-translate-y-[3%] lg:scale-[1.08] lg:object-[center_44%]"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
