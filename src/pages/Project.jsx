import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { BUILDS } from '../lib/builds.js'

/**
 * Case study layout, adapted from routs.gr/portfolio: a numbered label, a large
 * display headline, year and discipline as meta, then Challenge / Approach /
 * Outcome in three columns, followed by an asymmetric image mosaic.
 *
 * The mosaic is staggered across a 12-column grid with a small uppercase caption
 * under each frame and no borders — the images sit directly on the paper. A
 * uniform full-width stack reads as a dump rather than a layout.
 *
 * Every frame keeps the source 16:10. Routs varies aspect ratio because its
 * images are genuinely different assets; ours are all screenshots of the same
 * shape, so forcing a portrait crop sliced headlines mid-word and read as a bug.
 * The asymmetry comes from column span and vertical offset instead.
 *
 * Captions state scroll position rather than inventing feature names, because
 * that is all these captures honestly are.
 *
 * Shots are read by convention from /builds/shots/<slug>-N.jpg and may not
 * exist — vorszk.com is gone entirely — so the first frame falls back to the
 * build's hero image and the rest render nothing.
 */
const SHOTS = [
  { n: 1, caption: 'The first screen', span: 'md:col-span-8', shape: 'aspect-[16/10]' },
  { n: 2, caption: 'Midpage', span: 'md:col-span-4 md:col-start-9 md:mt-24', shape: 'aspect-[16/10]' },
  { n: 3, caption: 'Further down', span: 'md:col-span-7 md:col-start-2', shape: 'aspect-[16/10]' },
]

function Shot({ slug, shot, fallback }) {
  const [failed, setFailed] = useState(false)
  const src = `/builds/shots/${slug}-${shot.n}.jpg`

  // No capture for this one, and no hero to stand in for it: render nothing
  // rather than an empty frame with a caption under it.
  if (failed && !fallback) return null

  return (
    <figure className={`col-span-12 ${shot.span}`}>
      <img
        src={failed ? fallback : src}
        alt={`${slug} — ${shot.caption.toLowerCase()}`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`w-full object-cover object-top ${shot.shape}`}
      />
      <figcaption className="label mt-3">{shot.caption}</figcaption>
    </figure>
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

      <div className="mt-16 grid grid-cols-12 gap-x-6 gap-y-14">
        {SHOTS.map((shot) => (
          <Shot
            key={shot.n}
            slug={build.slug}
            shot={shot}
            fallback={shot.n === 1 ? build.image : null}
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
