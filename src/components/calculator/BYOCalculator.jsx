import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, CheckCircle, AlertTriangle, ExternalLink, Info } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Select from '../ui/Select'
import { TooltipIcon } from '../ui/Tooltip'
import { cn } from '../../lib/utils'
import { fadeInUp, staggerContainer, staggerItem } from '../../lib/animations'
import {
  BYO_STATES,
  BYO_VEHICLE_TYPES,
  BYO_PAY_FREQUENCIES,
  BYO_LEASE_TERMS,
  BYO_PAYMENT_STRUCTURES,
  BYO_PROVIDERS,
  BYO_PROVIDER_CONFIG,
  BYO_TERM_RATES,
  BYO_ATO_BALLOONS
} from '../../lib/byoConstants'
import {
  calculateBYOFinance,
  compareBYOWithExisting,
  formatCurrency,
  convertPaymentFrequency
} from './byoCalculatorLogic'

export default function BYOCalculator() {
  // Existing quote inputs
  const [existingPayment, setExistingPayment] = useState('')
  const [existingFrequency, setExistingFrequency] = useState('fortnightly')
  const [existingTerm, setExistingTerm] = useState(5)
  const [paymentStructure, setPaymentStructure] = useState('full_term')

  // BYO finance inputs
  const [vehicleValue, setVehicleValue] = useState('')
  const [state, setState] = useState('VIC')
  const [vehicleType, setVehicleType] = useState('petrol')
  const [byoTerm, setByoTerm] = useState(5)
  const [provider, setProvider] = useState('self-managed')
  const [stampDutyOverride, setStampDutyOverride] = useState('')
  const [registrationOverride, setRegistrationOverride] = useState('')

  // UI state
  const [showResults, setShowResults] = useState(false)

  // Get current rates for display
  const currentRate = BYO_TERM_RATES[byoTerm] || 7.30
  const currentBalloon = BYO_ATO_BALLOONS[byoTerm] || 28.13

  // Calculate BYO finance breakdown when inputs change
  const byoBreakdown = useMemo(() => {
    const value = parseFloat(vehicleValue) || 0
    if (value <= 0) return null

    return calculateBYOFinance({
      vehicleValue: value,
      state,
      vehicleType,
      termYears: byoTerm,
      stampDutyOverride: stampDutyOverride !== '' ? parseFloat(stampDutyOverride) : null,
      registrationOverride: registrationOverride !== '' ? parseFloat(registrationOverride) : null
    })
  }, [vehicleValue, state, vehicleType, byoTerm, stampDutyOverride, registrationOverride])

  // Comparison results
  const [comparisonResults, setComparisonResults] = useState(null)

  const handleCompare = () => {
    const existingPaymentValue = parseFloat(existingPayment)
    const vehicleValueParsed = parseFloat(vehicleValue)

    if (!vehicleValueParsed || vehicleValueParsed <= 0) {
      alert('Please enter the vehicle value')
      return
    }

    if (!existingPaymentValue || existingPaymentValue <= 0) {
      alert('Please enter your existing payment amount')
      return
    }

    const byoResult = calculateBYOFinance({
      vehicleValue: vehicleValueParsed,
      state,
      vehicleType,
      termYears: byoTerm,
      stampDutyOverride: stampDutyOverride !== '' ? parseFloat(stampDutyOverride) : null,
      registrationOverride: registrationOverride !== '' ? parseFloat(registrationOverride) : null
    })

    const comparison = compareBYOWithExisting(byoResult, {
      existingPayment: existingPaymentValue,
      existingFrequency,
      existingTermYears: existingTerm,
      paymentStructure
    })

    setComparisonResults(comparison)
    setShowResults(true)
  }

  const providerConfig = BYO_PROVIDER_CONFIG[provider]
  const isHighDifficulty = providerConfig?.badgeClass === 'high'

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="w-full"
    >
      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Panel - Existing Quote */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
              <h3 className="text-display-sm font-serif text-mx-slate-900">
                Your Current Quote
              </h3>
            </div>

            <div className="space-y-5">
              {/* Payment Amount */}
              <div>
                <label className="block text-body font-medium text-mx-slate-700 mb-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mx-slate-500 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={existingPayment}
                    onChange={(e) => setExistingPayment(e.target.value)}
                    placeholder="e.g. 800"
                    className="w-full pl-8 pr-4 py-3 border-2 border-mx-slate-200 rounded-lg focus:border-mx-purple-500 focus:outline-none focus:ring-2 focus:ring-mx-purple-100 transition-all"
                  />
                </div>
                <p className="mt-1 text-body-sm text-mx-slate-500">
                  Enter the payment amount from your existing quote
                </p>
              </div>

              {/* Payment Frequency & Term */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Payment Frequency"
                  options={BYO_PAY_FREQUENCIES}
                  value={existingFrequency}
                  onChange={(e) => setExistingFrequency(e.target.value)}
                />
                <Select
                  label="Lease Term"
                  options={BYO_LEASE_TERMS}
                  value={existingTerm}
                  onChange={(e) => setExistingTerm(parseInt(e.target.value))}
                />
              </div>

              {/* Payment Structure */}
              <Select
                label="Payment Structure"
                options={BYO_PAYMENT_STRUCTURES}
                value={paymentStructure}
                onChange={(e) => setPaymentStructure(e.target.value)}
                helperText="Check your quote - does it show the full number of payments or fewer due to deferral?"
              />
            </div>
          </Card>
        </motion.div>

        {/* Right Panel - BYO Finance */}
        <motion.div variants={fadeInUp}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600" />
              <h3 className="text-display-sm font-serif text-mx-slate-900">
                millarX BYO Finance
              </h3>
            </div>

            <div className="space-y-5">
              {/* Vehicle FBT Base Value */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-body font-medium text-mx-slate-700">
                    Vehicle FBT Base Value
                  </label>
                  <TooltipIcon content="The FBT base value from your quote, or the drive-away price including GST" />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mx-slate-500 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={vehicleValue}
                    onChange={(e) => setVehicleValue(e.target.value)}
                    placeholder="e.g. 52000"
                    className="w-full pl-8 pr-4 py-3 border-2 border-mx-slate-200 rounded-lg focus:border-mx-purple-500 focus:outline-none focus:ring-2 focus:ring-mx-purple-100 transition-all"
                  />
                </div>
              </div>

              {/* State & Vehicle Type */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Registration State"
                  options={BYO_STATES}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <Select
                  label="Vehicle Type"
                  options={BYO_VEHICLE_TYPES}
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                />
              </div>

              {/* Finance Term */}
              <Select
                label="Finance Term"
                options={BYO_LEASE_TERMS}
                value={byoTerm}
                onChange={(e) => setByoTerm(parseInt(e.target.value))}
              />

              {/* Financing Breakdown */}
              <div className="p-4 bg-mx-slate-50 rounded-lg space-y-3">
                <h4 className="font-semibold text-mx-purple-700">Financing Breakdown</h4>

                <div className="flex justify-between text-body-sm">
                  <span className="text-mx-slate-600">Vehicle Value (ex-GST):</span>
                  <span className="font-medium">{formatCurrency(byoBreakdown?.vehicleExGST || 0)}</span>
                </div>

                {/* Stamp Duty Override */}
                <div className="p-3 bg-mx-purple-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-body-sm font-medium text-mx-purple-700">
                      Stamp Duty: <span className="font-bold">{formatCurrency(byoBreakdown?.stampDutyAuto || 0)}</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    value={stampDutyOverride}
                    onChange={(e) => setStampDutyOverride(e.target.value)}
                    placeholder={`Override (auto: ${byoBreakdown?.stampDutyAuto || 0})`}
                    className="w-32 px-3 py-2 text-sm border-2 border-mx-slate-200 rounded-lg focus:border-mx-purple-500 focus:outline-none"
                  />
                  <p className="text-xs text-mx-slate-500">
                    Estimated only - confirm from your actual vehicle order
                  </p>
                </div>

                {/* Registration Override */}
                <div className="p-3 bg-mx-purple-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-body-sm font-medium text-mx-purple-700">
                      Registration: <span className="font-bold">{formatCurrency(byoBreakdown?.registrationAuto || 0)}</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    value={registrationOverride}
                    onChange={(e) => setRegistrationOverride(e.target.value)}
                    placeholder={`Override (auto: ${byoBreakdown?.registrationAuto || 0})`}
                    className="w-32 px-3 py-2 text-sm border-2 border-mx-slate-200 rounded-lg focus:border-mx-purple-500 focus:outline-none"
                  />
                  <p className="text-xs text-mx-slate-500">
                    Estimated only - confirm from your actual vehicle order
                  </p>
                </div>

                <div className="flex justify-between text-body-sm">
                  <span className="text-mx-slate-600">Establishment Fee:</span>
                  <span className="font-medium">$500</span>
                </div>

                <div className="flex justify-between text-body-sm pt-2 border-t border-mx-slate-200">
                  <span className="font-semibold text-mx-purple-700">Total Amount Financed:</span>
                  <span className="font-bold text-mx-purple-700">{formatCurrency(byoBreakdown?.totalFinanced || 0)}</span>
                </div>

                <div className="flex justify-between text-body-sm pt-2 border-t border-mx-slate-200">
                  <span className="font-semibold text-mx-purple-600">Balloon Payment (at end):</span>
                  <span className="font-bold text-mx-purple-600">{formatCurrency(byoBreakdown?.balloonAmount || 0)}</span>
                </div>
              </div>

              {/* Interest Rate & Balloon Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-mx-slate-50 rounded-lg">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-mx-slate-600">Interest Rate p.a.</span>
                    <span className="font-semibold text-mx-purple-700">{currentRate.toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-teal-600 mt-1">Fixed rate by term ✓</p>
                </div>
                <div className="p-3 bg-mx-slate-50 rounded-lg">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-mx-slate-600">Balloon/Residual</span>
                    <span className="font-semibold text-mx-purple-700">{currentBalloon.toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-teal-600 mt-1">ATO Compliant ✓</p>
                </div>
              </div>

              {/* Provider Selection */}
              <Select
                label="Novated Lease Provider/Employer"
                options={BYO_PROVIDERS}
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                helperText="Choose your employer's novated lease provider to get specific guidance"
              />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Compare Button */}
      <motion.div variants={fadeInUp} className="text-center my-8">
        <Button
          size="lg"
          onClick={handleCompare}
          className="px-12 shadow-lg"
        >
          Compare Finance Options
        </Button>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && comparisonResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-mx-purple-50 to-purple-50 border-2 border-mx-purple-200">
              {/* Results Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                  <div className="text-2xl font-bold text-mx-purple-700">
                    {formatCurrency(comparisonResults.byoPayment)}
                  </div>
                  <div className="text-body-sm text-mx-slate-600">millarX Payment per Pay</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                  <div className="text-2xl font-bold text-mx-slate-700">
                    {formatCurrency(comparisonResults.existingPayment)}
                  </div>
                  <div className="text-body-sm text-mx-slate-600">Current Quote per Pay</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                  <div className={cn(
                    "text-2xl font-bold",
                    comparisonResults.isPositiveSaving ? "text-teal-600" : "text-orange-500"
                  )}>
                    {formatCurrency(Math.abs(comparisonResults.savingPerPay))}
                  </div>
                  <div className="text-body-sm text-mx-slate-600">
                    {comparisonResults.isPositiveSaving ? 'Saving' : 'Extra'} per Pay
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                  <div className={cn(
                    "text-2xl font-bold",
                    comparisonResults.isPositiveSaving ? "text-teal-600" : "text-orange-500"
                  )}>
                    {formatCurrency(Math.abs(comparisonResults.totalSavings))}
                  </div>
                  <div className="text-body-sm text-mx-slate-600">Total Term Savings</div>
                </div>
              </div>

              {/* Next Steps Section */}
              <div className="bg-white p-6 rounded-lg">
                <div className={cn(
                  "inline-block px-4 py-2 rounded-full text-body-sm font-semibold mb-4",
                  providerConfig.badgeClass === 'low' && "bg-teal-100 text-teal-700",
                  providerConfig.badgeClass === 'medium' && "bg-yellow-100 text-yellow-700",
                  providerConfig.badgeClass === 'high' && "bg-red-100 text-red-700"
                )}>
                  {providerConfig.badge}
                </div>

                <h3 className="text-display-sm font-serif text-mx-slate-900 mb-3">Next Steps</h3>
                <p className="text-body text-mx-slate-600 mb-4">
                  {comparisonResults.isPositiveSaving && comparisonResults.savingPerPay > 50 ? (
                    <>
                      <strong className="text-teal-600">Excellent!</strong> You could save {formatCurrency(comparisonResults.savingPerPay)} per payment with millarX BYO Finance.
                    </>
                  ) : comparisonResults.isPositiveSaving ? (
                    <>
                      <strong className="text-teal-600">Good news!</strong> You could save {formatCurrency(comparisonResults.savingPerPay)} per payment with millarX BYO Finance.
                    </>
                  ) : (
                    <>
                      <strong>Your current quote is competitive,</strong> but consider our Lease Rescue Pack to ensure you're getting the best deal.
                    </>
                  )}
                  {' '}{providerConfig.steps}
                </p>

                {/* Provider Playbook */}
                {providerConfig.playbook && (
                  <div className="p-4 border-2 border-dashed border-mx-purple-200 rounded-lg bg-mx-purple-50 mb-6">
                    <h4 className="font-semibold text-mx-purple-700 mb-3">Provider Playbook</h4>
                    <p className="text-body-sm text-mx-slate-600 mb-3">{providerConfig.playbook.intro}</p>
                    <ul className="list-disc list-inside space-y-2 text-body-sm text-mx-slate-700 mb-3">
                      {providerConfig.playbook.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    <p className="text-body-sm text-mx-slate-500">{providerConfig.playbook.foot}</p>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className={cn(
                  "grid gap-4 mb-6",
                  isHighDifficulty ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"
                )}>
                  <a
                    href="https://www.millarx.com.au/finance-application-form"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex flex-col items-center justify-center p-5 rounded-xl text-white font-semibold text-center transition-all hover:-translate-y-1 hover:shadow-lg",
                      isHighDifficulty
                        ? "bg-gradient-to-br from-mx-purple-500 to-mx-purple-700 order-2"
                        : "bg-gradient-to-br from-teal-500 to-teal-700 order-1"
                    )}
                  >
                    <span className="text-lg">Apply for BYO Finance →</span>
                    <span className="text-sm opacity-90">Quick online application</span>
                  </a>
                  <a
                    href="/lease-analysis"
                    className={cn(
                      "flex flex-col items-center justify-center p-5 rounded-xl text-white font-semibold text-center transition-all hover:-translate-y-1 hover:shadow-lg",
                      isHighDifficulty
                        ? "bg-gradient-to-br from-orange-500 to-orange-700 order-1"
                        : "bg-gradient-to-br from-mx-purple-500 to-mx-purple-700 order-2"
                    )}
                  >
                    <span className="text-lg">
                      {isHighDifficulty ? 'Lease Rescue Pack →' : 'Get Lease Rescue Pack →'}
                    </span>
                    <span className="text-sm opacity-90">
                      {isHighDifficulty ? 'Check your existing quote first' : 'Review your existing quote'}
                    </span>
                  </a>
                </div>

                {/* Contact Info */}
                <div className="p-4 bg-mx-purple-50 rounded-lg text-center">
                  <p className="text-body text-mx-slate-700">
                    <strong>Questions?</strong> Our finance specialists are here to help.{' '}
                    <a
                      href="tel:+61492886857"
                      className="text-mx-purple-700 font-semibold hover:text-mx-purple-800"
                    >
                      Call 0492 886 857
                    </a>
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-mx-slate-500 text-center mt-6 pt-4 border-t border-mx-slate-200">
                <strong>Important:</strong> Savings calculations are estimated only. Finance component comparison excludes tax effects & running-cost budgets.
                Calculations include 1-month payment deferral (first payment month 2). Interest calculated using daily compounding (ACT/365) paid monthly in arrears.
                On-road costs are estimates - verify with authorities. Establishment fee $500.
                <br /><br />
                <strong>Note:</strong> Depending on how your existing provider structures and presents their finance payments, there may be discrepancies between quoted amounts and actual payment schedules. We recommend verifying all payment terms with your current provider.
                <br /><br />
                General information only - not financial advice. Subject to credit approval.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
