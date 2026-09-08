export default function About() {
  return (
    <div data-testid="about-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">Who you are hiring</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Small studio. Montreal.
      </h1>
      <div className="mt-8 max-w-xl font-sans leading-relaxed text-ink-muted">
        <p>
          We design and build websites for local businesses — from Montreal, for clients
          across Canada. The person you email is the person who builds the site, and the
          person who fixes it when something breaks at nine at night.
        </p>
        <p className="mt-4">
          There is no account manager, no offshore team, and nobody who will forward your
          message on and then go quiet. That is the whole pitch, and it is the reason the
          studio carries a name instead of an acronym.
        </p>
        <p className="mt-4">
          Most of what we build is for businesses where the website has one job — get someone
          to call, book, or walk in. We care far more about whether that happens than about
          whether the site wins an award.
        </p>
      </div>
    </div>
  )
}
