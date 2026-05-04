import { cn } from "@/lib/utils";

/**
 * Same shell as hero “View portfolio” (`secondary-button`). Label colour matches the Instagram /
 * TikTok icons in `GradientSocialMenu` (`--color-primary` — site oak / burgundy).
 */
export function soundToggleButtonClassName(extra?: string) {
  return cn(
    "secondary-button !inline-flex !items-center !justify-center !gap-0",
    "!px-4 !py-2 sm:!px-5 sm:!py-2 lg:!px-5 lg:!py-2.5",
    "!text-[0.76rem] !tracking-[0.13em] sm:!text-[0.74rem] sm:!tracking-[0.14em] lg:!text-[0.8rem] lg:!tracking-[0.15em]",
    "!font-semibold !uppercase",
    "!text-[var(--color-primary)]",
    "!shadow-none",
    "transition-colors duration-300",
    "aria-pressed:!border-[var(--color-primary)]",
    "aria-pressed:!bg-[var(--color-primary)]",
    "aria-pressed:!text-[var(--color-surface)]",
    "aria-pressed:!shadow-[0_12px_28px_rgba(90,45,50,0.28)]",
    "min-w-[7.35rem] sm:min-w-[7.65rem]",
    "select-none outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-secondary)_40%,var(--color-gold)_60%)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
    extra,
  );
}
