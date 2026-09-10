import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../src/lib/motion.js', () => ({
  useReducedMotion: vi.fn(() => false),
  useIsMobile: vi.fn(() => false),
}))

import NotFound from '../../src/pages/NotFound.jsx'

const renderPage = () =>
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  )

describe('NotFound', () => {
  it('shows the number', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404')
  })

  it('puts the wordmark under the number', () => {
    renderPage()
    const heading = screen.getByRole('heading', { level: 1 })
    const mark = screen.getByTestId('not-found-page').querySelector('img')
    expect(mark).toBeInTheDocument()
    // Later in document order, which in a centred column is below it.
    expect(heading.compareDocumentPosition(mark)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  // A bare number and a picture announce as "four hundred and four" and then
  // nothing at all, so the heading carries its own name.
  it('gives the heading a readable name', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(
      /404 — page not found/i,
    )
  })

  it('hides the decorative wordmark from assistive technology', () => {
    renderPage()
    const mark = screen.getByTestId('not-found-page').querySelector('img')
    expect(mark).toHaveAttribute('aria-hidden', 'true')
    expect(mark).toHaveAttribute('alt', '')
  })

  // A 404 with no way out is the actual failure. Both routes here are ones the
  // visitor plausibly wanted.
  it('offers a way back', () => {
    renderPage()
    expect(screen.getByRole('link', { name: /back to the homepage/i })).toHaveAttribute(
      'href',
      '/',
    )
    expect(screen.getByRole('link', { name: /see the work/i })).toHaveAttribute(
      'href',
      '/portfolio',
    )
  })

  it('explains what happened in words, not just a number', () => {
    renderPage()
    expect(screen.getByText(/this page went missing/i)).toBeInTheDocument()
  })
})
