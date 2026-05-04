/**
 * Platform-specific tweaks (see `globals.css`: `html.os-mac` / `html.os-windows`).
 * The class must be present in the **server HTML** for `<html>` — do not inject it
 * only in a pre-hydration script, or React will see a different `class` than it
 * rendered and throw a hydration error.
 */
export type PlatformOsHtmlClass = "os-mac" | "os-windows";

/**
 * Mirrors the old client-side detection using `navigator.userAgent` /
 * `navigator.platform`, but runs on the request `User-Agent` header.
 */
export function getPlatformOsHtmlClassFromUserAgent(
  userAgent: string | null | undefined,
): PlatformOsHtmlClass {
  const u = userAgent ?? "";
  if (/Win/.test(u) || /Windows/i.test(u)) return "os-windows";
  if (
    /Mac OS X/i.test(u) ||
    /iPhone|iPad|iPod/i.test(u) ||
    /Macintosh/i.test(u)
  ) {
    return "os-mac";
  }
  return "os-windows";
}
