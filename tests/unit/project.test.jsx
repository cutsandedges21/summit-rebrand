import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Project from '../../src/pages/Project.jsx'
import Portfolio from '../../src/pages/Portfolio.jsx'
import { BUILDS } from '../../src/lib/builds.js'

function renderProject(slug) {
  return render(
    <MemoryRouter initialEntries={[`/portfolio/${slug}`]}>
      <Routes>
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<Project />} />
      </Routes>
    </MemoryRouter>,
  )
}

// `own` has to be a build on the DEFAULT provenance sentence with a live url —
// not merely the first `own` build, which is now Aurora and is neither. Picking
// by position is what broke when Aurora went to the front of the running order.
const own = BUILDS.find((b) => b.own && !b.provenance && b.url)
const notOwn = BUILDS.find((b) => !b.own)
const overridden = BUILDS.find((b) => b.own && b.provenance)
const unlinked = BUILDS.find((b) => !b.url)

describe('project case study', () => {
  // One render of every case study in a single test, and each one splits its
  // headline into per-character motion spans. At fourteen builds that fitted
  // inside vitest's 5s default; the fifteenth pushed it to ~5.3s under parallel
  // workers and it started failing roughly one run in four. The work is real,
  // not a hang, so give it room rather than thinning the loop.
  it('renders a page for every build', () => {
    for (const build of BUILDS) {
      const { unmount } = renderProject(build.slug)
      expect(screen.getByTestId('project-page')).toBeInTheDocument()
      unmount()
    }
  }, 20_000)

  it('shows the three case study sections', () => {
    renderProject(own.slug)
    expect(screen.getByText(/the challenge/i)).toBeInTheDocument()
    expect(screen.getByText(/the outcome/i)).toBeInTheDocument()
    expect(screen.getByText(own.challenge)).toBeInTheDocument()
  })

  it('numbers the case study', () => {
    renderProject(BUILDS[0].slug)
    expect(screen.getByText(/case study n\. 01/i)).toBeInTheDocument()
  })

  // Spec §2. Seven of these sites were not built here. The page must say which
  // is which in words, not leave it to be inferred from context.
  it('labels our own builds as built here, and says they are not client work', () => {
    renderProject(own.slug)
    expect(screen.getByText(/built here/i)).toBeInTheDocument()
    expect(screen.getByText(/not commissioned by a client/i)).toBeInTheDocument()
  })

  it('labels other people’s sites as reference, and says plainly they are not ours', () => {
    renderProject(notOwn.slug)
    expect(screen.getByText(/reference/i)).toBeInTheDocument()
    expect(screen.getByText(/not our work/i)).toBeInTheDocument()
  })

  it('never calls someone else’s site our approach', () => {
    renderProject(notOwn.slug)
    expect(screen.queryByText(/our approach/i)).not.toBeInTheDocument()
  })

  // Commissioned work is still "built here", but the default sentence denies it
  // was commissioned — so a build carrying `provenance` must show its own words
  // and never the default's.
  it('lets a build override the provenance sentence without losing the chip', () => {
    renderProject(overridden.slug)
    expect(screen.getByText(/built here/i)).toBeInTheDocument()
    expect(screen.getByText(overridden.provenance)).toBeInTheDocument()
    expect(screen.queryByText(/not commissioned by a client/i)).not.toBeInTheDocument()
  })

  it('links to the live site when there is one', () => {
    renderProject(own.slug)
    const link = screen.getByRole('link', { name: /visit the live site/i })
    expect(link).toHaveAttribute('href', own.url)
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  // Aurora was the only build without a url and it has one now, so there may be
  // nothing to exercise. The `build.url &&` guard is still live code and the
  // next in-progress build will land on it, so this stays and stands down
  // rather than being deleted and rediscovered the hard way.
  it.skipIf(!unlinked)('renders no Visit link at all when a build has no live site', () => {
    renderProject(unlinked.slug)
    expect(screen.queryByRole('link', { name: /visit the live site/i })).not.toBeInTheDocument()
  })

  it('offers a link onward to the next project', () => {
    renderProject(BUILDS[0].slug)
    expect(screen.getByRole('link', { name: new RegExp(BUILDS[1].name, 'i') })).toHaveAttribute(
      'href',
      `/portfolio/${BUILDS[1].slug}`,
    )
  })

  it('redirects an unknown slug back to the portfolio', () => {
    renderProject('not-a-real-project')
    expect(screen.getByTestId('portfolio-page')).toBeInTheDocument()
  })
})

// The page builds screenshot paths by convention (/builds/shots/<slug>-N.jpg).
// Nothing else ties those filenames to the files on disk, so a slug rename or a
// change of extension would silently fall back to the hero image on every
// project at once — which looks fine and is completely wrong.
describe('screenshot convention', () => {
  it('matches the files actually on disk', async () => {
    const { readdirSync } = await import('node:fs')
    const { resolve } = await import('node:path')
    const dir = resolve(__dirname, '../../public/builds/shots')
    const onDisk = new Set(readdirSync(dir))

    const slugsWithShots = new Set(
      [...onDisk].map((f) => f.replace(/-\d\.jpg$/, '')).filter((s) => s !== ''),
    )

    // Every shot on disk must belong to a real build.
    const known = new Set(BUILDS.map((b) => b.slug))
    for (const slug of slugsWithShots) {
      expect(known).toContain(slug)
    }

    // And the shots must be named exactly how the page asks for them.
    for (const slug of slugsWithShots) {
      expect(onDisk).toContain(`${slug}-1.jpg`)
    }

    expect(slugsWithShots.size).toBeGreaterThan(0)
  })
})
