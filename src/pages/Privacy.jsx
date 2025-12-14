import { motion } from 'framer-motion'
import { Shield, Lock, Eye, UserCheck, Database, Globe, FileText, AlertCircle } from 'lucide-react'
import SEO from '../components/shared/SEO'
import { COMPANY } from '../lib/constants'
import { fadeIn, staggerContainer } from '../lib/animations'

export default function Privacy() {
  const lastUpdated = 'December 2024'

  const sections = [
    {
      id: 'purpose',
      icon: FileText,
      title: 'Purpose of this Policy',
      content: (
        <>
          <p>
            This Privacy Policy explains how we collect, use, hold and disclose your personal information,
            including credit-related information, in accordance with the Privacy Act 1988 (Cth), the Australian
            Privacy Principles, and Part IIIA of the Act including the Privacy (Credit Reporting) Code 2014.
          </p>
        </>
      ),
    },
    {
      id: 'collection',
      icon: Database,
      title: 'Collection of Credit Information',
      content: (
        <>
          <p className="mb-4">We may collect and hold the following credit information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Identification details (name, date of birth, gender, address, driver licence)</li>
            <li>Credit liability information (credit providers, type of credit, amount, repayment terms)</li>
            <li>Repayment history and default information</li>
            <li>Details of credit applications made by you</li>
            <li>Information relating to court proceedings, insolvency, or serious credit infringements</li>
          </ul>
        </>
      ),
    },
    {
      id: 'purpose-of-collection',
      icon: Eye,
      title: 'Purpose of Collection',
      content: (
        <>
          <p className="mb-4">We collect, hold, use and disclose your credit information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Assess your application for credit assistance</li>
            <li>Source suitable credit products from our panel of credit providers</li>
            <li>Exchange information with credit reporting bodies and credit providers</li>
            <li>Comply with legal and regulatory obligations</li>
          </ul>
        </>
      ),
    },
    {
      id: 'crbs',
      icon: Globe,
      title: 'Credit Reporting Bodies (CRBs)',
      content: (
        <>
          <p className="mb-4">We may disclose your credit information to the following CRBs:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            {COMPANY.creditReportingBodies.map((crb) => (
              <li key={crb.name}>
                <strong>{crb.name}</strong> &ndash;{' '}
                <a
                  href={`https://${crb.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mx-purple-600 hover:text-mx-purple-700 underline"
                >
                  {crb.website}
                </a>
              </li>
            ))}
          </ul>
          <p className="mb-4">
            CRBs may use your credit information to prepare credit reports, which may be provided to other
            credit providers.
          </p>
          <p className="mb-2"><strong>Your rights include:</strong></p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Opting out of pre-screening:</strong> You may ask a CRB not to use your information
              to determine your eligibility to receive direct marketing offers.
            </li>
            <li>
              <strong>Fraud ban:</strong> You may request that a CRB place a ban on your credit information
              if you believe you are a victim of fraud.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'disclosure',
      icon: UserCheck,
      title: 'Disclosure of Information',
      content: (
        <>
          <p className="mb-4">We may disclose your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Credit providers with whom we submit applications</li>
            <li>Insurers or brokers if you request insurance products</li>
            <li>External service providers engaged by us (IT, compliance, auditors)</li>
            <li>Courts, tribunals, and regulatory authorities where required by law</li>
          </ul>
        </>
      ),
    },
    {
      id: 'overseas',
      icon: Globe,
      title: 'Overseas Disclosure',
      content: (
        <p>
          We generally do not disclose personal information overseas. If disclosure is required, we will
          take reasonable steps to ensure that the overseas recipient complies with the Australian Privacy
          Principles.
        </p>
      ),
    },
    {
      id: 'mxdriveiq',
      icon: Database,
      title: 'Use of Digital Systems',
      content: (
        <>
          <p className="mb-4">
            We use secure digital systems including mxDriveIQ and related platforms to process your
            novated lease applications. These systems may:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Store your personal and financial information securely</li>
            <li>Generate quotes and facilitate lease documentation</li>
            <li>Transmit information to credit providers and lenders</li>
            <li>Track the status of your application</li>
          </ul>
          <p className="mt-4">
            All data is encrypted in transit and at rest. We employ industry-standard security measures
            to protect your information within these systems.
          </p>
        </>
      ),
    },
    {
      id: 'access',
      icon: Lock,
      title: 'Access and Correction',
      content: (
        <p>
          You have the right to request access to the personal and credit information we hold about you
          and to request corrections if the information is inaccurate. We will respond to such requests
          within 30 days.
        </p>
      ),
    },
    {
      id: 'complaints',
      icon: AlertCircle,
      title: 'Complaints',
      content: (
        <>
          <p className="mb-4">
            If you believe we have breached your privacy or the Credit Reporting Code, you can lodge a
            complaint with us. We will acknowledge your complaint promptly and aim to resolve it within
            30 days.
          </p>
          <p className="mb-2">If you are not satisfied with our response, you may contact:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>{COMPANY.afca.name} (AFCA)</strong> &ndash;{' '}
              <a
                href={`https://${COMPANY.afca.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mx-purple-600 hover:text-mx-purple-700 underline"
              >
                {COMPANY.afca.website}
              </a>{' '}
              | {COMPANY.afca.phone}
            </li>
            <li>
              <strong>{COMPANY.oaic.name} (OAIC)</strong> &ndash;{' '}
              <a
                href={`https://${COMPANY.oaic.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mx-purple-600 hover:text-mx-purple-700 underline"
              >
                {COMPANY.oaic.website}
              </a>{' '}
              | {COMPANY.oaic.phone}
            </li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Privacy Policy for millarX novated leasing services. Learn how we collect, use and protect your personal and credit information."
        canonical="/privacy"
      />

      <div className="min-h-screen bg-mx-warm-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-mx-purple-700 to-mx-purple-900 text-white py-16 md:py-24">
          <div className="container-wide mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-mx-purple-300" size={32} />
                <span className="text-mx-purple-300 font-medium">Legal</span>
              </div>
              <h1 className="text-display-lg font-serif mb-4">Privacy Policy</h1>
              <p className="text-xl text-mx-purple-100">
                (Part IIIA – Credit Reporting)
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Details */}
        <section className="bg-white border-b border-mx-slate-200">
          <div className="container-wide mx-auto px-4 md:px-6 lg:px-8 py-8">
            <div className="max-w-3xl">
              <p className="text-body text-mx-slate-600 mb-2">
                <strong>Effective:</strong> {lastUpdated}
              </p>
              <p className="text-body text-mx-slate-800 font-medium">
                {COMPANY.legalName} (trading as {COMPANY.tradingName})
              </p>
              <p className="text-body text-mx-slate-600">
                ABN {COMPANY.abn} | ACN {COMPANY.acn}
              </p>
              <p className="text-body text-mx-slate-600">
                Australian credit licence {COMPANY.acl}
              </p>
              <p className="text-body text-mx-slate-600 mt-2">
                {COMPANY.address.full}
              </p>
              <p className="text-body text-mx-slate-600">
                Phone: {COMPANY.contact.phone} | Email: {COMPANY.contact.email}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container-wide mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-3xl space-y-8"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  variants={fadeIn}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-mx-purple-100 flex items-center justify-center flex-shrink-0">
                      <section.icon className="text-mx-purple-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-mx-slate-900 mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <div className="prose prose-slate max-w-none text-mx-slate-600">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Contact Section */}
              <motion.div
                variants={fadeIn}
                className="bg-mx-purple-50 rounded-xl p-6 md:p-8 border border-mx-purple-200"
              >
                <h2 className="text-xl font-semibold text-mx-slate-900 mb-4">
                  Contact Us
                </h2>
                <div className="text-mx-slate-600 space-y-1">
                  <p><strong>Privacy Officer</strong></p>
                  <p>{COMPANY.legalName} (trading as {COMPANY.tradingName})</p>
                  <p>{COMPANY.address.full}</p>
                  <p>Phone: {COMPANY.contact.phone}</p>
                  <p>Email: {COMPANY.contact.email}</p>
                </div>
              </motion.div>

              {/* Important Notice */}
              <motion.div
                variants={fadeIn}
                className="bg-mx-amber-50 rounded-xl p-6 md:p-8 border border-mx-amber-200"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-mx-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-mx-slate-900 mb-2">Important Notice</h3>
                    <p className="text-mx-slate-600">
                      This Privacy Policy may be updated from time to time. The current version will
                      always be available on our website.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
