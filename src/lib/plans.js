export const PLANS = [
  {
    name: 'Launch',
    tagline: 'Establish your presence',
    price: '$68',
    setup: '$750',
    features: [
      'One to four pages',
      'Built for phones first',
      'Contact form',
      'Custom design, no templates',
      'Hosting, security and updates',
      'Up to two hours of edits a month',
      'Uptime monitoring',
    ],
  },
  {
    name: 'Growth',
    tagline: 'Turn visitors into customers',
    price: '$108',
    setup: '$1,599',
    featured: true,
    features: [
      'Everything in Launch',
      'Five to seven pages',
      'Local SEO — found on Google',
      'Copy and layout written to convert',
      'A landing page built to sell',
      'Reviews and testimonials',
      'Google Business Profile set up',
    ],
  },
  {
    name: 'Everything',
    tagline: 'Scale with optimisation',
    price: '$218',
    setup: '$2,899+',
    features: [
      'Everything in Growth',
      'Unlimited pages',
      'Unlimited edits, priority turnaround',
      'Ongoing SEO',
      'Monthly performance report',
      'A/B split testing',
      'Animated and 3D elements',
    ],
  },
]

export const ADDON_GROUPS = [
  {
    label: 'Ongoing',
    note: 'Added to your monthly plan',
    items: [
      { name: 'Unlimited edits', note: 'One request at a time, 48hr turnaround', price: '$99/mo' },
      { name: 'Google Business Profile management', price: '$79/mo' },
      { name: 'Monthly analytics report', price: '$39/mo' },
      { name: 'Professional copywriting', price: '$299–599/mo' },
      { name: 'Booking and scheduling system', price: '$249/mo' },
    ],
  },
  {
    label: 'One-off',
    note: 'Billed once, as needed',
    items: [
      { name: 'Brand or logo refresh', price: '$249–499' },
      { name: 'Extra pages', price: '$75–125/page' },
      { name: 'Business email setup', price: '$75' },
      { name: 'Extra project work', note: 'New features and builds, not routine edits', price: '$49/hr' },
    ],
  },
]

export const CARE_PLUS = {
  name: 'Care+',
  price: '$649',
  body: 'The full Ongoing column above — every one of those add-ons, handled under one flat monthly rate. One-off work is billed separately.',
}

// Rendered directly under the plan columns. The monthly figure on each card is
// a base rate, not a ceiling, and the page has to say so where the figure is —
// not only in the Terms. Pairs with the "Base Rates & Additional Charges"
// section in lib/legal.js, which is where the charges are enumerated in full.
export const PRICING_BASE_NOTE =
  'Monthly prices are a base rate. They cover what the plan lists and nothing beyond it — add-ons, work past the hours your plan includes, extra pages and out-of-scope project work are charged on top, as are third-party costs such as domains, email hosting, premium licences and paid tools. Anything extra is quoted and agreed before it reaches an invoice. See the Terms of Service for the full list.'

export const PRICING_NOTE =
  'Every monthly plan includes two hours of work per month. The Everything plan includes unlimited edits. Work beyond those two hours may be billed separately.'
