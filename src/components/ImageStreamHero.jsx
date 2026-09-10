/* ── the corridor ────────────────────────────────────────────────
 * Two rails of cards ride from far behind the screen toward the
 * viewer. Perspective alone does the work that looks like two
 * animations: as a card's z grows it gets bigger *and* its screen x
 * sweeps outward from the vanishing point, because the projection
 * scales position and size by the same factor.
 *
 * Three things shape it, and each one fixes a specific artefact:
 *
 * 1. Depth is authored as *apparent size*, geometrically — each card
 *    is a constant ratio bigger than the one behind it, all the way
 *    out. Spacing a straight z-range evenly instead makes the near
 *    cards tear apart from each other as the projection blows up.
 * 2. The rails open hard in the first stretch and then hold
 *    (`fan` > 1). That opening cancels the — still slow — growth back
 *    there, so the ribbon leaves the centre as a flat band, bends
 *    once, and only then runs out on the diagonal. Parallel rails
 *    project to a straight cone with no bend at all.
 * 3. Neither end of the loop is ever on screen. A card dies with its
 *    inner edge past 50cqw, clear of the container's edge. And it is
 *    born *across* the axis — `railBirth` is negative, so the newest
 *    card starts on the far side and sweeps back through the centre.
 *    That plugs the throat: the axis stays covered at every instant,
 *    and a newborn lands behind cards that already cover it, so it
 *    needs no fade in. Birthing on its own side instead leaves a hole
 *    at dead centre that blinks open once every cycle.
 *
 * Every length is in `cqw` — a percentage of the container's width —
 * so the whole corridor keeps its proportions at any size. The
 * defaults were fitted numerically against a reference recording's
 * card-height and edge-position profile, not eyeballed.
 *
 * Ported from a TypeScript/Next original. Three things changed and
 * nothing else did — the geometry below is the authored curve:
 *   - `"use client"` dropped; this app is Vite + React Router.
 *   - `cn()` dropped rather than adding clsx and tailwind-merge for
 *     one file. No call site here needs class merging.
 *   - Cards carry role="img". Spec §3 bans rounded CHROME, not
 *     rounded imagery, and the e2e design-rule sweep reads that
 *     distinction off role="img" — see tests/e2e/design-rules.spec.js.
 *     Without it, 24 image frames register as rounded containers.
 * ─────────────────────────────────────────────────────────────── */

/**
 * Geometry of the corridor. Every length is `cqw`, a percentage of the
 * container's width, so the shape is resolution-independent.
 *
 * These interact: the ribbon only stays solid while consecutive cards
 * overlap, which needs `exitHeight / birthHeight` spread over enough
 * `cards`. Raising `exitHeight`, dropping `cards`, or pulling `railExit`
 * in all push toward a visible tear near the frame edge.
 *
 * @typedef {object} CorridorPath
 * @property {number} [perspective] Strength of the projection. Lower is a wider-angle, more dramatic rush.
 * @property {number} [cardWidth]   Card width in world units.
 * @property {number} [cardHeight]  Card height in world units.
 * @property {number} [cardRadius]  Corner radius applied to each card.
 * @property {number} [birthHeight] On-screen card height at the waist, where a card is born.
 * @property {number} [exitHeight]  On-screen card height as a card leaves the frame.
 * @property {number} [railBirth]   Lateral offset at birth. Negative starts the card across the axis so the centre never opens up.
 * @property {number} [railExit]    Lateral offset once the rails have finished opening.
 * @property {number} [fan]         How front-loaded the opening is. >1 opens early then holds.
 * @property {number} [turnBirth]   Y-rotation at birth, degrees.
 * @property {number} [turnExit]    Y-rotation at exit, degrees.
 * @property {number} [stops]       Keyframe stops used to trace the curve. Raise only if motion looks faceted.
 */

/** @type {Required<CorridorPath>} */
const PATH = {
  perspective: 30,
  cardWidth: 18,
  cardHeight: 25,
  cardRadius: 0.4,
  birthHeight: 2.6,
  exitHeight: 46,
  railBirth: -11,
  railExit: 44,
  fan: 3.3,
  turnBirth: 6,
  turnExit: 28,
  stops: 24,
}

/** Sample the path once so the CSS keyframes trace the real curve. */
function keyframes(dir, name, p) {
  const steps = []
  for (let s = 0; s <= p.stops; s++) {
    const u = s / p.stops
    // Geometric in apparent size, so consecutive cards keep a constant size
    // ratio and the ribbon stays solid at both ends.
    const scale = (p.birthHeight / p.cardHeight) * Math.pow(p.exitHeight / p.birthHeight, u)
    const z = p.perspective * (1 - 1 / scale)
    const rail = p.railExit - (p.railExit - p.railBirth) * Math.pow(1 - u, p.fan)
    const turn = p.turnBirth + (p.turnExit - p.turnBirth) * u
    steps.push(
      `${(u * 100).toFixed(2)}%{transform:translate3d(${(dir * rail).toFixed(2)}cqw,0,${z.toFixed(
        2,
      )}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)}`,
    )
  }
  return `@keyframes ${name}{${steps.join('')}}`
}

