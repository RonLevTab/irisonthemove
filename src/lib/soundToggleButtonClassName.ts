import { cn } from "@/lib/utils";

/**
 * Same control as hero “View portfolio” (`secondary-button` + DM Sans / uppercase / tracking),
 * scaled down. Oak-toned label (warm brown, not full primary).
 */
export function soundToggleButtonClassName(extra?: string) {
  return cn(
    "secondary-button !inline-flex !items-center !justify-center !gap-0",
    "!px-3.5 !py-1.5 sm:!px-4 sm:!py-1.5 lg:!px-4 lg:!py-1.5",
    "!text-[0.7rem] !tracking-[0.13em] sm:!text-[0.66rem] sm:!tracking-[0.14em] lg:!text-[0.72rem] lg:!tracking-[0.15em]",
    "!font-semibold !uppercase",
    "!text-[color-mix(in_srgb,var(--color-foreground-muted)_90%,var(--color-secondary)_10%)]",
    "!shadow-none",
    "min-w-[6.85rem] sm:min-w-[7.1rem]",
    "select-none outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-secondary)_40%,var(--color-gold)_60%)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
    extra,
  );
}
