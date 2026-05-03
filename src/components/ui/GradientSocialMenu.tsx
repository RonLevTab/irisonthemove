"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

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
  /** Larger hit targets and icons (e.g. contact page). */
  size?: "default" | "lg";
};

/**
 * Expanding gradient menu: icon at rest → gradient fill + full label on hover/focus.
 * Ring uses the same gradient as the primary CTA (`--color-primary` → `--color-secondary`).
 */
const gradientButtonClasses = {
  default:
    "group relative flex h-[60px] w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface)] shadow-[0_18px_40px_rgba(90,45,50,0.2)] transition-all duration-500 md:hover:w-[200px] md:hover:shadow-none md:focus-visible:w-[200px] md:focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
  lg: "group relative flex h-[72px] w-[72px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface)] shadow-[0_22px_48px_rgba(90,45,50,0.22)] transition-all duration-500 md:hover:w-[232px] md:hover:shadow-none md:focus-visible:w-[232px] md:focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
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
        className="pointer-events-none absolute inset-x-0 top-[10px] -z-10 h-full rounded-full bg-[linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] opacity-0 blur-[15px] transition-all duration-500 md:group-hover:opacity-50 md:group-focus-visible:opacity-50"
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

export function GradientSocialMenu({ items, size = "default" }: GradientSocialMenuProps) {
  const isLg = size === "lg";
  const buttonClassName = isLg ? gradientButtonClasses.lg : gradientButtonClasses.default;
  const iconClassName = isLg
    ? "pointer-events-auto text-3xl text-[var(--color-primary)] [&>svg]:block [&>svg]:h-8 [&>svg]:w-8"
    : "pointer-events-auto text-2xl text-[var(--color-primary)] [&>svg]:block [&>svg]:h-7 [&>svg]:w-7";
  const labelClassName = isLg ? "text-base" : "text-sm";

  return (
    <ul
      className={`flex w-full flex-wrap items-center justify-center overflow-x-clip ${isLg ? "gap-8" : "gap-6"}`}
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
