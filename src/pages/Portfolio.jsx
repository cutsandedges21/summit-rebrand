import WorkList from '../components/WorkList.jsx'
import { BUILDS } from '../lib/builds.js'

export default function Portfolio() {
  return (
    <div data-testid="portfolio-page">
      <header className="px-6 pt-16 md:px-12">
        <p className="label mb-4">Portfolio</p>
        <h1
          className="font-display leading-[1.04] tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Sites built to be <em>used</em>,<br />
          not admired.
        </h1>
        {/* Sells at a glance; it does not disclaim. Provenance is stated on each
            case study instead — "Built here" or "Reference" — which is where a
            visitor who actually cares will look, and where being straight about
            it costs nothing. */}
        <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
          Hotels, restaurants, clinics, dealerships, product brands. Every one built around a
          single job — book a room, reserve a table, get a quote, place an order — and judged
          on whether that actually happens.
        </p>
      </header>
      <WorkList builds={BUILDS} label={null} />
    </div>
  )
}
