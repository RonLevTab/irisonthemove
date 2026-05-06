#!/usr/bin/env node
/**
 * Start import-travel-guide-grid-six.sh met dezelfde env als jouw Terminal.
 *
 * npm run import-travel-grid
 * DOWNLOADS=/pad/Downloads npm run import-travel-grid
 */

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sh = path.join(__dirname, "import-travel-guide-grid-six.sh");

const env = {
  ...process.env,
  DOWNLOADS: process.env.DOWNLOADS ?? path.join(process.env.HOME ?? "", "Downloads"),
};

try {
  execFileSync("bash", [sh], { cwd: root, env, stdio: "inherit" });
} catch {
  process.exit(1);
}
