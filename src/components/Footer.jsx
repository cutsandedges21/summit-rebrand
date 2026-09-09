import { Link } from 'react-router-dom'

const EMAIL = 'mossimo.studios@gmail.com'

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-rule px-6 py-8 md:px-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <Link to="/" aria-label="mossimo Studios, home">
          <img src="/brand/logo-wordmark.png" alt="mossimo Studios" className="h-7 w-auto mix-blend-multiply" />
        </Link>
        <p className="font-sans text-[11px] text-ink-muted">
          Based in Montreal. Working across Canada.
        </p>
        <a href={`mailto:${EMAIL}`} className="font-sans text-[11px] text-ink-muted underline">
          {EMAIL}
        </a>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <span className="font-sans text-[11px] text-ink-faint">
          © {new Date().getFullYear()} mossimo Studios
        </span>
        <nav className="flex gap-5 font-sans text-[11px] text-ink-muted">
          {/* FAQ is not in the main nav — five items is already tight at 375px —
              so without this it is reachable from exactly one link on the
              Contact page. It answers the questions that decide the sale: who
              actually builds it, do I own it, what if I want to leave. */}
          <Link to="/faq">Questions</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  )
}
