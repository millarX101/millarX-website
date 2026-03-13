import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trophy, TrendingDown } from 'lucide-react'
import Select from '../ui/Select'
import QuoteCard from './QuoteCard'
import { formatCurrency, cn } from '../../lib/utils'
import { fadeInUp, staggerContainer, staggerItem } from '../../lib/animations'

const TERM_OPTIONS = [
  { value: '1', label: '1 year (12 mo)' },
  { value: '2', label: '2 years (24 mo)' },
  { value: '3', label: '3 years (36 mo)' },
  { value: '4', label: '4 years (48 mo)' },
  { value: '5', label: '5 years (60 mo)' },
]

const FREQ_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'fortnightly', label: 'Fortnightly' },
  { value: 'weekly', label: 'Weekly' },
]

const MAX_QUOTES = 5

let nextId = 1
function createQuote(name = '', isMX = false) {
  return {
    id: nextId++,
    name: name || `Provider ${nextId - 1}`,
    isMX,
    payment: '',
    balloon: '',
    balloonGSTMode: 'ex',
    fee: '',
    orp: '',
  }
}

function getPaymentCount(termYears, frequency, isMX) {
  const termMonths = termYears * 12
  let n
  if (frequency === 'monthly') n = termMonths
  else if (frequency === 'fortnightly') n = Math.round(termMonths * 26 / 12)
  else n = Math.round(termMonths * 52 / 12)
  return isMX ? n - 1 : n
}

function parseDollar(val) {
  const n = parseFloat(String(val).replace(/[^0-9.\-]/g, ''))
  return isNaN(n) ? 0 : n
}

function calculateResult(quote, termYears, frequency) {
  const isMX = quote.isMX
  const paymentCount = getPaymentCount(termYears, frequency, isMX)
  const payment = parseDollar(quote.payment)
  const balloonRaw = parseDollar(quote.balloon)
  const balloonExGST = quote.balloonGSTMode === 'inc' ? balloonRaw / 1.1 : balloonRaw
  const feePerPeriod = parseDollar(quote.fee)
  const feesTotal = feePerPeriod * paymentCount
  const paymentsTotal = payment * paymentCount
  const totalCost = paymentsTotal + balloonExGST + feesTotal

  const orp = parseDollar(quote.orp)
  const vehiclePrice = orp > 0 ? orp * 0.96 : 0
  const estGST = vehiclePrice > 0 ? vehiclePrice / 11 : 0
  const amountFinanced = vehiclePrice - estGST
  const totalCharges = orp > 0 && totalCost > 0 ? totalCost - amountFinanced : 0

  return {
    paymentCount,
    payment,
    paymentsTotal,
    balloonExGST,
    feesTotal,
    totalCost,
    orp,
    vehiclePrice,
    estGST,
    amountFinanced,
    totalCharges,
    isMX,
  }
}

