import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Car, User, Briefcase } from 'lucide-react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import Honeypot, { isSpamSubmission } from '../ui/Honeypot'
import { saveQuoteRequest } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'
import { STATES } from '../../lib/constants'

export default function QuoteForm({
  isOpen,
  onClose,
  calculationInputs,
  calculationResults,
  source = 'website',
}) {
  const [step, setStep] = useState(1) // Multi-step form
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    name: '',
    email: '',
    phone: '',
    // Step 2: Employment & Vehicle
    employer: '',
    state: calculationInputs?.state || 'VIC',
    annualSalary: calculationInputs?.annualSalary || '',
    annualKm: calculationInputs?.annualKm || '',
    // Step 3: Vehicle Details - pre-fill from calculator if available
    vehicleMake: calculationInputs?.vehicleMake || '',
    vehicleModel: calculationInputs?.vehicleModel || '',
    vehicleVariant: calculationInputs?.vehicleVariant || '',
    // Default to 'no' if vehicle is already selected, 'yes' otherwise
    needSourcingHelp: calculationInputs?.vehicleMake ? 'no' : 'yes',
    // Honeypot field for spam prevention
    website: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const stateOptions = STATES

  // Helper to get vehicle display name from various sources
  const getVehicleDisplayName = () => {
    // First try structured vehicle data
    if (formData.vehicleMake || formData.vehicleModel) {
      return [formData.vehicleMake, formData.vehicleModel, formData.vehicleVariant].filter(Boolean).join(' ')
    }
    // Then try selectedEV from calculator
    if (calculationInputs?.selectedEV) {
      return calculationInputs.selectedEV
    }
    // Fallback to generic description
    return `${calculationInputs?.fuelType || 'Vehicle'} - ${formatCurrency(calculationResults?.driveAwayPrice || 0)}`
  }

  // Sync form data when modal opens with new calculator inputs
  // Always use calculator values (they represent the user's current selections)
  useEffect(() => {
    if (isOpen && calculationInputs) {
      setFormData(prev => ({
        ...prev,
        state: calculationInputs.state || 'VIC',
        annualSalary: calculationInputs.annualSalary || '',
        annualKm: calculationInputs.annualKm || '',
        vehicleMake: calculationInputs.vehicleMake || '',
        vehicleModel: calculationInputs.vehicleModel || '',
        vehicleVariant: calculationInputs.vehicleVariant || '',
        needSourcingHelp: (calculationInputs.vehicleMake || calculationInputs.selectedEV) ? 'no' : 'yes',
      }))
    }
  }, [isOpen, calculationInputs])

  const sourcingOptions = [
    { value: 'yes', label: "Yes, help me find the best deal" },
    { value: 'no', label: "No, I've already found my car" },
    { value: 'unsure', label: "I'm not sure yet" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      return formData.name && formData.email
    }
    if (stepNum === 2) {
      return formData.employer && formData.state
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Spam check - if honeypot field is filled, silently "succeed"
    if (isSpamSubmission(formData.website)) {
      // Fake success to not alert bot
      setSubmitted(true)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Build vehicle description
      const vehicleDescription = [
        formData.vehicleMake,
        formData.vehicleModel,
        formData.vehicleVariant,
      ].filter(Boolean).join(' ') || calculationInputs?.selectedEV || 'Not specified'

      const quoteData = {
        // Contact details
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,

        // Employment details
        employer: formData.employer,
        state: formData.state,

        // Vehicle details (explicit fields for mxDriveIQ)
        vehicle_make: formData.vehicleMake || null,
        vehicle_model: formData.vehicleModel || null,
        vehicle_variant: formData.vehicleVariant || null,
        vehicle_description: vehicleDescription,
        need_sourcing_help: formData.needSourcingHelp,

        // Calculator inputs (full snapshot)
        calculation_inputs: {
          ...calculationInputs,
          // Override with form values if they were changed
          annualSalary: formData.annualSalary || calculationInputs?.annualSalary,
          annualKm: formData.annualKm || calculationInputs?.annualKm,
          state: formData.state,
        },

        // Calculator results
        calculation_results: {
          annualTaxSavings: calculationResults.annualTaxSavings,
          netCostPerPeriod: calculationResults.netCostPerPeriod,
          totalCostPerPeriod: calculationResults.totalCostPerPeriod,
          driveAwayPrice: calculationResults.driveAwayPrice,
          residualValue: calculationResults.residualValue,
          fbtExempt: calculationResults.fbtExempt,
          monthlyFinance: calculationResults.monthlyFinance || calculationResults.breakdown?.finance || 0,
          monthlyRunningCosts: calculationResults.monthlyRunningCosts || calculationResults.breakdown?.runningCosts || 0,
          monthlyFBT: calculationResults.monthlyFBT || calculationResults.breakdown?.fbt || 0,
          naf: calculationResults.naf,
          gstCredit: calculationResults.gstCredit,
          stampDuty: calculationResults.stampDuty,
        },

        // Tracking
        source,
        source_page: window.location.pathname,
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        status: 'new',
      }

      const { error: saveError } = await saveQuoteRequest(quoteData)

      if (saveError) {
        console.error('Error saving quote:', saveError)
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting form:', err)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      employer: '',
      state: calculationInputs?.state || 'VIC',
      annualSalary: calculationInputs?.annualSalary || '',
      annualKm: calculationInputs?.annualKm || '',
      // Keep vehicle pre-fill from calculator
      vehicleMake: calculationInputs?.vehicleMake || '',
      vehicleModel: calculationInputs?.vehicleModel || '',
      vehicleVariant: calculationInputs?.vehicleVariant || '',
      needSourcingHelp: calculationInputs?.vehicleMake ? 'no' : 'yes',
    })
    setStep(1)
    setSubmitted(false)
    setError(null)
    onClose()
  }

  // Success screen
  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Quote Request Sent" size="md">
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center"
          >
            <CheckCircle className="text-teal-600" size={40} />
          </motion.div>
          <h3 className="text-display-sm font-serif text-mx-slate-900 mb-3">
            Thank You, {formData.name.split(' ')[0]}!
          </h3>
          <p className="text-body text-mx-slate-600 mb-6">
            We've received your quote request. Our team will be in touch within 24 hours
            with a detailed quote tailored to your needs.
          </p>
          <div className="p-4 bg-mx-slate-50 rounded-lg text-left mb-6 space-y-2">
            <p className="text-body-sm text-mx-slate-600">
              <strong>Your details:</strong>
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-body-sm">
              <span className="text-mx-slate-500">Vehicle:</span>
              <span className="text-mx-slate-800">
                {getVehicleDisplayName()}
              </span>
              <span className="text-mx-slate-500">Annual savings:</span>
              <span className="text-mx-purple-700 font-medium">
                {formatCurrency(calculationResults.annualTaxSavings)}
              </span>
              <span className="text-mx-slate-500">Employer:</span>
              <span className="text-mx-slate-800">{formData.employer}</span>
            </div>
          </div>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Get a Formal Quote" size="lg">
      <form onSubmit={handleSubmit}>
        {/* Honeypot field - hidden from humans, catches bots */}
        <Honeypot value={formData.website} onChange={handleChange} />

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s
                    ? 'bg-mx-purple-600 text-white'
                    : 'bg-mx-slate-200 text-mx-slate-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 mx-1 rounded ${
                    step > s ? 'bg-mx-purple-600' : 'bg-mx-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {/* Vehicle Summary Banner */}
            <div className="p-3 bg-mx-purple-50 border border-mx-purple-200 rounded-lg flex items-center gap-3">
              <Car className="text-mx-purple-600 flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-mx-purple-800 truncate">
                  {getVehicleDisplayName()}
                </p>
                <p className="text-body-sm text-mx-purple-600">
                  {formatCurrency(calculationResults?.driveAwayPrice || 0)} • Save {formatCurrency(calculationResults?.annualTaxSavings || 0)}/yr
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-mx-purple-100 flex items-center justify-center">
                <User className="text-mx-purple-600" size={20} />
              </div>
              <div>
                <h3 className="text-body-lg font-semibold text-mx-slate-900">Your Details</h3>
                <p className="text-body-sm text-mx-slate-500">How can we contact you?</p>
              </div>
            </div>

            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Smith"
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />

            <Input
              label="Phone Number (optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0400 000 000"
              helperText="For faster response if needed"
            />

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                disabled={!validateStep(1)}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Employment Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            {/* Vehicle Summary Banner */}
            <div className="p-3 bg-mx-purple-50 border border-mx-purple-200 rounded-lg flex items-center gap-3">
              <Car className="text-mx-purple-600 flex-shrink-0" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-medium text-mx-purple-800 truncate">
                  {getVehicleDisplayName()}
                </p>
                <p className="text-body-sm text-mx-purple-600">
                  {formatCurrency(calculationResults?.driveAwayPrice || 0)} • Save {formatCurrency(calculationResults?.annualTaxSavings || 0)}/yr
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-mx-purple-100 flex items-center justify-center">
                <Briefcase className="text-mx-purple-600" size={20} />
              </div>
              <div>
                <h3 className="text-body-lg font-semibold text-mx-slate-900">Employment Details</h3>
                <p className="text-body-sm text-mx-slate-500">For salary packaging setup</p>
              </div>
            </div>

            <Input
              label="Employer Name"
              name="employer"
              value={formData.employer}
              onChange={handleChange}
              placeholder="Company Pty Ltd"
              required
              helperText="We'll check if they're already set up for novated leasing"
            />

            <Select
              label="State/Territory"
              name="state"
              value={formData.state}
              onChange={handleChange}
              options={stateOptions}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Annual Salary"
                name="annualSalary"
                type="number"
                value={formData.annualSalary}
                onChange={handleChange}
                placeholder={calculationInputs?.annualSalary?.toString() || "85000"}
                helperText="Pre-tax income"
              />
              <Input
                label="Annual KMs"
                name="annualKm"
                type="number"
                value={formData.annualKm}
                onChange={handleChange}
                placeholder={calculationInputs?.annualKm?.toString() || "15000"}
                helperText="Estimated yearly"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                disabled={!validateStep(2)}
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Vehicle Details */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-mx-purple-100 flex items-center justify-center">
                <Car className="text-mx-purple-600" size={20} />
              </div>
              <div>
                <h3 className="text-body-lg font-semibold text-mx-slate-900">Vehicle Details</h3>
                <p className="text-body-sm text-mx-slate-500">What car are you looking at?</p>
              </div>
            </div>

            {/* Show calculator summary */}
            <div className="p-4 bg-mx-purple-50 border border-mx-purple-200 rounded-lg">
              <p className="text-body-sm text-mx-purple-700 mb-2">
                <strong>From your calculation:</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 text-body-sm">
                <span className="text-mx-purple-600">Type:</span>
                <span className="text-mx-purple-800 font-medium">
                  {calculationInputs?.fuelType}
                </span>
                <span className="text-mx-purple-600">Budget:</span>
                <span className="text-mx-purple-800 font-medium">
                  {formatCurrency(calculationResults.driveAwayPrice)}
                </span>
                <span className="text-mx-purple-600">Annual savings:</span>
                <span className="text-mx-purple-800 font-medium">
                  {formatCurrency(calculationResults.annualTaxSavings)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Make"
                name="vehicleMake"
                value={formData.vehicleMake}
                onChange={handleChange}
                placeholder="Tesla"
              />
              <Input
                label="Model"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                placeholder="Model 3"
              />
              <Input
                label="Variant"
                name="vehicleVariant"
                value={formData.vehicleVariant}
                onChange={handleChange}
                placeholder="Long Range"
              />
            </div>

            <Select
              label="Do you need help sourcing the vehicle?"
              name="needSourcingHelp"
              value={formData.needSourcingHelp}
              onChange={handleChange}
              options={sourcingOptions}
            />

            {error && (
              <p className="text-body-sm text-red-600 p-3 bg-red-50 rounded-lg">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={<Send size={18} />}
                className="flex-1"
              >
                Send Request
              </Button>
            </div>

            <p className="text-body-sm text-mx-slate-500 text-center">
              No spam, no sales pressure. Just transparent information.
            </p>
          </motion.div>
        )}
      </form>
    </Modal>
  )
}
