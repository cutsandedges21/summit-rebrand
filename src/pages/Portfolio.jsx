import WorkList from '../components/WorkList.jsx'
import { BUILDS } from '../lib/builds.js'

// Partial assembly. Task 15 adds the page header and intro copy.
export default function Portfolio() {
  return (
    <div data-testid="portfolio-page">
      <WorkList builds={BUILDS} />
    </div>
  )
}
