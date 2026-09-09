import { PLANS } from '../lib/plans.js'
import PageHeader from '../components/PageHeader.jsx'
import Reveal, { RevealItem } from '../components/Reveal.jsx'
import AccentButton, { ArrowLink } from '../components/AccentButton.jsx'
import { useBackdrop } from '../components/Backdrop.jsx'

// Every value here is either known or derived. An earlier draft carried
// "Building since 2024", which was invented — the old repo's first commit is
// May 2026 and the real founding date is not something this codebase knows.
// The cheapest way to keep a facts table honest is to let it read from data.
const FACTS = [
  { k: 'Based in', v: 'Montreal' },
  { k: 'Working', v: 'Across Canada' },
  { k: 'Plans from', v: `${PLANS[0].price} a month` },
  { k: 'Reply time', v: 'Within 24 hours' },
]

const SUITS = [
  'A business where the website has one job and it is not being admired.',
  'Somewhere a phone call, a booking or a walk-in is the actual goal.',
  'Owners who want to talk to whoever is building the thing.',
  'People who would rather have one flat monthly rate than a surprise invoice.',
]

const DOES_NOT_SUIT = [
  'Anyone who needs a fifty-page site by Friday.',
  'Projects that want a committee, a slide deck and three rounds of stakeholder review.',
  'Work where the goal is winning an award rather than winning a customer.',
]

export default function About() {
  const fit = useBackdrop('clay')

  return (
    <div data-testid="about-page" className="px-6 py-16 md:px-12">
      <PageHeader label="Who you are hiring" heading="Small studio. Montreal." />

      <div className="mt-10 grid gap-12 md:grid-cols-[minmax(0,1fr)_260px] md:gap-20">
        <Reveal variant="fade" stagger={0.1} className="max-w-xl font-sans leading-relaxed text-ink-muted">
          <RevealItem as="p">
            We design and build websites for local businesses — from Montreal, for clients
            across Canada. The person you email is the person who builds the site, and the
            person who fixes it when something breaks at nine at night.
          </RevealItem>
          <RevealItem as="p" className="mt-4">
            There is no account manager, no offshore team, and nobody who will forward your
            message on and then go quiet. That is the whole pitch, and it is the reason the
            studio carries a name instead of an acronym.
          </RevealItem>
          <RevealItem as="p" className="mt-4">
            Most of what we build is for businesses where the website has one job — get someone
            to call, book, or walk in. We care far more about whether that happens than about
            whether the site wins an award.
          </RevealItem>
        </Reveal>

        {/* Plain facts, hairline-ruled. No headcount: the spec forbids claiming a
            team size, and "based in Montreal" answers the question people are
            actually asking without inviting "how many of you are there?". */}
        <Reveal as="dl" variant="fade" stagger={0.08} className="font-sans text-[13px]">
          {FACTS.map(({ k, v }) => (
            <RevealItem key={k} className="flex justify-between gap-4 border-t border-rule py-3">
              <dt className="text-ink-faint">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      <div ref={fit} className="mt-24 grid gap-12 md:grid-cols-2 md:gap-20">
        <section>
          <Reveal as="p" variant="up" duration={0.7} className="label mb-5">
            A good fit
          </Reveal>
          <Reveal as="ul" variant="fade" stagger={0.09}>
            {SUITS.map((item) => (
              <RevealItem
                as="li"
                key={item}
                className="border-t border-ink py-3 font-sans leading-relaxed text-ink-muted"
              >
                {item}
              </RevealItem>
            ))}
          </Reveal>
        </section>

        {/* Saying who this is not for is the cheapest credibility on the page,
            and it filters the enquiries that waste everyone's afternoon. */}
        <section>
          <Reveal as="p" variant="up" duration={0.7} className="label mb-5">
            Probably not a fit
          </Reveal>
          <Reveal as="ul" variant="fade" stagger={0.09}>
            {DOES_NOT_SUIT.map((item) => (
              <RevealItem
                as="li"
                key={item}
                className="border-t border-rule py-3 font-sans leading-relaxed text-ink-faint"
              >
                {item}
              </RevealItem>
            ))}
          </Reveal>
        </section>
      </div>

      <Reveal
        variant="up"
        className="mt-24 flex flex-wrap items-center gap-4 border-t border-rule pt-10"
      >
        <AccentButton to="/contact">Start a project</AccentButton>
        <ArrowLink to="/portfolio" className="label underline">
          See the work first
        </ArrowLink>
      </Reveal>
    </div>
  )
}
