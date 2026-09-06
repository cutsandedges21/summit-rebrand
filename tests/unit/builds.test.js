import { describe, it, expect } from 'vitest'
import { BUILDS, CATEGORIES, filterBuilds } from '../../src/lib/builds.js'

describe('concept builds', () => {
  it('has fifteen builds', () => {
    expect(BUILDS).toHaveLength(15)
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
    expect(new Set(BUILDS.map((b) => b.slug)).size).toBe(15)
  })

  it('never claims a build is client work', () => {
    const blob = JSON.stringify(BUILDS)
    for (const banned of [/\bclient\b/i, /\bcustomer of\b/i, /\bhired\b/i]) {
      expect(blob).not.toMatch(banned)
    }
  })

  it('does not feature the live client site', () => {
    expect(JSON.stringify(BUILDS)).not.toMatch(/gloryn/i)
  })

  it('filters by category and returns everything for "all"', () => {
    expect(filterBuilds(BUILDS, 'all')).toHaveLength(15)
    const hospitality = filterBuilds(BUILDS, 'Hospitality')
    expect(hospitality.length).toBeGreaterThan(0)
    expect(hospitality.every((b) => b.category === 'Hospitality')).toBe(true)
  })

  it('returns an empty array for an unknown category', () => {
    expect(filterBuilds(BUILDS, 'Nonexistent')).toEqual([])
  })
})
