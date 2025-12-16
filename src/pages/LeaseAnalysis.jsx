import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Shield,
  TrendingUp,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { RatingBadge } from '../components/ui/Badge'
import BlurCircle from '../components/shared/BlurCircle'
import SEO, { createFAQSchema, localBusinessSchema } from '../components/shared/SEO'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { formatCurrency } from '../lib/utils'
import { analyzeLeaseQuote } from '../lib/leaseAnalysis'
import { saveAnalysisData } from '../lib/supabase'

// Term-based rate thresholds
// Shorter terms have higher rates because fixed costs spread over fewer months
const getRateThresholds = (leaseTerm) => {
  const term = parseInt(leaseTerm) || 3
  if (term >= 5) {
    // 5 year terms - lower rates expected
    return { competitive: 8, elevated: 9.5, high: 11, veryHigh: 13 }
  } else if (term >= 4) {
    // 4 year terms
    return { competitive: 8.5, elevated: 10, high: 11.5, veryHigh: 13.5 }
  } else {
    // 1-3 year terms - higher rates acceptable
    return { competitive: 10, elevated: 11.5, high: 13, veryHigh: 15 }
  }
}

// Get rate assessment based on term-adjusted thresholds
const getRateAssessment = (effectiveRate, leaseTerm) => {
  const thresholds = getRateThresholds(leaseTerm)

  if (effectiveRate > thresholds.veryHigh) {
    return { level: 'veryHigh', label: '🚨 Very High Risk', description: 'Significantly above market', textClass: 'text-red-600', bgClass: 'bg-red-50 border-2 border-red-200' }
  } else if (effectiveRate > thresholds.high) {
    return { level: 'high', label: '⚠️ High Risk', description: 'Well above typical range', textClass: 'text-red-500', bgClass: 'bg-red-50 border-2 border-red-200' }
  } else if (effectiveRate > thresholds.elevated) {
    return { level: 'elevated', label: '⚡ Elevated', description: 'Above typical range', textClass: 'text-amber-600', bgClass: 'bg-amber-50 border-2 border-amber-200' }
  } else if (effectiveRate > thresholds.competitive) {
    return { level: 'ok', label: '✓ Acceptable', description: 'Within market range', textClass: 'text-teal-600', bgClass: 'bg-teal-50 border-2 border-teal-200' }
  } else {
    return { level: 'good', label: '✓ Competitive', description: 'Good rate for this term', textClass: 'text-teal-600', bgClass: 'bg-teal-50 border-2 border-teal-200' }
  }
}

// FAQ data for schema
const leaseAnalysisFAQs = [
  {
    question: 'How do I know if my novated lease quote is a good deal?',
    answer: 'Look at the effective interest rate, not just the advertised rate. A competitive rate in 2025 is 7-8.5%. If the calculated rate seems high, your quote may include hidden fees, bundled insurance, or inflated admin costs. Our free analyser tool reverse-engineers your quote to show the true rate.'
  },
  {
    question: 'What hidden fees should I look for in a novated lease quote?',
    answer: 'Common hidden fees include: inflated insurance premiums (gap cover, comprehensive), excessive admin fees ($10-20/month), bundled extended warranties, tyre and service budget surpluses that the provider keeps, and finance rate margins above market rates.'
  },
  {
    question: 'Can I compare novated lease quotes from different providers?',
    answer: 'Yes! Our Lease Analysis tool helps you compare quotes objectively. Enter the key details (FBT value, payment amount, balloon/residual, term) and we\'ll calculate the effective rate and flag any potential issues to help you negotiate or choose the best provider.'
  }
]

