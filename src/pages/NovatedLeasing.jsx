import { motion } from 'framer-motion'
import { ArrowDown, Search, DollarSign, Zap } from 'lucide-react'
import Calculator from '../components/calculator/Calculator'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import BlurCircle from '../components/shared/BlurCircle'
import SEO, { createFAQSchema, localBusinessSchema } from '../components/shared/SEO'
import GoogleReviews from '../components/shared/GoogleReviews'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { scrollToElement } from '../lib/utils'

// FAQ data for both display and schema
const novatedLeasingFAQs = [
  {
    question: 'What is novated leasing and how does it work in Australia?',
    answer: 'A novated lease is a salary packaging arrangement where your employer deducts lease payments from your pre-tax salary, reducing your taxable income. You choose the car, millarX arranges the finance, and your employer makes the payments. At the end of the lease term, you can pay out the residual and keep the car, trade it in, or start a new lease.'
  },
  {
    question: 'How much can I save with a novated lease?',
    answer: 'Savings depend on your income tax bracket and whether you choose an FBT-exempt electric vehicle. Typically, employees save 20-40% compared to buying a car outright. Use our calculator above to see your exact potential savings based on your salary and vehicle choice.'
  },
  {
    question: 'Are electric vehicles (EVs) FBT exempt for novated leasing?',
    answer: 'Yes, eligible electric vehicles under $91,387 are exempt from Fringe Benefits Tax (FBT) until 2027. This means significantly larger tax savings compared to petrol or diesel vehicles. The FBT exemption makes EVs particularly attractive for novated leasing.'
  },
  {
    question: 'What costs are included in a novated lease?',
    answer: 'A novated lease can include the vehicle finance payments, registration, insurance, servicing, tyres, fuel or charging costs, and roadside assistance. All running costs are bundled into one regular payment deducted from your salary.'
  },
  {
    question: 'Do I need my employer\'s approval for a novated lease?',
    answer: 'Yes, your employer needs to agree to salary packaging. Most medium to large employers offer novated leasing as an employee benefit. We can help you check if your employer participates and guide you through the process.'
  }
]

export default function NovatedLeasing() {
  const valueProps = [
    {
      icon: Search,
      title: 'Full Transparency',
      description: 'Every cost shown upfront. No hidden fees or surprise charges.',
    },
    {
      icon: DollarSign,
      title: 'Fair Pricing',
      description: 'Through new technology, we keep more of the novated savings in your pocket.',
    },
    {
      icon: Zap,
      title: 'ICE or EV',
      description: 'Our technology helps you get the most from any novated lease, petrol or electric.',
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Calculate',
      description: 'Use our calculator to see your potential savings instantly.',
    },
    {
      step: 2,
      title: 'Review',
      description: 'See every cost upfront with our detailed breakdown.',
    },
    {
      step: 3,
      title: 'Apply',
      description: 'Our platform guides you through employer setup.',
    },
    {
      step: 4,
      title: 'Drive',
      description: 'Start saving from your very first pay.',
    },
  ]


  return (
    <>
      <SEO
        title="Free Novated Lease Calculator Australia 2025 | See Your Tax Savings"
        description="Free novated lease calculator for Australia. Calculate EV salary sacrifice savings instantly. FBT-exempt electric vehicles, transparent pricing, no hidden fees. See exactly what you'll save on your next car."
        canonical="/novated-leasing"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            createFAQSchema(novatedLeasingFAQs),
            {
              '@type': 'WebApplication',
              'name': 'millarX Novated Lease Calculator',
              'description': 'Free online calculator to estimate novated lease savings for Australian employees',
              'applicationCategory': 'FinanceApplication',
              'operatingSystem': 'Web',
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'AUD'
              }
            }
          ]
        }}
      />

      <div className="relative overflow-hidden">
        {/* Decorative elements - purple to pink gradient effect */}
        <BlurCircle color="purple" size="xl" className="top-0 right-0 translate-x-1/3 -translate-y-1/3" />
        <BlurCircle color="pink" size="lg" className="top-20 right-20" />
        <BlurCircle color="magenta" size="md" className="top-40 left-10" />
        <BlurCircle color="pink" size="lg" className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <BlurCircle color="purple" size="md" className="bottom-20 right-10" />

        {/* Hero Section */}
      <section className="section-padding relative">
        <div className="container-wide mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-3xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-display-lg md:text-display-xl font-serif text-mx-slate-900 mb-6"
            >
              Novated Leasing,{' '}
              <span className="gradient-text">Without the Hidden Costs</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-body-lg text-mx-slate-600 mb-8 max-w-2xl mx-auto"
            >
              See exactly what you'll pay. No inflated fees. No sales pressure.
              Just transparent numbers that help you make the right decision.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                icon={<ArrowDown size={20} />}
                iconPosition="right"
                onClick={() => scrollToElement('calculator')}
              >
                Calculate Your Savings
              </Button>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="section-padding bg-white">
        <div className="container-wide mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {valueProps.map((prop, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card hover className="h-full text-center">
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

      {/* Calculator Section */}
      <section id="calculator" className="section-padding bg-mx-ivory">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-display-md md:text-display-lg font-serif text-mx-slate-900 mb-4">
              Calculate Your Savings
            </h2>
            <p className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto">
              See how much you could save with a novated lease.
              Results update instantly as you adjust the values.
            </p>
          </motion.div>

          <Calculator source="novated-leasing-page" />
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
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
            <p className="text-body-lg text-mx-slate-600">
              Four simple steps to start saving
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {howItWorks.map((item, index) => (
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
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-mx-slate-200" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="section-padding bg-mx-slate-900 text-white">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-display-md font-serif mb-4">
              What Our Customers Say
            </h2>
          </motion.div>

          <GoogleReviews autoScroll={true} scrollInterval={5000} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-mx-purple-900 via-mx-purple-700 to-mx-pink-600 text-white">
        <div className="container-narrow mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-md font-serif mb-4">
              Ready to See Your Real Savings?
            </h2>
            <p className="text-body-lg text-mx-purple-100 mb-8">
              Get a formal quote tailored to your situation, or analyse a competitor's quote to see if it's a good deal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-mx-purple-700"
                onClick={() => scrollToElement('calculator')}
              >
                Get a Formal Quote
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                as="a"
                href="/lease-analysis"
              >
                Analyse a Competitor Quote
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  )
}
