/**
 * Turn a single `location` string into at most three lines for hover labels:
 * — venue (may contain commas)
 * — city
 * — country
 *
 * Extra comma-separated segments before city/country are merged into the venue
 * so we never render a fourth stack row.
 */
export type WorkLocationThreeLines = {
  line1: string;
  line2: string;
  line3: string;
};

export function locationToThreeLines(raw: string): WorkLocationThreeLines {
  const text = raw.trim();
  if (!text) {
    return { line1: "", line2: "", line3: "" };
  }

  /** e.g. `Barcelo Ponent Beach hotel. Spain` (hotels in JSON sometimes use a period). */
  const periodChunks = text
    .split(".")
    .map((p) => p.trim())
    .filter(Boolean);
  if (!text.includes(",") && periodChunks.length === 2) {
    return {
      line1: periodChunks[0] ?? "",
      line2: "",
      line3: periodChunks[1] ?? "",
    };
  }

  const parts = text
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 3) {
    const line3 = parts[parts.length - 1] ?? "";
    const line2 = parts[parts.length - 2] ?? "";
    const line1 = parts.slice(0, -2).join(", ");
    return { line1, line2, line3 };
  }
  if (parts.length === 2) {
    return { line1: parts[0] ?? "", line2: "", line3: parts[1] ?? "" };
  }
  return { line1: text, line2: "", line3: "" };
}

/** Venue names can wrap so long restaurant / hotel names stay readable. */
export const workHoverVenueNameClass =
  "block max-w-full whitespace-normal text-wrap [overflow-wrap:normal] [word-break:normal]";

/** City / country lines stay compact. */
export const workHoverLineClampClass =
  "block max-w-full overflow-hidden text-ellipsis whitespace-nowrap";
