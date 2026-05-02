"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/** Valid `calc()` spacing — small squares under the nav. */
const viewportSlideStyle: CSSProperties = {
  width:
    "min(17vw, max(4.25rem, calc(100dvh - var(--nav-stack-height, 6rem) - 10.5rem)))",
  aspectRatio: "1",
  flexShrink: 0,
};

/**
 * Infinite horizontal marquee (inspired by
 * [21st.dev image auto slider](https://21st.dev/community/components/wisedev/image-auto-slider/default)).
 * Uses local about-gallery assets; duplicated for a seamless CSS loop.
 */
const GALLERY_IMAGES = [
  "/images/about-gallery/01.jpeg",
  "/images/about-gallery/04.jpeg",
  "/images/about-gallery/02.jpeg",
  "/images/about-gallery/05.jpeg",
  "/images/about-gallery/09.jpeg",
  "/images/about-gallery/06.jpeg",
  "/images/about-gallery/03.jpeg",
  "/images/about-gallery/07.jpeg",
  "/images/about-gallery/10.jpeg",
  "/images/about-gallery/08.jpeg",
] as const;

const marqueeId = "about-gallery-marquee";

/** Short edge fades — strip layout only */
const EDGE_MASK =
  "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)";

export type PhotoGalleryLayout = "strip" | "viewport";

type PhotoGalleryProps = {
  /**
   * `strip` — compact marquee in page flow (default).
   * `viewport` — full viewport width and height below the sticky nav (`--nav-stack-height`).
   */
  layout?: PhotoGalleryLayout;
  /** Merged onto the outer wrapper (both layouts). */
  className?: string;
};

export function PhotoGallery({ layout = "strip", className }: PhotoGalleryProps) {
  const loop = [...GALLERY_IMAGES, ...GALLERY_IMAGES];
  const isViewport = layout === "viewport";

  const keyframesBlock = `
            @keyframes ${marqueeId} {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .${marqueeId} {
              animation: ${marqueeId} 28s linear infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .${marqueeId} {
                animation: none;
                transform: translateX(0);
              }
            }
          `;

  if (isViewport) {
    return (
      <div
        className={cn(
          "relative z-0 w-full min-w-0 overflow-hidden bg-[var(--color-background)]",
          className,
        )}
        style={{
          height: "calc(100dvh - var(--nav-stack-height, 6rem))",
          minHeight: "20rem",
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: keyframesBlock }} />

        <div className="absolute inset-0 overflow-hidden" role="region" aria-label="Photo gallery">
          <div
            className={cn(
              marqueeId,
              "flex h-full w-max items-start gap-1.5 px-3 sm:gap-2 sm:px-4 lg:gap-2.5 lg:px-6",
            )}
          >
            {loop.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative overflow-hidden rounded-xl shadow-[0_2px_12px_rgba(58,36,32,0.08)]"
                style={viewportSlideStyle}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 18vw, (max-width: 1024px) 15vw, 12vw"
                  loading={index < GALLERY_IMAGES.length ? "eager" : "lazy"}
                  priority={index < GALLERY_IMAGES.length}
                  fetchPriority={index < GALLERY_IMAGES.length ? "high" : "auto"}
                  unoptimized
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <style dangerouslySetInnerHTML={{ __html: keyframesBlock }} />

      <div
        className="about-photo-gallery-shell relative flex min-h-[12.5rem] w-full items-center overflow-hidden py-3 sm:min-h-[14.75rem] sm:py-3.5 md:min-h-[17rem] md:py-4 lg:min-h-[19rem] lg:py-4"
        style={{
          maskImage: EDGE_MASK,
          WebkitMaskImage: EDGE_MASK,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
        role="region"
        aria-label="Photo gallery"
      >
        <div
          className={cn(
            marqueeId,
            "flex w-max items-center gap-4 md:gap-6 lg:gap-8",
          )}
        >
          {loop.map((src, index) => {
            const isFirstPass = index < GALLERY_IMAGES.length;
            return (
              <div
                key={`${src}-${index}`}
                className="about-photo-gallery-tile group relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl bg-[var(--color-surface-strong)] transition-[transform,filter] duration-300 ease-out hover:z-10 hover:scale-[1.04] hover:brightness-[1.05] sm:h-52 sm:w-52 md:h-60 md:w-60 lg:h-[17rem] lg:w-[17rem]"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 176px, (max-width: 1024px) 240px, 272px"
                  loading={isFirstPass ? "eager" : "lazy"}
                  priority={isFirstPass}
                  fetchPriority={isFirstPass ? "high" : "auto"}
                  unoptimized
                  draggable={false}
                />
                <div
                  className="pointer-events-none absolute inset-0 z-[1] rounded-2xl bg-white/10"
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
