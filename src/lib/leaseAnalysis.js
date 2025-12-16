/**
 * Lease Analysis Utility Functions
 * Ported from standalone lease analysis code
 * Uses proper IRR (Internal Rate of Return) calculation with Newton-Raphson method
 */

// ============================================
// IRR CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate IRR (Internal Rate of Return) for a lease
 * @param {number} pv - Present Value (amount financed)
 * @param {number} pmt - Monthly payment
 * @param {number} fv - Future Value (balloon/residual)
 * @param {number} n - Number of periods (months)
 * @param {number} lag - Payment deferral in months (typically 2)
 * @returns {number} Monthly rate (multiply by 12 * 100 for annual %)
 */
export function calculateIRR(pv, pmt, fv, n, lag) {
  if (pv <= 0 || pmt <= 0 || n <= 0) {
    return NaN
  }

  // Try Newton-Raphson with multiple starting guesses
  const startingGuesses = [0.005, 0.01, 0.02, 0.05, 0.1, 0.15]

  for (let i = 0; i < startingGuesses.length; i++) {
    const guess = startingGuesses[i]
    const result = newtonRaphsonIRR(pv, pmt, fv, n, lag, guess)
    if (!isNaN(result) && result > -0.01 && result < 1.0) {
      return result
    }
  }

  // Fallback to bisection method
  return bisectionIRR(pv, pmt, fv, n, lag)
}

/**
 * Newton-Raphson iterative solver for IRR
 */
function newtonRaphsonIRR(pv, pmt, fv, n, lag, guess) {
  const maxIterations = 1000
  const tolerance = 1e-12
  let rate = guess

  for (let i = 0; i < maxIterations; i++) {
    const result = calculateNPVAndDerivative(pv, pmt, fv, n, lag, rate)
    const npv = result.npv
    const derivative = result.derivative

    if (Math.abs(npv) < tolerance) return rate
    if (Math.abs(derivative) < tolerance) break

    const newRate = rate - npv / derivative

    if (Math.abs(newRate - rate) < tolerance) return newRate

    rate = newRate

    if (rate < -0.99 || rate > 10) break
  }

  return NaN
}

/**
 * Calculate NPV and its derivative for Newton-Raphson
 */
function calculateNPVAndDerivative(pv, pmt, fv, n, lag, rate) {
  let npv = -pv
  let derivative = 0

  for (let i = 1; i <= n; i++) {
    const period = i + lag
    const discountFactor = Math.pow(1 + rate, period)
    npv += pmt / discountFactor
    derivative -= (pmt * period) / Math.pow(1 + rate, period + 1)
  }

  if (fv !== 0) {
    const balloonPeriod = n + lag
    npv += fv / Math.pow(1 + rate, balloonPeriod)
    derivative -= (fv * balloonPeriod) / Math.pow(1 + rate, balloonPeriod + 1)
  }

  return { npv, derivative }
}

/**
 * Bisection method fallback for IRR calculation
 */
function bisectionIRR(pv, pmt, fv, n, lag) {
  let lowRate = -0.99
  let highRate = 5.0
  const tolerance = 1e-8
  const maxIterations = 1000

  let lowNPV = calculateNPV(pv, pmt, fv, n, lag, lowRate)
  let highNPV = calculateNPV(pv, pmt, fv, n, lag, highRate)

  if (lowNPV * highNPV > 0) return NaN

  for (let i = 0; i < maxIterations; i++) {
    const midRate = (lowRate + highRate) / 2
    const midNPV = calculateNPV(pv, pmt, fv, n, lag, midRate)

    if (Math.abs(midNPV) < tolerance) return midRate

    if (lowNPV * midNPV < 0) {
      highRate = midRate
      highNPV = midNPV
    } else {
      lowRate = midRate
      lowNPV = midNPV
    }

    if (Math.abs(highRate - lowRate) < tolerance) return midRate
  }

  return NaN
}

/**
 * Calculate Net Present Value
 */
function calculateNPV(pv, pmt, fv, n, lag, rate) {
  let npv = -pv

  for (let i = 1; i <= n; i++) {
    const period = i + lag
    npv += pmt / Math.pow(1 + rate, period)
  }

  if (fv !== 0) {
    const balloonPeriod = n + lag
    npv += fv / Math.pow(1 + rate, balloonPeriod)
  }

  return npv
}