export default function CostCompareCalculator() {
  const [termYears, setTermYears] = useState('5')
  const [frequency, setFrequency] = useState('monthly')
  const [quotes, setQuotes] = useState(() => [
    createQuote('Provider A'),
    createQuote('Provider B'),
    createQuote('millarX', true),
  ])
  const trackedRef = useRef(false)

  const handleQuoteChange = (id, updated) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? updated : q)))
  }

  const handleRemove = (id) => {
    if (quotes.length <= 1) return
    setQuotes((prev) => prev.filter((q) => q.id !== id))
  }

  const handleAdd = () => {
    if (quotes.length >= MAX_QUOTES) return
    setQuotes((prev) => [...prev, createQuote()])
  }

  // Calculate results for all quotes
  const results = useMemo(() => {
    return quotes.map((q) => ({
      quote: q,
      result: calculateResult(q, parseInt(termYears), frequency),
    }))
  }, [quotes, termYears, frequency])

  // Find active results (have payment data) and rank them
  const ranked = useMemo(() => {
    const active = results.filter((r) => r.result.payment > 0 || r.result.balloonExGST > 0)
    return [...active].sort((a, b) => a.result.totalCost - b.result.totalCost)
  }, [results])

  const winnerId = ranked.length > 0 ? ranked[0].quote.id : null

  // GA4 tracking - fire once when verdict has valid data
  useEffect(() => {
    if (ranked.length >= 2 && !trackedRef.current) {
      trackedRef.current = true
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'cost_compare_used', {
          event_category: 'Tool Usage',
          quote_count: ranked.length,
          term_years: termYears,
          frequency,
        })
      }
    }
  }, [ranked.length, termYears, frequency])

  return (
    <div className="space-y-5">
      {/* Global Controls Bar */}
      <motion.div
        className="bg-white rounded-xl shadow-card p-6 border border-mx-slate-100"
        {...fadeInUp}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Select
            label="Lease Term"
            options={TERM_OPTIONS}
            value={termYears}
            onChange={(e) => setTermYears(e.target.value)}
            placeholder=""
          />
          <Select
            label="Payment Frequency"
            options={FREQ_OPTIONS}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder=""
          />
        </div>
      </motion.div>

      {/* Quote Cards Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <AnimatePresence mode="popLayout">
          {quotes.map((q) => {
            const r = results.find((r) => r.quote.id === q.id)
            return (
              <motion.div
                key={q.id}
                variants={staggerItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <QuoteCard
                  quote={q}
                  onChange={handleQuoteChange}
                  onRemove={handleRemove}
                  canRemove={quotes.length > 1}
                  result={r?.result}
                  frequency={frequency}
                  isWinner={q.id === winnerId}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Add Quote Button */}
        {quotes.length < MAX_QUOTES && (
          <motion.button
            onClick={handleAdd}
            className="border-2 border-dashed border-mx-slate-200 rounded-xl bg-transparent text-mx-slate-400 hover:border-mx-purple-300 hover:text-mx-purple-600 hover:bg-mx-purple-50/30 transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[160px] p-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
              <Plus size={20} />
            </div>
            <span className="text-sm font-medium">Add another quote</span>
          </motion.button>
        )}
      </motion.div>

      {/* Verdict Section */}
      <AnimatePresence>
        {ranked.length > 0 && (
          <motion.div
            className="bg-white rounded-xl shadow-card border border-mx-slate-100 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Trophy size={24} className="text-mx-purple-600" />
              <h2 className="font-serif text-display-sm text-mx-slate-900">
                The <span className="gradient-text">Verdict</span>
              </h2>
            </div>
            <p className="text-mx-slate-500 text-sm mb-6">
              Ranked by total cost — lowest wins. Fixed components only.
            </p>

            <div className="space-y-3">
              {ranked.map((item, i) => {
                const { quote: q, result: r } = item
                const isFirst = i === 0
                const maxTotal = ranked[ranked.length - 1].result.totalCost
                const barPct = maxTotal > 0 ? (r.totalCost / maxTotal) * 100 : 0
                const saving = isFirst ? 0 : r.totalCost - ranked[0].result.totalCost

                return (
                  <motion.div
                    key={q.id}
                    className={cn(
                      'grid grid-cols-[32px_1fr_auto] items-center gap-4 px-5 py-4 rounded-xl border transition-all',
                      isFirst
                        ? 'border-mx-teal-300 bg-mx-teal-50/50'
                        : 'border-mx-slate-100 bg-mx-slate-50/50'
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className={cn(
                        'font-mono text-sm font-bold text-center',
                        isFirst ? 'text-mx-teal-600' : 'text-mx-slate-400'
                      )}
                    >
                      #{i + 1}
                    </div>

                    <div>
                      <div className="font-serif text-lg text-mx-slate-900">
                        {q.name || `Quote ${q.id}`}
                      </div>
                      <div className="text-xs text-mx-slate-500 mt-0.5">
                        {r.paymentCount.toLocaleString()} payments × {formatCurrency(r.payment)}
                        {r.isMX && ' · millarX mode'}
                      </div>
                      <div className="w-28 h-1 bg-mx-slate-100 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            isFirst ? 'bg-mx-teal-500' : 'bg-gradient-to-r from-mx-purple-500 to-mx-pink-500'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${barPct}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={cn(
                          'font-mono text-lg font-bold',
                          isFirst ? 'text-mx-teal-600' : 'text-mx-slate-800'
                        )}
                      >
                        {r.totalCost > 0 ? formatCurrency(r.totalCost) : '—'}
                      </div>
                      {isFirst ? (
                        <span className="text-xs text-mx-teal-600 font-medium">Lowest cost</span>
                      ) : (
                        <span className="text-xs font-mono text-mx-slate-500">
                          +{formatCurrency(saving)} vs lowest
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Savings Callout */}
            {ranked.length >= 2 && ranked[0].result.totalCost > 0 && (
              <motion.div
                className="mt-6 p-5 rounded-xl border-l-4 border-mx-teal-500 bg-mx-teal-50/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-start gap-3">
                  <TrendingDown size={20} className="text-mx-teal-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-mx-slate-700 leading-relaxed">
                    <span className="font-bold text-mx-teal-700">
                      {ranked[0].quote.name || `Quote ${ranked[0].quote.id}`}
                    </span>{' '}
                    is the lowest cost option — saving you{' '}
                    <span className="font-bold text-mx-teal-700">
                      {formatCurrency(ranked[1].result.totalCost - ranked[0].result.totalCost)}
                    </span>{' '}
                    ({((ranked[1].result.totalCost - ranked[0].result.totalCost) / ranked[1].result.totalCost * 100).toFixed(1)}%)
                    over {ranked[1].quote.name || `Quote ${ranked[1].quote.id}`} on fixed components alone.
                    That's real money — not a marketing estimate.
                  </p>
                </div>
              </motion.div>
            )}

            {ranked.length === 1 && (
              <motion.div
                className="mt-6 p-5 rounded-xl border-l-4 border-amber-400 bg-amber-50/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-mx-slate-700">
                  Add a second quote to run a comparison. Total cost for{' '}
                  <span className="font-bold">{ranked[0].quote.name}</span>:{' '}
                  <span className="font-bold font-mono">{formatCurrency(ranked[0].result.totalCost)}</span>.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
