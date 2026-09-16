/**
 * One-off capture for the Aurora case study.
 *
 * Every other build in public/builds was shot at 1440x900 and re-encoded to
 * JPEG, so this matches that exactly — Project.jsx frames every shot at 16:10
 * and a different source ratio shows up immediately as a crop.
 *
 * Aurora drives its scroll through Lenis, which swallows window.scrollTo and
 * animates its own position instead. Real wheel events are the only input it
 * honours, hence page.mouse.wheel rather than an evaluate(). GSAP ScrollTrigger
 * then needs a beat to settle before the frame is worth capturing.
 *
 *   node scripts/capture-aurora.mjs            # expects the preview on :4317
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.AURORA_URL ?? 'http://localhost:4317'
const OUT = 'public/builds/.aurora-raw'

// path: route to load. scroll: pixels to wheel down before capturing.
const SHOTS = [
  { file: 'hero', path: '/', scroll: 0 },
  { file: '1', path: '/', scroll: 0 },
  { file: '2', path: '/', scroll: 1900 },
  { file: '3', path: '/shop', scroll: 700 },
]

await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
})

for (const shot of SHOTS) {
  await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  if (shot.scroll) {
    // One long wheel gesture overshoots Lenis's easing and lands somewhere
    // unpredictable. Stepping in 300px nudges lets it keep up, so the final
    // resting position is the one that was asked for.
    for (let y = 0; y < shot.scroll; y += 300) {
      await page.mouse.wheel(0, 300)
      await page.waitForTimeout(120)
    }
    await page.waitForTimeout(1800)
  }

  await page.screenshot({ path: `${OUT}/${shot.file}.png` })
  console.log(`captured ${shot.file} (${shot.path} @ ${shot.scroll}px)`)
}

await browser.close()
