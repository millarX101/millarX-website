import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Accordion({ children, allowMultiple = false, className }) {
  const [openItems, setOpenItems] = useState([])

  const toggleItem = (value) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      )
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? [] : [value]
      )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.isArray(children)
        ? children.map((child, index) =>
            child
              ? {
                  ...child,
                  props: {
                    ...child.props,
                    isOpen: openItems.includes(child.props.value),
                    onToggle: () => toggleItem(child.props.value),
                  },
                }
              : null
          )
        : children}
    </div>
  )
}

export function AccordionItem({
  value,
  title,
  children,
  isOpen,
  onToggle,
  className,
}) {
  return (
    <div
      className={cn(
        'border border-mx-slate-200 rounded-xl overflow-hidden bg-white',
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex items-center justify-between w-full px-6 py-4 text-left',
          'text-body-lg font-medium text-mx-slate-900',
          'hover:bg-mx-slate-50 transition-colors',
          isOpen && 'bg-mx-slate-50'
        )}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="text-mx-slate-500" size={20} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-6 text-body text-mx-slate-600">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
