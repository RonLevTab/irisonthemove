"use client";

import Script from "next/script";
import { useEffect, useId } from "react";

import { cn } from "@/lib/utils";

type WorkTravelInstagramReelsProps = {
  urls: string[];
  /** Accessible name for the reel grid. */
  stripAriaLabel: string;
  className?: string;
};

function canonicalReelUrl(url: string): string {
  const u = url.trim();
  if (!u) return u;
  try {
    const parsed = new URL(u.startsWith("http") ? u : `https://${u}`);
    return `${parsed.origin}${parsed.pathname.replace(/\/$/, "")}/`;
  } catch {
    return u;
  }
}

function runInstagramEmbedProcess() {
  if (typeof window === "undefined") return;
  const ig = (
    window as unknown as { instgrm?: { Embeds: { process: () => void } } }
  ).instgrm;
  ig?.Embeds?.process();
}

/**
 * **2×3** grid of Instagram reel embeds (Travel work section). Card shell matches
 * {@link WorkCategoryTripleVideoRow} (reel-style border, radius, shadow).
 *
 * **Playback:** Instagram’s embed always needs a user tap to start — their iframe does not
 * support autoplay like self-hosted `<video muted>`. For tap-to-play-free loops, use MP4s + a
 * video grid instead.
 */
export function WorkTravelInstagramReels({
  urls,
  stripAriaLabel,
  className,
}: WorkTravelInstagramReelsProps) {
  const scriptUid = useId().replace(/:/g, "");
  const six = urls.slice(0, 6);

  useEffect(() => {
    const id = requestAnimationFrame(() => runInstagramEmbedProcess());
    return () => cancelAnimationFrame(id);
  }, [urls]);

  return (
    <div className={cn("flex w-full justify-center", className)} aria-label={stripAriaLabel}>
      <div className="w-full min-w-0 max-w-[min(100%,64rem)] px-0">
        <Script
          id={`ig-embed-travel-${scriptUid}`}
          src="https://www.instagram.com/embed.js"
          strategy="afterInteractive"
          onLoad={runInstagramEmbedProcess}
        />
        <div
          className={cn(
            "grid min-w-0 w-full max-w-full grid-cols-1 gap-4",
            "min-[640px]:grid-cols-2",
            "min-[1024px]:grid-cols-3 sm:gap-5 min-[1200px]:gap-6",
          )}
        >
        {six.map((raw, i) => (
          <div
            key={`${canonicalReelUrl(raw)}-${i}`}
            className={cn(
              "work-travel-ig-card relative aspect-[3/4] min-h-0 w-full min-w-0 overflow-hidden",
              "rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-border)_85%,#d4c4b8)] bg-transparent",
              "shadow-[0_16px_44px_rgba(75,64,56,0.07)]",
            )}
          >
            <div className="absolute inset-0 flex min-h-0 min-w-0 items-stretch justify-center">
              <blockquote
                className="instagram-media !m-0 flex min-h-0 w-full min-w-0 max-w-none flex-1 !bg-transparent"
                data-instgrm-permalink={canonicalReelUrl(raw)}
                data-instgrm-version="14"
              />
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
