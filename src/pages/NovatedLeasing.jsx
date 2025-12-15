import { motion } from 'framer-motion'
import { ArrowDown, Search, DollarSign, Zap } from 'lucide-react'
import Calculator from '../components/calculator/Calculator'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import BlurCircle from '../components/shared/BlurCircle'
import SEO from '../components/shared/SEO'
import GoogleReviews from '../components/shared/GoogleReviews'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { scrollToElement } from '../lib/utils'

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
      description: 'No dealer kickbacks. We work for you, not the dealership.',
    },
    {
      icon: Zap,
      title: 'EV Specialists',
      description: 'FBT-exempt electric vehicle experts. Maximise your savings.',
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
      description: 'We handle the paperwork with your employer.',
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
        title="Novated Leasing Calculator"
        description="Calculate your novated lease savings instantly. Transparent pricing, no hidden fees. See exactly what you'll pay with our free novated lease calculator."
        canonical="/novated-leasing"
      />

      <div className="relative overflow-hidden">
        {/* Decorative elements */}
        <BlurCircle color="purple" size="xl" className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
        <BlurCircle color="teal" size="lg" className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />

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
      <section className="section-padding bg-gradient-to-br from-mx-purple-700 to-mx-purple-900 text-white">
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
