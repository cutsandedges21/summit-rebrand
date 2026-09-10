import { SERVICES } from '../lib/services.js'
import { STEPS } from '../lib/process.js'
import Reveal, { RevealItem } from '../components/Reveal.jsx'
import AccentButton, { ArrowLink } from '../components/AccentButton.jsx'
import { useBackdrop } from '../components/Backdrop.jsx'
import Textify from '../lib/textify.jsx'

/**
 * Modelled on evacoste.com/services, which does three things this page did not:
 *
 *   1. Opens with a large italic statement rather than a heading and a
 *      standfirst. It reads as someone talking, not as a page masthead.
 *   2. Hangs everything off a left label column, so the content sits in the
 *      right two-thirds and the margin does real work.
 *   3. Sets the deliverables in italic serif and only the titles in sans. The
 *      italic is what stops a list of services reading as a spec sheet.
 *
 * The process row is folded in from the same reference — Eva numbers hers 01–04
 * across the full width. It reuses STEPS, so the homepage's pinned Process and
 * this page can never drift apart.
 */
export default function Services() {
  // Only the grid is themed. The backdrop resolves on whichever themed section
  // owns the middle of the viewport, so a short block would flash its colour
  // for a few hundred pixels and read as a glitch.
  const grid = useBackdrop('clay')

  return (
    <div data-testid="services-page" className="px-6 py-16 md:px-12">
      <Reveal as="p" variant="up" duration={0.7} className="label mb-10">
        What we do
      </Reveal>

      {/* The opening statement. Deliberately not an <h1> plus standfirst: this
          is the page's whole argument in one breath, which is why it gets the
          display face at paragraph length. */}
      <Textify
        as="h1"
        preset="riseLines"
        delay={0.08}
        amount={0.2}
        className="max-w-5xl font-display italic leading-[1.12] tracking-tight"
        style={{ fontSize: 'var(--text-sub)' }}
      >
        Most sites fail at one specific job. Ours are built backwards from that
        job — the booking, the phone call, the order — and everything else on the
        page has to earn its place against it.
      </Textify>

      <div ref={grid} className="mt-28 grid gap-y-10 md:grid-cols-12">
        <Reveal as="p" variant="up" duration={0.7} className="label md:col-span-3">
          Included in every plan
        </Reveal>

        <Reveal
          variant="fade"
          stagger={0.12}
          amount={0.2}
          className="grid gap-x-12 gap-y-20 md:col-span-9 md:grid-cols-2"
        >
          {SERVICES.map((service) => (
            <RevealItem key={service.title} data-testid="service-block">
              {/* Unsplit on purpose: these titles are content, and splitting one
                  into characters costs a screen reader the whole word. */}
              <h2 className="font-sans text-[15px] font-semibold">{service.title}</h2>

              <ul className="mt-5">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="font-display text-[17px] leading-[1.65] italic text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 max-w-sm font-display text-[17px] leading-[1.6] italic text-ink-muted">
                {service.blurb}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      <div className="mt-32 grid gap-y-10 md:grid-cols-12">
        <Reveal as="p" variant="up" duration={0.7} className="label md:col-span-3">
          Our process
        </Reveal>

        <Reveal
          variant="fade"
          stagger={0.1}
          amount={0.2}
          className="grid gap-x-8 gap-y-12 md:col-span-9 md:grid-cols-4"
        >
          {STEPS.map((step) => (
            <RevealItem key={step.num}>
              <p className="font-sans text-[15px] font-semibold">{step.num}</p>
              <p className="mt-3 font-display text-[16px] leading-[1.55] italic text-ink-muted">
                {step.body}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      <Reveal variant="up" delay={0.15} className="mt-28 flex flex-wrap items-center gap-6">
        <AccentButton to="/pricing">See pricing</AccentButton>
        <ArrowLink to="/portfolio" className="label underline">
          Or see the work
        </ArrowLink>
      </Reveal>
    </div>
  )
}
