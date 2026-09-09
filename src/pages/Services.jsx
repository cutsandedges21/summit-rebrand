import { SERVICES } from '../lib/services.js'
import PageHeader from '../components/PageHeader.jsx'
import Reveal, { RevealItem } from '../components/Reveal.jsx'
import AccentButton from '../components/AccentButton.jsx'
import { useBackdrop } from '../components/Backdrop.jsx'

export default function Services() {
  // Only the grid is themed. The backdrop resolves on whichever themed section
  // owns the middle of the viewport, so a short block — a lone button, say —
  // would flash its colour for a few hundred pixels and read as a glitch.
  // Themed regions have to be tall enough to hold the line.
  const grid = useBackdrop('clay')

  return (
    <div data-testid="services-page" className="px-6 py-16 md:px-12">
      <PageHeader
        label="What we do"
        heading="Everything your site needs."
        intro="Design, development, SEO and ongoing care — bundled into every plan for one flat monthly rate."
      />

      <div ref={grid}>
        <Reveal variant="fade" stagger={0.12} amount={0.2} className="mt-16 grid gap-12 md:grid-cols-2">
          {SERVICES.map((service) => (
            <RevealItem
              key={service.title}
              data-testid="service-block"
              className="border-t border-ink pt-4"
            >
              {/* Unsplit on purpose: these titles are content, and splitting one
                  into a span per word costs it the single text node that both a
                  screen reader and getByText rely on. */}
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
                    className="border-t border-rule py-2 font-sans text-[13px] text-ink-muted transition-colors duration-300 hover:text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      <Reveal variant="up" className="mt-14">
        <AccentButton to="/pricing">See pricing</AccentButton>
      </Reveal>
    </div>
  )
}
