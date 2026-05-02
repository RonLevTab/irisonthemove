"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Client-side navigation can keep the previous page’s scroll position.
 * After each pathname change (e.g. navbar links), start at the top.
 */
export function ScrollToTopOnRoute() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
