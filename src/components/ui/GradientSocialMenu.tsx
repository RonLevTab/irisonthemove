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
};

/**
 * Expanding gradient menu: icon at rest → gradient fill + full label on hover/focus.
 * Ring uses the same gradient as the primary CTA (`--color-primary` → `--color-secondary`).
 */
const gradientButtonClassName =
  "group relative flex h-[60px] w-[60px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--color-surface)] shadow-[0_18px_40px_rgba(90,45,50,0.2)] transition-all duration-500 md:hover:w-[200px] md:hover:shadow-none md:focus-visible:w-[200px] md:focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]";

function GradientMenuButton({
  href,
  title,
  icon,
  gradientFrom,
  gradientTo,
}: GradientSocialMenuItem) {
  const style = {
    "--gradient-from": gradientFrom ?? "var(--color-primary)",
    "--gradient-to": gradientTo ?? "var(--color-secondary)",
  } as CSSProperties;

  const inner = (
    <>
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-x-0 top-[10px] -z-10 h-full rounded-full bg-[linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] opacity-0 blur-[15px] transition-all duration-500 group-hover:opacity-50 group-focus-visible:opacity-50"
        aria-hidden
      />

      <span className="relative z-10 transition-all duration-500 group-hover:scale-0 group-hover:delay-0 group-focus-visible:scale-0">
        <span className="pointer-events-auto text-2xl text-[var(--color-primary)] [&>svg]:block [&>svg]:h-7 [&>svg]:w-7">
          {icon}
        </span>
      </span>

      <span className="pointer-events-none absolute z-10 px-2 text-center text-sm font-semibold uppercase tracking-wide text-white transition-all duration-500 delay-150 scale-0 group-hover:scale-100 group-hover:delay-150 group-focus-visible:scale-100 group-focus-visible:delay-150">
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
        className={gradientButtonClassName}
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
      className={gradientButtonClassName}
      aria-label={`${title} (opens in a new tab)`}
    >
      {inner}
    </Link>
  );
}

export function GradientSocialMenu({ items }: GradientSocialMenuProps) {
  return (
    <ul className="flex w-full flex-wrap items-center justify-center gap-6 overflow-x-clip">
      {items.map(({ href, title, icon, gradientFrom, gradientTo }, idx) => (
        <li key={`${title}-${idx}`} className="list-none">
          <GradientMenuButton
            href={href}
            title={title}
            icon={icon}
            gradientFrom={gradientFrom}
            gradientTo={gradientTo}
          />
        </li>
      ))}
    </ul>
  );
}
