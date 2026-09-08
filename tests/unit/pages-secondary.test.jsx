import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from '../../src/pages/About.jsx'
import Faq from '../../src/pages/Faq.jsx'
import Contact from '../../src/pages/Contact.jsx'
import PrivacyPolicy from '../../src/pages/PrivacyPolicy.jsx'
import TermsOfService from '../../src/pages/TermsOfService.jsx'
import { FAQS } from '../../src/lib/faq.js'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('about page', () => {
  // The heading stopped naming the owner when the site moved to the plural
  // voice: "Hi - I'm Mossimo" became "Small studio. Montreal." The page still
  // has to establish who and where at a glance, so that is what is asserted.
  it('leads with what the studio is and where it is', () => {
    wrap(<About />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/studio/i)
  })

  it('states the location', () => {
    const { container } = wrap(<About />)
    expect(container.textContent).toMatch(/montreal/i)
  })

  it('makes the no-handoff promise, which is the whole pitch', () => {
    const { container } = wrap(<About />)
    expect(container.textContent).toMatch(/no account manager/i)
  })

  it('claims no headcount', () => {
    const { container } = wrap(<About />)
    expect(container.textContent).not.toMatch(/\bour team\b|\d+\s+(people|designers|developers)\b/i)
  })
})

describe('faq page', () => {
  it('renders every question', () => {
    wrap(<Faq />)
    for (const f of FAQS) {
      expect(screen.getByText(f.q)).toBeInTheDocument()
    }
  })
})

describe('contact page', () => {
  it('offers the email as a mailto link', () => {
    wrap(<Contact />)
    expect(screen.getByRole('link', { name: /gmail\.com/ })).toHaveAttribute(
      'href',
      'mailto:mossimo.studios@gmail.com',
    )
  })
})

describe('legal pages', () => {
  // The ported copy says "the date above reflects the most recent revision" and
  // "contact us using the details below". Only the SECTIONS arrays came across
  // from the old site, so both sentences pointed at nothing until the shell
  // supplied them. A legal document citing a date it does not show is a defect,
  // not a cosmetic gap.
  it('shows the effective date its own copy refers to', () => {
    for (const Page of [PrivacyPolicy, TermsOfService]) {
      const { unmount } = wrap(<Page />)
      expect(screen.getByTestId('legal-effective-date')).toHaveTextContent(/effective \w+/i)
      unmount()
    }
  })

  it('shows the contact details its own copy refers to', () => {
    for (const Page of [PrivacyPolicy, TermsOfService]) {
      const { unmount } = wrap(<Page />)
      expect(screen.getByTestId('legal-contact')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /gmail\.com/ })).toHaveAttribute(
        'href',
        'mailto:mossimo.studios@gmail.com',
      )
      unmount()
    }
  })

  // "Summit Sites Agency" -> a literal swap produced "mossimo Agency", an entity
  // name that appears nowhere else on the site.
  it('names one consistent entity', () => {
    for (const Page of [PrivacyPolicy, TermsOfService]) {
      const { container, unmount } = wrap(<Page />)
      expect(container.textContent).not.toMatch(/mossimo Agency/i)
      unmount()
    }
  })

  it('never mention the retired brand', () => {
    for (const Page of [PrivacyPolicy, TermsOfService]) {
      const { container, unmount } = wrap(<Page />)
      expect(container.textContent).not.toMatch(/summit sites/i)
      unmount()
    }
  })
})
