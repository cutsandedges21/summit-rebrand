import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useIsMobile, useReducedMotion } from '../lib/motion.js'

/**
 * Pulls its child toward the pointer while the pointer is over it, then springs
 * back on leave. Applied to the call-to-action buttons.
 *
 * `strength` is the fraction of the cursor's offset from centre that the child
 * follows; past about 0.4 it stops feeling like weight and starts feeling like
 * the button is running away from you.
 */
export default function Magnetic({ children, strength = 0.3, className, ...rest }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 260, damping: 18, mass: 0.6 }
  const dx = useSpring(x, spring)
  const dy = useSpring(y, spring)
  // The label drifts a little further than its box, which reads as the surface
  // stretching rather than the whole thing sliding.
  const labelX = useTransform(dx, (v) => v * 0.35)
  const labelY = useTransform(dy, (v) => v * 0.35)

  if (reduced || mobile) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    )
  }

  const onMove = (event) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    x.set((event.clientX - (box.left + box.width / 2)) * strength)
    y.set((event.clientY - (box.top + box.height / 2)) * strength)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: dx, y: dy, display: 'inline-block' }}
      className={className}
      {...rest}
    >
      <motion.span style={{ x: labelX, y: labelY, display: 'inline-block' }}>
        {children}
      </motion.span>
    </motion.span>
  )
}
