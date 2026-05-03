"use client";

import type { MouseEvent as ReactMouseEvent } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { withAssetPath } from "@/lib/assetPath";

/** With `object-contain`, the <img> box fills the frame but pixels don’t; hit-test the real bitmap bounds. */
function clickFallsOnObjectContainImage(
  e: ReactMouseEvent<HTMLDivElement>,
  naturalW: number,
  naturalH: number,
): boolean {
  if (!(naturalW > 0 && naturalH > 0)) return false;
  const r = e.currentTarget.getBoundingClientRect();
  const frameW = r.width;
  const frameH = r.height;
  const imageAspect = naturalW / naturalH;
  const frameAspect = frameW / frameH;
  let contentW: number;
  let contentH: number;
  let offsetX: number;
  let offsetY: number;
  if (imageAspect > frameAspect) {
    contentW = frameW;
    contentH = frameW / imageAspect;
    offsetX = 0;
    offsetY = (frameH - contentH) / 2;
  } else {
    contentH = frameH;
    contentW = frameH * imageAspect;
    offsetX = (frameW - contentW) / 2;
    offsetY = 0;
  }
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  return x >= offsetX && x <= offsetX + contentW && y >= offsetY && y <= offsetY + contentH;
}

export type PhotoLightboxAnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type PhotoLightboxContentBounds = {
  top: number;
  bottom: number;
};

/** Full-screen style preview — image only (no bottom caption strip), same sizing for work and destinations. */
export type PhotoLightboxPayload = {
  src: string;
  alt: string;
  /** Matches the grid tile that opened the lightbox (tile is hidden while open — one photo on screen). */
  sourceId: string;
  anchorRect: PhotoLightboxAnchorRect;
  /**
   * When set (destinations gallery), max lightbox height follows the visible photo grid band (not empty page below).
   */
  contentBounds?: PhotoLightboxContentBounds;
};

type PhotoLightboxContextValue = {
  open: (payload: PhotoLightboxPayload) => void;
  close: () => void;
  /** `sourceId` of the tile currently shown in the lightbox, or null. */
  activeSourceId: string | null;
};

const PhotoLightboxContext = createContext<PhotoLightboxContextValue | null>(null);

export function usePhotoLightbox(): PhotoLightboxContextValue {
  const ctx = useContext(PhotoLightboxContext);
  if (!ctx) {
    throw new Error("usePhotoLightbox must be used within PhotoLightboxProvider");
  }
  return ctx;
}

/** Insets from viewport — larger = smaller lightbox. */
function lightboxEdgeInsets(vw: number, vh: number): { padX: number; padY: number } {
  const base = Math.max(48, Math.round(Math.min(vw, vh) * 0.08));
  const padX = base;
  const padY = Math.max(base, Math.round(base * 1.1));
  return { padX, padY };
}

/** Rounded tile radius (matches `rounded-xl` on gallery). */
const TILE_RADIUS_PX = 12;

/**
 * Target enlarged frame: same max size as before, but positioned so its centre matches the
 * clicked tile’s centre (clamped into the padded viewport). Not viewport-centred.
 */
function lightboxFrameLayout(
  vw: number,
  vh: number,
  anchor: PhotoLightboxAnchorRect,
  contentBounds?: PhotoLightboxContentBounds,
): { frameW: number; frameH: number; frameLeft: number; frameTop: number } {
  const innerShrink = 0.86;
  const { padX, padY } = lightboxEdgeInsets(vw, vh);
  const slotW = Math.max(160, Math.min(vw - 2 * padX, 2600));
  const viewBottom = vh - padY;

  let bandH: number;
  if (contentBounds !== undefined) {
    const clippedTop = Math.max(contentBounds.top, 0);
    const clippedBottom = Math.min(contentBounds.bottom, viewBottom);
    bandH = Math.max(160, clippedBottom - clippedTop);
  } else {
    bandH = Math.max(160, vh - 2 * padY);
  }

  const tw = Math.max(160, Math.round(slotW * innerShrink));
  const th = Math.max(160, Math.round(bandH * innerShrink));

  const cx = anchor.left + anchor.width / 2;
  const cy = anchor.top + anchor.height / 2;
  let left = cx - tw / 2;
  let top = cy - th / 2;
  left = Math.min(Math.max(left, padX), vw - padX - tw);
  top = Math.min(Math.max(top, padY), vh - padY - th);

  return { frameW: tw, frameH: th, frameLeft: left, frameTop: top };
}

