import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../src/lib/motion.js', () => ({
  useReducedMotion: vi.fn(() => false),
  useIsMobile: vi.fn(() => false),
}))

import Hero from '../../src/components/Hero.jsx'
import { BUILDS } from '../../src/lib/builds.js'
import { useReducedMotion, useIsMobile } from '../../src/lib/motion.js'

// ImageStreamHero's default density. Deliberately NOT derived from the number
// of builds or from Hero's image list: `cards` is how many slots ride each rail
// at once, and the rails cycle a shorter pool with `images[i % images.length]`.
// The hero shows a curated five, which repeat rather than leaving gaps.
const CARDS_PER_RAIL = 9
const RAILS = 2

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>,
  )

describe('Hero', () => {
  beforeEach(() => {
    useReducedMotion.mockReturnValue(false)
    useIsMobile.mockReturnValue(false)
  })

  it('renders the headline', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /businesses that answer the phone/i,
    )
  })

  it('fills both rails of the corridor', () => {
    renderHero()
    expect(screen.getAllByTestId('stream-card')).toHaveLength(CARDS_PER_RAIL * RAILS)
  })

  // Card art is the pre-cropped derivative, not the build hero: covering an
  // 18:25 card with a 16:10 capture downloads 1.4 MB above the fold and crops
  // most of it away. Each src must still resolve to a real build.
  it('shows real build screenshots rather than placeholders', () => {
    renderHero()
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

  // The corridor is decorative; the same builds are named and linked in the
  // work list below it. Announcing eighteen unlabelled frames on the way to the
  // first heading is noise, so the whole stage is hidden.
  it('hides the decorative corridor from assistive technology', () => {
    renderHero()
    expect(screen.getByTestId('stream-stage')).toHaveAttribute('aria-hidden', 'true')
  })

  // Every length in the corridor is a share of the container's width, so unlike
  // the fourteen-tile arc it replaced there is no mobile geometry to collapse
  // to — the same markup holds its proportions at any size.
  it('does not branch on viewport width', () => {
    renderHero()
    const desktop = screen.getAllByTestId('stream-card').length

    useIsMobile.mockReturnValue(true)
    renderHero()
    expect(screen.getAllByTestId('stream-card')).toHaveLength(desktop * 2)
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
