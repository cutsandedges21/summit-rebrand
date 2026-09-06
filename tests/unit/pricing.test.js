import { describe, it, expect } from 'vitest'
import { PLANS, ADDON_GROUPS, CARE_PLUS } from '../../src/lib/plans.js'

describe('pricing data', () => {
  it('keeps the three plans at their existing prices', () => {
    expect(PLANS.map((p) => [p.name, p.price, p.setup])).toEqual([
      ['Launch', '$68', '$750'],
      ['Growth', '$108', '$1,399'],
      ['Everything', '$218', '$2,599'],
    ])
  })

  it('marks exactly one plan as featured', () => {
    expect(PLANS.filter((p) => p.featured)).toHaveLength(1)
  })

  it('carries no discount fields on any plan', () => {
    for (const plan of PLANS) {
      expect(plan).not.toHaveProperty('badge')
      expect(plan).not.toHaveProperty('wasPrice')
      expect(plan).not.toHaveProperty('perDay')
    }
  })

  it('uses no discount language anywhere in pricing copy', () => {
    const blob = JSON.stringify({ PLANS, ADDON_GROUPS, CARE_PLUS })
    for (const banned of [/sale/i, /was previously/i, /\/day/i, /save \$/i, /\bwas \$/i]) {
      expect(blob).not.toMatch(banned)
    }
  })

  it('prices the Care+ bundle without a struck-through comparison', () => {
    expect(CARE_PLUS.price).toBe('$389')
    expect(CARE_PLUS).not.toHaveProperty('wasPrice')
  })
})
