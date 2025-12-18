import { motion } from 'framer-motion'
import { BookOpen, FileText, Shield, Users, AlertCircle, HelpCircle, Scale, DollarSign, Clock, Building2 } from 'lucide-react'
import SEO from '../components/shared/SEO'
import { COMPANY } from '../lib/constants'
import { fadeIn, staggerContainer } from '../lib/animations'

export default function CreditGuide() {
  const lastUpdated = 'December 2024'

  const sections = [
    {
      id: 'about-us',
      icon: Building2,
      title: 'About Us',
      content: (
        <>
          <p className="mb-4">
            <strong>{COMPANY.legalName}</strong> (trading as <strong>{COMPANY.tradingName}</strong>)
            holds an Australian credit licence (ACL {COMPANY.acl}) and is authorised to engage in
            credit activities as a credit representative.
          </p>
          <div className="bg-mx-slate-50 rounded-lg p-4 mb-4">
            <p className="text-body-sm text-mx-slate-600 space-y-1">
              <strong>ABN:</strong> {COMPANY.abn}<br />
              <strong>ACN:</strong> {COMPANY.acn}<br />
              <strong>Australian Credit Licence:</strong> {COMPANY.acl}<br />
              <strong>Responsible Manager:</strong> {COMPANY.responsibleManager}
            </p>
          </div>
          <p>
            We are a credit assistance provider specialising in novated leases for motor vehicles.
            This guide explains the credit services we provide and how we interact with you.
          </p>
        </>
      ),
    },
    {
      id: 'services',
      icon: FileText,
      title: 'Credit Services We Provide',
      content: (
        <>
          <p className="mb-4">We provide credit assistance in relation to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Novated leases</strong> – a salary packaging arrangement where your employer
              deducts lease payments from your pre-tax salary
            </li>
            <li>
              <strong>Commercial vehicle finance</strong> – including chattel mortgages, finance
              leases, and commercial hire purchase for business use vehicles
            </li>
          </ul>
          <p className="mb-4">Our credit assistance services include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing information about credit products from our panel of lenders</li>
            <li>Helping you understand the features and costs of different credit options</li>
            <li>Assisting you to apply for credit with a suitable lender</li>
            <li>Providing preliminary assessments based on your financial situation</li>
          </ul>
        </>
      ),
    },
    {
      id: 'panel',
      icon: Users,
      title: 'Our Lender Panel',
      content: (
        <>
          <p className="mb-4">
            We work with a panel of approved lenders who provide novated lease and vehicle finance
            products. Our panel includes major banks, credit unions, and specialist vehicle finance
            providers.
          </p>
          <p className="mb-4">
            When we recommend a credit product, we consider products from our panel of lenders that
            may be suitable for your needs and financial situation. We do not compare products from
            all lenders in the market.
          </p>
          <p>
            We can provide you with a list of lenders on our panel upon request.
          </p>
        </>
      ),
    },
    {
      id: 'fees',
      icon: DollarSign,
      title: 'Fees and Charges',
      content: (
        <>
          <p className="mb-4">
            <strong>Our fee to you:</strong> We do not charge you a fee for our credit assistance
            services. Our services are provided at no cost to you.
          </p>
          <p className="mb-4">
            <strong>Commission from lenders:</strong> We receive commissions from lenders when a
            credit contract is entered into. These commissions are paid by the lender, not by you,
            and do not increase the cost of your loan.
          </p>
          <p className="mb-4">Commission structures vary between lenders and may include:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>An upfront commission based on a percentage of the loan amount</li>
            <li>Trail commissions based on the ongoing loan balance</li>
            <li>Volume-based bonuses</li>
          </ul>
          <p>
            We will tell you the commission we receive in relation to your credit contract before
            you enter into it.
          </p>
        </>
      ),
    },
    {
      id: 'obligations',
      icon: Scale,
      title: 'Our Obligations to You',
      content: (
        <>
          <p className="mb-4">As your credit assistance provider, we must:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Act in your best interests</strong> when providing credit assistance
            </li>
            <li>
              <strong>Give you priority</strong> over our own interests if there is a conflict
            </li>
            <li>
              <strong>Make reasonable enquiries</strong> about your requirements, objectives
              and financial situation
            </li>
            <li>
              <strong>Assess whether the credit product is not unsuitable</strong> for you based
              on our enquiries
            </li>
            <li>
              <strong>Provide you with documentation</strong> about the credit product before
              you enter into a contract
            </li>
          </ul>
          <p>
            We must not suggest a credit product that is unsuitable for you based on what you
            have told us about your requirements, objectives and financial situation.
          </p>
        </>
      ),
    },
    {
      id: 'your-obligations',
      icon: HelpCircle,
      title: 'Your Obligations',
      content: (
        <>
          <p className="mb-4">
            To enable us to properly assess a suitable credit product for you, it is important that you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide us with accurate and complete information about your financial situation</li>
            <li>Tell us about your requirements and objectives for the credit</li>
            <li>Let us know if your circumstances change before entering into a credit contract</li>
            <li>Read all documentation we provide and ask questions if anything is unclear</li>
            <li>Only sign documents that you have read and understood</li>
          </ul>
        </>
      ),
    },
    {
      id: 'documents',
      icon: FileText,
      title: 'Documents You Will Receive',
      content: (
        <>
          <p className="mb-4">Before entering into a credit contract, you will receive:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>This Credit Guide</strong> – explaining our services and obligations
            </li>
            <li>
              <strong>Credit Quote or Quote Document</strong> – containing details of the proposed
              credit, including fees, charges and comparison rates
            </li>
            <li>
              <strong>Credit Proposal Disclosure Document</strong> – setting out commission
              information and any fees payable
            </li>
            <li>
              <strong>Credit Contract</strong> – the legal agreement between you and the lender
            </li>
            <li>
              <strong>Financial Services Guide</strong> – if insurance products are recommended
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'privacy',
      icon: Shield,
      title: 'Your Privacy',
      content: (
        <>
          <p className="mb-4">
            We collect personal information, including credit information, to assess your
            suitability for credit products. This information may be disclosed to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Lenders on our panel</li>
            <li>Credit reporting bodies</li>
            <li>Insurers (if you request insurance)</li>
            <li>Our service providers and business partners</li>
          </ul>
          <p>
            For full details about how we handle your personal information, please refer to
            our <a href="/privacy" className="text-mx-purple-600 hover:text-mx-purple-700 underline">Privacy Policy</a>.
          </p>
        </>
      ),
    },
    {
      id: 'hardship',
      icon: Clock,
      title: 'Financial Hardship',
      content: (
        <>
          <p className="mb-4">
            If you are experiencing difficulty meeting your repayment obligations, you should
            contact your lender as soon as possible. Most lenders have hardship provisions that
            may allow them to vary your credit contract, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Extending the term of the loan</li>
            <li>Reducing the repayment amount</li>
            <li>Temporarily postponing payments</li>
          </ul>
          <p>
            We can assist you in contacting your lender to discuss hardship arrangements.
          </p>
        </>
      ),
    },
    {
      id: 'complaints',
      icon: AlertCircle,
      title: 'Complaints',
      content: (
        <>
          <p className="mb-4">
            If you have a complaint about our services, please contact us first. We will
            acknowledge your complaint within one business day and aim to resolve it within
            30 days.
          </p>
          <div className="bg-mx-slate-50 rounded-lg p-4 mb-4">
            <p className="text-body space-y-1">
              <strong>Complaints Officer</strong><br />
              Email: {COMPANY.contact.complaintsEmail}<br />
              Phone: {COMPANY.contact.phone}<br />
              Post: {COMPANY.address.full}
            </p>
          </div>
          <p className="mb-4">
            If you are not satisfied with our response, you may escalate your complaint to:
          </p>
          <div className="bg-mx-slate-50 rounded-lg p-4">
            <p className="text-body space-y-1">
              <strong>{COMPANY.afca.name} (AFCA)</strong><br />
              Website:{' '}
              <a
                href={`https://${COMPANY.afca.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mx-purple-600 hover:text-mx-purple-700"
              >
                {COMPANY.afca.website}
              </a><br />
              Phone: {COMPANY.afca.phone}<br />
              Email: {COMPANY.afca.email}
            </p>
          </div>
        </>
      ),
    },
  ]

  return (
    <>
      <SEO
        title="Credit Guide"
        description="Credit Guide for millarX novated leasing services. Understand our credit assistance services, fees, and your rights under the National Credit Code."
        canonical="/credit-guide"
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
                <BookOpen className="text-mx-purple-300" size={32} />
                <span className="text-mx-purple-300 font-medium">Legal</span>
              </div>
              <h1 className="text-display-lg font-serif mb-4">Credit Guide</h1>
              <p className="text-xl text-mx-purple-100">
                Important information about our credit assistance services
              </p>
            </motion.div>
          </div>
        </section>

        {/* Company Details */}
        <section className="bg-white border-b border-mx-slate-200">
          <div className="container-wide mx-auto px-4 md:px-6 lg:px-8 py-8">
            <div className="max-w-3xl">
              <p className="text-body text-mx-slate-600 mb-2">
                <strong>Version:</strong> {lastUpdated}
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

        {/* Purpose Banner */}
        <section className="bg-mx-purple-50 border-b border-mx-purple-200">
          <div className="container-wide mx-auto px-4 md:px-6 lg:px-8 py-6">
            <div className="max-w-3xl">
              <p className="text-body text-mx-purple-800">
                <strong>Purpose of this Credit Guide:</strong> This document is designed to help you
                understand the credit assistance services we provide, how we are paid, and your
                rights and protections under the <em>National Consumer Credit Protection Act 2009</em>.
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
                  <p><strong>{COMPANY.legalName}</strong> (trading as {COMPANY.tradingName})</p>
                  <p>{COMPANY.address.full}</p>
                  <p>Phone: {COMPANY.contact.phone}</p>
                  <p>Email: {COMPANY.contact.email}</p>
                  <p className="mt-3 text-body-sm">
                    Australian Credit Licence {COMPANY.acl} | ABN {COMPANY.abn}
                  </p>
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
                      This Credit Guide contains important information about our services. Please
                      retain a copy for your records. If you have any questions about this guide,
                      please contact us before proceeding with any application.
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
