"use client";

import { useEffect, useState } from "react";

const VISIT_COUNTER_GET_URL =
  "https://api.countapi.xyz/get/irisonthemove.nl/website-visits";

function formatInt(n: number) {
  return new Intl.NumberFormat("nl-NL").format(Math.round(n));
}

export function WebsiteVisitsValue({ fallback }: { fallback: number }) {
  const [value, setValue] = useState<number>(fallback);

  useEffect(() => {
    void fetch(VISIT_COUNTER_GET_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { value?: number } | null) => {
        if (typeof data?.value === "number" && Number.isFinite(data.value)) {
          setValue(data.value);
        }
      })
      .catch(() => {
        // Keep fallback value.
      });
  }, []);

  return <>{formatInt(value)}</>;
}

