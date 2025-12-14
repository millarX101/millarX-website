import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { formatCurrency } from '../../lib/utils'

export default function AnimatedNumber({
  value,
  format = 'currency',
  duration = 0.5,
  className,
}) {
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  })

  const displayValue = useTransform(springValue, (latest) => {
    if (format === 'currency') {
      return formatCurrency(Math.round(latest))
    }
    if (format === 'percentage') {
      return `${latest.toFixed(2)}%`
    }
    if (format === 'number') {
      return Math.round(latest).toLocaleString()
    }
    return latest
  })

  useEffect(() => {
    springValue.set(value)
  }, [value, springValue])

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  )
}

// Simple count-up animation without spring physics
export function CountUp({
  value,
  format = 'currency',
  duration = 1000,
  className,
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)
  const animationRef = useRef(null)

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = value
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3)

      const current = startValue + (endValue - startValue) * eased
      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousValue.current = endValue
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  const formatValue = () => {
    if (format === 'currency') {
      return formatCurrency(Math.round(displayValue))
    }
    if (format === 'percentage') {
      return `${displayValue.toFixed(2)}%`
    }
    if (format === 'number') {
      return Math.round(displayValue).toLocaleString()
    }
    return displayValue
  }

  return <span className={className}>{formatValue()}</span>
}
