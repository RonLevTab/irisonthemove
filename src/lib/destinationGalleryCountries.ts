import type { DestinationGalleryItem } from "@/types/content";

/** Folder slug after `/images/destinations/` — matches `public/images/destinations/<slug>/`. */
export type VisitedCountryId =
  | "netherlands"
  | "monaco"
  | "greece"
  | "poland"
  | "turkey"
  | "uk"
  | "germany"
  | "france"
  | "italy"
  | "spain"
  | "luxembourg"
  | "portugal"
  | "belgium"
  | "dominican-republic"
  | "thailand"
  | "philippines"
  | "usa"
  | "canada"
  | "oman"
  | "uae";

/** Twenty visited countries — order matches the destinations marquee (Europe, Caribbean, SE Asia, Americas, Middle East). */
export const VISITED_COUNTRIES: readonly {
  id: VisitedCountryId;
  label: string;
}[] = [
  { id: "netherlands", label: "Netherlands" },
  { id: "monaco", label: "Monaco" },
  { id: "greece", label: "Greece" },
  { id: "poland", label: "Poland" },
  { id: "turkey", label: "Turkey" },
  { id: "uk", label: "United Kingdom" },
  { id: "germany", label: "Germany" },
  { id: "france", label: "France" },
  { id: "italy", label: "Italy" },
  { id: "spain", label: "Spain" },
  { id: "luxembourg", label: "Luxembourg" },
  { id: "portugal", label: "Portugal" },
  { id: "belgium", label: "Belgium" },
  { id: "dominican-republic", label: "Dominican Republic" },
  { id: "thailand", label: "Thailand" },
  { id: "philippines", label: "Philippines" },
  { id: "usa", label: "United States" },
  { id: "canada", label: "Canada" },
  { id: "oman", label: "Oman" },
  { id: "uae", label: "United Arab Emirates" },
] as const;

function normalizePath(src: string): string {
  return src.replace(/\\/g, "/").toLowerCase();
}

/**
 * Whether `src` belongs to the given country using gallery folder segments under
 * `/images/destinations/<country>/`. Netherlands excludes Düsseldorf; Germany matches only
 * `…/dusseldorf/` (same asset folder).
 */
export function gallerySrcMatchesCountry(
  countryId: VisitedCountryId,
  src: string,
): boolean {
  const path = normalizePath(src);
  switch (countryId) {
    case "netherlands":
      return (
        path.includes("/images/destinations/netherlands/") &&
        !path.includes("/dusseldorf/")
      );
    case "germany":
      return path.includes("/dusseldorf/");
    default:
      return path.includes(`/images/destinations/${countryId}/`);
  }
}

export function filterGalleryByCountry(
  items: DestinationGalleryItem[],
  countryId: VisitedCountryId | null,
): DestinationGalleryItem[] {
  if (!countryId) return items;
  return items.filter((it) => gallerySrcMatchesCountry(countryId, it.src));
}

/** First folder segment under `/images/destinations/`, for debugging or analytics. */
export function galleryCountrySlugFromSrc(src: string): string | null {
  const path = normalizePath(src);
  const marker = "/images/destinations/";
  const i = path.indexOf(marker);
  if (i === -1) return null;
  const rest = path.slice(i + marker.length);
  const segment = rest.split("/")[0];
  return segment || null;
}
