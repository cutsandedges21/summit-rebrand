import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CATEGORIES, filterBuilds } from '../lib/builds.js'
import { useReducedMotion } from '../lib/motion.js'
import { EASE } from '../lib/textify.jsx'
import Reveal, { RevealItem } from './Reveal.jsx'

export default function WorkList({ builds, limit, label = 'Selected work' }) {
  const [category, setCategory] = useState('all')
  const [activeSlug, setActiveSlug] = useState(builds[0]?.slug)
  const reduced = useReducedMotion()

  const filtered = filterBuilds(builds, category)
  const shown = limit ? filtered.slice(0, limit) : filtered
  // Resolve the preview against what is VISIBLE, not the whole set. Looking it
  // up in `builds` meant that after filtering, the preview could keep showing a
  // build that is no longer in the list beside it.
  const active = shown.find((b) => b.slug === activeSlug) ?? shown[0]

  return (
    <section className="px-6 py-20 md:px-12">
      {/* Whole-element reveal rather than a per-word split. Splitting an
          eyebrow this small buys almost nothing visually, and it costs the
          label its single text node — which is how both the tests and a
          screen reader find it. */}
      {label && (
        <Reveal as="p" variant="up" duration={0.7} className="label mb-6">
          {label}
        </Reveal>
      )}

      {!limit && (
        <div data-testid="work-filter" className="mb-8 flex flex-wrap gap-1">
          {['all', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`relative px-3 py-1 font-sans text-[11px] font-medium transition-colors duration-300 ${
                category === cat ? 'font-semibold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {/* One shared accent chip that slides between filters instead of
                  four that blink on and off. */}
              {category === cat && (
                <motion.span
                  layoutId="work-filter-chip"
                  className="absolute inset-0 bg-accent"
                  transition={{ duration: 0.45, ease: EASE.expoInOut }}
                />
              )}
              <span className="relative">{cat === 'all' ? 'All' : cat}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <Reveal as="ul" variant="fade" stagger={0.07} amount={0.15} className="flex-1">
          {shown.map((build) => (
            <RevealItem as="li" key={build.slug}>
              {/* A link now that per-build case studies exist. Hover and focus
                  still drive the preview beside the list; clicking navigates. */}
              <Link
                to={`/portfolio/${build.slug}`}
                data-testid="work-row"
                onMouseEnter={() => setActiveSlug(build.slug)}
                onFocus={() => setActiveSlug(build.slug)}
                className="group relative block w-full py-1 text-left font-display leading-[1.18] tracking-tight"
                style={{ fontSize: 'var(--text-sub)' }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-[-9px] right-[-9px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />
                <span className="relative inline-block transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none">
                  {build.name}
                </span>
                <span className="relative ml-3 font-sans text-[11px] text-ink-muted">
                  {build.category}
                </span>
                {/* Reads as the row pointing at the preview it just changed. */}
                <span
                  aria-hidden="true"
                  className="relative ml-2 inline-block translate-x-[-8px] font-sans text-[13px] opacity-0 transition-all duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                >
                  →
                </span>
              </Link>
            </RevealItem>
          ))}
        </Reveal>

        {/* Desktop only. The preview is driven by hover and focus, and a tap on a
            row navigates rather than previewing — so on a phone this frame can
            never change. Showing one build's screenshot permanently beneath a
            list of fourteen is worse than showing nothing. */}
        <div className="hidden w-full md:sticky md:top-24 md:block md:h-fit md:w-[380px] md:shrink-0">
          <div
            data-testid="work-preview"
            data-slug={active?.slug}
            className="relative aspect-[16/10] overflow-hidden bg-paper-clay"
            role="img"
            aria-label={active ? `${active.name} — preview` : 'Project preview'}
          >
            {/* Each screenshot wipes in over the last one from the side the list
                is on, so hovering a row reads as pushing that project into the
                frame. `popLayout` keeps the outgoing image from reflowing the
                incoming one mid-wipe. */}
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active?.slug ?? 'empty'}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: active ? `url(${active.image})` : undefined }}
                initial={reduced ? false : { clipPath: 'inset(0% 0% 0% 100%)', scale: 1.14 }}
                animate={
                  reduced
                    ? { opacity: 1 }
                    : {
                        clipPath: 'inset(0% 0% 0% 0%)',
                        scale: 1,
                        transition: { duration: 0.75, ease: EASE.expoInOut },
                      }
                }
                exit={reduced ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.35 } }}
              />
            </AnimatePresence>
          </div>

          <div className="relative mt-3 min-h-[3.5em]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={active?.slug ?? 'empty-blurb'}
                className="font-sans text-[12px] leading-relaxed text-ink-muted"
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.power2 } }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, transition: { duration: 0.2 } }}
              >
                {active?.blurb}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
