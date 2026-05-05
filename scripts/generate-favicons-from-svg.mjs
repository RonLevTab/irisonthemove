/**
 * Rasterises `public/images/site/favicon-source.svg` into PNG favicons + app icons,
 * copies SVG to `public/favicon.svg` + `src/app/icon.svg` (Next tab/bookmark icon).
 *
 * Run: node scripts/generate-favicons-from-svg.mjs
 *
 * After changing the source SVG, run this so `apple-touch-icon.png`, `favicon-*.png`,
 * and `src/app/apple-icon.png` match (Safari / iOS home screen / shortcuts).
 */
import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public/images/site/favicon-source.svg");
const svg = readFileSync(svgPath);

async function writePng(relPath, size) {
  const out = join(root, relPath);
  await sharp(svg).resize(size, size).png().toFile(out);
  console.log("wrote", relPath, `${size}x${size}`);
}

await writePng("public/favicon-16x16.png", 16);
await writePng("public/favicon-32x32.png", 32);
await writePng("public/apple-touch-icon.png", 180);
await writePng("src/app/apple-icon.png", 180);

/**
 * Real .ico for browsers that still prioritize `/favicon.ico` over metadata links.
 * Uses Python Pillow if available; skip silently when unavailable.
 */
try {
  execFileSync("python3", [
    "-c",
    [
      "from PIL import Image",
      `im=Image.open(r'${join(root, "public/apple-touch-icon.png")}').convert('RGBA')`,
      `im.save(r'${join(root, "public/favicon.ico")}', format='ICO', sizes=[(16,16),(32,32),(48,48),(64,64)])`,
    ].join("; "),
  ]);
  console.log("wrote", "public/favicon.ico", "16/32/48/64");
} catch {
  console.log("skipped", "public/favicon.ico", "(Pillow not available)");
}

copyFileSync(svgPath, join(root, "public/favicon.svg"));
copyFileSync(svgPath, join(root, "src/app/icon.svg"));
console.log("copied SVG → public/favicon.svg, src/app/icon.svg (Next metadata)");

/* keep favicon.ico (generated above) to prevent stale browser fallbacks */
