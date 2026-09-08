import { PRIVACY_SECTIONS } from '../lib/legal.js'
import LegalPage from '../components/LegalPage.jsx'

export default function PrivacyPolicy() {
  return <LegalPage testId="privacy-page" title="Privacy Policy" sections={PRIVACY_SECTIONS} />
}
