import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Routes } from '../../src/App.jsx'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes />
    </MemoryRouter>,
  )
}

describe('routing', () => {
  const pages = [
    ['/', 'home-page'],
    ['/portfolio', 'portfolio-page'],
    ['/portfolio/halcyon', 'project-page'],
    ['/services', 'services-page'],
    ['/pricing', 'pricing-page'],
    ['/about', 'about-page'],
    ['/faq', 'faq-page'],
    ['/contact', 'contact-page'],
    ['/privacy-policy', 'privacy-page'],
    ['/terms-of-service', 'terms-page'],
  ]

  for (const [path, testId] of pages) {
    it(`renders ${path}`, () => {
      renderAt(path)
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    })
  }

  it('redirects /work to /portfolio', () => {
    renderAt('/work')
    expect(screen.getByTestId('portfolio-page')).toBeInTheDocument()
  })

  it('redirects /inspiration to /work', () => {
    renderAt('/inspiration')
    expect(screen.getByTestId('portfolio-page')).toBeInTheDocument()
  })
})
