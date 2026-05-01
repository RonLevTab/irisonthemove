/**
 * Work page — hotel & restaurant photo overlays (both grids).
 *
 * Intended look (keep in sync):
 * - On hover: faded bordeaux wash over the image (slight blur), text stacked in the **centre**.
 * - Line 1 (venue): **block capitals**, larger, warm white.
 * - Lines 2–3 (city / country): **smaller**, **normal casing** so names keep capitals (e.g. Châteauneuf, France).
 * - Copy is hidden until hover (`opacity` + `group-hover`), except `motion-reduce:opacity-100` for accessibility.
 */

/** Dark lift behind captions — fades in with the bordeaux layer. */
export const workGalleryImageGradientClass =
  "pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:opacity-100 bg-gradient-to-t from-[rgba(50,43,39,0.82)] via-[rgba(50,43,39,0.15)] to-transparent";

/** Bordeaux wash on hover — full tile, soft blur. */
export const workGalleryImageHoverWashClass =
  "pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:opacity-100 rounded-[inherit] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-primary)_38%,rgba(55,20,28,0.48))_0%,color-mix(in_srgb,var(--color-primary)_24%,rgba(38,14,20,0.5))_50%,rgba(22,8,12,0.48)_100%)] backdrop-blur-[4px]";

/** Centred stack: venue + city/country in the middle of the tile. */
export const workGalleryCaptionWrapClass =
  "pointer-events-none absolute inset-0 z-[3] mx-auto flex w-full max-w-[min(100%,24rem)] flex-col items-center justify-center px-3 py-6 text-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:opacity-100 sm:px-4 sm:py-8";

/** Hotel / restaurant name — block letters, prominent white. */
export const workGalleryCaptionPrimaryClass =
  "font-text-3 text-[1rem] font-semibold uppercase tracking-[0.09em] text-[#fffbf7] [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] drop-shadow-sm sm:text-[1.12rem] md:text-[1.14rem] leading-tight [overflow-wrap:anywhere]";

/** City & country — smaller, capitals as written in content (normal-case), still reads as white on bordeaux. */
export const workGalleryCaptionSecondaryClass =
  "font-text-3 mt-0.5 text-[0.74rem] font-normal normal-case leading-snug tracking-[0.03em] text-[#fffbf7]/92 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] sm:text-[0.8rem] md:text-[0.86rem]";
