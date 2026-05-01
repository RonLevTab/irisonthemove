import type { CSSProperties } from "react";

/** Matches Latest content section: warm beige + cranberry oak wash, bottom border. */
export const oakSectionStyle: CSSProperties = {
  backgroundColor: "#faf6f0",
  backgroundImage: `
      linear-gradient(
        180deg,
        #fdf8f3 0%,
        rgba(253, 248, 243, 0.92) 18%,
        rgba(247, 240, 232, 0.65) 38%,
        transparent 68%
      ),
      radial-gradient(ellipse 130% 90% at 100% -15%, rgba(130, 52, 60, 0.11), transparent 52%),
      radial-gradient(ellipse 80% 50% at 50% 50%, rgba(148, 62, 68, 0.055), transparent 65%),
      linear-gradient(180deg, rgba(100, 48, 54, 0.045) 0%, transparent 44%),
      linear-gradient(
        180deg,
        transparent 0%,
        transparent 42%,
        rgba(122, 55, 62, 0.05) 52%,
        rgba(145, 72, 72, 0.08) 68%,
        rgba(168, 92, 82, 0.1) 82%,
        rgba(176, 98, 88, 0.13) 94%,
        rgba(132, 58, 64, 0.15) 100%
      ),
      radial-gradient(ellipse 100% 38% at 0% 100%, rgba(108, 48, 52, 0.14), transparent 62%),
      radial-gradient(ellipse 100% 38% at 100% 100%, rgba(128, 52, 58, 0.13), transparent 62%),
      repeating-linear-gradient(
        92deg,
        transparent 0px,
        transparent 3px,
        rgba(90, 45, 50, 0.014) 3px,
        rgba(90, 45, 50, 0.014) 4px
      )
    `,
};

/**
 * Latest content / reels — warm beige and soft sand only (no cranberry wash).
 * Keeps contrast low against blue water in reel thumbnails.
 */
export const latestContentSectionStyle: CSSProperties = {
  backgroundColor: "#faf4ed",
  backgroundImage: `
      linear-gradient(
        180deg,
        #fdf8f3 0%,
        rgba(253, 248, 243, 0.98) 28%,
        #f3e9de 100%
      ),
      radial-gradient(ellipse 110% 70% at 90% 8%, rgba(214, 161, 101, 0.07), transparent 58%),
      radial-gradient(ellipse 90% 55% at 10% 92%, rgba(232, 201, 181, 0.14), transparent 52%),
      linear-gradient(180deg, transparent 0%, rgba(240, 228, 216, 0.25) 100%)
    `,
};

/** Bottom edge — soft gradient line (see `.section-divider-edge-fade-bottom` in globals.css). */
export const oakSectionBorderClassName = "section-divider-edge-fade-bottom";

/** Top edge — same treatment for sections that need a top rule. */
export const oakSectionBorderTopClassName = "section-divider-edge-fade-top";

export const oakSectionInnerClassName =
  "mx-auto max-w-7xl px-6 pt-16 pb-10 sm:px-10 lg:px-12 lg:pt-20 lg:pb-12";

/** Section titles aligned with Latest content: tagline + uppercase + tracking. */
export const oakSectionTitleClassName = "uppercase not-italic tracking-[0.22em]";

/** Subcopy stays sentence case; titles remain uppercase via `oakSectionTitleClassName`. */
export const oakSectionDescriptionClassName = "not-italic normal-case tracking-normal";
