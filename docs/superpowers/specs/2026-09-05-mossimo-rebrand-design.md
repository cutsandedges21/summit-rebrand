# mossimo — rebrand design spec

**Date:** 2026-09-05
**Supersedes:** Summit Sites (`../SummitSites`)
**Target:** `summit-rebrand/` — fresh build, not a port

---

## 1. What this is

Summit Sites becomes **mossimo Studios** — the owner's first name, lowercase, plus "Studios".
Same business, same plans, same prices. What changes is the name, the voice, and the entire
visual language.

Two supplied assets, and they are used in different places:

| File | What it is | Where it goes |
|---|---|---|
| `public/brand/logo-wordmark.png` | `mossimo` in a hand-drawn marker script over a yellow blob. Clean artwork, 2069×760. | **Nav and footer.** This is the wordmark. |
| `public/brand/logo-lockup.png` | The same wordmark plus `STUDIOS` in a Didone serif and `WEB DESIGN` as a spaced rule line, photographed on textured stock. | Anywhere with room to breathe — the About page, an OG image, print. |

**Colour values come from the wordmark, not the lockup.** The lockup is photographed on
textured paper, which mutes it by roughly three points of lightness and desaturates the
yellow. The wordmark is flat artwork, so its values are the true brand colours — and the
site's own CSS grain does to them exactly what that paper stock did to the lockup.

Worth noting the logo independently confirmed two decisions made before it existed: it sits
on warm paper rather than white, and it uses the accent as a **shape** — a blob behind the
type — never as a letter colour. The plural voice also reads better against "Studios" than a
bare first name would.

The business is unchanged: subscription web design for local businesses. Three monthly
plans with a one-time build fee, plus add-ons.

### Why a personal name changes more than the logo

"Summit Sites" reads as a company. "mossimo" reads as a person — and that shift is the point
of the rebrand.

**The copy stays in first person plural: *we*, not *I*.** (Decided 2026-09-06, reversing an
earlier call to move everything to *I*.) A personal name paired with a plural voice reads as
a small studio rather than a freelancer, which is the more credible register for the buyer
here — a local business owner spending $1,399 on a build wants to hear from something that
will still exist next year. It also leaves room to subcontract without rewriting the site.

The tradeoff, stated plainly so nobody rediscovers it later: a name-brand saying *we* invites
"how many of you are there?", and the honest answer is one. The copy therefore never claims
a team, a size, or an office. It says *we* the way a studio does, and it never elaborates.
`tests/unit/voice.test.js` enforces the consistency mechanically.

The same shift makes the current pricing page a liability. It carries
`Summer Sale: Was Previously $168`, `≈ $2.23/day`, and `Save $676/mo`. Under a scrappy
company name that reads as honest hustle. Under a personal name it reads cheap. **Prices do
not change. The discount framing is removed entirely.**

### Positioning: same business, personal face, premium taste

Considered and rejected: repositioning as a premium solo studio with project-based pricing.
That sale is made on proof — named clients, results, case studies. There is exactly one live
client site (`gloryncustom.com`) and it isn't representative of the work worth showing. The
portfolio is fourteen concept builds. Premium positioning would be writing checks the work
can't cash yet.

The route back to premium stays open: once there are two or three client builds worth
naming, the portfolio leads with them and the pricing can move.

---

## 2. Portfolio honesty

Fourteen concept builds, **labelled as concept builds**. Not "our work", not implied clients.

Framed correctly, fourteen speculative builds read as *range*. Framed ambiguously, they read
as deception the moment someone clicks through and finds no real business behind Halcyon.

This only holds if every item in the list really is speculative. Two of the old site's
screenshots are not, and neither is carried over:

- `public/glorync-hero.jpeg` — `gloryncustom.com`, the one live client site.
- `public/cutsandedges-hero.jpeg` — **a real lawn-care business.** Confirmed by the owner on
  2026-09-08. The screenshot carries a working phone number, (514) 561-9746, and
  `cutsandedges21@gmail.com`, which is the owner's own address. It was carried over in the
  first pass, before anyone opened the image, and is now removed.

Placing either in a list labelled "concept builds" would be a false claim about real client
work — precisely the failure this section exists to prevent. Renaming them to disguise the
association would be worse. That is why the count is fourteen rather than sixteen.

`tests/unit/builds.test.js` pins both exclusions by name so neither can drift back in.

See `docs/references/` for the reference sites this design was derived from.

---

## 3. Visual language

Derived from two references the owner selected: **evacoste.com** and
**memoiredencrier.com**. Both were inspected directly; values below are extracted from their
live CSS, not estimated.

