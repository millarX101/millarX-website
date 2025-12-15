import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Shield, Eye, Heart, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import BlurCircle from '../components/shared/BlurCircle'
import SEO, { localBusinessSchema } from '../components/shared/SEO'
import { staggerContainer, staggerItem, fadeInUp } from '../lib/animations'

export default function AboutUs() {
  const techBenefits = [
    {
      icon: Zap,
      title: 'Self-Guided Platform',
      description: 'No leasing consultants, no sales calls. Our digital platform puts you in control of your entire leasing journey.',
    },
    {
      icon: TrendingUp,
      title: 'Zero Fee Creep',
      description: 'We don\'t add anything to your lease that isn\'t necessary. No hidden fees, no undisclosed interest rate margins.',
    },
    {
      icon: Eye,
      title: 'Real-Time Transparency',
      description: 'See every cost, every calculation, instantly. Our technology replaces opaque spreadsheets with clarity.',
    },
  ]

  const values = [
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Know exactly what you\'re paying. Every fee, every cost, completely visible.',
    },
    {
      icon: Heart,
      title: 'Fairness',
      description: 'Savings belong in your pocket, not hidden in complex fee structures.',
    },
    {
      icon: Zap,
      title: 'Simplicity',
      description: 'We take something complex and make it simple to understand and manage.',
    },
    {
      icon: Shield,
      title: 'Trust',
      description: '25+ years of experience in financial services, now working for you.',
    },
  ]

  return (
    <>
      <SEO
        title="About millarX | Tech-First Novated Leasing Platform Australia"
        description="We're a tech company disrupting novated leasing. Self-guided platform, zero fee creep, no undisclosed rates. Guide your own leasing journey without consultants or sales pressure."
        canonical="/about"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            {
              '@type': 'AboutPage',
              'name': 'About millarX',
              'description': 'Tech-first novated leasing platform disrupting the traditional consultant-heavy model'
            }
          ]
        }}
      />

      <div className="bg-white">
        {/* Hero Section */}
        <section className="section-padding relative overflow-hidden">
          <BlurCircle color="purple" size="lg" className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
          <BlurCircle color="teal" size="md" className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />

          <div className="container-wide mx-auto text-center relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-display-lg md:text-display-xl font-serif text-mx-slate-900 mb-6"
              >
                Disrupting Novated Leasing,{' '}
                <span className="gradient-text">One Fair Deal at a Time</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-body-lg text-mx-slate-600 mb-8 max-w-3xl mx-auto"
              >
                We're using technology to transform an industry that's been stuck in the past.
                Our mission is simple: transparency, fairness, and savings that stay where they belong — in your pocket.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="section-padding bg-mx-slate-50">
          <div className="container-wide mx-auto">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-md font-serif text-mx-slate-900 mb-6 text-center">
                  25+ Years Watching an Industry <span className="gradient-text">Stand Still</span>
                </h2>

                <div className="space-y-6 text-body-lg text-mx-slate-600">
                  <p>
                    With over 25 years in the financial services industry, we've witnessed transformative changes across most lending sectors.
                    Technology has revolutionised how Australians access mortgages, personal loans, and business finance.
                  </p>

                  <p>
                    Yet novated leasing? <strong className="text-mx-slate-800">It remains stuck in the past.</strong>
                  </p>

                  <p>
                    The traditional model relies heavily on manpower — armies of leasing consultants, salespeople,
                    and administrators. Complex fee structures, hidden margins, and opaque pricing that makes it
                    nearly impossible to know if you're getting a fair deal. An industry that profits from
                    confusion rather than clarity.
                  </p>

                  <p className="text-mx-purple-700 font-semibold">
                    millarX was built to change this.
                  </p>

                  <p>
                    We're a tech company, not a leasing consultancy. We don't add anything to your lease that
                    isn't necessary. Avoid the fee creep and high undisclosed interest rates by letting our
                    platform guide your own leasing journey — on your terms, at your pace.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="section-padding">
          <div className="container-wide mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
                Tech-First, <span className="gradient-text">Human-Optional</span>
              </h2>
              <p className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto">
                Traditional providers rely on armies of consultants. We built software that lets you drive your own journey — no sales calls, no pressure, just tools that work.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {techBenefits.map((benefit, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="h-full text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-mx-purple-100 flex items-center justify-center">
                      <benefit.icon className="w-7 h-7 text-mx-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-mx-slate-800 mb-3">
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

        {/* Transparency Section */}
        <section className="section-padding bg-mx-slate-50">
          <div className="container-wide mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-md font-serif text-mx-slate-900 mb-6">
                  Your Money, <span className="gradient-text">Your Choices</span>
                </h2>

                <p className="text-xl text-mx-purple-700 font-semibold mb-6">
                  "It's not our money. We simply manage the process."
                </p>

                <div className="space-y-4 text-body-lg text-mx-slate-600">
                  <p>
                    This philosophy drives everything we do. We let employees choose their own budgets for running costs,
                    insurance, and servicing — because they know their needs better than anyone.
                  </p>
                  <p>
                    We don't force expensive add-ons. We don't hide fees in fine print.
                    We simply make the whole process simple to understand and manage.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white">
                  <h3 className="text-lg font-semibold text-mx-slate-800 mb-4">
                    What this means for you:
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Choose your own running cost budgets',
                      'Clear breakdown of every cost',
                      'No hidden fees or surprises',
                      'Simple, transparent management',
                      'Real savings, not inflated estimates',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span className="text-mx-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding">
          <div className="container-wide mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
                What We Stand For
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((value, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="h-full text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-mx-slate-800 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-body-sm text-mx-slate-600">
                      {value.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-br from-mx-purple-700 to-mx-purple-900 text-white">
          <div className="container-narrow mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display-md font-serif mb-4">
                Ready to Experience the Difference?
              </h2>
              <p className="text-body-lg text-mx-purple-100 mb-8">
                See what transparent novated leasing looks like. Get a quote in minutes, not days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/novated-leasing">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-mx-purple-700"
                  >
                    Get a Quote
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
