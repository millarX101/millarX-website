import { Shield, Award, Star } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function TrustBadges({ className, variant = 'default' }) {
  const badges = [
    {
      icon: Shield,
      text: 'ABN Registered',
    },
    {
      icon: Award,
      text: 'Credit Licence',
    },
    {
      icon: Star,
      text: '5-Star Reviews',
    },
  ]

  const variants = {
    default: 'text-mx-slate-500 bg-mx-slate-100',
    light: 'text-mx-slate-600 bg-white',
    dark: 'text-mx-slate-300 bg-mx-slate-800',
  }

  return (
    <div className={cn('flex flex-wrap justify-center gap-3', className)}>
      {badges.map((badge, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-body-sm font-medium',
            variants[variant]
          )}
        >
          <badge.icon size={16} />
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  )
}
