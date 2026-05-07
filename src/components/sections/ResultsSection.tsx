import { FaInstagram, FaTiktok } from "react-icons/fa6";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { WorkPageResultsContent } from "@/types/content";
import {
  oakSectionBorderClassName,
  oakSectionBorderTopClassName,
} from "@/lib/sectionOakTheme";
import { cn } from "@/lib/utils";

function formatInt(n: number) {
  return new Intl.NumberFormat("nl-NL").format(Math.round(n));
}

function formatPct(n: number, fraction = 1) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(n);
}

function instagramProfileHref(handle: string) {
  const name = handle.replace(/^@/, "").trim();
  return `https://www.instagram.com/${name}/`;
}

/** Strips parenthetical (e.g. “(single-reel performance)”) for a clean location line under the header. */
function reelLocationFromContext(context: string) {
  const t = context.trim();
  const open = t.indexOf("(");
  if (open > 0) {
    return t.slice(0, open).replace(/[.,]\s*$/, "").trim() || t;
  }
  return t;
}

function handleFromTiktokProfileUrl(url: string) {
  try {
    const path = new URL(url).pathname.replace(/\/$/, "");
    const seg = path.split("/").filter(Boolean).pop() ?? "";
    return seg.startsWith("@") ? seg : `@${seg}`;
  } catch {
    return "@irisonthemove";
  }
}

type ResultsSectionProps = WorkPageResultsContent;

/** Warm border + light lift; width applied per card variant */
const resultCardBase =
  "rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_88%,#d4c4b8)] bg-[var(--color-surface)]/95 p-4 text-center shadow-[0_8px_28px_rgba(75,64,56,0.05)] sm:p-5";

/** One of two Instagram cards in the top row (50/50 on sm+) */
const resultCardInstagramClass = cn(resultCardBase, "h-full w-full min-w-0");

/** Full-width row below the Instagram pair; min-w-0 avoids Safari flex overflow stretching */
const resultCardTiktokClass = cn(resultCardBase, "w-full min-w-0");

/** Bordeaux oak — platform icon chips: solid bordeaux, icons in cream */
const platformIconOakChipClass =
  "flex shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_42%,#1a080a)] bg-[var(--color-primary)] text-[var(--color-surface)] shadow-sm";

/** @handle + domain — iets roder dan puur primary (warmer leesbaar op cream) */
const resultsProfileLinkColorClass =
  "text-[color-mix(in_srgb,var(--color-primary)_68%,#90353d)]";

/** Website chip: show the exact logo asset without extra frame styling. */
const siteBrandIconChipClass =
  "flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-transparent p-0 shadow-none";

/** Profile / URL links — bordeaux text, beige underline */
const resultsProfileLinkClass = cn(
  "font-sans text-sm font-semibold underline decoration-[var(--color-accent-peach)] underline-offset-2 transition-opacity hover:opacity-90",
  resultsProfileLinkColorClass,
);

/**
 * Slightly larger squares so the chip aligns with the header text block
 * (label → @ → date [→ pill]) for both Instagram cards and TikTok.
 */
const resultHeaderLogoChipClass =
  "h-[3.75rem] w-[3.75rem] rounded-2xl sm:h-16 sm:w-16";

const resultHeaderLogoIconClass = "h-7 w-7 sm:h-8 sm:w-8";

function ResultsBrandHeaderChip() {
  return (
    <div className={cn(siteBrandIconChipClass, resultHeaderLogoChipClass)} aria-hidden>
      <img
        src="/images/site/favicon-source.svg?v=20260505h"
        alt=""
        className="h-[2.7rem] w-[2.7rem] object-contain sm:h-[3rem] sm:w-[3rem]"
      />
    </div>
  );
}

/** +% deltas — same bordeaux family as links (calmer than teal/green) */
const resultsDeltaClass = "text-[color-mix(in_srgb,var(--color-primary)_92%,var(--color-foreground))]";

/** Logo left, text right; cluster centered in the card */
const resultHeaderClusterClass =
  "flex w-full max-w-full flex-row items-start justify-center gap-3 sm:gap-4";

/**
 * TikTok + website only: same-width inner band (mx-auto) + start-aligned row so logos and
 * text columns line up across the two cards; avoids per-row justify-center width drift.
 */
const resultHeaderTiktokWebsiteBandClass =
  "mx-auto w-full max-w-lg min-w-0 pl-[6.25rem] sm:pl-[9.25rem] sm:max-w-2xl lg:pl-[12.25rem]";
