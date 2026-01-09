import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle,
  Users,
  Zap,
  ArrowRight,
  Download,
  Shield,
  Clock,
  LayoutDashboard,
  UserPlus,
  UserMinus,
  FileText,
  BarChart3,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import BlurCircle from '../components/shared/BlurCircle'
import SEO, { localBusinessSchema } from '../components/shared/SEO'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'

export default function Partner() {
  const zeroCostBenefits = [
    {
      icon: Zap,
      title: 'No Setup Fees',
      description: 'Getting started costs you absolutely nothing. No implementation fees, no onboarding charges.',
    },
    {
      icon: Shield,
      title: 'No Ongoing Costs',
      description: 'Our revenue comes from finance margins, not employer fees. You never pay us a cent.',
    },
    {
      icon: Clock,
      title: 'No Admin Burden',
      description: 'We handle all the complexity. You just process payroll deductions like any other benefit.',
    },
  ]

  const portalFeatures = [
    {
      icon: UserPlus,
      title: 'Welcome New Staff',
      description: 'Send branded novated leasing communications to new employees with a few clicks. Make onboarding seamless.',
    },
    {
      icon: Users,
      title: 'Existing Lease Onboarding',
      description: 'Help staff who already have a novated lease with another provider transfer smoothly into your program.',
    },
    {
      icon: UserMinus,
      title: 'Cessation Support',
      description: 'Manage end-of-employment processes with guided steps for you and your departing employee. No guesswork.',
    },
    {
      icon: BarChart3,
      title: 'Engagement Dashboard',
      description: 'See at a glance how many staff are using the benefit and track program activity across your organisation.',
    },
    {
      icon: BookOpen,
      title: 'User Guides & Resources',
      description: 'Access help documents, FAQs, and step-by-step guides whenever you need them. No waiting for callbacks.',
    },
    {
      icon: Sparkles,
      title: 'Continuous Improvements',
      description: 'We\'re constantly adding new features. Your portal gets better over time at no extra cost.',
    },
  ]

  const selfServePoints = [
    {
      title: 'No Consultant Calls Required',
      description: 'Need information? Just log in. Everything you need is available 24/7 without waiting for anyone.',
    },
    {
      title: 'Instant Access to Documentation',
      description: 'Payroll schedules, novation agreements, employee details — all accessible when you need them.',
    },
    {
      title: 'Real-Time Updates',
      description: 'See the status of every lease, every employee, every deduction. No chasing for updates.',
    },
    {
      title: 'Simple Payroll Integration',
      description: 'Clear deduction schedules that slot straight into your existing payroll process.',
    },
  ]

  const adminDetails = [
    {
      title: 'Payroll Processing',
      items: [
        'Clear pre-tax and post-tax deduction schedules',
        'Automated notifications when changes occur',
        'Support for all pay frequencies (weekly, fortnightly, monthly)',
      ],
    },
    {
      title: 'Documentation',
      items: [
        'All employer agreements handled digitally',
        'Novation documentation prepared for your signature',
        'Audit trail for compliance purposes',
        'Secure document storage and retrieval',
      ],
    },
    {
      title: 'Employee Management',
      items: [
        'Track active leases across your organisation',
        'Manage starters, leavers, and changes easily',
        'Employee self-service reduces HR queries',
        'Branded communications for your team',
      ],
    },
  ]

  return (
    <>
      <SEO
        title="Partner With millarX | Zero-Cost Employer Novated Leasing Portal"
        description="Offer novated leasing at zero cost with our self-service employer portal. Manage leases, onboard staff, and track engagement without waiting for consultants. Partner with millarX today."
        canonical="/partner"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            {
              '@type': 'Service',
              'name': 'Employer Novated Leasing Partnership',
              'description': 'Zero-cost novated leasing benefit program with self-service employer portal',
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
        <BlurCircle color="teal" size="lg" className="bottom-1/3 left-0 -translate-x-1/2" />

        {/* Hero Section */}
        <section className="section-padding relative">
          <div className="container-wide mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="max-w-4xl mx-auto text-center"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-display-lg md:text-display-xl font-serif text-mx-slate-900 mb-6"
              >
                Partner With Us:{' '}
                <span className="gradient-text">Zero Cost, Zero Hassle</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-body-lg text-mx-slate-600 mb-8 max-w-2xl mx-auto"
              >
                Offer novated leasing as a genuine employee benefit without the admin headaches.
                Our self-service philosophy means you get the information you need, when you need it —
                no waiting for consultants.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/employers">
                  <Button size="lg" icon={<ArrowRight size={20} />} iconPosition="right">
                    Get Started
                  </Button>
                </Link>
                <a href="/downloads/MillarX-SME-Employer-Guide.html" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="secondary" icon={<Download size={20} />}>
                    Download Info Pack
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Zero Cost Section */}
        <section className="section-padding bg-white">
          <div className="container-wide mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
                Genuinely Zero Cost to Employers
              </h2>
              <p className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto">
                We mean it. No setup fees, no monthly charges, no hidden costs.
                Our revenue comes from finance, not from charging employers.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {zeroCostBenefits.map((benefit, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card hover className="h-full text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-teal-100 flex items-center justify-center">
                      <benefit.icon className="text-teal-600" size={28} />
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

        {/* Employer Portal Section */}
        <section className="section-padding bg-gradient-to-br from-mx-purple-50 to-mx-pink-50">
          <div className="container-wide mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mx-purple-100 text-mx-purple-700 text-body-sm font-semibold mb-4">
                <LayoutDashboard size={18} />
                Your Employer Portal
              </div>
              <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
                Everything You Need, All in One Place
              </h2>
              <p className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto">
                Manage your entire novated leasing program from a single dashboard.
                Onboard new staff, handle leavers, track engagement — all without picking up the phone.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {portalFeatures.map((feature, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card hover className="h-full">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-mx-purple-100 flex items-center justify-center">
                      <feature.icon className="text-mx-purple-600" size={24} />
                    </div>
                    <h3 className="text-body-lg font-semibold text-mx-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-body text-mx-slate-600">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Self-Serve Philosophy */}
        <section className="section-padding bg-white">
          <div className="container-wide mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
                  Self-Service Philosophy:{' '}
                  <span className="gradient-text">Log In, Get Answers</span>
                </h2>
                <p className="text-body-lg text-mx-slate-600 mb-8">
                  Traditional providers make you wait. Need a report? Call your account manager.
                  Need documentation? Submit a request. Need an update? Good luck.
                </p>
                <p className="text-body-lg text-mx-slate-600 mb-8">
                  We do things differently. Our self-serve philosophy extends from employees
                  all the way to employer management. <strong>Just log in and it's all there.</strong>
                </p>

                <div className="space-y-4">
                  {selfServePoints.map((point, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle className="text-teal-500 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-mx-slate-900">{point.title}</p>
                        <p className="text-body-sm text-mx-slate-600">{point.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="bg-mx-slate-900 text-white">
                  <div className="p-6">
                    <h3 className="text-display-sm font-serif mb-6">No More Waiting For...</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                        <span className="text-red-400 line-through">Consultant callbacks</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                        <span className="text-red-400 line-through">Email requests for documents</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                        <span className="text-red-400 line-through">Status update meetings</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                        <span className="text-red-400 line-through">Manual deduction calculations</span>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <p className="text-teal-400 font-semibold text-lg">
                        Everything is in your portal, available 24/7
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Admin Details */}
        <section className="section-padding bg-mx-slate-50">
          <div className="container-wide mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
                The "Boring" Admin Stuff — Sorted
              </h2>
              <p className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto">
                We know the admin side isn't exciting. That's exactly why we've made it as simple as possible.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {adminDetails.map((section, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="text-mx-purple-600" size={24} />
                      <h3 className="text-body-lg font-semibold text-mx-slate-900">
                        {section.title}
                      </h3>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-body-sm text-mx-slate-600">
                          <CheckCircle className="text-teal-500 flex-shrink-0 mt-0.5" size={16} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Simple Summary */}
        <section className="section-padding bg-white">
          <div className="container-narrow mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-mx-purple-100 to-mx-pink-100 border-2 border-mx-purple-200">
                <div className="text-center p-4">
                  <h3 className="text-display-sm font-serif text-mx-slate-900 mb-4">
                    The Bottom Line for Employers
                  </h3>
                  <p className="text-body-lg text-mx-slate-700 mb-6">
                    If you can <strong>set up a payroll deduction</strong> and <strong>pay an invoice</strong>,
                    you already have everything you need to run a successful novated leasing program with millarX.
                  </p>
                  <p className="text-body text-mx-slate-600">
                    We handle the specialist pieces — finance, compliance, documentation, employee support.
                    You get happy employees with minimal extra effort — just payroll deductions and GST claims.
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-gradient-to-br from-mx-purple-900 via-mx-purple-700 to-mx-pink-600 text-white">
          <div className="container-narrow mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display-md font-serif mb-4">
                Ready to Sign Up?
              </h2>
              <p className="text-body-lg text-mx-purple-100 mb-8">
                Getting started is simple. Email us and we'll send you a secure onboarding link
                to set up your employer account in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:ben@millarx.com.au?subject=Employer%20Sign%20Up%20Request&body=Hi%20Ben%2C%0A%0AWe're%20interested%20in%20setting%20up%20novated%20leasing%20for%20our%20employees.%0A%0ACompany%20Name%3A%20%0AContact%20Name%3A%20%0AApprox%20Employee%20Count%3A%20%0A%0AThanks!">
                  <Button
                    size="lg"
                    className="bg-white text-mx-purple-700 hover:bg-mx-purple-50"
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                  >
                    Email to Get Started
                  </Button>
                </a>
                <a href="/downloads/MillarX-SME-Employer-Guide.html" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="border-white/50 text-white hover:bg-white/10"
                    icon={<Download size={20} />}
                  >
                    Download Info Pack
                  </Button>
                </a>
              </div>
              <p className="text-body text-mx-purple-200 mt-6">
                Prefer to chat? Call{' '}
                <a
                  href="tel:0492886857"
                  className="underline hover:no-underline"
                >
                  0492 886 857
                </a>
                {' '}or fill out the{' '}
                <Link
                  to="/employers"
                  className="underline hover:no-underline"
                >
                  contact form
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
