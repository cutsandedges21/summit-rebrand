import { test, expect } from '@playwright/test'

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile)

  test('process left column stays put while the right column scrolls', async ({ page }) => {
    await page.goto('/')
    const pin = page.getByTestId('process-pin')
    await pin.scrollIntoViewIfNeeded()

    // Engage the sticky offset FIRST. scrollIntoViewIfNeeded leaves the element
    // above its sticky top, so it still has travel left; measuring from there
    // captures the transition into stickiness rather than stickiness itself.
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(400)

    const before = await pin.boundingBox()
    await page.mouse.wheel(0, 900)
    await page.waitForTimeout(500)
    const after = await pin.boundingBox()

    // Sticky: the pinned column holds position while content moves past it.
    // If this fails, something is hijacking scroll or an ancestor has
    // overflow:hidden — both silently disable position:sticky.
    expect(Math.abs(after.y - before.y)).toBeLessThan(120)
  })

  test('the active process step advances as you scroll', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('process-pin').scrollIntoViewIfNeeded()

    const items = page.getByTestId('process-index-item')

    // Scroll in steps rather than one jump: IntersectionObserver reports on
    // frames it actually saw, and a single large wheel can skip the region the
    // observer is watching entirely.
    const active = () =>
      page.evaluate(() =>
        [...document.querySelectorAll('[data-testid="process-index-item"]')].findIndex(
          (el) => el.dataset.active === 'true',
        ),
      )

    const start = await active()
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, 400)
      await page.waitForTimeout(250)
    }
    expect(await active()).toBeGreaterThan(start)
    await expect(items.nth(0)).toHaveAttribute('data-active', 'false')
  })

  test('the arc animates', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('arc-stage')).toHaveAttribute('data-static', 'false')
  })

  // The preview column was static once, which left a ~380x373 hole beside the
  // lower half of the fourteen-row list.
  test('the portfolio preview tracks the list instead of running out', async ({ page }) => {
    await page.goto('/portfolio')
    const preview = page.getByTestId('work-preview')
    await preview.scrollIntoViewIfNeeded()

    // Same reason as the process pin: let it reach its sticky offset first.
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(400)

    const before = await preview.boundingBox()
    await page.mouse.wheel(0, 700)
    await page.waitForTimeout(500)
    const after = await preview.boundingBox()

    expect(Math.abs(after.y - before.y)).toBeLessThan(120)
  })

  test('hovering a row swaps the preview', async ({ page }) => {
    await page.goto('/portfolio')
    const rows = page.getByTestId('work-row')
    const preview = page.getByTestId('work-preview')

    const first = await preview.getAttribute('data-slug')
    await rows.nth(3).hover()
    await expect(preview).not.toHaveAttribute('data-slug', first)
  })
})

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile)

  test('process does not pin', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('process-pin')).toHaveAttribute('data-pinned', 'false')
  })

  test('the arc collapses to static', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('arc-stage')).toHaveAttribute('data-static', 'true')
  })

  // The preview can never change on a touch device — rows navigate on tap and
  // hover never fires — so showing one build's screenshot under a list of
  // fourteen would be actively misleading.
  test('the inert preview is hidden', async ({ page }) => {
    await page.goto('/portfolio')
    await expect(page.getByTestId('work-preview')).toBeHidden()
  })

  test('no page overflows the viewport horizontally', async ({ page }) => {
    for (const path of ['/', '/portfolio', '/portfolio/halcyon', '/services', '/pricing', '/about', '/faq', '/contact']) {
      await page.goto(path)
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      )
      expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(1)
    }
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the arc renders static', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('arc-stage')).toHaveAttribute('data-static', 'true')
  })
})

test.describe('routing and assets', () => {
  test('old urls still resolve', async ({ page }) => {
    for (const stale of ['/work', '/inspiration']) {
      await page.goto(stale)
      await expect(page).toHaveURL(/\/portfolio$/)
    }
  })

  // Nothing in the unit suite loads an image, so a broken path is invisible
  // there. The wordmark and the case-study captures are the ones that matter.
  test('every image on a case study actually loads', async ({ page }) => {
    await page.goto('/portfolio/sterling')

    // The gallery images are loading="lazy", so on a phone the lower frames are
    // legitimately not fetched yet. Walk the page first — that also proves lazy
    // loading actually resolves rather than leaving permanent holes.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 60))
      }
    })
    await page.waitForLoadState('networkidle')

    const broken = await page.evaluate(() =>
      [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
    )
    expect(broken).toEqual([])
  })

  test('the wordmark loads in the nav', async ({ page }) => {
    await page.goto('/')
    const ok = await page.evaluate(() => {
      const img = document.querySelector('header img')
      return Boolean(img && img.complete && img.naturalWidth > 0)
    })
    expect(ok).toBe(true)
  })
})

test.describe('page titles', () => {
  // A single-page app keeps index.html's title unless something changes it, so
  // every route sharing one title is the default failure mode, not an unlikely
  // one. Awkward on any site; worse on one that sells local SEO.
  test('every route sets its own title', async ({ page }) => {
    const seen = new Map()

    for (const path of [
      '/',
      '/portfolio',
      '/portfolio/halcyon',
      '/portfolio/sterling',
      '/services',
      '/pricing',
      '/about',
      '/faq',
      '/contact',
    ]) {
      await page.goto(path)
      const title = await page.title()
      expect(title, `${path} has no brand in its title`).toMatch(/mossimo Studios/)
      expect(title, `${path} still has the scaffold title`).not.toMatch(/vite/i)
      seen.set(path, title)
    }

    // Distinct, not just present.
    expect(new Set(seen.values()).size).toBe(seen.size)
  })
})
