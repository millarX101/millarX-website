import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Radio, DollarSign, Shield, CheckCircle, Calculator, Headphones, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Honeypot, { isSpamSubmission } from '../components/ui/Honeypot'
import SEO from '../components/shared/SEO'
import BlurCircle from '../components/shared/BlurCircle'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { getMediaUrl, MEDIA, saveKissFMLead } from '../lib/supabase'

const VALUE_PROPS = [
  {
    icon: DollarSign,
    title: 'Save Thousands on Your Next Car',
    description: 'A novated lease lets you pay for your car from your pre-tax salary. That means real savings on both the car and running costs like fuel, insurance, and servicing.',
  },
  {
    icon: Shield,
    title: 'Transparent — No Hidden Fees',
    description: 'millarX shows you every cost upfront. No inflated insurance, no hidden admin fees, no surprises. Just honest numbers.',
  },
  {
    icon: Radio,
    title: 'Supporting KissFM',
    description: 'Every settled lease from a KissFM listener means a donation back to Kiss. Help keep Melbourne\'s independent dance music community alive.',
  },
]

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Tell Us About You',
    description: 'Fill in the form below with your details. We\'ll be in touch to understand your situation.',
  },
  {
    step: 2,
    title: 'Get Your Personalised Quote',
    description: 'We\'ll crunch the numbers and show you exactly what you\'d save with a novated lease.',
  },
  {
    step: 3,
    title: 'Drive Away & Save',
    description: 'Once approved, your employer deducts payments from your pre-tax salary. You start saving from day one.',
  },
]

