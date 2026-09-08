import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Nav from '../../src/components/Nav.jsx'
import Footer from '../../src/components/Footer.jsx'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('nav', () => {
  it('shows the wordmark logo', () => {
    wrap(<Nav />)
    const mark = screen.getByAltText('mossimo Studios')
    expect(mark).toBeInTheDocument()
    expect(mark).toHaveAttribute('src', '/brand/logo-wordmark.png')
  })

  it('links to every primary page', () => {
    wrap(<Nav />)
    for (const label of ['Work', 'Services', 'Pricing', 'About', 'Contact']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('never says Summit Sites', () => {
    const { container } = wrap(<Nav />)
    expect(container.textContent).not.toMatch(/summit/i)
  })
})

describe('footer', () => {
  it('states the location from the spec', () => {
    wrap(<Footer />)
    expect(screen.getByText(/montreal/i)).toBeInTheDocument()
    expect(screen.getByText(/canada/i)).toBeInTheDocument()
  })

  it('links the contact email as a mailto', () => {
    wrap(<Footer />)
    const link = screen.getByRole('link', { name: /mossimo\.studios@gmail\.com/ })
    expect(link).toHaveAttribute('href', 'mailto:mossimo.studios@gmail.com')
  })

  it('never shows the retired brand name', () => {
    const { container } = wrap(<Footer />)
    expect(container.textContent).not.toMatch(/summit/i)
  })

  it('does not use the retired tagline', () => {
    const { container } = wrap(<Footer />)
    expect(container.textContent).not.toMatch(/your business, elevated/i)
  })
})
