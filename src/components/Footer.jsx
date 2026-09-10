import { Link } from 'react-router-dom'
import Reveal, { RevealItem } from './Reveal.jsx'
import GradientFooter from './GradientFooter.jsx'
import Textify from '../lib/textify.jsx'
import { SERVICES } from '../lib/services.js'

const EMAIL = 'mossimo.studios@gmail.com'

const COLUMNS = [
  {
    label: 'What we do',
    to: '/services',
    items: SERVICES.map((s) => ({ label: s.title, to: '/services' })),
  },
  {
    label: 'Start here',
    items: [
      { label: 'The work', to: '/portfolio' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Questions', to: '/faq' },
      { label: 'About', to: '/about' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' },
    ],
  },
]

/**
 * The footer is the call to action, not a sitemap with an email buried in it.
 * Taken from evacoste.com, where the last thing on every page is a large italic
 * invitation and then the address set bigger than anything else on the screen.
 *
 * Two details from that reference are load-bearing:
 *
 *   - The email is the largest element here and it is set in the SANS, not the
 *     display face. Against a page of serif it stops being decoration and reads
 *     as the thing you are meant to act on.
 *   - The columns come after, small and quiet. They are for the person who is
 *     not ready to write yet, and they must not compete with the address.
 *
 * It sits on every route, so the copy is the contact moment rather than another
 * pitch — the homepage already closes with one of those directly above.
 */
export default function Footer() {
  return (
    // GradientFooter renders the <footer> itself and reserves the room the
    // pinned glow lands in; everything below is its content.
    <GradientFooter className="mt-32 border-t border-rule px-6 pt-20 pb-8 md:px-12">
      <Textify
        as="p"
        preset="riseLines"
        amount={0.3}
        className="max-w-3xl font-display italic leading-[1.15] tracking-tight"
        style={{ fontSize: 'var(--text-sub)' }}
      >
        No form to fill in first. Reach us at
      </Textify>

      <Reveal variant="up" delay={0.12} amount={0.3} className="mt-4">
        <a
          href={`mailto:${EMAIL}`}
          className="group inline-block font-sans font-semibold tracking-tight"
          // Not --text-section. That floors at 32px, and 25 characters of email
          // at 32px is 71px wider than a 375px viewport — it was the one thing
          // on the site pushing a horizontal scrollbar. This clamp is derived
          // from the address itself: it has to fit 375px minus the page gutter.
          style={{
            fontSize: 'clamp(20px, 5.4vw, 64px)',
            lineHeight: 1.05,
            overflowWrap: 'anywhere',
          }}
        >
          <span className="relative">
            {EMAIL}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
            />
          </span>
        </a>
      </Reveal>

      <Reveal
        variant="fade"
        stagger={0.08}
        amount={0.25}
        className="mt-24 grid gap-10 md:grid-cols-4"
      >
        {COLUMNS.map((col) => (
          <RevealItem key={col.label}>
            <p className="label mb-4">{col.label}</p>
            <ul className="flex flex-col gap-2">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group relative font-sans text-[13px] text-ink-muted transition-colors duration-300 hover:text-ink"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}

        <RevealItem>
          <Link to="/" aria-label="mossimo Studios, home" className="group inline-block">
            <img
              src="/brand/logo-wordmark.png"
              alt="mossimo Studios"
              className="h-7 w-auto mix-blend-multiply transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:-rotate-2 group-hover:scale-105 motion-reduce:transition-none"
            />
          </Link>
          <p className="mt-4 font-sans text-[13px] leading-relaxed text-ink-muted">
            Based in Montreal.
            <br />
            Working across Canada.
          </p>
        </RevealItem>
      </Reveal>

      {/* Copyright only. The address already appears above at section-heading
          size; repeating it small here both weakened it and gave two links the
          same accessible name, so getByRole could no longer tell them apart. */}
      <div className="mt-16 border-t border-rule pt-4">
        <span className="font-sans text-[11px] text-ink-faint">
          © {new Date().getFullYear()} mossimo Studios
        </span>
      </div>
    </GradientFooter>
  )
}
