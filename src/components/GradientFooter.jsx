import { useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/motion.js'

/**
 * Gradient footer glow, adapted from Ruixen UI's gradient footer.
 *
 * The content reads first; a blurred band is pinned to the bottom of the
 * viewport and stretches up from the floor over the last stretch of scroll,
 * reaching full height exactly as you hit the end of the page. One inline
 * <svg> — no canvas, no scroll spacer.
 *
 * Changes from the original: it is JSX rather than TSX, the Next.js "use
 * client" directive is gone, the palette is this site's rather than a rainbow,
 * and there is a reduced-motion path (see below).
 */
const VBW = 1271
const VBH = 599

/**
 * Floor (0) to top (1), and every stop is a brand token rather than a derived
 * tint — ink anchors it to the floor, blush and accent carry the colour, paper
 * is the luminous band between them, and it fades out through blush.
 *
 * The long ink -> blush run does the work the original's dark ember -> blue did:
 * interpolating across that distance passes through a plum on its own, so the
 * ramp gets its bridge tone without inventing a colour that is not in the
 * palette.
 *
 * The fields are named for the SVG attributes they become. That is not
 * incidental: a plain `color:` key trips the accent guard in
 * tests/unit/accent-rule.test.js, which forbids the accent on letterforms
 * because it is ~1.4:1 on paper. This is a gradient stop filling a blurred,
 * aria-hidden shape — the fill the rule permits — and `stopColor` says so.
 */
const BRAND_STOPS = [
  { offset: 0, stopColor: '#1b1a15' }, // ink
  { offset: 0.22, stopColor: '#ff98e2' }, // blush
  { offset: 0.42, stopColor: '#f9f7ef' }, // paper
  { offset: 0.6, stopColor: '#f9ea55' }, // accent
  { offset: 0.78, stopColor: '#ff98e2' }, // blush
  { offset: 1, stopColor: '#ff98e2', stopOpacity: 0 },
]

/**
 * Height curve: a gentle power falloff, giving a flat, pyramid-like rise —
 * short at the edges, tallest in the middle.
 */
function bellHeights(n, peak, valley) {
  const out = []
  const mid = (n - 1) / 2
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid // 0 centre -> 1 edge
    const eased = 1 - t ** 1.24
    out.push(peak * VBH * (valley + (1 - valley) * eased))
  }
  return out
}

const clamp01 = (v) => Math.max(0, Math.min(1, v))

export default function GradientFooter({
  children,
  gradientHeight = '52vh',
  // 0 keeps the glow hidden until the last screen. A resting strip would sit
  // pinned across the bottom of every viewport, and with ink on the floor of
  // the ramp that reads as a UI bar laid over the page rather than as part of
  // the footer.
  minReveal = 0,
  bars = 9,
  blur = 15,
  peak = 0.98,
  valley = 0.55,
  stops = BRAND_STOPS,
  className,
  style,
}) {
  const uid = useId().replace(/:/g, '')
  const bandRef = useRef(null)
  const reduced = useReducedMotion()
  // minReveal = flat on the floor, 1 = risen to full height.
  const [progress, setProgress] = useState(minReveal)

  useEffect(() => {
    // Under reduced motion the band is laid out in flow at full height instead
    // of being scaled by scroll position, so there is nothing to track.
    if (reduced) return undefined
    const el = bandRef.current
    if (!el) return undefined

    // Bind to the element's OWN window so this tracks the right scroll context
    // wherever it is mounted.
    const doc = el.ownerDocument
    const win = doc.defaultView ?? window

    const measure = () => {
      // offsetHeight ignores the transform, so the band can measure itself.
      const h = el.offsetHeight || 1
      // How much scroll is left before the end of the page. The glow starts
      // rising once that is within its own height, and is full at the bottom.
      const left = doc.documentElement.scrollHeight - win.innerHeight - win.scrollY
      setProgress(minReveal + (1 - minReveal) * clamp01((h - left) / h))
    }

    measure()
    // Lenis drives the real window scroll, so ordinary scroll events fire and
    // this needs no special integration.
    win.addEventListener('scroll', measure, { passive: true })
    win.addEventListener('resize', measure, { passive: true })
    return () => {
      win.removeEventListener('scroll', measure)
      win.removeEventListener('resize', measure)
    }
  }, [minReveal, reduced])

  const colW = VBW / bars

  const svg = (
    <svg
      style={{ height: '100%', width: '100%', display: 'block' }}
      viewBox={`0 0 ${VBW} ${VBH}`}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`grad-${uid}`} x1="0" y1="1" x2="0" y2="0">
          {stops.map((s, i) => (
            <stop
              key={i}
              offset={s.offset}
              stopColor={s.stopColor}
              // Explicit stopOpacity rather than an 8-digit hex: the alpha in
              // #rrggbbaa is not honoured by every SVG renderer.
              stopOpacity={s.stopOpacity ?? 1}
            />
          ))}
        </linearGradient>
        <filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={blur} />
        </filter>
      </defs>
      {bellHeights(bars, peak, valley).map((barH, i) => (
        <g key={i} filter={`url(#blur-${uid})`}>
          <rect
            x={i * colW}
            y={VBH - barH}
            width={colW * 1.23}
            height={barH}
            fill={`url(#grad-${uid})`}
          />
        </g>
      ))}
    </svg>
  )

  // Reduced motion: the glow is the same picture, just placed in normal flow at
  // the end of the document rather than pinned and scaled by scroll position.
  // No reserved padding, because it occupies its own space.
  if (reduced) {
    return (
      <footer className={className} style={style}>
        {children}
        <div aria-hidden="true" style={{ height: gradientHeight, pointerEvents: 'none' }}>
          {svg}
        </div>
      </footer>
    )
  }

  return (
    // The glow is pinned to the viewport, so the footer reserves the same
    // height beneath its content for it to land in.
    <footer className={className} style={{ paddingBottom: gradientHeight, ...style }}>
      {children}

      {/* Fixed to the viewport, so no ancestor may be transformed or filtered —
          that would capture it into the ancestor's box. The route wrapper in
          Layout.jsx animates opacity only, for the same class of reason. */}
      <div
        ref={bandRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: gradientHeight,
          pointerEvents: 'none',
          transformOrigin: 'bottom',
          transform: `scaleY(${progress})`,
          willChange: 'transform',
          // Above the page's colour plate, below the header and the mobile
          // menu panel, which both sit at z-50 and up.
          zIndex: 0,
        }}
      >
        {svg}
      </div>
    </footer>
  )
}
