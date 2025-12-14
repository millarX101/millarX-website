import { cn } from '../../lib/utils'

export default function BlurCircle({
  className,
  color = 'purple',
  size = 'md',
}) {
  const colors = {
    purple: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)',
    teal: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)',
    amber: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
  }

  const sizes = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[500px] h-[500px]',
  }

  return (
    <div
      className={cn(
        'absolute rounded-full blur-3xl opacity-20 pointer-events-none',
        sizes[size],
        className
      )}
      style={{
        background: colors[color] || colors.purple,
      }}
    />
  )
}
