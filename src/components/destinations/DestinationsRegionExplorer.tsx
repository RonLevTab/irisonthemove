import Link from "next/link";

import { brandSubtitleClassName } from "@/lib/brandFonts";
import {
  getDestinationRegionsExplorer,
  getDestinationsByCountry,
} from "@/lib/content";

const regionSummaryClass = `${brandSubtitleClassName} flex w-full cursor-pointer items-center justify-between gap-4 py-4 pl-5 pr-4 text-left text-base font-normal uppercase tracking-[0.14em] text-[var(--color-primary)] sm:text-lg sm:tracking-[0.12em]`;

const countrySummaryClass = `${brandSubtitleClassName} flex w-full cursor-pointer items-center justify-between gap-3 py-3 pl-4 pr-3 text-left text-[0.62rem] font-normal uppercase tracking-[0.18em] text-[var(--color-primary)]/90 sm:text-xs`;

export async function DestinationsRegionExplorer() {
  const { regions } = await getDestinationRegionsExplorer();
  const regionsWithCities = await Promise.all(
    regions.map(async (region) => ({
      ...region,
      countryEntries: await Promise.all(
        region.countries.map(async (country) => ({
          country,
          cities: await getDestinationsByCountry(country),
        })),
      ),
    })),
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-3">
      <p className="mb-2 text-[0.95rem] leading-relaxed text-[var(--color-foreground-muted)] sm:text-base">
        Choose a region, open a country, then open a city to read the full
        guide.
      </p>
      {regionsWithCities.map((region) => (
        <details
          key={region.id}
          className="dest-explorer-details rounded-2xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] shadow-[0_8px_28px_rgba(58,36,32,0.05)] backdrop-blur-sm sm:rounded-3xl"
        >
          <summary className={regionSummaryClass}>
            <span>{region.label}</span>
            <span className="dest-explorer-chevron select-none" aria-hidden>
              ▼
            </span>
          </summary>
          <div className="border-t border-[var(--color-border)] px-3 pb-4 pt-1 sm:px-4 sm:pb-5">
            {region.countries.length === 0 ? (
              <p className="px-2 py-3 text-sm leading-relaxed text-[var(--color-foreground-muted)] sm:px-3">
                Guides for this region are on the way.
              </p>
            ) : (
              <ul className="space-y-2 pt-2">
                {region.countryEntries.map(({ country, cities }) => (
                    <li key={country}>
                      <details className="dest-explorer-details rounded-xl border border-[var(--color-border)]/80 bg-[var(--color-background)]/50">
                        <summary className={countrySummaryClass}>
                          <span>{country}</span>
                          <span
                            className="dest-explorer-chevron select-none"
                            aria-hidden
                          >
                            ▼
                          </span>
                        </summary>
                        <div className="border-t border-[var(--color-border)]/70 px-3 py-3 sm:px-4">
                          {cities.length === 0 ? (
                            <p className="text-sm text-[var(--color-foreground-muted)]">
                              City guides coming soon.
                            </p>
                          ) : (
                            <ul className="space-y-1.5">
                              {cities.map((d) => (
                                <li key={d.slug}>
                                  <Link
                                    href={`/destinations/${d.slug}`}
                                    className="font-text-3 block rounded-lg px-2 py-2 text-[1.02rem] text-[var(--color-foreground)]/90 transition hover:bg-[var(--color-accent-soft)]/25 hover:text-[var(--color-primary)]"
                                  >
                                    {d.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </details>
                    </li>
                ))}
              </ul>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
