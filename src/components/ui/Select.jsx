import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = 'Select an option',
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="block text-body font-medium text-mx-slate-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 border-2 rounded-lg bg-white text-mx-slate-900',
              'appearance-none cursor-pointer transition-all duration-200',
              'focus:border-mx-purple-500 focus:outline-none focus:ring-2 focus:ring-mx-purple-100',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                : 'border-mx-slate-200',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 text-mx-slate-500 pointer-events-none"
            size={20}
          />
        </div>

        {(error || helperText) && (
          <p
            className={cn(
              'mt-2 text-body-sm',
              error ? 'text-red-500' : 'text-mx-slate-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
