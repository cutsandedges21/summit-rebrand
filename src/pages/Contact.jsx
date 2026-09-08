import { Link } from 'react-router-dom'

const EMAIL = 'mossimo.studios@gmail.com'

const LINKS = [
  { to: '/portfolio', label: 'See the work', note: 'Case studies for every project' },
  { to: '/pricing', label: 'View pricing', note: 'Plans and what is included' },
  { to: '/faq', label: 'Common questions', note: 'Answers before you ask' },
]

export default function Contact() {
  return (
    <div data-testid="contact-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">Get in touch</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Let's build something.
      </h1>
      <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
        Tell us about your business — no commitment, no pressure. We reply within 24 hours.
      </p>

      <div className="mt-14 max-w-2xl border-t border-ink pt-6">
        <p className="label mb-3">Email us</p>
        <a
          href={`mailto:${EMAIL}`}
          className="font-display leading-none underline decoration-accent decoration-4 underline-offset-8"
          style={{ fontSize: 'var(--text-sub)' }}
        >
          {EMAIL}
        </a>
        <p className="mt-6 font-sans leading-relaxed text-ink-muted">
          Include your business name and a few lines about what you need. The more you share,
          the sharper our first reply.
        </p>
      </div>

      <div className="mt-16 max-w-2xl border-t border-rule pt-6">
        <p className="label mb-4">Before you write</p>
        {LINKS.map(({ to, label, note }) => (
          <Link
            key={to}
            to={to}
            className="flex items-baseline justify-between gap-6 border-b border-rule py-4"
          >
            <span className="font-sans text-[15px] font-medium">{label}</span>
            <span className="font-sans text-[12px] text-ink-muted">{note} →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
