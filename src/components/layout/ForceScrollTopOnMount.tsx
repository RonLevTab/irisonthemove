"use client";

import { useEffect, useLayoutEffect } from "react";

function scrollTopHard() {
  const root = document.scrollingElement ?? document.documentElement;
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

/**
 * Some route transitions can briefly restore prior scroll on iOS/macOS.
 * This guard forces a hard reset to top for pages that include it.
 */
export function ForceScrollTopOnMount() {
  useLayoutEffect(() => {
    scrollTopHard();
  }, []);

  useEffect(() => {
    const raf = window.requestAnimationFrame(scrollTopHard);
    const t = window.setTimeout(scrollTopHard, 80);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
