import { Link } from 'react-router-dom'
import { PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE } from '../lib/plans.js'
import PageHeader from '../components/PageHeader.jsx'
import Reveal, { RevealItem } from '../components/Reveal.jsx'
import Textify from '../lib/textify.jsx'
import { useBackdrop } from '../components/Backdrop.jsx'

export default function Pricing() {
  // The plans are what the page is for, so they get the colour.
  const plans = useBackdrop('pink')

  return (
    <div data-testid="pricing-page" className="px-6 py-16 md:px-12">
      <PageHeader
        label="What it costs"
        heading="Simple, honest pricing."
        intro="Three plans, one flat monthly rate each, plus a one-time build fee. No hidden fees."
      />

      <div ref={plans}>
      <Reveal
        variant="fade"
        stagger={0.12}
        amount={0.2}
        className="mt-16 grid gap-10 md:grid-cols-3"
      >
        {PLANS.map((plan) => (
          <RevealItem key={plan.name} data-testid="plan-block" className="border-t border-ink pt-4">
            {/* Both branches carry identical box metrics so the three prices sit
                on one line; only the background differs. A padded chip against a
                plain paragraph dropped the featured column's price by ~6px on the
                homepage before this was fixed there. */}
            <p
              className={`mb-3 inline-block px-2 py-0.5 font-sans text-[11px] font-semibold ${
                plan.featured ? 'bg-accent' : '-ml-2'
              }`}
            >
              {plan.name}
            </p>
            <p className="font-display leading-none" style={{ fontSize: 'var(--text-sub)' }}>
              {plan.price}
              <span className="ml-1 font-sans text-[12px] text-ink-muted">/mo</span>
            </p>
            <p className="mt-2 font-sans text-[12px] text-ink-muted">{plan.setup} to build</p>
            <ul className="mt-5">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="border-t border-rule py-2 font-sans text-[13px] text-ink-muted"
                >
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="group relative mt-6 inline-block overflow-hidden border border-ink px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.87,0,.13,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
              />
              <span className="relative transition-colors duration-500 group-hover:text-paper group-focus-visible:text-paper">
                Get in touch
              </span>
            </Link>
          </RevealItem>
        ))}
      </Reveal>
      </div>

      <section className="mt-24 border-t border-rule pt-14">
        <Reveal as="p" variant="up" duration={0.7} className="label mb-4">
          Optional extras
        </Reveal>
        <Textify
          as="h2"
          preset="riseLines"
          className="font-display leading-tight tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Add-ons.
        </Textify>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {ADDON_GROUPS.map((group) => (
            <Reveal key={group.label} variant="up">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.11em]">
                {group.label}
              </p>
              <p className="mt-1 font-sans text-[12px] text-ink-faint">{group.note}</p>
              <ul className="mt-5">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-start justify-between gap-6 border-t border-rule py-3"
                  >
                    <span className="font-sans text-[13px] text-ink-muted">
                      {item.name}
                      {item.note && (
                        <span className="block text-[11px] text-ink-faint">{item.note}</span>
                      )}
                    </span>
                    <span className="whitespace-nowrap font-sans text-[13px] font-semibold">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal variant="up" className="mt-10 border-t border-ink pt-4">
          <span className="mb-3 inline-block bg-accent px-2 py-0.5 font-sans text-[11px] font-semibold">
            {CARE_PLUS.name}
          </span>
          <p className="font-display leading-none" style={{ fontSize: 'var(--text-sub)' }}>
            {CARE_PLUS.price}
            <span className="ml-1 font-sans text-[12px] text-ink-muted">/mo</span>
          </p>
          <p className="mt-3 max-w-lg font-sans leading-relaxed text-ink-muted">
            {CARE_PLUS.body}
          </p>
        </Reveal>

        <Reveal
          as="p"
          variant="up"
          className="mt-16 max-w-2xl font-sans text-[13px] leading-relaxed text-ink-muted"
        >
          {PRICING_NOTE}
        </Reveal>
      </section>
    </div>
  )
}