const resultHeaderClusterTiktokWebsiteClass =
  "flex w-full min-w-0 flex-row items-start justify-start gap-3 sm:gap-4";
const resultHeaderTextColClass = "flex min-w-0 flex-col items-start gap-1 text-left";

/**
 * Results — one full-width grid (same content width as work category strips / triple videos).
 * Two Instagram cells on row 1; TikTok full width; optional website visits row below TikTok.
 */
export function ResultsSection(data: ResultsSectionProps) {
  const { eyebrow, title, description, instagram, tiktok, website } = data;
  const ig = instagram;
  const profileDisplay = ig.profileHandle.startsWith("@")
    ? ig.profileHandle
    : `@${ig.profileHandle.replace(/^@/, "")}`;
  const profileHref = instagramProfileHref(ig.profileHandle);
  const donutDeg = (ig.viewsFromFollowersPercent / 100) * 360;
  /** Donut slices — bordeaux / oak tones only */
  const donutFollowers = "color-mix(in srgb, var(--color-primary) 82%, var(--color-accent-peach))";
  const donutOther = "color-mix(in srgb, var(--color-secondary) 70%, var(--color-accent-rose))";
  const igDonutGrad = `conic-gradient(from -90deg, ${donutFollowers} 0deg ${donutDeg}deg, ${donutOther} ${donutDeg}deg 360deg)`;
  const tiktokTagDisplay = handleFromTiktokProfileUrl(tiktok.profileUrl);

  return (
    <section
      id="results"
      className={cn(
        "relative isolate w-full",
        oakSectionBorderClassName,
        "bg-[var(--color-background)]",
        oakSectionBorderTopClassName,
        "overflow-x-clip",
        "scroll-mt-[calc(var(--nav-stack-height,6rem)+0.5rem)]",
      )}
    >
      <div className="mx-auto flex w-full max-w-[min(100%,96rem)] flex-col gap-6 px-6 pt-10 pb-12 sm:px-10 lg:gap-7 lg:px-12 lg:pt-12 lg:pb-16">
        <ScrollReveal className="flex w-full flex-col items-center text-center">
          <SectionHeading
            align="center"
            eyebrow={eyebrow}
            title={title}
            titleVariant="editorialDual"
            editorialDualEyebrowClassName="text-[0.64rem] sm:text-[0.74rem] md:text-[0.84rem] lg:text-[0.94rem]"
            stackGapClassName="gap-3 sm:gap-4"
            className="w-full max-w-5xl"
            innerClassName="!max-w-2xl"
          />
          {description?.trim() ? (
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-[var(--color-foreground-muted)]">
              {description.trim()}
            </p>
          ) : null}
        </ScrollReveal>

        {/* Full width of section inner — aligns with Travel dual grids + 3-video row above */}
        <div className="relative isolate w-full min-h-0 min-w-0">
          <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 lg:gap-x-10">
            {/* 1 — Instagram account / period overview */}
            <div className={resultCardInstagramClass}>
              <div className="mb-3 border-b border-[color-mix(in_srgb,var(--color-accent-peach)_72%,var(--color-border))] pb-3">
                <div className={resultHeaderClusterClass}>
                  <div className={cn(platformIconOakChipClass, resultHeaderLogoChipClass)} aria-hidden>
                    <FaInstagram className={resultHeaderLogoIconClass} />
                  </div>
                  <div className={resultHeaderTextColClass}>
                    <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
                      {ig.platformLabel}
                    </p>
                    <a href={profileHref} target="_blank" rel="noopener noreferrer" className={resultsProfileLinkClass}>
                      {profileDisplay}
                    </a>
                    <p className="font-sans text-xs text-[var(--color-foreground-muted)]">{ig.period30d}</p>
                    <span className="mt-0.5 inline-flex rounded-full border border-[color-mix(in_srgb,var(--color-accent-peach)_58%,var(--color-border))] bg-[var(--color-surface-strong)]/90 px-2.5 py-1 font-sans text-[0.65rem] text-[var(--color-foreground-muted)]">
                      <span className="text-[var(--color-primary)]">+</span>
                      {formatPct(ig.reachChangePercent, 1)}% reach
                    </span>
                  </div>
                </div>
              </div>

              <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 pb-3 sm:max-w-2xl sm:flex-row sm:justify-center sm:gap-8">
                <div>
                  <p className="font-sans text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-foreground-muted)]">
                    30d views
                  </p>
                  <p className="mt-0.5 font-sans text-2xl font-semibold tabular-nums text-[var(--color-foreground)] sm:text-3xl">
                    {formatInt(ig.totalViews30d)}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-4">
                  <div className="relative h-16 w-16 shrink-0 sm:h-[4.5rem] sm:w-[4.5rem]">
                    <div className="h-full w-full rounded-full p-0.5" style={{ background: igDonutGrad }}>
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--color-surface)]">
                        <div>
                          <p className="font-sans text-sm font-semibold tabular-nums text-[var(--color-foreground)]">
                            {ig.statsPillLabel}
                          </p>
                          <p className="mt-0.5 font-sans text-[0.5rem] uppercase tracking-wider text-[var(--color-foreground-muted)]">
                            mix
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="max-w-[12rem] space-y-1 text-left font-sans text-[0.7rem] text-[var(--color-foreground)]">
                    <li className="flex items-center justify-between gap-3">
                      <span className="text-[var(--color-foreground-muted)]">Followers</span>
                      <span className="font-medium tabular-nums text-[var(--color-primary)]">
                        {formatPct(ig.viewsFromFollowersPercent, 1)}%
                      </span>
                    </li>
                    <li className="flex items-center justify-between gap-3">
                      <span className="text-[var(--color-foreground-muted)]">Non-followers</span>
                      <span className="font-medium tabular-nums text-[color-mix(in_srgb,var(--color-secondary)_88%,var(--color-foreground))]">
                        {formatPct(ig.viewsFromNonFollowersPercent, 1)}%
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mx-auto w-full max-w-md space-y-1.5 pt-1 sm:max-w-lg">
                <p className="font-sans text-[0.6rem] uppercase tracking-[0.12em] text-[var(--color-foreground-muted)]">
                  Views by type
                </p>
                {ig.contentMix.map((row) => (
                  <div key={row.label} className="space-y-0.5 text-left">
                    <div className="flex items-center justify-between font-sans text-[0.7rem]">
                      <span className="text-[var(--color-foreground-muted)]">{row.label}</span>
                      <span className="font-medium tabular-nums text-[var(--color-foreground)]">
                        {formatPct(row.percent, 1)}%
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-accent-peach)_48%,var(--color-border))]">
                      <div
                        className="h-full rounded-full bg-[color-mix(in_srgb,var(--color-primary)_78%,var(--color-secondary))]"
                        style={{ width: `${Math.min(100, row.percent)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-3 font-sans text-[0.65rem] text-[var(--color-foreground-muted)]">
                {formatInt(ig.accountsReached)} accounts reached · ~{ig.totalViewsLabel} (dashboard)
              </p>
            </div>

            {/* 2 — Reel: header matches card 1 (label, @, date, impact); Rocco/location under the divider */}
            <div className={resultCardInstagramClass}>
              <div className="mb-3 border-b border-[color-mix(in_srgb,var(--color-accent-peach)_72%,var(--color-border))] pb-3">
                <div className={resultHeaderClusterClass}>
                  <div className={cn(platformIconOakChipClass, resultHeaderLogoChipClass)} aria-hidden>
                    <FaInstagram className={resultHeaderLogoIconClass} />
                  </div>
                  <div className={resultHeaderTextColClass}>
                    <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
                      Reel highlight
                    </p>
                    <a href={profileHref} target="_blank" rel="noopener noreferrer" className={resultsProfileLinkClass}>
                      {profileDisplay}
                    </a>
                    <p className="font-sans text-xs text-[var(--color-foreground-muted)]">{ig.period30d}</p>
                    <span className="mt-0.5 inline-flex rounded-full border border-[color-mix(in_srgb,var(--color-accent-peach)_58%,var(--color-border))] bg-[var(--color-surface-strong)]/90 px-2.5 py-1 font-sans text-[0.65rem] text-[var(--color-foreground-muted)]">
                      <span className="text-[var(--color-primary)]">+</span>
                      {formatInt(ig.singleReel.followersFromReel)} new followers
                    </span>
                  </div>
                </div>
              </div>
              <div className="mx-auto mb-3 max-w-md space-y-0.5 text-center sm:max-w-lg">
                <p className="font-sans text-sm font-semibold text-[var(--color-foreground)]">
                  {ig.singleReel.reelName}
                </p>
                <p className="text-[0.65rem] font-sans text-[var(--color-foreground-muted)]">
                  Single reel (same account)
                </p>
                <p className="font-sans text-sm text-[var(--color-foreground)]">
                  {reelLocationFromContext(ig.singleReel.context)}
                </p>
              </div>
              {ig.singleReel.reelUrl ? (
                <a
                  href={ig.singleReel.reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-2 inline-flex max-w-full items-center justify-center gap-1.5 break-words transition-opacity hover:opacity-85",
                    resultsProfileLinkClass,
                  )}
                >
                  <FaInstagram className={cn("h-4 w-4 shrink-0", resultsProfileLinkColorClass)} aria-hidden />
                  Watch on Instagram
                </a>
              ) : null}
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { k: "Views", v: formatInt(ig.singleReel.views) },
                  { k: "Reach", v: formatInt(ig.singleReel.accountsReached) },
                  { k: "Watch", v: `${ig.singleReel.avgWatchSeconds}s` },
                  { k: "New followers", v: formatInt(ig.singleReel.followersFromReel) },
                  { k: "Likes", v: formatInt(ig.singleReel.likes) },
                  { k: "Comments", v: formatInt(ig.singleReel.comments) },
                  { k: "Saves", v: formatInt(ig.singleReel.saves) },
                  { k: "Shares", v: formatInt(ig.singleReel.shares) },
                ].map((c) => (
                  <div
                    key={c.k}
                    className="rounded-lg border border-[color-mix(in_srgb,var(--color-accent-peach)_55%,var(--color-border))] bg-[var(--color-surface-strong)]/50 px-2 py-1.5"
                  >
                    <p className="font-sans text-[0.5rem] uppercase tracking-wider text-[var(--color-foreground-muted)]">
                      {c.k}
                    </p>
                    <p className="mt-0.5 font-sans text-[0.75rem] font-medium tabular-nums text-[var(--color-foreground)] sm:text-sm">
                      {c.v}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 — TikTok: spans both columns (same total width as Instagram row + gutter) */}
            <div className={cn(resultCardTiktokClass, "sm:col-span-2")}>
              <div className="mb-4 border-b border-[color-mix(in_srgb,var(--color-accent-peach)_72%,var(--color-border))] pb-3 sm:mb-5 sm:pb-4">
                <div className={resultHeaderTiktokWebsiteBandClass}>
                  <div className={resultHeaderClusterTiktokWebsiteClass}>
                    <div className={cn(platformIconOakChipClass, resultHeaderLogoChipClass)} aria-hidden>
                      <FaTiktok className={resultHeaderLogoIconClass} />
                    </div>
                    <div className={resultHeaderTextColClass}>
                      <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
                        {tiktok.platformLabel}
                      </p>
                      <a
                        href={tiktok.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${tiktok.accountName} on TikTok`}
                        className={resultsProfileLinkClass}
                      >
                        {tiktokTagDisplay}
                      </a>
                      <p className="font-sans text-xs text-[var(--color-foreground-muted)]">{tiktok.period8w}</p>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="grid w-full min-w-0 grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-4 sm:gap-y-0">
                {tiktok.metrics.map((m) => (
                  <li
                    key={m.label}
                    className="border-b border-[color-mix(in_srgb,var(--color-accent-peach)_55%,var(--color-border))] pb-4 last:border-0 last:pb-0 sm:border-0 sm:pb-0"
                  >
                    <p className="font-sans text-xs text-[var(--color-foreground-muted)]">{m.label}</p>
                    <p className="mt-0.5 font-sans text-2xl font-semibold tabular-nums text-[var(--color-foreground)] sm:text-3xl">
                      {formatInt(m.value)}
                    </p>
                    <p className={cn("mt-0.5 text-sm font-medium", resultsDeltaClass)}>
                      +{formatPct(m.changePercent, 2)}%
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {website ? (
              <div className={cn(resultCardTiktokClass, "sm:col-span-2")}>
                <div className="mb-4 border-b border-[color-mix(in_srgb,var(--color-accent-peach)_72%,var(--color-border))] pb-3 sm:mb-5 sm:pb-4">
                  <div className={resultHeaderTiktokWebsiteBandClass}>
                    <div className={resultHeaderClusterTiktokWebsiteClass}>
                      <ResultsBrandHeaderChip />
                      <div className={resultHeaderTextColClass}>
                        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)]">
                          {website.platformLabel}
                        </p>
                        <a
                          href={website.siteHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={resultsProfileLinkClass}
                        >
                          {website.siteDisplayUrl}
                        </a>
                        <p className="font-sans text-xs text-[var(--color-foreground-muted)]">
                          {website.liveSinceLabel}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-center sm:gap-1.5">
                  <p className="font-sans text-xs text-[var(--color-foreground-muted)]">
                    {website.visitsCaption?.trim() || "Total website visits"}
                  </p>
                  <p className="font-sans text-3xl font-semibold tabular-nums text-[var(--color-foreground)] sm:text-4xl">
                    {formatInt(website.totalVisits)}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
