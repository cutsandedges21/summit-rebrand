import { motion } from 'framer-motion'
import { useReducedMotion } from '../lib/motion.js'

/**
 * Infinite horizontal ticker.
 *
 * The track holds the items twice and travels exactly -50%, so the second copy
 * lands precisely where the first began and the loop has no seam. Any other
 * distance shows a jump once per cycle.
 *
 * Linear easing on purpose — an eased marquee visibly slows at the loop point,
 * which is the one place the repeat becomes obvious.
 *
 * Decorative: every discipline named here is also stated as text on Services,
 * so hiding the ticker from assistive tech loses nothing and spares it a
 * doubled list of words.
 */
const Item = ({ children }) => (
  <span className="flex shrink-0 items-center gap-8 pr-8">
    <span className="font-display" style={{ fontSize: 'var(--text-sub)' }}>
      {children}
    </span>
    {/* A filled square, not a coloured glyph. The accent is 1.1:1 on paper, so
        as a letterform it is invisible — it only works as a shape. */}
    <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 bg-accent" />
  </span>
)

export default function Marquee({ items, speed = 34, className = '' }) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div aria-hidden="true" className={`overflow-x-auto border-y border-rule py-6 ${className}`}>
        <div className="flex w-max items-center">
          {items.map((item) => (
            <Item key={item}>{item}</Item>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div aria-hidden="true" className={`overflow-hidden border-y border-rule py-6 ${className}`}>
      <motion.div
        className="flex w-max items-center"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {[...items, ...items].map((item, i) => (
          <Item key={i}>{item}</Item>
        ))}
      </motion.div>
    </div>
  )
}
