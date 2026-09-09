import { FAQS } from '../lib/faq.js'
import PageHeader from '../components/PageHeader.jsx'
import Reveal, { RevealItem } from '../components/Reveal.jsx'
import { useBackdrop } from '../components/Backdrop.jsx'

export default function Faq() {
  const list = useBackdrop('clay')

  return (
    <div data-testid="faq-page" className="px-6 py-16 md:px-12">
      <PageHeader label="Before you ask" heading="Questions." />

      <div ref={list}>
        <Reveal as="dl" variant="fade" stagger={0.08} amount={0.1} className="mt-14 max-w-2xl">
          {FAQS.map((f) => (
            <RevealItem key={f.q} className="border-t border-rule py-6">
              {/* Question and answer both stay single text nodes: they are the
                  page's content, and a definition list read aloud one character
                  span at a time is worse than no animation at all. */}
              <dt
                className="font-display leading-tight tracking-tight"
                style={{ fontSize: 'var(--text-sub)' }}
              >
                {f.q}
              </dt>
              <dd className="mt-3 font-sans leading-relaxed text-ink-muted">{f.a}</dd>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </div>
  )
}
