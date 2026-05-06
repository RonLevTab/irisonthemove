/**
 * Verwijdert `#t=…` (media-fragment) uit een video-URL zodat het eerste echte frame van de clip
 * wordt gebruikt, niet een kunstmatige offset. Query (`?v=…`) blijft behouden.
 */
export function stripVideoMediaFragment(src: string): string {
  const s = src.trim();
  const i = s.indexOf("#");
  return i >= 0 ? s.slice(0, i) : s;
}
