import { useEffect, useRef, useState } from 'react'
import { THEMES, useBackdropTheme } from './Backdrop.jsx'
import { useReducedMotion } from '../lib/motion.js'

/* ── the orbit ────────────────────────────────────────────────────
 * A ring of build screenshots turning behind the headline. Built to
 * vanity.llc's hero, which is where the treatment comes from; the lab
 * snippet it ships as is a much smaller version of the same idea, and
 * its defaults are not what the hero actually runs.
 *
 *            snippet      their hero          here
 *   cards      115px      300px square        0.208w square
 *   radius     260px      634px (2.11 cards)  2.11 cards
 *   centre     middle     0.50w, 0.90h        same (0.58h narrow)
 *   count         n/a     10                  8
 *
 * Two things make it theirs rather than the snippet's, both measured
 * off the running site:
 *
 * 1. The circle is bigger than the frame AND centred near the floor of
 *    it, at 0.90 of the height. Only the top of the circle is ever on
 *    screen, so the cards read as a dome arcing over the content — in
 *    at the lower left, over the apex, out at the lower right — rather
 *    than as a wheel centred on the page. The clear bottom of their
 *    hero is that offset, not an absence of cards.
 * 2. The radius is quoted in CARDS, not in pixels and not as a share of
 *    the viewport: 634 to a 300px card. Holding that ratio is what
 *    keeps the gap between neighbours identical at every screen size.
 *
 * The spin is NOT scroll-driven, which the snippet is easy to misread
 * on. Sampled down the live page, the ring's rotation moves 0.3° over
 * the first 100px of scroll — it is a slow constant turn with a fast
 * arrival, and scrolling merely carries the hero away.
 *
 * Deliberately inert to the pointer. The snippet tilts the whole plate
 * toward the cursor, which is what it pulls GSAP in for; that is gone
 * by request, and with it the 3D plate, the perspective and the card
 * lift, which existed only to give that tilt something to parallax.
 * What is left is one rAF loop writing one transform, and no
 * dependency beyond React.
 *
 * Every card stays whole top to bottom, at every moment of the turn,
 * and buying that costs the dome. It is worth being exact about why,
 * because the obvious fix does not work:
 *
 *   Their cards run off all four edges. That is free on a black page —
 *   a card simply stops being visible. On cream, a dark screenshot
 *   ending on a straight line is about the most conspicuous edge this
 *   palette can make, and the header is sticky besides: it takes space
 *   in flow, so the hero starts 76px down and the crop lands INSIDE
 *   the window rather than at its rim, reading as a bug, not a frame.
 *
 *   So the card is sized against the TOP edge — the one in the middle
 *   of the screen, just under the header, where a cut is unmissable:
 *   card <= centre / (2.11 + 0.71). At rest that leaves every card on
 *   screen clear of both edges.
 *
 *   It must stay a CIRCLE for that to hold. An ellipse was tried and
 *   is wrong: the spin rotates the container, which turns the ellipse
 *   itself rather than moving cards along it, so its vertical reach
 *   swells to the horizontal radius a quarter-turn later and the cards
 *   overhang by a couple of hundred pixels. A circle is the only shape
 *   invariant under its own rotation.
 *
 *   The bottom edge is handled by a short fade instead, because the
 *   turn does eventually bring a low card up across it. See
 *   FADE_BOTTOM.
 *
 * One addition of our own: a scrim. Eight cards on a dome cannot be
 * kept off a line of type spanning 80% of the viewport — the cards on
 * the way up and down cross its ends. Their hero is white on black
 * with contrast to spare; ours is dark serif on cream over screenshots
 * that are mostly dark, and the first build of this was unreadable.
 * The scrim dissolves the cards into the paper as they pass the type,
 * which is the move the parked corridor made with `fadeBelow`. It
 * stays an ordinary child of the hero, so it scrolls with the type it
 * is protecting instead of being pinned to the window.
 * ───────────────────────────────────────────────────────────────── */

// Cards are SQUARE, sized as a share of the box — 300px on their 1440, so
// 0.208. Floored so they stay legible on a phone, capped so they do not
// become billboards on a 27" display.
const CARD_MIN = 120
const CARD_MAX = 320
const CARD_SHARE = 0.208

// Radius in cards rather than pixels or a share of the frame: theirs is 634
// to a 300px card. A radius pinned to the viewport instead changes the
// spacing every time the card hits its floor or its cap, and the ring
// visibly loosens on a phone.
const RADIUS_PER_CARD = 2.11

