# mossimo Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the mossimo site from scratch in `summit-rebrand/` — bone-paper editorial design, chartreuse fill-only accent, three signature scroll interactions — replacing Summit Sites without porting any of its components.

**Architecture:** Vite + React 19 + Tailwind v4 (CSS-first `@theme` config) + react-router 7 + framer-motion. Content lives in plain data modules under `src/lib/` so copy is testable independently of components. Native scrolling throughout — no wheel hijacking — because `position: sticky` powers the Process section. Design rules that matter (fill-only accent, first-person voice, no discount language) are enforced by tests, not by discipline.

**Tech Stack:** Vite 8 · React 19 · Tailwind v4 · react-router-dom 7 · framer-motion 11 · Vitest + React Testing Library · Playwright

> **Versions resolved during Task 1** (`npm create vite@latest` ships the current templates):
> react 19.2.8, vite 8.2.2, tailwindcss 4.3.3, react-router-dom 7.18.3, framer-motion 11.18.2,
> vitest 5.0.0, @testing-library/react 16.3.3, @playwright/test 1.63.0. React 19 rather than 18
> is deliberate and accepted — framer-motion 11, react-router 7 and RTL 16 all support it, and
> no code in this plan relies on React 18 semantics.

**Spec:** `docs/superpowers/specs/2026-09-05-mossimo-rebrand-design.md`

---

## Resuming after an interrupted session

**This plan file is the only durable record of progress.** Agents are ephemeral; if a session
ends mid-build, nothing about the agent survives. Two things do: the checkboxes below, and
git history.

### The rule that makes resumption work

> **Every task's final commit must include this plan file with that task's checkboxes ticked.**

Not a separate commit. The same one:

```bash
git add <the files this task touched> docs/superpowers/plans/2026-09-05-mossimo-rebrand.md
git commit -m "feat: <what this task built>"
```

If the code lands and the checkbox does not, the next session reads a stale plan and redoes
finished work — or worse, skips unfinished work because a neighbouring box was ticked
optimistically.

Tick a box only after the step's stated expected output actually appeared. A ticked box is a
claim that the command ran and passed.

### To resume

1. `git log --oneline` — the last commit message names the last completed task.
2. Open this file and find the first unticked `- [ ]`.
3. **Reconcile the two.** If they disagree, git wins — the checkbox may have been ticked in a
   commit that never landed, or code may have landed without the tick. Run `npm test` to
   establish the true state before writing anything.
4. Re-read the **Standing rules** below. They apply to every task and are not repeated in
   each one.
5. Resume at that task, from step 1 of that task. Do not resume mid-task — steps within a
   task are small enough to redo cheaply, and a half-finished task has no reliable marker.

### Standing rules — apply to every task, never restated

These are invariants from the spec. Violating one is a defect even if the task's own steps
pass.

1. **Chartreuse `#C6D42B` is a fill, never a letter.** No `text-accent`, no
   `color: #c6d42b`. Enforced by `tests/unit/accent-rule.test.js`.
2. **No dark sections.** The only dark rectangles are work screenshots and recordings —
   content, never chrome.
3. **No containers.** No cards, borders, shadows or rounded panels. Hairline `border-rule`
   only. Type sits directly on the paper.
4. **First person singular.** Never `we`, `our`, `us`. Enforced by
   `tests/unit/voice.test.js`.
5. **Native scrolling only.** Never `preventDefault` a wheel or touch event, never animate
   `translateY` for scroll. `position: sticky` depends on this and the Process section
   depends on sticky.
6. **Never import from `../SummitSites`.** Read it for copy, retype what you need. It is a
   separate git repo and not a dependency.
7. **No discount language.** No "sale", "was $X", "$X/day", "save $X". Prices are stated
   plainly. Enforced by `tests/unit/pricing.test.js`.
8. **Every interaction needs a static fallback** for `prefers-reduced-motion` and for
   viewports under 768px.
9. **Never mark a step done on a failing command.** Paste the real output. If a test fails,
   fix it or stop and say so — do not proceed to the next task.

---

## File Structure

```
summit-rebrand/
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js
├── playwright.config.js
├── vercel.json
├── public/
│   ├── builds/            # 16 hero images copied from SummitSites
│   └── favicon/
├── src/
│   ├── main.jsx
│   ├── App.jsx            # routes + redirects only
│   ├── index.css          # @theme tokens, grain layer, base styles
│   ├── lib/
│   │   ├── builds.js      # 16 concept builds + filterBuilds()
│   │   ├── plans.js       # 3 plans + add-ons (no discount fields)
│   │   ├── services.js
│   │   ├── process.js     # 4 steps, first person
│   │   ├── faq.js
│   │   └── motion.js      # useReducedMotion, useIsMobile
│   ├── components/
│   │   ├── Layout.jsx     # nav + footer shell
│   │   ├── Nav.jsx
│   │   ├── Footer.jsx
│   │   ├── ArcHero.jsx
│   │   ├── WorkList.jsx
│   │   └── PinnedProcess.jsx
│   └── pages/
│       ├── Home.jsx  Work.jsx  Services.jsx  Pricing.jsx
│       ├── About.jsx  Faq.jsx  Contact.jsx
│       └── PrivacyPolicy.jsx  TermsOfService.jsx
└── tests/
    ├── unit/              # Vitest
    └── e2e/               # Playwright
```

**Responsibility split:** `lib/` holds content and pure functions — no JSX, no imports from `components/`. This is what makes the voice and pricing rules testable. `components/` holds the three signature interactions plus the shell. `pages/` assembles; pages contain layout and copy, never interaction logic.

**Source of truth for carried-over copy:** `../SummitSites/src/components/`. Read from it, never import from it.

---

## Task 1: Scaffold

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [x] **Step 1: Create the project**

Scaffolding into `.` prompts interactively because the directory is not empty, which hangs a
non-interactive shell. Scaffold into a temp directory and move the files up instead:

```bash
npm create vite@latest .vite-tmp -- --template react
mv .vite-tmp/package.json .vite-tmp/vite.config.js .vite-tmp/index.html .vite-tmp/eslint.config.js .
mv .vite-tmp/src .vite-tmp/public .
rm -rf .vite-tmp
ls
```

Expected: `docs`, `index.html`, `package.json`, `public`, `src`, `vite.config.js` present,
`.vite-tmp` gone. `docs/` and `.gitignore` untouched.

If `eslint.config.js` does not exist in the scaffold output, skip it in the `mv` — the Vite
template's exact file list varies by version. Everything else is required.

- [x] **Step 2: Install dependencies**

```bash
npm install react-router-dom@^7 framer-motion@^11
npm install -D tailwindcss@^4 @tailwindcss/vite vitest @vitest/ui jsdom \
  @testing-library/react @testing-library/jest-dom @playwright/test
```

- [x] **Step 3: Verify Tailwind major version**

```bash
npm ls tailwindcss
```

Expected: `tailwindcss@4.x.x`. **If it resolves to 3.x, stop** — this plan uses v4's CSS-first `@theme` syntax, which does not exist in v3. Re-run with `npm install -D tailwindcss@4`.

- [x] **Step 4: Configure Vite**

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [x] **Step 5: Verify the toolchain builds**

`npm run dev` blocks forever and cannot be stopped from a non-interactive shell. Build
instead — it exercises the same Vite and Tailwind pipeline and exits on its own.

```bash
npm run build
```

Expected: `✓ built in <time>`, exit code 0, and a `dist/` directory containing
`index.html` and an `assets/` folder. No warnings about a missing Tailwind plugin.

- [x] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold vite + react + tailwind v4"
```

---

## Task 2: Design tokens

The palette, type scale, and grain from spec §3. Tailwind v4 declares tokens in CSS via `@theme`, which generates the utility classes.

**Files:**
- Modify: `src/index.css` (replace entirely)
- Test: `tests/unit/tokens.test.js`

- [x] **Step 1: Write the failing test**

This test reads the CSS as text and asserts every spec token is present with the exact value. It catches typo'd hex codes, which are otherwise invisible until someone eyeballs a screenshot.

`tests/unit/tokens.test.js`:

```js
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
```

- [x] **Step 2: Configure Vitest and run the test to see it fail**

`vitest.config.js`:

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/unit/**/*.test.{js,jsx}'],
  },
})
```

`tests/setup.js`:

```js
import '@testing-library/jest-dom/vitest'
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

Run: `npm test`
Expected: FAIL — all token assertions fail against the Vite starter CSS.

- [x] **Step 3: Write `src/index.css`**

Note there is **no** `@import url(...)` for the fonts here. Tailwind v4 inlines its own
`@import` in place, so a font import written after it lands ~19kB into the file, becomes an
illegal `@import` position, and Lightning CSS drops it without failing the build. The tokens
still resolve, so the only symptom is that the whole site silently renders in Georgia. The
fonts are loaded with `<link>` from `index.html` instead — which is faster anyway, since it
avoids a CSS round-trip before the font request starts.

Add this to `index.html` in the same step (Task 18 rewrites that file later and must keep it):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

```css
@import "tailwindcss";

/* Fonts are loaded via <link> in index.html, not here.
   Tailwind inlines its own @import in place, which pushes any later @import
   past ~19kB of rules into an illegal position, and Lightning CSS drops it. */

@theme {
  --color-paper: #f0ebe8;
  --color-paper-clay: #e1d7d1;
  --color-ink: #1d1d1b;
  --color-ink-muted: #6b6560;
  --color-ink-faint: #a79f98;
  --color-rule: #ddd5cf;
  --color-accent: #c6d42b;

  --font-display: 'Instrument Serif', Georgia, serif;
  --font-sans: 'Instrument Sans', system-ui, sans-serif;

  --text-hero: clamp(44px, 7.5vw, 118px);
  --text-section: clamp(32px, 4.6vw, 72px);
  --text-sub: clamp(22px, 2.6vw, 40px);
  --text-body: clamp(14px, 1.05vw, 17px);
}

