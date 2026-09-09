import { test, expect } from '@playwright/test'

const PATHS = [
  '/',
  '/portfolio',
  '/portfolio/halcyon',
  '/services',
  '/pricing',
  '/about',
  '/faq',
  '/contact',
  '/privacy-policy',
  '/terms-of-service',
]

/**
 * The design rules from spec §3, asserted in a real browser on the production
 * build. Every one of them is invisible to the unit suite, and each corresponds
 * to a bug that actually shipped during this build.
 *
 * Two things this file learned the hard way, both of which produced alarming
 * false positives before being fixed:
 *
 *   1. Zero-area elements must be excluded. The hover sweeps are ink-coloured
 *      spans sitting at scale-x-0 — they read as "dark panels" by colour alone
 *      while occupying no space at all.
 *   2. Scrolling must go through the real input path. This site runs Lenis, so
 *      window.scrollTo does not drive it; a synthetic scroll leaves every
 *      reveal unfired and makes the whole page look permanently invisible.
 */
async function walkPage(page) {
  const height = await page.evaluate(() => document.body.scrollHeight)
  for (let y = 0; y < height; y += 600) {
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(120)
  }

  // Lenis eases, so the wheel events above are still resolving after the loop
  // ends. Sampling immediately catches rows that are technically on screen but
  // whose reveal has not been triggered yet — which looks exactly like content
  // stuck invisible, and is not. Wait for scroll to actually stop.
  await page.waitForFunction(
    () => {
      const y = window.scrollY
      return new Promise((resolve) =>
        setTimeout(() => resolve(Math.abs(window.scrollY - y) < 1), 200),
      )
    },
    null,
    { timeout: 10_000 },
  )
  await page.waitForTimeout(900)
}

test.describe('design rules', () => {
  test.skip(({ isMobile }) => isMobile)

  for (const path of PATHS) {
    test(`${path} obeys the visual language`, async ({ page }) => {
      await page.goto(path)
      await walkPage(page)

      const report = await page.evaluate(() => {
        const lum = (c) => {
          const m = c.match(/\d+/g)
          if (!m) return 1
          const [r, g, b] = m.map(Number)
          return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
        }
        const els = [...document.querySelectorAll('#root *')]
        const area = (e) => {
          const r = e.getBoundingClientRect()
          return r.width * r.height
        }
        // Two exemptions from the no-containers rule, both principled rather
        // than convenient:
        //
        //   isOverlay  — the custom cursor is a rounded-full 34px dot. It is a
        //                pointer, not a panel; the rule governs the page.
        //   isImagery  — the rule bans rounded CHROME. An element showing a
        //                photograph is content, whether it is an <img>, a div
        //                with a background-image, or a frame that declares
        //                role="img" and clips one. A softened corner on a photo
        //                is not a card.
        const isOverlay = (e) => {
          const s = getComputedStyle(e)
          return s.position === 'fixed' && s.pointerEvents === 'none'
        }
        const isImagery = (e) =>
          e.tagName === 'IMG' ||
          e.getAttribute('role') === 'img' ||
          getComputedStyle(e).backgroundImage.startsWith('url(')

        return {
          // Spec §3: no dark sections. Content images are the only dark
          // rectangles; chrome never is.
          darkPanels: els
            .filter((e) => !isImagery(e) && !isOverlay(e) && area(e) > 400)
            .filter((e) => {
              const bg = getComputedStyle(e).backgroundColor
              return bg !== 'rgba(0, 0, 0, 0)' && lum(bg) < 0.25
            })
            .map((e) => `${e.tagName}.${(e.className || '').toString().slice(0, 30)}`),

          // Spec §3: the accent is a shape, never a letter. At ~1.1:1 on paper
          // it is illegible as text.
          accentAsText: els.filter(
            (e) => getComputedStyle(e).color.replace(/\s/g, '') === 'rgb(249,234,85)',
          ).length,

          // Spec §3: no containers. Hairlines only.
          rounded: els
            .filter((e) => !isImagery(e) && !isOverlay(e))
            .filter((e) => parseFloat(getComputedStyle(e).borderRadius) > 4)
            .map((e) => `${e.tagName}.${(e.className || '').toString().slice(0, 30)}`),
          thickBorders: els.filter((e) => {
            const s = getComputedStyle(e)
            return ['borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth']
              .some((k) => parseFloat(s[k]) > 2)
          }).length,

          // A reveal that never fires is content the visitor never sees. Only
          // count what is on screen — anything below the fold is legitimately
          // still waiting.
          stuckInvisible: els
            .filter((e) => {
              const r = e.getBoundingClientRect()
              const onScreen = r.top < window.innerHeight && r.bottom > 0
              return (
                onScreen &&
                parseFloat(getComputedStyle(e).opacity) < 0.05 &&
                r.width > 40 &&
                r.height > 20 &&
                (e.textContent || '').trim().length > 15
              )
            })
            .map((e) => (e.textContent || '').trim().slice(0, 40)),

          // The same failure, by the other mechanism. Every case study shipped
          // with all three of its screenshots clipped to nothing: a clip-path
          // hidden state makes intersectionRatio 0, so a whileInView threshold
          // above 0 can never be met and the reveal never fires. The opacity
          // check above cannot see it — those elements are fully opaque, just
          // clipped to zero area — so this ran green while the portfolio had no
          // photography on it at all. Anything still fully clipped once it has
          // been scrolled past is stuck, not waiting.
          stuckClipped: els
            .filter((e) => {
              const r = e.getBoundingClientRect()
              if (r.bottom > window.innerHeight || r.width < 40 || r.height < 20) return false
              // inset(100%...) and inset(0% 100% ...) both collapse the element.
              const clip = getComputedStyle(e).clipPath
              return /inset\(/.test(clip) && /(^|[\s(])100%/.test(clip)
            })
            .map((e) => `${e.tagName}.${(e.className || '').toString().slice(0, 30)}`),

          overflow: document.documentElement.scrollWidth - window.innerWidth,
          title: document.title,
        }
      })

      expect(report.darkPanels, `dark panels on ${path}`).toEqual([])
      expect(report.accentAsText, `accent used as text on ${path}`).toBe(0)
      expect(report.rounded, `rounded containers on ${path}`).toEqual([])
      expect(report.thickBorders, `borders over 2px on ${path}`).toBe(0)
      expect(report.stuckInvisible, `content stuck invisible on ${path}`).toEqual([])
      expect(report.stuckClipped, `content stuck clipped on ${path}`).toEqual([])
      expect(report.overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(1)
      expect(report.title).toMatch(/mossimo Studios/)
    })
  }
})
