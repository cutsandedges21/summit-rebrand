import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const css = readFileSync(resolve(__dirname, '../../src/index.css'), 'utf8')

describe('design tokens', () => {
  // paper, ink and accent are sampled from public/brand/logo-wordmark.png.
  // If the logo is ever redrawn, re-sample and update both here and index.css.
  const tokens = {
    '--color-paper': '#f9f7ef',
    '--color-paper-clay': '#ebe5d8',
    '--color-ink': '#1b1a15',
    '--color-ink-muted': '#6a655a',
    '--color-ink-faint': '#a8a296',
    '--color-rule': '#e0dace',
    '--color-accent': '#f9ea55',
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

// Naming a font family in a token does not fetch it. Tailwind v4 inlines its own
// @import in place, which pushes any later @import past ~19kB of rules into an
// illegal position and Lightning CSS silently drops it — so the fonts load from
// index.html instead. Without this test that regression is invisible: the tokens
// still resolve and the build still passes, but everything renders in Georgia.
describe('webfont loading', () => {
  const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8')

  it('loads both Instrument families from index.html', () => {
    expect(html).toMatch(/<link[^>]+fonts\.googleapis\.com[^>]+rel="stylesheet"/s)
    expect(html).toMatch(/Instrument\+Serif/)
    expect(html).toMatch(/Instrument\+Sans/)
  })

  it('requests the italic display axis the design relies on', () => {
    expect(html).toMatch(/Instrument\+Serif:ital@0;1/)
  })

  it('does not try to load fonts from the stylesheet, where they get stripped', () => {
    expect(css).not.toMatch(/@import\s+url\([^)]*googleapis/)
  })
})
