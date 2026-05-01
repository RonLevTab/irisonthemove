/**
 * Crop + resize destination hero photos to match each tile’s aspect ratio and a max edge,
 * then re-save as JPEG (smaller files, faster loads). Re-runs skip writes when the new file would not be smaller.
 *
 * Frame logic matches the gallery: each tile is `width / height === aspectRatio` from
 * `src/content/destinations-gallery.json`, within a container `max-w-5xl` (1024px) and
 * 1 / 2 / 3 columns → rough display widths ~min(100vw,1024px), /2, /3.
 *
 * Output: longer box edge = MAX_EDGE px (default 960), center-cropped with sharp `fit: cover`.
 *
 * Usage: npm run optimize:destinations
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const MAX_EDGE = 960;
const JPEG_QUALITY = 82;
const projectRoot = process.cwd();
const galleryPath = path.join(
  projectRoot,
  "src",
  "content",
  "destinations-gallery.json",
);

function targetBox(ratio) {
  const r = Number(ratio);
  if (!Number.isFinite(r) || r <= 0) {
    return { width: MAX_EDGE, height: MAX_EDGE };
  }
  if (r >= 1) {
    return { width: MAX_EDGE, height: Math.max(1, Math.round(MAX_EDGE / r)) };
  }
  return { width: Math.max(1, Math.round(MAX_EDGE * r)), height: MAX_EDGE };
}

async function main() {
  const raw = await readFile(galleryPath, "utf8");
  const { items } = JSON.parse(raw);
  if (!Array.isArray(items)) {
    throw new Error("destinations-gallery.json: missing items[]");
  }

  const seen = new Set();
  let ok = 0;
  let skipped = 0;

  for (const item of items) {
    const src = item?.src;
    if (!src || typeof src !== "string" || seen.has(src)) continue;
    seen.add(src);

    const abs = path.join(projectRoot, "public", ...src.split("/").filter(Boolean));
    const { width: tw, height: th } = targetBox(item.aspectRatio);

    let input;
    try {
      input = await readFile(abs);
    } catch {
      console.warn("Skip (missing):", src);
      skipped += 1;
      continue;
    }

    const meta = await sharp(input).metadata();
    const before = input.length;

    const out = await sharp(input)
      .rotate()
      .resize(tw, th, {
        fit: "cover",
        position: "center",
        withoutEnlargement: true,
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();

    if (out.length >= before) {
      console.log("Keep (already smaller on disk):", src);
      skipped += 1;
      continue;
    }

    await writeFile(abs, out);
    console.log(
      "OK",
      src,
      `→ ${tw}×${th}`,
      `${(before / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB`,
    );
    ok += 1;
  }

  console.log(`\nDone. Updated ${ok} file(s), skipped ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