// A short fade along the BOTTOM edge only — there is none at the top, where the
// cards are meant to be seen whole and crisp.
//
// It is there for the turn rather than for the resting frame. At rest every
// card on screen is clear of both edges, but the ring rotates, so a card low on
// the circle climbs up past the hero's bottom edge to reach three o'clock, and
// for a few seconds of that climb its top edge is that boundary — a straight
// line across a photograph, against cream. The fade lets it surface instead.
//
// Short on purpose: the cards at three and nine o'clock rest just above this
// edge, and a long fade would dim the two largest things in the frame to hide
// an event that happens at the pace of a minute hand.
const FADE_BOTTOM = 90

// Where the centre of the circle sits in the box. Not the middle: at 0.90 it
// is below the fold and only the TOP of the circle is on screen, which is
// what makes the cards a dome over the content rather than a wheel around it.
//
// A phone cannot hold the same figure. The hero there is tall and narrow, so
// a dome centred at 0.90 has its apex BELOW the headline and the ring
// collapses into the bottom third. Narrow screens get a centre nearer the
// middle, which puts the cards back around the type.
// Theirs exactly. Low enough that only the top of the circle is on screen,
// which is what makes the cards an arch over the content rather than a wheel
// around it — the clear bottom of their hero is this offset, not an absence of
// cards.
//
// A phone cannot hold the same figure. The card there is on its floor, so the
// radius is small while the hero is tall, and a dome at 0.90 puts the apex card
// squarely in the middle of the type — it reads as a grey slab behind the
// paragraph rather than as part of a ring. Narrow screens lift the centre so
// the apex clears the label instead.
const CENTRE_Y = 0.9
const CENTRE_Y_NARROW = 0.58
const NARROW = 768

// Corner radius, as theirs: 22px on a 300px card, scaled with it.
const CORNER = 22 / 300

// Cruise speed in degrees per frame, and the speed the ring is thrown at on
// arrival. SETTLE is the fraction of the gap closed per frame, so the ring
// spins up hard and takes a couple of seconds to ease down into the cruise —
// the arrival is the animation, the cruise is idle.
const CRUISE = 0.08
const ARRIVAL = 10
const SETTLE = 0.025

const clamp = (lo, v, hi) => Math.max(lo, Math.min(hi, v))

/**
 * @param {object} props
 * @param {{src: string, alt: string}[]} props.images Cards, spaced evenly around the ring in array order.
 */
