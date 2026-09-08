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
  { slug: 'halcyon',        name: 'Halcyon',        category: 'Hospitality & wellness', image: '/builds/halcyon-hero.jpeg',         blurb: 'Day spa and retreat. Atmosphere doing the selling, with Book the only thing to click.' },
  { slug: 'elixir',         name: 'Elixir',         category: 'Hospitality & wellness', image: '/builds/elixir-hotel-hero.jpeg',    blurb: 'City hotel. Rooms, rates and a booking flow that survives being used on a phone in a taxi.' },
  { slug: 'piment',         name: 'Piment',         category: 'Food & drink', image: '/builds/piment-hero.jpeg',          blurb: 'Restaurant. Menu, hours and a reservation link above the fold, because that is all anyone came for.' },
  { slug: 'drinksom',       name: 'Drinksom',       category: 'Retail',                 image: '/builds/drinksom-hero.jpeg',        blurb: 'Drinks brand. One product, one claim, and a waitlist button where the shop would be.' },
  { slug: 'khufus',         name: 'Khufus',         category: 'Food & drink', image: '/builds/khufus-hero.jpeg',          blurb: 'Restaurant. Heavy on photography, light on everything else.' },
  { slug: 'meridian',       name: 'Meridian',       category: 'Studio & brand',        image: '/builds/meridian-hero.png',         blurb: 'Design studio. A portfolio that gets out of the way of the work.' },
  { slug: 'monads',         name: 'Monads',         category: 'Technology',   image: '/builds/monads-hero.jpeg',          blurb: 'Enterprise IT consultancy. SAP and agile work introduced in one plain sentence, not a capability deck.' },
  { slug: 'vorszk',         name: 'Vorszk',         category: 'Studio & brand',        image: '/builds/vorszk-hero.jpeg',          blurb: 'Brand statement. One line, one button — the whole page held together by atmosphere.' },
  { slug: 'sterling',       name: 'Sterling',       category: 'Automotive',   image: '/builds/sterling-hero.jpeg',        blurb: 'Luxury car dealership. The marque, the lineup and the gallery up top — Reserve pinned to the corner.' },
  { slug: 'handhold',       name: 'Handhold',       category: 'Technology',   image: '/builds/handhold-hero.jpeg',        blurb: 'B2B software. One promise, one demo button, and a row of logos doing the rest of the work.' },
  { slug: 'laser-and-me',   name: 'Laser and Me',   category: 'Hospitality & wellness', image: '/builds/laserandme-hero.jpeg',      blurb: 'Clinic. Treatments, pricing and booking, with none of the usual coyness about cost.' },
  { slug: 'air-center',     name: 'Air Center',     category: 'Studio & brand',        image: '/builds/aircenter-hero.jpg',        blurb: 'Brand teaser. Three letters, one line of copy, one button — and nothing else on the screen.' },
  { slug: 'brand-cosmetics',name: 'Brand Cosmetics',category: 'Retail',       image: '/builds/brand-cosmetics-hero.jpeg', blurb: 'Cosmetics. Product grid built to survive a catalogue three times the size.' },
  { slug: 'lamborghini',    name: 'Lamborghini',    category: 'Automotive',   image: '/builds/lamborghini-hero.jpeg',     blurb: 'Concept exercise. An excuse to build something loud and see how far the layout stretches.' },
]

/**
 * @param {typeof BUILDS} builds
 * @param {string} category - a value from CATEGORIES, or 'all'
 */
export function filterBuilds(builds, category) {
  if (category === 'all') return builds
  return builds.filter((b) => b.category === category)
}
