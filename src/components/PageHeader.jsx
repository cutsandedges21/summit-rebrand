import Textify from '../lib/textify.jsx'
import Reveal from './Reveal.jsx'

/**
 * The masthead every secondary page opens with: eyebrow, display heading,
 * standfirst. Shared so all seven arrive on the same beat — the heading splits
 * and rises per authored line, the label and the standfirst follow it up.
 *
 * The heading is the only part that splits. Everything else keeps its single
 * text node, which is how the tests and a screen reader both find it.
 */
export default function PageHeader({ label, heading, intro, className = '', children }) {
  return (
    <header className={className}>
      {label && (
        <Reveal as="p" variant="up" duration={0.7} className="label mb-4">
          {label}
        </Reveal>
      )}

      <Textify
        as="h1"
        preset="riseLines"
        delay={0.08}
        amount={0.25}
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        {heading}
      </Textify>

      {intro && (
        <Reveal
          as="p"
          variant="up"
          delay={0.2}
          className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted"
        >
          {intro}
        </Reveal>
      )}

      {children}
    </header>
  )
}
