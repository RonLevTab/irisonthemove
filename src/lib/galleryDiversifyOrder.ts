import type { DestinationGalleryItem } from "@/types/content";
import { displayAspectRatio } from "@/lib/galleryTileDisplay";

type Tagged = {
  item: DestinationGalleryItem;
  place: string;
  bucket: 0 | 1 | 2;
};

/** Tall / wide / mid from width÷height — used to break long runs of similar tile heights. */
function aspectBucketForItem(item: DestinationGalleryItem): 0 | 1 | 2 {
  const r = displayAspectRatio(item);
  if (!Number.isFinite(r) || r <= 0) return 2;
  if (r < 0.9) return 0;
  if (r > 1.1) return 1;
  return 2;
}

function stableHash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rng: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Reorders gallery items so places and aspect “sizes” are interleaved instead of JSON runs
 * (e.g. many Antwerp shots in a row). Order is deterministic for a given set of stable item keys
 * values so SSR and client match.
 */
export function orderGalleryItemsForMasonry(
  items: DestinationGalleryItem[],
): DestinationGalleryItem[] {
  if (items.length <= 1) {
    return items.slice();
  }

  const seed = stableHash(
    items.map((item) => item.stableKey ?? item.src).sort().join("\0"),
  );
  const rng = mulberry32(seed);

  const pool: Tagged[] = items.map((item) => ({
    item,
    place: `${item.caption}\0${item.captionLine2 ?? ""}`,
    bucket: aspectBucketForItem(item),
  }));

  shuffleInPlace(pool, rng);

  const out: Tagged[] = [];

  while (pool.length > 0) {
    let candidates = pool.filter((t) => {
      if (out.length < 2) return true;
      const p1 = out[out.length - 1]!.place;
      const p2 = out[out.length - 2]!.place;
      return !(p1 === p2 && t.place === p1);
    });
    if (candidates.length === 0) {
      candidates = pool.slice();
    }

    let candidates2 = candidates.filter((t) => {
      if (out.length < 2) return true;
      const b1 = out[out.length - 1]!.bucket;
      const b2 = out[out.length - 2]!.bucket;
      return !(b1 === b2 && t.bucket === b1);
    });
    if (candidates2.length === 0) {
      candidates2 = candidates.slice();
    }

    const pick = candidates2[Math.floor(rng() * candidates2.length)]!;
    const poolIndex = pool.indexOf(pick);
    pool.splice(poolIndex, 1);
    out.push(pick);
  }

  return out.map((t) => t.item);
}
