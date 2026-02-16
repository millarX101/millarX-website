import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Zap, Car, Search, Fuel } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CurrencySlider, KilometerSlider, YearSlider } from '../ui/Slider'
import Select from '../ui/Select'
import { TooltipIcon } from '../ui/Tooltip'
import Card from '../ui/Card'
import { cn } from '../../lib/utils'
import {
  POPULAR_EVS,
  VEHICLE_TYPES,
  LEASE_TERMS,
  STATES,
  PAY_PERIODS,
  EV_FBT_THRESHOLD,
  INDICATIVE_TERM_RATES,
} from '../../lib/constants'

export default function CalculatorInputs({ inputs, updateInput, showAdvanced = false }) {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(showAdvanced)
  const isEV = inputs.fuelType === 'Electric Vehicle'
  const isHybrid = inputs.fuelType === 'Hybrid'

  // Convert popular EVs to options format
  const popularEVOptions = [
    { value: '', label: 'Select a popular EV (optional)' },
    ...Object.entries(POPULAR_EVS).map(([key, ev]) => ({
      value: key,
      label: `${ev.make} ${ev.model} ${ev.trim} - $${ev.price.toLocaleString()}`,
    })),
  ]

  // Vehicle type options
  const vehicleTypeOptions = VEHICLE_TYPES.map((type) => ({
    value: type,
    label: type,
  }))

  // State options
  const stateOptions = STATES

  // Pay period options
  const payPeriodOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'fortnightly', label: 'Fortnightly' },
    { value: 'monthly', label: 'Monthly' },
  ]

  return (
    <Card className="h-full">
      <h3 className="text-display-sm font-serif text-mx-slate-900 mb-6">
        Your Details
      </h3>

      <div className="space-y-6">
        {/* Vehicle Type */}
        <div>
          <label className="block text-body font-medium text-mx-slate-700 mb-3">
            Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => updateInput('fuelType', 'Electric Vehicle')}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 transition-all',
                isEV
                  ? 'border-mx-purple-500 bg-mx-purple-50 text-mx-purple-700'
                  : 'border-mx-slate-200 hover:border-mx-slate-300 text-mx-slate-600'
              )}
            >
              <Zap size={20} />
              <span className="font-medium text-sm">Electric</span>
            </button>
            <button
              type="button"
              onClick={() => updateInput('fuelType', 'Hybrid')}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 transition-all',
                isHybrid
                  ? 'border-mx-purple-500 bg-mx-purple-50 text-mx-purple-700'
                  : 'border-mx-slate-200 hover:border-mx-slate-300 text-mx-slate-600'
              )}
            >
              <Fuel size={20} />
              <span className="font-medium text-sm">Hybrid</span>
            </button>
            <button
              type="button"
              onClick={() => updateInput('fuelType', 'SUV')}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-lg border-2 transition-all',
                !isEV && !isHybrid
                  ? 'border-mx-purple-500 bg-mx-purple-50 text-mx-purple-700'
                  : 'border-mx-slate-200 hover:border-mx-slate-300 text-mx-slate-600'
              )}
            >
              <Car size={20} />
              <span className="font-medium text-sm">Petrol/Diesel</span>
            </button>
          </div>
        </div>

        {/* EV FBT Badge */}
        {isEV && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 bg-teal-50 border border-teal-200 rounded-lg"
          >
            <Zap className="text-teal-600" size={18} />
            <span className="text-body-sm text-teal-700">
              <strong>FBT Exempt</strong> - EVs under ${EV_FBT_THRESHOLD.toLocaleString()} are exempt from Fringe Benefits Tax
            </span>
          </motion.div>
        )}

        {/* Browse Vehicles Button (for EVs and Hybrids) */}
        {(isEV || isHybrid) && (
          <div>
            <label className="flex items-center gap-2 text-body font-medium text-mx-slate-700 mb-3">
              <Car size={20} className="text-mx-purple-600" />
              Vehicle Details
            </label>
            <Link
              to="/browse-evs"
              className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              <Search size={20} />
              Browse Vehicles
              <Zap size={20} />
            </Link>
            <p className="text-body-sm text-mx-slate-500 mt-2 text-center">
              View our EV and hybrid catalogue with competitive pricing
            </p>
          </div>
        )}

        {/* Non-EV/Hybrid Vehicle Type Selection */}
        {!isEV && !isHybrid && (
          <Select
            label="Vehicle Category"
            options={vehicleTypeOptions.filter(o => o.value !== 'Electric Vehicle' && o.value !== 'Hybrid')}
            value={inputs.fuelType}
            onChange={(e) => updateInput('fuelType', e.target.value)}
          />
        )}

        {/* Vehicle Price */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-body font-medium text-mx-slate-700">
                Vehicle Price
              </label>
              <TooltipIcon
                content={
                  isEV
                    ? "Popular EV prices are drive-away. Manual entry assumes base price - we'll estimate on-road costs."
                    : "Enter the vehicle's base price. We'll estimate registration and stamp duty for your state."
                }
              />
            </div>
            <span className="text-body-lg font-semibold text-mx-purple-700 font-mono">
              ${inputs.vehiclePrice.toLocaleString()}
            </span>
          </div>
          <CurrencySlider
            value={inputs.vehiclePrice}
            onChange={(value) => updateInput('vehiclePrice', value)}
            min={10000}
            max={isEV ? EV_FBT_THRESHOLD : 150000}
            step={500}
          />
          {!inputs.isOnRoadPriceIncluded && (
            <p className="text-body-sm text-mx-slate-500 mt-2">
              We'll estimate on-road costs in your quote
            </p>
          )}
        </div>

        {/* Annual Salary */}
        <CurrencySlider
          label="Annual Salary"
          value={inputs.annualSalary}
          onChange={(value) => updateInput('annualSalary', value)}
          min={30000}
          max={300000}
          step={1000}
        />

        {/* Lease Term */}
        <YearSlider
          label="Lease Term"
          value={inputs.leaseTermYears}
          onChange={(value) => updateInput('leaseTermYears', value)}
          min={1}
          max={5}
        />

        {/* Annual Kilometers */}
        <KilometerSlider
          label="Annual Kilometres"
          value={inputs.annualKm}
          onChange={(value) => updateInput('annualKm', value)}
          min={5000}
          max={50000}
          step={1000}
        />

        {/* Pay Frequency */}
        <Select
          label="Pay Frequency"
          options={payPeriodOptions}
          value={inputs.payPeriod}
          onChange={(e) => updateInput('payPeriod', e.target.value)}
        />

        {/* State Selection - Affects stamp duty and registration */}
        <Select
          label="State/Territory"
          options={stateOptions}
          value={inputs.state}
          onChange={(e) => updateInput('state', e.target.value)}
          helperText="Affects stamp duty and registration costs"
        />

        {/* Interest Rate Info - Dynamic by term */}
        <div className="p-4 bg-mx-slate-50 rounded-lg border border-mx-slate-200">
          <div className="flex justify-between text-body-sm">
            <span className="text-mx-slate-600">Indicative Interest Rate</span>
            <span className="font-semibold text-mx-purple-700">
              {((INDICATIVE_TERM_RATES[inputs.leaseTermYears] || 0.075) * 100).toFixed(2)}% p.a.
            </span>
          </div>
          <p className="text-body-sm text-mx-slate-500 mt-2">
            Indicative rate for a {inputs.leaseTermYears}-year term. Actual rates depend on
            market conditions and individual assessment at time of application.
          </p>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          className="flex items-center gap-2 text-body text-mx-purple-600 hover:text-mx-purple-700 transition-colors"
        >
          {showAdvancedOptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          <span>Advanced Options</span>
        </button>

        {/* Advanced Options - Currently empty, kept for future use */}
        <AnimatePresence>
          {showAdvancedOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 overflow-hidden"
            >
              {/* Interstate car delivery */}
              <div className="p-4 bg-mx-slate-50 rounded-lg border border-mx-slate-200">
                <p className="text-body-sm font-medium text-mx-slate-700 mb-1">
                  Buying from interstate?
                </p>
                <p className="text-body-sm text-mx-slate-500">
                  Estimate vehicle delivery costs with our sister site{' '}
                  <a
                    href="https://www.landedx.com.au"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mx-purple-600 hover:text-mx-purple-700 underline"
                  >
                    LandedX
                  </a>
                  . Get any used car delivered to your door from any state.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}
