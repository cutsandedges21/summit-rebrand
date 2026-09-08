import { describe, it, expect } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import WorkList from '../../src/components/WorkList.jsx'
import { BUILDS } from '../../src/lib/builds.js'

const renderList = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('WorkList', () => {
  it('lists every build by default', () => {
    renderList(<WorkList builds={BUILDS} />)
    expect(screen.getAllByTestId('work-row')).toHaveLength(14)
  })

  it('limits the list when given a limit', () => {
    renderList(<WorkList builds={BUILDS} limit={5} />)
    expect(screen.getAllByTestId('work-row')).toHaveLength(5)
  })

  it('hides the filter when limited', () => {
    renderList(<WorkList builds={BUILDS} limit={5} />)
    expect(screen.queryByTestId('work-filter')).not.toBeInTheDocument()
  })

  it('narrows the list when a category is chosen', async () => {
    const user = userEvent.setup()
    renderList(<WorkList builds={BUILDS} />)
    await user.click(screen.getByRole('button', { name: 'Studio & brand' }))
    const rows = screen.getAllByTestId('work-row')
    expect(rows).toHaveLength(3)
    expect(rows.map((r) => r.textContent)).toEqual(
      expect.arrayContaining([expect.stringContaining('Meridian')]),
    )
  })

  it('labels the section, and lets the caller override or remove that label', () => {
    const { unmount } = renderList(<WorkList builds={BUILDS} />)
    expect(screen.getByText(/selected work/i)).toBeInTheDocument()
    unmount()

    // The portfolio page passes null because its own header already says it;
    // two stacked labels within 150px read as a copy bug.
    renderList(<WorkList builds={BUILDS} label={null} />)
    expect(screen.queryByText(/selected work/i)).not.toBeInTheDocument()
  })

  it('shows the first build in the preview frame initially', () => {
    renderList(<WorkList builds={BUILDS} />)
    expect(screen.getByTestId('work-preview')).toHaveAttribute(
      'data-slug',
      BUILDS[0].slug,
    )
  })

  it('swaps the preview when a row is hovered', async () => {
    const user = userEvent.setup()
    renderList(<WorkList builds={BUILDS} />)
    await user.hover(screen.getAllByTestId('work-row')[2])
    expect(screen.getByTestId('work-preview')).toHaveAttribute(
      'data-slug',
      BUILDS[2].slug,
    )
  })

  it('swaps the preview on focus, so keyboards work too', async () => {
    renderList(<WorkList builds={BUILDS} />)
    const rows = screen.getAllByTestId('work-row')
    // act() is not decoration here. A bare rows[4].focus() DOES reach the
    // component's onFocus — React 19 logs the "update was not wrapped in
    // act(...)" warning to prove it — but in an act environment the resulting
    // state update sits in the act queue and is not flushed before the next
    // synchronous line, so the assertion reads the pre-focus render. act()
    // flushes it. The assertion below is unchanged.
    act(() => rows[4].focus())
    expect(screen.getByTestId('work-preview')).toHaveAttribute('data-slug', BUILDS[4].slug)
  })
})
