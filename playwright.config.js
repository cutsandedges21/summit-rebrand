import { defineConfig, devices } from '@playwright/test'

/**
 * These tests exist for the things jsdom structurally cannot see: sticky
 * positioning, real scrolling, IntersectionObserver, and reduced-motion
 * rendering. Every bug this build shipped and then had to fix — the logo
 * rendering as a box, the hero headline unreadable over screenshots, the
 * preview column leaving a hole — was invisible to the 134 unit tests.
 *
 * Runs against the production build rather than the dev server, so the CSS
 * these assertions depend on is the CSS that actually ships.
 */
export default defineConfig({
  testDir: './tests/e2e',
  // OneDrive makes cold builds slow; the default 30s expect timeout is tight.
  timeout: 60_000,
  use: { baseURL: 'http://localhost:4173' },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
