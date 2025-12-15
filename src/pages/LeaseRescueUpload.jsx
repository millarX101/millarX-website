import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, FileText, Shield, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import BlurCircle from '../components/shared/BlurCircle'
import SEO from '../components/shared/SEO'
import { supabase } from '../lib/supabase'

export default function LeaseRescueUpload() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const sessionId = searchParams.get('session_id')
  const customerEmail = searchParams.get('email')

  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState(null)
  const [consent, setConsent] = useState(false)
  const [notes, setNotes] = useState('')

  // Validate session on load
  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session. Please complete your purchase first.')
    }
  }, [sessionId])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or image file (PNG, JPG)')
      return
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setError(null)
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file || !sessionId) return

    setUploading(true)
    setError(null)

    try {
      // Generate unique filename
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()
      const fileName = `${sessionId}/${timestamp}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lease-rescue-quotes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get the file URL (signed URL for security)
      const { data: urlData } = await supabase.storage
        .from('lease-rescue-quotes')
        .createSignedUrl(fileName, 60 * 60 * 24 * 30) // 30 days

      // Save record to database
      const { error: dbError } = await supabase
        .from('lease_rescue_purchases')
        .update({
          quote_uploaded: true,
          quote_file_path: fileName,
          quote_file_url: urlData?.signedUrl,
          storage_consent: consent,
          customer_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', sessionId)

      if (dbError) {
        // If update fails, try insert (in case webhook hasn't run yet)
        await supabase.from('lease_rescue_purchases').insert({
          stripe_session_id: sessionId,
          email: customerEmail || 'unknown',
          quote_uploaded: true,
          quote_file_path: fileName,
          quote_file_url: urlData?.signedUrl,
          storage_consent: consent,
          customer_notes: notes,
          status: 'quote_received'
        })
      }

      // Notify Ben via edge function (optional - could also use database trigger)
      try {
        await supabase.functions.invoke('notify-quote-upload', {
          body: {
            sessionId,
            email: customerEmail,
            fileUrl: urlData?.signedUrl,
            notes,
            consent
          }
        })
      } catch (notifyError) {
        console.log('Notification skipped:', notifyError)
      }

      setUploaded(true)

    } catch (err) {
      console.error('Upload error:', err)
      setError('Upload failed. Please try again or email your quote to ben@millarx.com.au')
    } finally {
      setUploading(false)
    }
  }

  // Success state
  if (uploaded) {
    return (
      <>
        <SEO title="Quote Uploaded | Lease Rescue Pack" />
        <div className="min-h-screen bg-gradient-to-b from-mx-slate-50 to-white flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h1 className="text-display-sm font-serif text-mx-slate-900 mb-4">
                Quote Received!
              </h1>
              <p className="text-body text-mx-slate-600 mb-6">
                Thanks for uploading your quote. Ben will review it and get back to you within 24-48 hours with your full analysis.
              </p>
              <div className="p-4 bg-purple-50 rounded-lg mb-6">
                <p className="text-body-sm text-purple-700">
                  <strong>What happens next:</strong><br />
                  You'll receive an email with your detailed Lease Rescue Pack including exact rate calculations, a line-by-line breakdown, and negotiation scripts.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </Card>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Upload Your Quote | Lease Rescue Pack"
        description="Upload your novated lease quote for analysis"
      />

      <div className="min-h-screen bg-gradient-to-b from-mx-slate-50 to-white relative overflow-hidden">
        <BlurCircle color="purple" size="lg" className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />

        <div className="container-narrow mx-auto py-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-display-md font-serif text-mx-slate-900 mb-4">
                Upload Your Quote
              </h1>
              <p className="text-body-lg text-mx-slate-600">
                Upload your novated lease quote and we'll send you a detailed analysis within 24-48 hours.
              </p>
            </div>

            {/* Main Upload Card */}
            <Card className="max-w-lg mx-auto">
              {error && !file && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-body-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-mx-purple-500 bg-mx-purple-50'
                    : file
                    ? 'border-teal-400 bg-teal-50'
                    : 'border-mx-slate-300 hover:border-mx-purple-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileInput}
                />

                {file ? (
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-teal-600 mb-3" />
                    <p className="text-body font-medium text-mx-slate-800">{file.name}</p>
                    <p className="text-body-sm text-mx-slate-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setFile(null); }}
                      className="mt-3 text-body-sm text-mx-purple-600 hover:text-mx-purple-700 underline"
                    >
                      Choose different file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-mx-slate-400 mb-3" />
                    <p className="text-body font-medium text-mx-slate-700">
                      Drop your quote here
                    </p>
                    <p className="text-body-sm text-mx-slate-500 mt-1">
                      or click to browse
                    </p>
                    <p className="text-body-sm text-mx-slate-400 mt-3">
                      PDF or image (PNG, JPG) • Max 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Notes Field */}
              <div className="mt-6">
                <label className="block text-body-sm font-medium text-mx-slate-700 mb-2">
                  Additional notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or questions about your quote?"
                  className="w-full px-4 py-3 border border-mx-slate-300 rounded-lg focus:ring-2 focus:ring-mx-purple-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="mt-6 p-4 bg-mx-slate-50 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-mx-slate-300 text-mx-purple-600 focus:ring-mx-purple-500"
                  />
                  <span className="text-body-sm text-mx-slate-600">
                    I consent to millarX storing my quote for analysis purposes. My data will be handled in accordance with the{' '}
                    <a href="/privacy" className="text-mx-purple-600 underline">Privacy Policy</a> and deleted after 12 months unless I become a client.
                  </span>
                </label>
              </div>

              {/* Privacy Note */}
              <div className="mt-4 flex items-start gap-2 text-body-sm text-mx-slate-500">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Your quote is encrypted and stored securely. We never share your information with third parties.
                </span>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  loading={uploading}
                >
                  {uploading ? 'Uploading...' : 'Submit Quote for Analysis'}
                </Button>
              </div>

              {/* Alternative */}
              <p className="mt-4 text-center text-body-sm text-mx-slate-500">
                Prefer email? Send your quote to{' '}
                <a href="mailto:ben@millarx.com.au" className="text-mx-purple-600 underline">
                  ben@millarx.com.au
                </a>
              </p>
            </Card>

            {/* What You'll Get */}
            <div className="mt-12 max-w-lg mx-auto">
              <h2 className="text-body-lg font-semibold text-mx-slate-800 mb-4 text-center">
                Your Lease Rescue Pack includes:
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Exact rate calculation',
                  'Line-by-line breakdown',
                  'Comparison quotes',
                  'Negotiation scripts'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-500" />
                    <span className="text-body-sm text-mx-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
