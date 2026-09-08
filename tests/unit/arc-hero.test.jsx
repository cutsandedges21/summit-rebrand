import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../src/lib/motion.js', () => ({
  useReducedMotion: vi.fn(() => false),
  useIsMobile: vi.fn(() => false),
}))

import ArcHero from '../../src/components/ArcHero.jsx'
import { useReducedMotion, useIsMobile } from '../../src/lib/motion.js'

const renderHero = () =>
  render(
    <MemoryRouter>
      <ArcHero />
    </MemoryRouter>,
  )

describe('ArcHero', () => {
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

  it('renders one tile per build', () => {
    renderHero()
    expect(screen.getAllByTestId('arc-tile')).toHaveLength(14)
  })

  it('hides decorative tiles from assistive technology', () => {
    renderHero()
    for (const tile of screen.getAllByTestId('arc-tile')) {
      expect(tile).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('collapses to a static arc when reduced motion is requested', () => {
    useReducedMotion.mockReturnValue(true)
    renderHero()
    expect(screen.getByTestId('arc-stage')).toHaveAttribute('data-static', 'true')
  })

  it('animates when reduced motion is not requested', () => {
    renderHero()
    expect(screen.getByTestId('arc-stage')).toHaveAttribute('data-static', 'false')
  })

  it('collapses on mobile regardless of motion preference', () => {
    useIsMobile.mockReturnValue(true)
    renderHero()
    expect(screen.getByTestId('arc-stage')).toHaveAttribute('data-static', 'true')
  })

  it('routes the call to action without a full page reload', () => {
    renderHero()
    expect(screen.getByRole('link', { name: /see the work/i })).toHaveAttribute('href', '/work')
  })
})
