import { Link } from 'react-router-dom'
import ArcHero from '../components/ArcHero.jsx'
import WorkList from '../components/WorkList.jsx'
import PinnedProcess from '../components/PinnedProcess.jsx'
import { BUILDS } from '../lib/builds.js'
import { PLANS } from '../lib/plans.js'

export default function Home() {
  return (
    <div data-testid="home-page">
      <ArcHero />
      <WorkList builds={BUILDS} limit={5} />

      <div className="px-6 md:px-12">
        <Link to="/work" className="label underline">
          All fourteen builds →
        </Link>
      </div>

      <PinnedProcess />

      {/* The one tonal shift on the page. paper-clay is a deeper tint of the same
          warmth, not a dark section — the site has none. */}
      <section className="bg-paper-clay px-6 py-20 md:px-12">
        <p className="label mb-4">Pricing</p>
        <h2
          className="mb-10 font-display leading-tight tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Three ways to work together
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className="border-t border-ink pt-3">
              {/* The featured plan is marked with an accent fill, never accent
                  text — at 1.1:1 on paper the colour is invisible as a letter.
                  Both branches carry identical box metrics so the three prices
                  sit on one line; only the background differs. Without the
                  matching padding the featured column's price dropped ~6px. */}
              <p
                className={`mb-2 inline-block px-2 py-0.5 font-sans text-[11px] font-semibold ${
                  plan.featured ? 'bg-accent' : '-ml-2'
                }`}
              >
                {plan.name}
              </p>
              <p className="font-display leading-none" style={{ fontSize: 'var(--text-sub)' }}>
                {plan.price}
                <span className="ml-1 font-sans text-[12px] text-ink-muted">/mo</span>
              </p>
              <p className="mt-2 font-sans text-[12px] text-ink-muted">
                {plan.setup} to build. {plan.tagline}.
              </p>
            </div>
          ))}
        </div>
        <Link
          to="/pricing"
          className="mt-10 inline-block bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
        >
          Full pricing
        </Link>
      </section>
    </div>
  )
}
