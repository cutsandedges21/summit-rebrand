/**
 * One-shot curation pass, on the owner's instruction (2026-09-10).
 *
 *   - vorszk removed. Its domain stopped resolving, and it was never our work.
 *   - laser-and-me removed. Not our work.
 *   - cuts-and-edges added. A real lawn-care business the owner built and runs.
 *   - gloryn added. A real client site.
 *   - handhold gains its live URL, handhold.io.
 *
 * The two additions reverse an earlier exclusion, and the reason that exclusion
 * existed no longer applies. Both were kept out when every entry was labelled
 * "concept build" — calling a real business a speculative build was the false
 * claim being avoided. Each case study now states provenance explicitly, so
 * real work can be shown as real work. That is strictly more honest than
 * hiding it, and considerably better proof.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = 'src/lib/builds.js'
let src = readFileSync(FILE, 'utf8')

const drop = (slug) => {
  const re = new RegExp(`\\n  \\{\\s*\\n?\\s*slug: '${slug}'[\\s\\S]*?\\n  \\},`, 'm')
  const before = src.length
  src = src.replace(re, '')
  if (src.length === before) throw new Error(`could not remove ${slug}`)
}

drop('vorszk')
drop('laser-and-me')

// handhold was captured without a URL because none was known.
src = src.replace(
  /(\{\s*\n\s*slug: 'handhold'[\s\S]*?)\n    url: null,/,
  "$1\n    url: 'https://handhold.io',",
)

const entry = (b) => `  {
    slug: '${b.slug}',
    name: '${b.name}',
    category: '${b.category}',
    image: '${b.image}',
    blurb: '${b.blurb}',
    own: true,
    url: '${b.url}',
    year: '2025',
    discipline: '${b.discipline}',
    challenge: '${b.challenge}',
    approach: '${b.approach}',
    outcome: '${b.outcome}',
  },`

const additions = [
  {
    slug: 'cuts-and-edges',
    name: 'Cuts and Edges',
    category: 'Local trade',
    image: '/builds/cutsandedges-hero.jpeg',
    blurb: 'Lawn care. Service area, pricing and a phone number that never leaves the screen.',
    url: 'https://cutsandedges.vercel.app/',
    discipline: 'Design & build',
    challenge:
      'Lawn care is bought on trust and proximity. A homeowner wants to know you cover their street, roughly what it costs, and that a real person answers - and they want all three before they will call.',
    approach:
      'Service area and pricing sit in the first screen rather than behind a quote form, and the phone number stays reachable the whole way down the page.',
    outcome:
      'Nothing stands between a visitor and a phone call. The site answers the qualifying questions itself, so the calls that come through are already the right ones.',
  },
  {
    slug: 'gloryn',
    name: 'Gloryn Custom',
    category: 'Local trade',
    image: '/builds/glorync-hero.jpeg',
    blurb:
      'Car aesthetics. Ambient lighting and starlight headliners, sold the only way they can be - by showing them.',
    url: 'https://gloryncustom.com/',
    discipline: 'Design & build',
    challenge:
      'Interior lighting is almost impossible to describe and immediate to recognise. Every word spent explaining it is a word that loses the reader.',
    approach:
      'Lead with the work at full bleed, in the dark, where the lighting actually reads. Copy is kept to the few things a photograph cannot say.',
    outcome:
      'The effect sells itself in the first second. The rest of the page only has to make booking easy.',
  },
]

src = src.replace(/\n\]\n\n\/\*\*/, `\n${additions.map(entry).join('\n')}\n]\n\n/**`)

// Lawn care and a car-customisation shop are both local trade businesses, which
// is the trait a prospect shops on - closer to their own situation than the
// industry label would suggest.
src = src.replace(
  /  'Automotive',\n\]/,
  "  'Automotive',\n  'Local trade',\n]",
)

writeFileSync(FILE, src)
console.log('builds.js curated')