/**
 * @param {object} props
 * @param {{ src: string, alt?: string }[]} props.images Images cycled onto the rails. Both rails
 *   run the same sequence, so the corridor reads as one mirrored stream. Fewer than `cards` repeat.
 * @param {number} [props.cards] Cards on each rail at once. More cards is a denser corridor, not a
 *   faster one. Far below the default, consecutive cards grow too fast to stay overlapped near the
 *   exit, which tears a gap in the ribbon.
 * @param {number} [props.speed] Seconds for one card to travel the whole corridor.
 * @param {number} [props.axis] Vertical placement of the corridor's axis, as a percentage of height.
 * @param {CorridorPath} [props.path] Override any part of the corridor geometry. Merged over defaults.
 * @param {number} [props.fadeBelow] Percentage of the height at which the corridor starts
 *   dissolving into the page. The rails are wider than they are tall by the time they exit, so with
 *   a low `axis` the cards are still at full size when the container clips them — a dead-straight
 *   horizontal cut across the whole frame, which reads as a crop rather than a bleed. Omit for the
 *   unmasked original.
 * @param {import('react').ReactNode} [props.children] Content rendered above the corridor.
 * @param {string} [props.className]
 */
export default function ImageStreamHero({
  images,
  cards = 9,
  speed = 18,
  axis = 55,
  path,
  fadeBelow,
  children,
  className = '',
  style,
  ...rest
}) {
  // Not useId: this component renders once per page and the keyframe names only
  // have to be unique in the document, but useId's output contains colons,
  // which are not valid in a CSS identifier without escaping.
  const p = { ...PATH, ...path }

  const css =
    `${keyframes(1, 'ish-r', p)}${keyframes(-1, 'ish-l', p)}` +
    // Pausing rather than disabling keeps the corridor whole: every card is
    // already dropped mid-flight by its negative delay, so it freezes as a
    // finished still instead of collapsing onto the axis.
    //
    // !important is load-bearing, not defensive. Each card sets the `animation`
    // shorthand inline, because the per-card delay is computed, and a shorthand
    // resets every longhand it covers — including animation-play-state, to
    // `running`. An inline declaration outranks any selector, so without this
    // the rule below parses fine, matches fine, and does nothing: verified in a
    // browser under prefers-reduced-motion, where the cards kept moving.
    `@media(prefers-reduced-motion:reduce){.ish-c{animation-play-state:paused!important}}`

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      {...rest}
      style={{ containerType: 'inline-size', ...style }}
    >
      <style>{css}</style>

      <div
        aria-hidden="true"
        data-testid="stream-stage"
        className="pointer-events-none absolute inset-0"
        style={{
          perspective: `${p.perspective}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          ...(fadeBelow == null
            ? null
            : {
                // Masks the container, not the cards, so a card dissolves as it
                // crosses the line rather than each one fading on its own clock.
                maskImage: `linear-gradient(to bottom, #000 ${fadeBelow}%, transparent 100%)`,
                WebkitMaskImage: `linear-gradient(to bottom, #000 ${fadeBelow}%, transparent 100%)`,
              }),
        }}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          {['ish-r', 'ish-l'].map((name) =>
            Array.from({ length: cards }, (_, i) => {
              // Both rails walk the same sequence, so the left side mirrors
              // the right at every depth.
              const img = images[i % Math.max(images.length, 1)]
              return (
                <div
                  key={`${name}-${i}`}
                  data-testid="stream-card"
                  role="img"
                  className="ish-c absolute overflow-hidden"
                  style={{
                    left: '50%',
                    top: `${axis}%`,
                    width: `${p.cardWidth}cqw`,
                    height: `${p.cardHeight}cqw`,
                    marginLeft: `${-p.cardWidth / 2}cqw`,
                    marginTop: `${-p.cardHeight / 2}cqw`,
                    borderRadius: `${p.cardRadius}cqw`,
                    animation: `${name} ${speed}s linear infinite`,
                    // Negative delay drops each card mid-flight, so the
                    // corridor is already full on the first frame.
                    animationDelay: `${-(i * speed) / cards}s`,
                    backfaceVisibility: 'hidden',
                  }}
                >
                  {img ? (
                    <img
                      src={img.src}
                      alt={img.alt ?? ''}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : null}
                </div>
              )
            }),
          )}
        </div>
      </div>

      {children}
    </div>
  )
}
