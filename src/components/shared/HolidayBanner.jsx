import { useState, useEffect } from 'react'
import { X, Snowflake } from 'lucide-react'

export default function HolidayBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('holidayBanner2024Dismissed')
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('holidayBanner2024Dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="bg-emerald-400 text-white py-2.5 px-4 relative">
      <div className="container-wide mx-auto flex items-center justify-center gap-3">
        <Snowflake size={18} className="animate-pulse hidden sm:block" />
        <p className="text-sm sm:text-base font-medium text-center">
          Wishing you a festive and safe Christmas and New Year! 🎄✨
        </p>
        <Snowflake size={18} className="animate-pulse hidden sm:block" />
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Dismiss banner"
      >
        <X size={18} />
      </button>
    </div>
  )
}
