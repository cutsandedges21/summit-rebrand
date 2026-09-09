import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'
import Cursor from './Cursor.jsx'
import { Backdrop } from './Backdrop.jsx'
import { BUILDS } from '../lib/builds.js'
import { useReducedMotion } from '../lib/motion.js'
import { useSmoothScroll, scrollToTop } from '../lib/smooth-scroll.js'
import { EASE } from '../lib/textify.jsx'

const SUFFIX = 'mossimo Studios'

const TITLES = {
  '/': 'Websites for businesses that answer the phone',
  '/portfolio': 'Portfolio',
  '/services': 'Services',
  '/pricing': 'Pricing',
  '/about': 'About',
  '/faq': 'Questions',
  '/contact': 'Contact',
  '/privacy-policy': 'Privacy Policy',
  '/terms-of-service': 'Terms of Service',
}

/**
 * A single-page app keeps whatever <title> index.html shipped with unless
 * something changes it. Every route sharing one title is poor for search and
 * genuinely awkward on a site that sells local SEO as a service — it is also
 * invisible in a browser tab until you have several open.
 */
function titleFor(pathname) {
  const known = TITLES[pathname]
  if (known) return `${known} — ${SUFFIX}`

  const build = BUILDS.find((b) => pathname === `/portfolio/${b.slug}`)
  if (build) return `${build.name} — ${SUFFIX}`

  return SUFFIX
}

export default function Layout() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()

  // Lenis, in window mode. It smooths the real document scroll rather than
  // transforming a wrapper, which is what keeps position:sticky alive — see
  // lib/smooth-scroll.js.
  useSmoothScroll()

  useEffect(() => {
    scrollToTop()
  }, [pathname])

  useEffect(() => {
    document.title = titleFor(pathname)
  }, [pathname])

  return (
    <Backdrop>
      <Cursor />
      <Nav />
      <main>
        {/* Routes cross-fade rather than snapping. Two constraints shape this:
            `mode="wait"` because with both pages mounted the outgoing one still
            occupies layout and the incoming page lands at the wrong offset; and
            opacity ONLY, no transform. A transformed ancestor becomes the
            containing block for its descendants, and the pinned process column
            and the portfolio preview are both position:sticky. Fading costs us
            nothing here — the sections animate themselves in on arrival. */}
        <AnimatePresence mode="wait" initial={false}>
          {reduced ? (
            <Outlet key={pathname} />
          ) : (
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.45, ease: EASE.expoInOut } }}
              exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE.expoInOut } }}
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </Backdrop>
  )
}
