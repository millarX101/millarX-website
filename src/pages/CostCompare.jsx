import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, ArrowDown, CheckCircle } from 'lucide-react'
import CostCompareCalculator from '../components/cost-compare/CostCompareCalculator'
import QuoteForm from '../components/calculator/QuoteForm'
import Button from '../components/ui/Button'
import BlurCircle from '../components/shared/BlurCircle'
import SEO, { createFAQSchema } from '../components/shared/SEO'
import { COMPANY } from '../lib/constants'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { scrollToElement } from '../lib/utils'

const costCompareFAQs = [
  {
    question: 'How do I compare novated lease quotes by total cost?',
    answer: 'Enter three numbers from each quote — the finance payment, the balloon/residual, and any management fees. Our tool calculates the total cost over the full lease term for each provider and ranks them from lowest to highest. No salary, tax, or employer details needed.',
  },
  {
    question: 'What is millarX mode and why does it use one fewer payment?',
    answer: 'Most novated lease providers defer payments for two months, meaning your first payment isn\'t taken until month three. millarX starts your payments at the beginning of month two — one month earlier — which means one fewer payment over the full lease term. Our comparison tool automatically adjusts for this so the comparison is fair.',
  },
  {
    question: 'Should I include running costs like tyres and servicing in the comparison?',
    answer: 'No — only enter the core finance payment shown on your quote. Running costs (tyres, servicing, insurance, fuel) are separate from the finance cost and vary between providers. This tool compares the fixed finance components only, which is the fairest way to compare the actual cost of the lease.',
  },
  {
    question: 'What does the balloon or residual value mean on a novated lease?',
    answer: 'The balloon (or residual) is the amount you owe at the end of the lease term. It\'s set by ATO guidelines based on the lease duration. At lease end, you can pay it out and keep the car, refinance it into a new lease, or trade the vehicle in. The balloon is a fixed cost that must be included in any total cost comparison.',
  },
]

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'millarX Novated Lease Quote Comparison Tool',
  description:
    'Compare up to 5 novated lease quotes side-by-side. See total costs, savings, and find the best deal.',
  url: 'https://millarx.com.au/cost-compare',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'AUD',
  },
  provider: {
    '@type': 'Organization',
    name: 'millarX',
    url: 'https://millarx.com.au',
  },
}

