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
    setup: '$1,399',
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
    setup: '$2,599',
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
  price: '$389',
  body: 'Unlimited edits, Google Business Profile management and a monthly analytics report — handled for one flat rate.',
}

export const PRICING_NOTE =
  'Every monthly plan includes two hours of work per month. The Everything plan includes unlimited edits. Work beyond those two hours may be billed separately.'
