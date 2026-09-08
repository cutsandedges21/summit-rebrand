import { Link } from 'react-router-dom'
import ArcHero from '../components/ArcHero.jsx'
import WorkList from '../components/WorkList.jsx'
import PinnedProcess from '../components/PinnedProcess.jsx'
import { BUILDS } from '../lib/builds.js'

// Partial assembly. Task 14 completes this page by adding the pinned Process
// section (task 13) and the pricing preview. Wired up early so the homepage is
// actually viewable during the build rather than an empty stub between the nav
// and the footer.
export default function Home() {
  return (
    <div data-testid="home-page">
      <ArcHero />
      <WorkList builds={BUILDS} limit={5} />
      <PinnedProcess />
      <div className="px-6 md:px-12">
        <Link to="/work" className="label underline">
          All fourteen builds →
        </Link>
      </div>
    </div>
  )
}