export default function LeaseAnalysis() {
  const [formData, setFormData] = useState({
    providerName: '',
    vehicleDescription: '',
    fbtValue: '',
    residualValue: '',
    financePayment: '',
    paymentFrequency: 'monthly',
    leaseTerm: '3',
    vehicleType: 'ev',
    balloonIncludesGST: false,
    shownRate: '',
    state: 'VIC',
  })

  const [results, setResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const analyzeQuote = async (e) => {
    e.preventDefault()
    setIsAnalyzing(true)

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    const fbtValue = parseFloat(formData.fbtValue) || 0
    const residualValue = parseFloat(formData.residualValue) || 0
    const financePayment = parseFloat(formData.financePayment) || 0
    const leaseTerm = parseInt(formData.leaseTerm) || 3
    const shownRate = parseFloat(formData.shownRate) || 0

    // Use the proper IRR-based analysis
    // Provider name is passed to determine correct payment timing
    // (millarX uses 1 month arrears, others use 2 months deferred)
    const analysis = analyzeLeaseQuote({
      fbtValue,
      financePayment,
      paymentFrequency: formData.paymentFrequency,
      residualValue,
      balloonIncludesGST: formData.balloonIncludesGST,
      leaseTerm,
      shownRate,
      providerName: formData.providerName,
      state: formData.state,
    })

    // Calculate potential savings (difference from market rate)
    const marketRate = 7.5
    const rateDiff = Math.max(0, analysis.effectiveRate - marketRate)
    const potentialSavings =
      analysis.issues.reduce((sum, issue) => sum + (issue.estimatedCost || 0), 0) +
      (rateDiff > 1 ? (rateDiff / 100) * analysis.amountFinanced * leaseTerm : 0)

    setResults({
      ...analysis,
      potentialSavings,
      comparison: {
        theirRate: analysis.effectiveRate,
        millarxRate: marketRate,
      },
    })

    // Save anonymous data for provider intelligence (no email required)
    saveAnalysisData({
      providerName: formData.providerName,
      vehicleDescription: formData.vehicleDescription,
      fbtValue: fbtValue,
      residualValue: residualValue,
      financePayment: financePayment,
      paymentFrequency: formData.paymentFrequency,
      leaseTerm: leaseTerm,
      state: formData.state,
      vehicleType: formData.vehicleType,
      shownRate: shownRate || null,
      riskLevel: analysis.rating,
      extrasDetected: analysis.insuranceDetection?.detected || false,
    })

    setIsAnalyzing(false)
  }

  const howWeHelp = [
    {
      title: 'Clarity',
      description: 'Understand what\'s actually in your quote',
      detail: 'Make informed decisions',
    },
    {
      title: 'Negotiation',
      description: 'Get the best deal from your provider',
      detail: 'Armed with the right questions',
    },
    {
      title: 'Transparency',
      description: 'See what\'s being financed',
      detail: 'When providers make it hard',
    },
    {
      title: 'Confidence',
      description: 'Know you\'re getting a fair deal',
      detail: 'Before you sign',
    },
  ]

  return (
    <>
      <SEO
        title="Free Novated Lease Quote Analyser Australia 2025 | Check Hidden Fees"
        description="Is your novated lease quote a good deal? Free quote analyser reveals hidden fees, calculates true interest rates, and compares against market benchmarks. Takes 60 seconds."
        canonical="/lease-analysis"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            createFAQSchema(leaseAnalysisFAQs),
            {
              '@type': 'WebApplication',
              'name': 'millarX Novated Lease Quote Analyser',
              'description': 'Free online tool to analyse and compare novated lease quotes from Australian providers',
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
        {/* Decorative elements */}
        <BlurCircle color="purple" size="xl" className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />

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
                Is Your Novated Lease Quote{' '}
                <span className="gradient-text">Actually a Good Deal?</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-body-lg text-mx-slate-600 mb-4 max-w-2xl mx-auto"
              >
                Helped 1000's of people get better deals with our honest deconstruction of quotes.
              </motion.p>
              <motion.p
                variants={fadeInUp}
                className="text-body text-mx-slate-500 max-w-2xl mx-auto"
              >
                Analyse any competitor quote in 60 seconds. We'll show you the hidden fees and extras they don't want you to see.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Analysis Tool */}
        <section className="section-padding bg-white pt-0">
          <div className="container-wide mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <h2 className="text-display-sm font-serif text-mx-slate-900 mb-6">
                    Enter Quote Details
                  </h2>

                  <form onSubmit={analyzeQuote} className="space-y-5">
                    <Input
                      label="Provider Name"
                      name="providerName"
                      value={formData.providerName}
                      onChange={handleChange}
                      placeholder="e.g., SG Fleet, Maxxia, LeasePlan"
                    />

                    <Input
                      label="Vehicle"
                      name="vehicleDescription"
                      value={formData.vehicleDescription}
                      onChange={handleChange}
                      placeholder="e.g., Tesla Model Y Long Range"
                    />

                    <Select
                      label="State/Territory *"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      options={[
                        { value: 'VIC', label: 'Victoria' },
                        { value: 'NSW', label: 'New South Wales' },
                        { value: 'QLD', label: 'Queensland' },
                        { value: 'SA', label: 'South Australia' },
                        { value: 'WA', label: 'Western Australia' },
                        { value: 'TAS', label: 'Tasmania' },
                        { value: 'NT', label: 'Northern Territory' },
                        { value: 'ACT', label: 'Australian Capital Territory' },
                      ]}
                      helperText="Used for stamp duty calculation"
                    />

                    <Input
                      label="FBT Base Value *"
                      name="fbtValue"
                      type="number"
                      value={formData.fbtValue}
                      onChange={handleChange}
                      placeholder="54900"
                      prefix="$"
                      required
                      helperText="Always shown on quotes as 'FBT Base Value'"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Finance Payment *"
                        name="financePayment"
                        type="number"
                        step="0.01"
                        value={formData.financePayment}
                        onChange={handleChange}
                        placeholder="862"
                        prefix="$"
                        required
                      />
                      <Select
                        label="Frequency"
                        name="paymentFrequency"
                        value={formData.paymentFrequency}
                        onChange={handleChange}
                        options={[
                          { value: 'monthly', label: 'Monthly' },
                          { value: 'fortnightly', label: 'Fortnightly' },
                          { value: 'weekly', label: 'Weekly' },
                        ]}
                      />
                    </div>

                    <Input
                      label="Balloon/Residual *"
                      name="residualValue"
                      type="number"
                      step="0.01"
                      value={formData.residualValue}
                      onChange={handleChange}
                      placeholder="14956"
                      prefix="$"
                      required
                      helperText="End of lease payment to keep the car"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="balloonIncludesGST"
                        name="balloonIncludesGST"
                        checked={formData.balloonIncludesGST}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-mx-slate-300 text-mx-purple-600 focus:ring-mx-purple-500"
                      />
                      <label htmlFor="balloonIncludesGST" className="text-body-sm text-mx-slate-600">
                        This amount includes GST
                      </label>
                    </div>

                    <Select
                      label="Lease Term *"
                      name="leaseTerm"
                      value={formData.leaseTerm}
                      onChange={handleChange}
                      options={[
                        { value: '1', label: '1 year' },
                        { value: '2', label: '2 years' },
                        { value: '3', label: '3 years' },
                        { value: '4', label: '4 years' },
                        { value: '5', label: '5 years' },
                      ]}
                    />

                    <Input
                      label="Shown Interest Rate (if any)"
                      name="shownRate"
                      type="number"
                      step="0.01"
                      value={formData.shownRate}
                      onChange={handleChange}
                      placeholder="7.21"
                      suffix="% p.a."
                      helperText="Enter if shown on your quote"
                    />

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-body-sm text-blue-700">
                        <strong>Estimation Tool:</strong> This tool helps you understand your quote and ask the right questions. Results are estimates based on typical market conditions.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      size="lg"
                      loading={isAnalyzing}
                    >
                      Analyse Quote
                    </Button>
                  </form>
                </Card>
              </motion.div>

              {/* Results */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {results ? (
                  <Card>
                    <h2 className="text-display-sm font-serif text-mx-slate-900 mb-6">
                      Your Quote Rating
                    </h2>

                    {/* Rating Badge */}
                    <div className="text-center mb-8">
                      <div
                        className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                          results.rating === 'good'
                            ? 'bg-gradient-to-br from-teal-500 to-teal-700'
                            : results.rating === 'caution'
                            ? 'bg-gradient-to-br from-amber-500 to-amber-700'
                            : 'bg-gradient-to-br from-red-500 to-red-700'
                        }`}
                      >
                        {results.score}/10
                      </div>
                      <div className="mt-4">
                        <RatingBadge rating={results.rating} />
                      </div>
                    </div>

                    {/* Disclaimer Banner */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                      <p className="text-body-sm text-amber-800">
                        <strong>Important:</strong> These are preliminary indicators based on industry patterns.
                        Provider structures vary significantly. For exact figures and personalized analysis,
                        request your <strong>Lease Rescue Pack</strong> below.
                      </p>
                    </div>

                    {/* Key Metrics - Warnings Only, No Numbers */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {(() => {
                        const rateAssessment = getRateAssessment(results.effectiveRate, formData.leaseTerm)
                        return (
                          <div className={`p-4 rounded-lg ${rateAssessment.bgClass}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp size={16} className="text-mx-slate-500" />
                              <span className="text-body-sm text-mx-slate-600">Rate Assessment</span>
                            </div>
                            <p className={`text-lg font-bold ${rateAssessment.textClass}`}>
                              {rateAssessment.label}
                            </p>
                            <p className="text-body-sm text-mx-slate-500">
                              {rateAssessment.description}
                            </p>
                          </div>
                        )
                      })()}

                      <div
                        className={`p-4 rounded-lg ${
                          results.insuranceDetection?.detected
                            ? 'bg-red-50 border-2 border-red-200'
                            : 'bg-teal-50 border-2 border-teal-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Shield size={16} className="text-mx-slate-500" />
                          <span className="text-body-sm text-mx-slate-600">Extras/Insurance</span>
                        </div>
                        <p className={`text-lg font-bold ${
                          results.insuranceDetection?.detected ? 'text-red-600' : 'text-teal-600'
                        }`}>
                          {results.insuranceDetection?.detected ? '⚠️ Likely Bundled' : '✓ Appears Clean'}
                        </p>
                        <p className="text-body-sm text-mx-slate-500">
                          {results.insuranceDetection?.detected
                            ? 'Additional products may be financed'
                            : 'No bundled extras detected'}
                        </p>
                      </div>
                    </div>

                    {/* Issues Found */}
                    {results.issues.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-body-lg font-semibold text-mx-slate-800 mb-4">
                          Things to Investigate
                        </h3>
                        <div className="space-y-3">
                          {results.issues.map((issue, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border-2 ${
                                issue.severity === 'high'
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-amber-50 border-amber-200'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <AlertTriangle
                                  className={
                                    issue.severity === 'high' ? 'text-red-500' : 'text-amber-500'
                                  }
                                  size={20}
                                />
                                <div>
                                  <p className="font-semibold text-mx-slate-800">{issue.title}</p>
                                  <p className="text-body-sm text-mx-slate-600">
                                    {issue.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.issues.length === 0 && (
                      <div className="mb-8 p-4 bg-teal-50 border-2 border-teal-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="text-teal-600" size={24} />
                          <div>
                            <p className="font-semibold text-teal-800">Looking Good!</p>
                            <p className="text-body-sm text-teal-600">
                              No major issues detected with your quote.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Questions to Ask Your Provider */}
                    <div className="mb-8 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                      <h3 className="text-body-lg font-semibold text-purple-800 mb-3">
                        Questions to Ask Your Provider
                      </h3>
                      <ul className="space-y-2 text-body-sm text-purple-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>What is the total amount financed?</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>What products are included in the financing (insurance, gap cover, warranties)?</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>What is the effective interest rate on the finance component only?</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span>Can I see a breakdown of all costs included in the lease?</span>
                        </li>
                      </ul>
                    </div>

                    {/* Quick Summary */}
                    <div className="mb-8 p-4 bg-mx-slate-50 rounded-lg">
                      <h3 className="text-body-lg font-semibold text-mx-slate-800 mb-3">
                        What This Means
                      </h3>
                      <p className="text-body text-mx-slate-600">
                        {results.effectiveRate > 10
                          ? 'Your quote appears to have a higher than average interest rate. This could indicate additional products or fees bundled into the financing. We recommend asking your provider for a detailed breakdown.'
                          : results.effectiveRate > 8.5
                          ? 'Your quote is in the higher end of the market range. There may be room to negotiate or you could get a better rate elsewhere.'
                          : 'Your quote appears competitive. The rate is within typical market range.'}
                      </p>
                      {results.insuranceDetection?.detected && (
                        <p className="text-body text-mx-slate-600 mt-2">
                          Our analysis suggests there may be extras (insurance, gap cover, etc.) included in the financing. Ask your provider what's included.
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                      <Button variant="primary" fullWidth>
                        Get millarX Quote
                      </Button>
                      <Button variant="secondary" fullWidth>
                        Download Report
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center min-h-[400px]">
                    <div className="text-center text-mx-slate-500">
                      <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-body-lg">Enter your quote details to see the analysis</p>
                    </div>
                  </Card>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* How We Help */}
        <section className="section-padding bg-mx-slate-50">
          <div className="container-wide mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
                How We Help
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {howWeHelp.map((item, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="text-center h-full">
                    <h3 className="text-body-lg font-semibold text-mx-purple-700 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-body text-mx-slate-700">{item.description}</p>
                    <p className="text-body-sm text-mx-slate-500 mt-2">{item.detail}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Lease Rescue CTA */}
        <section className="section-padding bg-gradient-to-b from-mx-purple-700 via-mx-purple-800 to-mx-slate-900 text-white">
          <div className="container-narrow mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display-md font-serif mb-4">Want the Full Picture?</h2>
              <p className="text-body-lg text-purple-200 mb-6">
                Get a forensic breakdown of your quote with exact figures, not estimates.
              </p>
              <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-teal-400" />
                  <span><strong>Exact rate calculation</strong> — no more guessing</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-teal-400" />
                  <span><strong>Line-by-line breakdown</strong> of what's financed</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-teal-400" />
                  <span><strong>Comparison quotes</strong> from multiple lenders</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-teal-400" />
                  <span><strong>Negotiation scripts</strong> to get a better deal</span>
                </li>
              </ul>
              <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8 max-w-md mx-auto">
                <p className="text-3xl font-bold mb-2">$49</p>
                <p className="text-purple-200 text-sm">or FREE if you end up leasing with millarX</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://buy.stripe.com/3cIfZjfFk7dkaScez43sI01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 px-8 py-4 text-lg bg-white text-mx-purple-700 hover:bg-purple-50 shadow-md hover:shadow-lg"
                >
                  Get My Lease Rescue Pack
                </a>
              </div>
              <p className="text-purple-300 text-sm mt-4">
                After purchase, you'll receive instructions to send your quote for analysis
              </p>
              <div className="mt-10 pt-6 border-t border-purple-500/30">
                <p className="text-purple-200 mb-3">Found this free tool helpful?</p>
                <a
                  href="https://g.page/r/Cd8Q0w5IqeYcEAE/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white hover:text-purple-200 underline underline-offset-2"
                >
                  Leave us a Google Review
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <section className="py-4 bg-mx-slate-100">
          <div className="container-wide mx-auto text-center">
            <p className="text-body-sm text-mx-slate-500">
              This tool provides estimates only. Actual rates and amounts may vary. Always confirm details directly with your lease provider before signing any agreement.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
