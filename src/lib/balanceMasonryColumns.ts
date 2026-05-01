/**
 * Distribute items into columns so each column’s “stack height” stays as even as possible.
 * Uses greedy shortest-column assignment — O(n × columns), stable when new items are appended.
 *
 * For photo tiles with shared column width, relative height ∝ 1 / (width÷height) = 1 / aspectRatio.
 */
export type MasonryEntry<T> = {
  item: T;
  /** Stable React key for this slot */
  key: string;
};

export function balanceIntoColumns<T>(
  entries: MasonryEntry<T>[],
  columnCount: number,
  heightWeight: (item: T) => number,
): MasonryEntry<T>[][] {
  if (columnCount <= 1) {
    return [entries.slice()];
  }

  const cols: MasonryEntry<T>[][] = Array.from({ length: columnCount }, () => []);
  const sums = Array(columnCount).fill(0);

  for (const entry of entries) {
    const w = heightWeight(entry.item);
    let shortest = 0;
    for (let k = 1; k < columnCount; k++) {
      if (sums[k] < sums[shortest]) {
        shortest = k;
      }
    }
    cols[shortest].push(entry);
    sums[shortest] += w;
  }

  return cols;
}

/** `aspectRatio` = width ÷ height (from your JSON). */
export function tileHeightWeight(aspectRatio: number): number {
  const r = Number(aspectRatio);
  if (!Number.isFinite(r) || r <= 0) {
    return 1;
  }
  return 1 / r;
}
