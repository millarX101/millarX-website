import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, Sparkles, Star } from 'lucide-react'

export default function HolidayBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('vicSpecialsBannerDismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVisible(false)
    localStorage.setItem('vicSpecialsBannerDismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <Link to="/browse-evs" className="block">
      <div className="bg-gradient-to-r from-mx-purple-600 via-mx-pink-500 to-mx-purple-600 text-white py-2.5 px-4 relative overflow-hidden cursor-pointer hover:brightness-110 transition-all">
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

        <div className="container-wide mx-auto flex items-center justify-center gap-3 relative">
          <Sparkles size={18} className="animate-bounce text-yellow-300 hidden sm:block" />
          <div className="overflow-hidden">
            <p className="text-sm sm:text-base font-semibold text-center whitespace-nowrap animate-marquee">
              Exclusive Deals for Our Victorian Customers — Explore our specials under Browse Vehicles
              <Star size={14} className="inline mx-3 text-yellow-300" />
              NEW Chery Tiggo 4 HEV — Up to 1,000km range from only $30,040 drive away
              <Star size={14} className="inline mx-3 text-yellow-300" />
              Limited stock available — Don't miss out!
            </p>
          </div>
          <Sparkles size={18} className="animate-bounce text-yellow-300 hidden sm:block" />
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Dismiss banner"
        >
          <X size={18} />
        </button>
      </div>
    </Link>
  )
}
