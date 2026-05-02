"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useLayoutEffect } from "react";

function scrollDocumentToTop() {
  if (typeof window === "undefined") return;
  const root = document.scrollingElement ?? document.documentElement;
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);
}

/**
 * Client-side navigation can keep the previous page scroll position.
 * On every URL change (pathname and query), scroll to the top.
 */
function ScrollToTopOnRouteInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryKey = searchParams.toString();

  useLayoutEffect(() => {
    scrollDocumentToTop();
  }, [pathname, queryKey]);

  /** Run again after paint; some runtimes briefly restore the previous scroll after navigation. */
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      scrollDocumentToTop();
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, queryKey]);

  return null;
}

export function ScrollToTopOnRoute() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopOnRouteInner />
    </Suspense>
  );
}
