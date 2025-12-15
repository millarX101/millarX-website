import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Eye, ThumbsUp, ExternalLink, Wrench, Calculator as CalcIcon } from 'lucide-react'
import Calculator from '../components/calculator/Calculator'
import BYOCalculator from '../components/calculator/BYOCalculator'
import Card from '../components/ui/Card'
import { Accordion, AccordionItem } from '../components/ui/Accordion'
import SEO from '../components/shared/SEO'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { getMediaUrl, MEDIA } from '../lib/supabase'

export default function RedditExclusive() {
  const valueProps = [
    {
      icon: Shield,
      title: 'No Referral Kickbacks',
      description: "We don't pay dealers to push you to us. Our job is to give you the best deal, not prop up dealer margins.",
    },
    {
      icon: Eye,
      title: 'See the Real Finance Rate',
      description: "Most providers hide it. We show it upfront. Know exactly what you're paying for financing.",
    },
    {
      icon: ThumbsUp,
      title: 'AusFinance Approved',
      description: "Built to answer the questions you're actually asking. No corporate speak, just real numbers.",
    },
  ]

  const faqs = [
    {
      question: 'Is novated leasing actually worth it or just a scam?',
      answer: `It depends on your situation, but let me be straight with you:

**It's worth it if:**
- You're on a marginal tax rate of 32.5% or higher (income above $45k)
- You need a car anyway and plan to keep it
- Your employer offers salary packaging
- You want to include running costs in pre-tax dollars

**It might not be worth it if:**
- You're on a low marginal tax rate
- You change cars frequently
- You drive very low kilometres
- You have access to a company car

The math is simple: you're paying for the car with pre-tax dollars instead of post-tax. For someone on the 37% marginal rate, that's significant savings. Use the calculator above to see your specific numbers.`,
    },
    {
      question: "What's the catch with FBT exemption on EVs?",
      answer: `No catch, but here's what to watch for:

**The good:**
- EVs under $91,387 are FBT exempt (meaning even more tax savings)
- No employee contribution required like with ICE vehicles
- The savings compound because you're not paying the 20% post-tax contribution

**What to know:**
- You'll still have Reportable Fringe Benefits Tax (RFBT) on your payment summary
- This doesn't mean you pay extra tax, but it affects income-tested benefits like HECS/HELP, child support, and Family Tax Benefits
- The $91,387 threshold is the "luxury car tax threshold for fuel-efficient vehicles" - it updates annually

The calculator above shows your RFBT amount and adjusted reportable income so you can plan accordingly.`,
    },
    {
      question: 'Why do all the quotes I get have different rates?',
      answer: `Because most providers hide margins in various places. Here's where they hide them:

**Common hiding spots:**
1. **Finance rate** - They might quote 7% but actually charge 9% (the extra goes in their pocket)
2. **Admin fees** - $10-20/month "account keeping" fees add up to $720+ over a lease
3. **Insurance padding** - Inflated insurance quotes with embedded commissions
4. **Tyre/service budgets** - Excessive estimates that create a surplus they keep
5. **Residual manipulation** - Setting residual below ATO minimum to increase payments

**How to compare:**
1. Get the actual finance rate (not "comparison rate" or "effective rate")
2. Ask for itemized running costs
3. Check residual is at or above ATO minimum for your term
4. Look for hidden monthly fees in the fine print

We show you everything upfront. No hidden fees, no inflated margins.`,
    },
    {
      question: 'Should I novate a new or used car?',
      answer: `Generally new, but used can work. Here's why:

**New car advantages:**
- GST credit applies (finance company claims ~$5,763 GST, reducing your payments)
- Full manufacturer warranty
- No unknown history
- Better finance rates typically available

**Used car considerations:**
- Must be from a GST-registered dealer to claim GST credit
- Private sale = no GST benefit (significantly impacts the math)
- Check remaining warranty
- Get a pre-purchase inspection

**The GST trap:**
Many people don't realise that a $30k used car from a private seller loses you ~$2,700 in GST benefits. That $30k "bargain" might cost you more than a $32k car from a dealer.

The calculator assumes GST-claimable (dealer purchase). If buying private, your actual costs will be higher.`,
    },
    {
      question: 'What happens at the end of the lease?',
      answer: `You have three options:

**1. Pay the residual and keep the car**
- Most common choice
- You own the car outright
- Residual is set at lease start (ATO minimum percentages)
- For a 5-year lease, residual is ~28% of original value

**2. Sell the car**
- If car is worth more than residual = profit in your pocket
- If worth less = you pay the difference
- Market conditions at lease end determine outcome

**3. Trade in and start a new lease**
- Dealer pays out residual
- Equity goes toward new lease
- Continuous salary packaging benefits

**Important:** The residual is locked in at lease start. It doesn't change based on market conditions. That's why EVs can be attractive - residuals are based on original price, but some EVs are holding value better than expected.`,
    },
  ]

  return (
    <>
      <SEO
        title="Reddit Exclusive - Transparent Novated Leasing"
        description="No sales BS. No kickbacks. Just a transparent novated lease calculator built by someone who got sick of the industry's hidden fees. r/AusFinance approved."
        canonical="/redditnl"
      />

      <div className="min-h-screen bg-mx-ivory">
        {/* Minimal Header */}
      <header className="py-6 px-4 md:px-6">
        <div className="container-wide mx-auto">
          <Link to="/" className="inline-block">
            <img
              src={getMediaUrl(MEDIA.logo)}
              alt="millarX"
              className="h-8 md:h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-12 md:py-16">
        <div className="container-narrow mx-auto text-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.p variants={fadeInUp} className="text-4xl mb-4">
              Hey Reddit
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-display-lg md:text-display-xl font-serif text-mx-slate-900 mb-6"
            >
              You Found the Secret Page
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto"
            >
              No sales BS. No kickbacks. Just a transparent novated lease
              calculator built by someone who got sick of the industry's hidden
              fees.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-4 py-12 bg-white">
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

      {/* Community Resources */}
      <section className="px-4 py-12 bg-mx-slate-50">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-display-sm font-serif text-mx-slate-900 mb-4">
              Community Resources
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <ExternalLink className="text-orange-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-mx-slate-900 mb-2">
                    AusFinance Deep Dive on Novated Leasing
                  </h3>
                  <p className="text-body text-mx-slate-600 mb-3">
                    AusFinance OG <strong>u/Changyanf1230</strong> takes a deep dive into novated leasing,
                    considering a lot of variables. Good if you love the nitty gritty.
                  </p>
                  <a
                    href="https://www.reddit.com/r/AusFinance/comments/1c5b9xx/ev_and_ice_novated_lease_calculator/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-mx-purple-600 hover:text-mx-purple-700 font-semibold transition-colors"
                  >
                    Read the post on r/AusFinance
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Standard Calculator */}
      <section id="calculator" className="px-4 py-16 bg-mx-ivory">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-mx-purple-100 flex items-center justify-center">
                <CalcIcon className="text-mx-purple-600" size={24} />
              </div>
              <h2 className="text-display-md font-serif text-mx-slate-900">
                Novated Lease Calculator
              </h2>
            </div>
            <p className="text-body-lg text-mx-slate-600 max-w-2xl mx-auto">
              See your real savings with our transparent calculator. No hidden fees, no inflated estimates.
            </p>
          </motion.div>

          <Calculator source="reddit-page" />
        </div>
      </section>

      {/* BYO Finance Calculator */}
      <section id="byo-calculator" className="px-4 py-16 bg-white">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
              BYO Finance Comparison Calculator
            </h2>
            <p className="text-body-lg text-mx-slate-600 max-w-3xl mx-auto mb-6">
              Compare your existing novated lease quote against our BYO finance solution.
              All variables are adjustable - because Reddit users want the details.
            </p>

            {/* How BYO Works */}
            <div className="max-w-3xl mx-auto text-left">
              <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
                    <Wrench className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-mx-slate-900">How BYO Finance Works</h3>
                </div>
                <ol className="space-y-3 text-body text-mx-slate-700">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">1</span>
                    <span><strong>Get a millarX finance approval</strong> at our fixed rates.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">2</span>
                    <span><strong>Ask your salary-packaging provider</strong> to set up a self-managed novated lease (you supply the finance approval; they handle payroll deductions and reimbursements).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white text-sm font-bold flex items-center justify-center">3</span>
                    <span><strong>Novation & settlement</strong> — we coordinate the novation deed and payout; you start deductions from your next pay cycle.</span>
                  </li>
                </ol>
                <p className="mt-4 text-body-sm text-mx-slate-600 bg-white/50 p-3 rounded-lg">
                  <strong>Tip:</strong> This is about finance only. Your provider still administers payroll and reimbursements.
                </p>
              </Card>
            </div>
          </motion.div>

          <BYOCalculator />
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 bg-white">
        <div className="container-narrow mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
              The Questions You're Actually Asking
            </h2>
            <p className="text-body text-mx-slate-600">
              From r/AusFinance, r/AustralianEV, and r/novatedlease
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion allowMultiple>
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  title={faq.question}
                >
                  <div className="prose prose-slate max-w-none whitespace-pre-line">
                    {faq.answer}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 bg-mx-slate-900 text-white">
        <div className="container-narrow mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-body-lg text-mx-slate-300 mb-4">
              Questions? DM me on Reddit or email:
            </p>
            <a
              href="mailto:ben@millarx.com.au"
              className="text-display-sm font-serif text-white hover:text-mx-purple-300 transition-colors"
            >
              ben@millarx.com.au
            </a>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 px-8 py-4 text-body-lg bg-white text-mx-slate-900 hover:bg-mx-slate-100 shadow-md hover:shadow-lg"
              >
                Get a Quote
              </a>
              <a
                href="/lease-analysis"
                className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 px-8 py-4 text-body-lg bg-transparent border-2 border-white text-white hover:bg-white/10"
              >
                Analyse a Competitor Quote
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 px-4 text-center bg-mx-slate-800">
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
