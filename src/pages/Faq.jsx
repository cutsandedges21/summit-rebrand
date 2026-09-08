import { FAQS } from '../lib/faq.js'

export default function Faq() {
  return (
    <div data-testid="faq-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">Before you ask</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Questions.
      </h1>
      <dl className="mt-14 max-w-2xl">
        {FAQS.map((f) => (
          <div key={f.q} className="border-t border-rule py-6">
            <dt
              className="font-display leading-tight tracking-tight"
              style={{ fontSize: 'var(--text-sub)' }}
            >
              {f.q}
            </dt>
            <dd className="mt-3 font-sans leading-relaxed text-ink-muted">{f.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
