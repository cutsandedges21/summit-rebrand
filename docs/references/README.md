# Reference captures

Screenshots taken from the live sites the mossimo design was derived from. Captured
2026-09-05 at 1440×900. Values quoted in the spec were read from these sites' computed CSS,
not estimated from the images.

## evacoste.com — Eva Coste

| File | Shows |
|---|---|
| `evacoste-hero.png` | The whole site. SangBleu Kingdom Light Italic at 93px, Messina Sans Bold at 16px for nav, pure white, ink `#292A2C`. |
| `evacoste-hero-lines-drawn.png` | The same frame moments later — the hairline SVG draws itself on load. That animation is the page's only decoration. |

The page does not scroll. It is one screen of enormous italic type and a line drawing.

## memoiredencrier.com — Mémoire d'encrier

| File | Shows |
|---|---|
| `memoiredencrier-hero.png` | Tartuffo caps at 104px over a flat olive blob. |
| `memoiredencrier-collections.png` | The rule that shaped our accent: one item of five in orange `#EA5A0B`, the rest in ink, and the bottom 40% of the viewport left completely empty. |

Palette read from the live CSS: paper `#F0EBE8`, clay `#E1D7D1`, ink `#1D1D1B`, orange
`#EA5A0B`, chartreuse `#F0EB65`. Type: Tartuffo display, Söhne Buch and Söhne Schmal for UI.

## melius.com

Source of both scroll mechanics. Melius is dark and uses a dot lattice; we take the
*motion*, not the surface.

| File | Shows |
|---|---|
| `melius-arc-hero.png` | The arc — images in a perspective corridor converging at centre, headline overlaid. |
| `melius-arc-full.png` | The same arc fully loaded, corridor clearly visible on both sides. |
| `melius-arc-exploding.png` | Mid-scroll: the arc flying apart and past the camera, revealing the next section. This is spec §4.1. |
| `melius-pinned-split.png` | The pinned split — left half holds, right half scrolls video panels past it. This is spec §4.3. |
| `melius-pinned-split-advanced.png` | Further into the same section: left still pinned, right advanced, category tab moved to "Branding". |

Melius also uses two stacked background layers — an inline SVG dot pattern at 15px and a
tiled `noise.webp` at 192px. We use the noise idea and reject the dots (spec §3, Paper
texture).
