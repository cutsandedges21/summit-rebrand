import { motion } from 'framer-motion'
import { EASE } from '../lib/textify.jsx'
import { useReducedMotion } from '../lib/motion.js'

/**
 * The workhorse scroll reveal. Everything that is not type uses this, so the
 * whole site enters on one curve and one duration instead of a dozen
 * near-misses that read as sloppiness rather than variety.
 */
const VARIANTS = {
  up: {
    hidden: { y: 34, opacity: 0 },
    shown: { y: 0, opacity: 1 },
  },
  // For images: uncover from the bottom edge while the picture settles back to
  // its own scale, so the frame and its contents move at different rates.
  curtain: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
    shown: { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 },
  },
  wipe: {
    hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
    shown: { clipPath: 'inset(0% 0% 0% 0%)' },
  },
  fade: {
    hidden: { opacity: 0 },
    shown: { opacity: 1 },
  },
  rule: {
    hidden: { scaleX: 0 },
    shown: { scaleX: 1 },
  },
}

/**
 * Anything rendered through <Reveal as="..."> must appear here. An unmapped tag
 * falls back to motion.div, which silently turns a <dl> into a <div> and takes
 * the list semantics with it.
 */
const MOTION = {
  div: motion.div,
  section: motion.section,
  span: motion.span,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  dl: motion.dl,
  dt: motion.dt,
  dd: motion.dd,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  figure: motion.figure,
  figcaption: motion.figcaption,
  img: motion.img,
  a: motion.a,
  nav: motion.nav,
  header: motion.header,
}

export default function Reveal({
  children,
  variant = 'up',
  as = 'div',
  delay = 0,
  duration = 0.9,
  stagger = 0,
  amount = 0.35,
  once = true,
  className,
  style,
  ...rest
}) {
  const reduced = useReducedMotion()
  const Tag = MOTION[as] ?? motion.div

  if (reduced) {
    const Plain = as
    return (
      <Plain className={className} style={style} {...rest}>
        {children}
      </Plain>
    )
  }

  const preset = VARIANTS[variant] ?? VARIANTS.up

  return (
    <Tag
      className={className}
      style={{ ...style, ...(variant === 'rule' ? { transformOrigin: 'left' } : null) }}
      variants={{
        hidden: preset.hidden,
        shown: {
          ...preset.shown,
          transition: { duration, ease: EASE.expoInOut, delay, staggerChildren: stagger },
        },
      }}
      initial="hidden"
      whileInView="shown"
      viewport={{ once, amount }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** A child of a staggering <Reveal>: inherits the parent's timing. */
export function RevealItem({ children, variant = 'up', as = 'div', className, style, ...rest }) {
  const reduced = useReducedMotion()
  const Tag = MOTION[as] ?? motion.div
  const preset = VARIANTS[variant] ?? VARIANTS.up

  if (reduced) {
    const Plain = as
    return (
      <Plain className={className} style={style} {...rest}>
        {children}
      </Plain>
    )
  }

  return (
    <Tag
      className={className}
      style={style}
      variants={{
        hidden: preset.hidden,
        shown: { ...preset.shown, transition: { duration: 0.9, ease: EASE.expoInOut } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
