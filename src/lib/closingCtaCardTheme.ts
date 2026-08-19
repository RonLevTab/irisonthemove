import { cn } from "@/lib/utils";

/** Shared cream card above the footer — homepage video CTA + work/edits closing CTA. */
export const closingCtaCardClassName = cn(
  "relative flex w-max max-w-[min(100%,calc(100vw-2rem))] flex-col items-center gap-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-6 py-7 text-center shadow-sm sm:gap-6 sm:rounded-3xl sm:px-8 sm:py-8",
);

/** Shared quote/title typography inside the closing CTA card. */
export const closingCtaTitleClassName = cn(
  "font-text-3 mx-auto text-[clamp(0.9rem,2.45vw,1.9rem)] font-medium italic leading-[1.12] tracking-[0.04em] text-[var(--color-primary)]",
);

/** Shared CTA button width inside the card. */
export const closingCtaButtonClassName = "primary-button w-full min-w-0 justify-center sm:w-auto";
