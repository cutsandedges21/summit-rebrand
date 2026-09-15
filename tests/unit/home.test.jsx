import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../../src/pages/Home.jsx'

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )

describe('home page', () => {
  it('leads with the arc hero', () => {
    renderHome()
    expect(screen.getByTestId('hero-stage')).toBeInTheDocument()
  })

  it('previews five builds, not all fourteen', () => {
    renderHome()
    expect(screen.getAllByTestId('work-row')).toHaveLength(5)
  })

  it('includes the pinned process section', () => {
    renderHome()
    expect(screen.getByTestId('process-pin')).toBeInTheDocument()
  })

  // Both figures are owner-supplied and quoted on two pages, so they are pinned
  // here rather than left to whichever one someone edits last.
  it('shows the track record: years and clients', () => {
    const { container } = renderHome()
    expect(screen.getByTestId('track-record')).toBeInTheDocument()
    expect(container.textContent).toMatch(/6\+/)
    expect(container.textContent).toMatch(/70\+/)
  })

  it('previews pricing without discount language', () => {
    const { container } = renderHome()
    expect(container.textContent).toMatch(/\$108/)
    expect(container.textContent).not.toMatch(/sale|was previously|save \$/i)
  })

  it('exposes exactly one h1', () => {
    renderHome()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})
