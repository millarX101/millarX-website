import {
  FIXED_RATE,
  ESTABLISHMENT_FEE,
  DEFERRAL_MONTHS,
  GST_CAP,
  BALLOON_PERCENTS,
  TAX_BRACKETS,
  RUNNING_COST_MULTIPLIERS,
  BASE_RUNNING_COSTS,
  FUEL_CONSUMPTION,
  FUEL_PRICE,
  EV_COST_PER_KM,
  HYBRID_EV_USAGE_RATIO,
  HYBRID_PETROL_CONSUMPTION,
  TYRES_COST_PER_SET,
  TYRES_KM_INTERVAL,
  PAY_PERIODS,
} from '../../lib/constants'
import { calculateStampDuty } from '../../utils/stampDutyCalculator'
import { getAnnualRegistration } from '../../utils/registrationCalculator'

/**
 * Calculate income tax savings from pre-tax deductions
 */
export function calculateIncomeTaxSavings(income, preTaxDeduct) {
  const taxable = Math.max(0, income - preTaxDeduct)

  let tax = 0
  for (const [lo, hi, rate, base] of TAX_BRACKETS) {
    if (taxable > lo) {
      tax = base + (Math.min(taxable, hi) - lo) * rate
    } else {
      break
    }
  }

  let taxNoDeduct = 0
  for (const [lo, hi, rate, base] of TAX_BRACKETS) {
    if (income > lo) {
      taxNoDeduct = base + (Math.min(income, hi) - lo) * rate
    } else {
      break
    }
  }

  return taxNoDeduct - tax
}

/**
 * Calculate on-road costs (registration + stamp duty)
 * Now uses accurate state-based calculations
 */
export function calculateOnRoadCosts(basePrice, state = 'VIC', isEV = false) {
  // Use accurate state-based stamp duty calculation
  const stampDuty = calculateStampDuty(state, basePrice, isEV)

  // Use accurate state-based registration (annual, includes CTP)
  const registration = getAnnualRegistration(state, isEV)

  return {
    registration,
    stampDuty,
    total: registration + stampDuty,
    driveAwayPrice: basePrice + stampDuty, // Note: rego is annual running cost, not upfront
  }
}

/**
 * Main calculator function
 */