/* Fine grain — spec §3. Fixed so it does not scroll against content. */
@layer base {
  body {
    background-color: var(--color-paper);
    color: var(--color-ink);
    font-family: var(--font-sans);
    font-size: var(--text-body);
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='180'%20height='180'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.9'%20numOctaves='4'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='180'%20height='180'%20filter='url(%23n)'%20opacity='0.30'/%3E%3C/svg%3E");
    background-size: 180px 180px;
  }

  #root { position: relative; z-index: 1; }
}

@utility label {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
```

- [x] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS, 12 tests.

- [x] **Step 5: Commit**

```bash
git add src/index.css vitest.config.js tests/ package.json
git commit -m "feat: design tokens, paper grain, type scale"
```

---

## Task 3: Enforce the fill-only accent rule

Spec §3 makes this the central rule of the system: **chartreuse is a shape, never a letter.** Chartreuse text on paper is ~1.4:1 — an accessibility failure, not just a style slip. A test makes it impossible to break by accident.

**Files:**
- Create: `tests/unit/accent-rule.test.js`

- [x] **Step 1: Write the failing test**

Two subtleties here are load-bearing, both found by deliberately breaking the guard:

1. A naive `colors*:` also matches the tail of `background-color:` — `` fires between
   the hyphen and the `c` — so it blocks the one use the rule permits. The negative
   lookbehind `(?<![-w])` is what makes the guard correct rather than merely strict.
2. Matching only `text-accent` and a literal hex leaves three easy ways past it:
   `text-[#c6d42b]`, `color: var(--color-accent)`, and inline JSX styles.

The table-driven cases at the bottom pin both edges, so a later tweak cannot quietly
invert either one.

```js
import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const SRC = resolve(__dirname, '../../src')

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

const srcFiles = walk(SRC).filter((f) => /\.(jsx?|css)$/.test(f))

/**
 * Spec §3: chartreuse is a shape, never a letter.
 *
 * `#C6D42B` on the bone paper background is ~1.4:1 contrast — illegible, and an
 * accessibility failure rather than a style preference. As a fill with ink on top
 * it is ~10:1.
 *
 * The negative lookbehind matters more than it looks. Plain `\bcolor\s*:` also
 * matches the tail of `background-color:` — `\b` fires between the hyphen and the
 * `c` — so a naive version of this test blocks the exact use the rule permits.
 * `(?<![-\w])` requires `color` to start the property name.
 *
 * Case-insensitivity covers the JSX camelCase forms: `backgroundColor` and
 * `textDecorationColor` are preceded by a word character and so are correctly
 * ignored, while a bare `color:` is not.
 */
const FORBIDDEN = [
  {
    re: /\btext-accent\b/,
    why: 'text-accent paints letterforms in the accent',
  },
  {
    re: /\btext-\[\s*(#c6d42b|var\(\s*--color-accent\s*\))\s*\]/i,
    why: 'arbitrary Tailwind text colour set to the accent',
  },
  {
    re: /(?<![-\w])color\s*:\s*['"]?\s*(#c6d42b|var\(\s*--color-accent\s*\))/i,
    why: 'CSS color property set to the accent',
  },
]

describe('accent rule: chartreuse is a shape, never a letter', () => {
  it('never applies the accent as a text colour', () => {
    const offenders = []

    for (const file of srcFiles) {
      const source = readFileSync(file, 'utf8')
      source.split('\n').forEach((line, i) => {
        for (const { re, why } of FORBIDDEN) {
          if (re.test(line)) {
            offenders.push(`${relative(SRC, file)}:${i + 1} — ${why} — ${line.trim()}`)
          }
        }
      })
    }

    expect(offenders).toEqual([])
  })

  // The guard is only worth having if it catches what it claims to and permits
  // what it must. These cases pin both edges so a future tweak cannot quietly
  // invert either one.
  it.each([
    ['className="text-accent"', true],
    ['className="hover:text-accent md:text-ink"', true],
    ['className="text-[#c6d42b]"', true],
    ['className="text-[var(--color-accent)]"', true],
    ['  color: #c6d42b;', true],
    ['  color: var(--color-accent);', true],
    ['style={{ color: \'#c6d42b\' }}', true],
  ])('rejects %s', (line, shouldMatch) => {
    expect(FORBIDDEN.some(({ re }) => re.test(line))).toBe(shouldMatch)
  })

  it.each([
    ['  background-color: #c6d42b;', false],
    ['  background-color: var(--color-accent);', false],
    ['className="bg-accent"', false],
    ['className="decoration-accent"', false],
    ['  border-color: var(--color-accent);', false],
    ['style={{ backgroundColor: \'#c6d42b\' }}', false],
    ['  --color-accent: #c6d42b;', false],
  ])('permits %s', (line, shouldMatch) => {
    expect(FORBIDDEN.some(({ re }) => re.test(line))).toBe(shouldMatch)
  })
})
```

- [x] **Step 2: Run the test to verify it passes on an empty codebase, then verify it actually catches violations**

Run: `npm test -- accent-rule`
Expected: PASS (nothing to catch yet).

Now prove the test works. Temporarily add this line to `src/App.jsx`:

```jsx
// TEMPORARY - delete after verifying
const broken = <span className="text-accent">nope</span>
```

Run: `npm test -- accent-rule`
Expected: FAIL, listing `src/App.jsx:<line>`.

**Delete the temporary line.** Re-run and confirm PASS.

A test you have never seen fail is not a test.

- [x] **Step 3: Commit**

```bash
git add tests/unit/accent-rule.test.js
git commit -m "test: enforce fill-only accent rule"
```

---

## Task 4: Content data — process steps, first person

Spec §6 requires first-person voice everywhere. Source copy is third-person plural.

**Files:**
- Create: `src/lib/process.js`
- Test: `tests/unit/voice.test.js`

- [x] **Step 1: Write the failing test**

```js
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
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npm test -- voice`
Expected: FAIL — `Cannot find module '../../src/lib/process.js'`.

- [x] **Step 3: Write `src/lib/process.js`**

Converted from `../SummitSites/src/components/Process.jsx:6-27`.

```js
export const STEPS = [
  {
    num: '01',
    title: 'Tell me about your business.',
    body: "A short form. I learn your goals, your customers, and what you're actually trying to fix — in under ten minutes. No discovery call you have to dress up for.",
  },
  {
    num: '02',
    title: 'I design and build.',
    body: "Design, copy, development — all of it. You review, you tell me what's wrong, I refine until it's right.",
  },
  {
    num: '03',
    title: 'Launch and go live.',
    body: 'Domain, hosting, performance, the lot. I handle the parts that break at 2am, so you hear about them from me and not from a customer.',
  },
  {
    num: '04',
    title: 'I stay on after launch.',
    body: 'Updates, fixes, new pages. One flat rate, no surprise invoices, no disappearing act.',
  },
]
```

- [x] **Step 4: Run the test to verify it passes**

Run: `npm test -- voice`
Expected: PASS, 3 tests.

- [x] **Step 5: Commit**

```bash
git add src/lib/process.js tests/unit/voice.test.js
git commit -m "feat: process steps in first person"
```

---

## Task 5: Content data — pricing, with no discount language

Spec §6 removes discount framing while keeping prices identical. The test enforces both halves.

**Files:**
- Create: `src/lib/plans.js`
- Modify: `tests/unit/voice.test.js`
- Test: `tests/unit/pricing.test.js`

- [ ] **Step 1: Write the failing test**

`tests/unit/pricing.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- pricing`
Expected: FAIL — `Cannot find module '../../src/lib/plans.js'`.

- [ ] **Step 3: Write `src/lib/plans.js`**

Prices from `../SummitSites/src/components/Pricing.jsx:4-85`. The third plan is renamed `Summit` → `Everything`, since "Summit" was the old brand.

```js
export const PLANS = [
  {
    name: 'Launch',
    tagline: 'Establish your presence',
    price: '$68',
    setup: '$750',
    features: [
      'One to four pages',
      'Built for phones first',
      'Contact form',
      'Custom design, no templates',
      'Hosting, security and updates',
      'Up to two hours of edits a month',
      'Uptime monitoring',
    ],
  },
  {
    name: 'Growth',
    tagline: 'Turn visitors into customers',
    price: '$108',
    setup: '$1,399',
    featured: true,
    features: [
      'Everything in Launch',
      'Five to seven pages',
      'Local SEO — found on Google',
      'Copy and layout written to convert',
      'A landing page built to sell',
      'Reviews and testimonials',
      'Google Business Profile set up',
    ],
  },
  {
    name: 'Everything',
    tagline: 'Scale with optimisation',
    price: '$218',
    setup: '$2,599',
    features: [
      'Everything in Growth',
      'Unlimited pages',
      'Unlimited edits, priority turnaround',
      'Ongoing SEO',
      'Monthly performance report',
      'A/B split testing',
      'Animated and 3D elements',
    ],
  },
]

export const ADDON_GROUPS = [
  {
    label: 'Ongoing',
    note: 'Added to your monthly plan',
    items: [
      { name: 'Unlimited edits', note: 'One request at a time, 48hr turnaround', price: '$99/mo' },
      { name: 'Google Business Profile management', price: '$79/mo' },
      { name: 'Monthly analytics report', price: '$39/mo' },
      { name: 'Professional copywriting', price: '$299–599/mo' },
      { name: 'Booking and scheduling system', price: '$249/mo' },
    ],
  },
  {
    label: 'One-off',
    note: 'Billed once, as needed',
    items: [
      { name: 'Brand or logo refresh', price: '$249–499' },
      { name: 'Extra pages', price: '$75–125/page' },
      { name: 'Business email setup', price: '$75' },
      { name: 'Extra project work', note: 'New features and builds, not routine edits', price: '$49/hr' },
    ],
  },
]

export const CARE_PLUS = {
  name: 'Care+',
  price: '$389',
  body: 'Unlimited edits, Google Business Profile management and a monthly analytics report — handled for one flat rate.',
}

export const PRICING_NOTE =
  'Every monthly plan includes two hours of work per month. The Everything plan includes unlimited edits. Work beyond those two hours may be billed separately.'
```

- [ ] **Step 4: Extend the voice test to cover pricing**

Append to `tests/unit/voice.test.js`:

```js
import { PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE } from '../../src/lib/plans.js'

describe('pricing copy', () => {
  it('is written in first person singular', () => {
    const blob = JSON.stringify({ PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE })
    expect(blob).not.toMatch(PLURAL)
  })
})
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS. Pricing 5 tests, voice 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/plans.js tests/unit/pricing.test.js tests/unit/voice.test.js
git commit -m "feat: pricing data with discount framing removed"
```

---

## Task 6: Content data — the fifteen concept builds

Spec §2 and §4.2. Every build must be flagged as a concept build; nothing may imply a client.

**Files:**
- Create: `src/lib/builds.js`
- Test: `tests/unit/builds.test.js`

- [ ] **Step 1: Write the failing test**

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- builds`
Expected: FAIL — module not found.

- [ ] **Step 3: Copy the build images across**

```bash
mkdir -p public/builds
cp ../SummitSites/public/aircenter-hero.jpg public/builds/
cp ../SummitSites/public/brand-cosmetics-hero.jpeg public/builds/
cp ../SummitSites/public/cutsandedges-hero.jpeg public/builds/
cp ../SummitSites/public/drinksom-hero.jpeg public/builds/
cp ../SummitSites/public/elixir-hotel-hero.jpeg public/builds/
cp ../SummitSites/public/halcyon-hero.jpeg public/builds/
cp ../SummitSites/public/handhold-hero.jpeg public/builds/
cp ../SummitSites/public/khufus-hero.jpeg public/builds/
cp ../SummitSites/public/lamborghini-hero.jpeg public/builds/
cp ../SummitSites/public/laserandme-hero.jpeg public/builds/
cp ../SummitSites/public/meridian-hero.png public/builds/
cp ../SummitSites/public/monads-hero.jpeg public/builds/
cp ../SummitSites/public/piment-hero.jpeg public/builds/
cp ../SummitSites/public/sterling-hero.jpeg public/builds/
cp ../SummitSites/public/vorszk-hero.jpeg public/builds/
ls public/builds | wc -l
```

Expected: `15`.

**`glorync-hero.jpeg` is deliberately not copied.** It is the live client site
`gloryncustom.com`. Spec §2 says the portfolio is concept builds only and that this site is
not featured — so putting it in a list labelled "concept builds" would be a false claim about
real client work, which is the exact failure mode §2 exists to prevent. Renaming it would be
worse, not better. Fifteen builds, not sixteen.

- [ ] **Step 4: Write `src/lib/builds.js`**

Categories are assigned from what each build actually is. Adjust a category if a build turns out to be something else once you look at the image — the test only requires the value be one of `CATEGORIES`.

```js
export const CATEGORIES = [
  'Hospitality',
  'Food & drink',
  'Retail',
  'Services',
  'Automotive',
  'Studio',
]

export const BUILDS = [
  { slug: 'halcyon',        name: 'Halcyon',        category: 'Hospitality',  image: '/builds/halcyon-hero.jpeg',         blurb: 'Boutique hotel. Built to make one thing easy: checking availability without leaving the page.' },
  { slug: 'elixir',         name: 'Elixir',         category: 'Hospitality',  image: '/builds/elixir-hotel-hero.jpeg',    blurb: 'City hotel. Rooms, rates and a booking flow that survives being used on a phone in a taxi.' },
  { slug: 'piment',         name: 'Piment',         category: 'Food & drink', image: '/builds/piment-hero.jpeg',          blurb: 'Restaurant. Menu, hours and a reservation link above the fold, because that is all anyone came for.' },
  { slug: 'drinksom',       name: 'Drinksom',       category: 'Food & drink', image: '/builds/drinksom-hero.jpeg',        blurb: 'Drinks brand. Product-led layout with the stockist list one tap away.' },
  { slug: 'khufus',         name: 'Khufus',         category: 'Food & drink', image: '/builds/khufus-hero.jpeg',          blurb: 'Restaurant. Heavy on photography, light on everything else.' },
  { slug: 'meridian',       name: 'Meridian',       category: 'Studio',       image: '/builds/meridian-hero.png',         blurb: 'Design studio. A portfolio that gets out of the way of the work.' },
  { slug: 'monads',         name: 'Monads',         category: 'Studio',       image: '/builds/monads-hero.jpeg',          blurb: 'Creative studio. Editorial grid, long scroll, minimal chrome.' },
  { slug: 'vorszk',         name: 'Vorszk',         category: 'Studio',       image: '/builds/vorszk-hero.jpeg',          blurb: 'Motion studio. Built around a showreel that loads fast enough to actually get watched.' },
  { slug: 'sterling',       name: 'Sterling',       category: 'Services',     image: '/builds/sterling-hero.jpeg',        blurb: 'Professional services. Credibility first — team, credentials, and a clear way to make contact.' },
  { slug: 'handhold',       name: 'Handhold',       category: 'Services',     image: '/builds/handhold-hero.jpeg',        blurb: 'Care service. Written for a worried person reading it at midnight.' },
  { slug: 'laser-and-me',   name: 'Laser and Me',   category: 'Services',     image: '/builds/laserandme-hero.jpeg',      blurb: 'Clinic. Treatments, pricing and booking, with none of the usual coyness about cost.' },
  { slug: 'cuts-and-edges', name: 'Cuts and Edges', category: 'Services',     image: '/builds/cutsandedges-hero.jpeg',    blurb: 'Barbershop. Book, find, and see the work — nothing else on the page.' },
  { slug: 'air-center',     name: 'Air Center',     category: 'Services',     image: '/builds/aircenter-hero.jpg',        blurb: 'Trade business. Services, service area, and a phone number that is never more than a thumb away.' },
  { slug: 'brand-cosmetics',name: 'Brand Cosmetics',category: 'Retail',       image: '/builds/brand-cosmetics-hero.jpeg', blurb: 'Cosmetics. Product grid built to survive a catalogue three times the size.' },
  { slug: 'lamborghini',    name: 'Lamborghini',    category: 'Automotive',   image: '/builds/lamborghini-hero.jpeg',     blurb: 'Concept exercise. An excuse to build something loud and see how far the layout stretches.' },
]

/**
 * @param {typeof BUILDS} builds
 * @param {string} category - a value from CATEGORIES, or 'all'
 */
export function filterBuilds(builds, category) {
  if (category === 'all') return builds
  return builds.filter((b) => b.category === category)
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- builds`
Expected: PASS, 7 tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/builds.js public/builds tests/unit/builds.test.js
git commit -m "feat: sixteen concept builds with category filter"
```

---

## Task 7: Content data — services and FAQ

**Files:**
- Create: `src/lib/services.js`, `src/lib/faq.js`
- Modify: `tests/unit/voice.test.js`

- [ ] **Step 1: Write the failing test**

Append to `tests/unit/voice.test.js`:

```js
import { SERVICES } from '../../src/lib/services.js'
import { FAQS } from '../../src/lib/faq.js'

describe('services copy', () => {
  it('has four services', () => {
    expect(SERVICES).toHaveLength(4)
  })

  it('is written in first person singular', () => {
    expect(JSON.stringify(SERVICES)).not.toMatch(PLURAL)
  })
})

describe('faq copy', () => {
  it('gives every entry a question and an answer', () => {
    expect(FAQS.length).toBeGreaterThan(0)
    for (const f of FAQS) {
      expect(f.q.endsWith('?')).toBe(true)
      expect(f.a.length).toBeGreaterThan(0)
    }
  })

  it('is written in first person singular', () => {
    expect(JSON.stringify(FAQS)).not.toMatch(PLURAL)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- voice`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/lib/services.js`**

From `../SummitSites/src/components/Services.jsx:4-29`, converted to first person. Icons are dropped — the reference language has no iconography.

```js
export const SERVICES = [
  {
    title: 'Design',
    blurb: 'Built around your business, not a template someone else already bought.',
    includes: [
      'Custom design',
      'Phone-first layouts',
      'Copy and layout aimed at conversion',
      'Animated and 3D elements where they earn their place',
    ],
  },
  {
    title: 'Development',
    blurb: 'Fast, modern, and still working in two years.',
    includes: [
      'React build',
      'Booking and scheduling systems',
      'Speed optimisation',
      'Tested across browsers',
    ],
  },
  {
    title: 'SEO',
    blurb: 'Built to rank from day one — found on Google, and turning searches into calls.',
    includes: [
      'Local SEO',
      'On-page optimisation and schema',
      'Core Web Vitals',
      'Google Business Profile',
    ],
  },
  {
    title: 'Care and growth',
    blurb: 'I keep it fast, secure and improving. Nothing for you to do.',
    includes: [
      'Hosting, security and updates',
      'Uptime monitoring',
      'Monthly analytics report',
      'Ongoing edits and optimisation',
    ],
  },
]
```

- [ ] **Step 4: Write `src/lib/faq.js`**

Read `../SummitSites/src/components/FAQ.jsx` for the current entries and convert each to first person. If an entry references the old brand, rewrite it. Minimum viable set, all first person:

```js
export const FAQS = [
  {
    q: 'Who actually builds the site?',
    a: 'I do. Design, copy, development, launch and everything after it. You will never be handed to an account manager, because there is not one.',
  },
  {
    q: 'How long does it take?',
    a: 'Two to four weeks from the day I have your content, depending on the plan. The slow part is almost always waiting on photos and text, so the sooner you send them the sooner you launch.',
  },
  {
    q: 'What happens if I want changes after launch?',
    a: 'Every plan includes two hours of edits a month. Send them over and I turn them around. Bigger pieces of work get quoted first so there is never a surprise invoice.',
  },
  {
    q: 'Do I own the site?',
    a: 'Yes. The design and content are yours. The monthly fee covers hosting, upkeep and my ongoing time — not permission to keep using your own website.',
  },
  {
    q: 'What if I want to leave?',
    a: 'No lock-in. Give me a month of notice and I will hand over the files and help you move.',
  },
  {
    q: 'Is the work on the site real client work?',
    a: 'No, and I would rather say so plainly. The builds shown are concept builds — made to show what I do rather than to dress up a client list I do not have yet.',
  },
]
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- voice`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/services.js src/lib/faq.js tests/unit/voice.test.js
git commit -m "feat: services and faq copy in first person"
```

---

## Task 8: Motion and viewport hooks

Spec §8 and §9. Every signature interaction needs a static fallback.

**Files:**
- Create: `src/lib/motion.js`
- Test: `tests/unit/motion.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useReducedMotion, useIsMobile } from '../../src/lib/motion.js'

function mockMatchMedia(matches) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

describe('useReducedMotion', () => {
  beforeEach(() => vi.restoreAllMocks())

  it('is true when the user asks for reduced motion', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })

  it('is false otherwise', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it('queries the correct media feature', () => {
    mockMatchMedia(false)
    renderHook(() => useReducedMotion())
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })
})

describe('useIsMobile', () => {
  it('uses the 768px breakpoint from the spec', () => {
    mockMatchMedia(true)
    renderHook(() => useIsMobile())
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- motion`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/lib/motion.js`**

```js
import { useEffect, useState } from 'react'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(list.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- motion`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/motion.js tests/unit/motion.test.jsx
git commit -m "feat: reduced-motion and mobile breakpoint hooks"
```

---

## Task 9: Routing and redirects

Spec §5. `/portfolio` and `/inspiration` must redirect to `/work`.

**Files:**
- Modify: `src/App.jsx`, `src/main.jsx`
- Create: `src/pages/Home.jsx` and eight sibling placeholder pages
- Test: `tests/unit/routes.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Routes } from '../../src/App.jsx'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes />
    </MemoryRouter>,
  )
}

describe('routing', () => {
  const pages = [
    ['/', 'home-page'],
    ['/work', 'work-page'],
    ['/services', 'services-page'],
    ['/pricing', 'pricing-page'],
    ['/about', 'about-page'],
    ['/faq', 'faq-page'],
    ['/contact', 'contact-page'],
    ['/privacy-policy', 'privacy-page'],
    ['/terms-of-service', 'terms-page'],
  ]

  for (const [path, testId] of pages) {
    it(`renders ${path}`, () => {
      renderAt(path)
      expect(screen.getByTestId(testId)).toBeInTheDocument()
    })
  }

  it('redirects /portfolio to /work', () => {
    renderAt('/portfolio')
    expect(screen.getByTestId('work-page')).toBeInTheDocument()
  })

  it('redirects /inspiration to /work', () => {
    renderAt('/inspiration')
    expect(screen.getByTestId('work-page')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- routes`
Expected: FAIL — `Routes` is not exported from `App.jsx`.

- [ ] **Step 3: Create the nine page stubs**

Each page gets its `data-testid` now and real content in a later task. Create all nine with this shape, substituting name and testid:

`src/pages/Home.jsx`:

```jsx
export default function Home() {
  return <div data-testid="home-page" />
}
```

Repeat for `Work.jsx` (`work-page`), `Services.jsx` (`services-page`), `Pricing.jsx` (`pricing-page`), `About.jsx` (`about-page`), `Faq.jsx` (`faq-page`), `Contact.jsx` (`contact-page`), `PrivacyPolicy.jsx` (`privacy-page`), `TermsOfService.jsx` (`terms-page`).

- [ ] **Step 4: Write `src/App.jsx`**

`Routes` is exported separately from the default so tests can mount it inside a `MemoryRouter`.

```jsx
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Work from './pages/Work.jsx'
import Services from './pages/Services.jsx'
import Pricing from './pages/Pricing.jsx'
import About from './pages/About.jsx'
import Faq from './pages/Faq.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'

export function Routes() {
  return (
    <RouterRoutes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/portfolio" element={<Navigate to="/work" replace />} />
        <Route path="/inspiration" element={<Navigate to="/work" replace />} />
      </Route>
    </RouterRoutes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}
```

- [ ] **Step 5: Write the minimal Layout so routes can mount**

`src/components/Layout.jsx` — expanded in Task 10.

```jsx
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return <Outlet />
}
```

- [ ] **Step 6: Point main.jsx at the app**

`src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 7: Delete the Vite starter boilerplate**

Task 1 left the scaffold's demo files in place, and this is the task that stops referencing
them. Nothing else in the plan removes them, so they would otherwise ship.

```bash
rm -rf src/App.css src/assets
grep -rn "App.css\|src/assets" src/ || echo "no references remain"
```

Expected: `no references remain`. If `grep` finds anything, you have missed an import —
`App.jsx` and `main.jsx` are the only files that referenced them.

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- routes`
Expected: PASS, 11 tests.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: routes with /portfolio and /inspiration redirects"
```

---

## Task 10: Layout shell — nav and footer

Spec §3 (no containers, hairline rules), §6 (Montreal, across Canada), §10 (the Gmail address is deliberate).

**Files:**
- Modify: `src/components/Layout.jsx`
- Create: `src/components/Nav.jsx`, `src/components/Footer.jsx`
- Test: `tests/unit/shell.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Nav from '../../src/components/Nav.jsx'
import Footer from '../../src/components/Footer.jsx'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('nav', () => {
  it('shows the lowercase wordmark', () => {
    wrap(<Nav />)
    expect(screen.getByText('mossimo')).toBeInTheDocument()
  })

  it('links to every primary page', () => {
    wrap(<Nav />)
    for (const label of ['Work', 'Services', 'Pricing', 'About', 'Contact']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('never says Summit Sites', () => {
    const { container } = wrap(<Nav />)
    expect(container.textContent).not.toMatch(/summit/i)
  })
})

describe('footer', () => {
  it('states the location from the spec', () => {
    wrap(<Footer />)
    expect(screen.getByText(/montreal/i)).toBeInTheDocument()
    expect(screen.getByText(/canada/i)).toBeInTheDocument()
  })

  it('links the contact email as a mailto', () => {
    wrap(<Footer />)
    const link = screen.getByRole('link', { name: /summitsites\.agency@gmail\.com/ })
    expect(link).toHaveAttribute('href', 'mailto:summitsites.agency@gmail.com')
  })

  it('does not use the retired tagline', () => {
    const { container } = wrap(<Footer />)
    expect(container.textContent).not.toMatch(/your business, elevated/i)
  })
})
```

The email assertion is deliberate. Spec §10 records the old-brand Gmail as an accepted launch compromise; the test pins it so that when it changes, it changes on purpose.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- shell`
Expected: FAIL — `Nav.jsx` not found.

- [ ] **Step 3: Write `src/components/Nav.jsx`**

Accent marks the active route as a **fill** — never coloured text.

```jsx
import { Link, NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/work', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  return (
    <header className="flex items-baseline justify-between px-6 py-5 md:px-12">
      <Link to="/" className="font-sans text-[15px] font-semibold tracking-tight">
        mossimo
      </Link>
      <nav className="flex gap-1 font-sans text-[11px] font-medium md:gap-2 md:text-[13px]">
        {LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-2 py-1 ${isActive ? 'bg-accent font-semibold' : 'text-ink-muted hover:text-ink'}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
```

- [ ] **Step 4: Write `src/components/Footer.jsx`**

```jsx
import { Link } from 'react-router-dom'

const EMAIL = 'summitsites.agency@gmail.com'

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-rule px-6 py-8 md:px-12">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <Link to="/" className="font-sans text-[15px] font-semibold tracking-tight">
          mossimo
        </Link>
        <p className="font-sans text-[11px] text-ink-muted">
          Based in Montreal. Working across Canada.
        </p>
        <a href={`mailto:${EMAIL}`} className="font-sans text-[11px] text-ink-muted underline">
          {EMAIL}
        </a>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-4">
        <span className="font-sans text-[11px] text-ink-faint">
          © {new Date().getFullYear()} mossimo
        </span>
        <nav className="flex gap-5 font-sans text-[11px] text-ink-muted">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  )
}
```

- [ ] **Step 5: Wire them into Layout**

`src/components/Layout.jsx`:

```jsx
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

export default function Layout() {
  const { pathname } = useLocation()

  // Native scroll — no wheel hijacking. Sticky positioning depends on this.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — shell 6 tests, everything else still green.

- [ ] **Step 7: Commit**

```bash
git add src/components tests/unit/shell.test.jsx
git commit -m "feat: nav and footer shell"
```

---

## Task 11: ArcHero

Spec §4.1. Sixteen builds in a perspective corridor that flies apart on scroll.

**Files:**
- Create: `src/components/ArcHero.jsx`
- Test: `tests/unit/arc-hero.test.jsx`

- [ ] **Step 1: Write the failing test**

**Note on mocking:** `vi.spyOn(module, 'export')` does not intercept ESM named imports — the
component captured the binding at import time. Use `vi.mock` with a factory, which replaces
the module before the component imports from it. Every test in this plan that swaps a hook
uses this pattern.

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../src/lib/motion.js', () => ({
  useReducedMotion: vi.fn(() => false),
  useIsMobile: vi.fn(() => false),
}))

import ArcHero from '../../src/components/ArcHero.jsx'
import { useReducedMotion, useIsMobile } from '../../src/lib/motion.js'

const renderHero = () =>
  render(
    <MemoryRouter>
      <ArcHero />
    </MemoryRouter>,
  )

describe('ArcHero', () => {
  beforeEach(() => {
    useReducedMotion.mockReturnValue(false)
    useIsMobile.mockReturnValue(false)
  })

  it('renders the headline', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /businesses that answer the phone/i,
    )
  })

  it('renders one tile per build', () => {
    renderHero()
    expect(screen.getAllByTestId('arc-tile')).toHaveLength(15)
  })

  it('hides decorative tiles from assistive technology', () => {
    renderHero()
    for (const tile of screen.getAllByTestId('arc-tile')) {
      expect(tile).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('collapses to a static arc when reduced motion is requested', () => {
    useReducedMotion.mockReturnValue(true)
    renderHero()
    expect(screen.getByTestId('arc-stage')).toHaveAttribute('data-static', 'true')
  })

  it('animates when reduced motion is not requested', () => {
    renderHero()
    expect(screen.getByTestId('arc-stage')).toHaveAttribute('data-static', 'false')
  })

  it('collapses on mobile regardless of motion preference', () => {
    useIsMobile.mockReturnValue(true)
    renderHero()
    expect(screen.getByTestId('arc-stage')).toHaveAttribute('data-static', 'true')
  })

  it('routes the call to action without a full page reload', () => {
    renderHero()
    expect(screen.getByRole('link', { name: /see the work/i })).toHaveAttribute('href', '/work')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- arc-hero`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/ArcHero.jsx`**

Tiles are spread symmetrically around centre. Index maps to a signed offset, which drives `rotateY`, `scale` and `translateX`. On scroll, `spread` pushes tiles outward and `fade` drops them out.

```jsx
import { useScroll, useTransform, motion as fm } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { BUILDS } from '../lib/builds.js'
import { useReducedMotion, useIsMobile } from '../lib/motion.js'

const CENTRE = (BUILDS.length - 1) / 2

/**
 * Signed distance from the middle of the arc. Works for any build count:
 * with 15 builds the centre tile gets offset 0 and faces straight at you.
 */
function offsetFor(index) {
  return index - CENTRE
}

function Tile({ build, index, spread }) {
  const offset = offsetFor(index)
  const distance = Math.abs(offset)
  const direction = Math.sign(offset)

  return (
    <fm.div
      data-testid="arc-tile"
      aria-hidden="true"
      className="absolute h-[38vh] w-[13vw] min-w-[74px] shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
      style={{
        backgroundImage: `url(${build.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        rotateY: -direction * (14 + distance * 3),
        scale: 0.55 + distance * 0.085,
        x: spread ? undefined : direction * distance * 78,
        zIndex: 10 - distance,
      }}
    />
  )
}

export default function ArcHero() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const isStatic = reduced || mobile

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Tiles fly apart and fade as the hero leaves the viewport.
  const spreadScale = useTransform(scrollYProgress, [0, 1], [1, 3.4])
  const spreadFade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden px-6 md:px-12">
      <fm.div
        data-testid="arc-stage"
        data-static={String(isStatic)}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          perspective: 1100,
          scale: isStatic ? 1 : spreadScale,
          opacity: isStatic ? 1 : spreadFade,
        }}
      >
        {BUILDS.map((build, i) => (
          <Tile key={build.slug} build={build} index={i} spread={isStatic} />
        ))}
      </fm.div>

      <div className="relative flex min-h-[92vh] flex-col items-center justify-center text-center">
        <p className="label mb-5">Web design, build and upkeep — Montreal</p>
        <h1
          className="font-display leading-[1.02] tracking-tight"
          style={{
            fontSize: 'var(--text-hero)',
            textShadow: '0 2px 28px rgba(240,235,232,0.92)',
          }}
        >
          I build <em>websites</em> for businesses
          <br />
          that <em>answer</em> the phone.
        </h1>
        <p className="mt-7 max-w-lg font-sans text-ink-muted">
          Design, build, local SEO and upkeep — start to finish, by one person.
        </p>
        <Link
          to="/work"
          className="mt-8 bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
        >
          See the work
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- arc-hero`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/ArcHero.jsx tests/unit/arc-hero.test.jsx
git commit -m "feat: arc hero with static fallback for reduced motion and mobile"
```

---

## Task 12: WorkList

Spec §4.2. Serif list, chartreuse hover sweep, video frame alongside, industry filter.

**Files:**
- Create: `src/components/WorkList.jsx`
- Test: `tests/unit/work-list.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorkList from '../../src/components/WorkList.jsx'
import { BUILDS } from '../../src/lib/builds.js'

describe('WorkList', () => {
  it('lists every build by default', () => {
    render(<WorkList builds={BUILDS} />)
    expect(screen.getAllByTestId('work-row')).toHaveLength(15)
  })

  it('limits the list when given a limit', () => {
    render(<WorkList builds={BUILDS} limit={5} />)
    expect(screen.getAllByTestId('work-row')).toHaveLength(5)
  })

  it('hides the filter when limited', () => {
    render(<WorkList builds={BUILDS} limit={5} />)
    expect(screen.queryByTestId('work-filter')).not.toBeInTheDocument()
  })

  it('narrows the list when a category is chosen', async () => {
    const user = userEvent.setup()
    render(<WorkList builds={BUILDS} />)
    await user.click(screen.getByRole('button', { name: 'Studio' }))
    const rows = screen.getAllByTestId('work-row')
    expect(rows).toHaveLength(3)
    expect(rows.map((r) => r.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining('Meridian')]),
    )
  })

  it('labels the work as concept builds', () => {
    render(<WorkList builds={BUILDS} />)
    expect(screen.getByText(/concept builds/i)).toBeInTheDocument()
  })

  it('shows the first build in the preview frame initially', () => {
    render(<WorkList builds={BUILDS} />)
    expect(screen.getByTestId('work-preview')).toHaveAttribute(
      'data-slug',
      BUILDS[0].slug,
    )
  })

  it('swaps the preview when a row is hovered', async () => {
    const user = userEvent.setup()
    render(<WorkList builds={BUILDS} />)
    await user.hover(screen.getAllByTestId('work-row')[2])
    expect(screen.getByTestId('work-preview')).toHaveAttribute(
      'data-slug',
      BUILDS[2].slug,
    )
  })

  it('swaps the preview on focus, so keyboards work too', async () => {
    render(<WorkList builds={BUILDS} />)
    const rows = screen.getAllByTestId('work-row')
    rows[4].focus()
    expect(screen.getByTestId('work-preview')).toHaveAttribute('data-slug', BUILDS[4].slug)
  })
})
```

- [ ] **Step 2: Install user-event and run the test to verify it fails**

```bash
npm install -D @testing-library/user-event
```

Run: `npm test -- work-list`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/WorkList.jsx`**

The hover sweep is a background fill that scales from left, never a text colour.

```jsx
import { useState } from 'react'
import { CATEGORIES, filterBuilds } from '../lib/builds.js'

export default function WorkList({ builds, limit }) {
  const [category, setCategory] = useState('all')
  const [activeSlug, setActiveSlug] = useState(builds[0]?.slug)

  const filtered = filterBuilds(builds, category)
  const shown = limit ? filtered.slice(0, limit) : filtered
  const active = builds.find((b) => b.slug === activeSlug) ?? shown[0]

  return (
    <section className="px-6 py-20 md:px-12">
      <p className="label mb-6">Selected work · concept builds</p>

      {!limit && (
        <div data-testid="work-filter" className="mb-8 flex flex-wrap gap-1">
          {['all', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 font-sans text-[11px] font-medium ${
                category === cat ? 'bg-accent font-semibold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <ul className="flex-1">
          {shown.map((build) => (
            <li key={build.slug}>
              <a
                href={`/work#${build.slug}`}
                data-testid="work-row"
                onMouseEnter={() => setActiveSlug(build.slug)}
                onFocus={() => setActiveSlug(build.slug)}
                className="group relative block py-1 font-display leading-[1.18] tracking-tight"
                style={{ fontSize: 'var(--text-sub)' }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-[-9px] right-[-9px] origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                />
                <span className="relative">{build.name}</span>
                <span className="relative ml-3 font-sans text-[11px] text-ink-muted">
                  {build.category}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="w-full md:w-[380px] md:shrink-0">
          <div
            data-testid="work-preview"
            data-slug={active?.slug}
            className="aspect-[16/10] bg-cover bg-center"
            style={{ backgroundImage: active ? `url(${active.image})` : undefined }}
            role="img"
            aria-label={active ? `${active.name} — concept build` : 'Concept build preview'}
          />
          <p className="mt-3 font-sans text-[12px] leading-relaxed text-ink-muted">
            {active?.blurb}
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- work-list`
Expected: PASS, 8 tests.

If the Studio count assertion fails, it means the category assignments in `src/lib/builds.js` changed. Update the expected number to match — the test is checking the filter works, not that exactly three studios exist.

- [ ] **Step 5: Commit**

```bash
git add src/components/WorkList.jsx tests/unit/work-list.test.jsx package.json
git commit -m "feat: work list with category filter and hover preview"
```

---

## Task 13: PinnedProcess

Spec §4.3. Left column pins; right column scrolls; chartreuse marker walks the index.

**Files:**
- Create: `src/components/PinnedProcess.jsx`
- Test: `tests/unit/pinned-process.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../src/lib/motion.js', () => ({
  useReducedMotion: vi.fn(() => false),
  useIsMobile: vi.fn(() => false),
}))

import PinnedProcess from '../../src/components/PinnedProcess.jsx'
import { STEPS } from '../../src/lib/process.js'
import { useIsMobile } from '../../src/lib/motion.js'

describe('PinnedProcess', () => {
  beforeEach(() => useIsMobile.mockReturnValue(false))

  it('renders all four steps', () => {
    render(<PinnedProcess />)
    expect(screen.getAllByTestId('process-step')).toHaveLength(4)
  })

  it('renders an index entry per step', () => {
    render(<PinnedProcess />)
    expect(screen.getAllByTestId('process-index-item')).toHaveLength(4)
  })

  it('marks the first step active on load', () => {
    render(<PinnedProcess />)
    const items = screen.getAllByTestId('process-index-item')
    expect(items[0]).toHaveAttribute('data-active', 'true')
    expect(items[1]).toHaveAttribute('data-active', 'false')
  })

  it('pins the left column on desktop', () => {
    render(<PinnedProcess />)
    expect(screen.getByTestId('process-pin')).toHaveAttribute('data-pinned', 'true')
  })

  it('does not pin on mobile', () => {
    useIsMobile.mockReturnValue(true)
    render(<PinnedProcess />)
    expect(screen.getByTestId('process-pin')).toHaveAttribute('data-pinned', 'false')
  })

  it('shows every step body so nothing is hidden behind scroll', () => {
    render(<PinnedProcess />)
    for (const step of STEPS) {
      expect(screen.getByText(step.title)).toBeInTheDocument()
    }
  })

  // Spec §9: the index must be keyboard reachable, not a decorative progress bar.
  it('exposes each index entry as a button', () => {
    render(<PinnedProcess />)
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  it('activates a step when its index button is clicked', async () => {
    const user = userEvent.setup()
    render(<PinnedProcess />)
    await user.click(screen.getAllByRole('button')[2])
    const items = screen.getAllByTestId('process-index-item')
    expect(items[2]).toHaveAttribute('data-active', 'true')
    expect(items[0]).toHaveAttribute('data-active', 'false')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- pinned-process`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/PinnedProcess.jsx`**

`IntersectionObserver` drives the active index. `position: sticky` does the pinning — which only works because Layout uses native scroll.

```jsx
import { useEffect, useRef, useState } from 'react'
import { STEPS } from '../lib/process.js'
import { useIsMobile } from '../lib/motion.js'

export default function PinnedProcess() {
  const [activeIndex, setActiveIndex] = useState(0)
  const stepRefs = useRef([])
  const mobile = useIsMobile()

  useEffect(() => {
    if (mobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const index = stepRefs.current.indexOf(visible.target)
        if (index !== -1) setActiveIndex(index)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0.1, 0.5, 0.9] },
    )

    for (const el of stepRefs.current) {
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [mobile])

  return (
    <section className="px-6 py-20 md:px-12">
      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        <div
          data-testid="process-pin"
          data-pinned={String(!mobile)}
          className={`md:w-[44%] md:shrink-0 ${mobile ? '' : 'md:sticky md:top-16 md:self-start'}`}
        >
          <p className="label">How this works</p>
          <h2
            className="mt-2 font-display leading-[1.05] tracking-tight"
            style={{ fontSize: 'var(--text-section)' }}
          >
            Four steps,
            <br />
            start to live.
          </h2>

          <ol className="mt-8 flex flex-col items-start gap-1">
            {STEPS.map((step, i) => (
              <li key={step.num}>
                <button
                  type="button"
                  data-testid="process-index-item"
                  data-active={String(i === activeIndex)}
                  aria-current={i === activeIndex ? 'step' : undefined}
                  onClick={() => {
                    setActiveIndex(i)
                    stepRefs.current[i]?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }}
                  className={`px-2 py-1 text-left font-sans text-[12px] font-medium transition-colors ${
                    i === activeIndex ? 'bg-accent font-semibold' : 'text-ink-faint hover:text-ink'
                  }`}
                >
                  {step.num}&nbsp;&nbsp;{step.title.replace(/\.$/, '')}
                </button>
              </li>
            ))}
          </ol>

          <p className="mt-8 font-sans text-[12px] text-ink-muted">
            One person for all four. No handoffs.
          </p>
        </div>

        <div className="flex-1">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              data-testid="process-step"
              ref={(el) => {
                stepRefs.current[i] = el
              }}
              className="border-t border-rule py-10 first:border-t-0 first:pt-0 md:min-h-[62vh]"
            >
              <h3
                className="font-display leading-[1.1] tracking-tight"
                style={{ fontSize: 'var(--text-sub)' }}
              >
                {step.title}
              </h3>
              <p className="mt-3 max-w-md font-sans leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Stub the browser APIs jsdom lacks**

jsdom implements none of `IntersectionObserver`, `matchMedia`, or `scrollIntoView`. Append
to `tests/setup.js`:

```js
import { vi } from 'vitest'

global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback
  }
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// jsdom has no matchMedia; individual tests override this.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })
}

// jsdom has no layout, so scrollIntoView is not implemented.
Element.prototype.scrollIntoView = vi.fn()
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- pinned-process`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/PinnedProcess.jsx tests/setup.js tests/unit/pinned-process.test.jsx
git commit -m "feat: pinned process section with scroll-driven index"
```

---

## Task 14: Home page

**Files:**
- Modify: `src/pages/Home.jsx`
- Test: `tests/unit/home.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../../src/pages/Home.jsx'

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  )

describe('home page', () => {
  it('leads with the arc hero', () => {
    renderHome()
    expect(screen.getByTestId('arc-stage')).toBeInTheDocument()
  })

  it('previews five builds, not all fifteen', () => {
    renderHome()
    expect(screen.getAllByTestId('work-row')).toHaveLength(5)
  })

  it('includes the pinned process section', () => {
    renderHome()
    expect(screen.getByTestId('process-pin')).toBeInTheDocument()
  })

  it('previews pricing without discount language', () => {
    const { container } = renderHome()
    expect(container.textContent).toMatch(/\$108/)
    expect(container.textContent).not.toMatch(/sale|was previously|save \$/i)
  })

  it('exposes exactly one h1', () => {
    renderHome()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- home`
Expected: FAIL — the stub renders an empty div.

- [ ] **Step 3: Write `src/pages/Home.jsx`**

```jsx
import { Link } from 'react-router-dom'
import ArcHero from '../components/ArcHero.jsx'
import WorkList from '../components/WorkList.jsx'
import PinnedProcess from '../components/PinnedProcess.jsx'
import { BUILDS } from '../lib/builds.js'
import { PLANS } from '../lib/plans.js'

export default function Home() {
  return (
    <div data-testid="home-page">
      <ArcHero />
      <WorkList builds={BUILDS} limit={5} />

      <div className="px-6 md:px-12">
        <Link to="/work" className="label underline">
          All fifteen builds →
        </Link>
      </div>

      <PinnedProcess />

      <section className="bg-paper-clay px-6 py-20 md:px-12">
        <p className="label mb-4">Pricing</p>
        <h2
          className="mb-10 font-display leading-tight tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Three ways to work together
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div key={plan.name} className="border-t border-ink pt-3">
              {plan.featured ? (
                <span className="mb-2 inline-block bg-accent px-2 py-0.5 font-sans text-[11px] font-semibold">
                  {plan.name}
                </span>
              ) : (
                <p className="mb-2 font-sans text-[11px] font-semibold">{plan.name}</p>
              )}
              <p className="font-display leading-none" style={{ fontSize: 'var(--text-sub)' }}>
                {plan.price}
                <span className="ml-1 font-sans text-[12px] text-ink-muted">/mo</span>
              </p>
              <p className="mt-2 font-sans text-[12px] text-ink-muted">
                {plan.setup} to build. {plan.tagline}.
              </p>
            </div>
          ))}
        </div>
        <Link
          to="/pricing"
          className="mt-10 inline-block bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
        >
          Full pricing
        </Link>
      </section>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- home`
Expected: PASS, 5 tests.

- [ ] **Step 5: Look at it**

```bash
npm run dev
```

Open `http://localhost:5173`. Check by eye: bone paper with visible grain, arc of build images behind the headline, chartreuse only ever as a filled block. Scroll and confirm the arc spreads and fades, and that the Process left column pins while the right scrolls.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx tests/unit/home.test.jsx
git commit -m "feat: home page"
```

---

## Task 15: Work, Services and Pricing pages

**Files:**
- Modify: `src/pages/Work.jsx`, `src/pages/Services.jsx`, `src/pages/Pricing.jsx`
- Test: `tests/unit/pages.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Work from '../../src/pages/Work.jsx'
import Services from '../../src/pages/Services.jsx'
import Pricing from '../../src/pages/Pricing.jsx'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('work page', () => {
  it('shows all fifteen builds with the filter', () => {
    wrap(<Work />)
    expect(screen.getAllByTestId('work-row')).toHaveLength(15)
    expect(screen.getByTestId('work-filter')).toBeInTheDocument()
  })

  it('says plainly that these are not client sites', () => {
    const { container } = wrap(<Work />)
    expect(container.textContent).toMatch(/concept build/i)
  })
})

describe('services page', () => {
  it('lists four services with their inclusions', () => {
    wrap(<Services />)
    expect(screen.getAllByTestId('service-block')).toHaveLength(4)
    expect(screen.getByText('Local SEO')).toBeInTheDocument()
  })
})

describe('pricing page', () => {
  it('shows three plans, add-ons and the bundle', () => {
    wrap(<Pricing />)
    expect(screen.getAllByTestId('plan-block')).toHaveLength(3)
    expect(screen.getByText(/care\+/i)).toBeInTheDocument()
  })

  it('carries no discount language', () => {
    const { container } = wrap(<Pricing />)
    expect(container.textContent).not.toMatch(/sale|was previously|\/day|save \$/i)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- pages`
Expected: FAIL — stubs render empty divs.

- [ ] **Step 3: Write `src/pages/Work.jsx`**

```jsx
import WorkList from '../components/WorkList.jsx'
import { BUILDS } from '../lib/builds.js'

export default function Work() {
  return (
    <div data-testid="work-page">
      <header className="px-6 pt-16 md:px-12">
        <p className="label mb-4">The work</p>
        <h1
          className="font-display leading-[1.04] tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Fifteen concept builds.
        </h1>
        <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
          These are concept builds — made to show what I do, not to dress up a client list I
          do not have yet. When there is client work worth showing, it will lead this page.
        </p>
      </header>
      <WorkList builds={BUILDS} />
    </div>
  )
}
```

- [ ] **Step 4: Write `src/pages/Services.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { SERVICES } from '../lib/services.js'

export default function Services() {
  return (
    <div data-testid="services-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">What I do</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Everything your site needs.
      </h1>
      <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
        Design, development, SEO and ongoing care — bundled into every plan for one flat
        monthly rate.
      </p>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        {SERVICES.map((service) => (
          <div key={service.title} data-testid="service-block" className="border-t border-ink pt-4">
            <h2
              className="font-display leading-tight tracking-tight"
              style={{ fontSize: 'var(--text-sub)' }}
            >
              {service.title}
            </h2>
            <p className="mt-2 font-sans leading-relaxed text-ink-muted">{service.blurb}</p>
            <ul className="mt-5">
              {service.includes.map((item) => (
                <li
                  key={item}
                  className="border-t border-rule py-2 font-sans text-[13px] text-ink-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Link
        to="/pricing"
        className="mt-14 inline-block bg-accent px-5 py-3 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
      >
        See pricing
      </Link>
    </div>
  )
}
```

- [ ] **Step 5: Write `src/pages/Pricing.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { PLANS, ADDON_GROUPS, CARE_PLUS, PRICING_NOTE } from '../lib/plans.js'

export default function Pricing() {
  return (
    <div data-testid="pricing-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">What it costs</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Simple, honest pricing.
      </h1>
      <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
        Three plans, one flat monthly rate each, plus a one-time build fee. No hidden fees.
      </p>

      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div key={plan.name} data-testid="plan-block" className="border-t border-ink pt-4">
            {plan.featured ? (
              <span className="mb-3 inline-block bg-accent px-2 py-0.5 font-sans text-[11px] font-semibold">
                {plan.name}
              </span>
            ) : (
              <p className="mb-3 font-sans text-[11px] font-semibold">{plan.name}</p>
            )}
            <p className="font-display leading-none" style={{ fontSize: 'var(--text-sub)' }}>
              {plan.price}
              <span className="ml-1 font-sans text-[12px] text-ink-muted">/mo</span>
            </p>
            <p className="mt-2 font-sans text-[12px] text-ink-muted">{plan.setup} to build</p>
            <ul className="mt-5">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="border-t border-rule py-2 font-sans text-[13px] text-ink-muted"
                >
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-block border border-ink px-4 py-2 font-sans text-[11px] font-semibold tracking-[0.06em] uppercase"
            >
              Get in touch
            </Link>
          </div>
        ))}
      </div>

      <section className="mt-24 border-t border-rule pt-14">
        <p className="label mb-4">Optional extras</p>
        <h2
          className="font-display leading-tight tracking-tight"
          style={{ fontSize: 'var(--text-section)' }}
        >
          Add-ons.
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {ADDON_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.11em]">
                {group.label}
              </p>
              <p className="mt-1 font-sans text-[12px] text-ink-faint">{group.note}</p>
              <ul className="mt-5">
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-start justify-between gap-6 border-t border-rule py-3"
                  >
                    <span className="font-sans text-[13px] text-ink-muted">
                      {item.name}
                      {item.note && (
                        <span className="block text-[11px] text-ink-faint">{item.note}</span>
                      )}
                    </span>
                    <span className="whitespace-nowrap font-sans text-[13px] font-semibold">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-ink pt-4">
          <span className="mb-3 inline-block bg-accent px-2 py-0.5 font-sans text-[11px] font-semibold">
            {CARE_PLUS.name}
          </span>
          <p className="font-display leading-none" style={{ fontSize: 'var(--text-sub)' }}>
            {CARE_PLUS.price}
            <span className="ml-1 font-sans text-[12px] text-ink-muted">/mo</span>
          </p>
          <p className="mt-3 max-w-lg font-sans leading-relaxed text-ink-muted">
            {CARE_PLUS.body}
          </p>
        </div>

        <p className="mt-16 max-w-2xl font-sans text-[13px] leading-relaxed text-ink-muted">
          {PRICING_NOTE}
        </p>
      </section>
    </div>
  )
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- pages`
Expected: PASS, 5 tests.

- [ ] **Step 7: Commit**

```bash
git add src/pages tests/unit/pages.test.jsx
git commit -m "feat: work, services and pricing pages"
```

---

## Task 16: About, FAQ, Contact and legal pages

**Files:**
- Modify: `src/pages/About.jsx`, `src/pages/Faq.jsx`, `src/pages/Contact.jsx`, `src/pages/PrivacyPolicy.jsx`, `src/pages/TermsOfService.jsx`
- Test: `tests/unit/pages-secondary.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from '../../src/pages/About.jsx'
import Faq from '../../src/pages/Faq.jsx'
import Contact from '../../src/pages/Contact.jsx'
import PrivacyPolicy from '../../src/pages/PrivacyPolicy.jsx'
import TermsOfService from '../../src/pages/TermsOfService.jsx'
import { FAQS } from '../../src/lib/faq.js'

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('about page', () => {
  it('introduces the person by name', () => {
    wrap(<About />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/mossimo/i)
  })

  it('states the location', () => {
    const { container } = wrap(<About />)
    expect(container.textContent).toMatch(/montreal/i)
  })
})

describe('faq page', () => {
  it('renders every question', () => {
    wrap(<Faq />)
    for (const f of FAQS) {
      expect(screen.getByText(f.q)).toBeInTheDocument()
    }
  })
})

describe('contact page', () => {
  it('offers the email as a mailto link', () => {
    wrap(<Contact />)
    expect(screen.getByRole('link', { name: /gmail\.com/ })).toHaveAttribute(
      'href',
      'mailto:summitsites.agency@gmail.com',
    )
  })
})

describe('legal pages', () => {
  it('never mention the retired brand', () => {
    for (const Page of [PrivacyPolicy, TermsOfService]) {
      const { container, unmount } = wrap(<Page />)
      expect(container.textContent).not.toMatch(/summit sites/i)
      unmount()
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- pages-secondary`
Expected: FAIL — stubs render empty divs.

- [ ] **Step 3: Write `src/pages/About.jsx`**

```jsx
export default function About() {
  return (
    <div data-testid="about-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">Who you are hiring</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Hi — I'm Mossimo.
      </h1>
      <div className="mt-8 max-w-xl font-sans leading-relaxed text-ink-muted">
        <p>
          I design and build websites for local businesses, from Montreal, for clients across
          Canada. The person you email is the person who builds the site, and the person who
          fixes it when something breaks at nine at night.
        </p>
        <p className="mt-4">
          There is no account manager, no offshore team, and nobody who will forward your
          message on and then go quiet. That is the whole pitch, and it is the reason the
          business has my name on it.
        </p>
        <p className="mt-4">
          Most of what I build is for businesses where the website has one job — get someone
          to call, book, or walk in. I care much more about whether that happens than about
          whether the site wins an award.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write `src/pages/Faq.jsx`**

```jsx
import { FAQS } from '../lib/faq.js'

export default function Faq() {
  return (
    <div data-testid="faq-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">Before you ask</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Questions.
      </h1>
      <dl className="mt-14 max-w-2xl">
        {FAQS.map((f) => (
          <div key={f.q} className="border-t border-rule py-6">
            <dt
              className="font-display leading-tight tracking-tight"
              style={{ fontSize: 'var(--text-sub)' }}
            >
              {f.q}
            </dt>
            <dd className="mt-3 font-sans leading-relaxed text-ink-muted">{f.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
```

- [ ] **Step 5: Write `src/pages/Contact.jsx`**

```jsx
import { Link } from 'react-router-dom'

const EMAIL = 'summitsites.agency@gmail.com'

const LINKS = [
  { to: '/work', label: 'See the work', note: 'Fifteen concept builds' },
  { to: '/pricing', label: 'View pricing', note: 'Plans and what is included' },
  { to: '/faq', label: 'Common questions', note: 'Answers before you ask' },
]

export default function Contact() {
  return (
    <div data-testid="contact-page" className="px-6 py-16 md:px-12">
      <p className="label mb-4">Get in touch</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        Let's build something.
      </h1>
      <p className="mt-5 max-w-xl font-sans leading-relaxed text-ink-muted">
        Tell me about your business — no commitment, no pressure. I reply within 24 hours.
      </p>

      <div className="mt-14 max-w-2xl border-t border-ink pt-6">
        <p className="label mb-3">Email me</p>
        <a
          href={`mailto:${EMAIL}`}
          className="font-display leading-none underline decoration-accent decoration-4 underline-offset-8"
          style={{ fontSize: 'var(--text-sub)' }}
        >
          {EMAIL}
        </a>
        <p className="mt-6 font-sans leading-relaxed text-ink-muted">
          Include your business name and a few lines about what you need. The more you share,
          the sharper my first reply.
        </p>
      </div>

      <div className="mt-16 max-w-2xl border-t border-rule pt-6">
        <p className="label mb-4">Before you write</p>
        {LINKS.map(({ to, label, note }) => (
          <Link
            key={to}
            to={to}
            className="flex items-baseline justify-between gap-6 border-b border-rule py-4"
          >
            <span className="font-sans text-[15px] font-medium">{label}</span>
            <span className="font-sans text-[12px] text-ink-muted">{note} →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

The underline uses `decoration-accent`, which sets `text-decoration-color`, not `color`. The rule in spec §3 governs the letterforms; a rule under them is a shape. The accent-rule test in Task 3 matches `text-accent` and `color:` only, so this passes correctly rather than by accident.

- [ ] **Step 6: Port the legal copy into a data module**

Both source files already hold their copy in a `SECTIONS` array of
`{ h, body?: string[], list?: string[] }` — `PrivacyPolicy.jsx:8` and
`TermsOfService.jsx`. Copy both arrays verbatim into `src/lib/legal.js` as
`PRIVACY_SECTIONS` and `TERMS_SECTIONS`, applying exactly two transformations to every
string:

1. `Summit Sites` → `mossimo`
2. First person singular: `we` → `I`, `our` → `my`, `us` → `me`, and fix the verb.
   `We do not sell your personal information` → `I do not sell your personal information`.
   `we collect` → `I collect`. `Our site` → `My site`.

Do not reword anything else. This is legal copy; paraphrasing it changes what it commits you
to.

- [ ] **Step 7: Extend the voice test to cover legal copy**

Append to `tests/unit/voice.test.js`:

```js
import { PRIVACY_SECTIONS, TERMS_SECTIONS } from '../../src/lib/legal.js'

describe('legal copy', () => {
  it('has sections with headings', () => {
    for (const set of [PRIVACY_SECTIONS, TERMS_SECTIONS]) {
      expect(set.length).toBeGreaterThan(0)
      for (const section of set) {
        expect(section.h.length).toBeGreaterThan(0)
        expect(section.body || section.list).toBeTruthy()
      }
    }
  })

  it('is written in first person singular', () => {
    const blob = JSON.stringify({ PRIVACY_SECTIONS, TERMS_SECTIONS })
    expect(blob).not.toMatch(PLURAL)
  })

  it('never names the retired brand', () => {
    const blob = JSON.stringify({ PRIVACY_SECTIONS, TERMS_SECTIONS })
    expect(blob).not.toMatch(/summit sites/i)
  })
})
```

- [ ] **Step 8: Write the two legal pages**

Both render the same shape, so write the section renderer once.

`src/pages/PrivacyPolicy.jsx`:

```jsx
import { PRIVACY_SECTIONS } from '../lib/legal.js'
import LegalPage from '../components/LegalPage.jsx'

export default function PrivacyPolicy() {
  return <LegalPage testId="privacy-page" title="Privacy Policy" sections={PRIVACY_SECTIONS} />
}
```

`src/pages/TermsOfService.jsx`:

```jsx
import { TERMS_SECTIONS } from '../lib/legal.js'
import LegalPage from '../components/LegalPage.jsx'

export default function TermsOfService() {
  return <LegalPage testId="terms-page" title="Terms of Service" sections={TERMS_SECTIONS} />
}
```

`src/components/LegalPage.jsx`:

```jsx
export default function LegalPage({ testId, title, sections }) {
  return (
    <div data-testid={testId} className="px-6 py-16 md:px-12">
      <p className="label mb-4">Legal</p>
      <h1
        className="font-display leading-[1.04] tracking-tight"
        style={{ fontSize: 'var(--text-section)' }}
      >
        {title}
      </h1>
      <div className="mt-14 max-w-2xl">
        {sections.map((section) => (
          <section key={section.h} className="border-t border-rule py-7">
            <h2
              className="font-display leading-tight tracking-tight"
              style={{ fontSize: 'var(--text-sub)' }}
            >
              {section.h}
            </h2>
            {section.body?.map((p) => (
              <p key={p} className="mt-3 font-sans leading-relaxed text-ink-muted">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-4">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="border-t border-rule py-2 font-sans text-[13px] text-ink-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 9: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — pages-secondary 6 tests, voice now 7 tests, everything else still green.

- [ ] **Step 10: Commit**

```bash
git add src/pages src/lib/legal.js src/components/LegalPage.jsx tests/unit
git commit -m "feat: about, faq, contact and legal pages"
```

---

## Task 17: End-to-end checks for the behaviours jsdom cannot verify

Sticky positioning, real scrolling and reduced-motion rendering need a browser. Spec §8 and §9.

**Files:**
- Create: `playwright.config.js`, `tests/e2e/interactions.spec.js`

- [ ] **Step 1: Configure Playwright**

`playwright.config.js`:

```js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

```bash
npx playwright install chromium
```

- [ ] **Step 2: Write the failing test**

`tests/e2e/interactions.spec.js`:

```js
import { test, expect } from '@playwright/test'

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile)

  test('process left column stays put while the right column scrolls', async ({ page }) => {
    await page.goto('/')
    const pin = page.getByTestId('process-pin')
    await pin.scrollIntoViewIfNeeded()

    const before = await pin.boundingBox()
    await page.mouse.wheel(0, 900)
    await page.waitForTimeout(400)
    const after = await pin.boundingBox()

    // Sticky: the pinned column holds position while content moves past it.
    expect(Math.abs(after.y - before.y)).toBeLessThan(120)
  })

  test('the active process step advances as you scroll', async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('process-pin').scrollIntoViewIfNeeded()

    const items = page.getByTestId('process-index-item')
    await expect(items.nth(0)).toHaveAttribute('data-active', 'true')

    await page.mouse.wheel(0, 1800)
    await page.waitForTimeout(600)
    await expect(items.nth(0)).toHaveAttribute('data-active', 'false')
  })

  test('the arc animates', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('arc-stage')).toHaveAttribute('data-static', 'false')
  })
})

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile)

  test('process does not pin', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('process-pin')).toHaveAttribute('data-pinned', 'false')
  })

  test('the arc collapses to static', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('arc-stage')).toHaveAttribute('data-static', 'true')
  })

  test('nothing overflows the viewport horizontally', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    )
    expect(overflow).toBe(false)
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('the arc renders static', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('arc-stage')).toHaveAttribute('data-static', 'true')
  })
})
```

- [ ] **Step 3: Run the tests**

Run: `npm run test:e2e`
Expected: PASS. If the sticky test fails, confirm nothing in `Layout.jsx` calls `preventDefault` on wheel events and that no ancestor of `process-pin` has `overflow: hidden` — either one silently disables `position: sticky`.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.js tests/e2e package.json
git commit -m "test: e2e coverage for sticky, mobile collapse and reduced motion"
```

---

## Task 18: Document head, favicon and deploy config

**Files:**
- Modify: `index.html`
- Create: `vercel.json`
- Test: `tests/unit/head.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf8')

describe('document head', () => {
  it('titles the site mossimo', () => {
    expect(html).toMatch(/<title>[^<]*mossimo/i)
  })

  it('never mentions the retired brand', () => {
    expect(html).not.toMatch(/summit/i)
  })

  it('has a meta description mentioning the location', () => {
    expect(html).toMatch(/<meta\s+name="description"[^>]*montreal/i)
  })

  it('sets the theme colour to the paper token', () => {
    expect(html).toMatch(/<meta\s+name="theme-color"\s+content="#f0ebe8"/i)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- head`
Expected: FAIL — the scaffold title is "Vite + React".

- [ ] **Step 3: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>mossimo — websites for businesses that answer the phone</title>
    <meta
      name="description"
      content="I design, build and look after websites for local businesses. Based in Montreal, working across Canada."
    />
    <meta name="theme-color" content="#f0ebe8" />
    <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
    <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
    <!-- Fonts MUST stay here. They cannot live in index.css — see Task 2 Step 3.
         tests/unit/tokens.test.js fails if these links go missing. -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Add an interim favicon**

Spec §10 records that no mark is designed yet. Ship an interim one rather than a 404: a chartreuse square, which is on-brand precisely because the accent is a shape.

First remove the Vite scaffold's icons, which nothing references once `index.html` is
rewritten:

```bash
rm -f public/favicon.svg public/icons.svg
mkdir -p public/favicon
```

Create `public/favicon/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#c6d42b"/>
  <text x="32" y="46" font-family="Georgia, serif" font-size="42" text-anchor="middle" fill="#1d1d1b">m</text>
</svg>
```

Add to `index.html` head, above the `.ico` link:

```html
<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
```

Generate the `.ico` and `apple-touch-icon.png` from the SVG with any converter, or copy placeholders and replace them when the real mark exists. **Record this as outstanding** — it is spec §10 item 6.

- [ ] **Step 5: Write `vercel.json`**

SPA routing — every path must serve `index.html` or `/work` 404s on a hard refresh.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 6: Run the test and a production build**

Run: `npm test -- head`
Expected: PASS, 4 tests.

Run: `npm run build`
Expected: build succeeds, `dist/` is written with no errors.

- [ ] **Step 7: Commit**

```bash
git add index.html vercel.json public/favicon tests/unit/head.test.js
git commit -m "feat: document head, interim favicon and spa rewrites"
```

---

## Task 19: Full verification pass

- [ ] **Step 1: Run every test**

```bash
npm test
npm run test:e2e
```

Expected: all unit tests pass, all e2e tests pass across both projects. **Paste the actual output.** If anything fails, fix it before continuing — do not record this task as done with a failing suite.

- [ ] **Step 2: Check the accent rule held**

```bash
npm test -- accent-rule
```

Expected: PASS. This is the rule most likely to have been broken during page assembly.

- [ ] **Step 3: Look at every page**

```bash
npm run build && npm run preview
```

Visit each of `/`, `/work`, `/services`, `/pricing`, `/about`, `/faq`, `/contact`, `/privacy-policy`, `/terms-of-service`, plus `/portfolio` to confirm it redirects.

For each, confirm by eye:
- Bone paper with visible grain, no dark sections anywhere
- Chartreuse appears as fills only, roughly five times per page — never as coloured text
- Display type is Instrument Serif, UI type is Instrument Sans
- No cards, borders, shadows or rounded panels beyond hairline rules

- [ ] **Step 4: Check it at 375px**

In devtools, set the viewport to 375×812 and walk every page. Confirm no horizontal scroll, the arc is static, and Process is a plain stacked list.

- [ ] **Step 5: Update the spec's open items**

Edit `docs/superpowers/specs/2026-09-05-mossimo-rebrand-design.md` §10, marking resolved items and leaving genuinely outstanding ones. As of this plan, still open: tagline, screen recordings, domain, owner photo, real favicon/wordmark.

- [ ] **Step 6: Commit and push**

```bash
git add -A
git commit -m "chore: verification pass, update spec open items"
git push
```

---

## Deferred, deliberately

These are in the spec but not in this plan, because each is blocked on something outside the code:

| Item | Blocked on | Spec ref |
|---|---|---|
| Silent screen recordings for the work preview | Fifteen recordings need producing; the existing MP4s are AI clips, not recordings | §7 |
| Owner photo on `/about` | A photo | §10.5 |
| Real wordmark and favicon | A designed mark | §10.6 |
| Domain and matching email | A purchase decision | §10.1, §10.4 |
| Final tagline | A copy decision | §10.2 |

The work preview ships with static build images, which is the fallback the spec anticipates. When recordings exist, swap the `work-preview` div for a `<video autoplay muted loop playsinline poster={active.image}>` — the `data-slug` contract and every test around it stay unchanged.
