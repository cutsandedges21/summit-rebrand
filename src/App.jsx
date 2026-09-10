import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Project from './pages/Project.jsx'
import Services from './pages/Services.jsx'
import Pricing from './pages/Pricing.jsx'
import About from './pages/About.jsx'
import Faq from './pages/Faq.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import NotFound from './pages/NotFound.jsx'

export function Routes() {
  return (
    <RouterRoutes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<Project />} />
        <Route path="/services" element={<Services />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/work" element={<Navigate to="/portfolio" replace />} />
        <Route path="/inspiration" element={<Navigate to="/portfolio" replace />} />
        {/* vercel.json rewrites every path to index.html so deep links survive a
            hard refresh, which means an unknown URL reaches the router rather
            than the host's 404. Without this it matched no route at all and
            rendered an empty <main> under a working nav — a blank page, not a
            missing one. */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </RouterRoutes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}
