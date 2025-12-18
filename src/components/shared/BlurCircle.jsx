import { cn } from '../../lib/utils'

export default function BlurCircle({
  className,
  color = 'purple',
  size = 'md',
}) {
  const colors = {
    purple: 'radial-gradient(circle, rgba(74,4,78,0.5) 0%, transparent 70%)',
    pink: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
    magenta: 'radial-gradient(circle, rgba(217,70,239,0.35) 0%, transparent 70%)',
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
        'absolute rounded-full blur-3xl opacity-30 pointer-events-none',
        sizes[size],
        className
      )}
      style={{
        background: colors[color] || colors.purple,
      }}
    />
  )
}