export default function KissFMLanding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    employer: '',
    website: '', // honeypot
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSpamSubmission(formData.website)) {
      setSubmitted(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams(window.location.search)
      await saveKissFMLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        employer: formData.employer || null,
        source_page: '/kissfm',
        utm_source: params.get('utm_source') || 'kissfm',
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
      })
      setSubmitted(true)

      // Track conversion in Google Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'generate_lead', {
          event_category: 'KissFM Lead',
          event_label: 'KissFM Landing Page',
        })
      }
    } catch (err) {
      console.error('KissFM lead submission error:', err)
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="KissFM x millarX — Save on Your Next Car with Novated Leasing"
        description="Exclusive for KissFM listeners. See how much you could save on your next car with a novated lease from millarX. Transparent pricing, no hidden fees. Every lease supports Melbourne's independent dance music community."
        canonical="/kissfm"
      />

      <div className="min-h-screen bg-mx-ivory relative overflow-hidden">
        {/* Decorative background */}
        <BlurCircle color="purple" size="xl" className="top-[-200px] right-[-200px]" />
        <BlurCircle color="pink" size="lg" className="bottom-[200px] left-[-150px]" />

        {/* Header */}
        <header className="relative z-10 py-6 px-4 md:px-6">
          <div className="container-wide mx-auto flex items-center justify-between">
            <Link to="/">
              <img
                src={getMediaUrl(MEDIA.logo)}
                alt="millarX"
                className="h-8 md:h-10 w-auto"
              />
            </Link>
            {/* Text treatment for KissFM — swap for logo image when available */}
            <span className="text-[#DD0000] font-bold text-xl md:text-2xl tracking-tight">
              KissFM
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 px-4 py-12 md:py-20">
          <div className="container-narrow mx-auto text-center">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.p
                variants={fadeInUp}
                className="text-body-lg font-semibold text-mx-purple-600 mb-4 tracking-wide uppercase"
              >
                millarX x KissFM
              </motion.p>

              <motion.h1
                variants={fadeInUp}
                className="text-display-lg md:text-display-xl font-serif text-mx-slate-900 mb-6"
              >
                Save Thousands on Your{' '}
                <span className="gradient-text">Next Car</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto mb-8"
              >
                Novated leasing lets you pay for your car from your pre-tax salary —
                saving you thousands over the life of the lease. As a KissFM listener,
                every lease you settle means a donation back to Kiss. Support the crew
                while saving on your next car.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-mx-purple-100 to-pink-50 border border-mx-purple-200 px-6 py-3 rounded-full"
              >
                <Headphones className="text-mx-purple-600" size={20} />
                <span className="text-body-lg font-semibold text-mx-purple-700">
                  Supporting Melbourne's independent dance music community
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Value Props */}
        <section className="relative z-10 px-4 py-12 bg-white">
          <div className="container-wide mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {VALUE_PROPS.map((prop, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="h-full text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-mx-purple-100 flex items-center justify-center">
                      <prop.icon className="text-mx-purple-600" size={28} />
                    </div>
                    <h3 className="text-display-sm font-serif text-mx-slate-900 mb-2">
                      {prop.title}
                    </h3>
                    <p className="text-body text-mx-slate-600">
                      {prop.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="relative z-10 px-4 py-12">
          <div className="container-wide mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
                How It Works
              </h2>
              <p className="text-body-lg text-mx-slate-600">
                Three simple steps to start saving
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {HOW_IT_WORKS.map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  className="text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-mx-purple-700 text-white flex items-center justify-center font-bold text-lg">
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

        {/* Lead Capture Form */}
        <section id="register" className="relative z-10 px-4 py-12 md:py-16">
          <div className="container-narrow mx-auto max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card padding="lg">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-mx-teal-500/10 flex items-center justify-center">
                      <CheckCircle className="text-mx-teal-500" size={32} />
                    </div>
                    <h3 className="text-display-sm font-serif text-mx-slate-900 mb-3">
                      We'll be in touch!
                    </h3>
                    <p className="text-body-lg text-mx-slate-600 mb-2">
                      Thanks for getting in touch. One of our team will reach out shortly
                      to discuss your options.
                    </p>
                    <p className="text-body text-mx-slate-500 mb-6">
                      In the meantime, feel free to explore our calculator to see
                      what you could save.
                    </p>
                    <Link to="/novated-leasing#calculator">
                      <Button variant="primary" size="md">
                        <Calculator size={18} className="mr-2" />
                        Try the Calculator
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-display-sm font-serif text-mx-slate-900 mb-2">
                        Get Your Free Quote
                      </h2>
                      <p className="text-body text-mx-slate-500">
                        Tell us a bit about yourself and we'll show you how much you could save.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />

                      <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />

                      <Input
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="04XX XXX XXX"
                        required
                      />

                      <Input
                        label="Employer (optional)"
                        name="employer"
                        value={formData.employer}
                        onChange={handleChange}
                        placeholder="Your employer's name"
                        helperText="Helps us check if your employer offers salary packaging"
                      />

                      <Honeypot
                        value={formData.website}
                        onChange={handleChange}
                      />

                      {error && (
                        <p className="text-body-sm text-red-500 text-center">
                          {error}
                        </p>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        loading={loading}
                        disabled={loading}
                      >
                        Get My Free Quote
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        </section>

        {/* KissFM Links + Calculator CTA */}
        <section className="relative z-10 px-4 py-12 md:py-16 bg-mx-slate-900 text-white">
          <div className="container-narrow mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display-sm font-serif mb-4">
                Want to Crunch the Numbers Yourself?
              </h2>
              <p className="text-body-lg text-mx-slate-300 mb-8 max-w-xl mx-auto">
                Use our free novated lease calculator to see your potential savings
                instantly — or tune into KissFM while you browse.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to="/novated-leasing#calculator">
                  <Button
                    variant="outline"
                    size="lg"
                    as="span"
                    className="border-white text-white hover:bg-white hover:text-mx-slate-900"
                  >
                    <Calculator size={20} className="mr-2" />
                    Try the Calculator
                  </Button>
                </Link>
              </div>

              <div className="border-t border-mx-slate-700 pt-8 mt-4">
                <p className="text-body font-semibold text-mx-slate-400 uppercase tracking-wide mb-4">
                  Listen to KissFM
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://kissfm.com.au/listen-live/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-mx-slate-600 text-mx-slate-300 hover:text-white hover:border-mx-slate-400 transition-colors"
                  >
                    <Radio size={18} />
                    Listen Live
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href="https://kissfm.com.au/kissondemand/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-mx-slate-600 text-mx-slate-300 hover:text-white hover:border-mx-slate-400 transition-colors"
                  >
                    <Headphones size={18} />
                    Kiss On Demand
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 py-8 px-4 text-center bg-mx-slate-800">
          <div className="container-narrow mx-auto">
            <div className="flex flex-wrap justify-center gap-6 text-body-sm text-mx-slate-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <a
                href="mailto:info@millarx.com.au"
                className="hover:text-white transition-colors"
              >
                info@millarx.com.au
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
