"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

export type GradientSocialMenuItem = {
  href: string;
  /** Full platform name (shown on hover / focus). */
  title: string;
  icon: ReactNode;
  /** Gradient stops — defaults match `.primary-button` (burgundy → terracotta). */
  gradientFrom?: string;
  gradientTo?: string;
};

type GradientSocialMenuProps = {
  items: GradientSocialMenuItem[];
  /** Larger hit targets and icons (e.g. contact page). `compact` = homepage reels footer. */
  size?: "default" | "lg" | "compact";
  /** Merged onto the icon row `<ul>` (e.g. custom gaps). */
  className?: string;
};

/**
 * Expanding gradient menu: icon at rest → gradient fill + full label on hover/focus.
 * Ring uses the same gradient as the primary CTA (`--color-primary` → `--color-secondary`).
 */
const gradientButtonClasses = {
  default:
    "group relative flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface)] shadow-[0_12px_28px_rgba(90,45,50,0.16)] transition-all duration-500 md:h-[60px] md:w-[60px] md:shadow-[0_18px_40px_rgba(90,45,50,0.2)] md:hover:w-[200px] md:hover:shadow-none md:focus-visible:w-[200px] md:focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
  lg: "group relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface)] shadow-[0_14px_34px_rgba(90,45,50,0.18)] transition-all duration-500 md:h-[72px] md:w-[72px] md:shadow-[0_22px_48px_rgba(90,45,50,0.22)] md:hover:w-[232px] md:hover:shadow-none md:focus-visible:w-[232px] md:focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
  compact:
    "group relative flex h-11 w-11 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface)] shadow-none transition-all duration-500 md:h-12 md:w-12 md:shadow-none md:hover:w-[176px] md:focus-visible:w-[176px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
} as const;

function GradientMenuButton({
  href,
  title,
  icon,
  gradientFrom,
  gradientTo,
  buttonClassName,
  iconClassName,
  labelClassName,
}: GradientSocialMenuItem & {
  buttonClassName: string;
  iconClassName: string;
  labelClassName: string;
}) {
  const style = {
    "--gradient-from": gradientFrom ?? "var(--color-primary)",
    "--gradient-to": gradientTo ?? "var(--color-secondary)",
  } as CSSProperties;

  const inner = (
    <>
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-x-0 top-[7px] -z-10 h-full rounded-full bg-[linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] opacity-0 blur-[12px] transition-all duration-500 md:top-[10px] md:blur-[15px] md:group-hover:opacity-50 md:group-focus-visible:opacity-50"
        aria-hidden
      />

      <span className="relative z-10 transition-all duration-500 md:group-hover:scale-0 md:group-hover:delay-0 md:group-focus-visible:scale-0">
        <span className={iconClassName}>
          {icon}
        </span>
      </span>

      <span
        className={`pointer-events-none absolute z-10 hidden px-2 text-center font-semibold uppercase tracking-wide text-white transition-all duration-500 delay-150 md:block md:scale-0 md:group-hover:scale-100 md:group-hover:delay-150 md:group-focus-visible:scale-100 md:group-focus-visible:delay-150 ${labelClassName}`}
      >
        {title}
      </span>
    </>
  );

  const isMailto = href.toLowerCase().startsWith("mailto:");

  if (isMailto) {
    return (
      <a
        href={href}
        style={style}
        className={buttonClassName}
        aria-label={`Send email (opens your default mail app to ${href.replace(/^mailto:/i, "")})`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      className={buttonClassName}
      aria-label={`${title} (opens in a new tab)`}
    >
      {inner}
    </Link>
  );
}

export function GradientSocialMenu({
  items,
  size = "default",
  className,
}: GradientSocialMenuProps) {
  const isLg = size === "lg";
  const isCompact = size === "compact";
  const buttonClassName = isLg
    ? gradientButtonClasses.lg
    : isCompact
      ? gradientButtonClasses.compact
      : gradientButtonClasses.default;
  const iconClassName = isLg
    ? "pointer-events-auto text-2xl text-[var(--color-primary)] md:text-3xl [&>svg]:block [&>svg]:h-6 [&>svg]:w-6 md:[&>svg]:h-8 md:[&>svg]:w-8"
    : isCompact
      ? "pointer-events-auto text-base text-[var(--color-primary)] md:text-xl [&>svg]:block [&>svg]:h-[1.1rem] [&>svg]:w-[1.1rem] md:[&>svg]:h-6 md:[&>svg]:w-6"
      : "pointer-events-auto text-lg text-[var(--color-primary)] md:text-2xl [&>svg]:block [&>svg]:h-5 [&>svg]:w-5 md:[&>svg]:h-7 md:[&>svg]:w-7";
  const labelClassName = isLg ? "text-base" : isCompact ? "text-xs" : "text-sm";

  return (
    <ul
      className={cn(
        /* overflow-x-clip chopped button shadows into a visible “square” behind the row */
        "flex w-full flex-wrap items-center justify-center overflow-visible px-1 pb-0 pt-0",
        isLg ? "gap-5 md:gap-8" : isCompact ? "gap-3 md:gap-4" : "gap-4 md:gap-6",
        className,
      )}
    >
      {items.map(({ href, title, icon, gradientFrom, gradientTo }, idx) => (
        <li key={`${title}-${idx}`} className="list-none">
          <GradientMenuButton
            href={href}
            title={title}
            icon={icon}
            gradientFrom={gradientFrom}
            gradientTo={gradientTo}
            buttonClassName={buttonClassName}
            iconClassName={iconClassName}
            labelClassName={labelClassName}
          />
        </li>
      ))}
    </ul>
  );
}
