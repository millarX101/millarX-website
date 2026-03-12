import { useState } from 'react'
import { X, ChevronDown, Info } from 'lucide-react'
import Input from '../ui/Input'
import { cn, formatCurrency } from '../../lib/utils'

const FREQ_LABELS = {
  monthly: 'per month',
  fortnightly: 'per fortnight',
  weekly: 'per week',
}

const FREQ_SHORT = {
  monthly: 'mo',
  fortnightly: 'fn',
  weekly: 'wk',
}

export default function QuoteCard({
  quote,
  onChange,
  onRemove,
  canRemove,
  result,
  frequency,
  isWinner,
}) {
  const [orpOpen, setOrpOpen] = useState(false)
  const isMX = quote.isMX

  const handleChange = (field, value) => {
    onChange(quote.id, { ...quote, [field]: value })
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-card border-2 transition-all duration-300 relative overflow-hidden',
        isMX && 'border-mx-purple-500 shadow-lg',
        isWinner && !isMX && 'border-mx-teal-500 shadow-lg',
        !isMX && !isWinner && 'border-mx-slate-100 hover:border-mx-purple-200'
      )}
    >
      {/* Purple left accent for millarX card */}
      {isMX && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-mx-purple-600 to-mx-purple-400" />
      )}

      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-5 py-4 border-b',
          isMX ? 'border-mx-purple-100 bg-mx-purple-50/50' : 'border-mx-slate-100'
        )}
      >
        {isMX ? (
          <span className="font-serif text-xl gradient-text font-medium">millarX</span>
        ) : (
          <input
            type="text"
            value={quote.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Provider name"
            className="font-serif text-lg text-mx-slate-900 bg-transparent border-none outline-none placeholder-mx-slate-300 w-full focus:ring-0"
          />
        )}

        <div className="flex items-center gap-2 flex-shrink-0">
          {isWinner && (
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-mx-teal-50 text-mx-teal-600 border border-mx-teal-200">
              Lowest
            </span>
          )}
          {canRemove && (
            <button
              onClick={() => onRemove(quote.id)}
              className="p-1 rounded-md text-mx-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Remove quote"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        {/* Finance Payment */}
        <div>
          <Input
            label="Finance Payment"
            prefix="$"
            type="number"
            placeholder="0.00"
            min="0"
            step="1"
            value={quote.payment}
            onChange={(e) => handleChange('payment', e.target.value)}
          />
          <p className="mt-1.5 text-xs text-mx-slate-400 leading-relaxed">
            Enter the <span className="text-mx-slate-600 font-medium">lease payment only</span> — the core finance figure on your quote.
            Do not include tyres, servicing, insurance, or bundled running costs.
          </p>
          {isMX && (
            <div className="mt-2 flex items-start gap-2 bg-mx-purple-50 border border-mx-purple-100 rounded-lg px-3 py-2">
              <Info size={14} className="text-mx-purple-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-mx-purple-700">
                <span className="font-semibold">Earlier start</span> — we begin payments at month two instead of month three, resulting in one fewer payment over the term. The comparison adjusts for this automatically.
              </span>
            </div>
          )}
        </div>

        {/* Balloon / Residual */}
        <div>
          <Input
            label="Balloon / Residual"
            prefix="$"
            type="number"
            placeholder="0.00"
            min="0"
            step="1"
            value={quote.balloon}
            onChange={(e) => handleChange('balloon', e.target.value)}
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => handleChange('balloonGSTMode', 'ex')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-semibold tracking-wide border transition-all',
                quote.balloonGSTMode === 'ex'
                  ? 'bg-mx-purple-100 border-mx-purple-300 text-mx-purple-700'
                  : 'bg-white border-mx-slate-200 text-mx-slate-500 hover:border-mx-purple-300'
              )}
            >
              Ex GST
            </button>
            <button
              onClick={() => handleChange('balloonGSTMode', 'inc')}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-semibold tracking-wide border transition-all',
                quote.balloonGSTMode === 'inc'
                  ? 'bg-mx-purple-100 border-mx-purple-300 text-mx-purple-700'
                  : 'bg-white border-mx-slate-200 text-mx-slate-500 hover:border-mx-purple-300'
              )}
            >
              Inc GST
            </button>
            {quote.balloonGSTMode === 'inc' && parseFloat(quote.balloon) > 0 && (
              <span className="text-xs font-mono text-mx-teal-600">
                = {formatCurrency(parseFloat(quote.balloon) / 1.1)} ex GST
              </span>
            )}
          </div>
        </div>

        {/* Management Fee */}
        <div>
          <Input
            label={`Management Fee`}
            prefix="$"
            type="number"
            placeholder="0.00"
            min="0"
            step="1"
            value={quote.fee}
            onChange={(e) => handleChange('fee', e.target.value)}
            helperText={FREQ_LABELS[frequency]}
          />
          <p className="mt-1 text-xs text-mx-slate-400 leading-relaxed">
            Check the fine print for any establishment or account-keeping fees not shown in the main body of your quote.
          </p>
        </div>

        {/* On Road Price (optional, collapsible) */}
        <div>
          <button
            onClick={() => setOrpOpen(!orpOpen)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mx-slate-500 hover:text-mx-purple-600 transition-colors"
          >
            <span>On Road Price</span>
            <span className="text-mx-slate-400 font-normal normal-case tracking-normal">(optional — estimates total charges)</span>
            <ChevronDown
              size={14}
              className={cn('transition-transform', orpOpen && 'rotate-180')}
            />
          </button>
          {orpOpen && (
            <div className="mt-3">
              <Input
                prefix="$"
                type="number"
                placeholder="Drive-away price"
                min="0"
                step="1"
                value={quote.orp}
                onChange={(e) => handleChange('orp', e.target.value)}
                helperText="We deduct 4% for on-road costs, then remove GST (1/11) to estimate the amount financed."
              />
            </div>
          )}
        </div>
      </div>

      {/* Result Footer */}
      {result && (
        <div className="px-5 pb-5">
          <div className="border-t border-mx-slate-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-mx-slate-500">
              <span>{result.paymentCount.toLocaleString()} payments</span>
              <span className="font-mono text-mx-slate-600">
                {result.paymentsTotal > 0 ? formatCurrency(result.paymentsTotal) : '—'}
              </span>
            </div>
            <div className="flex justify-between text-sm text-mx-slate-500">
              <span>Balloon ex GST</span>
              <span className="font-mono text-mx-slate-600">
                {result.balloonExGST > 0 ? formatCurrency(result.balloonExGST) : '—'}
              </span>
            </div>
            {result.feesTotal > 0 && (
              <div className="flex justify-between text-sm text-mx-slate-500">
                <span>
                  Fees ({formatCurrency(result.feesTotal / result.paymentCount, true)}/{FREQ_SHORT[frequency]} × {result.paymentCount})
                </span>
                <span className="font-mono text-mx-slate-600">
                  {formatCurrency(result.feesTotal)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-baseline pt-3 border-t border-mx-slate-100 mt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-mx-slate-700">Total Cost</span>
              <span
                className={cn(
                  'font-mono text-xl font-bold',
                  isWinner ? 'text-mx-teal-600' : 'gradient-text'
                )}
              >
                {result.totalCost > 0 ? formatCurrency(result.totalCost) : '—'}
              </span>
            </div>

            {/* On-road price breakdown */}
            {result.orp > 0 && (
              <div className="mt-3 pt-3 border-t border-dashed border-amber-200 space-y-1.5">
                <div className="flex justify-between text-xs text-mx-slate-500">
                  <span>Drive-away price</span>
                  <span className="font-mono">{formatCurrency(result.orp)}</span>
                </div>
                <div className="flex justify-between text-xs text-mx-slate-500">
                  <span>Less on-roads (4% est.)</span>
                  <span className="font-mono text-mx-teal-600">– {formatCurrency(result.orp * 0.04)}</span>
                </div>
                <div className="flex justify-between text-xs text-mx-slate-500">
                  <span>Est. vehicle price (inc. GST)</span>
                  <span className="font-mono">{formatCurrency(result.vehiclePrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-mx-slate-500">
                  <span>Less GST (1/11)</span>
                  <span className="font-mono text-mx-teal-600">– {formatCurrency(result.estGST)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-mx-slate-700 pt-1.5 border-t border-mx-slate-100">
                  <span>Amount Financed (ex GST)</span>
                  <span className="font-mono">{formatCurrency(result.amountFinanced)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-amber-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">≈ Total Charges</span>
                  <span className="font-mono text-lg font-bold text-amber-600">
                    {formatCurrency(result.totalCharges)}
                  </span>
                </div>
                <p className="text-[10px] text-amber-500/70 leading-snug">
                  Estimate only — on-road costs vary by state and vehicle.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
