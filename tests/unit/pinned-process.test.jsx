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
