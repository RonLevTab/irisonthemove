import { cn } from "@/lib/utils";

/**
 * Zelfde stijl als de hero-knop “Work With Me” (`.primary-button` in `globals.css`) —
 * gradient, schaduw, lettertype (body/DM Sans), uppercase + tracking. Kleinere padding/font
 * via `.sound-toggle-button`. Actief: wit vlak + bordeaux tekst.
 */
export function soundToggleButtonClassName(extra?: string) {
  return cn(
    "sound-toggle-button",
    "select-none outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-secondary)_40%,var(--color-gold)_60%)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
    extra,
  );
}
