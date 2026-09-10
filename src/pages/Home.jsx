import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import WorkList from '../components/WorkList.jsx'
import PinnedProcess from '../components/PinnedProcess.jsx'
import Reveal, { RevealItem } from '../components/Reveal.jsx'
import Magnetic from '../components/Magnetic.jsx'
import AccentButton, { ArrowLink } from '../components/AccentButton.jsx'
import { useBackdrop } from '../components/Backdrop.jsx'
import Textify from '../lib/textify.jsx'
import { BUILDS } from '../lib/builds.js'
import { PLANS } from '../lib/plans.js'

export default function Home() {
  // The page's one colour event. The backdrop is a fixed plate behind the
  // whole document (components/Backdrop.jsx), so the paper does not end at a
  // section edge — the entire page washes to pink as this section takes the
  // viewport, then washes back. Modelled on memoiredencrier.com.
  const pricing = useBackdrop('pink')
  const closing = useBackdrop('pink')

  return (
    <div data-testid="home-page">
      <Hero />
      <WorkList builds={BUILDS} limit={5} />

      <div className="px-6 md:px-12">
        <Reveal variant="up" duration={0.7}>
          <Link to="/portfolio" className="label group inline-flex items-center gap-2 underline">
            All fourteen builds
            <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:translate-x-1.5 motion-reduce:transition-none">
              →
            </span>
          </Link>
        </Reveal>
      </div>

      <PinnedProcess />

      <section ref={pricing} className="px-6 py-20 md:px-12">
        <Reveal as="p" variant="up" duration={0.7} className="label mb-4">
          Pricing
        </Reveal>
        <Textify
          as="h2"
          preset="riseLines"
          className="mb-10 font-display leading-tight tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Three ways to work together
        </Textify>

        <Reveal variant="fade" stagger={0.12} amount={0.25} className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <RevealItem key={plan.name} className="border-t border-ink pt-3">
              {/* The featured plan is marked with an accent fill, never accent
                  text — at 1.1:1 on paper the colour is invisible as a letter.
                  Both branches carry identical box metrics so the three prices
                  sit on one line; only the background differs. Without the
                  matching padding the featured column's price dropped ~6px. */}
              <p
                className={`mb-2 inline-block px-2 py-0.5 font-sans text-[11px] font-semibold ${
                  plan.featured ? 'bg-accent' : '-ml-2'
                }`}
              >
                {plan.name}
              </p>
              <p className="font-display leading-none" style={{ fontSize: 'var(--text-sub)' }}>
                {plan.price}
                <span className="ml-1 font-sans text-[12px] text-ink-muted">/mo</span>
              </p>
              <p className="mt-2 font-sans text-[12px] text-ink-muted">
                {plan.setup} to build. {plan.tagline}.
              </p>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal variant="up" delay={0.15} className="mt-10">
          <Magnetic>
            <Link
              to="/pricing"
              className="group relative inline-block overflow-hidden bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-y-100 motion-reduce:transition-none" />
              <span className="relative transition-colors duration-500 group-hover:text-paper">
                Full pricing
              </span>
            </Link>
          </Magnetic>
        </Reveal>
      </section>

      {/* Closing CTA. Themed pink like the pricing section above it rather than
          resolving back to paper, so the colour carries through to the footer
          and gets real dwell instead of reading as a flash on the way past.
          Both sections registering the same theme means no swap between them. */}
      <section ref={closing} className="border-t border-ink px-6 py-28 md:px-12">
        <Reveal as="p" variant="up" duration={0.7} className="label mb-4">
          Next step
        </Reveal>
        <Textify
          as="h2"
          preset="riseLines"
          className="max-w-4xl font-display leading-[1.04] tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Tell us what the site <br />
          has to <em>do</em>.
        </Textify>
        <Reveal
          as="p"
          variant="up"
          delay={0.2}
          className="mt-6 max-w-xl font-sans leading-relaxed text-ink-muted"
        >
          A short form, then a real reply from whoever will build it — usually within 24
          hours. No discovery call you have to dress up for.
        </Reveal>

        <Reveal variant="up" delay={0.3} className="mt-10 flex flex-wrap items-center gap-6">
          <AccentButton to="/contact">Start a project</AccentButton>
          <ArrowLink to="/faq" className="label underline">
            Questions first
          </ArrowLink>
        </Reveal>
      </section>
    </div>
  )
}
