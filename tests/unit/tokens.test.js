import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(__dirname, '../../src/index.css'), 'utf8')

describe('design tokens', () => {
  const tokens = {
    '--color-paper': '#f0ebe8',
    '--color-paper-clay': '#e1d7d1',
    '--color-ink': '#1d1d1b',
    '--color-ink-muted': '#6b6560',
    '--color-ink-faint': '#a79f98',
    '--color-rule': '#ddd5cf',
    '--color-accent': '#c6d42b',
  }

  for (const [name, value] of Object.entries(tokens)) {
    it(`defines ${name} as ${value}`, () => {
      const re = new RegExp(`${name}\\s*:\\s*${value}\\s*;`, 'i')
      expect(css).toMatch(re)
    })
  }

  it('defines the fluid hero size', () => {
    expect(css).toMatch(/--text-hero\s*:\s*clamp\(44px,\s*7\.5vw,\s*118px\)/)
  })

  it('defines both Instrument families', () => {
    expect(css).toMatch(/--font-display\s*:.*Instrument Serif/)
    expect(css).toMatch(/--font-sans\s*:.*Instrument Sans/)
  })
})
