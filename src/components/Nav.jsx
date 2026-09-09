import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useIsMobile, useReducedMotion } from '../lib/motion.js'
import { EASE } from '../lib/textify.jsx'
import { BACKDROP_EASE, THEMES, useBackdropTheme } from './Backdrop.jsx'

const LINKS = [
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [landed, setLanded] = useState(false)
  const [open, setOpen] = useState(false)
  const theme = useBackdropTheme()
  const { pathname } = useLocation()

  // Hide on the way down, reappear the moment you scroll up. Never while the
  // menu is open: retracting the bar would take the close button with it.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setLanded(y > 40)
    if (reduced || open) return
    const previous = scrollY.getPrevious() ?? 0
    setHidden(y > 140 && y > previous)
  })

  // Tapping a link navigates without unmounting the panel on its own.
  useEffect(() => setOpen(false), [pathname])

  // The panel covers the page, so the document behind it must not scroll with
  // it. Lenis drives the real window scroll, and it respects overflow:hidden on
  // <body> the same way a native scroll does.
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 md:px-12"
      animate={reduced ? false : { y: hidden ? '-115%' : '0%' }}
      transition={{ duration: 0.55, ease: EASE.expoInOut }}
      // Once the page has moved, the bar takes the CURRENT backdrop colour
      // rather than a fixed paper tint — otherwise it sits as a cream slab over
      // the pink section. Transparent at the top so it floats on the hero.
      style={{
        backgroundColor: landed ? THEMES[theme] : 'transparent',
        transition: `background-color 0.8s ${BACKDROP_EASE}`,
      }}
    >
      <Link
        to="/"
        aria-label="mossimo Studios, home"
        className="group -my-2 flex min-h-11 items-center py-2"
      >
        <img
          src="/brand/logo-wordmark.png"
          alt="mossimo Studios"
          width={2069}
          height={760}
          /* The wordmark has a real alpha channel, so it needs no blend mode.
             It used to be a flat cream rectangle held together by
             mix-blend-multiply, which only ever worked while the backdrop was
             that same cream — over the pink section it multiplied into a
             visible darker box. */
          className="h-7 w-auto transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:-rotate-2 group-hover:scale-105 motion-reduce:transition-none md:h-9"
        />
      </Link>
      {/* Five 11px links and a wordmark do not fit across a phone. At 390px the
          gap between the two was exactly 0px and at 360px they overlapped, and
          every link was a 25px-tall target against a 44px minimum. Below the md
          breakpoint the links move into a panel instead.

          Rendered as one branch or the other rather than two CSS-hidden copies:
          duplicating them would put two "Portfolio" links in the accessibility
          tree at all times, which is both wrong for a screen reader and
          ambiguous for getByRole. */}
      {mobile ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="label -mr-2 flex min-h-11 items-center px-2 py-2 text-ink"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      ) : (
        <nav className="flex gap-1 font-sans text-[11px] font-medium md:gap-2 md:text-[13px]">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className="group relative px-2 py-1">
              {({ isActive }) => (
                <>
                  {/* The active fill is one element that slides between items via
                      layoutId, so navigating reads as the marker moving rather
                      than one chip vanishing and another appearing. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-accent"
                      transition={{ duration: 0.5, ease: EASE.expoInOut }}
                    />
                  )}
                  {/* Inactive items get a rule that wipes in from the left. */}
                  {!isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0.5 left-2 right-2 h-px origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                    />
                  )}
                  <span
                    className={`relative transition-colors duration-300 ${
                      isActive ? 'font-semibold' : 'text-ink-muted group-hover:text-ink'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      <AnimatePresence>
        {mobile && open && (
          <motion.nav
            id="mobile-menu"
            data-testid="mobile-menu"
            key="mobile-menu"
            className="fixed inset-0 -z-10 flex flex-col gap-1 overflow-y-auto px-6 pt-24 pb-10"
            style={{ backgroundColor: THEMES[theme] }}
            initial={reduced ? false : { y: '-100%' }}
            animate={reduced ? false : { y: '0%' }}
            exit={reduced ? undefined : { y: '-100%' }}
            transition={{ duration: 0.55, ease: EASE.expoInOut }}
          >
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className="group relative flex min-h-12 items-center border-t border-rule font-display leading-none tracking-tight"
                style={{ fontSize: 'var(--text-sub)' }}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span aria-hidden="true" className="absolute inset-y-2 -left-2 w-1 bg-accent" />
                    )}
                    <span className={isActive ? 'relative' : 'relative text-ink-muted'}>
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
            {/* The panel is full height, so the space under five links would
                otherwise be a large blank field. The two things a visitor on a
                phone is most likely to want next go in it. */}
            <div className="mt-auto border-t border-rule pt-5">
              <a
                href="mailto:mossimo.studios@gmail.com"
                className="flex min-h-11 items-center font-sans text-[13px] text-ink-muted"
              >
                mossimo.studios@gmail.com
              </a>
              <p className="font-sans text-[11px] text-ink-faint">
                Based in Montreal. Working across Canada.
              </p>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
