import { describe, it, expect } from 'vitest'
import { PLANS, ADDON_GROUPS, CARE_PLUS } from '../../src/lib/plans.js'
import { SERVICES } from '../../src/lib/services.js'
import { FAQS } from '../../src/lib/faq.js'

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

// Discount language was only ever guarded on plans.js, but the old site's FAQ is
// where most of it actually lived — "saving you $676/mo versus buying them
// separately" and similar. Task 16 ports FAQ answers, so the guard has to cover
// the copy modules a porting task might carry it into.
describe('discount language stays out of every copy module', () => {
  // `/save \$/` alone misses "saving you $676/mo versus buying them separately",
  // which is the actual phrasing in the old site's FAQ — so the savings pattern
  // allows a short gap between the verb and the figure.
  const BANNED = [
    /sale/i,
    /was previously/i,
    /\/day\b/i,
    /\bsav(?:e|es|ing)\b[^.]{0,24}\$/i,
    /\bwas \$/i,
    /\bdiscount/i,
  ]

  const modules = { SERVICES, FAQS, PLANS, ADDON_GROUPS, CARE_PLUS }

  for (const [name, mod] of Object.entries(modules)) {
    it(`${name} carries none`, () => {
      const blob = JSON.stringify(mod)
      for (const banned of BANNED) {
        expect(blob).not.toMatch(banned)
      }
    })
  }
})
