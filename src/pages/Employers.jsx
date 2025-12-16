import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Users,
  Zap,
  Heart,
  ArrowRight,
  Download,
  Phone,
  Mail,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Honeypot, { isSpamSubmission } from '../components/ui/Honeypot'
import BlurCircle from '../components/shared/BlurCircle'
import SEO, { localBusinessSchema } from '../components/shared/SEO'
import { saveEmployerInquiry } from '../lib/supabase'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'

export default function Employers() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    employeeCount: '',
    website: '', // Honeypot field
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Spam check - if honeypot field is filled, silently "succeed"
    if (isSpamSubmission(formData.website)) {
      setSubmitted(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      await saveEmployerInquiry({
        company_name: formData.companyName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone || null,
        employee_count: formData.employeeCount,
        source_page: '/employers',
        created_at: new Date().toISOString(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting employer inquiry:', err)
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: Zap,
      title: 'Zero Cost to You',
      description: 'No setup fees, no ongoing costs. Our revenue comes from finance, not employer charges.',
    },
    {
      icon: Users,
      title: 'Self-Service Platform',
      description: 'No consultants needed. Employees guide their own journey through our digital platform.',
    },
    {
      icon: Heart,
      title: 'Happy Employees',
      description: 'No complaints about hidden fees or pushy sales calls. Tech-enabled transparency they appreciate.',
    },
  ]

  const comparison = [
    {
      feature: 'Setup cost',
      traditional: '$500-2,000',
      millarx: 'Free',
    },
    {
      feature: 'Sales pressure',
      traditional: 'High',
      millarx: 'None (self-serve)',
    },
    {
      feature: 'Quote transparency',
      traditional: 'Low',
      millarx: 'Full breakdown',
    },
    {
      feature: 'Admin burden',
      traditional: 'Medium',
      millarx: 'Minimal',
    },
    {
      feature: 'Employee complaints',
      traditional: 'Common',
      millarx: 'Rare',
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Sign Up',
      description: 'Digital employer agreement takes about 10 minutes.',
    },
    {
      step: 2,
      title: 'Share Link',
      description: 'Give employees the platform link to explore options.',
    },
    {
      step: 3,
      title: 'Automated',
      description: 'Quotes, finance, deductions — all handled by our platform.',
    },
  ]

  return (
    <>
      <SEO
        title="Novated Leasing for Employers Australia 2025 | Zero Cost Employee Benefit"
        description="Offer transparent novated leasing to your employees at zero cost. Self-service platform reduces HR admin by 80%. No setup fees, no hidden costs. Partner with millarX today."
        canonical="/employers"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            {
              '@type': 'Service',
              'name': 'Employer Novated Leasing Partnership',
              'description': 'Zero-cost novated leasing benefit program for Australian employers',
              'provider': localBusinessSchema,
              'serviceType': 'Employee Benefits Administration',
              'areaServed': {
                '@type': 'Country',
                'name': 'Australia'
              },
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'AUD',
                'description': 'No setup fees, no ongoing costs to employers'
              }
            }
          ]
        }}
      />

      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <BlurCircle color="purple" size="xl" className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
        <BlurCircle color="teal" size="lg" className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />

        {/* Hero Section */}
      <section className="section-padding relative">
        <div className="container-wide mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-display-lg md:text-display-xl font-serif text-mx-slate-900 mb-6"
              >
                Give Your Team a Benefit{' '}
                <span className="gradient-text">They'll Actually Use</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-body-lg text-mx-slate-600 mb-8"
              >
                Novated leasing that's transparent, self-service,
                and costs your business nothing to offer.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                  Partner With Us
                </Button>
                <Button size="lg" variant="secondary" icon={<Download size={20} />}>
                  Download Info Pack
                </Button>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                {submitted ? (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center"
                    >
                      <CheckCircle className="text-teal-600" size={32} />
                    </motion.div>
                    <h3 className="text-display-sm font-serif text-mx-slate-900 mb-2">
                      Thanks for your interest!
                    </h3>
                    <p className="text-body text-mx-slate-600">
                      We'll be in touch within 24 hours to discuss how millarX can benefit your team.
                    </p>
                  </div>
                ) : (
                  <>
                <h3 className="text-display-sm font-serif text-mx-slate-900 mb-6">
                  Get in Touch
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot field - hidden from humans, catches bots */}
                  <Honeypot value={formData.website} onChange={handleChange} />

                  <Input
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company Pty Ltd"
                    required
                  />
                  <Input
                    label="Your Name"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    required
                  />
                  <Input
                    label="Phone (optional)"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0400 000 000"
                  />
                  <Select
                    label="Number of Employees"
                    name="employeeCount"
                    value={formData.employeeCount}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Select...' },
                      { value: '1-50', label: '1-50' },
                      { value: '51-200', label: '51-200' },
                      { value: '201-500', label: '201-500' },
                      { value: '500+', label: '500+' },
                    ]}
                  />
                  {error && (
                    <p className="text-red-600 text-body-sm">{error}</p>
                  )}
                  <Button type="submit" variant="primary" fullWidth loading={loading}>
                    Submit Inquiry
                  </Button>
                </form>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
              Why millarX for Employers
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card hover className="h-full text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-mx-purple-100 flex items-center justify-center">
                    <benefit.icon className="text-mx-purple-600" size={28} />
                  </div>
                  <h3 className="text-display-sm font-serif text-mx-slate-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-body text-mx-slate-600">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-mx-slate-50">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
              How It Works
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {howItWorks.map((item, index) => (
              <motion.div key={index} variants={staggerItem} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-mx-purple-700 text-white flex items-center justify-center font-bold text-2xl">
                  {item.step}
                </div>
                <h3 className="text-body-lg font-semibold text-mx-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-body text-mx-slate-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-white">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
              How We Compare
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-mx-slate-50">
                      <th className="text-left py-4 px-6 text-body font-semibold text-mx-slate-700">
                        Feature
                      </th>
                      <th className="text-center py-4 px-6 text-body font-semibold text-mx-slate-700">
                        Traditional Providers
                      </th>
                      <th className="text-center py-4 px-6 text-body font-semibold text-mx-purple-700">
                        millarX
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mx-slate-100">
                    {comparison.map((row, index) => (
                      <tr key={index}>
                        <td className="py-4 px-6 text-body text-mx-slate-700">
                          {row.feature}
                        </td>
                        <td className="py-4 px-6 text-center text-body text-mx-slate-500">
                          {row.traditional}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center gap-2 text-body font-semibold text-mx-teal-600">
                            <CheckCircle size={18} />
                            {row.millarx}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-padding bg-mx-slate-900 text-white">
        <div className="container-narrow mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <blockquote className="text-display-sm font-serif mb-6 italic">
              "Our Finance Director spotted that employees were getting
              overpriced leases from their existing provider. After switching
              to millarX, our team can see exactly what they're paying —
              no hidden fees, no surprises."
            </blockquote>
            <p className="text-body text-mx-slate-400">
              — HR Manager, Melbourne tech company
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-mx-purple-700 to-mx-purple-900 text-white">
        <div className="container-narrow mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-md font-serif mb-4">
              Ready to Offer Transparent Novated Leasing?
            </h2>
            <p className="text-body-lg text-mx-purple-100 mb-8">
              Join the employers who've already made the switch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Schedule a Call
              </a>
              <a
                href="mailto:ben@millarx.com.au?subject=Employer%20Info%20Pack%20Request"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/50 hover:bg-white/10 transition-all"
              >
                <Download size={18} />
                Download Employer Guide
              </a>
            </div>
            <p className="text-body text-mx-purple-200 mt-6">
              Or email us at{' '}
              <a
                href="mailto:employers@millarx.com.au"
                className="underline hover:no-underline"
              >
                employers@millarx.com.au
              </a>
            </p>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  )
}
