"use client";

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
    scale: 1.03,
    y: -5,
    boxShadow: "0px 14px 28px -10px rgba(0, 0, 0, 0.1)",
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

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          delay: entranceDelay,
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-full"
      >
        <motion.div
          variants={cardVariants}
          initial="initial"
          whileHover="hover"
          className={cn(
            "relative flex h-full min-h-[10.5rem] flex-col justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-5 text-center shadow-sm transition-shadow duration-300 sm:min-h-[11rem] sm:rounded-3xl sm:px-5 sm:py-6",
            className,
          )}
          {...motionSafeProps}
        >
          <div className="flex w-full flex-col items-center justify-center gap-3 text-center">
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

            <div className="flex w-full flex-col items-center gap-1">
              <h3 className="font-text-3 max-w-full text-balance text-[clamp(0.52rem,1.75vw+0.22rem,1.32rem)] font-medium uppercase leading-[1.12] tracking-[0.18em] text-[var(--color-primary)] underline decoration-[color-mix(in_srgb,var(--color-primary)_38%,transparent)] decoration-[0.5px] underline-offset-[0.4em]">
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
              className="font-text-3 mx-auto w-full max-w-full whitespace-pre-line text-center text-[clamp(0.82rem,1.1vw+0.52rem,0.98rem)] font-medium leading-[1.38] tracking-[0.02em] text-[var(--color-primary)] sm:text-[1rem]"
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
      </motion.div>
    );
  },
);

PricingCard.displayName = "PricingCard";

export { PricingCard };