// ============================================
// PAYMENT CONVERSION
// ============================================

/**
 * Convert payment to monthly equivalent, accounting for payment deferral
 * The deferral means payments are spread over fewer months
 * Example: 2-year term with 2-month deferral = 22 actual payment months
 *
 * @param {number} payment - Payment amount
 * @param {string} frequency - 'weekly', 'fortnightly', or 'monthly'
 * @param {number} termYears - Lease term in years
 * @param {number} paymentDeferral - Payment deferral in months (default 2)
 * @returns {number} Monthly equivalent payment
 */
export function convertToMonthlyPayment(payment, frequency, termYears = 1, paymentDeferral = 2) {
  const termMonths = termYears * 12
  const actualPaymentMonths = termMonths - paymentDeferral

  switch (frequency) {
    case 'weekly':
      // Total annual payments * years / actual payment months
      return (payment * 52 * termYears) / actualPaymentMonths
    case 'fortnightly':
      // Total annual payments * years / actual payment months
      return (payment * 26 * termYears) / actualPaymentMonths
    case 'monthly':
    default:
      return payment
  }
}

// ============================================
// AMOUNT FINANCED CALCULATION
// ============================================

// State stamp duty rates (as decimal)
const STAMP_DUTY_RATES = {
  VIC: 0.046,
  NSW: 0.04,
  QLD: 0.03,
  SA: 0.04,
  WA: 0.0275,
  TAS: 0.04,
  NT: 0.03,
  ACT: 0.04,
}

// Base registration cost estimate
const BASE_REGISTRATION = 950

/**
 * Calculate expected "clean" amount financed from FBT value
 * Clean = vehicle + on-roads (rego + stamp duty) - GST
 *
 * Formula: (FBT Base + Rego + Stamp Duty) - GST
 * Where GST = FBT Base - (FBT Base / 1.1)
 *
 * @param {number} fbtValue - FBT Base Value (vehicle ex-GST less dealer delivery)
 * @param {string} state - Australian state code (VIC, NSW, QLD, etc.)
 * @returns {number} Expected clean amount financed
 */
export function calculateAmountFinanced(fbtValue, state = 'VIC') {
  // GST is calculated on the FBT base value
  // GST = FBT Base - (FBT Base / 1.1) = FBT Base * (1 - 1/1.1) = FBT Base * 0.0909...
  const gst = fbtValue - fbtValue / 1.1

  // Get stamp duty rate for state (default to VIC if unknown)
  const stampDutyRate = STAMP_DUTY_RATES[state] || STAMP_DUTY_RATES.VIC

  // Stamp duty is calculated on the dutiable value (approximately FBT base)
  const stampDuty = fbtValue * stampDutyRate

  // Registration (approximately $950)
  const registration = BASE_REGISTRATION

  // Clean amount financed = (FBT Base + Rego + Stamp Duty) - GST
  const cleanAmountFinanced = fbtValue + registration + stampDuty - gst

  return cleanAmountFinanced
}

/**
 * Calculate expected financing amount for comparison
 * Uses the same calculation as calculateAmountFinanced for consistency
 */
export function calculateExpectedFinancing(driveAwayPrice, fbtBaseValue, state = 'VIC') {
  if (driveAwayPrice && driveAwayPrice > 0) {
    const expected = driveAwayPrice + 500 // establishment fee
    return {
      expected,
      method: 'drive-away',
      breakdown: `$${driveAwayPrice.toLocaleString()} drive-away + $500 establishment fee`,
    }
  }

  // Use the same calculation as calculateAmountFinanced
  const expected = calculateAmountFinanced(fbtBaseValue, state)
  const stampDutyRate = STAMP_DUTY_RATES[state] || STAMP_DUTY_RATES.VIC
  const stampDuty = Math.round(fbtBaseValue * stampDutyRate)
  const gst = Math.round(fbtBaseValue - fbtBaseValue / 1.1)

  return {
    expected,
    method: 'fbt-based',
    breakdown: `$${fbtBaseValue.toLocaleString()} FBT + $${BASE_REGISTRATION} rego + $${stampDuty.toLocaleString()} stamp duty - $${gst.toLocaleString()} GST`,
  }
}

