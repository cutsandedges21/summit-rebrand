import { motion } from 'framer-motion'
import { Fragment } from 'react'
import { useReducedMotion } from './motion.js'

/**
 * Split-text animations ported from Textify.js
 * (https://textify-js.vercel.app/example).
 *
 * Textify is a GSAP wrapper: it splits an element into chars/words/lines, then
 * runs `gsap.from(units, {...animateProps, duration, stagger, ease})` behind an
 * IntersectionObserver at threshold 0.5, once. Every PRESET below carries the
 * exact numbers from that example page — only the runtime differs, because this
 * site already ships framer-motion and Textify is not on npm (its line splitter
 * is a verbatim copy of GSAP's paid SplitText plugin, which we will not vendor).
 *
 * GSAP eases are named curves; these are their cubic-bezier equivalents:
 *   expo.inOut -> easeInOutExpo, power2 (=power2.out) -> easeOutCubic
 */
export const EASE = {
  expoInOut: [0.87, 0, 0.13, 1],
  power2: [0.33, 1, 0.68, 1],
  // memoiredencrier.com's background cross-fade curve, kept here so the type and
  // the backdrop share one sense of timing.
  sine: [0.445, 0.05, 0.55, 0.95],
}

/**
 * `from` is Textify's `animateProps` — the state each unit animates OUT of.
 * `mask` clips each unit to its own box so a 100% travel reads as a reveal
 * rather than as text sliding over its neighbours.
 */
export const PRESETS = {
  // --- Textify example, heading row (per-character) ---------------------
  pop: { by: 'chars', duration: 0.7, stagger: 0.025, ease: EASE.expoInOut, from: { opacity: 0, scale: 0 } },
  skewIn: { by: 'chars', duration: 0.7, stagger: 0.05, ease: EASE.power2, from: { x: '100%', opacity: 0, skewX: -45 } },
  skewDrop: { by: 'chars', duration: 0.7, stagger: 0.05, ease: EASE.expoInOut, from: { y: '-100%', opacity: 0, skewX: -45 } },
  spin: { by: 'chars', duration: 0.7, stagger: 0.05, ease: EASE.expoInOut, from: { rotate: 60, scale: 0 } },

  // --- Textify example, paragraph row (per-line, `largeText: true`) ------
  linesZoom: { by: 'lines', duration: 0.7, stagger: 0.075, ease: EASE.power2, origin: 'center center', from: { scale: 0, opacity: 0 } },
  linesTilt: { by: 'lines', duration: 0.7, stagger: 0.075, ease: EASE.power2, origin: 'left top', from: { rotate: 30, opacity: 0 } },
  linesDrop: { by: 'lines', duration: 0.7, stagger: 0.1, ease: EASE.expoInOut, origin: 'left top', from: { y: '-100%', rotate: -30 } },
  linesFade: { by: 'lines', duration: 0.7, stagger: 0.1, ease: EASE.expoInOut, origin: 'left top', from: { opacity: 0 } },

  // --- Textify's own banner config (the masked rise) --------------------
  rise: { by: 'chars', duration: 0.7, stagger: 0.025, ease: EASE.expoInOut, mask: true, from: { y: '100%' } },
  riseWords: { by: 'words', duration: 0.7, stagger: 0.04, ease: EASE.expoInOut, mask: true, from: { y: '100%' } },
  riseLines: { by: 'lines', duration: 0.7, stagger: 0.075, ease: EASE.power2, mask: true, from: { y: '100%' } },
}

const IDENTITY = { x: 0, y: 0, opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }

/** Only reset what the preset actually displaced, so nothing else is pinned. */
function restedFrom(from) {
  const rest = {}
  for (const key of Object.keys(from)) {
    if (key in IDENTITY) rest[key] = IDENTITY[key]
  }
  return rest
}

/**
 * Normalise children into flat segments. A segment is a run of text plus the
 * wrapper it belongs in, which is how `We build <em>websites</em>` survives
 * being taken apart: the <em> is not a unit to animate, it is a style that
 * some of the units carry.
 */
function toSegments(children) {
  const out = []
  const walk = (node, em) => {
    if (node === null || node === undefined || node === false) return
    if (typeof node === 'string' || typeof node === 'number') {
      out.push({ text: String(node), em })
      return
    }
    if (Array.isArray(node)) {
      for (const child of node) walk(child, em)
      return
    }
    if (node.type === 'br') {
      out.push({ text: '\n', em })
      return
    }
    if (node.props) walk(node.props.children, em || node.type === 'em')
  }
  walk(children, false)
  return out
}

const plainText = (segments) => segments.map((s) => s.text).join('')

/**
 * Segments -> words. A word carries its own segments so a word straddling an
 * <em> boundary still renders both halves, and keeps the whitespace that
 * followed it so textContent survives the split unchanged.
 */
function toWords(segments) {
  const words = []
  let current = null
  const push = (chunk, em) => {
    if (!current) {
      current = { parts: [], trailing: '' }
      words.push(current)
    }
    current.parts.push({ text: chunk, em })
  }

  for (const segment of segments) {
    // Keep the delimiters: the gaps are content, not just spacing.
    for (const chunk of segment.text.split(/(\s+)/)) {
      if (chunk === '') continue
      if (/^\s+$/.test(chunk)) {
        if (current) {
          current.trailing += chunk
          current = null
        }
        // An authored <br> is a design decision about where the line turns, so
        // it survives the split as its own unit rather than collapsing into
        // ordinary whitespace.
        if (chunk.includes('\n')) words.push({ br: true })
        continue
      }
      push(chunk, segment.em)
    }
  }
  return words
}

