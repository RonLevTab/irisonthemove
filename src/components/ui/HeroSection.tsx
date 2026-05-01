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
        <span className="block min-w-0 whitespace-nowrap px-0.5 text-center">
          <span aria-hidden className="select-none">
            {"\u201c"}
          </span>
          <HeroTaglineText text={lines[0]} />
        </span>
        <span className="block min-w-0 whitespace-nowrap px-0.5 text-center">
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
    <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col justify-center overflow-x-clip overflow-y-visible px-4 py-6 sm:px-6 sm:py-8 lg:h-[calc(100svh-5rem)] lg:max-h-[calc(100svh-5rem)] lg:min-h-0 lg:overflow-hidden lg:py-5">
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

      <div className="mx-auto grid min-h-0 w-full max-w-[68rem] items-center gap-4 px-0 py-0 sm:gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex min-w-0 flex-col items-center text-center"
        >
          <div className="mx-auto w-full max-w-2xl px-4 py-5 sm:px-6 sm:py-6 lg:max-w-3xl lg:px-6 lg:py-0">
            <div className="flex w-full flex-col items-center gap-5 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 }}
                className="font-text-3 text-center text-[clamp(1.08rem,3.9vw,2.55rem)] font-medium italic leading-[1.15] tracking-[0.04em] text-black"
              >
                <span className="sr-only">{title}. </span>
                <HeroTaglineContent tagline={tagline} />
              </motion.h1>
              <p className="font-text-3 w-full max-w-none text-balance text-[clamp(1.1rem,2.4vw+0.7rem,1.28rem)] font-medium leading-relaxed tracking-[0.02em] text-[var(--color-primary)]">
                {(() => {
                  const sep = " ~ ";
                  const i = description.lastIndexOf(sep);
                  if (i === -1) return description;
                  return (
                    <>
                      {description.slice(0, i)}
                      {sep}
                      <strong className="font-bold text-[var(--color-primary)]">
                        {description.slice(i + sep.length)}
                      </strong>
                    </>
                  );
                })()}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-5 flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:mt-6 sm:flex-row sm:gap-4 lg:mt-7 lg:max-w-3xl lg:justify-center">
            <Link
              className="primary-button text-[0.95rem] tracking-[0.16em] sm:text-sm sm:tracking-[0.2em]"
              href={primaryCta.href}
            >
              {primaryCta.label}
            </Link>
            <Link
              className="secondary-button text-[0.95rem] tracking-[0.16em] sm:text-sm sm:tracking-[0.2em]"
              href={secondaryCta.href}
            >
              {secondaryCta.label}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 mx-auto min-h-0 w-full max-w-md lg:mx-0 lg:max-w-none"
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
            className="relative aspect-[2/11] max-h-[min(92dvh,1400px)] w-full overflow-hidden shadow-[0_20px_50px_rgba(58,36,32,0.18)]"
            style={{ clipPath: `url(#${archClipId})` }}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="origin-center object-cover object-[center_22%] scale-[1.08] -translate-y-[7%]"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