// ============================================
// INSURANCE DETECTION
// ============================================

// Real providers don't charge more than this - if calculated rate exceeds this,
// extras are likely financed in
const MAX_PROVIDER_RATE = 12.5

// Competitor average rate (millarX is lower at 7.5%)
const TARGET_MARKET_RATE = 10.0

/**
 * Detect if insurance/extras are financed by testing different amounts
 *
 * Logic: If calculated rate > 12.5%, real providers don't charge this much.
 * The "excess" rate is actually hidden extras financed in.
 * We estimate extras by finding what amount (added to clean amount) brings rate to ~10%
 *
 * @param {number} effectiveRate - Calculated effective rate using clean amount financed
 * @param {number} cleanAmountFinanced - Expected clean amount (vehicle + on-roads - GST)
 * @param {number} monthlyPayment - Monthly payment amount
 * @param {number} balloon - Balloon/residual value
 * @param {number} termMonths - Lease term in months
 * @param {number} paymentDeferral - Payment deferral in months
 * @returns {object} Detection result
 */
export function detectFinancedInsurance(
  effectiveRate,
  cleanAmountFinanced,
  monthlyPayment,
  balloon,
  termMonths,
  paymentDeferral
) {
  // If rate is within normal provider range, no extras detected
  if (effectiveRate <= MAX_PROVIDER_RATE) {
    return { detected: false }
  }

  // Rate > 12.5% = extras are LIKELY financed in
  // Estimate extras by finding what amount brings rate to typical market rate (~10%)
  const testAmounts = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 7000, 8000]

  for (const testAmount of testAmounts) {
    // ADD to clean amount (provider financed more than just the car)
    const adjustedFinanced = cleanAmountFinanced + testAmount
    const adjustedRate =
      calculateIRR(adjustedFinanced, monthlyPayment, balloon, termMonths, paymentDeferral) * 12 * 100

    if (isNaN(adjustedRate) || adjustedRate <= 0) continue

    // If adding this amount brings rate to market range (~10% +/- 1%)
    if (adjustedRate >= 9.0 && adjustedRate <= 11.0) {
      return {
        detected: true,
        estimatedExtras: testAmount,
        assumedRate: adjustedRate,
        confidence: 'high',
        explanation: `If underlying rate is ~${adjustedRate.toFixed(1)}%, approximately $${testAmount.toLocaleString()} in extras/insurance may be financed`,
      }
    }
  }

  // If rate is very high but we couldn't normalize with our test amounts
  return {
    detected: true,
    estimatedExtras: null, // Could be more than $8k
    assumedRate: null,
    confidence: 'medium',
    explanation: 'Rate exceeds typical provider maximum (12.5%). Extras are likely financed but amount unclear.',
  }
}

// ============================================
// MAIN ANALYSIS FUNCTION
// ============================================

/**
 * Analyze a lease quote and detect issues
 */
