import { describe, it, expect } from 'vitest'
import { STEPS } from '../../src/lib/process.js'

// The brand is a personal name, but the site speaks as "we" — decided 2026-09-06,
// reversing the earlier first-person-singular direction. This guard keeps that
// consistent: singular "I / my / me / mine" must never leak back in.
//
// Whole-word matching throughout, so "Business" does not trip "us" and "time"
// does not trip "me". Verified by the self-test below.
export const SINGULAR = /\bI\b|\bI'[a-z]+|\b(?:my|mine|me)\b/i

describe('the voice guard itself', () => {
  // A guard nobody has watched work is not a guard. These pin its exact edges,
  // because the whole-word behaviour is the only thing keeping it from firing
  // on ordinary words that happen to contain "me" or "my".
  it('catches first person singular', () => {
    for (const bad of ['I build websites', "I'm available", 'my process', 'tell me more']) {
      expect(bad).toMatch(SINGULAR)
    }
  })

  it('does not fire on ordinary words that contain those letters', () => {
    for (const ok of ['We build websites', 'Business email setup', 'Sometimes', 'company']) {
      expect(ok).not.toMatch(SINGULAR)
    }
  })
})

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

  it('speaks as "we", never as "I"', () => {
    for (const step of STEPS) {
      expect(`${step.title} ${step.body}`).not.toMatch(SINGULAR)
    }
  })
})

import { PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE } from '../../src/lib/plans.js'

describe('pricing copy', () => {
  it('speaks as "we", never as "I"', () => {
    const blob = JSON.stringify({ PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE })
    expect(blob).not.toMatch(SINGULAR)
  })
})
