import { Link } from 'react-router-dom'
import Reveal from './Reveal.jsx'

const EMAIL = 'mossimo.studios@gmail.com'

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-rule px-6 py-8 md:px-12">
      <Reveal
        variant="fade"
        amount={0.4}
        className="flex flex-wrap items-baseline justify-between gap-4"
      >
        <Link to="/" aria-label="mossimo Studios, home" className="group">
          <img
            src="/brand/logo-wordmark.png"
            alt="mossimo Studios"
            className="h-7 w-auto transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:-rotate-2 group-hover:scale-105 motion-reduce:transition-none"
          />
        </Link>
        <p className="font-sans text-[11px] text-ink-muted">
          Based in Montreal. Working across Canada.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="font-sans text-[11px] text-ink-muted underline decoration-transparent transition-colors duration-300 hover:text-ink hover:decoration-current"
        >
          {EMAIL}
        </a>
      </Reveal>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <span className="font-sans text-[11px] text-ink-faint">
          © {new Date().getFullYear()} mossimo Studios
        </span>
        <nav className="flex gap-5 font-sans text-[11px] text-ink-muted">
          {/* FAQ is not in the main nav — five items is already tight at 375px —
              so without this it is reachable from exactly one link on the
              Contact page. It answers the questions that decide the sale: who
              actually builds it, do I own it, what if I want to leave. */}
          {[
            { to: '/faq', label: 'Questions' },
            { to: '/privacy-policy', label: 'Privacy Policy' },
            { to: '/terms-of-service', label: 'Terms of Service' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="group relative transition-colors duration-300 hover:text-ink">
              {label}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
              />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
