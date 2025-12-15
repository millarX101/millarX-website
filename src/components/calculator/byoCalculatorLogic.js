// BYO Finance Calculator Logic
// Separate from main calculator to avoid breaking existing functionality

import {
  BYO_TERM_RATES,
  BYO_ATO_BALLOONS,
  BYO_STAMP_DUTY_RATES,
  BYO_REGISTRATION_COSTS,
  BYO_ESTABLISHMENT_FEE
} from '../../lib/byoConstants'

/**
 * Calculate stamp duty for a vehicle
 * @param {string} state - Australian state code (e.g., 'VIC')
 * @param {number} vehicleValue - Vehicle value including GST
 * @param {string} vehicleType - 'petrol', 'hybrid', or 'ev'
 * @returns {number} Stamp duty amount
 */
export function calculateStampDuty(state, vehicleValue, vehicleType) {
  const rates = BYO_STAMP_DUTY_RATES[state]
  if (!rates) return 0

  const isEV = vehicleType === 'ev'
  const rate = isEV ? rates.ev_rate : rates.rate

  return Math.round(vehicleValue * rate)
}

/**
 * Get registration cost for a state
 * @param {string} state - Australian state code
 * @returns {number} Registration cost estimate
 */
export function getRegistrationCost(state) {
  return BYO_REGISTRATION_COSTS[state] || 900
}

/**
 * Get interest rate for a given term
 * @param {number} termYears - Lease term in years (1-5)
 * @returns {number} Annual interest rate percentage
 */
export function getTermRate(termYears) {
  return BYO_TERM_RATES[termYears] || 7.30
}

/**
 * Get ATO balloon percentage for a given term
 * @param {number} termYears - Lease term in years (1-5)
 * @returns {number} Balloon percentage
 */
export function getBalloonPercent(termYears) {
  return BYO_ATO_BALLOONS[termYears] || 28.13
}

/**
 * Calculate finance payment using daily compounding (ACT/365)
 * Matches the methodology from the original HTML calculator
 *
 * @param {Object} params - Calculation parameters
 * @param {number} params.amountFinanced - Total amount to finance
 * @param {number} params.termYears - Lease term in years
 * @param {number} params.annualRate - Annual interest rate percentage
 * @param {number} params.balloonValue - Balloon/residual amount at end
 * @param {number} params.deferMonths - Number of deferred months (default 1)
 * @returns {Object} Calculation results
 */
export function calculateFinancePayment({
  amountFinanced,
  termYears,
  annualRate,
  balloonValue = 0,
  deferMonths = 1
}) {
  const termMonths = termYears * 12
  const daysPerYear = 365
  const dailyRate = annualRate / 100 / daysPerYear

  // Convert to effective monthly rate (daily compounded)
  const daysPerMonth = daysPerYear / 12
  const monthlyRate = Math.pow(1 + dailyRate, daysPerMonth) - 1

  const n = termMonths
  const d = Math.max(0, Math.floor(deferMonths))
  const nPayments = n - d

  if (nPayments <= 0) {
    throw new Error('Invalid deferral period')
  }

  // Separate establishment fee from interest-bearing principal
  const principalForInterest = amountFinanced - BYO_ESTABLISHMENT_FEE
  const establishmentFeePerPayment = BYO_ESTABLISHMENT_FEE / nPayments

  // Calculate payment on interest-bearing principal only
  const balloonPV = balloonValue / Math.pow(1 + monthlyRate, n)
  const netPrincipal = principalForInterest - balloonPV
  const deferralFactor = Math.pow(1 + monthlyRate, d)
  const annuityFactor = (1 - Math.pow(1 + monthlyRate, -nPayments)) / monthlyRate

  const interestPayment = (netPrincipal * deferralFactor) / annuityFactor
  const totalMonthlyPayment = interestPayment + establishmentFeePerPayment

  return {
    monthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
    balloon: balloonValue,
    termMonths: n,
    nPayments,
    deferMonths: d,
    monthlyRate,
    annualRate
  }
}

/**
 * Convert payment between frequencies
 * @param {number} amount - Payment amount
 * @param {string} fromFreq - Source frequency ('weekly', 'fortnightly', 'monthly')
 * @param {string} toFreq - Target frequency
 * @returns {number} Converted amount
 */
export function convertPaymentFrequency(amount, fromFreq, toFreq) {
  const annual = {
    weekly: 52,
    fortnightly: 26,
    monthly: 12
  }

  return (amount * annual[fromFreq]) / annual[toFreq]
}

