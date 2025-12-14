import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Tooltip({
  content,
  children,
  position = 'top',
  className,
}) {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-mx-slate-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-mx-slate-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-mx-slate-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-mx-slate-800',
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 bg-mx-slate-800 text-white text-body-sm rounded-lg shadow-lg',
              'min-w-[200px] max-w-[300px]',
              positions[position],
              className
            )}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-mx-slate-800 transform rotate-45',
                position === 'top' && 'top-full -translate-y-1/2 left-1/2 -translate-x-1/2',
                position === 'bottom' && 'bottom-full translate-y-1/2 left-1/2 -translate-x-1/2',
                position === 'left' && 'left-full -translate-x-1/2 top-1/2 -translate-y-1/2',
                position === 'right' && 'right-full translate-x-1/2 top-1/2 -translate-y-1/2'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Tooltip trigger icon component
export function TooltipIcon({ content, className }) {
  return (
    <Tooltip content={content}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center w-5 h-5 rounded-full',
          'text-mx-purple-500 hover:text-mx-purple-600 transition-colors',
          className
        )}
        aria-label="More information"
      >
        <Info size={16} />
      </button>
    </Tooltip>
  )
}
