"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { MdDiamond } from "react-icons/md";

import { cn } from "@/lib/utils";

const springHover = {
  type: "spring" as const,
  stiffness: 300,
  damping: 20,
};

const cardVariants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.015,
    y: -3,
    boxShadow: "0 18px 34px rgba(58, 36, 32, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.85)",
    transition: springHover,
  },
};

const imageVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: -5,
    transition: springHover,
  },
};

export interface PricingCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  price?: string;
  priceDescription?: string;
  description: string;
  features?: string[];
  imageSrc?: string;
  imageAlt?: string;
  /** Staggered scroll-in delay (seconds). */
  entranceDelay?: number;
  /** When set, the whole card is a link (e.g. homepage services → My Work). */
  href?: string;
}

type CardSurfaceProps = {
  className?: string;
  title: string;
  price?: string;
  priceDescription?: string;
  description: string;
  features?: string[];
  imageSrc?: string;
  imageAlt?: string;
  motionSafeProps: Record<string, unknown>;
};

function CardSurface({
  className,
  title,
  price,
  priceDescription,
  description,
  features,
  imageSrc,
  imageAlt,
  motionSafeProps,
}: CardSurfaceProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className={cn(
        "relative flex h-full min-h-0 flex-col justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4.5 text-center shadow-sm transition-shadow duration-300 sm:rounded-3xl sm:px-7 sm:py-7 lg:px-8 lg:py-8",
        className,
      )}
      {...motionSafeProps}
    >
      <div className="flex w-full flex-col items-center justify-center gap-2 text-center sm:gap-4">
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={imageAlt ?? title}
            width={64}
            height={64}
            className="order-first mb-1 h-14 w-14 shrink-0 select-none rounded-2xl object-cover sm:h-16 sm:w-16"
            variants={imageVariants}
          />
        ) : null}

        <div className="flex w-full flex-col items-center gap-2 sm:gap-2.5">
          <h3 className="font-text-3 max-w-full text-balance text-[0.92rem] font-medium uppercase leading-snug tracking-[0.16em] text-[var(--color-primary)] underline decoration-[color-mix(in_srgb,var(--color-primary)_38%,transparent)] decoration-[0.5px] underline-offset-[0.35em] sm:text-lg lg:text-xl">
            {title}
          </h3>
          {price ? (
            <div className="mt-1">
              <span className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                {price}
              </span>
              {priceDescription ? (
                <p className="text-xs text-[var(--color-foreground-muted)]">
                  {priceDescription}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <p
          className="font-text-3 mx-auto w-full max-w-[26rem] whitespace-pre-line text-center text-[0.86rem] font-medium leading-[1.5] tracking-[0.02em] text-[var(--color-primary)] sm:text-lg lg:max-w-[28rem] lg:text-[1.0625rem] lg:leading-[1.45]"
          title={description}
        >
          {description}
        </p>

        {features && features.length > 0 ? (
          <ul className="mt-1 flex w-full flex-col items-center gap-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex max-w-[17rem] flex-col items-center gap-1 text-center"
              >
                <MdDiamond
                  className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]"
                  aria-hidden
                />
                <span className="text-balance text-xs leading-snug text-[var(--color-foreground)] sm:text-sm">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </motion.div>
  );
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      className,
      title,
      price,
      priceDescription,
      description,
      features,
      imageSrc,
      imageAlt,
      entranceDelay = 0,
      href,
      ...props
    },
    ref,
  ) => {
    const {
      onDrag: _onDrag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      onAnimationStart: _onAnimationStart,
      onAnimationEnd: _onAnimationEnd,
      onAnimationIteration: _onAnimationIteration,
      ...motionSafeProps
    } = props;

    const surface = (
      <CardSurface
        className={className}
        title={title}
        price={price}
        priceDescription={priceDescription}
        description={description}
        features={features}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        motionSafeProps={motionSafeProps}
      />
    );

    return (
      <motion.div
        ref={ref}
        initial={{ y: 20 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.05, margin: "0px 0px -64px 0px" }}
        transition={{
          delay: entranceDelay,
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-full min-h-[12rem] sm:min-h-[15.5rem] lg:min-h-[17.5rem]"
      >
        {href ? (
          <Link
            href={href}
            className="block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-secondary)_40%,var(--color-gold)_60%)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] sm:rounded-3xl"
            aria-label={`${title} — open My Work portfolio`}
          >
            {surface}
          </Link>
        ) : (
          surface
        )}
      </motion.div>
    );
  },
);

PricingCard.displayName = "PricingCard";

export { PricingCard };
