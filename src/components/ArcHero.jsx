import { useScroll, useSpring, useTransform, motion as fm, useMotionValue } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { BUILDS } from '../lib/builds.js'
import { useReducedMotion, useIsMobile } from '../lib/motion.js'
import Textify, { EASE } from '../lib/textify.jsx'
import Magnetic from './Magnetic.jsx'

// Spec section 8: the full fourteen-tile corridor is a desktop-only object. At
// 375px the same spacing pushes every tile off-screen and leaves slivers at the
// edges, which reads as a rendering bug rather than a design. Phones get a
// shallower arc instead. Both counts are even on purpose -- an odd count puts a
// tile at dead centre, behind the headline and the CTA.
//
// The mobile arc used to be six tiles carrying the DESKTOP scale ramp
// (0.42 + distance * 0.1). At 390px that resolved to cards roughly 40px wide
// and 150px tall, clipped by the viewport at both ends -- the exact "reads as a
// rendering bug" failure the split above exists to prevent, just at a different
// size. Four tiles, near full scale, and a step tight enough that the outermost
// pair stays inside the viewport.
//
// `base`/`growth` drive the scale ramp. They are config rather than constants
// because the desktop corridor wants tiles that grow steeply toward the viewer
// and a phone wants four cards of roughly one size.
const DESKTOP = { tiles: BUILDS, clear: 150, step: 88, base: 0.42, growth: 0.1, size: 'h-[38vh] w-[13vw] min-w-[74px]' }
const MOBILE = { tiles: BUILDS.slice(4, 8), clear: 44, step: 50, base: 0.86, growth: 0.05, size: 'h-[21vh] w-[25vw]' }

/**
 * Signed distance from the middle of the arc. Works for any build count:
 * with an odd count the centre tile gets offset 0 and faces straight at you;
 * with the current 14 the two middle tiles sit at -0.5 and +0.5 instead.
 */
function offsetFor(index, count) {
  return index - (count - 1) / 2
}

function Tile({ build, index, count, clear, step, base, growth, size, isStatic }) {
  const offset = offsetFor(index, count)
  const distance = Math.abs(offset)
  const direction = Math.sign(offset)

  // Tiles start well clear of the middle. The centre channel is where the
  // headline sits, and it has to be bare paper — dark serif over a near-black
  // screenshot is unreadable, which is exactly how the first version of this
  // looked. Both reference sites do the same thing: the type occupies the gap
  // the images converge toward, never overlaps them.
  const resting = {
    x: direction * (clear + distance * step),
    rotateY: -direction * (16 + distance * 3),
    scale: base + distance * growth,
    zIndex: 10 - distance,
  }

  return (
    <fm.div
      data-testid="arc-tile"
      aria-hidden="true"
      className={`absolute overflow-hidden rounded-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${size}`}
      style={{
        backgroundImage: `url(${build.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...resting,
        // Outward tiles come toward the viewer and turn to face the centre,
        // which is what reads as a corridor rather than a flat fan of cards.
        ...(isStatic ? { z: distance * 26, y: -distance * 5 } : null),
      }}
      // The corridor assembles itself: tiles drop in from below the fold and
      // settle outward from the centre, so the shape arrives rather than simply
      // being there. Only y/z/opacity animate — x, rotateY and scale stay on
      // `style`, so the arc geometry has exactly one definition.
      initial={isStatic ? false : { y: 150, z: 0, opacity: 0 }}
      animate={isStatic ? false : { y: -distance * 5, z: distance * 26, opacity: 1 }}
      transition={{ duration: 1.25, delay: 0.15 + distance * 0.045, ease: EASE.expoInOut }}
    />
  )
}

export default function ArcHero() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const isStatic = reduced || mobile
  const arc = mobile ? MOBILE : DESKTOP

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Tiles fly apart and fade as the hero leaves the viewport.
  const spreadScale = useTransform(scrollYProgress, [0, 1], [1, 3.4])
  const spreadFade = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  // A slow counter-rotation as it opens. Small on purpose: the arc is already
  // moving in three axes, and any more than this reads as a wobble.
  const spreadTilt = useTransform(scrollYProgress, [0, 1], [0, -7])

  // Pointer parallax. Springs, not raw values — following the mouse exactly is
  // what makes these effects feel cheap.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const glide = { stiffness: 90, damping: 22, mass: 0.8 }
  const driftX = useSpring(px, glide)
  const driftY = useSpring(py, glide)

  const onPointerMove = (event) => {
    if (isStatic) return
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    px.set(((event.clientX - (box.left + box.width / 2)) / box.width) * 46)
    py.set(((event.clientY - (box.top + box.height / 2)) / box.height) * 26)
  }

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
      className="relative min-h-[92vh] overflow-hidden px-6 md:px-12"
    >
      <fm.div
        data-testid="arc-stage"
        data-static={String(isStatic)}
        className="pointer-events-none absolute inset-0 flex items-center justify-center pt-[48vh] md:pt-[30vh]"
        style={{
          perspective: 1100,
          scale: isStatic ? 1 : spreadScale,
          opacity: isStatic ? 1 : spreadFade,
          rotate: isStatic ? 0 : spreadTilt,
          x: isStatic ? 0 : driftX,
          y: isStatic ? 0 : driftY,
        }}
      >
        {arc.tiles.map((build, i) => (
          <Tile
            key={build.slug}
            build={build}
            index={i}
            count={arc.tiles.length}
            clear={arc.clear}
            step={arc.step}
            base={arc.base}
            growth={arc.growth}
            size={arc.size}
            isStatic={isStatic}
          />
        ))}
      </fm.div>

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
    </section>
  )
}
