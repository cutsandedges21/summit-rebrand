import { Link } from 'react-router-dom'
import { PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE } from '../lib/plans.js'

export default function Pricing() {
  return (
    <div data-testid="pricing-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">What it costs</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Simple, honest pricing.
      </h1>
      <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
        Three plans, one flat monthly rate each, plus a one-time build fee. No hidden fees.
      </p>

      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.name} data-testid="plan-block" className="border-t border-ink pt-4">
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
              className="mt-6 inline-block border border-ink px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
            >
              Get in touch
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-24 border-t border-rule pt-14">
        <p className="label mb-4">Optional extras</p>
        <h2
          className="font-display leading-tight tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Add-ons.
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {ADDON_GROUPS.map((group) => (
            <div key={group.label}>
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
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-ink pt-4">
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
        </div>

        <p className="mt-16 max-w-2xl font-sans text-[13px] leading-relaxed text-ink-muted">
          {PRICING_NOTE}
        </p>
      </section>
    </div>
  )
}