export function analyzeLeaseQuote({
  fbtValue,
  financePayment,
  paymentFrequency,
  residualValue,
  balloonIncludesGST,
  leaseTerm,
  shownRate,
  paymentDeferral = 2,
  state = 'VIC',
}) {
  // Convert payment to monthly (accounting for deferral - fewer actual payment months)
  const monthlyPayment = convertToMonthlyPayment(financePayment, paymentFrequency, leaseTerm, paymentDeferral)

  // Adjust residual if includes GST
  const adjustedResidual = balloonIncludesGST ? residualValue / 1.1 : residualValue

  // Calculate expected "clean" amount financed from FBT value + on-roads - GST
  const amountFinanced = calculateAmountFinanced(fbtValue, state)

  // Calculate periods
  const termMonths = leaseTerm * 12

  // Calculate effective rate using IRR
  const monthlyRate = calculateIRR(
    amountFinanced,
    monthlyPayment,
    adjustedResidual,
    termMonths,
    paymentDeferral
  )
  const effectiveRate = monthlyRate * 12 * 100

  // Calculate expected financing (same as amountFinanced for clean comparison)
  const expectedFinancing = calculateExpectedFinancing(null, fbtValue, state)

  // Account for deferred payments in financing excess calculation
  const deferredPaymentAmount = monthlyPayment * paymentDeferral
  const adjustedAmountFinanced = amountFinanced - deferredPaymentAmount
  const financingExcess = adjustedAmountFinanced - expectedFinancing.expected

  // Detect financed insurance
  const insuranceDetection = detectFinancedInsurance(
    effectiveRate,
    amountFinanced,
    monthlyPayment,
    adjustedResidual,
    termMonths,
    paymentDeferral
  )

  // Calculate total costs
  const totalPayments = monthlyPayment * termMonths
  const totalCashOutflow = totalPayments + adjustedResidual
  const totalInterest = totalCashOutflow - amountFinanced

  // Determine risk levels
  const highRiskThreshold = 2000
  const mediumRiskThreshold = 1000
  const lowRiskThreshold = 500

  const hasHighRiskPacks = financingExcess > highRiskThreshold
  const hasMediumRiskPacks = financingExcess > mediumRiskThreshold && financingExcess <= highRiskThreshold
  const hasLowRiskPacks = financingExcess > lowRiskThreshold && financingExcess <= mediumRiskThreshold

  // Calculate score
  let score = 10
  const penalties = []

  // Rate-based penalties
  if (effectiveRate > 12) {
    score = Math.min(score, 3)
    penalties.push('Extremely high effective rate')
  } else if (effectiveRate > 10) {
    score = Math.min(score, 5)
    penalties.push('High effective rate')
  } else if (effectiveRate > 8.5) {
    score -= 2
    penalties.push('Above average rate')
  }

  // Excess financing penalties
  if (hasHighRiskPacks || insuranceDetection.detected) {
    score = Math.min(score, 4)
    penalties.push('Significant excess costs detected')
  } else if (hasMediumRiskPacks) {
    score -= 2
    penalties.push('Moderate excess detected')
  } else if (hasLowRiskPacks) {
    score -= 1
    penalties.push('Minor excess detected')
  }

  // Determine rating
  let rating = 'good'
  if (score <= 3) {
    rating = 'warning'
  } else if (score <= 6) {
    rating = 'caution'
  }

  // Build issues array - WARNING ONLY, no specific numbers
  const issues = []

  if (effectiveRate > 10) {
    issues.push({
      severity: 'high',
      title: 'High Effective Interest Rate',
      description: 'The effective rate appears significantly above competitive market range. Request a Lease Rescue Pack for exact calculation.',
    })
  } else if (effectiveRate > 8.5) {
    issues.push({
      severity: 'medium',
      title: 'Above Average Interest Rate',
      description: 'The effective rate appears above typical market rates. Consider requesting a detailed breakdown from your provider.',
    })
  }

  if (insuranceDetection.detected) {
    issues.push({
      severity: 'high',
      title: 'Possible Extras/Insurance Financed',
      description: 'Analysis suggests additional products (insurance, gap cover, warranties) may be financed into your lease. Request a Lease Rescue Pack for a detailed breakdown.',
    })
  } else if (hasHighRiskPacks) {
    issues.push({
      severity: 'high',
      title: 'Excess Costs Detected',
      description: 'The amount financed appears higher than expected for this vehicle. Additional costs may be bundled in.',
    })
  } else if (hasMediumRiskPacks) {
    issues.push({
      severity: 'medium',
      title: 'Moderate Excess Detected',
      description: 'There may be some additional costs bundled into the financing. Ask your provider for a line-by-line breakdown.',
    })
  }

  return {
    effectiveRate,
    amountFinanced,
    adjustedResidual,
    monthlyPayment,
    totalPayments,
    totalCashOutflow,
    totalInterest,
    financingExcess,
    expectedFinancing,
    insuranceDetection,
    hasHighRiskPacks,
    hasMediumRiskPacks,
    hasLowRiskPacks,
    score: Math.max(1, Math.round(score)),
    rating,
    issues,
    penalties,
  }
}

// Helper function for currency formatting
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
