import { Link } from 'react-router-dom'
import { SERVICES } from '../lib/services.js'

export default function Services() {
  return (
    <div data-testid="services-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">What we do</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Everything your site needs.
      </h1>
      <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
        Design, development, SEO and ongoing care — bundled into every plan for one flat
        monthly rate.
      </p>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        {SERVICES.map((service) => (
          <div key={service.title} data-testid="service-block" className="border-t border-ink pt-4">
            <h2
              className="font-display leading-tight tracking-tight"
              style={{ fontSize: 'var(--text-sub)' }}
            >
              {service.title}
            </h2>
            <p className="mt-2 font-sans leading-relaxed text-ink-muted">{service.blurb}</p>
            <ul className="mt-5">
              {service.includes.map((item) => (
                <li
                  key={item}
                  className="border-t border-rule py-2 font-sans text-[13px] text-ink-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Link
        to="/pricing"
        className="mt-14 inline-block bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
      >
        See pricing
      </Link>
    </div>
  )
}
