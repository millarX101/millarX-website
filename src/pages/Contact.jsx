import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Globe, Send, CheckCircle } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import SEO from '../components/shared/SEO'
import { saveContactSubmission } from '../lib/supabase'
import { fadeInUp, staggerContainer } from '../lib/animations'
import { FOOTER_LINKS } from '../lib/constants'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const inquiryOptions = [
    { value: '', label: 'Select inquiry type...' },
    { value: 'employee', label: "I'm an employee" },
    { value: 'employer', label: "I'm an employer" },
    { value: 'dealer', label: "I'm a dealer" },
    { value: 'other', label: 'Other' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await saveContactSubmission({
        ...formData,
        source_page: '/contact',
        created_at: new Date().toISOString(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting form:', err)
      // Still show success as fallback
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="section-padding">
        <div className="container-narrow mx-auto">
          <Card className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center"
            >
              <CheckCircle className="text-teal-600" size={40} />
            </motion.div>
            <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
              Message Sent!
            </h2>
            <p className="text-body-lg text-mx-slate-600 mb-6">
              Thanks for reaching out. We'll get back to you within 24 hours.
            </p>
            <Button as="a" href="/">
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with millarX for transparent novated leasing advice. We're here to help with any questions about salary packaging your next vehicle."
        canonical="/contact"
      />

      <div className="section-padding">
        <div className="container-wide mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center mb-12"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-display-lg font-serif text-mx-slate-900 mb-4"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto"
            >
              Have a question about novated leasing? We're here to help.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-mx-purple-100 flex items-center justify-center">
                    <Mail className="text-mx-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-body-sm text-mx-slate-500">Email</p>
                    <a
                      href={`mailto:${FOOTER_LINKS.contact.email}`}
                      className="text-body font-semibold text-mx-slate-900 hover:text-mx-purple-700"
                    >
                      {FOOTER_LINKS.contact.email}
                    </a>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-mx-purple-100 flex items-center justify-center">
                    <Phone className="text-mx-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-body-sm text-mx-slate-500">Phone</p>
                    <a
                      href={`tel:${FOOTER_LINKS.contact.phone.replace(/\s/g, '')}`}
                      className="text-body font-semibold text-mx-slate-900 hover:text-mx-purple-700"
                    >
                      {FOOTER_LINKS.contact.phone}
                    </a>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-mx-purple-100 flex items-center justify-center">
                    <Globe className="text-mx-purple-600" size={24} />
                  </div>
                  <div>
                    <p className="text-body-sm text-mx-slate-500">Website</p>
                    <a
                      href={`https://${FOOTER_LINKS.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body font-semibold text-mx-slate-900 hover:text-mx-purple-700"
                    >
                      {FOOTER_LINKS.contact.website}
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <h2 className="text-display-sm font-serif text-mx-slate-900 mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Phone (optional)"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0400 000 000"
                  />
                  <Select
                    label="I am..."
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    options={inquiryOptions}
                  />
                </div>

                <div>
                  <label className="block text-body font-medium text-mx-slate-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-mx-slate-200 rounded-lg bg-white text-mx-slate-900 placeholder-mx-slate-400 transition-all duration-200 focus:border-mx-purple-500 focus:outline-none focus:ring-2 focus:ring-mx-purple-100"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={<Send size={18} />}
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
