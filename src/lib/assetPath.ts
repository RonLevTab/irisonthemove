/**
 * Prefix static asset URLs when the site is served under a subpath
 * (`NEXT_PUBLIC_BASE_PATH`, e.g. `/blog` — no trailing slash).
 */
export function withAssetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";
  if (!base || !path.startsWith("/")) return path;
  return `${base}${path}`;
}
