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

  // Real businesses used to be banned outright, because every entry was
  // labelled "concept build" and calling a live client site speculative was the
  // false claim being avoided. Provenance is now stated per case study, so real
  // work can be shown as real work — which is both more honest and better proof.
  //
  // What replaces that ban is the invariant it was really protecting: every
  // build must declare whether we built it, and nothing we did not build may be
  // described as ours.
  it('declares provenance explicitly on every build', () => {
    for (const b of BUILDS) {
      expect(typeof b.own, `${b.slug} has no own flag`).toBe('boolean')
    }
  })

  it('never describes work we did not build as ours', () => {
    const OURS = /we (built|designed|made)|our (build|work|client)/i
    for (const b of BUILDS.filter((x) => !x.own)) {
      const copy = `${b.blurb} ${b.challenge} ${b.approach} ${b.outcome}`
      expect(copy, `${b.slug} claims authorship`).not.toMatch(OURS)
    }
  })

  it('gives every build a live url to stand behind', () => {
    for (const b of BUILDS) {
      expect(b.url, `${b.slug} has no url`).toMatch(/^https:\/\//)
    }
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
