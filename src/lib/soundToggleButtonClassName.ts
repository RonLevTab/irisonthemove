import { brandSubtitleClassName } from "@/lib/brandFonts";
import { cn } from "@/lib/utils";

/**
 * Shared “Sound on / Sound off” pill: Castoro + small caps, centered label, warm oak border on hover
 * (secondary + gold — avoids hover reading as black primary).
 */
export function soundToggleButtonClassName(extra?: string) {
  return cn(
    "inline-flex shrink-0 min-h-[2rem] min-w-[7rem] select-none items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-secondary)_26%,var(--color-border))] bg-[var(--color-surface)] px-3 py-0 font-normal uppercase tracking-[0.18em] text-[var(--color-primary)] shadow-[0_5px_16px_rgba(90,45,50,0.09)] outline-none transition-[color,background-color,border-color,box-shadow] hover:border-[color-mix(in_srgb,var(--color-secondary)_50%,var(--color-gold)_50%)] hover:bg-[var(--color-background)] hover:shadow-[0_8px_22px_rgba(166,93,72,0.11)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-secondary)_45%,var(--color-gold)_55%)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] sm:min-h-[2.125rem] sm:min-w-[7.35rem]",
    brandSubtitleClassName,
    "text-[0.54rem] sm:text-[0.58rem] leading-none",
    extra,
  );
}