export function calculateLease(inputs) {
  const {
    vehiclePrice,
    annualSalary,
    leaseTermYears,
    fuelType,
    annualKm,
    state = 'VIC',
    includeSuperInSalary = false,
    payPeriod = 'monthly',
    isOnRoadPriceIncluded = false,
  } = inputs

  const isEV = fuelType === 'Electric Vehicle' || fuelType === 'ev'
  const isHybrid = fuelType === 'Hybrid'
  const carType = isEV ? 'Electric Vehicle' : (isHybrid ? 'Hybrid' : fuelType)

  // Handle on-road costs with accurate state-based calculations
  let baseVehiclePrice, driveAwayPrice, onRoadCosts, stamp, rego

  if (isOnRoadPriceIncluded) {
    driveAwayPrice = vehiclePrice
    // Use accurate stamp duty calculation even for drive-away prices
    stamp = calculateStampDuty(state, driveAwayPrice, isEV)
    rego = getAnnualRegistration(state, isEV)
    onRoadCosts = { registration: rego, stampDuty: stamp, total: stamp + rego }
  } else {
    baseVehiclePrice = vehiclePrice
    onRoadCosts = calculateOnRoadCosts(baseVehiclePrice, state, isEV)
    stamp = onRoadCosts.stampDuty
    rego = onRoadCosts.registration
    driveAwayPrice = baseVehiclePrice + stamp // Stamp duty added to drive-away
  }

  // Finance calculations
  const termMonths = leaseTermYears * 12
  const annualRate = FIXED_RATE
  const monthlyRate = annualRate / 12

  const baseVehicle = driveAwayPrice - stamp - rego
  const gstExBase = baseVehicle / 1.1
  const gstOnCar = baseVehicle - gstExBase
  const claimableGST = Math.min(gstOnCar, GST_CAP * 0.1)
  const gstNonClaim = gstOnCar - claimableGST

  const naf = gstExBase + gstNonClaim + stamp + rego + ESTABLISHMENT_FEE
  const balloonPercentage = BALLOON_PERCENTS[leaseTermYears] || 0.4688
  const balloon = naf * balloonPercentage

  const amountFin = naf
  const principalInt = amountFin * Math.pow(1 + monthlyRate, DEFERRAL_MONTHS)

  const repayments = termMonths - DEFERRAL_MONTHS
  const factor = Math.pow(1 + monthlyRate, repayments)
  const monthlyPayment =
    (principalInt * monthlyRate - (balloon * monthlyRate) / factor) /
    (1 - 1 / factor)

  // Running costs
  const multiplier = RUNNING_COST_MULTIPLIERS[carType] || 1

  // Tyres calculation: cost per set every X km
  const tyresCostPerYear = (annualKm / TYRES_KM_INTERVAL) * TYRES_COST_PER_SET

  // Fuel/electricity cost
  let fuelCost
  if (isEV) {
    fuelCost = annualKm * EV_COST_PER_KM
  } else if (isHybrid) {
    // Blended cost: 55% electric + 45% petrol
    const electricKm = annualKm * HYBRID_EV_USAGE_RATIO
    const petrolKm = annualKm * (1 - HYBRID_EV_USAGE_RATIO)
    const electricCost = electricKm * EV_COST_PER_KM
    const petrolCost = (petrolKm / 100) * HYBRID_PETROL_CONSUMPTION * FUEL_PRICE
    fuelCost = electricCost + petrolCost
  } else {
    const lph = FUEL_CONSUMPTION[carType] || 10
    fuelCost = (annualKm / 100) * lph * FUEL_PRICE
  }

  const totalRunningCosts =
    (BASE_RUNNING_COSTS.insurance +
      BASE_RUNNING_COSTS.rego +
      BASE_RUNNING_COSTS.service +
      tyresCostPerYear +
      fuelCost) *
    multiplier

  const annualLeasePayment = monthlyPayment * 12
  const totalAnnualCost = annualLeasePayment + totalRunningCosts

  // Tax calculations
  let employeeContribution, preTaxAmount, incomeTaxSavings, rfbtAmount, fbtBaseValue

  fbtBaseValue = baseVehicle

  if (isEV) {
    employeeContribution = 0
    preTaxAmount = totalAnnualCost
    incomeTaxSavings = calculateIncomeTaxSavings(annualSalary, preTaxAmount)
    rfbtAmount = fbtBaseValue * 0.2 * 1.8868
  } else {
    employeeContribution = fbtBaseValue * 0.2
    preTaxAmount = totalAnnualCost - employeeContribution
    incomeTaxSavings = calculateIncomeTaxSavings(annualSalary, preTaxAmount)
    rfbtAmount = 0
  }

  const netAnnualCost = employeeContribution + (preTaxAmount - incomeTaxSavings)

  // Pay period calculations
  const periodsPerYear = PAY_PERIODS[payPeriod] || 12

  // Individual running cost components
  const runningCostsBreakdown = {
    insurance: (BASE_RUNNING_COSTS.insurance * multiplier) / periodsPerYear,
    registration: (BASE_RUNNING_COSTS.rego * multiplier) / periodsPerYear,
    service: (BASE_RUNNING_COSTS.service * multiplier) / periodsPerYear,
    tyres: (tyresCostPerYear * multiplier) / periodsPerYear,
    fuel: (fuelCost * multiplier) / periodsPerYear,
  }

  return {
    // Summary
    annualTaxSavings: incomeTaxSavings,
    monthlyNetCost: netAnnualCost / 12,
    totalSavingsVsBuying: incomeTaxSavings * leaseTermYears,

    // Period-based values
    leasePaymentPerPeriod: annualLeasePayment / periodsPerYear,
    runningCostsPerPeriod: totalRunningCosts / periodsPerYear,
    totalCostPerPeriod: totalAnnualCost / periodsPerYear,
    employeeContribPerPeriod: employeeContribution / periodsPerYear,
    preTaxAmountPerPeriod: preTaxAmount / periodsPerYear,
    incomeTaxSavingsPerPeriod: incomeTaxSavings / periodsPerYear,
    netCostPerPeriod: netAnnualCost / periodsPerYear,

    // Running costs breakdown
    runningCostsBreakdown,

    // Annual values
    annualLeasePayment,
    totalRunningCosts,
    totalAnnualCost,
    employeeContribution,
    preTaxAmount,
    netAnnualCost,

    // Finance details
    financeRate: annualRate,
    residualValue: balloon,
    residualPercentage: balloonPercentage,
    netAmountFinanced: naf,

    // GST
    claimableGST,
    gstExBase,

    // FBT
    fbtBaseValue,
    fbtExempt: isEV,
    rfbtAmount: isEV ? rfbtAmount : 0,

    // Vehicle pricing
    baseVehiclePrice: baseVehicle,
    driveAwayPrice,
    onRoadCosts,

    // Breakdown for display
    breakdown: [
      {
        category: 'Vehicle Finance',
        preTaxAnnual: annualLeasePayment,
        postTaxAnnual: annualLeasePayment - incomeTaxSavings * (annualLeasePayment / totalAnnualCost),
        savings: incomeTaxSavings * (annualLeasePayment / totalAnnualCost),
      },
      {
        category: isEV ? 'Electricity' : (isHybrid ? 'Fuel (Blended)' : 'Fuel'),
        preTaxAnnual: fuelCost * multiplier,
        postTaxAnnual: fuelCost * multiplier * 0.7,
        savings: fuelCost * multiplier * 0.3,
      },
      {
        category: 'Registration',
        preTaxAnnual: BASE_RUNNING_COSTS.rego * multiplier,
        postTaxAnnual: BASE_RUNNING_COSTS.rego * multiplier * 0.7,
        savings: BASE_RUNNING_COSTS.rego * multiplier * 0.3,
      },
      {
        category: 'Insurance',
        preTaxAnnual: BASE_RUNNING_COSTS.insurance * multiplier,
        postTaxAnnual: BASE_RUNNING_COSTS.insurance * multiplier * 0.7,
        savings: BASE_RUNNING_COSTS.insurance * multiplier * 0.3,
      },
      {
        category: 'Tyres & Servicing',
        preTaxAnnual: (BASE_RUNNING_COSTS.service + tyresCostPerYear) * multiplier,
        postTaxAnnual: (BASE_RUNNING_COSTS.service + tyresCostPerYear) * multiplier * 0.7,
        savings: (BASE_RUNNING_COSTS.service + tyresCostPerYear) * multiplier * 0.3,
      },
    ],

    // Adjusted income for benefits (EV only)
    adjustedReportableIncome: isEV
      ? annualSalary - totalAnnualCost + rfbtAmount
      : annualSalary,

    // Input reference
    inputs: {
      vehiclePrice,
      annualSalary,
      leaseTermYears,
      fuelType,
      annualKm,
      state,
      payPeriod,
      isEV,
      isHybrid,
    },
  }
}
