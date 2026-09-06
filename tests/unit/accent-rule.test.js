import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const SRC = resolve(__dirname, '../../src')

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const srcFiles = walk(SRC).filter((f) => /\.(jsx?|css)$/.test(f))

/**
 * Spec §3: chartreuse is a shape, never a letter.
 *
 * `#C6D42B` on the bone paper background is ~1.4:1 contrast — illegible, and an
 * accessibility failure rather than a style preference. As a fill with ink on top
 * it is ~10:1.
 *
 * The negative lookbehind matters more than it looks. Plain `\bcolor\s*:` also
 * matches the tail of `background-color:` — `\b` fires between the hyphen and the
 * `c` — so a naive version of this test blocks the exact use the rule permits.
 * `(?<![-\w])` requires `color` to start the property name.
 *
 * Case-insensitivity covers the JSX camelCase forms: `backgroundColor` and
 * `textDecorationColor` are preceded by a word character and so are correctly
 * ignored, while a bare `color:` is not.
 */
const FORBIDDEN = [
  {
    re: /\btext-accent\b/,
    why: 'text-accent paints letterforms in the accent',
  },
  {
    re: /\btext-\[\s*(#c6d42b|var\(\s*--color-accent\s*\))\s*\]/i,
    why: 'arbitrary Tailwind text colour set to the accent',
  },
  {
    re: /(?<![-\w])color\s*:\s*['"]?\s*(#c6d42b|var\(\s*--color-accent\s*\))/i,
    why: 'CSS color property set to the accent',
  },
]

describe('accent rule: chartreuse is a shape, never a letter', () => {
  it('never applies the accent as a text colour', () => {
    const offenders = []

    for (const file of srcFiles) {
      const source = readFileSync(file, 'utf8')
      source.split('\n').forEach((line, i) => {
        for (const { re, why } of FORBIDDEN) {
          if (re.test(line)) {
            offenders.push(`${relative(SRC, file)}:${i + 1} — ${why} — ${line.trim()}`)
          }
        }
      })
    }

    expect(offenders).toEqual([])
  })

  // The guard is only worth having if it catches what it claims to and permits
  // what it must. These cases pin both edges so a future tweak cannot quietly
  // invert either one.
  it.each([
    ['className="text-accent"', true],
    ['className="hover:text-accent md:text-ink"', true],
    ['className="text-[#c6d42b]"', true],
    ['className="text-[var(--color-accent)]"', true],
    ['  color: #c6d42b;', true],
    ['  color: var(--color-accent);', true],
    ['style={{ color: \'#c6d42b\' }}', true],
  ])('rejects %s', (line, shouldMatch) => {
    expect(FORBIDDEN.some(({ re }) => re.test(line))).toBe(shouldMatch)
  })

  it.each([
    ['  background-color: #c6d42b;', false],
    ['  background-color: var(--color-accent);', false],
    ['className="bg-accent"', false],
    ['className="decoration-accent"', false],
    ['  border-color: var(--color-accent);', false],
    ['style={{ backgroundColor: \'#c6d42b\' }}', false],
    ['  --color-accent: #c6d42b;', false],
  ])('permits %s', (line, shouldMatch) => {
    expect(FORBIDDEN.some(({ re }) => re.test(line))).toBe(shouldMatch)
  })
})
