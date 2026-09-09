import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'
import { BUILDS } from '../lib/builds.js'

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

  // Native scroll — no wheel hijacking. Sticky positioning depends on this.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.title = titleFor(pathname)
  }, [pathname])

  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
