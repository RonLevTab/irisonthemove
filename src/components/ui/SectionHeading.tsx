import type { ReactNode } from "react";

import { brandScriptClassName, brandSubtitleClassName } from "@/lib/brandFonts";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  /**
   * `display` — Cormorant display (default section titles).
   * `heroTagline` — same family/feel as hero quote line (`font-text-3` + clamp).
   * `editorialDual` — small uppercase line + larger uppercase line (serif), like “Latest content”
   * on the homepage. Optional `description` uses the same `text-body-lead` as other sections.
   */
  titleVariant?: "display" | "heroTagline" | "editorialDual";
  /** Replaces the default hero tagline clamp when `titleVariant` is `heroTagline`. */
  heroTaglineSizeClassName?: string;
  /** Overrides default `text-4xl sm:text-5xl` on the title (only when `titleVariant` is `display`). */
  titleSizeClassName?: string;
  /** Extra classes for the title line (e.g. letter-spacing, uppercase). */
  titleClassName?: string;
  /** Gap between eyebrow, title, and description (inner stack). Default `gap-5`. */
  stackGapClassName?: string;
  /** Section subcopy — same typography as the hero description paragraph site-wide. */
  description?: string;
  /** Extra classes on the description paragraph (e.g. uppercase + tracking). */
  descriptionClassName?: string;
  /** Extra classes on the eyebrow when `titleVariant` is `editorialDual` (e.g. larger “Portfolio” on Work). */
  editorialDualEyebrowClassName?: string;
  align?: "left" | "center";
  action?: ReactNode;
  /** Extra classes on the root wrapper (e.g. responsive alignment). */
  className?: string;
  /** Extra classes on the eyebrow + title stack. */
  innerClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  titleVariant = "display",
  heroTaglineSizeClassName,
  titleSizeClassName,
  titleClassName,
  stackGapClassName,
  description,
  descriptionClassName,
  align = "left",
  action,
  className,
  innerClassName,
  editorialDualEyebrowClassName,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  const actionLayoutClass =
    action && align === "center"
      ? "items-center text-center"
      : action
        ? "lg:flex-row lg:items-end lg:justify-between lg:text-left"
        : "";

  const stackGap =
    action && align === "center" ? "gap-8" : "gap-4";

  return (
    <div
      className={cn("flex flex-col", stackGap, alignment, actionLayoutClass, className)}
    >
      <div
        className={cn(
          "flex flex-col",
          stackGapClassName ?? "gap-5",
          alignment,
          titleVariant === "editorialDual" ? "w-full max-w-5xl" : "max-w-2xl",
          innerClassName,
        )}
      >
        {eyebrow && titleVariant === "editorialDual" ? (
          <span
            className={cn(
              "font-text-3 font-medium uppercase leading-none tracking-[0.28em] text-[var(--color-primary)] sm:tracking-[0.26em]",
              editorialDualEyebrowClassName ??
                "text-[0.58rem] sm:text-[0.72rem] md:text-[0.74rem]",
            )}
          >
            {eyebrow}
          </span>
        ) : eyebrow && titleVariant !== "editorialDual" ? (
          <span
            className={`${brandSubtitleClassName} text-sm font-normal uppercase tracking-[0.22em] text-[var(--color-primary)]`}
          >
            {eyebrow}
          </span>
        ) : null}
        <h2
          className={
            titleVariant === "editorialDual"
              ? `font-text-3 max-w-full text-balance text-[clamp(0.82rem,2.85vw+0.38rem,1.58rem)] font-medium uppercase leading-[1.12] tracking-[0.18em] text-[var(--color-primary)] max-sm:whitespace-normal sm:whitespace-nowrap ${titleClassName ?? ""}`
              : titleVariant === "heroTagline"
                ? `font-text-3 text-balance ${heroTaglineSizeClassName ?? "text-[clamp(1.15rem,3.2vw,2.55rem)]"} font-medium italic leading-[1.12] tracking-[0.04em] text-[var(--color-primary)] ${titleClassName ?? ""}`
                : `${brandScriptClassName} ${titleSizeClassName ?? "text-3xl sm:text-4xl leading-none"} text-[var(--color-primary)] ${titleClassName ?? ""}`
          }
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "text-body-lead max-w-2xl",
              titleVariant === "editorialDual" && "mt-0",
              descriptionClassName,
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className={align === "center" ? "" : "lg:ml-8"}>{action}</div>
      ) : null}
    </div>
  );
}
