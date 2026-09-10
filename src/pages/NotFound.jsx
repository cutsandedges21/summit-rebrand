import { motion } from 'framer-motion'
import Reveal from '../components/Reveal.jsx'
import AccentButton, { ArrowLink } from '../components/AccentButton.jsx'
import { useReducedMotion } from '../lib/motion.js'
import { EASE } from '../lib/textify.jsx'

/**
 * Centred stack: the number, then the wordmark under it, then a way out.
 *
 * The number is sized in vw with a floor and a ceiling rather than a fixed
 * size, because it IS the page — it has to carry a phone and a wide desktop
 * without becoming either a detail or a scrollbar. The ceiling is what keeps it
 * from running away on a large screen.
 *
 * The floor is the part worth knowing about: Instrument Serif loads with
 * font-display:swap, and until it arrives these digits are set in Georgia,
 * where the same "404" measures about 40% wider. The vw share has to leave room
 * for the fallback's metrics, not just the webfont's, or the page shows a
 * horizontal scrollbar for the length of the swap on a cold cache.
 */
export default function NotFound() {
  const reduced = useReducedMotion()

  return (
    <div
      data-testid="not-found-page"
      // svh, not vh: on a phone browser vh is the tallest the viewport ever
      // gets, with the toolbars retracted, so a vh-sized "fits the screen"
      // block does not fit the screen you are actually looking at. The 88px is
      // the sticky header this sits under.
      className="flex min-h-[calc(100svh-88px)] flex-col items-center justify-center px-6 py-12 text-center md:px-12"
    >
      <Reveal as="p" variant="up" duration={0.7} className="label mb-8">
        Error 404
      </Reveal>

      {/* aria-label because the visible content is a bare number and a picture:
          read out, that is "four hundred and four" and then nothing at all. */}
      <motion.h1
        aria-label="404 — page not found"
        className="font-display leading-none"
        // Tracking, not a scaleX. Stretching the glyphs would thin their
        // verticals against their horizontals and the serif would start to look
        // like a condensed face pulled out of shape; spacing them apart leaves
        // the letterforms alone. The negative margin cancels the trailing space
        // letter-spacing adds after the LAST digit, which would otherwise push
        // the number off centre by half that amount.
        style={{
          fontSize: 'clamp(88px, 24vw, 240px)',
          letterSpacing: '0.16em',
          marginRight: '-0.16em',
        }}
        initial={reduced ? false : { y: '12%', opacity: 0 }}
        animate={reduced ? false : { y: '0%', opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE.expoInOut }}
      >
        <span aria-hidden="true">404</span>
      </motion.h1>

      <motion.img
        src="/brand/logo-wordmark.png"
        alt=""
        aria-hidden="true"
        width={2069}
        height={760}
        className="mt-6 h-auto"
        style={{ width: 'min(340px, 58vw)' }}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.18, ease: EASE.expoInOut }}
      />

      <div className="mt-12 max-w-xl">
        <Reveal
          as="p"
          variant="up"
          className="font-display leading-tight tracking-tight"
          style={{ fontSize: 'var(--text-sub)' }}
        >
          This page went missing.
        </Reveal>
        <Reveal
          as="p"
          variant="up"
          delay={0.12}
          className="mt-4 font-sans leading-relaxed text-ink-muted"
        >
          The link is broken, or the page moved and the old address stayed behind. Everything
          else is still where you left it.
        </Reveal>

        <Reveal
          variant="up"
          delay={0.22}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          <AccentButton to="/">Back to the homepage</AccentButton>
          <ArrowLink to="/portfolio" className="label underline">
            See the work
          </ArrowLink>
        </Reveal>
      </div>
    </div>
  )
}
