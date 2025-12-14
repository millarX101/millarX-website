import { motion } from 'framer-motion'
import { MessageSquare, Mail, Phone, Clock, ExternalLink, FileText, CheckCircle, AlertTriangle, Building2 } from 'lucide-react'
import SEO from '../components/shared/SEO'
import { COMPANY } from '../lib/constants'
import { fadeIn, staggerContainer } from '../lib/animations'

export default function Complaints() {
  const lastUpdated = 'December 2024'

  const steps = [
    {
      step: 1,
      title: 'Contact Us Directly',
      description: (
        <>
          <p className="mb-2">
            In most cases, complaints can be resolved quickly by speaking with us directly.
            Please contact us by phone or email and we will do our best to resolve your
            concerns immediately.
          </p>
          <p>
            <strong>Phone:</strong> {COMPANY.contact.phone}<br />
            <strong>Email:</strong> {COMPANY.contact.complaintsEmail}
          </p>
        </>
      ),
    },
    {
      step: 2,
      title: 'Lodge a Formal Complaint',
      description: (
        <>
          <p className="mb-2">
            If your concern is not resolved to your satisfaction, or if you prefer to put your
            complaint in writing, please lodge a formal complaint with our Internal Dispute
            Resolution (IDR) team.
          </p>
          <p className="mb-2">Your complaint should include:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your full name and contact details</li>
            <li>A clear description of your complaint</li>
            <li>When the issue occurred</li>
            <li>Any relevant documentation</li>
            <li>What outcome you are seeking</li>
          </ul>
        </>
      ),
    },
    {
      step: 3,
      title: 'Acknowledgement & Investigation',
      description: (
        <p>
          We will acknowledge receipt of your complaint in writing within <strong>one (1) business day</strong>.
          We will then investigate your complaint thoroughly and provide you with a written response
          within <strong>30 calendar days</strong>. If the matter is complex and requires more time,
          we will keep you informed of our progress.
        </p>
      ),
    },
    {
      step: 4,
      title: 'External Dispute Resolution',
      description: (
        <p>
          If you are not satisfied with our response, or if we have not resolved your complaint
          within 30 days, you may escalate the matter to the Australian Financial Complaints
          Authority (AFCA), an independent external dispute resolution scheme.
        </p>
      ),
    },
  ]

  return (
    <>
      <SEO
        title="Complaints Policy"
        description="Complaints handling policy for millarX novated leasing services. Learn how to lodge a complaint and our dispute resolution process."
        canonical="/complaints"
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
                <MessageSquare className="text-mx-purple-300" size={32} />
                <span className="text-mx-purple-300 font-medium">Legal</span>
              </div>
              <h1 className="text-display-lg font-serif mb-4">Internal Dispute Resolution Policy</h1>
              <p className="text-xl text-mx-purple-100">
                Complaints Handling Procedure
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
              {/* Introduction */}
              <motion.div
                variants={fadeIn}
                className="bg-white rounded-xl p-6 md:p-8 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-mx-purple-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="text-mx-purple-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-mx-slate-900 mb-4">
                      Our Commitment to You
                    </h2>
                    <div className="prose prose-slate max-w-none text-mx-slate-600">
                      <p className="mb-4">
                        At {COMPANY.tradingName}, we are committed to providing high-quality credit
                        assistance services. However, if something goes wrong, we want to know about
                        it and resolve it quickly and fairly.
                      </p>
                      <p className="mb-4">
                        This policy explains how you can make a complaint and how we will handle it
                        in accordance with our obligations under the <strong>National Consumer Credit
                        Protection Act 2009</strong> and ASIC Regulatory Guide 271.
                      </p>
                      <p>We promise to:</p>
                      <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Treat all complaints seriously, promptly and fairly</li>
                        <li>Keep you informed throughout the process</li>
                        <li>Protect your privacy and handle complaints confidentially</li>
                        <li>Use feedback to improve our services</li>
                        <li>Provide this service free of charge</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* How to Make a Complaint */}
              <motion.div
                variants={fadeIn}
                className="bg-white rounded-xl p-6 md:p-8 shadow-card"
              >
                <h2 className="text-xl font-semibold text-mx-slate-900 mb-6">
                  How to Make a Complaint
                </h2>
                <div className="space-y-6">
                  {steps.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-mx-purple-700 text-white flex items-center justify-center font-bold text-lg">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-mx-slate-900 mb-2">
                          {item.title}
                        </h3>
                        <div className="text-mx-slate-600">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                variants={fadeIn}
                className="bg-white rounded-xl p-6 md:p-8 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-mx-purple-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-mx-purple-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-mx-slate-900 mb-4">
                      Contact Our Complaints Officer
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-mx-slate-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="text-mx-purple-600" size={18} />
                          <span className="text-body-sm text-mx-slate-500">Email</span>
                        </div>
                        <a
                          href={`mailto:${COMPANY.contact.complaintsEmail}`}
                          className="text-body font-semibold text-mx-slate-900 hover:text-mx-purple-700"
                        >
                          {COMPANY.contact.complaintsEmail}
                        </a>
                      </div>

                      <div className="p-4 bg-mx-slate-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Phone className="text-mx-purple-600" size={18} />
                          <span className="text-body-sm text-mx-slate-500">Phone</span>
                        </div>
                        <a
                          href={`tel:${COMPANY.contact.phone.replace(/\s/g, '')}`}
                          className="text-body font-semibold text-mx-slate-900 hover:text-mx-purple-700"
                        >
                          {COMPANY.contact.phone}
                        </a>
                      </div>

                      <div className="p-4 bg-mx-slate-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="text-mx-purple-600" size={18} />
                          <span className="text-body-sm text-mx-slate-500">Post</span>
                        </div>
                        <p className="text-body font-semibold text-mx-slate-900">
                          Complaints Officer<br />
                          <span className="font-normal text-mx-slate-600">
                            {COMPANY.address.full}
                          </span>
                        </p>
                      </div>

                      <div className="p-4 bg-mx-slate-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="text-mx-purple-600" size={18} />
                          <span className="text-body-sm text-mx-slate-500">Response Time</span>
                        </div>
                        <p className="text-body font-semibold text-mx-slate-900">
                          Acknowledgement within 1 business day<br />
                          <span className="font-normal text-mx-slate-600">
                            Resolution within 30 days
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* What Happens Next */}
              <motion.div
                variants={fadeIn}
                className="bg-white rounded-xl p-6 md:p-8 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-mx-purple-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-mx-purple-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-mx-slate-900 mb-4">
                      What Happens After You Complain
                    </h2>
                    <div className="prose prose-slate max-w-none text-mx-slate-600">
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          <strong>Acknowledgement:</strong> We will send you a written acknowledgement
                          within one (1) business day of receiving your complaint, including the name
                          and contact details of the person handling your matter.
                        </li>
                        <li>
                          <strong>Investigation:</strong> We will investigate your complaint thoroughly
                          and may contact you for further information.
                        </li>
                        <li>
                          <strong>Response:</strong> We aim to resolve complaints within 30 calendar days.
                          If we cannot resolve the matter within this timeframe, we will write to you
                          explaining why and when you can expect a response.
                        </li>
                        <li>
                          <strong>Outcome:</strong> Our written response will explain our decision,
                          the reasons for it, and your options if you are not satisfied.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* AFCA Section */}
              <motion.div
                variants={fadeIn}
                className="bg-mx-purple-50 rounded-xl p-6 md:p-8 border border-mx-purple-200"
              >
                <h2 className="text-xl font-semibold text-mx-slate-900 mb-4">
                  External Dispute Resolution – AFCA
                </h2>
                <div className="text-mx-slate-600 space-y-4">
                  <p>
                    If you are not satisfied with our response to your complaint, or if we have not
                    resolved your complaint within 30 days, you may refer your complaint to the
                    <strong> {COMPANY.afca.name} (AFCA)</strong>.
                  </p>
                  <p>
                    AFCA provides a free, fair and independent external dispute resolution service
                    for consumers. We are a member of AFCA and are bound by its decisions.
                  </p>
                  <div className="bg-white rounded-lg p-5 border border-mx-purple-100">
                    <h3 className="font-semibold text-mx-slate-900 mb-3">
                      {COMPANY.afca.name}
                    </h3>
                    <div className="space-y-2 text-body">
                      <p>
                        <strong>Website:</strong>{' '}
                        <a
                          href={`https://${COMPANY.afca.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-mx-purple-600 hover:text-mx-purple-700 inline-flex items-center gap-1"
                        >
                          {COMPANY.afca.website} <ExternalLink size={14} />
                        </a>
                      </p>
                      <p><strong>Email:</strong> {COMPANY.afca.email}</p>
                      <p><strong>Phone:</strong> {COMPANY.afca.phone} (free call)</p>
                      <p><strong>Address:</strong> {COMPANY.afca.address}</p>
                    </div>
                  </div>
                  <p className="text-body-sm text-mx-slate-500">
                    Note: AFCA will generally require that you attempt to resolve the complaint
                    with us first before accepting your complaint.
                  </p>
                </div>
              </motion.div>

              {/* Privacy Complaints */}
              <motion.div
                variants={fadeIn}
                className="bg-white rounded-xl p-6 md:p-8 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-mx-purple-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="text-mx-purple-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-mx-slate-900 mb-4">
                      Privacy Complaints
                    </h2>
                    <div className="prose prose-slate max-w-none text-mx-slate-600">
                      <p className="mb-4">
                        If your complaint relates to how we have handled your personal information
                        or credit information, you may also contact the{' '}
                        <strong>{COMPANY.oaic.name} (OAIC)</strong>.
                      </p>
                      <div className="bg-mx-slate-50 rounded-lg p-4">
                        <p className="mb-1"><strong>{COMPANY.oaic.name}</strong></p>
                        <p>
                          Website:{' '}
                          <a
                            href={`https://${COMPANY.oaic.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mx-purple-600 hover:text-mx-purple-700"
                          >
                            {COMPANY.oaic.website}
                          </a>
                        </p>
                        <p>Phone: {COMPANY.oaic.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Important Notice */}
              <motion.div
                variants={fadeIn}
                className="bg-mx-amber-50 rounded-xl p-6 md:p-8 border border-mx-amber-200"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-mx-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-mx-slate-900 mb-2">Important Notice</h3>
                    <p className="text-mx-slate-600">
                      This Complaints Policy may be updated from time to time. The current version
                      will always be available on our website. Making a complaint will not affect
                      any ongoing services we provide to you.
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
