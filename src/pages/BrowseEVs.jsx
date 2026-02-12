import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, Calendar, ArrowLeft, Car, Loader2, AlertCircle, Fuel, Phone, Search, X,
  ChevronLeft, ChevronRight, Sparkles, Battery, Gauge, Users, Tag, ChevronDown
} from 'lucide-react'
import { fetchEVCatalog } from '../lib/supabase'
import { calculateStampDuty } from '../utils/stampDutyCalculator'
import { getAnnualRegistration } from '../utils/registrationCalculator'
import SEO, { localBusinessSchema } from '../components/shared/SEO'
import Button from '../components/ui/Button'
import CatalogLeadForm from '../components/shared/CatalogLeadForm'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'
import { cn } from '../lib/utils'

const SPECIALS_ROTATE_MS = 5000

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

  // Specials carousel state
  const [specialIndex, setSpecialIndex] = useState(0)
  const [specialsPerView, setSpecialsPerView] = useState(3)
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)
  const [expandedTerms, setExpandedTerms] = useState(new Set())

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

  // Specials: filtered and sorted
  const specials = evs
    .filter(ev => ev.is_special && ev.special_price)
    .sort((a, b) => (a.special_order || 999) - (b.special_order || 999))

  // Responsive cards per view
  useEffect(() => {
    const updatePerView = () => {
      if (window.innerWidth < 768) setSpecialsPerView(1)
      else if (window.innerWidth < 1024) setSpecialsPerView(2)
      else setSpecialsPerView(3)
    }
    updatePerView()
    window.addEventListener('resize', updatePerView)
    return () => window.removeEventListener('resize', updatePerView)
  }, [])

  // Auto-rotation
  const maxSpecialIndex = Math.max(0, specials.length - specialsPerView)
  useEffect(() => {
    if (specials.length <= specialsPerView || isCarouselPaused) return
    const interval = setInterval(() => {
      setSpecialIndex(prev => (prev >= maxSpecialIndex ? 0 : prev + 1))
    }, SPECIALS_ROTATE_MS)
    return () => clearInterval(interval)
  }, [specials.length, specialsPerView, isCarouselPaused, maxSpecialIndex])

  // Reset carousel index when specials change
  useEffect(() => {
    setSpecialIndex(0)
  }, [specials.length])

  const totalDots = maxSpecialIndex + 1

  const nextSpecial = () => {
    setSpecialIndex(prev => (prev >= maxSpecialIndex ? 0 : prev + 1))
  }
  const prevSpecial = () => {
    setSpecialIndex(prev => (prev <= 0 ? maxSpecialIndex : prev - 1))
  }

  const toggleTerms = (evId) => {
    setExpandedTerms(prev => {
      const next = new Set(prev)
      if (next.has(evId)) next.delete(evId)
      else next.add(evId)
      return next
    })
  }

  const handleSelectEV = (ev) => {
    const statePrice = getDriveAwayPrice(ev)
    const price = ev.is_special && ev.special_price
      ? ev.special_price
      : statePrice || ev.drive_away_price || ev.rrp

    const fuelType = ev.fuel_type === 'Hybrid' ? 'Hybrid' : 'Electric'

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

  const STATES = ['VIC', 'NSW', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT']

  const getDriveAwayPrice = (ev) => {
    const basePrice = ev.rrp || ev.drive_away_price || 0
    if (!basePrice) return 0

    const isEV = ev.fuel_type === 'Electric' || !ev.fuel_type
    const isHybrid = ev.fuel_type === 'Hybrid'
    const stampDuty = calculateStampDuty(selectedState, basePrice, isEV, isHybrid)
    const rego = getAnnualRegistration(selectedState, isEV)

    return Math.round(basePrice + stampDuty + rego)
  }

  const getSpecialSavings = (ev) => {
    const originalPrice = getDriveAwayPrice(ev)
    const specialPrice = ev.special_price
    if (!originalPrice || !specialPrice || specialPrice >= originalPrice) return null
    const savings = originalPrice - specialPrice
    const percent = Math.round((savings / originalPrice) * 100)
    return { savings, percent }
  }

  // Filtered vehicles
  const filteredEVs = evs.filter(ev => {
    if (filter === 'electric' && ev.fuel_type !== 'Electric' && ev.fuel_type) return false
    if (filter === 'hybrid' && ev.fuel_type !== 'Hybrid') return false

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      // Check if search looks like a price (digits, commas, optional $)
      const priceMatch = q.replace(/[$,\s]/g, '').match(/^(\d+)$/)
      if (priceMatch) {
        const targetPrice = parseInt(priceMatch[1], 10)
        const evPrice = getDriveAwayPrice(ev) || ev.drive_away_price || ev.rrp || 0
        // Show vehicles within 15% of the target price
        const tolerance = targetPrice * 0.15
        if (Math.abs(evPrice - targetPrice) > tolerance) return false
      } else {
        const searchable = `${ev.make} ${ev.model} ${ev.trim || ''} ${ev.year || ''}`.toLowerCase()
        if (!searchable.includes(q)) return false
      }
    }

    return true
  })

  const electricCount = evs.filter(ev => ev.fuel_type === 'Electric' || !ev.fuel_type).length
  const hybridCount = evs.filter(ev => ev.fuel_type === 'Hybrid').length

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
        title="Buy Electric & Hybrid Cars | Tesla, BYD, BMW Drive-Away Pricing"
        description="Browse electric and hybrid vehicles with fixed drive-away pricing in Australia. Tesla Model 3, BYD Atto 3, BMW iX & more. Compare prices, get instant novated lease quotes with real tax savings. FBT exempt EVs available."
        canonical="/browse-evs"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            {
              '@type': 'ItemList',
              'name': 'Electric & Hybrid Vehicles for Sale - Novated Leasing Australia',
              'description': 'Browse and compare electric and hybrid vehicles available with novated leasing. Fixed drive-away pricing on Tesla, BYD, BMW, Chery, MG and more.',
              'numberOfItems': evs.length,
              'itemListElement': evs.slice(0, 20).map((ev, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                  '@type': 'Car',
                  'name': `${ev.year} ${ev.make} ${ev.model}${ev.trim ? ` ${ev.trim}` : ''}`,
                  'brand': { '@type': 'Brand', 'name': ev.make },
                  'model': ev.model,
                  'vehicleModelDate': ev.year?.toString(),
                  'fuelType': ev.fuel_type === 'Hybrid' ? 'HybridElectric' : 'Electric',
                  ...(ev.image_url && { 'image': ev.image_url }),
                  ...(ev.description && { 'description': ev.description }),
                  ...(ev.seats && { 'seatingCapacity': ev.seats }),
                  ...(ev.body_style && { 'bodyType': ev.body_style }),
                  'offers': {
                    '@type': 'Offer',
                    'price': ev.is_special && ev.special_price ? ev.special_price : (ev.drive_away_price || ev.rrp),
                    'priceCurrency': 'AUD',
                    'availability': 'https://schema.org/InStock',
                    ...(ev.special_expires_at && { 'priceValidUntil': ev.special_expires_at }),
                    'seller': {
                      '@type': 'Organization',
                      'name': 'millarX'
                    }
                  }
                }
              }))
            },
            {
              '@type': 'WebPage',
              'name': 'Browse Electric & Hybrid Vehicles - millarX',
              'description': 'Browse and compare electric and hybrid vehicles with fixed drive-away pricing in Australia.',
              'url': 'https://millarx.com.au/browse-evs',
              'isPartOf': { '@type': 'WebSite', 'name': 'millarX', 'url': 'https://millarx.com.au' }
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

        {/* Specials Carousel */}
        {specials.length > 0 && !loading && !error && (
          <section className="py-10 md:py-14 bg-gradient-to-b from-mx-purple-50/50 to-mx-ivory">
            <div className="container-wide mx-auto px-4 md:px-6 lg:px-8">
              {/* Section header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mx-purple-100 flex items-center justify-center">
                    <Sparkles className="text-mx-purple-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-display-md font-serif text-mx-slate-900">Limited Time Specials</h2>
                    <p className="text-body-sm text-mx-slate-500">
                      {specials.length} special{specials.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
                {/* State selector for specials pricing */}
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-3 py-2 bg-white border border-mx-slate-200 rounded-lg text-body-sm text-mx-slate-700 font-medium focus:border-mx-purple-500 focus:outline-none cursor-pointer"
                >
                  {STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Carousel container */}
              <div
                className="relative"
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
              >
                {/* Prev/Next arrows */}
                {specials.length > specialsPerView && (
                  <>
                    <button
                      onClick={prevSpecial}
                      className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-mx-purple-50 transition-colors border border-mx-slate-100"
                    >
                      <ChevronLeft size={20} className="text-mx-purple-700" />
                    </button>
                    <button
                      onClick={nextSpecial}
                      className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-mx-purple-50 transition-colors border border-mx-slate-100"
                    >
                      <ChevronRight size={20} className="text-mx-purple-700" />
                    </button>
                  </>
                )}

                {/* Cards track */}
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${specialIndex * (100 / specialsPerView)}%)`,
                    }}
                  >
                    {specials.map((ev) => {
                      const savings = getSpecialSavings(ev)
                      const originalPrice = getDriveAwayPrice(ev)
                      const expiryDate = ev.special_expires_at ? formatDate(ev.special_expires_at) : null
                      const isTermsExpanded = expandedTerms.has(ev.id)

                      return (
                        <div
                          key={ev.id}
                          className="flex-shrink-0 px-2 md:px-3"
                          style={{ width: `${100 / specialsPerView}%` }}
                        >
                          <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-mx-purple-100 h-full flex flex-col">
                            {/* Special header bar */}
                            <div className="bg-gradient-to-r from-mx-purple-700 to-mx-pink-500 px-4 py-2.5 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Tag size={16} className="text-white" />
                                <span className="text-white font-bold text-sm uppercase tracking-wide">Special Offer</span>
                              </div>
                              {savings && (
                                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                                  SAVE {savings.percent}%
                                </span>
                              )}
                            </div>

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
                              {ev.fbt_exempt !== false && (
                                <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-body-sm font-medium rounded-full flex items-center gap-1 shadow-sm">
                                  <Zap size={14} />
                                  100% Tax Free
                                </div>
                              )}
                              {ev.fuel_type === 'Hybrid' && (
                                <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-body-sm font-medium rounded-full flex items-center gap-1 shadow-sm">
                                  <Fuel size={14} />
                                  Hybrid
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                              {/* Title */}
                              <h3 className="text-display-sm font-serif text-mx-slate-900 mb-1">
                                {ev.year} {ev.make} {ev.model}
                              </h3>
                              {ev.trim && <p className="text-body text-mx-slate-500 mb-3">{ev.trim}</p>}

                              {/* Description */}
                              {ev.description && (
                                <p className="text-body-sm text-mx-slate-600 bg-mx-slate-50 rounded-lg p-3 mb-4 line-clamp-2">
                                  {ev.description}
                                </p>
                              )}

                              {/* Specs grid */}
                              {(ev.electric_range_km || ev.power_kw || ev.seats) && (
                                <div className="grid grid-cols-3 gap-2 mb-4">
                                  {ev.electric_range_km ? (
                                    <div className="text-center p-2 bg-mx-purple-50 rounded-lg">
                                      <Battery size={18} className="mx-auto text-mx-purple-500 mb-1" />
                                      <p className="text-xs text-mx-slate-500">Range</p>
                                      <p className="text-sm font-bold text-mx-slate-800">{ev.electric_range_km} km</p>
                                    </div>
                                  ) : <div />}
                                  {ev.power_kw ? (
                                    <div className="text-center p-2 bg-mx-purple-50 rounded-lg">
                                      <Gauge size={18} className="mx-auto text-mx-purple-500 mb-1" />
                                      <p className="text-xs text-mx-slate-500">Power</p>
                                      <p className="text-sm font-bold text-mx-slate-800">{ev.power_kw} kW</p>
                                    </div>
                                  ) : <div />}
                                  {ev.seats ? (
                                    <div className="text-center p-2 bg-mx-purple-50 rounded-lg">
                                      <Users size={18} className="mx-auto text-mx-purple-500 mb-1" />
                                      <p className="text-xs text-mx-slate-500">Seats</p>
                                      <p className="text-sm font-bold text-mx-slate-800">{ev.seats}</p>
                                    </div>
                                  ) : <div />}
                                </div>
                              )}

                              {/* Pricing - pushed to bottom */}
                              <div className="mt-auto">
                                <div className="mb-4">
                                  {savings && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-body text-mx-slate-400 line-through">
                                        {formatCurrency(originalPrice)}
                                      </span>
                                      <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        -{formatCurrency(savings.savings)} OFF
                                      </span>
                                    </div>
                                  )}
                                  <p className="text-3xl font-bold text-mx-purple-600 font-mono">
                                    {formatCurrency(ev.special_price)}
                                  </p>
                                  <p className="text-body-sm text-mx-slate-500">
                                    Drive-away price ({selectedState}) {ev.special_text ? `\u2022 ${ev.special_text}` : ''}
                                  </p>
                                </div>

                                {/* Expiry */}
                                {expiryDate && (
                                  <div className="flex items-center gap-2 text-body-sm text-mx-slate-500 mb-4">
                                    <Calendar size={16} />
                                    <span>Valid until {expiryDate}</span>
                                  </div>
                                )}

                                {/* CTA Buttons */}
                                <div className="space-y-2 mb-3">
                                  <button
                                    onClick={() => {
                                      setSelectedVehicleForLead(ev)
                                      setShowLeadForm(true)
                                    }}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-mx-purple-700 to-mx-pink-500 hover:from-mx-purple-800 hover:to-mx-pink-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                  >
                                    <Phone size={18} />
                                    Enquire Now
                                  </button>
                                  <button
                                    onClick={() => handleSelectEV(ev)}
                                    className="w-full px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                                  >
                                    <Zap size={16} />
                                    Get Quote at Special Price
                                  </button>
                                </div>

                                {/* Terms & Conditions */}
                                {ev.special_terms && (
                                  <div className="border-t border-mx-slate-100 pt-2">
                                    <button
                                      onClick={() => toggleTerms(ev.id)}
                                      className="flex items-center gap-1 text-xs text-mx-slate-400 hover:text-mx-slate-600 transition-colors"
                                    >
                                      <ChevronDown
                                        size={14}
                                        className={cn('transition-transform', isTermsExpanded && 'rotate-180')}
                                      />
                                      Terms & Conditions
                                    </button>
                                    {isTermsExpanded && (
                                      <p className="text-xs text-mx-slate-400 mt-2 leading-relaxed">
                                        {ev.special_terms}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Dot navigation */}
                {specials.length > specialsPerView && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    {Array.from({ length: totalDots }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSpecialIndex(i)}
                        className={cn(
                          'h-2.5 rounded-full transition-all',
                          i === specialIndex
                            ? 'bg-mx-purple-600 w-6'
                            : 'bg-mx-slate-300 hover:bg-mx-slate-400 w-2.5'
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

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
                              <div className="px-3 py-1 bg-gradient-to-r from-mx-purple-600 to-mx-pink-500 text-white text-body-sm font-medium rounded-full w-fit shadow-md">
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
