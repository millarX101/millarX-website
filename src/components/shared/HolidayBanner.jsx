import { useState, useEffect } from 'react'
import { X, Zap } from 'lucide-react'

export default function HolidayBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('newYearBanner2026Dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('newYearBanner2026Dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-mx-purple-600 via-mx-pink-500 to-mx-purple-600 text-white py-2.5 px-4 relative overflow-hidden">
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

      <div className="container-wide mx-auto flex items-center justify-center gap-3 relative">
        <Zap size={18} className="animate-bounce text-yellow-300 hidden sm:block" />
        <div className="overflow-hidden">
          <p className="text-sm sm:text-base font-semibold text-center whitespace-nowrap animate-marquee">
            New Year, New Car — Amazing deals on EVs and petrol vehicles in 2026! Save thousands with novated leasing
          </p>
        </div>
        <Zap size={18} className="animate-bounce text-yellow-300 hidden sm:block" />
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors z-10"
        aria-label="Dismiss banner"
      >
        <X size={18} />
      </button>
    </div>
  )
}
