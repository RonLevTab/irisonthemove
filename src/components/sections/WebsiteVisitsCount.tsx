"use client";

import { useEffect, useState } from "react";

function formatInt(n: number) {
  return new Intl.NumberFormat("nl-NL").format(Math.round(n));
}

export function WebsiteVisitsCount({ fallback }: { fallback: number }) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    void fetch("/api/visits", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count?: number } | null) => {
        if (typeof data?.count === "number" && Number.isFinite(data.count)) {
          setValue(Math.max(data.count, fallback));
        }
      })
      .catch(() => {});
  }, []);

  return <>{formatInt(value)}</>;
}
