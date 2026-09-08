import { TERMS_SECTIONS } from '../lib/legal.js'
import LegalPage from '../components/LegalPage.jsx'

export default function TermsOfService() {
  return <LegalPage testId="terms-page" title="Terms of Service" sections={TERMS_SECTIONS} />
}
