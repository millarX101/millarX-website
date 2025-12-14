import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  Star,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { RatingBadge } from '../components/ui/Badge'
import BlurCircle from '../components/shared/BlurCircle'
import SEO from '../components/shared/SEO'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { formatCurrency, formatPercentage } from '../lib/utils'
import { STATES, BALLOON_PERCENTS } from '../lib/constants'

export default function LeaseAnalysis() {
  const [formData, setFormData] = useState({
    providerName: '',
    vehicleDescription: '',
    fbtValue: '',
    residualValue: '',
    financePayment: '',
    paymentFrequency: 'monthly',
    leaseTerm: '5',
    state: 'VIC',
    vehicleType: 'ev',
    balloonIncludesGST: false,
    shownRate: '',
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

    // Simulate analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const fbtValue = parseFloat(formData.fbtValue) || 0
    let residualValue = parseFloat(formData.residualValue) || 0
    const financePayment = parseFloat(formData.financePayment) || 0
    const leaseTerm = parseInt(formData.leaseTerm) || 5
    const shownRate = parseFloat(formData.shownRate) || 0

    // Adjust residual if includes GST
    if (formData.balloonIncludesGST) {
      residualValue = residualValue / 1.1
    }

    // Calculate periods per year
    const periodsPerYear = formData.paymentFrequency === 'monthly' ? 12 :
      formData.paymentFrequency === 'fortnightly' ? 26 : 52

    // Calculate annual finance payment
    const annualPayment = financePayment * periodsPerYear

    // Estimate drive-away price (FBT value + ~5% on-road)
    const estimatedDriveAway = fbtValue * 1.05

    // Calculate implied NAF
    // Using reverse engineering from payment
    const monthlyRate = 0.075 / 12 // Assume 7.5% baseline
    const termMonths = leaseTerm * 12
    const repayments = termMonths - 1 // 1 month deferral

    // Reverse calculate NAF from payment and balloon
    const factor = Math.pow(1 + monthlyRate, repayments)
    const impliedNAF = ((financePayment * 12 / 12) * (1 - 1/factor) + (residualValue * monthlyRate / factor)) / monthlyRate
    const impliedNAFAdjusted = impliedNAF / Math.pow(1 + monthlyRate, 1)

    // Calculate implied rate (simplified)
    const totalPayments = annualPayment * leaseTerm
    const totalInterest = totalPayments + residualValue - estimatedDriveAway
    const avgBalance = (estimatedDriveAway + residualValue) / 2
    const impliedRate = (totalInterest / avgBalance / leaseTerm) * 100

    // Compare to minimum residual
    const minResidualPercent = BALLOON_PERCENTS[leaseTerm] || 0.28
    const minResidual = fbtValue * minResidualPercent
    const residualDiff = residualValue - minResidual

    // Calculate millarX comparison
    const millarxRate = 7.5
    const rateDifference = shownRate > 0 ? shownRate - millarxRate : impliedRate - millarxRate
    const isRateHigh = rateDifference > 1

    // Generate issues
    const issues = []

    if (isRateHigh && rateDifference > 0) {
      issues.push({
        severity: 'high',
        title: 'Finance rate appears high',
        description: `${shownRate > 0 ? shownRate.toFixed(2) : impliedRate.toFixed(2)}% vs market rate of ~${millarxRate}%`,
        estimatedCost: rateDifference * estimatedDriveAway * leaseTerm / 100,
      })
    }

    if (residualDiff < -500) {
      issues.push({
        severity: 'medium',
        title: 'Residual below ATO minimum',
        description: `${formatCurrency(residualValue)} vs minimum ${formatCurrency(minResidual)} - may trigger FBT`,
        estimatedCost: Math.abs(residualDiff) * 0.3,
      })
    }

    // Calculate potential savings
    const potentialSavings = issues.reduce((sum, issue) => sum + issue.estimatedCost, 0)

    // Determine rating
    let rating = 'good'
    if (issues.some((i) => i.severity === 'high')) {
      rating = 'warning'
    } else if (issues.length > 0) {
      rating = 'caution'
    }

    setResults({
      rating,
      score: rating === 'good' ? 9 : rating === 'caution' ? 6 : 3,
      issues,
      potentialSavings,
      comparison: {
        theirRate: shownRate > 0 ? shownRate : impliedRate,
        millarxRate,
        theirPayment: financePayment,
        millarxPayment: financePayment * (millarxRate / (shownRate > 0 ? shownRate : impliedRate)),
        theirTotal: totalPayments + residualValue,
        millarxTotal: (financePayment * (millarxRate / Math.max(impliedRate, millarxRate)) * periodsPerYear * leaseTerm) + residualValue,
      },
      residualAnalysis: {
        provided: residualValue,
        minimum: minResidual,
        difference: residualDiff,
        isCompliant: residualDiff >= -100,
      },
    })

    setIsAnalyzing(false)
  }

  const hiddenFees = [
    {
      title: 'Admin Fees',
      range: '$10-20/mth',
      total: '= $720 over term',
    },
    {
      title: 'Inflated Rates',
      range: '2-3% above market',
      total: 'Thousands extra',
    },
    {
      title: 'Excessive Insurance',
      range: '+$500/yr',
      total: 'Overpriced cover',
    },
    {
      title: 'Exit Penalties',
      range: 'Up to $2,000',
      total: 'Hidden fees',
    },
  ]

  return (
    <>
      <SEO
        title="Analyse Your Novated Lease Quote"
        description="Is your novated lease quote a good deal? Analyse any competitor quote in 60 seconds. We'll show you the hidden fees they don't want you to see."
        canonical="/lease-analysis"
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
              className="text-body-lg text-mx-slate-600 mb-8 max-w-2xl mx-auto"
            >
              Analyse any competitor quote in 60 seconds.
              We'll show you the hidden fees they don't want you to see.
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

                  <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
                    <p className="text-body-sm text-amber-700">
                      This analyser focuses on fixed finance costs only. Variable items (fuel, maintenance) are excluded.
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
                    <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                      results.rating === 'good' ? 'bg-gradient-to-br from-teal-500 to-teal-700' :
                      results.rating === 'caution' ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                      'bg-gradient-to-br from-red-500 to-red-700'
                    }`}>
                      {results.score}/10
                    </div>
                    <div className="mt-4">
                      <RatingBadge rating={results.rating} />
                    </div>
                    {results.potentialSavings > 100 && (
                      <p className="mt-2 text-body-lg text-mx-slate-700">
                        Potential savings: <span className="font-bold text-mx-purple-700">{formatCurrency(results.potentialSavings)}</span>
                      </p>
                    )}
                  </div>

                  {/* Issues Found */}
                  {results.issues.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-body-lg font-semibold text-mx-slate-800 mb-4">
                        Issues Found
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
                                  issue.severity === 'high'
                                    ? 'text-red-500'
                                    : 'text-amber-500'
                                }
                                size={20}
                              />
                              <div>
                                <p className="font-semibold text-mx-slate-800">
                                  {issue.title}
                                </p>
                                <p className="text-body-sm text-mx-slate-600">
                                  {issue.description}
                                </p>
                                {issue.estimatedCost > 100 && (
                                  <p className="text-body-sm font-semibold text-red-600 mt-1">
                                    Est. cost: {formatCurrency(issue.estimatedCost)}
                                  </p>
                                )}
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
                          <p className="font-semibold text-teal-800">
                            Looking Good!
                          </p>
                          <p className="text-body-sm text-teal-600">
                            No major issues detected with your quote.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Comparison Table */}
                  <div className="mb-8">
                    <h3 className="text-body-lg font-semibold text-mx-slate-800 mb-4">
                      Quick Comparison
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-mx-slate-200">
                            <th className="text-left py-2 px-3"></th>
                            <th className="text-right py-2 px-3 text-body-sm text-mx-slate-600">
                              Their Quote
                            </th>
                            <th className="text-right py-2 px-3 text-body-sm text-mx-purple-600">
                              millarX
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-mx-slate-100">
                          <tr>
                            <td className="py-2 px-3 text-body text-mx-slate-600">
                              Finance Rate
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold">
                              {results.comparison.theirRate.toFixed(2)}%
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-semibold text-mx-purple-700">
                              {results.comparison.millarxRate}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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
                    <p className="text-body-lg">
                      Enter your quote details to see the analysis
                    </p>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Common Hidden Fees */}
      <section className="section-padding bg-mx-slate-50">
        <div className="container-wide mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-display-md font-serif text-mx-slate-900 mb-4">
              Common Hidden Fees We Find
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {hiddenFees.map((fee, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="text-center h-full">
                  <h3 className="text-body-lg font-semibold text-mx-slate-800 mb-2">
                    {fee.title}
                  </h3>
                  <p className="text-display-sm font-mono text-mx-purple-700">
                    {fee.range}
                  </p>
                  <p className="text-body-sm text-mx-slate-500 mt-2">
                    {fee.total}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lease Rescue CTA */}
      <section className="section-padding bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="container-narrow mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-md font-serif mb-4">
              Need Help Negotiating?
            </h2>
            <p className="text-body-lg text-red-100 mb-6">
              Our Lease Rescue service includes:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span>1:1 consultation call</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span>We negotiate with your current provider</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span>Formal quotes from 3+ lenders</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span>Full recommendation report</span>
              </li>
            </ul>
            <p className="text-2xl font-bold mb-6">
              $149 — or FREE if you lease with millarX
            </p>
            <Button
              size="lg"
              className="bg-white text-red-700 hover:bg-red-50"
            >
              Book Lease Rescue
            </Button>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  )
}