export default function Orbit({ images }) {
  const reduced = useReducedMotion()
  // The scrim has to be the live page colour or it reads as a pale blob
  // sitting on the cards. Backdrop tweens this on scroll, and the hero is
  // paper today, but reading it means the orbit cannot be wrong later.
  const paper = THEMES[useBackdropTheme()] ?? THEMES.paper
  const hostRef = useRef(null)
  const ringRef = useRef(null)
  // Nothing until measured. Rendering a guessed ring and correcting it on the
  // next frame is a visible jump on load, right where the eye is.
  const [box, setBox] = useState(null)

  // Sized off the hero — the layer's own box is the window, so measuring that
  // would scale the cards to the screen rather than to the section they belong
  // to. Measured rather than taken from vw/vh: the hero is padded, and on
  // Windows the scrollbar takes another 15px out of vw.
  useEffect(() => {
    const hero = hostRef.current?.parentElement
    if (!hero) return undefined

    const measure = () => {
      const r = hero.getBoundingClientRect()
      setBox({ w: r.width, h: r.height })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(hero)
    return () => ro.disconnect()
  }, [])

  // The reference's share of the width, full stop. An earlier pass held this
  // down so the ring fitted inside the hero, which cost about a fifth of the
  // card and most of the radius — the ring is supposed to be bigger than the
  // frame. The top is kept whole by where the layer starts instead, not by
  // shrinking what goes in it. See the fixed layer below.
  const card = box ? clamp(CARD_MIN, box.w * CARD_SHARE, CARD_MAX) : 0
  const radius = card * RADIUS_PER_CARD

  useEffect(() => {
    const host = hostRef.current
    const ring = ringRef.current
    const hero = host?.parentElement
    if (!host || !ring || !hero) return undefined

    // The layer runs from the top of the WINDOW down to the end of the hero.
    //
    // Starting at the window rather than at the hero is the whole point. The
    // header is sticky, so it takes space in flow and the hero begins 76px down
    // the page; a layer bounded by the hero cuts the top card on a line 76px
    // from the top of the screen, with paper above it. That card overhangs the
    // hero by only about 28px, so lifting the boundary those 76px is enough to
    // show it whole — no shrinking, no fade.
    //
    // The bottom still follows the hero, so nothing is left floating over the
    // next section once this one has scrolled away. When that edge is mid-screen
    // the fade takes care of it.
    const place = () => {
      const r = hero.getBoundingClientRect()
      host.style.height = `${Math.max(0, Math.min(window.innerHeight, r.bottom))}px`
      ring.style.left = `${r.left + r.width / 2}px`
      const centre = r.width < NARROW ? CENTRE_Y_NARROW : CENTRE_Y
      ring.style.top = `${r.top + r.height * centre}px`
    }

    // Reduced motion: no loop to hang the placement off, so it rides scroll and
    // resize instead. The ring does not turn, but it still has to stay with the
    // hero.
    if (reduced) {
      place()
      window.addEventListener('scroll', place, { passive: true })
      window.addEventListener('resize', place, { passive: true })
      return () => {
        window.removeEventListener('scroll', place)
        window.removeEventListener('resize', place)
      }
    }

    let raf = 0
    let rotation = 0
    let speed = ARRIVAL

    const frame = () => {
      speed += (CRUISE - speed) * SETTLE
      rotation += speed
      place()
      ring.style.transform = `rotate(${rotation}deg)`
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [reduced, box])

  return (
    // Decorative: these same screenshots are the portfolio's actual content,
    // reachable and captioned there. Announcing eight untitled images ahead of
    // the headline would cost a screen reader user the first thing on the site
    // and return nothing.
    //
    // pointer-events-none so the ring cannot swallow a click on the CTA
    // sitting in the middle of it.
    <>
      {/* Fixed, so the hero's overflow cannot crop it: fixed boxes are laid out
          against the window, and nothing above this has a transform or filter
          that would capture it back. top stays pinned to the window; height is
          written every frame. Left and right are the window's own edges, which
          is where the cards are MEANT to run off. */}
      <div
        ref={hostRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 right-0 left-0 overflow-hidden"
        data-testid="orbit"
        style={{
          maskImage: `linear-gradient(to bottom, #000 calc(100% - ${FADE_BOTTOM}px), transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, #000 calc(100% - ${FADE_BOTTOM}px), transparent 100%)`,
        }}
      >
        {/* A zero-size box pinned to the centre of the circle rather than a
            full-bleed layer. An element rotates about its OWN middle, so a
            layer at inset-0 would turn the ring around the middle of the frame
            — and the whole point of the dome is that its centre is not there.
            Give it no size and its middle IS the centre. */}
        <div
          ref={ringRef}
          className="absolute"
          style={{ width: 0, height: 0, willChange: 'transform' }}
        >
          {box &&
            images.map((image, i) => {
              const angle = (i / images.length) * Math.PI * 2
              // +90° lays each card tangent to the circle, which is what makes
              // the set read as one turning object rather than a carousel of
              // separate pictures.
              const lean = angle * (180 / Math.PI) + 90

              return (
                <div
                  key={image.src}
                  className="absolute top-0 left-0"
                  style={{
                    // Sized explicitly, not left to shrink-to-fit. The ring is
                    // a 0x0 box, so an auto-width wrapper inherits a 0-wide
                    // containing block — and Tailwind's preflight puts
                    // `max-width: 100%` on every <img>, which then resolves to
                    // zero and the cards vanish while still reporting a height.
                    width: card,
                    height: card,
                    transform: `translate(-50%, -50%) translate(${Math.cos(angle) * radius}px, ${
                      Math.sin(angle) * radius
                    }px) rotate(${lean}deg)`,
                  }}
                >
                  <img
                    src={image.src}
                    alt=""
                    draggable={false}
                    decoding="async"
                    className="block h-full w-full object-cover"
                    // On the <img>, where theirs is on the wrapper. It looks
                    // the same and keeps the element exempt from the
                    // no-rounded-chrome sweep on its tag alone; a rounded
                    // wrapper would need a role="img" to earn the exemption.
                    style={{ borderRadius: CORNER * card }}
                  />
                </div>
              )
            })}
        </div>
      </div>

      {/* An ordinary child of the hero, not of the fixed layer, so it scrolls
          with the type it is protecting. It comes after the ring in the DOM and
          both are positioned at z-auto, so it paints over the cards without
          either needing a z-index.

          Much lighter than it was. It was sized when the ring still crossed the
          whole width of the type; now that the fit has moved the cards outward,
          only two of them touch the headline at all, and only at the far ends
          of its longest line. The old ellipse held solid paper across most of
          the frame and bleached those two cards to ghosts.

          No border-radius: a rounded box here would register as a rounded
          container in the e2e design sweep, and the gradient shapes it anyway. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 64% 27% at 50% 43%, ${paper} 0%, ${paper} 20%, transparent 100%)`,
        }}
      />
    </>
  )
}
