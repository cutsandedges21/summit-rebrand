import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom implements none of the three browser APIs this site's interactions rely
// on. Without these stubs, rendering any component that reads a media query or
// observes scroll throws — and the failure reads like a component bug rather
// than a missing test environment, which is exactly the wrong place to look.
//
// Individual tests override these freely; these are only the floor.

// Media queries — used by useReducedMotion and useIsMobile (src/lib/motion.js).
// Defaults to "no match", i.e. desktop with motion allowed, so components
// render their full animated form unless a test says otherwise.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
}

// Scroll observation — drives the active step in the pinned Process section.
if (!global.IntersectionObserver) {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback
    }
    observe = vi.fn()
    unobserve = vi.fn()
    disconnect = vi.fn()
    takeRecords = vi.fn(() => [])
  }
}

// jsdom has no layout, so this is unimplemented rather than merely absent.
Element.prototype.scrollIntoView = vi.fn()