| | evacoste.com | memoiredencrier.com |
|---|---|---|
| Display type | SangBleu Kingdom Light Italic, 93px | Tartuffo, 104px caps |
| UI type | Messina Sans Bold, 16–18px | Söhne Buch, 11–16px |
| Paper | `#FFFFFF` | `#F0EBE8` |
| Ink | `#292A2C` | `#1D1D1B` |
| Accent | none | `#EA5A0B`, plus `#F0EB65` |
| Decoration | one self-drawing SVG line | one flat colour blob |

**The shared DNA — these are the rules:**

1. **Enormous display serif, tiny plain grotesk.** The scale gap between 93px and 16px *is*
   the design.
2. **Zero containers.** No cards, no borders, no shadows, no rounded panels. Type sits
   directly on the field.

   **Amended 2026-09-09:** the rule governs *chrome*, not imagery. Picture frames may be
   rounded — the work preview carries a 10px radius, and the arc tiles the same. An element
   that is showing a photograph is content whether it is an `<img>`, a div with a
   background-image, or a frame declaring `role="img"` that clips one. What stays banned is a
   rounded *panel*: a box drawn around text or UI. `tests/e2e/design-rules.spec.js` encodes
   exactly this distinction and checks it on every route.
3. **Half-empty screens are correct.** Mémoire leaves the bottom 40% of a viewport blank.
4. **One accent, used about five times per page.** Mémoire's orange touches one word in a
   list of five and one badge.
5. **One decorative gesture per page.** Never two.

### Palette

| Token | Value | Use |
|---|---|---|
| `paper` | `#F9F7EF` | Page background. Warm bone, never white. |
| `paper-clay` | `#EBE5D8` | Tonal shift for one or two sections. Not a dark mode. |
| `ink` | `#1B1A15` | All body and display type. |
| `ink-muted` | `#6A655A` | Secondary copy, labels. |
| `ink-faint` | `#A8A296` | Inactive list items, disabled states. |
| `rule` | `#E0DACE` | Hairlines. 1px, never heavier. |
| `accent` | `#F9EA55` | Chartreuse. **Fill only.** |

**No dark sections anywhere.** The only dark rectangles on the site are work recordings and
screenshots — i.e. content, never chrome.

### The accent rule

> **On paper, the accent is a shape. Never a letter.**

Chartreuse at `#F9EA55` on `#F9F7EF` is roughly **1.1:1** — illegible as text, non-negotiable.
As a fill with `ink` on top it is roughly 11:1, comfortably above AA.

This is a constraint, and it's the most distinctive thing in the system. Enforce it with no
exceptions: fills, blocks, hover sweeps, the hero blob, the active nav marker, the featured
plan label. Never coloured text.

**Superseded 2026-09-06 — the logo settled this.** The palette above is now sampled directly
from `public/brand/logo-wordmark.png` rather than chosen: paper, ink and accent are measured
values, and the remaining tokens are tints derived to sit in the same warmth. A brand whose
site does not match its own logo is a broken brand, so the logo wins.

This overrode an earlier accent choice of `#C6D42B`, an olive chartreuse, picked before the
logo existed. The logo's yellow is a full lemon — lighter and more saturated. Notably it sits
very close to `#F0EB65`, which this spec had previously rejected for being Mémoire d'encrier's
literal brand colour. That rejection no longer applies: arriving at a neighbouring yellow
independently, via your own logo, is not the same as copying a publisher's brand colour.

**One consequence to watch.** At `#F9EA55` on `#F9F7EF` the accent is only ~1.1:1 against the
paper, so a filled button reads as a shape almost entirely because of the ink sitting on it,
not because of its own edge. That is fine at the scale the logo uses it — a large blob — but
small CTAs need either ink type on top (≈11:1, which they have) or a hairline `rule` border.
Never rely on the fill alone to define a small interactive target.

### Typography

- **Display — Instrument Serif** (regular + italic). Free, OFL.
- **UI and body — Instrument Sans** (400/500/600). Free, OFL, drawn as a companion.

Chosen as honest substitutes for SangBleu (~$200) and Söhne (~$150). Deliberately not
Playfair + Inter, which is the default pairing everyone reaches for.

Italic is a real tool here, not decoration — Eva Coste's entire hero is italic. Use it to
lift one or two words per headline.

**Scale (fluid):**

| Role | Size |
|---|---|
| Hero | `clamp(44px, 7.5vw, 118px)` |
| Section title | `clamp(32px, 4.6vw, 72px)` |
| Sub-head | `clamp(22px, 2.6vw, 40px)` |
| Body | `clamp(14px, 1.05vw, 17px)` |
| Label | `11px`, `.11em` tracking, uppercase, `ink-muted` |

### Paper texture

Fine grain across the whole site. Pure CSS — an inline SVG `feTurbulence` filter as a
data-URI. No image files, no network cost.

