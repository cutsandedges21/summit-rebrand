import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Scroll-driven page background, modelled on memoiredencrier.com.
 *
 * Their version is a fixed, full-viewport colour plate under the content with
 * `transition: background-color .8s cubic-bezier(.445,.05,.55,.95)`, swapped by
 * a class as each section takes the viewport. Same idea here, with their pink
 * (#ff98e2) sampled straight off `.articles-lobby__bg.article-type--2`.
 *
 * Painting the plate rather than the sections is what makes the change read as
 * one continuous wash instead of a hard edge scrolling past.
 */
export const THEMES = {
  paper: '#f9f7ef',
  clay: '#ebe5d8',
  pink: '#ff98e2',
}

export const BACKDROP_EASE = 'cubic-bezier(0.445, 0.05, 0.55, 0.95)'

const BackdropContext = createContext(null)

export function Backdrop({ children }) {
  const [theme, setTheme] = useState('paper')
  // A Map, not state: registration happens during layout for every section on
  // the page, and re-rendering the whole tree once per section would thrash.
  const sections = useRef(new Map())
  const frame = useRef(0)

  const resolve = useCallback(() => {
    frame.current = 0
    // Whichever themed section owns the middle of the viewport wins. Measuring
    // against a single line rather than "most visible" keeps the swap
    // predictable when two sections are on screen at once.
    const line = window.innerHeight / 2
    let winner = 'paper'
    let best = Infinity

    for (const [node, name] of sections.current) {
      const box = node.getBoundingClientRect()
      if (box.top <= line && box.bottom >= line) {
        // Nested sections: the tightest match around the line is the real one.
        if (box.height < best) {
          best = box.height
          winner = name
        }
      }
    }
    setTheme(winner)
  }, [])

  const schedule = useCallback(() => {
    if (frame.current) return
    frame.current = requestAnimationFrame(resolve)
  }, [resolve])

  const register = useCallback(
    (node, name) => {
      sections.current.set(node, name)
      schedule()
      return () => {
        sections.current.delete(node)
        schedule()
      }
    },
    [schedule],
  )

  useEffect(() => {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      // Clearing the handle is not housekeeping, it is the whole thing.
      // `schedule` bails when frame.current is set, so a cancelled-but-not-
      // cleared handle wedges it permanently — which under StrictMode's
      // mount/unmount/mount is guaranteed to happen on the first render.
      if (frame.current) {
        cancelAnimationFrame(frame.current)
        frame.current = 0
      }
    }
  }, [schedule])

  // The browser chrome should follow the page, or the pink section ends under a
  // cream status bar on a phone.
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', THEMES[theme])
  }, [theme])

  const value = useMemo(() => ({ register, theme }), [register, theme])

  return (
    <BackdropContext.Provider value={value}>
      <div
        data-testid="backdrop"
        data-theme={theme}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundColor: THEMES[theme],
          transition: `background-color 0.8s ${BACKDROP_EASE}`,
        }}
      />
      {children}
    </BackdropContext.Provider>
  )
}

/**
 * Attach the returned ref to a section to have it drive the page colour.
 * Outside a <Backdrop> this is inert, which is what keeps components that use
 * it renderable on their own in unit tests.
 */
export function useBackdrop(theme) {
  const context = useContext(BackdropContext)
  const ref = useRef(null)
  const register = context?.register

  useEffect(() => {
    if (!register || !ref.current || !theme) return undefined
    return register(ref.current, theme)
  }, [register, theme])

  return ref
}

export const useBackdropTheme = () => useContext(BackdropContext)?.theme ?? 'paper'
