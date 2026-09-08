import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Project from '../../src/pages/Project.jsx'
import Portfolio from '../../src/pages/Portfolio.jsx'
import { BUILDS } from '../../src/lib/builds.js'

function renderProject(slug) {
  return render(
    <MemoryRouter initialEntries={[`/portfolio/${slug}`]}>
      <Routes>
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<Project />} />
      </Routes>
    </MemoryRouter>,
  )
}

const own = BUILDS.find((b) => b.own)
const notOwn = BUILDS.find((b) => !b.own)

describe('project case study', () => {
  it('renders a page for every build', () => {
    for (const build of BUILDS) {
      const { unmount } = renderProject(build.slug)
      expect(screen.getByTestId('project-page')).toBeInTheDocument()
      unmount()
    }
  })

  it('shows the three case study sections', () => {
    renderProject(own.slug)
    expect(screen.getByText(/the challenge/i)).toBeInTheDocument()
    expect(screen.getByText(/the outcome/i)).toBeInTheDocument()
    expect(screen.getByText(own.challenge)).toBeInTheDocument()
  })

  it('numbers the case study', () => {
    renderProject(BUILDS[0].slug)
    expect(screen.getByText(/case study n\. 01/i)).toBeInTheDocument()
  })

  // Spec §2. Seven of these sites were not built here. The page must say which
  // is which in words, not leave it to be inferred from context.
  it('labels our own builds as built here, and says they are not client work', () => {
    renderProject(own.slug)
    expect(screen.getByText(/built here/i)).toBeInTheDocument()
    expect(screen.getByText(/not commissioned by a client/i)).toBeInTheDocument()
  })

  it('labels other people’s sites as reference, and says plainly they are not ours', () => {
    renderProject(notOwn.slug)
    expect(screen.getByText(/reference/i)).toBeInTheDocument()
    expect(screen.getByText(/not our work/i)).toBeInTheDocument()
  })

  it('never calls someone else’s site our approach', () => {
    renderProject(notOwn.slug)
    expect(screen.queryByText(/our approach/i)).not.toBeInTheDocument()
  })

  it('links to the live site when there is one', () => {
    renderProject(own.slug)
    const link = screen.getByRole('link', { name: /visit the live site/i })
    expect(link).toHaveAttribute('href', own.url)
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('offers a link onward to the next project', () => {
    renderProject(BUILDS[0].slug)
    expect(screen.getByRole('link', { name: new RegExp(BUILDS[1].name, 'i') })).toHaveAttribute(
      'href',
      `/portfolio/${BUILDS[1].slug}`,
    )
  })

  it('redirects an unknown slug back to the portfolio', () => {
    renderProject('not-a-real-project')
    expect(screen.getByTestId('portfolio-page')).toBeInTheDocument()
  })
})
