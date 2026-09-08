import WorkList from '../components/WorkList.jsx'
import { BUILDS } from '../lib/builds.js'

export default function Portfolio() {
  return (
    <div data-testid="portfolio-page">
      <header className="px-6 pt-16 md:px-12">
        <p className="label mb-4">The portfolio</p>
        <h1
          className="font-display leading-[1.04] tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Fourteen sites, seven of them ours.
        </h1>
        <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
          Seven of these we built — concept builds, made to show what we can do rather than to
          dress up a client list we do not have yet. The rest are sites we admire, studied for
          what they get right. Every case study says which is which.
        </p>
      </header>
      <WorkList builds={BUILDS} />
    </div>
  )
}
