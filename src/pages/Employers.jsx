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
import BlurCircle from '../components/shared/BlurCircle'
import SEO from '../components/shared/SEO'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'

export default function Employers() {
  const benefits = [
    {
      icon: Zap,
      title: 'Zero Cost to You',
      description: 'No setup fees, no ongoing costs. We make our money from the finance, not from you.',
    },
    {
      icon: Users,
      title: 'Self-Service Platform',
      description: 'Less admin for your payroll team. Employees can see everything themselves.',
    },
    {
      icon: Heart,
      title: 'Happy Employees',
      description: 'No complaints about hidden fees or pushy sales. Transparent pricing everyone appreciates.',
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
      description: 'Quick employer agreement takes about 10 minutes.',
    },
    {
      step: 2,
      title: 'Share Link',
      description: 'Give employees the calculator link to explore options.',
    },
    {
      step: 3,
      title: 'We Handle It',
      description: 'Quotes, finance, deductions — all automated.',
    },
  ]

  return (
    <>
      <SEO
        title="Novated Leasing for Employers"
        description="Offer your employees transparent novated leasing at zero cost to your business. Self-service platform, minimal admin, no hidden fees."
        canonical="/employers"
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
                <h3 className="text-display-sm font-serif text-mx-slate-900 mb-6">
                  Get in Touch
                </h3>
                <form className="space-y-5">
                  <Input
                    label="Company Name"
                    name="companyName"
                    placeholder="Company Pty Ltd"
                  />
                  <Input
                    label="Your Name"
                    name="contactName"
                    placeholder="Jane Smith"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="jane@company.com"
                  />
                  <Input
                    label="Phone (optional)"
                    name="phone"
                    type="tel"
                    placeholder="0400 000 000"
                  />
                  <Select
                    label="Number of Employees"
                    name="employeeCount"
                    options={[
                      { value: '', label: 'Select...' },
                      { value: '1-50', label: '1-50' },
                      { value: '51-200', label: '51-200' },
                      { value: '201-500', label: '201-500' },
                      { value: '500+', label: '500+' },
                    ]}
                  />
                  <Button type="submit" variant="primary" fullWidth>
                    Submit Inquiry
                  </Button>
                </form>
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
              "We switched from SG Fleet and the difference was immediate.
              Our HR team spends 80% less time on novated lease queries
              because employees can see everything themselves."
            </blockquote>
            <p className="text-body text-mx-slate-400">
              — HR Manager, 200-person tech company
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
              <Button
                size="lg"
                className="bg-white text-mx-purple-700 hover:bg-mx-purple-50"
              >
                Schedule a Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                icon={<Download size={18} />}
              >
                Download Employer Guide
              </Button>
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
