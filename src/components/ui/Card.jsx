import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { hoverScale } from '../../lib/animations'

export default function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  ...props
}) {
  const paddingSizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    none: '',
  }

  const Component = hover ? motion.div : 'div'

  return (
    <Component
      className={cn(
        'bg-white rounded-xl shadow-card',
        paddingSizes[padding],
        className
      )}
      {...(hover
        ? {
            whileHover: { scale: 1.02, transition: { duration: 0.2 } },
            whileTap: { scale: 0.98 },
          }
        : {})}
      {...props}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-display-sm font-serif text-mx-slate-900', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn('text-body text-mx-slate-500 mt-1', className)}>
      {children}
    </p>
  )
}

export function CardContent({ children, className }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-6 pt-6 border-t border-mx-slate-100', className)}>
      {children}
    </div>
  )
}
