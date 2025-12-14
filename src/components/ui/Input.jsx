import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      prefix,
      suffix,
      className,
      containerClassName,
      type = 'text',
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
          {prefix && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-mx-slate-500 pointer-events-none">
              {prefix}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full px-4 py-3 border-2 rounded-lg bg-white text-mx-slate-900',
              'placeholder-mx-slate-400 transition-all duration-200',
              'focus:border-mx-purple-500 focus:outline-none focus:ring-2 focus:ring-mx-purple-100',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-100'
                : 'border-mx-slate-200',
              prefix && 'pl-10',
              suffix && 'pr-10',
              className
            )}
            {...props}
          />

          {suffix && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-mx-slate-500 pointer-events-none">
              {suffix}
            </div>
          )}
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

Input.displayName = 'Input'

export default Input