const FRAME_TRANSITION =
  "left 0.4s cubic-bezier(0.22, 1, 0.36, 1), top 0.4s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.4s cubic-bezier(0.22, 1, 0.36, 1)";

type LightboxLayerProps = {
  active: PhotoLightboxPayload;
  onExited: () => void;
  bindDismiss: (fn: () => void) => void;
  onUserClose: () => void;
};

function LightboxLayer({ active, onExited, bindDismiss, onUserClose }: LightboxLayerProps) {
  const src = withAssetPath(active.src);
  const from = active.anchorRect;
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [naturalDims, setNaturalDims] = useState<{ w: number; h: number } | null>(null);
  const expandedRef = useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const exitingRef = useRef(false);

  const anchorStyle = (): React.CSSProperties => ({
    position: "fixed",
    left: from.left,
    top: from.top,
    width: Math.max(1, from.width),
    height: Math.max(1, from.height),
    zIndex: 10,
    borderRadius: TILE_RADIUS_PX,
    boxShadow: "none",
    outline: "none",
    backgroundColor: "transparent",
    overflow: "hidden",
    isolation: "isolate",
  });

  const [frameStyle, setFrameStyle] = useState<React.CSSProperties>(() => ({
    ...anchorStyle(),
  }));

  const ranRef = useRef(false);

  const runCollapse = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    if (reduceMotion) {
      setFrameStyle({
        ...anchorStyle(),
      });
      queueMicrotask(() => onExited());
      return;
    }
    setFrameStyle((prev) => ({
      ...prev,
      ...anchorStyle(),
      transition: FRAME_TRANSITION,
    }));
  }, [from.left, from.top, from.width, from.height, onExited, reduceMotion]);

  useLayoutEffect(() => {
    bindDismiss(runCollapse);
    return () => bindDismiss(() => {});
  }, [bindDismiss, runCollapse]);

  const onFrameTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (!exitingRef.current) return;
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== "width") return;
      onExited();
    },
    [onExited],
  );

  useLayoutEffect(() => {
    ranRef.current = false;
    setNaturalDims(null);
    exitingRef.current = false;
    expandedRef.current = null;
    let cancelled = false;

    const runExpand = (nw: number, nh: number) => {
      if (cancelled || ranRef.current) return;
      ranRef.current = true;

      const vw = window.innerWidth;
      const vh = Math.max(window.visualViewport?.height ?? window.innerHeight, 120);
      const { frameW: tw, frameH: th, frameLeft: left, frameTop: top } = lightboxFrameLayout(
        vw,
        vh,
        from,
        active.contentBounds,
      );

      expandedRef.current = { left, top, width: tw, height: th };

      setNaturalDims({ w: Math.max(1, nw), h: Math.max(1, nh) });

      const expandedFrame: React.CSSProperties = {
        position: "fixed",
        left,
        top,
        width: tw,
        height: th,
        zIndex: 10,
        borderRadius: 0,
        boxShadow: "none",
        outline: "none",
        backgroundColor: "transparent",
        overflow: "hidden",
        isolation: "isolate",
      };

      if (reduceMotion) {
        setFrameStyle(expandedFrame);
        return;
      }

      setFrameStyle({
        ...anchorStyle(),
        transition: "none",
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          setFrameStyle({
            ...expandedFrame,
            transition: FRAME_TRANSITION,
          });
        });
      });
    };

    const tryExpandFromPreload = (preloadEl: HTMLImageElement) => {
      if (cancelled) return;
      const nw = preloadEl.naturalWidth;
      const nh = preloadEl.naturalHeight;
      if (nw > 0 && nh > 0) {
        runExpand(nw, nh);
        return;
      }
      void preloadEl
        .decode()
        .then(() => {
          if (cancelled) return;
          const w = preloadEl.naturalWidth;
          const h = preloadEl.naturalHeight;
          if (w > 0 && h > 0) {
            runExpand(w, h);
          } else {
            runExpand(1600, 1067);
          }
        })
        .catch(() => {
          if (!cancelled) runExpand(1600, 1067);
        });
    };

    setFrameStyle({
      ...anchorStyle(),
      transition: reduceMotion ? undefined : "none",
    });

    const preload = new Image();
    preload.onload = () => tryExpandFromPreload(preload);
    preload.onerror = () => {
      if (!cancelled) runExpand(1600, 1067);
    };
    preload.src = src;

    queueMicrotask(() => {
      if (cancelled) return;
      if (preload.complete) {
        tryExpandFromPreload(preload);
      }
    });

    const stuckFallback = window.setTimeout(() => {
      if (!cancelled && !ranRef.current) {
        runExpand(1600, 1067);
      }
    }, 2_500);

    return () => {
      cancelled = true;
      window.clearTimeout(stuckFallback);
      preload.onload = null;
      preload.onerror = null;
      ranRef.current = false;
    };
  }, [active, from.left, from.top, from.width, from.height, reduceMotion, src]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onUserClose();
        }}
        className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface)] text-base font-semibold text-[var(--color-primary)] shadow-lg ring-1 ring-[var(--color-border)] transition hover:bg-[var(--color-surface-strong)] sm:right-5 sm:top-5 sm:h-12 sm:w-12"
        aria-label="Close"
      >
        ×
      </button>

      <div
        style={frameStyle}
        className="pointer-events-auto"
        onTransitionEnd={onFrameTransitionEnd}
        onClick={(e) => {
          if (exitingRef.current) return;
          const onPaintedImage =
            naturalDims &&
            clickFallsOnObjectContainImage(e, naturalDims.w, naturalDims.h);
          if (onPaintedImage) {
            e.stopPropagation();
            return;
          }
          e.stopPropagation();
          onUserClose();
        }}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- full-res file from /public; sharp sizing via native dimensions */}
        <img
          src={src}
          alt={active.alt}
          width={naturalDims?.w}
          height={naturalDims?.h}
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none block h-full w-full rounded-none object-contain object-center opacity-100"
          style={{
            mixBlendMode: "normal",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "none",
            outline: "none",
          }}
          draggable={false}
        />
      </div>
    </>
  );
}