```
baseFrequency 0.9 · numOctaves 4 · stitchTiles stitch · 180px tile · opacity 0.30
```

Applied as a fixed background layer on `body` so it doesn't scroll against the content.

Rejected: dot lattice (Melius's recipe — reads as graph paper, pulls away from the
references), heavy fibre (fights the type, resembles compression artefacts on cheap
displays).

**Known limitation:** grain sits under everything and stops at every image edge. At this
strength that never reads as a mistake. It would at heavier settings.

---

## 4. The three signature interactions

### 4.1 Arc hero — `/`

Adapted from melius.com. The fourteen concept-build screenshots form a curved corridor in
perspective, converging toward the centre of the viewport, headline overlaid. On scroll the
arc **flies apart and past the camera**, revealing the page beneath.

This is the site's cinematic moment. It replaced an earlier proposal for a full-bleed dark
video break, which is now dropped — it violated the no-dark-sections rule, and an arc built
from actual work sells better than atmosphere does.

### 4.2 Work list — `/` preview and `/work`

Large serif list of project names. Hovering a name sweeps a chartreuse fill across it and
plays that project's silent screen recording in a frame alongside.

Chosen over the pinned treatment deliberately: a list stays scannable, and someone hunting
for a restaurant build shouldn't have to scroll past a hotel to find one.

Industry filter, with the active filter as a chartreuse fill. Categories are derived from
the fourteen builds that actually exist (Halcyon, Piment, Meridian, Khufus, Drinksom,
Sterling, Lamborghini, Elixir Hotel, Air Center, Brand Cosmetics, Handhold, Laser and Me,
Monads, Vorszk) — not invented up front. Grouping was settled on 2026-09-08 by reviewing
every screenshot: Hospitality, Food & drink, Retail, Services, Automotive, Studio,
Technology, Brand. Several buckets hold a single build, so the filter row needs a design
decision before `/work` is built.

### 4.3 Pinned Process — `/`

Adapted from melius.com's post-hero section. Left column **pins and holds**; right column
scrolls step content past it. A vertical index (01–04) on the pinned side tracks progress,
with the active step marked by a chartreuse fill that walks down as you scroll.

Pinning is a sequence device, which is why Process gets it — it's the only genuinely linear
part of the site. Services in a different order is still Services.

It also does the hardest sales work on the site. The biggest objection to a personal-name
brand is *will this one person disappear after taking my money* — and a section that visibly
walks from intake to launch to ongoing support answers it.

The four steps already exist, written, in `SummitSites/src/components/Process.jsx`. They
need converting to first person. **That component is not routed in `App.jsx` — no
`/process` route exists, so the content has never been reachable.** `About.jsx` has the same
problem.

---

## 5. Information architecture

| Route | Notes |
|---|---|
| `/` | Arc hero → work preview → pinned Process → services → pricing preview → contact |
| `/work` | Full fourteen builds, industry filter |
| `/portfolio`, `/inspiration` | 301 → `/work` |
| `/services` | Four services |
| `/pricing` | Three plans, add-ons, Care+ bundle |
| `/about` | The person. Finally routed. |
| `/faq` | |
| `/contact` | |
| `/privacy-policy`, `/terms-of-service` | Copy carried over, brand name swapped |

**Change from the current site:** `/` is currently a standalone video intro with no
navigation (`HomeIntro.jsx`), and the real content lives on subpages. The new `/` is a full
homepage. The intro-gate pattern is dropped — it costs a click before anyone sees anything
worth seeing.

---

## 6. Voice and copy

- **First person plural throughout.** The site says `we`, never `I`. The copy never claims a team size, an office, or a headcount — it says `we` the way a studio does and does not elaborate.
- **Location:** based in Montreal, working across Canada. State it in the hero and footer —
  it earns local search ranking for a service that is itself sold as local SEO.
- **No discount language.** Remove `Summer Sale`, `Was Previously $168`, `≈ $2.23/day`,
  `Save $676/mo`, and the strikethrough on the Care+ bundle. The bundle price stays; the
  slashed comparison goes.
- **Tagline:** `Your business, elevated.` is retired with the old name. Replacement TBD in
  build — working line is *"Websites for businesses that answer the phone."*

---

## 7. Technical architecture

Fresh Vite + React + **Tailwind** scaffold in `summit-rebrand/`. Text content is copied from
`SummitSites`; **no components are ported.**

Three reasons this is a rebuild rather than a restyle:

1. All 3,400 lines of existing components are inline style objects written for a dark video
   background. Porting them means deleting every style prop, which is not porting.
