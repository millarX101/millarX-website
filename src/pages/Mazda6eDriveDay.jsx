import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Car, CheckCircle, Users } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import Honeypot, { isSpamSubmission } from '../components/ui/Honeypot'
import SEO from '../components/shared/SEO'
import BlurCircle from '../components/shared/BlurCircle'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { getMediaUrl, MEDIA, saveDriveDayRegistration } from '../lib/supabase'

const PREFERRED_DAY_OPTIONS = [
  { value: 'weekday', label: 'Weekday' },
  { value: 'weekend', label: 'Weekend' },
  { value: 'either', label: 'Either — I\'m flexible' },
]

const PASSENGER_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No, just me' },
]

const EVENT_DETAILS = [
  {
    icon: Calendar,
    title: 'When',
    detail: 'June 2026',
    sub: 'Exact dates TBC — register now to be first to know',
  },
  {
    icon: MapPin,
    title: 'Where',
    detail: 'Ringwood Mazda',
    sub: 'Melbourne, VIC',
  },
  {
    icon: Car,
    title: 'What',
    detail: 'Mazda 6e Test Drive',
    sub: 'Get behind the wheel of the all-new Mazda 6e',
  },
]

export default function Mazda6eDriveDay() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_day: '',
    bringing_passenger: '',
    website: '',
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
      await saveDriveDayRegistration({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferred_day: formData.preferred_day,
        bringing_passenger: formData.bringing_passenger,
        source_page: '/mazda-6e-drive-day',
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Registration error:', err)
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Mazda 6e Drive Day — Exclusively with Ringwood Mazda"
        description="Register your interest for an exclusive Mazda 6e drive day with millarX and Ringwood Mazda. Only 100 spots available. Cars arriving June 2026 — book early to avoid disappointment."
        canonical="/mazda-6e-drive-day"
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
            <img
              src={getMediaUrl(MEDIA.partnerLogos.ringwoodMazda)}
              alt="Ringwood Mazda"
              className="h-8 md:h-10 w-auto"
            />
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
                Exclusively with millarX & Ringwood Mazda
              </motion.p>

              <motion.h1
                variants={fadeInUp}
                className="text-display-lg md:text-display-xl font-serif text-mx-slate-900 mb-6"
              >
                Mazda 6e{' '}
                <span className="gradient-text">Drive Day</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto mb-8"
              >
                With pre-orders open now, we're looking forward to getting our hands on the
                all-new Mazda 6e. Register your interest and we'll contact you when we have
                dates locked away. They won't be on the ground until June, so book early
                to avoid disappointment.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-mx-purple-100 to-pink-50 border border-mx-purple-200 px-6 py-3 rounded-full"
              >
                <Users className="text-mx-purple-600" size={20} />
                <span className="text-body-lg font-semibold text-mx-purple-700">
                  Only 100 spots available — book early
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Car Image */}
        <section className="relative z-10 px-4 py-4">
          <div className="container-wide mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={getMediaUrl(MEDIA.events.mazda6e)}
                alt="Mazda 6e"
                className="w-full rounded-2xl shadow-card"
              />
            </motion.div>
          </div>
        </section>

        {/* Event Details */}
        <section className="relative z-10 px-4 py-12">
          <div className="container-wide mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {EVENT_DETAILS.map((item, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="h-full text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-mx-purple-100 flex items-center justify-center">
                      <item.icon className="text-mx-purple-600" size={28} />
                    </div>
                    <p className="text-body-sm font-semibold text-mx-purple-600 uppercase tracking-wide mb-1">
                      {item.title}
                    </p>
                    <h3 className="text-display-sm font-serif text-mx-slate-900 mb-2">
                      {item.detail}
                    </h3>
                    <p className="text-body text-mx-slate-500">
                      {item.sub}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Registration Form */}
        <section className="relative z-10 px-4 py-12 md:py-16">
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
                      You're on the list!
                    </h3>
                    <p className="text-body-lg text-mx-slate-600 mb-2">
                      Thanks for registering your interest in the Mazda 6e Drive Day.
                    </p>
                    <p className="text-body text-mx-slate-500">
                      We'll be in touch when dates are locked in. Keep an eye on your inbox.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-display-sm font-serif text-mx-slate-900 mb-2">
                        Register Your Interest
                      </h2>
                      <p className="text-body text-mx-slate-500">
                        Secure your spot — we'll reach out once dates are confirmed.
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

                      <Select
                        label="Preferred Day"
                        name="preferred_day"
                        value={formData.preferred_day}
                        onChange={handleChange}
                        options={PREFERRED_DAY_OPTIONS}
                        placeholder="When suits you best?"
                        required
                      />

                      <Select
                        label="Bringing a Passenger?"
                        name="bringing_passenger"
                        value={formData.bringing_passenger}
                        onChange={handleChange}
                        options={PASSENGER_OPTIONS}
                        placeholder="Will you bring someone along?"
                        required
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
                        Register Your Interest
                      </Button>
                    </form>
                  </>
                )}
              </Card>
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