/**
 * Get number of payments per year for a frequency
 * @param {string} frequency - 'weekly', 'fortnightly', or 'monthly'
 * @returns {number} Payments per year
 */
export function getPaymentsPerYear(frequency) {
  const frequencies = {
    weekly: 52,
    fortnightly: 26,
    monthly: 12
  }
  return frequencies[frequency] || 12
}

/**
 * Calculate total number of payments based on term and frequency
 * @param {number} termYears - Lease term in years
 * @param {string} frequency - Payment frequency
 * @param {string} paymentStructure - 'full_term' or 'deferred_2'
 * @returns {number} Total number of payments
 */
export function getTotalPayments(termYears, frequency, paymentStructure) {
  const paymentsPerYear = getPaymentsPerYear(frequency)
  let totalPayments = termYears * paymentsPerYear

  // Deferred structure has 2 months fewer payments
  if (paymentStructure === 'deferred_2') {
    if (frequency === 'monthly') {
      totalPayments -= 2
    } else if (frequency === 'fortnightly') {
      totalPayments -= 4
    } else {
      totalPayments -= 8
    }
  }

  return totalPayments
}

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {number} decimals - Decimal places (default 0)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, decimals = 0) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount || 0)
}

/**
 * Calculate vehicle ex-GST value
 * @param {number} vehicleValue - Vehicle value including GST
 * @returns {number} Vehicle value excluding GST
 */
export function getVehicleExGST(vehicleValue) {
  return Math.round(vehicleValue / 1.1)
}

/**
 * Full BYO finance calculation
 * @param {Object} params - All input parameters
 * @returns {Object} Complete calculation results
 */
export function calculateBYOFinance({
  vehicleValue,
  state,
  vehicleType,
  termYears,
  stampDutyOverride = null,
  registrationOverride = null
}) {
  // Get ex-GST value
  const vehicleExGST = getVehicleExGST(vehicleValue)

  // Get stamp duty (use override if provided)
  let stampDuty
  if (stampDutyOverride !== null && stampDutyOverride >= 0) {
    stampDuty = stampDutyOverride
  } else {
    stampDuty = calculateStampDuty(state, vehicleValue, vehicleType)
  }

  // Get registration (use override if provided)
  let registration
  if (registrationOverride !== null && registrationOverride >= 0) {
    registration = registrationOverride
  } else {
    registration = getRegistrationCost(state)
  }

  // Get rate and balloon for term
  const annualRate = getTermRate(termYears)
  const balloonPercent = getBalloonPercent(termYears)

  // Total financed includes everything
  const totalFinanced = vehicleExGST + stampDuty + registration + BYO_ESTABLISHMENT_FEE

  // Balloon based on vehicle + on-road (excluding establishment fee)
  const balloonBase = vehicleExGST + stampDuty + registration
  const balloonAmount = Math.round(balloonBase * (balloonPercent / 100))

  // Calculate finance payment
  const financeResult = calculateFinancePayment({
    amountFinanced: totalFinanced,
    termYears,
    annualRate,
    balloonValue: balloonAmount,
    deferMonths: 1 // Always 1 month deferral
  })

  return {
    vehicleExGST,
    stampDuty,
    stampDutyAuto: calculateStampDuty(state, vehicleValue, vehicleType),
    registration,
    registrationAuto: getRegistrationCost(state),
    establishmentFee: BYO_ESTABLISHMENT_FEE,
    totalFinanced,
    balloonPercent,
    balloonAmount,
    annualRate,
    monthlyPayment: financeResult.monthlyPayment,
    nPayments: financeResult.nPayments
  }
}

/**
 * Compare BYO finance with existing quote
 * @param {Object} byoResult - Result from calculateBYOFinance
 * @param {Object} existingQuote - Existing quote details
 * @returns {Object} Comparison results
 */
export function compareBYOWithExisting(byoResult, existingQuote) {
  const { existingPayment, existingFrequency, existingTermYears, paymentStructure } = existingQuote

  // Convert BYO monthly to existing frequency
  const byoPaymentConverted = convertPaymentFrequency(
    byoResult.monthlyPayment,
    'monthly',
    existingFrequency
  )

  // Calculate savings per payment
  const savingPerPay = existingPayment - byoPaymentConverted

  // Calculate total payments for existing quote
  const totalPayments = getTotalPayments(existingTermYears, existingFrequency, paymentStructure)

  // Calculate total savings over the lease term
  const totalSavings = savingPerPay * totalPayments

  return {
    byoPayment: byoPaymentConverted,
    existingPayment,
    savingPerPay,
    totalSavings,
    totalPayments,
    isPositiveSaving: savingPerPay > 0
  }
}
