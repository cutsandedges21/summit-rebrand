import { useScroll, useTransform, motion as fm } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { BUILDS } from '../lib/builds.js'
import { useReducedMotion, useIsMobile } from '../lib/motion.js'

const CENTRE = (BUILDS.length - 1) / 2

/**
 * Signed distance from the middle of the arc. Works for any build count:
 * with an odd count the centre tile gets offset 0 and faces straight at you;
 * with the current 14 the two middle tiles sit at -0.5 and +0.5 instead.
 */
function offsetFor(index) {
  return index - CENTRE
}

function Tile({ build, index }) {
  const offset = offsetFor(index)
  const distance = Math.abs(offset)
  const direction = Math.sign(offset)

  return (
    <fm.div
      data-testid="arc-tile"
      aria-hidden="true"
      className="absolute h-[38vh] w-[13vw] min-w-[74px] shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
      style={{
        backgroundImage: `url(${build.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        rotateY: -direction * (14 + distance * 3),
        scale: 0.55 + distance * 0.085,
        x: direction * distance * 78,
        zIndex: 10 - distance,
      }}
    />
  )
}

export default function ArcHero() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const isStatic = reduced || mobile

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Tiles fly apart and fade as the hero leaves the viewport.
  const spreadScale = useTransform(scrollYProgress, [0, 1], [1, 3.4])
  const spreadFade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden px-6 md:px-12">
      <fm.div
        data-testid="arc-stage"
        data-static={String(isStatic)}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          perspective: 1100,
          scale: isStatic ? 1 : spreadScale,
          opacity: isStatic ? 1 : spreadFade,
        }}
      >
        {BUILDS.map((build, i) => (
          <Tile key={build.slug} build={build} index={i} />
        ))}
      </fm.div>

      <div className="relative flex min-h-[92vh] flex-col items-center justify-center text-center">
        <p className="label mb-5">Web design, build and upkeep — Montreal</p>
        <h1
          className="font-display leading-[1.02] tracking-tight"
          style={{
            fontSize: 'var(--text-hero)',
            textShadow: '0 2px 28px rgba(249, 247, 239, 0.92)',
          }}
        >
          {/* The explicit space before <br /> is load-bearing: without it the
              heading's textContent runs together as "businessesthat", which is
              what a screen reader announces. The space collapses at the line
              break, so the rendered layout is unchanged. */}
          We build <em>websites</em> for businesses{' '}
          <br />
          that <em>answer</em> the phone.
        </h1>
        <p className="mt-7 max-w-lg font-sans text-ink-muted">
          Design, build, local SEO and upkeep — handled start to finish, in one place.
        </p>
        <Link
          to="/work"
          className="mt-8 bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
        >
          See the work
        </Link>
      </div>
    </section>
  )
}
