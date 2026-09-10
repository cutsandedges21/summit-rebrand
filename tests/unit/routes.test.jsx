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

  // vercel.json sends every path to index.html so deep links survive a refresh,
  // which means an unknown URL lands in the router rather than on the host's
  // 404. Before the catch-all it matched nothing and rendered an empty <main>
  // under a working nav — indistinguishable from the site being broken.
  it('renders the 404 page for an unknown url', () => {
    renderAt('/no-such-page')
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })

  it('renders the 404 page for an unknown nested url', () => {
    renderAt('/services/something/deeper')
    expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
  })

  // An unknown BUILD is a stale link to real work, not a wrong address, so it
  // goes to the portfolio rather than the 404.
  it('sends an unknown build back to the portfolio, not to the 404', () => {
    renderAt('/portfolio/not-a-build')
    expect(screen.getByTestId('portfolio-page')).toBeInTheDocument()
    expect(screen.queryByTestId('not-found-page')).not.toBeInTheDocument()
  })
})
