import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Calendar, ArrowLeft, Car, Loader2, AlertCircle, Fuel, Phone, Search, X } from 'lucide-react'
import { fetchEVCatalog } from '../lib/supabase'
import { calculateStampDuty } from '../utils/stampDutyCalculator'
import { getAnnualRegistration } from '../utils/registrationCalculator'
import SEO, { localBusinessSchema } from '../components/shared/SEO'
import Button from '../components/ui/Button'
import CatalogLeadForm from '../components/shared/CatalogLeadForm'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { cn } from '../lib/utils'

export default function BrowseEVs() {
  const navigate = useNavigate()
  const [evs, setEvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('VIC')
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [selectedVehicleForLead, setSelectedVehicleForLead] = useState(null)

  useEffect(() => {
    async function loadEVs() {
      setLoading(true)
      const { data, error } = await fetchEVCatalog()

      if (error) {
        console.error('Error loading EVs:', error)
        setError('Unable to load vehicles. Please try again.')
      } else {
        setEvs(data || [])
      }
      setLoading(false)
    }

    loadEVs()
  }, [])

  const handleSelectEV = (ev) => {
    // Determine the price to use (special price if active, otherwise state-specific drive-away)
    const statePrice = getDriveAwayPrice(ev)
    const price = ev.is_special && ev.special_price
      ? ev.special_price
      : statePrice || ev.drive_away_price || ev.rrp

    const fuelType = ev.fuel_type === 'Hybrid' ? 'Hybrid' : 'Electric'

    // Navigate to calculator with vehicle data and selected state
    navigate('/novated-leasing', {
      state: {
        vehicleData: {
          make: ev.make,
          model: ev.model,
          year: ev.year,
          trim: ev.trim || '',
          price: price,
          fuelType,
          bodyStyle: ev.body_style || 'Sedan',
          fbtExempt: ev.fbt_exempt !== false,
          selectedState,
        }
      }
    })
  }

  // Filtered vehicles
  const filteredEVs = evs.filter(ev => {
    // Fuel type filter
    if (filter === 'electric' && ev.fuel_type !== 'Electric' && ev.fuel_type) return false
    if (filter === 'hybrid' && ev.fuel_type !== 'Hybrid') return false

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      const price = ev.drive_away_price || ev.rrp || 0
      const searchable = `${ev.make} ${ev.model} ${ev.trim || ''} ${ev.year || ''} ${price}`.toLowerCase()
      if (!searchable.includes(q)) return false
    }

    return true
  })

  const electricCount = evs.filter(ev => ev.fuel_type === 'Electric' || !ev.fuel_type).length
  const hybridCount = evs.filter(ev => ev.fuel_type === 'Hybrid').length

  const STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT']

  // Calculate state-specific drive-away price from RRP
  const getDriveAwayPrice = (ev) => {
    const basePrice = ev.rrp || ev.drive_away_price || 0
    if (!basePrice) return 0

    const isEV = ev.fuel_type === 'Electric' || !ev.fuel_type
    const isHybrid = ev.fuel_type === 'Hybrid'
    const stampDuty = calculateStampDuty(selectedState, basePrice, isEV, isHybrid)
    const rego = getAnnualRegistration(selectedState, isEV)

    return Math.round(basePrice + stampDuty + rego)
  }

  const formatCurrency = (amount) => {
    if (!amount) return '$0'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <>
      <SEO
        title="EVs & Hybrid Vehicles | Novated Lease Australia"
        description="Browse electric and hybrid vehicles with fixed drive-away pricing. Tesla, BYD, BMW & more. Get instant novated lease quotes with real tax savings calculated."
        canonical="/browse-evs"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            {
              '@type': 'ItemList',
              'name': 'Electric & Hybrid Vehicles for Novated Leasing',
              'description': 'Electric and hybrid vehicles available for novated leasing in Australia',
              'itemListElement': evs.slice(0, 10).map((ev, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                  '@type': 'Car',
                  'name': `${ev.year} ${ev.make} ${ev.model}`,
                  'brand': { '@type': 'Brand', 'name': ev.make },
                  'model': ev.model,
                  'vehicleModelDate': ev.year?.toString(),
                  'fuelType': ev.fuel_type === 'Hybrid' ? 'HybridElectric' : 'Electric',
                  'offers': {
                    '@type': 'Offer',
                    'price': ev.drive_away_price || ev.rrp,
                    'priceCurrency': 'AUD',
                    'availability': 'https://schema.org/InStock'
                  }
                }
              }))
            }
          ]
        }}
      />

      <div className="min-h-screen bg-mx-ivory">
        {/* Header */}
        <section className="bg-gradient-to-br from-mx-purple-900 via-mx-purple-700 to-mx-pink-600 text-white py-12 md:py-16">
          <div className="container-wide mx-auto px-4 md:px-6 lg:px-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-mx-purple-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Calculator</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Zap className="text-mx-pink-400" size={24} />
              </div>
              <h1 className="text-display-md font-serif">Browse Vehicles</h1>
            </div>

            <p className="text-body-lg text-mx-purple-100 max-w-2xl">
              Fixed pricing on popular EVs and Hybrids. Select a vehicle to get an instant novated lease quote
              with your real tax savings calculated.
            </p>
          </div>
        </section>

        {/* EV Grid */}
        <section className="py-12 md:py-16">
          <div className="container-wide mx-auto px-4 md:px-6 lg:px-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-mx-purple-600 mb-4" size={48} />
                <p className="text-body text-mx-slate-600">Loading vehicles...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <p className="text-body text-mx-slate-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : evs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Car className="text-mx-slate-400 mb-4" size={48} />
                <p className="text-body text-mx-slate-600">No vehicles available at the moment.</p>
              </div>
            ) : (
              <>
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => setFilter('all')}
                    className={cn(
                      'px-5 py-2.5 rounded-full font-medium text-sm transition-all',
                      filter === 'all'
                        ? 'bg-mx-purple-600 text-white shadow-md'
                        : 'bg-white text-mx-slate-600 border border-mx-slate-200 hover:border-mx-purple-300'
                    )}
                  >
                    All Vehicles ({evs.length})
                  </button>
                  <button
                    onClick={() => setFilter('electric')}
                    className={cn(
                      'px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2',
                      filter === 'electric'
                        ? 'bg-teal-500 text-white shadow-md'
                        : 'bg-white text-mx-slate-600 border border-mx-slate-200 hover:border-teal-300'
                    )}
                  >
                    <Zap size={16} />
                    Electric ({electricCount})
                  </button>
                  {hybridCount > 0 && (
                    <button
                      onClick={() => setFilter('hybrid')}
                      className={cn(
                        'px-5 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2',
                        filter === 'hybrid'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-white text-mx-slate-600 border border-mx-slate-200 hover:border-blue-300'
                      )}
                    >
                      <Fuel size={16} />
                      Hybrid ({hybridCount})
                    </button>
                  )}
                </div>

                {/* Search Bar + State Selector */}
                <div className="flex gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-mx-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by make, model, or price..."
                      className="w-full pl-12 pr-10 py-3 bg-white border-2 border-mx-slate-200 rounded-xl text-body text-mx-slate-700 placeholder:text-mx-slate-400 focus:border-mx-purple-500 focus:ring-2 focus:ring-mx-purple-100 focus:outline-none transition-colors"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-mx-slate-400 hover:text-mx-slate-600 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-mx-slate-200 rounded-xl text-body text-mx-slate-700 font-medium focus:border-mx-purple-500 focus:ring-2 focus:ring-mx-purple-100 focus:outline-none transition-colors cursor-pointer"
                  >
                    {STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <p className="text-body text-mx-slate-600 mb-8">
                  Showing {filteredEVs.length} vehicle{filteredEVs.length !== 1 ? 's' : ''}
                  {filter !== 'all' && ` (${filter})`}
                  {search && ` matching "${search}"`}
                </p>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredEVs.map((ev) => {
                    const statePrice = getDriveAwayPrice(ev)
                    const displayPrice = ev.is_special && ev.special_price
                      ? ev.special_price
                      : statePrice || ev.drive_away_price || ev.rrp
                    const hasSpecial = ev.is_special && ev.special_price
                    const expiryDate = ev.special_expires_at ? formatDate(ev.special_expires_at) : null

                    return (
                      <motion.div
                        key={ev.id}
                        variants={staggerItem}
                        className="bg-white rounded-2xl shadow-card overflow-hidden border border-mx-slate-100 hover:shadow-card-hover transition-shadow"
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/9] bg-mx-slate-50 p-4">
                          {ev.image_url ? (
                            <img
                              src={ev.image_url}
                              alt={`${ev.year} ${ev.make} ${ev.model}`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="text-mx-slate-300" size={64} />
                            </div>
                          )}

                          {/* Badges - stacked vertically */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {ev.fbt_exempt !== false && (
                              <div className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-body-sm font-medium rounded-full flex items-center gap-1 w-fit shadow-sm">
                                <Zap size={14} />
                                FBT Exempt
                              </div>
                            )}
                            {ev.fuel_type === 'Hybrid' && (
                              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-body-sm font-medium rounded-full flex items-center gap-1 w-fit shadow-sm">
                                <Fuel size={14} />
                                Hybrid
                              </div>
                            )}
                            {hasSpecial && ev.special_text && (
                              <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-body-sm font-medium rounded-full w-fit shadow-md">
                                {ev.special_text}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Title */}
                          <h3 className="text-display-sm font-serif text-mx-slate-900 mb-1">
                            {ev.year} {ev.make} {ev.model}
                          </h3>
                          {ev.trim && (
                            <p className="text-body text-mx-slate-500 mb-4">{ev.trim}</p>
                          )}

                          {/* Price */}
                          <div className="mb-4">
                            <p className="text-3xl font-bold text-mx-purple-600 font-mono">
                              {formatCurrency(displayPrice)}
                            </p>
                            <p className="text-body-sm text-mx-slate-500">
                              Est. drive-away ({selectedState}) • Incl. rego & stamp duty
                            </p>
                          </div>

                          {/* Expiry */}
                          {expiryDate && (
                            <div className="flex items-center gap-2 text-body-sm text-mx-slate-500 mb-4">
                              <Calendar size={16} />
                              <span>Valid until {expiryDate}</span>
                            </div>
                          )}

                          {/* Highlights */}
                          {ev.highlights && ev.highlights.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {ev.highlights.slice(0, 3).map((highlight, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-mx-slate-100 text-mx-slate-600 text-body-sm rounded"
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* CTA Buttons */}
                          <div className="space-y-2">
                            <button
                              onClick={() => handleSelectEV(ev)}
                              className="w-full px-4 py-3 bg-gradient-to-r from-mx-purple-700 to-mx-pink-500 hover:from-mx-purple-800 hover:to-mx-pink-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                              <Zap size={18} />
                              {hasSpecial ? 'Get Quote at Special Price' : 'Get Instant Quote'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVehicleForLead(ev)
                                setShowLeadForm(true)
                              }}
                              className="w-full px-4 py-2.5 bg-white border-2 border-mx-purple-200 hover:border-mx-purple-400 text-mx-purple-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                            >
                              <Phone size={16} />
                              Help Me Buy This
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-12 bg-mx-slate-50 border-t border-mx-slate-200">
          <div className="container-narrow mx-auto px-4 text-center">
            <p className="text-body text-mx-slate-600 mb-4">
              Can't find what you're looking for? We can source any electric or hybrid vehicle.
              {' '}Or explore pre-owned options through{' '}
              <a
                href="https://www.landedx.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mx-purple-600 hover:text-mx-purple-700 underline"
              >
                LandedX
              </a>.
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </div>
        </section>
      </div>

      {/* Lead Capture Modal */}
      <CatalogLeadForm
        isOpen={showLeadForm}
        onClose={() => {
          setShowLeadForm(false)
          setSelectedVehicleForLead(null)
        }}
        selectedVehicle={selectedVehicleForLead}
      />
    </>
  )
}