/**
 * framer-motion 11 has no dynamic `motion.create`, and calling `motion(Tag)`
 * during render would mint a new component type every pass and remount the
 * whole run. A lookup keeps the identity stable.
 */
const MOTION = {
  span: motion.span,
  div: motion.div,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  li: motion.li,
}

/**
 * One animating unit. Variants (rather than per-element `animate`) are what let
 * a single parent stagger the whole run without every child needing a delay.
 */
function Piece({ mask, origin, variants, children, block }) {
  const flow = block ? 'block' : 'inline-block'
  const body = (
    <motion.span
      variants={variants}
      className={flow}
      style={{ transformOrigin: origin, willChange: 'transform, opacity' }}
    >
      {children}
    </motion.span>
  )

  if (!mask) return body
  return (
    <span
      className={`${flow} overflow-hidden align-bottom`}
      style={{ paddingBottom: '0.16em', marginBottom: '-0.16em' }}
    >
      {body}
    </span>
  )
}

const Segment = ({ part }) => (part.em ? <em>{part.text}</em> : part.text)

/**
 * Group words into lines at the AUTHORED breaks — the <br>s the design already
 * carries — rather than at wherever the text happens to wrap.
 *
 * Measuring real wrapped lines is the obvious alternative and it is a trap:
 * grouping words into line wrappers changes their layout, re-measuring the
 * result yields a different grouping, and the component oscillates until React
 * throws "Maximum update depth exceeded". Every fix for that (ghost copies,
 * freezing after the first pass) buys back jank on resize and webfont load.
 *
 * Authored breaks are stable, and on a site whose copy is hand-set they are
 * also the breaks anyone actually meant. Copy with no <br> animates as one
 * unit, which is what the masked block rise wants anyway.
 */
function toLines(words) {
  const lines = [[]]
  for (const word of words) {
    if (word.br) lines.push([])
    else lines[lines.length - 1].push(word)
  }
  return lines.filter((line) => line.length > 0)
}

/**
 * @param {object} props
 * @param {keyof PRESETS} props.preset  which Textify example to run
 * @param {string} [props.by]           override the preset's split granularity
 * @param {number} [props.delay]        seconds before the first unit moves
 */
export default function Textify({
  children,
  preset = 'rise',
  by,
  delay = 0,
  as: Tag = 'span',
  className,
  style,
  amount = 0.5,
  once = true,
  ...rest
}) {
  const config = PRESETS[preset] ?? PRESETS.rise
  const split = by ?? config.by
  const reduced = useReducedMotion()

  const segments = toSegments(children)
  const label = plainText(segments)
  const words = toWords(segments)

  // Reduced motion gets the finished text, not a slower version of the effect.
  // The authored <br>s have to come back as real breaks here: as bare "\n" they
  // would collapse to a space and silently reflow every heading on the site.
  if (reduced) {
    return (
      <Tag className={className} style={style} {...rest}>
        {segments.map((s, i) => {
          if (s.text === '\n') return <br key={i} />
          return s.em ? <em key={i}>{s.text}</em> : s.text
        })}
      </Tag>
    )
  }

  const child = {
    hidden: { ...config.from },
    shown: {
      ...restedFrom(config.from),
      transition: { duration: config.duration, ease: config.ease },
    },
  }
  const container = {
    hidden: {},
    shown: { transition: { staggerChildren: config.stagger, delayChildren: delay } },
  }

  // The gap between words is rendered as a text node BETWEEN the word boxes,
  // never inside them. Trailing whitespace at the end of an inline-block is
  // trimmed by white-space processing, which silently welds the copy into
  // "Webuildwebsitesforbusinesses".
  const renderWord = (word, i) =>
    word.br ? (
      <br key={i} />
    ) : (
      <Fragment key={i}>
        <span data-word={i} className="inline-block">
          {split === 'chars'
            ? word.parts.map((part, p) =>
                [...part.text].map((char, c) => (
                  <Piece
                    key={`${p}-${c}`}
                    mask={config.mask}
                    origin={config.origin}
                    variants={child}
                  >
                    {part.em ? <em>{char}</em> : char}
                  </Piece>
                )),
              )
            : word.parts.map((part, p) => <Segment key={p} part={part} />)}
        </span>
        {word.trailing}
      </Fragment>
    )

  let body
  if (split === 'chars') {
    body = words.map(renderWord)
  } else if (split === 'words') {
    body = words.map((word, i) =>
      word.br ? (
        <br key={i} />
      ) : (
        <Fragment key={i}>
          <Piece mask={config.mask} origin={config.origin} variants={child}>
            <span data-word={i} className="inline-block">
              {word.parts.map((part, p) => (
                <Segment key={p} part={part} />
              ))}
            </span>
          </Piece>
          {word.trailing}
        </Fragment>
      ),
    )
  } else {
    // One animating unit per authored line. `block` on the wrapper is what puts
    // each line on its own row now that the <br>s have been consumed.
    body = toLines(words).map((line, i) => (
      <Piece key={i} mask={config.mask} origin={config.origin} variants={child} block>
        {line.map((word, w) => renderWord(word, w))}
      </Piece>
    ))
  }

  const Motion = MOTION[Tag] ?? motion.span

  return (
    <Motion
      aria-label={label}
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount }}
      {...rest}
    >
      <span aria-hidden="true">{body}</span>
    </Motion>
  )
}
