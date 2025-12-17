import { motion } from 'framer-motion'
import { X, Download, Info } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { formatCurrency, formatPercentage, capitalize } from '../../lib/utils'
import { fadeInUp } from '../../lib/animations'

export default function CostBreakdown({ results, payPeriod, isEV, onClose }) {
  const periodLabel = capitalize(payPeriod)

  return (
    <motion.div {...fadeInUp}>
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-display-sm font-serif text-mx-slate-900">
            Full Cost Breakdown
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-mx-slate-500 hover:text-mx-slate-700 hover:bg-mx-slate-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Vehicle Pricing Section */}
        <div className="mb-8">
          <h4 className="text-body-lg font-semibold text-mx-purple-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mx-purple-500"></span>
            Vehicle Pricing & GST Treatment
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-mx-purple-200">
                  <th className="text-left py-3 px-4 text-body font-semibold text-mx-slate-700">
                    Item
                  </th>
                  <th className="text-right py-3 px-4 text-body font-semibold text-mx-slate-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-slate-100">
                <tr>
                  <td className="py-3 px-4 text-body text-mx-slate-600">
                    Base Vehicle Price (Inc. GST)
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                    {formatCurrency(results.baseVehiclePrice)}
                  </td>
                </tr>
                {!results.inputs?.isOnRoadPriceIncluded && (
                  <>
                    <tr>
                      <td className="py-3 px-4 text-body text-mx-slate-600">
                        + Registration (Est.)
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                        {formatCurrency(results.onRoadCosts?.registration || 900)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-body text-mx-slate-600">
                        + Stamp Duty (Est.)
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                        {formatCurrency(results.onRoadCosts?.stampDuty)}
                      </td>
                    </tr>
                  </>
                )}
                <tr className="bg-mx-slate-50">
                  <td className="py-3 px-4 text-body font-semibold text-mx-slate-800">
                    Drive Away Price
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-mx-slate-900">
                    {formatCurrency(results.driveAwayPrice)}
                  </td>
                </tr>
                <tr className="bg-teal-50">
                  <td className="py-3 px-4 text-body text-teal-700">
                    Less: Claimable GST
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-teal-700">
                    -{formatCurrency(results.claimableGST)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-body text-mx-slate-600">
                    + Establishment Fee
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                    $500
                  </td>
                </tr>
                <tr className="bg-mx-purple-50">
                  <td className="py-3 px-4 text-body font-semibold text-mx-purple-800">
                    Net Amount Financed (NAF)
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-mx-purple-800">
                    {formatCurrency(results.netAmountFinanced)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Breakdown Section */}
        <div className="mb-8">
          <h4 className="text-body-lg font-semibold text-mx-purple-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mx-purple-500"></span>
            Cost Breakdown ({periodLabel})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-mx-purple-200">
                  <th className="text-left py-3 px-4 text-body font-semibold text-mx-slate-700">
                    Item
                  </th>
                  <th className="text-right py-3 px-4 text-body font-semibold text-mx-slate-700">
                    {periodLabel} Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-slate-100">
                <tr>
                  <td className="py-3 px-4 text-body text-mx-slate-600">
                    Lease Payment
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                    {formatCurrency(results.leasePaymentPerPeriod)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-body text-mx-slate-600">
                    Running Costs (Insurance, Rego, Service, Tyres, {isEV ? 'Electricity' : 'Fuel'})
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                    {formatCurrency(results.runningCostsPerPeriod)}
                  </td>
                </tr>
                <tr className="bg-mx-slate-50">
                  <td className="py-3 px-4 text-body font-semibold text-mx-slate-800">
                    Total Package Cost
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-mx-slate-900">
                    {formatCurrency(results.totalCostPerPeriod)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Treatment Section */}
        <div className="mb-8">
          <h4 className="text-body-lg font-semibold text-mx-purple-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mx-purple-500"></span>
            {isEV ? 'EV Tax Treatment' : 'Employee Contribution Method (ECM)'}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-mx-purple-200">
                  <th className="text-left py-3 px-4 text-body font-semibold text-mx-slate-700">
                    Item
                  </th>
                  <th className="text-right py-3 px-4 text-body font-semibold text-mx-slate-700">
                    {periodLabel} Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mx-slate-100">
                {!isEV && (
                  <tr className="bg-amber-50">
                    <td className="py-3 px-4 text-body text-amber-700">
                      Employee Contribution (Post-Tax) - FBT Base Value x 20%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-amber-700">
                      {formatCurrency(results.employeeContribPerPeriod)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="py-3 px-4 text-body text-mx-slate-600">
                    Pre-Tax Deduction
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                    {formatCurrency(results.preTaxAmountPerPeriod)}
                  </td>
                </tr>
                <tr className="bg-teal-50">
                  <td className="py-3 px-4 text-body text-teal-700">
                    Income Tax Savings
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-teal-700">
                    -{formatCurrency(results.incomeTaxSavingsPerPeriod)}
                  </td>
                </tr>
                <tr className="bg-mx-purple-100">
                  <td className="py-3 px-4 text-body font-semibold text-mx-purple-800">
                    Your Net Cost
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-mx-purple-800 text-lg">
                    {formatCurrency(results.netCostPerPeriod)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Finance Details Section */}
        <div className="mb-8">
          <h4 className="text-body-lg font-semibold text-mx-purple-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-mx-purple-500"></span>
            Finance Details
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-mx-slate-100">
                <tr>
                  <td className="py-3 px-4 text-body text-mx-slate-600">
                    Interest Rate (Fixed All-Up)
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                    {formatPercentage(results.financeRate)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-body text-mx-slate-600">
                    Balloon Payment ({formatPercentage(results.residualPercentage)} - End of Lease)
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                    {formatCurrency(results.residualValue)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-body text-mx-slate-600">
                    FBT Base Value
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-mx-slate-900">
                    {formatCurrency(results.fbtBaseValue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* EV Specific Info */}
        {isEV && (
          <div className="mb-8 p-6 bg-teal-50 border border-teal-200 rounded-xl">
            <h4 className="text-body-lg font-semibold text-teal-700 mb-4">
              Electric Vehicle Tax Information
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-body text-teal-600">RFBT Amount (Annual)</span>
                <span className="font-mono font-semibold text-teal-700">
                  {formatCurrency(results.rfbtAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-body text-teal-600">
                  Adjusted Reportable Income
                </span>
                <span className="font-mono font-semibold text-teal-700">
                  {formatCurrency(results.adjustedReportableIncome)}
                </span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-body-sm text-amber-700">
                <strong>Important:</strong> The adjusted income above is used for income-tested
                government benefits and thresholds (HECS/HELP, Child Support, Family Tax Benefits).
              </p>
            </div>
          </div>
        )}

        {/* ECM Info for non-EVs */}
        {!isEV && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <h4 className="text-body-lg font-semibold text-amber-700 mb-4">
              Employee Contribution Method (ECM)
            </h4>
            <p className="text-body text-amber-600 mb-2">
              <strong>Simple Rule:</strong> You pay {formatCurrency(results.employeeContribution)} annually
              post-tax (FBT Base Value x 20%).
            </p>
            <p className="text-body text-amber-600">
              <strong>Tax Savings:</strong> The remaining {formatCurrency(results.preTaxAmount)} is paid
              pre-tax, saving you {formatCurrency(results.annualTaxSavings)} in income tax.
            </p>
          </div>
        )}

        {/* GST Explanation */}
        <div className="p-6 bg-teal-50 border border-teal-200 rounded-xl">
          <h4 className="text-body-lg font-semibold text-teal-700 mb-4 flex items-center gap-2">
            <Info size={20} />
            GST Treatment Explained
          </h4>
          <div className="text-body text-teal-600 space-y-2">
            <p><strong>Your lease payments are GST-free!</strong> Here's how it works:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>You pay:</strong> {formatCurrency(results.driveAwayPrice)} drive-away price (includes GST)
              </li>
              <li>
                <strong>Funder finances:</strong> {formatCurrency(results.netAmountFinanced)} (excludes{' '}
                {formatCurrency(results.claimableGST)} claimable GST)
              </li>
              <li>
                <strong>Monthly payments:</strong> Based on GST-free amount of {formatCurrency(results.netAmountFinanced)}
              </li>
              <li>
                <strong>GST benefit:</strong> Finance company claims {formatCurrency(results.claimableGST)} as Input Tax Credit
              </li>
            </ul>
            <p className="font-semibold mt-3">
              This is why novated lease payments are lower than financing the full drive-away price!
            </p>
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-body-sm text-amber-700">
              <strong>Private Sale Warning:</strong> GST benefits only apply to new cars or GST-registered
              dealers. Private sale used cars may not qualify for GST Input Tax Credits, potentially
              increasing your lease costs.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-6 border-t border-mx-slate-200">
          <p className="text-body-sm text-mx-slate-500 text-center">
            <strong>Disclaimer:</strong> This is a simplified calculator. Uses fixed 7.50% effective
            interest rate. Finance includes a 1-month deferral period. This is a basic estimator -
            actual rates and terms may vary. Consult with a qualified adviser for personalised advice.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
