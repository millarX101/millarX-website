import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import NovatedLeasing from './pages/NovatedLeasing'
import LeaseAnalysis from './pages/LeaseAnalysis'
import Employers from './pages/Employers'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Complaints from './pages/Complaints'
import CreditGuide from './pages/CreditGuide'
import RedditExclusive from './pages/RedditExclusive'

function App() {
  return (
    <Router>
      <Routes>
        {/* Main pages with full layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/novated-leasing" replace />} />
          <Route path="/novated-leasing" element={<NovatedLeasing />} />
          <Route path="/lease-analysis" element={<LeaseAnalysis />} />
          <Route path="/employers" element={<Employers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/credit-guide" element={<CreditGuide />} />
        </Route>

        {/* Reddit exclusive page - no nav, minimal layout */}
        <Route path="/redditnl" element={<RedditExclusive />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/novated-leasing" replace />} />
      </Routes>
    </Router>
  )
}

export default App
