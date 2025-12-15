import { motion } from 'framer-motion'
import { TrendingUp, ChevronDown, FileText, MessageCircle } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { CountUp } from '../shared/AnimatedNumber'
import { formatCurrency, formatPercentage, capitalize } from '../../lib/utils'
import { fadeInUp } from '../../lib/animations'

export default function CalculatorResults({
  results,
  payPeriod,
  isEV,
  onShowBreakdown,
  onGetQuote,
}) {
  const periodLabel = capitalize(payPeriod)

  return (
    <Card className="h-full">
      <h3 className="text-display-sm font-serif text-mx-slate-900 mb-6">
        Your Cost
      </h3>

      <div className="space-y-6">
        {/* Main cost highlight - what you actually pay */}
        <motion.div
          className="p-6 rounded-xl bg-gradient-to-br from-mx-purple-600 to-mx-purple-800 text-white"
          {...fadeInUp}
        >
          <p className="text-body opacity-80 mb-1">Your Net Cost ({periodLabel})</p>
          <div className="text-4xl font-bold font-mono">
            <CountUp value={results.netCostPerPeriod} format="currency" />
          </div>
          <p className="text-body-sm opacity-70 mt-2">
            After tax savings applied to your pay
          </p>
        </motion.div>

        {/* Tax savings - secondary info */}
        <div className="p-4 rounded-lg bg-mx-teal-50 border border-mx-teal-200">
          <div className="flex justify-between items-center">
            <span className="text-body text-mx-teal-700">Annual Tax Savings</span>
            <span className="text-body-lg font-bold text-mx-teal-700 font-mono">
              {formatCurrency(results.annualTaxSavings)}
            </span>
          </div>
          <p className="text-body-sm text-mx-teal-600 mt-1">
            Over {results.inputs?.leaseTermYears || 3} years: {formatCurrency(results.totalSavingsVsBuying)}
          </p>
        </div>

        {/* Cost summary */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b border-mx-slate-100">
            <span className="text-body text-mx-slate-600">Lease Payment</span>
            <span className="text-body font-semibold font-mono text-mx-slate-900">
              {formatCurrency(results.leasePaymentPerPeriod)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-mx-slate-100">
            <span className="text-body text-mx-slate-600">
              Running Costs ({isEV ? 'Elec' : 'Fuel'}, Rego, etc.)
            </span>
            <span className="text-body font-semibold font-mono text-mx-slate-900">
              {formatCurrency(results.runningCostsPerPeriod)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-mx-slate-100">
            <span className="text-body font-semibold text-mx-slate-800">
              Total Package Cost
            </span>
            <span className="text-body-lg font-bold font-mono text-mx-slate-900">
              {formatCurrency(results.totalCostPerPeriod)}
            </span>
          </div>

          {/* ECM for non-EVs */}
          {!isEV && results.employeeContribPerPeriod > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-mx-slate-100">
              <span className="text-body text-amber-600">
                Employee Contribution (Post-Tax)
              </span>
              <span className="text-body font-semibold font-mono text-amber-600">
                {formatCurrency(results.employeeContribPerPeriod)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-3 border-b border-mx-slate-100">
            <span className="text-body text-mx-slate-600">Pre-Tax Deduction</span>
            <span className="text-body font-semibold font-mono text-mx-slate-900">
              {formatCurrency(results.preTaxAmountPerPeriod)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 text-mx-teal-600">
            <span className="text-body">Tax Savings</span>
            <span className="text-body font-semibold font-mono">
              -{formatCurrency(results.incomeTaxSavingsPerPeriod)}
            </span>
          </div>
        </div>

        {/* Finance details */}
        <div className="p-4 bg-mx-slate-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-body-sm">
            <div>
              <span className="text-mx-slate-500">Interest Rate</span>
              <p className="font-semibold text-mx-purple-700">
                {formatPercentage(results.financeRate)} p.a.
              </p>
            </div>
            <div>
              <span className="text-mx-slate-500">Balloon Payment</span>
              <p className="font-semibold text-mx-purple-700">
                {formatCurrency(results.residualValue)}
              </p>
            </div>
          </div>
          <p className="text-body-sm text-mx-slate-500 mt-3">
            {formatPercentage(results.residualPercentage)} residual at end of lease
          </p>
        </div>

        {/* EV FBT Info */}
        {isEV && (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-body-sm font-semibold text-teal-700 mb-2">
              FBT Exempt - EV Benefit
            </p>
            <p className="text-body-sm text-teal-600">
              RFBT Amount: {formatCurrency(results.rfbtAmount)} annually
            </p>
            <p className="text-body-sm text-teal-600 mt-1">
              Adjusted Reportable Income: {formatCurrency(results.adjustedReportableIncome)}
            </p>
          </div>
        )}

        {/* ECM Info for non-EVs */}
        {!isEV && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-body-sm font-semibold text-amber-700 mb-2">
              Employee Contribution Method (ECM)
            </p>
            <p className="text-body-sm text-amber-600">
              You pay {formatCurrency(results.employeeContribution)} annually post-tax
              (FBT Base Value x 20%)
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3 pt-4">
          <Button
            variant="secondary"
            fullWidth
            icon={<ChevronDown size={18} />}
            iconPosition="right"
            onClick={onShowBreakdown}
          >
            View Full Breakdown
          </Button>

          <Button
            variant="primary"
            fullWidth
            icon={<MessageCircle size={18} />}
            onClick={onGetQuote}
          >
            Get a Formal Quote
          </Button>
        </div>
      </div>
    </Card>
  )
}
