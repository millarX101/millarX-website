import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { buttonHover } from '../../lib/animations'

const variants = {
  primary: 'bg-mx-purple-700 text-white hover:bg-mx-purple-600 active:bg-mx-purple-800 shadow-md hover:shadow-lg',
  secondary: 'bg-white text-mx-purple-700 border-2 border-mx-purple-700 hover:bg-mx-purple-50',
  teal: 'bg-mx-teal-500 text-white hover:bg-mx-teal-600 shadow-md hover:shadow-lg',
  ghost: 'text-mx-slate-600 hover:text-mx-purple-700 hover:bg-mx-slate-50',
  outline: 'bg-transparent text-mx-slate-700 border-2 border-mx-slate-200 hover:border-mx-purple-500 hover:text-mx-purple-700',
}

const sizes = {
  sm: 'px-4 py-2 text-body-sm',
  md: 'px-6 py-3 text-body',
  lg: 'px-8 py-4 text-body-lg',
}

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className,
      disabled = false,
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      as = 'button',
      animate = true,
      ...props
    },
    ref
  ) => {
    const Component = animate ? motion.button : as

    const buttonContent = (
      <>
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </>
    )

    const buttonClasses = cn(
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      disabled && 'opacity-50 cursor-not-allowed',
      className
    )

    if (animate) {
      return (
        <Component
          ref={ref}
          className={buttonClasses}
          disabled={disabled || loading}
          whileHover={!disabled ? { y: -2, transition: { duration: 0.2 } } : undefined}
          whileTap={!disabled ? { y: 0, transition: { duration: 0.1 } } : undefined}
          {...props}
        >
          {buttonContent}
        </Component>
      )
    }

    const Tag = as
    return (
      <Tag
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </Tag>
    )
  }
)

Button.displayName = 'Button'

export default Button
