// NOTE: one build is named "Laser and Me", which the SINGULAR voice guard in
// tests/unit/voice.test.js would match on \bme\b. That is why BUILDS is NOT
// covered by the voice test — these are proper nouns, not brand voice. Do not
// add BUILDS to that check, and do not rename the build to satisfy it.
export const CATEGORIES = [
  'Hospitality',
  'Food & drink',
  'Retail',
  'Services',
  'Automotive',
  'Studio',
]

export const BUILDS = [
  { slug: 'halcyon',        name: 'Halcyon',        category: 'Hospitality',  image: '/builds/halcyon-hero.jpeg',         blurb: 'Boutique hotel. Built to make one thing easy: checking availability without leaving the page.' },
  { slug: 'elixir',         name: 'Elixir',         category: 'Hospitality',  image: '/builds/elixir-hotel-hero.jpeg',    blurb: 'City hotel. Rooms, rates and a booking flow that survives being used on a phone in a taxi.' },
  { slug: 'piment',         name: 'Piment',         category: 'Food & drink', image: '/builds/piment-hero.jpeg',          blurb: 'Restaurant. Menu, hours and a reservation link above the fold, because that is all anyone came for.' },
  { slug: 'drinksom',       name: 'Drinksom',       category: 'Food & drink', image: '/builds/drinksom-hero.jpeg',        blurb: 'Drinks brand. Product-led layout with the stockist list one tap away.' },
  { slug: 'khufus',         name: 'Khufus',         category: 'Food & drink', image: '/builds/khufus-hero.jpeg',          blurb: 'Restaurant. Heavy on photography, light on everything else.' },
  { slug: 'meridian',       name: 'Meridian',       category: 'Studio',       image: '/builds/meridian-hero.png',         blurb: 'Design studio. A portfolio that gets out of the way of the work.' },
  { slug: 'monads',         name: 'Monads',         category: 'Studio',       image: '/builds/monads-hero.jpeg',          blurb: 'Creative studio. Editorial grid, long scroll, minimal chrome.' },
  { slug: 'vorszk',         name: 'Vorszk',         category: 'Studio',       image: '/builds/vorszk-hero.jpeg',          blurb: 'Motion studio. Built around a showreel that loads fast enough to actually get watched.' },
  { slug: 'sterling',       name: 'Sterling',       category: 'Services',     image: '/builds/sterling-hero.jpeg',        blurb: 'Professional services. Credibility first — team, credentials, and a clear way to make contact.' },
  { slug: 'handhold',       name: 'Handhold',       category: 'Services',     image: '/builds/handhold-hero.jpeg',        blurb: 'Care service. Written for a worried person reading it at midnight.' },
  { slug: 'laser-and-me',   name: 'Laser and Me',   category: 'Services',     image: '/builds/laserandme-hero.jpeg',      blurb: 'Clinic. Treatments, pricing and booking, with none of the usual coyness about cost.' },
  { slug: 'cuts-and-edges', name: 'Cuts and Edges', category: 'Services',     image: '/builds/cutsandedges-hero.jpeg',    blurb: 'Barbershop. Book, find, and see the work — nothing else on the page.' },
  { slug: 'air-center',     name: 'Air Center',     category: 'Services',     image: '/builds/aircenter-hero.jpg',        blurb: 'Trade business. Services, service area, and a phone number that is never more than a thumb away.' },
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
