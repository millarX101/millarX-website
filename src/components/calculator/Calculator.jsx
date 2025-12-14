import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import CalculatorInputs from './CalculatorInputs'
import CalculatorResults from './CalculatorResults'
import CostBreakdown from './CostBreakdown'
import QuoteForm from './QuoteForm'
import { calculateLease } from './calculatorLogic'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import { POPULAR_EVS } from '../../lib/constants'

export default function Calculator({ source = 'website', showAdvanced = false }) {
  const [inputs, setInputs] = useState({
    vehiclePrice: 65000,
    annualSalary: 90000,
    leaseTermYears: 3,
    fuelType: 'Electric Vehicle',
    annualKm: 15000,
    state: 'VIC',
    payPeriod: 'monthly',
    isOnRoadPriceIncluded: false,
    selectedEV: '',
  })

  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  // Calculate results whenever inputs change
  const results = useMemo(() => {
    return calculateLease(inputs)
  }, [inputs])

  // Update input handler
  const updateInput = (key, value) => {
    setInputs((prev) => {
      const newInputs = { ...prev, [key]: value }

      // If selecting a popular EV, update price and mark as drive-away
      if (key === 'selectedEV' && value && POPULAR_EVS[value]) {
        const ev = POPULAR_EVS[value]
        newInputs.vehiclePrice = ev.price
        newInputs.isOnRoadPriceIncluded = true
        newInputs.fuelType = 'Electric Vehicle'
      }

      // If changing vehicle price manually, reset selected EV
      if (key === 'vehiclePrice' && prev.selectedEV) {
        newInputs.selectedEV = ''
        newInputs.isOnRoadPriceIncluded = false
      }

      // If changing fuel type away from EV, reset selected EV
      if (key === 'fuelType' && value !== 'Electric Vehicle') {
        newInputs.selectedEV = ''
      }

      return newInputs
    })
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left side - Inputs */}
        <motion.div variants={fadeInUp}>
          <CalculatorInputs
            inputs={inputs}
            updateInput={updateInput}
            showAdvanced={showAdvanced}
          />
        </motion.div>

        {/* Right side - Results */}
        <motion.div variants={fadeInUp}>
          <CalculatorResults
            results={results}
            payPeriod={inputs.payPeriod}
            isEV={inputs.fuelType === 'Electric Vehicle'}
            onShowBreakdown={() => setShowBreakdown(true)}
            onGetQuote={() => setShowQuoteForm(true)}
          />
        </motion.div>
      </div>

      {/* Cost Breakdown Section */}
      {showBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <CostBreakdown
            results={results}
            payPeriod={inputs.payPeriod}
            isEV={inputs.fuelType === 'Electric Vehicle'}
            onClose={() => setShowBreakdown(false)}
          />
        </motion.div>
      )}

      {/* Quote Form Modal */}
      <QuoteForm
        isOpen={showQuoteForm}
        onClose={() => setShowQuoteForm(false)}
        calculationInputs={inputs}
        calculationResults={results}
        source={source}
      />
    </motion.div>
  )
}
