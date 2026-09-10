/**
 * Build the hero corridor's card images.
 *
 * The corridor (components/ImageStreamHero.jsx) renders every card as an 18:25
 * portrait and fills it with object-cover. The build heroes are 16:10 landscape
 * at 1440px, so covering a portrait card scales them by *height* and throws
 * away roughly 70% of each file's width before anything reaches the screen.
 * Pointing the corridor straight at them costs 1.4 MB above the fold on every
 * visit — one of them, meridian, is a 479 KB PNG — on a site whose own copy
 * sells pages that load in under a second. scripts/compress-shots.mjs exists
 * for exactly that reason; this is the same argument one step earlier.
 *
 * So: crop to the card's aspect first, then size for the largest a card ever
 * gets, and encode as JPEG. Run after adding or replacing a build hero:
 *
 *   node scripts/build-stream-cards.mjs
 *
 * Output is committed — it is derived, but the build does not generate it and
 * Vercel only ships what is in the repo.
 */
import { mkdir, stat, readdir, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'
import { BUILDS } from '../src/lib/builds.js'

const OUT = 'public/builds/stream'

// Card aspect, from PATH in ImageStreamHero.jsx (cardWidth 18 / cardHeight 25).
// If those change, change these — a mismatch just reintroduces the cropping the
// script exists to avoid, silently.
const ASPECT = 18 / 25

// A card is at most `exitHeight` (46cqw) tall, so ~662px on a 1440px-wide
// container and ~477px across. 900 tall covers that with room for a denser
// display before it softens, without paying for the full 1440px capture.
const HEIGHT = 900
const WIDTH = Math.round(HEIGHT * ASPECT)

await mkdir(OUT, { recursive: true })

// Anything already here that no longer matches a build is stale.
const keep = new Set(BUILDS.map((b) => `${b.slug}.jpg`))
for (const file of await readdir(OUT).catch(() => [])) {
  if (!keep.has(file)) await unlink(join(OUT, file))
}

let before = 0
let after = 0

for (const build of BUILDS) {
  const src = join('public', build.image)
  const dest = join(OUT, `${build.slug}.jpg`)

  before += (await stat(src)).size
  await sharp(src)
    // `cover` here is the same crop the browser would do, done once, at build
    // time, against the full-resolution original.
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 76, mozjpeg: true })
    .toFile(dest)
  after += (await stat(dest)).size
}

const kb = (bytes) => Math.round(bytes / 1024)
console.log(
  `${BUILDS.length} cards at ${WIDTH}x${HEIGHT}: ` +
    `${kb(before)} KB -> ${kb(after)} KB (${Math.round((1 - after / before) * 100)}% smaller)`,
)
