import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-mx-slate-100 text-mx-slate-700',
  purple: 'bg-mx-purple-100 text-mx-purple-700',
  teal: 'bg-teal-100 text-teal-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-body-sm',
  lg: 'px-4 py-1.5 text-body',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Rating badge for lease analysis
export function RatingBadge({ rating, className }) {
  const ratingConfig = {
    good: {
      variant: 'green',
      label: 'Good',
      emoji: '🟢',
    },
    caution: {
      variant: 'amber',
      label: 'Caution',
      emoji: '🟡',
    },
    warning: {
      variant: 'red',
      label: 'Warning',
      emoji: '🔴',
    },
  }

  const config = ratingConfig[rating] || ratingConfig.caution

  return (
    <Badge variant={config.variant} size="lg" className={className}>
      <span className="mr-1">{config.emoji}</span>
      {config.label}
    </Badge>
  )
}
