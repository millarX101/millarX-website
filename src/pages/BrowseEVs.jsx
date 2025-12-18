import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Calendar, ArrowLeft, Car, Loader2, AlertCircle } from 'lucide-react'
import { fetchEVCatalog } from '../lib/supabase'
import SEO, { localBusinessSchema } from '../components/shared/SEO'
import Button from '../components/ui/Button'
import { fadeInUp, staggerContainer, staggerItem } from '../lib/animations'

export default function BrowseEVs() {
  const navigate = useNavigate()
  const [evs, setEvs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    // Determine the price to use (special price if active, otherwise drive-away)
    const price = ev.is_special && ev.special_price
      ? ev.special_price
      : ev.drive_away_price || ev.rrp

    // Navigate to calculator with vehicle data
    navigate('/novated-leasing', {
      state: {
        vehicleData: {
          make: ev.make,
          model: ev.model,
          year: ev.year,
          trim: ev.trim || '',
          price: price,
          fuelType: 'Electric',
          bodyStyle: ev.body_style || 'Sedan',
          fbtExempt: ev.fbt_exempt !== false
        }
      }
    })
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
        title="FBT-Exempt EVs Under $91,387 | Tesla, BYD, Kia Novated Lease Australia"
        description="Browse FBT-exempt electric vehicles with fixed drive-away pricing. Tesla, BYD, BMW & more EVs. Get instant novated lease quotes with real tax savings calculated. Updated 2025 prices."
        canonical="/browse-evs"
        structuredData={{
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            {
              '@type': 'ItemList',
              'name': 'FBT-Exempt Electric Vehicles for Novated Leasing',
              'description': 'Electric vehicles available for novated leasing in Australia with FBT exemption',
              'itemListElement': evs.slice(0, 10).map((ev, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'item': {
                  '@type': 'Car',
                  'name': `${ev.year} ${ev.make} ${ev.model}`,
                  'brand': { '@type': 'Brand', 'name': ev.make },
                  'model': ev.model,
                  'vehicleModelDate': ev.year?.toString(),
                  'fuelType': 'Electric',
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
        <section className="bg-gradient-to-br from-mx-purple-700 to-mx-purple-900 text-white py-12 md:py-16">
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
                <Zap className="text-teal-400" size={24} />
              </div>
              <h1 className="text-display-md font-serif">Browse Electric Vehicles</h1>
            </div>

            <p className="text-body-lg text-mx-purple-100 max-w-2xl">
              Fixed pricing on popular EVs. Select a vehicle to get an instant novated lease quote
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
                <p className="text-body text-mx-slate-600 mb-8">
                  Showing {evs.length} vehicle{evs.length !== 1 ? 's' : ''}
                </p>

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {evs.map((ev) => {
                    const displayPrice = ev.is_special && ev.special_price
                      ? ev.special_price
                      : ev.drive_away_price || ev.rrp
                    const hasSpecial = ev.is_special && ev.special_price
                    const expiryDate = ev.special_expires_at ? formatDate(ev.special_expires_at) : null

                    return (
                      <motion.div
                        key={ev.id}
                        variants={staggerItem}
                        className="bg-white rounded-2xl shadow-card overflow-hidden border border-mx-slate-100 hover:shadow-card-hover transition-shadow"
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/10] bg-mx-slate-100">
                          {ev.image_url ? (
                            <img
                              src={ev.image_url}
                              alt={`${ev.year} ${ev.make} ${ev.model}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Car className="text-mx-slate-300" size={64} />
                            </div>
                          )}

                          {/* FBT Badge */}
                          {ev.fbt_exempt !== false && (
                            <div className="absolute top-3 left-3 px-3 py-1 bg-teal-500 text-white text-body-sm font-medium rounded-full flex items-center gap-1">
                              <Zap size={14} />
                              FBT Exempt
                            </div>
                          )}

                          {/* Special Badge */}
                          {hasSpecial && ev.special_text && (
                            <div className="absolute top-3 right-3 px-3 py-1 bg-orange-500 text-white text-body-sm font-medium rounded-full">
                              {ev.special_text}
                            </div>
                          )}
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
                            <p className="text-3xl font-bold text-teal-600 font-mono">
                              {formatCurrency(displayPrice)}
                            </p>
                            <p className="text-body-sm text-mx-slate-500">
                              Drive-away price (NSW) • Includes rego & stamp duty
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
                              className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                              <Zap size={18} />
                              Get Quote at Special Price
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
              Can't find what you're looking for? We can source any electric vehicle.
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
    </>
  )
}
