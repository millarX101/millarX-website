import { Link } from 'react-router-dom'
import { Mail, Phone, Globe, MapPin } from 'lucide-react'
import { FOOTER_LINKS, COMPANY } from '../../lib/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-mx-slate-900 text-white">
      {/* Main footer content */}
      <div className="container-wide mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-3xl font-serif text-white tracking-tight">
                millar<span className="text-mx-purple-400">X</span>
              </span>
            </Link>
            <p className="text-mx-slate-400 text-body mb-6 max-w-md">
              Transparent novated leasing without the hidden costs.
              See exactly what you'll pay with our fair pricing approach.
            </p>

            {/* Trust badges with actual numbers */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-body-sm bg-mx-slate-800 text-mx-slate-300">
                ABN {COMPANY.abn}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-body-sm bg-mx-slate-800 text-mx-slate-300">
                ACL {COMPANY.acl}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/novated-leasing"
                  className="text-mx-slate-400 hover:text-white transition-colors"
                >
                  Novated Leasing
                </Link>
              </li>
              <li>
                <Link
                  to="/lease-analysis"
                  className="text-mx-slate-400 hover:text-white transition-colors"
                >
                  Lease Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/employers"
                  className="text-mx-slate-400 hover:text-white transition-colors"
                >
                  For Employers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-mx-slate-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${COMPANY.contact.email}`}
                  className="flex items-center gap-2 text-mx-slate-400 hover:text-white transition-colors"
                >
                  <Mail size={18} />
                  <span>{COMPANY.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-mx-slate-400 hover:text-white transition-colors"
                >
                  <Phone size={18} />
                  <span>{COMPANY.contact.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://${COMPANY.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-mx-slate-400 hover:text-white transition-colors"
                >
                  <Globe size={18} />
                  <span>{COMPANY.contact.website}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-mx-slate-400">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>{COMPANY.address.full}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-12 pt-8 border-t border-mx-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-mx-slate-400 hover:text-white text-body-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACL Disclosure Bar */}
      <div className="bg-mx-purple-700 py-3">
        <div className="container-wide mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-white text-body-sm text-center">
            {COMPANY.legalName} (trading as {COMPANY.tradingName}) ABN {COMPANY.abn}. Australian credit licence {COMPANY.acl}.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-mx-slate-950 py-4">
        <div className="container-wide mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-mx-slate-500 text-body-sm text-center">
            &copy; {currentYear} {COMPANY.tradingName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
