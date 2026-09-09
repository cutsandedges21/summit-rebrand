import { Link, NavLink } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { useReducedMotion } from '../lib/motion.js'
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
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [landed, setLanded] = useState(false)
  const theme = useBackdropTheme()

  // Hide on the way down, reappear the moment you scroll up.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setLanded(y > 40)
    if (reduced) return
    const previous = scrollY.getPrevious() ?? 0
    setHidden(y > 140 && y > previous)
  })

  return (
    <motion.header
      className="sticky top-0 z-50 flex items-baseline justify-between px-6 py-5 md:px-12"
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
      <Link to="/" aria-label="mossimo Studios, home" className="group">
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
    </motion.header>
  )
}
