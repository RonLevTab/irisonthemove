/**
 * Home `VideoCtaSection` and work `WorkCtaSection` use the same full-bleed image strip
 * height (viewport- and rem-capped) so the blocks match pixel-for-pixel.
 */
export const ctaImageStripClassName =
  "relative w-full overflow-hidden h-[min(96svh,68rem)] sm:h-[min(94svh,100rem)]";

/**
 * Homepage video CTA: on phones the strip is one full viewport below the nav so the
 * background fills the screen when you scroll to this block; desktop matches work CTA sm+ height.
 */
export const videoCtaImageStripClassName =
  "relative w-full overflow-hidden h-[calc(100svh-var(--nav-stack-height,7rem))] min-h-[calc(100svh-var(--nav-stack-height,7rem))] sm:h-[min(94svh,100rem)] sm:min-h-0";
