import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scale, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { fadeInUp } from '../../lib/animations'

export default function CostCompareHook() {
  return (
    <motion.section
      className="gradient-dark grain-overlay rounded-2xl p-8 md:p-10 relative overflow-hidden"
      {...fadeInUp}
    >
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-mx-teal-500/20 flex items-center justify-center">
          <Scale size={24} className="text-mx-teal-400" />
        </div>

        <div className="flex-1">
          <h3 className="font-serif text-xl text-white mb-1">
            Got a quote from another provider?
          </h3>
          <p className="text-mx-slate-400 text-sm leading-relaxed">
            See how it stacks up against millarX — compare up to 5 quotes side by side and find out who really offers the best deal.
          </p>
        </div>

        <Link to="/cost-compare" className="flex-shrink-0">
          <Button
            variant="teal"
            icon={<ArrowRight size={18} />}
            iconPosition="right"
          >
            Compare Quotes
          </Button>
        </Link>
      </div>
    </motion.section>
  )
}
