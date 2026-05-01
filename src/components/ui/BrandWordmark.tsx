import {
  brandWordmarkNavSubtitleTextSizeClassName,
  fontBrandSubtitle,
  fontLogoScript,
} from "@/lib/brandFonts";

type BrandWordmarkProps = {
  align?: "left" | "center";
  size?: "sm" | "md" | "lg" | "xl";
  /** When set, replaces the default script size classes for `size`. */
  scriptClassName?: string;
  /** When set, replaces the default subtitle size classes for `size`. */
  titleClassName?: string;
};

/**
 * Hero (`xl`) = navbar (`sm`) sizes × WORDMARK_HERO_SCALE on every step.
 * Nav script rem: 2.25 (default) / 3 (`sm:`). Nav title rem: 0.62 / 0.75 (`sm:`).
 * With scale 2 → `text-[4.5rem] sm:text-[6rem]` and `text-[1.24rem] sm:text-[1.5rem]`.
 * Keep literals static so Tailwind JIT includes them; when changing scale, recompute.
 */
export const WORDMARK_HERO_SCALE = 2;

const xlScript = "text-[4.5rem] sm:text-[6rem]";
const xlTitle = "text-[1.24rem] sm:text-[1.5rem]";

/**
 * Optical nudge for "Iris" is split: nav/footer (`align="left"`) vs hero lockup (`align="center"`).
 * Left uses a mild shift; center hero needs a stronger left pull so the swash balances in the frame.
 */
const sizeClasses = {
  sm: {
    script: "text-4xl sm:text-5xl",
    title: brandWordmarkNavSubtitleTextSizeClassName,
    irisNudgeLeft: "translate-x-[0.1em] sm:translate-x-[0.14em]",
    irisNudgeCenter: "translate-x-[0.1em] sm:translate-x-[0.14em]",
    lockupPull: "-mt-0.5",
  },
  md: {
    script: "text-5xl sm:text-6xl",
    title: "text-xs sm:text-sm",
    irisNudgeLeft: "translate-x-[0.1em] sm:translate-x-[0.14em]",
    irisNudgeCenter: "translate-x-[0.1em] sm:translate-x-[0.14em]",
    lockupPull: "-mt-0.5",
  },
  lg: {
    script: "text-7xl sm:text-8xl",
    title: "text-sm sm:text-base",
    irisNudgeLeft: "translate-x-[0.1em] sm:translate-x-[0.14em]",
    irisNudgeCenter: "translate-x-[0.1em] sm:translate-x-[0.14em]",
    lockupPull: "-mt-1",
  },
  xl: {
    script: xlScript,
    title: xlTitle,
    irisNudgeLeft: "translate-x-[0.1em] sm:translate-x-[0.14em]",
    irisNudgeCenter: "-translate-x-[0.30em] sm:-translate-x-[0.26em]",
    lockupPull: "-mt-1.5",
  },
} as const;

export function BrandWordmark({
  align = "left",
  size = "md",
  scriptClassName,
  titleClassName,
}: BrandWordmarkProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";
  const classes = sizeClasses[size];
  const irisNudge =
    align === "center" ? classes.irisNudgeCenter : classes.irisNudgeLeft;
  const scriptSizeClass = scriptClassName ?? classes.script;
  const titleSizeClass = titleClassName ?? classes.title;

  return (
    <span
      className={`brand-wordmark ${alignment} ${align === "center" ? "brand-wordmark--lockup" : "brand-wordmark--pyramid w-fit"}`}
    >
      <span
        className={`${fontLogoScript.className} ${scriptSizeClass} ${align === "center" ? "inline-block" : "block"} text-[var(--color-primary)] ${irisNudge} leading-[0.88]`}
      >
        Iris
      </span>
      <span
        className={`${fontBrandSubtitle.className} ${titleSizeClass} uppercase tracking-[0.18em] text-[var(--color-primary)]/90 ${
          align === "center"
            ? `mt-0 w-full text-center ${classes.lockupPull}`
            : `mt-0 w-fit max-w-full self-start text-left ${classes.lockupPull}`
        }`}
      >
        On The Move
      </span>
    </span>
  );
}
