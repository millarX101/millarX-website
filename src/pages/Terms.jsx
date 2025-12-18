import { motion } from 'framer-motion'
import { FileText, AlertCircle } from 'lucide-react'
import SEO from '../components/shared/SEO'
import { COMPANY } from '../lib/constants'
import { fadeIn, staggerContainer } from '../lib/animations'

export default function Terms() {
  const lastUpdated = 'December 2024'

  const sections = [
    {
      title: 'Website Ownership',
      content: (
        <p>
          This website is owned and operated by {COMPANY.legalName} trading as {COMPANY.tradingName} (ACN {COMPANY.acn}, Australian Credit Licence No. {COMPANY.acl}). By accessing or using this website, you agree to be bound by these Terms and Conditions and our Privacy Policy.
        </p>
      ),
    },
    {
      title: 'General Use',
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>All content is for general information only and does not take into account your objectives, financial situation, or needs.</li>
          <li>Information provided does not constitute a formal quote or an offer of finance. All finance approvals are subject to assessment and the terms of individual credit providers.</li>
          <li>You should seek independent financial, taxation, and legal advice before relying on any information.</li>
        </ul>
      ),
    },
    {
      title: 'Use of mxDriveIQ and Digital Systems',
      content: (
        <>
          <p className="mb-4">
            We use proprietary digital systems including mxDriveIQ to facilitate our novated leasing services. By using our services, you agree that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your information may be processed through our digital platforms for quote generation, application processing, and lease management.</li>
            <li>Automated calculations and estimates are indicative only and subject to verification and credit assessment.</li>
            <li>You will receive communications via email and SMS regarding your application status and lease management.</li>
            <li>Data is stored securely and handled in accordance with our Privacy Policy.</li>
            <li>System access may be provided for you to track your application and manage your lease online.</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Calculator and Quote Disclaimer',
      content: (
        <>
          <p className="mb-4">The calculators and estimates provided on this website are for illustrative purposes only. They are based on:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>The information you provide</li>
            <li>Standard assumptions about interest rates, fees, and running costs</li>
            <li>Current market conditions at the time of calculation</li>
          </ul>
          <p className="mb-4">Actual lease terms, rates, and costs may vary based on:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your individual circumstances and credit assessment</li>
            <li>Your employer's salary packaging arrangements</li>
            <li>Current lender rates, policies, and approval criteria</li>
            <li>Vehicle availability and pricing</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Not Financial Advice',
      content: (
        <p>
          The information provided by {COMPANY.tradingName} does not constitute financial, tax, or legal advice. We are a credit assistance provider, not a financial adviser. We recommend that you seek independent financial advice before entering into a novated lease and consult with a tax professional regarding your specific circumstances.
        </p>
      ),
    },
    {
      title: 'Accuracy of Information',
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>While we take reasonable care to keep information accurate and current, we make no warranty that material on this site is free from error.</li>
          <li>We may change or update content at any time without notice.</li>
          <li>Interest rates, fees, and product features are subject to change by our lending partners.</li>
        </ul>
      ),
    },
    {
      title: 'Intellectual Property',
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Unless otherwise stated, all content on this website is owned by {COMPANY.legalName}.</li>
          <li>You must not copy, reproduce, or distribute content without written permission.</li>
          <li>Our calculators, systems, and methodologies are proprietary and may not be replicated.</li>
        </ul>
      ),
    },
    {
      title: 'Limitation of Liability',
      content: (
        <>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>To the maximum extent permitted by law, {COMPANY.tradingName} is not liable for any loss, cost, or damage arising directly or indirectly from your use of this site or reliance on its contents.</li>
            <li>We are not liable for decisions made based on calculator estimates or indicative quotes.</li>
            <li>Nothing in these Terms limits liability where it would be unlawful to do so (e.g. for fraud, death, or personal injury caused by negligence).</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Privacy',
      content: (
        <p>
          Our Privacy Policy explains how we collect, use, and protect your personal information including credit information. By using this site, you consent to the handling of your information in accordance with that policy.
        </p>
      ),
    },
    {
      title: 'Complaints',
      content: (
        <>
          <p className="mb-4">
            We are committed to dealing with complaints genuinely, efficiently, and effectively. If you have a concern, please contact us at {COMPANY.contact.email} or on {COMPANY.contact.phone}.
          </p>
          <p className="mb-4">
            We will acknowledge complaints promptly and aim to resolve them within 30 days (or 21 days for hardship/postponement of enforcement complaints).
          </p>
          <p>
            If you are not satisfied with the outcome, you may refer your complaint to the{' '}
            <a
              href={`https://${COMPANY.afca.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-mx-purple-600 hover:text-mx-purple-700 underline"
            >
              Australian Financial Complaints Authority (AFCA)
            </a>{' '}
            | Phone: {COMPANY.afca.phone} (free call)
          </p>
        </>
      ),
    },
    {
      title: 'Governing Law',
      content: (
        <p>
          These Terms are governed by the laws of Victoria, Australia. By using this site you submit to the jurisdiction of the courts of Victoria.
        </p>
      ),
    },
    {
      title: 'Licence Disclosure',
      content: (
        <p>
          {COMPANY.legalName} (trading as {COMPANY.tradingName}) ABN {COMPANY.abn} holds Australian Credit Licence No. {COMPANY.acl}. Our Responsible Manager is {COMPANY.responsibleManager}.
        </p>
      ),
    },
  ]

  return (
    <>
      <SEO
        title="Terms and Conditions"
        description="Terms and Conditions for using the millarX website and novated leasing services."
        canonical="/terms"
      />

      <div className="min-h-screen bg-mx-warm-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-mx-purple-900 via-mx-purple-700 to-mx-pink-600 text-white py-16 md:py-24">
          <div className="container-wide mx-auto px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-mx-purple-300" size={32} />
                <span className="text-mx-purple-300 font-medium">Legal</span>
              </div>
              <h1 className="text-display-lg font-serif mb-4">Terms and Conditions</h1>
              <p className="text-xl text-mx-purple-100">
                Please read these terms carefully before using our services.
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
                ABN {COMPANY.abn} | ACN {COMPANY.acn} | ACL {COMPANY.acl}
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
              className="max-w-3xl space-y-6"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white rounded-xl p-6 md:p-8 shadow-card"
                >
                  <h2 className="text-lg font-semibold text-mx-slate-900 mb-4">
                    {index + 1}. {section.title}
                  </h2>
                  <div className="prose prose-slate max-w-none text-mx-slate-600">
                    {section.content}
                  </div>
                </motion.div>
              ))}

              {/* Contact Section */}
              <motion.div
                variants={fadeIn}
                className="bg-mx-purple-50 rounded-xl p-6 md:p-8 border border-mx-purple-200"
              >
                <h2 className="text-lg font-semibold text-mx-slate-900 mb-4">
                  Contact Us
                </h2>
                <div className="text-mx-slate-600 space-y-1">
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
                      These Terms and Conditions may be updated from time to time. The current version will always be available on our website. Your continued use of our services constitutes acceptance of any changes.
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
