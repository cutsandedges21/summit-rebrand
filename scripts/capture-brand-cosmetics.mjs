/**
 * Recapture for the Brand Cosmetics case study.
 *
 * Shots 2 and 3 were both unusable: the midpage frame was an almost empty pale
 * screen, and the one below it caught a section crossfade mid-flight with two
 * headlines printed over each other. Shot 1 is fine and is not touched here.
 *
 * Matches the rest of public/builds/shots exactly — 1440x900 at DPR 2, PNG out,
 * then scripts/compress-shots.mjs re-encodes to JPEG at q82. Project.jsx frames
 * every shot at 16:10, so a different source ratio shows up as a crop.
 *
 * The site pins sections and crossfades between them on scroll, which is how
 * the old shot 3 ended up double-exposed. Scrolling in small wheel nudges and
 * then holding still lets a transition finish before the shutter opens.
 *
 *   node scripts/capture-brand-cosmetics.mjs         # writes the two real shots
 *   node scripts/capture-brand-cosmetics.mjs --scan  # sweeps depths to choose from
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BRAND_COSMETICS_URL ?? 'https://brand-cosmetics.vercel.app/'
const scan = process.argv.includes('--scan')

const OUT = scan ? 'public/builds/.brand-cosmetics-scan' : 'public/builds/shots'

// Wheel distance, NOT scroll position: the page damps wheel input to about half,
// so these land at roughly scrollY 5400 and 7100. Measured, not calculated — the
// scan prints the real scrollY at each stop.
const SCAN = [900, 2700, 4500, 6300, 8400, 10800, 13400, 15800].map((scroll) => ({
  file: `scan-${scroll}`,
  scroll,
}))

// Chosen off the scan on 2026-09-16.
//
// The top third of this page is one long pinned sequence of single sentences
// over pale water, which is what the old shots 2 and 3 both landed in — three
// near-identical washed-out screens for a build whose whole claim is its product
// grid. These two go where the page actually argues: the grid itself, then the
// dark ingredient section, which also gives the gallery some tonal range next to
// a pale shot 1.
const FINAL = [
  { file: 'brand-cosmetics-2', scroll: 10800 }, // Explore the full radiance ritual — the four-product grid
  { file: 'brand-cosmetics-3', scroll: 14200 }, // Three sources. Nothing else. — ingredients and stats
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

let at = 0
for (const shot of scan ? SCAN : FINAL) {
  // Cumulative, so the page is scrolled the way a visitor scrolls it rather
  // than teleported — a pinned section that is never scrolled through does not
  // run its entrance at all.
  for (; at < shot.scroll; at += 300) {
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(120)
  }
  await page.waitForTimeout(2000)

  await page.screenshot({ path: `${OUT}/${shot.file}.png` })
  console.log(`captured ${shot.file} @ ${shot.scroll}px`)
}

await browser.close()
