import { Link } from 'react-router-dom'
import { motion as fm } from 'framer-motion'
import { BUILDS } from '../lib/builds.js'
import { useReducedMotion } from '../lib/motion.js'
import Textify, { EASE } from '../lib/textify.jsx'
import ImageStreamHero from './ImageStreamHero.jsx'
import Magnetic from './Magnetic.jsx'

// The hero's imagery is the corridor in ImageStreamHero: two rails of build
// screenshots riding out of the vanishing point toward the viewer. It replaced
// a fourteen-tile static arc, which is why the old file was called ArcHero.
//
// The corridor is pure CSS on a container query, so unlike the arc it needs no
// desktop/mobile split and no JS at all to hold its shape — every length is a
// share of the container's width. What it does need is a lower axis than its
// own default: the cards sweep THROUGH the centre by design (see note 3 in that
// file), and the centre is where this hero's headline sits. Dropping the axis
// puts the whole corridor below the type instead of behind it.
//
// That constraint is not new. The arc reserved a bare channel down the middle
// for exactly the same reason: dark serif over a near-black screenshot is
// unreadable, which is how the first version of the old hero looked.
const AXIS = 84

// Pre-cropped, pre-sized card art from scripts/build-stream-cards.mjs, not the
// build heroes themselves. Every card is an 18:25 portrait filled with
// object-cover, and the heroes are 16:10 landscape at 1440px, so pointing the
// corridor at them downloads 1.4 MB above the fold and then throws most of
// each file away at the crop. The derivatives are the same pixels, cropped
// once at build time: 1954 KB -> 399 KB across all fourteen. The script builds
// a card for every build; the corridor draws on the subset below, so changing
// that list needs no regeneration.
// A curated five rather than the whole catalogue. `cards` below is the
// corridor's DENSITY — how many slots ride each rail at once — and it is
// independent of this pool, which the rails cycle through with
// `images[i % images.length]`. So a short list makes the corridor repeat, not
// thin out, and these five come round roughly twice per rail.
const STREAM_SLUGS = ['cuts-and-edges', 'brand-cosmetics', 'drinksom', 'air-center', 'halcyon']

const STREAM = STREAM_SLUGS
  // Resolved against BUILDS rather than hand-written, so a slug that is renamed
  // or retired drops out here instead of pointing the corridor at a 404 — which
  // is exactly how cuts-and-edges and gloryn were silently missing before.
  .map((slug) => BUILDS.find((build) => build.slug === slug))
  .filter(Boolean)
  .map((build) => ({
    src: `/builds/stream/${build.slug}.jpg`,
    alt: build.name,
  }))

export default function Hero() {
  const reduced = useReducedMotion()

  return (
    <ImageStreamHero
      images={STREAM}
      axis={AXIS}
      speed={22}
      // The rails are wider than they are tall by the time they exit, so at this
      // axis the cards are still at full size where the section clips them —
      // a dead-straight horizontal cut across the frame, which reads as a crop
      // rather than a bleed. This dissolves them into the paper instead.
      fadeBelow={78}
      className="min-h-[92vh] px-6 md:px-12"
      data-testid="hero-stage"
      data-static={String(reduced)}
    >
      <div className="relative flex min-h-[92vh] flex-col items-center justify-start pt-[14vh] text-center">
        <Textify as="p" preset="riseWords" className="label mb-5" amount={0.2}>
          Web design, build and upkeep — Montreal
        </Textify>

        {/* Textify's own banner configuration: per-character masked rise,
            stagger 0.025, duration 0.7, expo.inOut. The explicit space before
            <br /> is load-bearing — without it the heading's textContent runs
            together as "businessesthat", which is what a screen reader
            announces. */}
        <Textify
          as="h1"
          preset="rise"
          delay={0.1}
          amount={0.2}
          className="font-display leading-[1.02] tracking-tight"
          style={{ fontSize: 'var(--text-hero)' }}
        >
          We build <em>websites</em> for businesses <br />
          that <em>answer</em> the phone.
        </Textify>

        <Textify
          as="p"
          preset="riseLines"
          delay={0.35}
          amount={0.2}
          className="mt-7 max-w-lg font-sans text-ink-muted"
        >
          Design, build, local SEO and upkeep — handled start to finish, in one place.
        </Textify>

        <fm.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? false : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: EASE.expoInOut }}
          className="mt-8"
        >
          <Magnetic>
            <Link
              to="/portfolio"
              className="group relative inline-block overflow-hidden bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
            >
              {/* Ink sweeps up behind the label on hover and the label inverts
                  with it, which is why both layers share one duration. */}
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-y-100 motion-reduce:transition-none" />
              <span className="relative transition-colors duration-500 group-hover:text-paper">
                See the work
              </span>
            </Link>
          </Magnetic>
        </fm.div>
      </div>
    </ImageStreamHero>
  )
}