export function PhotoLightboxProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<PhotoLightboxPayload | null>(null);
  const internalDismissRef = useRef<(() => void) | null>(null);
  const pendingOpenRef = useRef<PhotoLightboxPayload | null>(null);

  const bindDismiss = useCallback((fn: () => void) => {
    internalDismissRef.current = fn;
  }, []);

  const open = useCallback((payload: PhotoLightboxPayload) => {
    setActive((prev) => {
      if (prev) {
        pendingOpenRef.current = payload;
        queueMicrotask(() => internalDismissRef.current?.());
        return prev;
      }
      pendingOpenRef.current = null;
      return payload;
    });
  }, []);

  const close = useCallback(() => {
    pendingOpenRef.current = null;
    internalDismissRef.current?.();
  }, []);

  const onExited = useCallback(() => {
    internalDismissRef.current = null;
    const next = pendingOpenRef.current;
    pendingOpenRef.current = null;
    setActive(next);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  const activeSourceId = active?.sourceId ?? null;

  const layer =
    active && typeof document !== "undefined" ? (
      <div
        className="photo-lightbox-root pointer-events-auto fixed inset-0 isolate cursor-default bg-transparent"
        style={{ zIndex: 2_147_483_640 }}
        role="dialog"
        aria-modal="true"
        aria-label={active.alt}
        onClick={close}
      >
        <LightboxLayer
          key={`${active.sourceId}:${active.src}:${active.anchorRect.left}:${active.anchorRect.top}:${active.anchorRect.width}:${active.anchorRect.height}:${active.contentBounds ? `${active.contentBounds.top}-${active.contentBounds.bottom}` : "full"}`}
          active={active}
          onExited={onExited}
          bindDismiss={bindDismiss}
          onUserClose={close}
        />
      </div>
    ) : null;

  return (
    <PhotoLightboxContext.Provider value={{ open, close, activeSourceId }}>
      {children}
      {layer ? createPortal(layer, document.body) : null}
    </PhotoLightboxContext.Provider>
  );
}
