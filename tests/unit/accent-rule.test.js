import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const srcFiles = walk(resolve(__dirname, '../../src')).filter((f) =>
  /\.(jsx?|css)$/.test(f),
)

describe('accent rule: chartreuse is a shape, never a letter', () => {
  it('never applies the accent as a text colour', () => {
    const offenders = []

    for (const file of srcFiles) {
      const source = readFileSync(file, 'utf8')
      source.split('\n').forEach((line, i) => {
        // Tailwind text colour utility, e.g. text-accent / hover:text-accent
        if (/\btext-accent\b/.test(line)) {
          offenders.push(`${file}:${i + 1} — ${line.trim()}`)
        }
        // Raw CSS/inline colour set to the accent hex
        if (/\bcolor\s*:\s*['"]?#c6d42b/i.test(line)) {
          offenders.push(`${file}:${i + 1} — ${line.trim()}`)
        }
      })
    }

    expect(offenders).toEqual([])
  })
})
