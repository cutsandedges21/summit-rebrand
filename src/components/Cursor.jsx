import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useIsMobile, useReducedMotion } from '../lib/motion.js'

/**
 * A trailing ring that lags the real cursor and swells over anything
 * interactive. The native cursor is left visible on purpose — hiding it is the
 * usual move and the usual regret, because every fallback (text selection,
 * form fields, a dropped frame) then has no pointer at all.
 *
 * Skipped entirely on touch and under reduced motion, where a lagging ring is
 * either meaningless or actively unpleasant.
 */
export default function Cursor() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ring = { stiffness: 380, damping: 32, mass: 0.5 }
  const rx = useSpring(x, ring)
  const ry = useSpring(y, ring)

  const off = reduced || mobile

  useEffect(() => {
    if (off) return undefined

    const onMove = (event) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setVisible(true)
      // `closest` rather than a hover listener per element: the page rebuilds
      // its links on every route change, and this stays correct for free.
      setActive(Boolean(event.target.closest?.('a, button, [data-cursor="grow"]')))
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [off, x, y])

  if (off) return null

  return (
    <motion.div
      aria-hidden="true"
      data-testid="cursor"
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden rounded-full border border-ink mix-blend-multiply md:block"
      style={{ x: rx, y: ry, height: 34, width: 34, marginLeft: -17, marginTop: -17 }}
      animate={{
        scale: active ? 1.9 : 1,
        opacity: visible ? (active ? 0.65 : 0.35) : 0,
        backgroundColor: active ? 'rgba(249, 234, 85, 0.55)' : 'rgba(249, 234, 85, 0)',
      }}
      transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
    />
  )
}
