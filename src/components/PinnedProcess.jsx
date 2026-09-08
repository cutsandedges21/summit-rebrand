import { useEffect, useRef, useState } from 'react'
import { STEPS } from '../lib/process.js'
import { useIsMobile } from '../lib/motion.js'

export default function PinnedProcess() {
  const [activeIndex, setActiveIndex] = useState(0)
  const stepRefs = useRef([])
  const mobile = useIsMobile()

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
    <section className="px-6 py-20 md:px-12">
      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <div
          data-testid="process-pin"
          data-pinned={String(!mobile)}
          className={`md:w-[44%] md:shrink-0 ${mobile ? '' : 'md:sticky md:top-16 md:self-start'}`}
        >
          <p className="label">How this works</p>
          <h2
            className="mt-2 font-display leading-[1.05] tracking-tight"
            style={{ fontSize: 'var(--text-section)' }}
          >
            Four steps,
            <br />
            start to live.
          </h2>

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
                    stepRefs.current[i]?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }}
                  className={`px-2 py-1 text-left font-sans text-[12px] font-medium transition-colors ${
                    i === activeIndex ? 'bg-accent font-semibold' : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  {step.num}&nbsp;&nbsp;{step.title.replace(/\.$/, '')}
                </button>
              </li>
            ))}
          </ol>

          <p className="mt-8 font-sans text-[12px] text-ink-muted">
            Whoever answers your email handles all four. No handoffs.
          </p>
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
              <h3
                className="font-display leading-[1.1] tracking-tight"
                style={{ fontSize: 'var(--text-sub)' }}
              >
                {step.title}
              </h3>
              <p className="mt-3 max-w-md font-sans leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
