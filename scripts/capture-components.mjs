#!/usr/bin/env node
// Takes the light and dark pictures on the docs pages: every component of the
// Components page, and the Foundations page's colours, type, spacing, corners,
// shadows and icons. Then run `npm run sync` so the pages show them.
//
//   npm run dev                    (in another terminal: the gallery on :3100)
//   npm run pictures:components    (optionally: -- button tooltip, to take only those)
//
// Uses the Google Chrome installed on this computer (playwright-core, no
// download). Pictures are 1x PNGs, the section exactly as it sits on the page.

import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BASE = process.env.GALLERY_URL ?? "http://localhost:3100";
const WIDTH = 1440;
const only = process.argv.slice(2);

// Where each picture goes: the Components page's sections (from the map the
// sync writes), then the Foundations page's.
const DOCS = JSON.parse(readFileSync(join(ROOT, "src/site/docs-map.json"), "utf8"));
const JOBS = [
  ...Object.entries(DOCS).map(([id, dir]) => ({ path: "/", id, dir })),
  { path: "/foundations", id: "colors", dir: "1-core-elements/1-color-palette" },
  { path: "/foundations", id: "icons", dir: "1-core-elements/2-icons" },
  { path: "/foundations", id: "shadows", dir: "1-core-elements/4-shadows" },
  { path: "/foundations", id: "typography", dir: "1-core-elements/6-typography" },
  { path: "/foundations", id: "corners", dir: "1-core-elements/7-corner-radius" },
  { path: "/foundations", id: "spacing", dir: "1-core-elements/7-corner-radius" },
].filter((j) => !only.length || only.includes(j.id));

try {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(String(res.status));
} catch {
  console.error(`The gallery is not answering at ${BASE}. Start it first: npm run dev`);
  process.exit(1);
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
let taken = 0;

for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, colorScheme: theme, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  for (const path of [...new Set(JOBS.map((j) => j.path))]) {
    await page.setViewportSize({ width: WIDTH, height: 900 });
    await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const want = theme === "dark" ? "ink" : "paper";
    const got = await page.evaluate(() => document.documentElement.dataset.theme);
    if (got !== want) throw new Error(`${path}: the page is in "${got}", not "${want}"`);

    for (const job of JOBS.filter((j) => j.path === path)) {
      const section = page.locator(`section#${job.id}`);
      if (!(await section.count())) {
        console.warn(`  no section #${job.id} on ${path}`);
        continue;
      }
      // The page scrolls inside its own frame, which would cut a tall section:
      // make the window taller than the section, then bring it to the top.
      const height = Math.ceil(await section.evaluate((el) => el.getBoundingClientRect().height));
      await page.setViewportSize({ width: WIDTH, height: Math.min(16000, Math.max(900, height + 160)) });
      await section.evaluate((el) => el.scrollIntoView({ block: "start" }));
      await page.waitForTimeout(job.id === "charts" || job.id === "kpi-card" ? 2500 : 400);
      const file = join(ROOT, job.dir, "pictures", `${job.id}-${theme}.png`);
      mkdirSync(dirname(file), { recursive: true });
      await section.screenshot({ path: file, animations: "disabled", caret: "hide" });
      taken += 1;
      console.log(`  ${theme.padEnd(5)} ${job.id.padEnd(18)} ${(statSync(file).size / 1024).toFixed(0)} KB`);
    }
  }

  // The palette page people open (its own light and dark boards side by side).
  if (theme === "light" && (!only.length || only.includes("palette"))) {
    const html = join(ROOT, "1-core-elements/1-color-palette/palette.html");
    if (existsSync(html)) {
      await page.setViewportSize({ width: WIDTH, height: 900 });
      await page.goto(pathToFileURL(html).href, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const file = join(ROOT, "1-core-elements/1-color-palette/pictures/palette.png");
      await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
      taken += 1;
      console.log(`  page  palette.html        ${(statSync(file).size / 1024).toFixed(0)} KB`);
    }
  }

  if (errors.length) console.warn(`  ${theme}: errors on the page:\n    ${errors.join("\n    ")}`);
  await context.close();
}

await browser.close();
console.log(`\n${taken} pictures. Now run: npm run sync`);
