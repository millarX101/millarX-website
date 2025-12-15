import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'

// Fallback reviews if Supabase not configured or fetch fails
const FALLBACK_REVIEWS = [
  {
    id: 1,
    reviewer_name: 'Stephen McMahon',
    review_date: '20 weeks ago',
    rating: 5,
    review_text: "MillarX were outstanding to deal with. They helped me compare novated lease quotes side by side, broke down all the hidden costs, and ultimately saved me over $9,000. Their advice was clear, objective, and genuinely in my best interest. I'd highly recommend them to anyone who wants to avoid overpaying. An absolute no-brainer!",
    is_local_guide: false,
  },
  {
    id: 2,
    reviewer_name: 'Paul G',
    review_date: '2 weeks ago',
    rating: 5,
    review_text: 'Ben was fantastic in helping unpick and understand the leasing process and finance options. Fast service, transparent and honest advice',
    is_local_guide: false,
  },
  {
    id: 3,
    reviewer_name: 'George Elovaris',
    review_date: '9 weeks ago',
    rating: 5,
    review_text: 'Ben is fully transparent and has a great online calculator, thank you',
    is_local_guide: true,
  },
  {
    id: 4,
    reviewer_name: 'Glenn Sullivan',
    review_date: '14 weeks ago',
    rating: 5,
    review_text: 'Ben/millarX are great to deal with and made my experience of setting up a new Novated lease, a very easy and stress free one. Highly recommend',
    is_local_guide: false,
  },
  {
    id: 5,
    reviewer_name: 'Daniel Lee',
    review_date: '18 weeks ago',
    rating: 5,
    review_text: 'Ben has provided great advice and support in the navigating novated leases to a newcomer like myself. Highly recommended.',
    is_local_guide: false,
  },
  {
    id: 6,
    reviewer_name: 'Adam Hillier',
    review_date: '21 weeks ago',
    rating: 5,
    review_text: "Ben has been so very helpful in assisting me navigate the quotes and estimates for a novated lease. Very quick to respond and happy to answer any question I had. I very much recommend Ben at MillarX for all your novated lease enquiries! Thanks again Ben!",
    is_local_guide: false,
  },
  {
    id: 7,
    reviewer_name: 'Matthew Grove',
    review_date: '22 weeks ago',
    rating: 5,
    review_text: "Ben and MillarX were a great help going through my first novated lease. From procuring the vehicle through to setting up and understanding how the management of a novated lease works, he was very clear and open. This form of car ownership saves consumers a great deal of money. I highly recommend a novated lease with MillarX.",
    is_local_guide: false,
  },
  {
    id: 8,
    reviewer_name: 'Andi Lou',
    review_date: '22 weeks ago',
    rating: 5,
    review_text: "Ben is an awesome broker. I'm new to novated leasing and Ben guided me all the way from start to finish. Went through all the options and benefits according to my situation. He made everything really easy and great to deal with. I'd recommend Ben and the business to anyone who is looking for a better option and stress free transaction for personal or your business.",
    is_local_guide: false,
  },
]

// Google logo SVG
function GoogleLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="24" height="24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
        />
      ))}
    </div>
  )
}

// Truncate name to "FirstName L." format for privacy
function formatName(fullName) {
  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0]
  const firstName = parts[0]
  const lastInitial = parts[parts.length - 1][0]
  return `${firstName} ${lastInitial}.`
}

function ReviewCard({ review }) {
  const nameParts = review.reviewer_name.split(' ')
  const initials = nameParts.map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const displayName = formatName(review.reviewer_name)

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-full flex flex-col w-[280px] md:w-[320px]">
      {/* Header */}
      <div className="flex items-start gap-3 mb-2">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
          {initials}
        </div>

        {/* Name and date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900 text-sm">{displayName}</span>
            {review.is_local_guide && (
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Local Guide</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} size={14} />
            <span className="text-[11px] text-gray-500">{review.review_date}</span>
          </div>
        </div>

        {/* Google logo */}
        <GoogleLogo className="flex-shrink-0 w-5 h-5" />
      </div>

      {/* Review text */}
      <p className="text-gray-700 text-[13px] leading-relaxed flex-1 line-clamp-3">
        {review.review_text}
      </p>
    </div>
  )
}

export default function GoogleReviews({ autoScroll = true, scrollInterval = 5000 }) {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS)
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef(null)

  // Fetch reviews from Supabase
  useEffect(() => {
    async function fetchReviews() {
      if (!supabase) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('google_reviews')
          .select('*')
          .eq('is_visible', true)
          .order('display_order', { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          setReviews(data)
        }
      } catch (err) {
        console.warn('Failed to fetch reviews from Supabase, using fallback:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll || isPaused || reviews.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, scrollInterval)

    return () => clearInterval(interval)
  }, [autoScroll, isPaused, reviews.length, scrollInterval])

  // Scroll to current index
  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.offsetWidth || 350
      const gap = 16
      scrollRef.current.scrollTo({
        left: currentIndex * (cardWidth + gap),
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  // Calculate stats
  const avgRating = '5.0'
  const totalReviews = 13

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-gray-400">Loading reviews...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header with Google branding */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <GoogleLogo className="w-8 h-8" />
          <span className="text-xl font-medium text-white">Google Reviews</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{avgRating}</span>
          <StarRating rating={5} size={20} />
          <span className="text-gray-300 text-sm">({totalReviews} reviews)</span>
        </div>
      </div>

      {/* Reviews carousel */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation buttons */}
        <button
          onClick={prevReview}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors hidden md:flex"
          aria-label="Previous review"
        >
          <ChevronLeft className="text-gray-600" size={24} />
        </button>

        <button
          onClick={nextReview}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors hidden md:flex"
          aria-label="Next review"
        >
          <ChevronRight className="text-gray-600" size={24} />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="snap-start flex-shrink-0">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to review ${i + 1}`}
          />
        ))}
      </div>

      {/* Link to Google */}
      <div className="text-center mt-6">
        <a
          href="https://www.google.com/search?q=millarX+reviews"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-300 hover:text-white transition-colors underline underline-offset-2"
        >
          See all reviews on Google
        </a>
      </div>
    </div>
  )
}
