import { useState } from 'react'
import { CATEGORIES, filterBuilds } from '../lib/builds.js'

export default function WorkList({ builds, limit }) {
  const [category, setCategory] = useState('all')
  const [activeSlug, setActiveSlug] = useState(builds[0]?.slug)

  const filtered = filterBuilds(builds, category)
  const shown = limit ? filtered.slice(0, limit) : filtered
  // Resolve the preview against what is VISIBLE, not the whole set. Looking it
  // up in `builds` meant that after filtering, the preview could keep showing a
  // build that is no longer in the list beside it.
  const active = shown.find((b) => b.slug === activeSlug) ?? shown[0]

  return (
    <section className="px-6 py-20 md:px-12">
      <p className="label mb-6">Selected work · concept builds</p>

      {!limit && (
        <div data-testid="work-filter" className="mb-8 flex flex-wrap gap-1">
          {['all', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 font-sans text-[11px] font-medium ${
                category === cat ? 'bg-accent font-semibold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <ul className="flex-1">
          {shown.map((build) => (
            <li key={build.slug}>
              {/* A button, not a link. There are no per-build detail pages, so
                  an anchor would be a dead end — and its real job is to change
                  what the preview shows, which is exactly what a button is for.
                  Click is bound as well as hover so touch devices, which have no
                  hover, can still drive the preview. */}
              <button
                type="button"
                data-testid="work-row"
                onMouseEnter={() => setActiveSlug(build.slug)}
                onFocus={() => setActiveSlug(build.slug)}
                onClick={() => setActiveSlug(build.slug)}
                aria-pressed={build.slug === activeSlug}
                className="group relative block w-full py-1 text-left font-display leading-[1.18] tracking-tight"
                style={{ fontSize: 'var(--text-sub)' }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-[-9px] right-[-9px] origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />
                <span className="relative">{build.name}</span>
                <span className="relative ml-3 font-sans text-[11px] text-ink-muted">
                  {build.category}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="w-full md:w-[380px] md:shrink-0">
          <div
            data-testid="work-preview"
            data-slug={active?.slug}
            className="aspect-[16/10] bg-cover bg-center"
            style={{ backgroundImage: active ? `url(${active.image})` : undefined }}
            role="img"
            aria-label={active ? `${active.name} — concept build` : 'Concept build preview'}
          />
          <p className="mt-3 font-sans text-[12px] leading-relaxed text-ink-muted">
            {active?.blurb}
          </p>
        </div>
      </div>
    </section>
  )
}
