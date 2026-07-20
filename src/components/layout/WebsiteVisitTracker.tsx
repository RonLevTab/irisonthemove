"use client";

import { useEffect } from "react";

const SESSION_KEY = "iris-website-visit-recorded";

export function WebsiteVisitTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;

    void fetch("/api/visits", {
      method: "POST",
      keepalive: true,
    })
      .then((response) => {
        if (!response.ok) return;
        window.sessionStorage.setItem(SESSION_KEY, "1");
      })
      .catch(() => {});
  }, []);

  return null;
}
