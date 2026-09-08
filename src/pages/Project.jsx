import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { BUILDS } from '../lib/builds.js'

/**
 * Case study layout, adapted from routs.gr/portfolio: a numbered label, a large
 * display headline, year and discipline as meta, then Challenge / Approach /
 * Outcome in three columns, followed by screenshots of the live site.
 *
 * Screenshots are read by convention from /builds/shots/<slug>-N.png. They may
 * not exist — several of these sites are old and some are gone — so the grid
 * falls back to the build's hero image rather than rendering a broken frame.
 */
function shotsFor(slug) {
  return [1, 2, 3].map((n) => `/builds/shots/${slug}-${n}.jpg`)
}

function Shot({ src, fallback, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed && !fallback) return null
  return (
    <img
      src={failed ? fallback : src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="w-full border border-rule"
    />
  )
}

export default function Project() {
  const { slug } = useParams()
  const index = BUILDS.findIndex((b) => b.slug === slug)

  // An unknown slug is a typo or a stale link, not an error state worth a page.
  if (index === -1) return <Navigate to="/portfolio" replace />

  const build = BUILDS[index]
  const next = BUILDS[(index + 1) % BUILDS.length]
  const number = String(index + 1).padStart(2, '0')

  return (
    <div data-testid="project-page" className="px-6 py-16 md:px-12">
      <Link to="/portfolio" className="label underline">
        ← All work
      </Link>

      <header className="mt-10 border-b border-rule pb-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="label">
              Case study n. {number} · {build.category}
            </p>
            <h1
              className="mt-3 font-display leading-[1.04] tracking-tight"
              style={{ fontSize: 'var(--text-section)' }}
            >
              {build.name} — {build.blurb.split('. ')[0].toLowerCase()}.
            </h1>
          </div>
          <div className="text-right font-sans text-[11px] leading-relaxed text-ink-muted">
            <p>{build.year}</p>
            <p>{build.discipline}</p>
          </div>
        </div>

        {/* Provenance, stated rather than implied. Spec §2: nothing on this site
            may present someone else's website as our work. */}
        <p className="mt-6 font-sans text-[12px] leading-relaxed text-ink-muted">
          {build.own ? (
            <>
              <span className="bg-accent px-2 py-0.5 font-semibold text-ink">Built here</span>
              <span className="ml-3">
                A concept build — made to show what we can do, not commissioned by a client.
              </span>
            </>
          ) : (
            <>
              <span className="border border-rule px-2 py-0.5 font-semibold">Reference</span>
              <span className="ml-3">
                Not our work. A site we admire, studied here for what it gets right.
              </span>
            </>
          )}
        </p>
      </header>

      <div className="mt-12 grid gap-10 md:grid-cols-3">
        <section>
          <p className="label mb-3">The challenge</p>
          <p className="font-sans leading-relaxed text-ink-muted">{build.challenge}</p>
        </section>
        <section>
          <p className="label mb-3">{build.own ? 'Our approach' : 'What it does'}</p>
          <p className="font-sans leading-relaxed text-ink-muted">{build.approach}</p>
        </section>
        <section>
          <p className="label mb-3">The outcome</p>
          <p className="font-sans leading-relaxed text-ink-muted">{build.outcome}</p>
        </section>
      </div>

      <div className="mt-16 flex flex-col gap-4">
        {shotsFor(build.slug).map((src, i) => (
          <Shot
            key={src}
            src={src}
            fallback={i === 0 ? build.image : null}
            alt={`${build.name} — screen ${i + 1}`}
          />
        ))}
      </div>

      {build.url && (
        <a
          href={build.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
        >
          Visit the live site ↗
        </a>
      )}

      <nav className="mt-20 border-t border-rule pt-6">
        <p className="label mb-2">Next</p>
        <Link
          to={`/portfolio/${next.slug}`}
          className="font-display leading-tight tracking-tight"
          style={{ fontSize: 'var(--text-sub)' }}
        >
          {next.name} →
        </Link>
      </nav>
    </div>
  )
}
