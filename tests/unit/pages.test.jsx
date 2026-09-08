import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Portfolio from '../../src/pages/Portfolio.jsx'
import Services from '../../src/pages/Services.jsx'
import Pricing from '../../src/pages/Pricing.jsx'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('portfolio page', () => {
  it('shows all fourteen builds with the filter', () => {
    wrap(<Portfolio />)
    expect(screen.getAllByTestId('work-row')).toHaveLength(14)
    expect(screen.getByTestId('work-filter')).toBeInTheDocument()
  })

  // The index sells; it does not disclaim. Provenance is stated per case study
  // instead, and tests/unit/project.test.jsx asserts that a site we did not
  // build can never be labelled as our work. Two rules keep this honest:
  it('does not imply the whole set is client work', () => {
    const { container } = wrap(<Portfolio />)
    expect(container.textContent).not.toMatch(/our clients|client list/i)
  })

  it('does not claim a headcount or a team size', () => {
    const { container } = wrap(<Portfolio />)
    expect(container.textContent).not.toMatch(/our team|staff|\d+\s+designers?/i)
  })
})

describe('services page', () => {
  it('lists four services with their inclusions', () => {
    wrap(<Services />)
    expect(screen.getAllByTestId('service-block')).toHaveLength(4)
    expect(screen.getByText('Local SEO')).toBeInTheDocument()
  })
})

describe('pricing page', () => {
  it('shows three plans, add-ons and the bundle', () => {
    wrap(<Pricing />)
    expect(screen.getAllByTestId('plan-block')).toHaveLength(3)
    expect(screen.getByText(/care\+/i)).toBeInTheDocument()
  })

  it('carries no discount language', () => {
    const { container } = wrap(<Pricing />)
    expect(container.textContent).not.toMatch(/sale|was previously|\/day|save \$/i)
  })
})
