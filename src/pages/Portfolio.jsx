import WorkList from '../components/WorkList.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { BUILDS } from '../lib/builds.js'

export default function Portfolio() {
  return (
    <div data-testid="portfolio-page">
      <PageHeader
        className="px-6 pt-16 md:px-12"
        label="Portfolio"
        heading={
          <>
            Sites built to be <em>used</em>, <br />
            not admired.
          </>
        }
        /* Sells at a glance; it does not disclaim. Provenance is stated on each
           case study instead — "Built here" or "Reference" — which is where a
           visitor who actually cares will look, and where being straight about
           it costs nothing. */
        intro="Hotels, restaurants, clinics, dealerships, product brands. Every one built around a single job — book a room, reserve a table, get a quote, place an order — and judged on whether that actually happens."
      />
      <WorkList builds={BUILDS} label={null} />
    </div>
  )
}
