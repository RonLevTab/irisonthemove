/**
 * Rasterises `public/images/site/favicon-source.svg` into PNG favicons + app icons.
 * Run: node scripts/generate-favicons-from-svg.mjs
 */
import { copyFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

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

copyFileSync(svgPath, join(root, "public/favicon.svg"));
copyFileSync(svgPath, join(root, "src/app/icon.svg"));
console.log("copied SVG → public/favicon.svg, src/app/icon.svg (Next metadata)");
