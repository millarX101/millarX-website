import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Building2, Mail, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import Button from '../ui/Button'

export default function EmployerSignupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
  })
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/.netlify/functions/employer-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit request')
      }

      setStatus('success')
    } catch (error) {
      console.error('Error submitting signup:', error)
      setStatus('error')
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setFormData({ companyName: '', companyEmail: '' })
    setStatus('idle')
    setErrorMessage('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-mx-purple-600 to-mx-pink-500 px-6 py-5 text-white relative">
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
                <h2 className="text-xl font-semibold">Get Your Onboarding Link</h2>
                <p className="text-white/80 text-sm mt-1">
                  Pop in your details and we'll send you a secure link
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-mx-slate-900 mb-2">
                      Request Received!
                    </h3>
                    <p className="text-mx-slate-600 mb-6">
                      We'll send your secure onboarding link to <strong>{formData.companyEmail}</strong> shortly.
                    </p>
                    <Button onClick={handleClose}>
                      Done
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                      >
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}

                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-mx-slate-700 mb-1.5">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-slate-400" />
                        <input
                          type="text"
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                          placeholder="Your Company Pty Ltd"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-mx-slate-200 rounded-xl focus:ring-2 focus:ring-mx-purple-500 focus:border-mx-purple-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="companyEmail" className="block text-sm font-medium text-mx-slate-700 mb-1.5">
                        Company Email
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-mx-slate-400" />
                        <input
                          type="email"
                          id="companyEmail"
                          value={formData.companyEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, companyEmail: e.target.value }))}
                          placeholder="hr@yourcompany.com.au"
                          required
                          className="w-full pl-10 pr-4 py-3 border border-mx-slate-200 rounded-xl focus:ring-2 focus:ring-mx-purple-500 focus:border-mx-purple-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={status === 'submitting'}
                      >
                        {status === 'submitting' ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Me the Onboarding Link'
                        )}
                      </Button>
                    </div>

                    <p className="text-xs text-mx-slate-500 text-center">
                      We'll send a secure employer portal link to set up your account
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
