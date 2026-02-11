import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, Car } from 'lucide-react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Honeypot, { isSpamSubmission } from '../ui/Honeypot'
import { saveCatalogLead } from '../../lib/supabase'

export default function CatalogLeadForm({ isOpen, onClose, selectedVehicle }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '', // Honeypot
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSpamSubmission(formData.website)) {
      setSubmitted(true)
      return
    }
    setLoading(true)
    try {
      await saveCatalogLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        vehicle_make: selectedVehicle?.make || null,
        vehicle_model: selectedVehicle?.model || null,
        vehicle_description: selectedVehicle
          ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
          : 'Not specified - needs help choosing',
        fuel_type: selectedVehicle?.fuel_type || null,
        source_page: '/browse-evs',
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        status: 'new',
      })
      setSubmitted(true)
      // GA tracking
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'generate_lead', {
          event_category: 'Catalog Inquiry',
          event_label: selectedVehicle
            ? `${selectedVehicle.make} ${selectedVehicle.model}`
            : 'General inquiry',
        })
      }
    } catch (err) {
      console.error('Error submitting catalog lead:', err)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', website: '' })
    setSubmitted(false)
    onClose()
  }

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="" size="sm">
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center"
          >
            <CheckCircle className="text-teal-600" size={32} />
          </motion.div>
          <h3 className="text-display-sm font-serif text-mx-slate-900 mb-2">
            We'll be in touch!
          </h3>
          <p className="text-body text-mx-slate-600 mb-6">
            One of our team will reach out shortly to help you
            {selectedVehicle ? ` with the ${selectedVehicle.make} ${selectedVehicle.model}` : ' find the right vehicle'}.
          </p>
          <Button variant="primary" onClick={handleClose}>Done</Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Help Me Buy This" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Honeypot value={formData.website} onChange={handleChange} />

        {selectedVehicle && (
          <div className="p-3 bg-mx-purple-50 border border-mx-purple-200 rounded-lg flex items-center gap-3">
            <Car className="text-mx-purple-600 flex-shrink-0" size={18} />
            <p className="text-body-sm text-mx-purple-800">
              <strong>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</strong>
              {selectedVehicle.trim && ` ${selectedVehicle.trim}`}
            </p>
          </div>
        )}

        <p className="text-body-sm text-mx-slate-600">
          Leave your details and we'll send you pricing and options for this vehicle.
        </p>

        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Phone (optional)"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="0400 000 000"
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          icon={<Send size={16} />}
        >
          Send
        </Button>

        <p className="text-body-sm text-mx-slate-500 text-center">
          No spam, no pressure. Just helpful advice.
        </p>
      </form>
    </Modal>
  )
}
