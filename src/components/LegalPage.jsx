export default function LegalPage({ testId, title, sections }) {
  return (
    <div data-testid={testId} className="px-6 py-16 md:px-12">
      <p className="label mb-4">Legal</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        {title}
      </h1>
      <div className="mt-14 max-w-2xl">
        {sections.map((section) => (
          <section key={section.h} className="border-t border-rule py-7">
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
          </section>
        ))}
      </div>
    </div>
  )
}
