import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Reveal, { RevealItem } from '../components/Reveal.jsx'
import { useBackdrop } from '../components/Backdrop.jsx'

const EMAIL = 'mossimo.studios@gmail.com'

const LINKS = [
  { to: '/portfolio', label: 'See the work', note: 'Case studies for every project' },
  { to: '/pricing', label: 'View pricing', note: 'Plans and what is included' },
  { to: '/faq', label: 'Common questions', note: 'Answers before you ask' },
]

export default function Contact() {
  // The page's colour event sits on the one thing it is asking you to do.
  const reach = useBackdrop('pink')

  return (
    <div data-testid="contact-page" className="px-6 py-16 md:px-12">
      <PageHeader
        label="Get in touch"
        heading="Let's build something."
        intro="Tell us about your business — no commitment, no pressure. We reply within 24 hours."
      />

      <div ref={reach} className="mt-14 max-w-2xl border-t border-ink py-6">
        <Reveal as="p" variant="up" duration={0.7} className="label mb-3">
          Email us
        </Reveal>
        <Reveal variant="up" delay={0.08}>
          <a
            href={`mailto:${EMAIL}`}
            className="group relative inline-block font-display leading-none"
            style={{ fontSize: 'var(--text-sub)' }}
          >
            {EMAIL}
            {/* The rule draws itself in from the left on hover rather than the
                underline simply existing. Same curve as every other sweep. */}
            <span
              aria-hidden="true"
              className="absolute -bottom-2 left-0 h-1 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
            />
          </a>
        </Reveal>
        <Reveal as="p" variant="up" delay={0.16} className="mt-6 font-sans leading-relaxed text-ink-muted">
          Include your business name and a few lines about what you need. The more you share,
          the sharper our first reply.
        </Reveal>
      </div>

      <div className="mt-16 max-w-2xl border-t border-rule pt-6">
        <Reveal as="p" variant="up" duration={0.7} className="label mb-4">
          Before you write
        </Reveal>
        <Reveal variant="fade" stagger={0.1}>
          {LINKS.map(({ to, label, note }) => (
            <RevealItem key={to}>
              <Link
                to={to}
                className="group flex items-baseline justify-between gap-6 border-b border-rule py-4"
              >
                <span className="font-sans text-[15px] font-medium transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:translate-x-1.5 motion-reduce:transition-none">
                  {label}
                </span>
                <span className="font-sans text-[12px] text-ink-muted">
                  {note}{' '}
                  <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:translate-x-1.5 motion-reduce:transition-none">
                    →
                  </span>
                </span>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </div>
  )
}
