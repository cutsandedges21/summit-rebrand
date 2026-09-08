// NOTE: one build is named "Laser and Me", which the SINGULAR voice guard in
// tests/unit/voice.test.js would match on \bme\b. That is why BUILDS is NOT
// covered by the voice test — these are proper nouns, not brand voice. Do not
// add BUILDS to that check, and do not rename the build to satisfy it.
//
// NOTE: `cutsandedges-hero.jpeg` was removed on 2026-09-08 and must not come
// back. It is a live lawn-care business, not a speculative build: the screenshot
// carries a working phone number, (514) 561-9746, and cutsandedges21@gmail.com,
// which is the owner's own address. Listing a real business in a set labelled
// "concept builds" is the same false claim about real work that keeps
// `glorync-hero.jpeg` out — see spec §2. Fourteen builds, not fifteen.
//
// Every blurb below was written with the screenshot open. Nothing here may
// assert a fact the image does not show — no phone numbers, no stockists, no
// industry that is only a guess. Vorszk and Air Center are brand-statement
// pages with no visible product or service, so they sit under 'Studio & brand'
// and their blurbs describe the page rather than guessing at the business.
//
// Six categories, never fewer than two builds in each. An earlier pass had
// eight for fourteen builds, which left four singletons and a filter row that
// read as padding. Grouped by what the site has to DO for its visitor — book,
// sell, explain, impress — rather than by industry label, because that is the
// axis a prospect actually shops on.
export const CATEGORIES = [
  'Hospitality & wellness',
  'Food & drink',
  'Retail',
  'Studio & brand',
  'Technology',
  'Automotive',
]

