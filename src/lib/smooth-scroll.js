import Lenis from 'lenis'
import { useEffect } from 'react'
import { useReducedMotion } from './motion.js'

/**
 * Lenis, the same smooth-scroll memoiredencrier.com runs.
 *
 * It is deliberately the plain window mode, NOT the transform-on-a-wrapper
 * mode: wrapper mode puts the whole page inside a transformed element, and a
 * transformed ancestor silently kills `position: sticky`. This site's pinned
 * process column and portfolio preview are both sticky, and two e2e tests
 * assert they hold position. Window mode animates the real document scroll, so
 * sticky, the IntersectionObservers and the scroll-linked hero all still see
 * ordinary scroll events.
 */
let instance = null

export const getLenis = () => instance

/** Jump without smoothing — for route changes, where easing to the top is jank. */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

/** Smooth-scroll to an element, routed through Lenis so the two do not fight. */
export function scrollToElement(node, options = {}) {
  if (!node) return
  if (instance) instance.scrollTo(node, { offset: 0, duration: 1.1, ...options })
  else node.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return undefined

    const lenis = new Lenis({
      // Long enough to feel weighted, short enough that a wheel flick still
      // lands where you expect.
      duration: 1.05,
      // expo.out — fast departure, long settle. Matches the type easing.
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      // Touch already has native inertia; smoothing it too feels laggy.
      syncTouch: false,
      touchMultiplier: 1.6,
    })
    instance = lenis

    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      instance = null
    }
  }, [reduced])
}
