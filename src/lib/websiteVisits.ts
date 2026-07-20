import { promises as fs } from "node:fs";
import path from "node:path";

import { unstable_noStore as noStore } from "next/cache";

import workPage from "@/content/work-page.json";

const VISITS_KEY = "website:total-visits";
const DEV_STORE_PATH = path.join(process.cwd(), ".data", "website-visits.json");

export function getWebsiteVisitsBaseline(): number {
  return workPage.results?.website?.totalVisits ?? 0;
}

function hasKv(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL?.trim() && process.env.KV_REST_API_TOKEN?.trim(),
  );
}

async function kvCommand<T>(command: (string | number)[]): Promise<T | null> {
  const url = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { result?: T };
    return data.result ?? null;
  } catch {
    return null;
  }
}

async function readDevCount(baseline: number): Promise<number> {
  try {
    const raw = await fs.readFile(DEV_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as { count?: unknown };
    return typeof parsed.count === "number" ? parsed.count : baseline;
  } catch {
    await fs.mkdir(path.dirname(DEV_STORE_PATH), { recursive: true });
    await fs.writeFile(DEV_STORE_PATH, JSON.stringify({ count: baseline }));
    return baseline;
  }
}

async function writeDevCount(count: number): Promise<void> {
  await fs.mkdir(path.dirname(DEV_STORE_PATH), { recursive: true });
  await fs.writeFile(DEV_STORE_PATH, JSON.stringify({ count }));
}

async function ensureKvBaseline(baseline: number): Promise<void> {
  await kvCommand(["SET", VISITS_KEY, baseline, "NX"]);
}

/** Live total for the Results “website visits” card. */
export async function getWebsiteVisitCount(): Promise<number> {
  noStore();
  const baseline = getWebsiteVisitsBaseline();

  if (hasKv()) {
    await ensureKvBaseline(baseline);
    const count = await kvCommand<number>(["GET", VISITS_KEY]);
    if (typeof count === "number") return count;
  }

  return readDevCount(baseline);
}

/** Record one visit (once per browser session from the client tracker). */
export async function incrementWebsiteVisitCount(): Promise<number> {
  const baseline = getWebsiteVisitsBaseline();

  if (hasKv()) {
    await ensureKvBaseline(baseline);
    const count = await kvCommand<number>(["INCR", VISITS_KEY]);
    if (typeof count === "number") return count;
  }

  const current = await readDevCount(baseline);
  const next = current + 1;
  await writeDevCount(next);
  return next;
}

export function shouldCountWebsiteVisit(request: Request): boolean {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return false;
  }

  const purpose = request.headers.get("sec-purpose") ?? request.headers.get("purpose");
  if (purpose?.toLowerCase().includes("prefetch")) {
    return false;
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  if (
    /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|headless|lighthouse/i.test(
      userAgent,
    )
  ) {
    return false;
  }

  return true;
}
