import { cn } from "@/lib/utils";

/**
 * Same shell as hero “View portfolio” (`secondary-button`). Label colour matches the Instagram /
 * TikTok icons in `GradientSocialMenu` (`--color-primary` — site oak / burgundy).
 */
export function soundToggleButtonClassName(extra?: string) {
  return cn(
    "secondary-button !inline-flex !items-center !justify-center !gap-0",
    // Phone: compact; md+: same scale as before (sm/lg progression from the original design).
    "max-md:!px-3 max-md:!py-1.5 max-md:!text-[0.625rem] max-md:!tracking-[0.1em] max-md:min-w-[4.65rem]",
    "md:!px-5 md:!py-2 md:!text-[0.74rem] md:!tracking-[0.14em] md:min-w-[7.65rem]",
    "lg:!py-2.5 lg:!text-[0.8rem] lg:!tracking-[0.15em]",
    "!font-semibold !uppercase",
    "!text-[var(--color-primary)]",
    "!shadow-none",
    "transition-colors duration-300",
    "aria-pressed:!border-[var(--color-primary)]",
    "aria-pressed:!bg-[var(--color-primary)]",
    "aria-pressed:!text-[var(--color-surface)]",
    "aria-pressed:!shadow-[0_12px_28px_rgba(90,45,50,0.28)]",
    "select-none outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-secondary)_40%,var(--color-gold)_60%)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
    extra,
  );
}