export const BUILDS = [
  { slug: 'halcyon',        name: 'Halcyon',        category: 'Hospitality & wellness', image: '/builds/halcyon-hero.jpeg',         blurb: 'Day spa and retreat. Atmosphere doing the selling, with Book the only thing to click.',
    own: true,
    url: 'https://halcyon-spa-demo.vercel.app/',
    year: '2025',
    discipline: 'Design & build',
    challenge: 'A spa sells a feeling, but a website has to sell an appointment. The two pull in opposite directions: atmosphere wants space and quiet, booking wants to be unmissable.',
    approach: 'Let the photography carry the mood with almost no copy over it, and give Book exactly one place to live - fixed, always reachable, never competing with anything else on the page.',
    outcome: 'A page that feels unhurried and still puts a booking two taps away. Nothing on it asks the visitor to make a second decision.',
  },
  { slug: 'elixir',         name: 'Elixir',         category: 'Hospitality & wellness', image: '/builds/elixir-hotel-hero.jpeg',    blurb: 'City hotel. Rooms, rates and a booking flow that survives being used on a phone in a taxi.',
    own: true,
    url: 'https://elixir-hotel-demo.vercel.app',
    year: '2025',
    discipline: 'Design & build',
    challenge: 'Hotel booking usually happens on a phone, often in transit, often one-handed. Most hotel sites are built as though it happens on a desktop with time to spare.',
    approach: 'Rooms, rates and availability collapse into a single vertical flow with no modals and no horizontal scroll. Every tap target is sized for a thumb rather than a cursor.',
    outcome: 'A booking path that survives being used badly - in a taxi, on bad signal, with one hand - because none of it depends on precision.',
  },
  { slug: 'piment',         name: 'Piment',         category: 'Food & drink', image: '/builds/piment-hero.jpeg',          blurb: 'Restaurant. Menu, hours and a reservation link above the fold, because that is all anyone came for.',
    own: true,
    url: 'https://piment-demo.vercel.app/',
    year: '2025',
    discipline: 'Design & build',
    challenge: 'Nearly everyone arriving at a restaurant site wants one of three things: the menu, the hours, or a table. Most restaurant sites bury all three under a photo carousel.',
    approach: 'Menu, hours and reservations sit above the fold and stay there. The atmosphere shots come after, for the people who kept scrolling because they had already decided.',
    outcome: 'The three things people actually came for are answered before any scrolling happens. Everything else is a bonus rather than an obstacle.',
  },
  { slug: 'drinksom',       name: 'Drinksom',       category: 'Retail',                 image: '/builds/drinksom-hero.jpeg',        blurb: 'Drinks brand. One product, one claim, and a waitlist button where the shop would be.',
    own: false,
    url: 'https://www.drinksom.eu/',
    year: '2025',
    discipline: 'Study',
    challenge: 'A single-product drinks brand has the opposite problem to a catalogue: too little to say, and a whole page to say it in. Padding it out reads as insecurity.',
    approach: 'One product, one claim, and a great deal of empty space treated as confidence rather than a gap. The call to action is the only element competing for attention.',
    outcome: 'A page short enough to read in full, which is rarer and more persuasive than a page long enough to seem thorough.',
  },
  { slug: 'khufus',         name: 'Khufus',         category: 'Food & drink', image: '/builds/khufus-hero.jpeg',          blurb: 'Restaurant. Heavy on photography, light on everything else.',
    own: false,
    url: 'https://khufus.com/',
    year: '2025',
    discipline: 'Study',
    challenge: 'Restaurant photography is the strongest asset most restaurants own, and the thing their websites most often shrink into thumbnails.',
    approach: 'Full-bleed imagery with type kept deliberately small and out of the way. The interface recedes until the visitor wants something from it.',
    outcome: 'The food does the persuading. The site\'s only job is to not interrupt it, then hand over a reservation link at the right moment.',
  },
  { slug: 'meridian',       name: 'Meridian',       category: 'Studio & brand',        image: '/builds/meridian-hero.png',         blurb: 'Design studio. A portfolio that gets out of the way of the work.',
    own: true,
    url: 'https://summitsites-agency.github.io/meridian-studio/',
    year: '2025',
    discipline: 'Design & build',
    challenge: 'A design studio\'s portfolio has to demonstrate taste through its own restraint. Over-designing it undermines the argument it is trying to make.',
    approach: 'An editorial grid, generous margins, and no interface flourishes at all. The work sits on the page at scale with nothing decorating it.',
    outcome: 'A portfolio that gets out of the way of the work - which for a studio is the entire pitch, made structurally rather than stated.',
  },
  { slug: 'monads',         name: 'Monads',         category: 'Technology',   image: '/builds/monads-hero.jpeg',          blurb: 'Enterprise IT consultancy. SAP and agile work introduced in one plain sentence, not a capability deck.',
    own: false,
    url: 'https://www.monads.ch/',
    year: '2025',
    discipline: 'Study',
    challenge: 'Enterprise consultancies default to capability decks: long lists of acronyms that tell a visitor nothing about whether they can help.',
    approach: 'Lead with a single plain sentence about what the work actually is, then let the detail unfold for the people who need it. No jargon above the fold.',
    outcome: 'A technical firm that reads as legible rather than impressive, which is the harder and more useful of the two.',
  },
  { slug: 'vorszk',         name: 'Vorszk',         category: 'Studio & brand',        image: '/builds/vorszk-hero.jpeg',          blurb: 'Brand statement. One line, one button — the whole page held together by atmosphere.',
    own: false,
    // vorszk.com stopped resolving (NXDOMAIN, verified 2026-09-08). Null rather
    // than a dead link -- the page hides the "Visit the live site" button when
    // there is no url.
    url: null,
    year: '2025',
    discipline: 'Study',
    challenge: 'A brand statement page has no product to show and no feature list to fall back on. It either establishes a tone in seconds or it fails.',
    approach: 'One line, one action, and enough space around them that the restraint reads as deliberate. Everything decorative was removed until only the tone remained.',
    outcome: 'A page that communicates position rather than information - and knows that is all it is trying to do.',
  },
  { slug: 'sterling',       name: 'Sterling',       category: 'Automotive',   image: '/builds/sterling-hero.jpeg',        blurb: 'Luxury car dealership. The marque, the lineup and the gallery up top — Reserve pinned to the corner.',
    own: true,
    url: 'https://sterling-motors-demo.vercel.app/',
    year: '2025',
    discipline: 'Design & build',
    challenge: 'Luxury automotive sites tend to bury the one thing a serious buyer wants: a way to reserve a specific car without a phone call.',
    approach: 'The marque, the lineup and the gallery lead, with Reserve pinned to the corner throughout so it is never more than a glance away.',
    outcome: 'Browsing and buying stop competing. The visitor can spend as long as they like in the gallery without losing the thread back to the enquiry.',
  },
  { slug: 'handhold',       name: 'Handhold',       category: 'Technology',   image: '/builds/handhold-hero.jpeg',        blurb: 'B2B software. One promise, one demo button, and a row of logos doing the rest of the work.',
    own: false,
    url: null,
    year: '2025',
    discipline: 'Study',
    challenge: 'B2B software has to explain something unfamiliar to a sceptical reader in the time it takes them to decide to leave.',
    approach: 'One promise, one demo action, and social proof doing the rest of the work instead of a feature matrix nobody reads.',
    outcome: 'A page that makes the product understood before it tries to make it wanted.',
  },
  { slug: 'laser-and-me',   name: 'Laser and Me',   category: 'Hospitality & wellness', image: '/builds/laserandme-hero.jpeg',      blurb: 'Clinic. Treatments, pricing and booking, with none of the usual coyness about cost.',
    own: false,
    url: null,
    year: '2025',
    discipline: 'Study',
    challenge: 'Clinics are usually coy about price, which forces every interested visitor into a phone call before they know whether they can afford it.',
    approach: 'Treatments, prices and booking presented plainly on one page, with no gated consultation step in between.',
    outcome: 'Fewer enquiries, better ones. The people who make contact have already self-selected on price.',
  },
  { slug: 'air-center',     name: 'Air Center',     category: 'Studio & brand',        image: '/builds/aircenter-hero.jpg',        blurb: 'Brand teaser. Three letters, one line of copy, one button — and nothing else on the screen.',
    own: false,
    url: 'https://aircenter.space/',
    year: '2025',
    discipline: 'Study',
    challenge: 'A three-letter brand with no product to show has to make an abstraction feel like a place worth enquiring about.',
    approach: 'Three letters, one line of copy, one action, and nothing else on the screen. Scale and emptiness do all the work.',
    outcome: 'A teaser that reads as deliberate rather than unfinished - a distinction that rests entirely on spacing.',
  },
  { slug: 'brand-cosmetics',name: 'Brand Cosmetics',category: 'Retail',       image: '/builds/brand-cosmetics-hero.jpeg', blurb: 'Cosmetics. Product grid built to survive a catalogue three times the size.',
    own: true,
    url: 'https://brand-cosmetics.vercel.app/',
    year: '2025',
    discipline: 'Design & build',
    challenge: 'A cosmetics catalogue grows. A grid that looks elegant with twelve products often collapses at forty.',
    approach: 'A product grid designed against a catalogue three times the current size, so growth never forces a redesign.',
    outcome: 'A layout that will still hold when the range expands, which is the cheapest thing to get right early and the most expensive to retrofit.',
  },
  { slug: 'lamborghini',    name: 'Lamborghini',    category: 'Automotive',   image: '/builds/lamborghini-hero.jpeg',     blurb: 'Concept exercise. An excuse to build something loud and see how far the layout stretches.',
    own: true,
    url: 'https://lamborghini-centenario-showcase.vercel.app/',
    year: '2025',
    discipline: 'Concept exercise',
    challenge: 'A pure exercise: take a subject with no brief, no commission and no constraints, and find out where the layout language actually breaks.',
    approach: 'Push scale, contrast and motion further than any real project would tolerate, then see which decisions still hold up.',
    outcome: 'A useful map of the edges. Several restraint decisions elsewhere on this site came from finding out what too much looked like here.',
  },
]

/**
 * @param {typeof BUILDS} builds
 * @param {string} category - a value from CATEGORIES, or 'all'
 */
export function filterBuilds(builds, category) {
  if (category === 'all') return builds
  return builds.filter((b) => b.category === category)
}
