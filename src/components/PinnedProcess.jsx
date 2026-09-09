import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { STEPS } from '../lib/process.js'
import { useIsMobile } from '../lib/motion.js'
import { scrollToElement } from '../lib/smooth-scroll.js'
import Textify, { EASE } from '../lib/textify.jsx'
import Reveal from './Reveal.jsx'
import { useBackdrop } from './Backdrop.jsx'

export default function PinnedProcess() {
  const [activeIndex, setActiveIndex] = useState(0)
  const stepRefs = useRef([])
  const mobile = useIsMobile()
  // A half-step warmer than the paper, so the page has somewhere to travel
  // between the hero and the pink pricing section rather than jumping.
  const section = useBackdrop('clay')

  useEffect(() => {
    if (mobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = stepRefs.current.indexOf(visible.target)
        if (index !== -1) setActiveIndex(index)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0.1, 0.5, 0.9] },
    )

    for (const el of stepRefs.current) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [mobile])

  return (
    <section ref={section} className="px-6 py-20 md:px-12">
      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <div
          data-testid="process-pin"
          data-pinned={String(!mobile)}
          className={`md:w-[44%] md:shrink-0 ${mobile ? '' : 'md:sticky md:top-16 md:self-start'}`}
        >
          <Reveal as="p" variant="up" duration={0.7} className="label">
            How this works
          </Reveal>
          <Textify
            as="h2"
            preset="riseLines"
            className="mt-2 font-display leading-[1.05] tracking-tight"
            style={{ fontSize: 'var(--text-section)' }}
          >
            Four steps, <br />
            start to live.
          </Textify>

          <ol className="mt-8 flex flex-col items-start gap-1">
            {STEPS.map((step, i) => (
              <li key={step.num}>
                <button
                  type="button"
                  data-testid="process-index-item"
                  data-active={String(i === activeIndex)}
                  aria-current={i === activeIndex ? 'step' : undefined}
                  onClick={() => {
                    setActiveIndex(i)
                    // Through Lenis, or its smoothing and the browser's native
                    // smooth scroll fight each other and the page stutters.
                    scrollToElement(stepRefs.current[i])
                  }}
                  className={`relative px-2 py-1 text-left font-sans text-[12px] font-medium transition-colors duration-300 ${
                    i === activeIndex ? 'font-semibold' : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  {/* The accent slides down the index as you scroll rather than
                      blinking from one step to the next. */}
                  {i === activeIndex && (
                    <motion.span
                      layoutId="process-marker"
                      className="absolute inset-0 bg-accent"
                      transition={{ duration: 0.5, ease: EASE.expoInOut }}
                    />
                  )}
                  <span className="relative">
                    {step.num}&nbsp;&nbsp;{step.title.replace(/\.$/, '')}
                  </span>
                </button>
              </li>
            ))}
          </ol>

        </div>

        <div className="flex-1">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              data-testid="process-step"
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className="border-t border-rule py-10 first:border-t-0 first:pt-0 md:min-h-[62vh]"
            >
              {/* Reveal, not a split: these four titles are the section's
                  actual content rather than display type, and splitting them
                  would scatter each one across a span per character — which is
                  how both getByText and a screen reader lose the sentence. */}
              <Reveal
                as="h3"
                variant="up"
                amount={0.4}
                className="font-display leading-[1.1] tracking-tight"
                style={{ fontSize: 'var(--text-sub)' }}
              >
                {step.title}
              </Reveal>
              <Reveal
                as="p"
                variant="up"
                delay={0.12}
                className="mt-3 max-w-md font-sans leading-relaxed text-ink-muted"
              >
                {step.body}
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
