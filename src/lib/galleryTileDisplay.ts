import type {
  DestinationGalleryItem,
  DestinationTileScale,
} from "@/types/content";

/** Tall tier: cap width÷height — lower = more vertical space in the column. */
const TALL_MAX_RATIO = 0.72;
/** Compact tier: floor width÷height — higher = shorter tile height at fixed column width. */
const COMPACT_MIN_RATIO = 1.22;

const TIERS: DestinationTileScale[] = ["compact", "natural", "tall"];

function stableHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Resolved frame tier: `largeTile` → tall; else optional `tileScale`; else stable pseudo-random
 * from a stable item key so the gallery mixes three sizes without hydration drift.
 */
export function effectiveTileScale(item: DestinationGalleryItem): DestinationTileScale {
  if (item.largeTile) {
    return "tall";
  }
  if (item.tileScale) {
    return item.tileScale;
  }
  return TIERS[stableHash(item.stableKey ?? item.src) % 3];
}

/**
 * Aspect ratio used for layout (masonry weight + frame). Varies by tier for visual diversity.
 */
export function displayAspectRatio(item: DestinationGalleryItem): number {
  const r = Number(item.aspectRatio);
  if (!Number.isFinite(r) || r <= 0) {
    return 1;
  }
  const tier = effectiveTileScale(item);
  if (tier === "tall") {
    return Math.min(r, TALL_MAX_RATIO);
  }
  if (tier === "compact") {
    return Math.max(r, COMPACT_MIN_RATIO);
  }
  return r;
}
