"use client";

import { useEffect, type ReactNode } from "react";

const HTML_CLASS = "home-mobile-snap";

/**
 * Enables vertical scroll-snap on `<html>` for small viewports (homepage “one section per screen”).
 */
export function HomeMobileScrollSnap({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(HTML_CLASS);
    return () => root.classList.remove(HTML_CLASS);
  }, []);
  return <>{children}</>;
}
