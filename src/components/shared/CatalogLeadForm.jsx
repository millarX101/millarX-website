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
    preferred_colour: '',
    required_extras: '',
    comments: '',
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
      const vehicleDescription = selectedVehicle
        ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
        : 'Not specified - needs help choosing'

      const fuelType = selectedVehicle?.fuel_type || 'Electric'
      const price = selectedVehicle?.drive_away_price || selectedVehicle?.rrp || 0

      await saveCatalogLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        preferred_colour: formData.preferred_colour || null,
        required_extras: formData.required_extras || null,
        comments: formData.comments || null,
        vehicle_make: selectedVehicle?.make || null,
        vehicle_model: selectedVehicle?.model || null,
        vehicle_variant: selectedVehicle?.trim || null,
        vehicle_year: selectedVehicle?.year || null,
        vehicle_description: vehicleDescription,
        fuel_type: fuelType,
        drive_away_price: price,
        body_style: selectedVehicle?.body_style || null,
        source: 'millarx-website',
        source_page: '/browse-evs',
        utm_source: new URLSearchParams(window.location.search).get('utm_source'),
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
        utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
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
    setFormData({ name: '', email: '', phone: '', preferred_colour: '', required_extras: '', comments: '', website: '' })
    setSubmitted(false)
    onClose()
  }

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="" size="md">
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Help Me Buy This" size="md">
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

        {/* Vehicle preferences (optional) */}
        <div className="pt-2 border-t border-mx-slate-100">
          <p className="text-body-sm font-medium text-mx-slate-600 mb-3">
            Vehicle preferences (optional)
          </p>

          <div className="space-y-3">
            <Input
              label="Preferred colour"
              name="preferred_colour"
              value={formData.preferred_colour}
              onChange={handleChange}
              placeholder="e.g. White, Black, Silver"
            />

            <Input
              label="Required extras"
              name="required_extras"
              value={formData.required_extras}
              onChange={handleChange}
              placeholder="e.g. Tow bar, tinted windows, roof racks"
            />

            <Input
              label="Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Anything else we should know?"
            />
          </div>
        </div>

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
