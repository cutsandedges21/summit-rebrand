/**
 * Re-encode the captured portfolio screenshots as JPEG.
 *
 * Playwright writes PNG, which for full-colour screenshots is enormous — the
 * raw capture was 17 MB across 33 files, several over 1 MB each. This site's
 * own copy promises pages that load in under a second, so shipping megabyte
 * hero images would undercut the pitch in the most literal way available.
 *
 * JPEG at quality 82 is visually indistinguishable for photographic screenshots
 * and roughly an order of magnitude smaller. Run once after a capture:
 *
 *   node scripts/compress-shots.mjs
 */
import { readdir, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const DIR = 'public/builds/shots'

const files = (await readdir(DIR)).filter((f) => f.endsWith('.png'))
if (files.length === 0) {
  console.log('No PNGs to compress.')
  process.exit(0)
}

let before = 0
let after = 0

for (const file of files) {
  const src = join(DIR, file)
  const dest = src.replace(/\.png$/, '.jpg')

  before += (await stat(src)).size
  await sharp(src).jpeg({ quality: 82, mozjpeg: true }).toFile(dest)
  after += (await stat(dest)).size
  await unlink(src)
}

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1)
console.log(
  `${files.length} shots: ${mb(before)} MB -> ${mb(after)} MB ` +
    `(${Math.round((1 - after / before) * 100)}% smaller)`,
)