2. **`Layout.jsx` hijacks the scroll wheel** — it `preventDefault`s wheel and touch events
   and animates `translateY` on a container, so `window.scrollY` never moves. `position:
   sticky` cannot work inside it. The pinned Process section is impossible without tearing
   this out first.
3. The design is token-driven — paper, ink, accent, grain, type scale — which is what a
   Tailwind config holds cleanly and inline style objects don't.

**Stack:** Vite 5 · React 18 · Tailwind · framer-motion (already in use, keep it) ·
react-router 7.

**Scrolling:** native. No lerp hijacking. Sticky positioning must work.

### Assets

| Asset | Disposition |
|---|---|
| `public/*-hero.jpeg` ×14 | **Carry over.** These become the arc and the work list. `glorync-hero.jpeg` and `cutsandedges-hero.jpeg` are excluded — both are real businesses (§2). |
| `fonts/` (Avaleigh, Itoya, Moho, Grinola, Zorvain) | **Drop all.** Replaced by Instrument Serif + Sans. |
| `public/*.mp4` ×5 | **Drop.** These are AI-generated cinematic clips, not screen recordings. They belong to the old atmospheric language. |
| `favicon_io/` | **Regenerate** for the new mark. |
| Legal copy (privacy, terms) | Carry over, swap brand name. |

**Gap to fill:** the work section needs silent screen recordings of each concept build
scrolling. **These do not exist yet.** The five existing MP4s are not screen recordings.
Recording fourteen of them is a real task — budget it, or launch with static screenshots and
add recordings progressively.

---

## 8. Mobile

**Pinned scroll sections are the single most common place this pattern breaks.**

- Process **must** collapse to a plain stacked list under `768px`. No pinning, no sticky.
- The arc hero collapses to a single centred still or a much shallower arc. A fourteen-image
  perspective corridor on a phone is a jank generator.
- Work list hover-to-play has no hover on touch. Tap opens the recording inline, or the
  recording autoplays muted when the row scrolls into view.

These are build requirements, not polish.

---

## 9. Accessibility

- Ink on paper: ~15:1. Ink on chartreuse: ~11:1. Both pass AA comfortably.
- Chartreuse as text on paper is ~1.5:1 and is **prohibited by the accent rule**, which
  makes the contrast requirement and the aesthetic rule the same rule.
- `prefers-reduced-motion` must disable the arc explosion, the pin, and the chartreuse
  sweep. Static fallbacks for all three.
- Industry filter and Process index are interactive — real buttons, focus states, keyboard
  reachable.

---

## 10. Known inconsistencies and open items

**Status at the end of the build, 2026-09-09.** All nineteen implementation tasks are
complete: 144 unit tests, 19 end-to-end tests across Chromium and mobile Safari.

### Resolved

1. ~~**Contact email carries the retired brand name.**~~ `mossimo.studios@gmail.com`
   supplied and wired in. The old brand appears nowhere on the site.
2. ~~**Favicon / wordmark — no mark designed.**~~ Both supplied. `logo-wordmark.png` is the
   nav and footer mark; the palette is sampled from it. The favicon echoes the lockup —
   paper ground, accent as a shape behind the letterform.
3. ~~**Screen recordings don't exist.**~~ Superseded rather than done: 33 real screenshots
   were captured from the live sites instead, three per project, laid out as a mosaic on
   each case study. Recordings are no longer needed for launch.

### Still open

4. **Tagline** not finalised. The working line — *"Websites for businesses that answer the
   phone"* — is in the hero and the document title, and has held up well enough that
   finalising it may just mean keeping it.
5. **Domain** not chosen. The email is a Gmail address; a domain would let it match.
6. **Photo of the owner** for `/about`. The page no longer needs one to feel finished, but
   the positioning is warmer with a face.
7. **`vorszk.com` is dead** — NXDOMAIN on both apex and www. Its case study has no live
   link and falls back to its hero image. Either drop the project or replace the capture.
8. **Legal copy has a live tension.** The Terms say *"unlimited revisions during the design
   phase"* while the FAQ says *"two hours of edits a month"*. Different phases, so not
   strictly contradictory, but a customer could reasonably read them as conflicting.
9. **The portfolio needs culling.** Seven of the fourteen were not built here and carry
   invented case-study copy, written on the owner's instruction as scaffolding. Every build
   carries `own: true/false`, so the cull is `BUILDS.filter(b => b.own)` — one line, not an
   investigation. **Do this before launch.** The case studies label provenance honestly, but
   invented process and outcomes for someone else's website should not go out.

---

## 11. Out of scope

- Any change to plan structure, prices, or add-ons.
- CMS or blog.
- Client dashboard or portal.
- Migrating `gloryncustom.com`.
- Repositioning to project-based pricing (revisit once real client work exists).
