import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = (p) => resolve(__dirname, '../../', p)
const html = readFileSync(root('index.html'), 'utf8')

describe('document head', () => {
  it('titles the site mossimo Studios', () => {
    expect(html).toMatch(/<title>[^<]*mossimo Studios/i)
  })

  it('never mentions the retired brand', () => {
    expect(html).not.toMatch(/summit/i)
  })

  it('has a meta description mentioning the location', () => {
    expect(html).toMatch(/<meta\s+name="description"[\s\S]*?montreal/i)
  })

  // Must track --color-paper, or the browser chrome on mobile sits in a
  // different colour to the page it frames.
  it('sets the theme colour to the paper token', () => {
    const css = readFileSync(root('src/index.css'), 'utf8')
    const paper = css.match(/--color-paper:\s*(#[0-9a-f]{6})/i)[1]
    expect(html.toLowerCase()).toContain(`name="theme-color" content="${paper.toLowerCase()}"`)
  })

  it('still loads the webfonts from here, where they survive the build', () => {
    expect(html).toMatch(/fonts\.googleapis\.com/)
  })
})

describe('favicon', () => {
  const files = ['public/favicon/favicon.svg', 'public/favicon/apple-touch-icon.png']

  for (const file of files) {
    it(`ships ${file}`, () => {
      expect(existsSync(root(file))).toBe(true)
    })
  }

  it('references every icon it ships, and ships every icon it references', () => {
    const referenced = [...html.matchAll(/href="(\/favicon\/[^"]+)"/g)].map((m) => m[1])
    expect(referenced.length).toBeGreaterThan(0)
    for (const ref of referenced) {
      expect(existsSync(root(`public${ref}`)), `${ref} is referenced but missing`).toBe(true)
    }
  })

  it('drops the Vite scaffold icons', () => {
    expect(existsSync(root('public/favicon.svg'))).toBe(false)
    expect(existsSync(root('public/icons.svg'))).toBe(false)
  })
})

describe('spa rewrites', () => {
  // Without this, a hard refresh on /portfolio/halcyon 404s in production —
  // which no local dev or preview run would ever reveal.
  it('routes every path to index.html', () => {
    const config = JSON.parse(readFileSync(root('vercel.json'), 'utf8'))
    expect(config.rewrites).toContainEqual({ source: '/(.*)', destination: '/index.html' })
  })
})
