import { describe, it, expect } from 'vitest'
import { STEPS } from '../../src/lib/process.js'

// Whole-word match. "web" must not trip the "we" rule.
const PLURAL = /\b(we|we'll|we've|we're|our|ours|us)\b/i

describe('process copy', () => {
  it('has four steps', () => {
    expect(STEPS).toHaveLength(4)
  })

  it('gives every step a number, title and body', () => {
    for (const step of STEPS) {
      expect(step.num).toMatch(/^0[1-4]$/)
      expect(step.title.length).toBeGreaterThan(0)
      expect(step.body.length).toBeGreaterThan(0)
    }
  })

  it('is written in first person singular', () => {
    for (const step of STEPS) {
      expect(`${step.title} ${step.body}`).not.toMatch(PLURAL)
    }
  })
})

import { PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE } from '../../src/lib/plans.js'

describe('pricing copy', () => {
  it('is written in first person singular', () => {
    const blob = JSON.stringify({ PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE })
    expect(blob).not.toMatch(PLURAL)
  })
})
