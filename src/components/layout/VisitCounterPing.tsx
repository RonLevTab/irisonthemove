"use client";

import { useEffect } from "react";

const VISIT_SESSION_KEY = "iotm_visit_counted_v1";
const VISIT_COUNTER_HIT_URL =
  "https://api.countapi.xyz/hit/irisonthemove.nl/website-visits";

/**
 * Counts one website visit per browser session.
 * Runs on first load only (skips localhost).
 */
export function VisitCounterPing() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return;

    if (window.sessionStorage.getItem(VISIT_SESSION_KEY) === "1") return;
    window.sessionStorage.setItem(VISIT_SESSION_KEY, "1");

    void fetch(VISIT_COUNTER_HIT_URL, {
      method: "GET",
      cache: "no-store",
      keepalive: true,
    }).catch(() => {
      // Best-effort only; never block UI.
    });
  }, []);

  return null;
}