export default function CostCompare() {
  const [quoteFormOpen, setQuoteFormOpen] = useState(false)

  return (
    <>
      <SEO
        title="Compare Novated Lease Quotes"
        description="Compare up to 5 novated lease quotes side-by-side. See the true total cost, find the lowest option, and save thousands. Free tool from millarX."
        canonical="/cost-compare"
        structuredData={[webAppSchema, createFAQSchema(costCompareFAQs)]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <BlurCircle color="purple" size="xl" className="-top-40 -right-40" />
        <BlurCircle color="teal" size="lg" className="top-20 -left-32" />

        <div className="container-wide section-padding relative z-10">
          <motion.div className="max-w-3xl" {...fadeInUp}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-mx-purple-100 flex items-center justify-center">
                <Scale size={20} className="text-mx-purple-600" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-mx-purple-600">
                Cost Compare Tool
              </span>
            </div>

            <h1 className="font-serif text-display-lg text-mx-slate-900 mb-4">
              See exactly what you{' '}
              <span className="gradient-text">really pay.</span>
            </h1>
            <p className="text-body-lg text-mx-slate-500 max-w-xl mb-8">
              Enter the numbers from any novated lease quote. We cut through the noise and give you the true total cost — fixed components only, no smoke, no mirrors.
            </p>

            <button
              onClick={() => scrollToElement('calculator')}
              className="flex items-center gap-2 text-mx-purple-600 hover:text-mx-purple-700 font-medium text-sm transition-colors"
            >
              Start comparing
              <ArrowDown size={16} className="animate-bounce" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* How to use callout */}
      <section className="container-wide pb-8">
        <motion.div
          className="bg-mx-teal-50 border border-mx-teal-200 border-l-4 border-l-mx-teal-500 rounded-xl p-5 flex gap-4 items-start"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
          <div>
            <p className="font-bold text-mx-slate-800 text-sm mb-1">
              You don't need rates, salary figures, or employer details.
            </p>
            <p className="text-sm text-mx-slate-600 leading-relaxed">
              Just grab three numbers off any quote — the payment, the balloon, and the fees. That's it.
              This calculator compares what you actually hand over across the full term.{' '}
              <span className="font-semibold text-mx-slate-800">
                Lowest total cost wins. Every time, no exceptions.
              </span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="container-wide section-padding pt-0">
        <CostCompareCalculator />
      </section>

      {/* Methodology */}
      <section className="container-wide pb-12">
        <div className="border-t border-mx-slate-100 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-mx-slate-400 mb-3">
                How we calculate
              </h3>
              <div className="space-y-2 text-sm text-mx-slate-600 leading-relaxed">
                <p>
                  <span className="font-semibold text-mx-slate-700">Standard:</span>{' '}
                  (Payment × N) + Balloon + (Fee × N periods) — fee frequency matches payment frequency
                </p>
                <p>
                  <span className="font-semibold text-mx-slate-700">millarX:</span>{' '}
                  (Payment × N−1) + Balloon + Fees — arrears model, one fewer payment in the term
                </p>
                <p>
                  <span className="font-semibold text-mx-slate-700">Fortnightly:</span> N = term × 26/12 ·{' '}
                  <span className="font-semibold text-mx-slate-700">Weekly:</span> N = term × 52/12
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-mx-slate-400 mb-3">
                Want a deeper breakdown?
              </h3>
              <p className="text-sm text-mx-slate-600 mb-3 leading-relaxed">
                This tool is intentionally simple — total cost only. For a full picture including
                tax savings, salary packaging, and FBT calculations, check out these tools:
              </p>
              <div className="space-y-2">
                <a
                  href="https://novatedlease.guide/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 bg-mx-purple-50 border border-mx-purple-100 rounded-lg px-4 py-3 text-sm text-mx-slate-600 hover:border-mx-purple-300 transition-colors"
                >
                  <span className="text-xs mt-0.5">🔗</span>
                  <span>
                    <span className="font-semibold text-mx-purple-700">Novated Lease Guide</span> — independent modelling tool with detailed salary packaging scenarios
                  </span>
                </a>
                <a
                  href="https://leasecheck.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 bg-mx-purple-50 border border-mx-purple-100 rounded-lg px-4 py-3 text-sm text-mx-slate-600 hover:border-mx-purple-300 transition-colors"
                >
                  <span className="text-xs mt-0.5">🔗</span>
                  <span>
                    <span className="font-semibold text-mx-purple-700">LeaseCheck</span> — independent interest rate checker to see the rate embedded in your quote
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-b from-mx-purple-700 via-mx-purple-800 to-mx-slate-900 text-white">
        <div className="container-narrow mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-md font-serif mb-4">
              Now you've seen the numbers.{' '}
              <span className="text-mx-purple-300">Get the real deal.</span>
            </h2>
            <p className="text-body-lg text-purple-200 mb-8 max-w-xl mx-auto">
              Let us show you what a transparent lease actually looks like. No inflated fees, no hidden margins — just a clean quote you can trust.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {['Transparent pricing', 'No hidden fees', 'Arrears model — pay less'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={18} className="text-mx-teal-400 flex-shrink-0" />
                  <span className="text-purple-100">{item}</span>
                </div>
              ))}
            </div>

            <Button
              variant="teal"
              size="lg"
              onClick={() => setQuoteFormOpen(true)}
            >
              Get My millarX Quote →
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-wide section-padding pt-0">
        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <motion.h2
            className="font-serif text-display-sm text-mx-slate-900 mb-8"
            variants={staggerItem}
          >
            Frequently asked questions
          </motion.h2>

          <div className="space-y-6">
            {costCompareFAQs.map((faq) => (
              <motion.div
                key={faq.question}
                className="border-b border-mx-slate-100 pb-6"
                variants={staggerItem}
              >
                <h3 className="font-serif text-lg text-mx-slate-800 mb-2">{faq.question}</h3>
                <p className="text-sm text-mx-slate-500 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer Disclaimer */}
      <section className="py-6 bg-mx-slate-100">
        <div className="container-wide mx-auto">
          <p className="text-xs text-mx-slate-500 text-center leading-relaxed max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> This tool provides estimates only. It compares fixed finance components
            (payments, balloon and fees) and does not account for running costs, tax savings, salary packaging,
            FBT or other variable factors. Results do not constitute a quote, offer or recommendation. Actual
            costs may vary — confirm all figures with your lease provider before making any financial decisions.
            General information only — not financial, tax or legal advice. Seek independent professional advice
            before entering into a novated lease.
          </p>
          <p className="text-xs text-mx-slate-400 text-center mt-3">
            {COMPANY.legalName} (trading as {COMPANY.tradingName}) ABN {COMPANY.abn}. Australian Credit Licence {COMPANY.acl}.
          </p>
        </div>
      </section>

      {/* Quote Form Modal (reused from calculator) */}
      <QuoteForm
        isOpen={quoteFormOpen}
        onClose={() => setQuoteFormOpen(false)}
        calculationInputs={null}
        calculationResults={null}
        source="cost-compare"
      />
    </>
  )
}
