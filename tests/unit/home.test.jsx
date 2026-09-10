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
