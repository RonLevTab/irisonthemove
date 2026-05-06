/**
 * True op typische laptops: brede layout + echte muis/trackpad (“fine” pointer).
 * iPhone/touch-first blijft dan het oude gedrag (meer clips tegelijk oké klein viewport).
 */
export function isDesktopFinePointerMinMd(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    window.matchMedia("(min-width: 768px)").matches
  );
}
