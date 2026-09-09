import { EFFECTIVE_DATE, LEGAL_EMAIL } from '../lib/legal.js'
import PageHeader from './PageHeader.jsx'
import Reveal, { RevealItem } from './Reveal.jsx'

/**
 * Shared shell for the Privacy Policy and Terms of Service.
 *
 * The effective date and the contact block are not decoration — the ported copy
 * refers to both. "Changes take effect once posted, and the date above reflects
 * the most recent revision" needs a date above it, and "contact us using the
 * details below" needs details below it. Only the SECTIONS arrays were ported
 * from the old site, so both references dangled until these were added back.
 */
export default function LegalPage({ testId, title, sections }) {
  return (
    <div data-testid={testId} className="px-6 py-16 md:px-12">
      <PageHeader label="Legal" heading={title} />
      <Reveal
        as="p"
        variant="up"
        delay={0.16}
        data-testid="legal-effective-date"
        className="mt-5 font-sans text-[13px] text-ink-muted"
      >
        Effective {EFFECTIVE_DATE}
      </Reveal>

      <Reveal variant="fade" stagger={0.06} amount={0.1} className="mt-14 max-w-2xl">
        {sections.map((section) => (
          <RevealItem as="section" key={section.h} className="border-t border-rule py-7">
            <h2
              className="font-display leading-tight tracking-tight"
              style={{ fontSize: 'var(--text-sub)' }}
            >
              {section.h}
            </h2>
            {section.body?.map((p) => (
              <p key={p} className="mt-3 font-sans leading-relaxed text-ink-muted">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-4">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="border-t border-rule py-2 font-sans text-[13px] text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </RevealItem>
        ))}

        <RevealItem as="section" data-testid="legal-contact" className="border-t border-rule py-7">
          <h2
            className="font-display leading-tight tracking-tight"
            style={{ fontSize: 'var(--text-sub)' }}
          >
            Contact us
          </h2>
          <p className="mt-3 font-sans leading-relaxed text-ink-muted">
            Questions about this document, or a request about your information, go to{' '}
            <a href={`mailto:${LEGAL_EMAIL}`} className="underline">
              {LEGAL_EMAIL}
            </a>
            .
          </p>
        </RevealItem>
      </Reveal>
    </div>
  )
}
