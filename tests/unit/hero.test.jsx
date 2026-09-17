import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../src/lib/motion.js', () => ({
  useReducedMotion: vi.fn(() => false),
  useIsMobile: vi.fn(() => false),
}))

import Hero from '../../src/components/Hero.jsx'
import ImageStreamHero from '../../src/components/ImageStreamHero.jsx'
import { BUILDS } from '../../src/lib/builds.js'
import { useReducedMotion, useIsMobile } from '../../src/lib/motion.js'

// ImageStreamHero's default density. Deliberately NOT derived from the number
// of builds or from a caller's image list: `cards` is how many slots ride each
// rail at once, and the rails cycle a shorter pool with `images[i % length]`.
// A short pool repeats rather than leaving gaps.
const CARDS_PER_RAIL = 9
const RAILS = 2

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>,
  )

const SAMPLE = BUILDS.slice(0, 5).map((b) => ({
  src: `/builds/stream/${b.slug}.jpg`,
  alt: b.name,
}))

describe('Hero', () => {
  beforeEach(() => {
    useReducedMotion.mockReturnValue(false)
    useIsMobile.mockReturnValue(false)
  })

  it('renders the headline', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /businesses that refuse to blend in/i,
    )
  })

  // Parked on 2026-09-15: the moving screenshots read as distraction behind the
  // headline. The corridor code stays, and stays covered by the suite below, so
  // flipping SHOW_STREAM back on in Hero.jsx cannot quietly ship something rotten.
  it('does not run the corridor behind the headline', () => {
    renderHero()
    expect(screen.queryByTestId('stream-stage')).not.toBeInTheDocument()
    expect(screen.queryAllByTestId('stream-card')).toHaveLength(0)
  })

  it('still renders the hero stage itself', () => {
    renderHero()
    expect(screen.getByTestId('hero-stage')).toBeInTheDocument()
  })

  it('reports itself static when reduced motion is requested', () => {
    useReducedMotion.mockReturnValue(true)
    renderHero()
    expect(screen.getByTestId('hero-stage')).toHaveAttribute('data-static', 'true')
  })

  it('reports itself animated when motion is allowed', () => {
    renderHero()
    expect(screen.getByTestId('hero-stage')).toHaveAttribute('data-static', 'false')
  })

  it('routes the call to action without a full page reload', () => {
    renderHero()
    expect(screen.getByRole('link', { name: /see the work/i })).toHaveAttribute('href', '/portfolio')
  })
})

// The corridor is switched off in the hero but not deleted, so it is exercised
// here directly. Without this the component would be untested dead weight and
// would rot silently until someone turned it back on.
describe('ImageStreamHero corridor', () => {
  it('fills both rails', () => {
    render(<ImageStreamHero images={SAMPLE} />)
    expect(screen.getAllByTestId('stream-card')).toHaveLength(CARDS_PER_RAIL * RAILS)
  })

  // Card art is the pre-cropped derivative, not the build hero: covering an
  // 18:25 card with a 16:10 capture downloads 1.4 MB above the fold and crops
  // most of it away. Each src must still resolve to a real build.
  it('shows real build screenshots rather than placeholders', () => {
    render(<ImageStreamHero images={SAMPLE} />)
    const sources = screen
      .getAllByTestId('stream-card')
      .map((card) => card.querySelector('img')?.getAttribute('src'))

    expect(sources.every(Boolean)).toBe(true)
    for (const src of sources) {
      expect(src).toMatch(/^\/builds\/stream\/[a-z0-9-]+\.jpg$/)
      const slug = src.replace('/builds/stream/', '').replace('.jpg', '')
      expect(BUILDS.some((build) => build.slug === slug)).toBe(true)
    }
  })

  // The corridor is decorative; wherever it runs, the same builds are named and
  // linked in the work list below it. Announcing eighteen unlabelled frames on
  // the way to the first heading is noise, so the whole stage is hidden.
  it('hides itself from assistive technology', () => {
    render(<ImageStreamHero images={SAMPLE} />)
    expect(screen.getByTestId('stream-stage')).toHaveAttribute('aria-hidden', 'true')
  })

  // Every length is a share of the container's width, so unlike the fourteen-tile
  // arc it replaced there is no mobile geometry to collapse to — the same markup
  // holds its proportions at any size.
  it('does not branch on viewport width', () => {
    render(<ImageStreamHero images={SAMPLE} />)
    const desktop = screen.getAllByTestId('stream-card').length

    useIsMobile.mockReturnValue(true)
    render(<ImageStreamHero images={SAMPLE} />)
    expect(screen.getAllByTestId('stream-card')).toHaveLength(desktop * 2)
  })

  it('renders children whether the corridor is on or off', () => {
    const { unmount } = render(<ImageStreamHero images={SAMPLE}>content</ImageStreamHero>)
    expect(screen.getByText('content')).toBeInTheDocument()
    unmount()

    render(
      <ImageStreamHero images={SAMPLE} stream={false}>
        content
      </ImageStreamHero>,
    )
    expect(screen.getByText('content')).toBeInTheDocument()
    expect(screen.queryByTestId('stream-stage')).not.toBeInTheDocument()
  })
})
