import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import NovatedLeasing from './pages/NovatedLeasing'
import LeaseAnalysis from './pages/LeaseAnalysis'
import Employers from './pages/Employers'
import Partner from './pages/Partner'
import EmployerGuide from './pages/EmployerGuide'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Complaints from './pages/Complaints'
import CreditGuide from './pages/CreditGuide'
import RedditExclusive from './pages/RedditExclusive'
import Mazda6eDriveDay from './pages/Mazda6eDriveDay'
import BrowseEVs from './pages/BrowseEVs'
import LeaseRescueUpload from './pages/LeaseRescueUpload'
import AboutUs from './pages/AboutUs'

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
          <Route path="/partner" element={<Partner />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/credit-guide" element={<CreditGuide />} />
          <Route path="/browse-evs" element={<BrowseEVs />} />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        {/* Reddit exclusive page - no nav, minimal layout */}
        <Route path="/redditnl" element={<RedditExclusive />} />

        {/* Mazda 6e Drive Day - standalone landing page */}
        <Route path="/mazda-6e-drive-day" element={<Mazda6eDriveDay />} />

        {/* Employer Guide - standalone print-friendly page */}
        <Route path="/employer-guide" element={<EmployerGuide />} />

        {/* Lease Rescue Upload - standalone page after purchase */}
        <Route path="/lease-rescue/upload" element={<LeaseRescueUpload />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/novated-leasing" replace />} />
      </Routes>
    </Router>
  )
}

export default App
