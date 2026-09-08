import { describe, it, expect } from 'vitest'
import { BUILDS, CATEGORIES, filterBuilds } from '../../src/lib/builds.js'

describe('concept builds', () => {
  it('has fourteen builds', () => {
    expect(BUILDS).toHaveLength(14)
  })

  it('gives every build a slug, name, category and image', () => {
    for (const b of BUILDS) {
      expect(b.slug).toMatch(/^[a-z0-9-]+$/)
      expect(b.name.length).toBeGreaterThan(0)
      expect(CATEGORIES).toContain(b.category)
      expect(b.image).toMatch(/^\/builds\/.+\.(jpe?g|png)$/)
    }
  })

  it('uses unique slugs', () => {
    expect(new Set(BUILDS.map((b) => b.slug)).size).toBe(14)
  })

  it('never claims a build is client work', () => {
    const blob = JSON.stringify(BUILDS)
    for (const banned of [/\bclient\b/i, /\bcustomer of\b/i, /\bhired\b/i]) {
      expect(blob).not.toMatch(banned)
    }
  })

  // Two of the old screenshots are real businesses, not speculative work:
  // gloryncustom.com is the one live site, and Cuts & Edges is a working
  // lawn-care company (real phone number, owner's own email on the page).
  // Neither may appear in a set labelled "concept builds". Spec §2.
  it('does not feature a real business', () => {
    expect(JSON.stringify(BUILDS)).not.toMatch(/gloryn/i)
    expect(JSON.stringify(BUILDS)).not.toMatch(/cuts.?and.?edges/i)
  })

  it('filters by category and returns everything for "all"', () => {
    expect(filterBuilds(BUILDS, 'all')).toHaveLength(14)
    const hospitality = filterBuilds(BUILDS, 'Hospitality & wellness')
    expect(hospitality.length).toBeGreaterThan(0)
    expect(hospitality.every((b) => b.category === 'Hospitality & wellness')).toBe(true)
  })

  it('returns an empty array for an unknown category', () => {
    expect(filterBuilds(BUILDS, 'Nonexistent')).toEqual([])
  })
})
