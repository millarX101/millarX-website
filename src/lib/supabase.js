import { createClient } from '@supabase/supabase-js'

// millarX Supabase (for leads, storage, etc.)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// mxDriveIQ Supabase (for EV catalog - shared data)
const mxDriveIQUrl = import.meta.env.VITE_MXDRIVEIQ_SUPABASE_URL || ''
const mxDriveIQKey = import.meta.env.VITE_MXDRIVEIQ_SUPABASE_ANON_KEY || ''

// Create millarX supabase client for leads and storage
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Create mxDriveIQ supabase client for EV catalog
export const mxDriveIQSupabase = mxDriveIQUrl && mxDriveIQKey
  ? createClient(mxDriveIQUrl, mxDriveIQKey)
  : null

// Helper functions for database operations

/**
 * Normalize fuel type to match API expected values
 * Website uses "Electric Vehicle" but API expects "Electric"
 */
function normalizeFuelType(fuelType) {
  if (!fuelType) return null
  const mapping = {
    'Electric Vehicle': 'Electric',
    'electric vehicle': 'Electric',
    'EV': 'Electric',
    'Petrol': 'Petrol',
    'Diesel': 'Diesel',
    'Hybrid': 'Hybrid',
  }
  return mapping[fuelType] || fuelType
}

/**
 * Save a quote request to the database AND forward to mxDriveIQ
 */
export async function saveQuoteRequest(data) {
  // Save to local Supabase (for backup/analytics)
  if (supabase) {
    const { error } = await supabase
      .from('quote_requests')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error saving to Supabase:', error)
    }
  }

  // Forward to mxDriveIQ via Netlify function (avoids CORS)
  const mxDriveIQPayload = {
    lead_type: 'quote_request',
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    employer: data.employer || null,
    state: data.state || data.calculation_inputs?.state || 'NSW',
    annual_salary: data.calculation_inputs?.annualSalary || null,
    vehicle_make: data.vehicle_make || null,
    vehicle_model: data.vehicle_model || null,
    vehicle_variant: data.vehicle_variant || null,
    vehicle_description: data.vehicle_description || null,
    vehicle_price: data.calculation_inputs?.vehiclePrice || null,
    fuel_type: normalizeFuelType(data.calculation_inputs?.fuelType),
    lease_term: data.calculation_inputs?.leaseTermYears || null,
    annual_km: data.calculation_inputs?.annualKm || null,
    calculation_inputs: data.calculation_inputs,
    calculation_results: data.calculation_results,
    need_sourcing_help: data.need_sourcing_help || null,
    source: data.source || 'millarx-website',
    source_page: data.source_page,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
  }

  try {
    const response = await fetch('/.netlify/functions/forward-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mxDriveIQPayload),
    })

    if (!response.ok) {
      console.error('mxDriveIQ API error:', await response.text())
    } else {
      console.log('Lead forwarded to mxDriveIQ successfully')
    }
  } catch (err) {
    console.error('Error forwarding to mxDriveIQ:', err)
  }

  return { data: null, error: null }
}

/**
 * Save a lease analysis to the database AND forward to mxDriveIQ
 */
export async function saveLeaseAnalysis(data) {
  // Save to local Supabase
  if (supabase) {
    const { error } = await supabase
      .from('lease_analyses')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error saving to Supabase:', error)
    }
  }

  // Forward to mxDriveIQ via Netlify function
  try {
    const mxDriveIQPayload = {
      lead_type: 'lease_analysis',
      name: data.name || null,
      email: data.email,
      phone: data.phone || null,
      analysis_data: data.analysis_data,
      source: 'millarx-website',
      source_page: data.source_page,
    }

    const response = await fetch('/.netlify/functions/forward-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mxDriveIQPayload),
    })

    if (!response.ok) {
      console.error('mxDriveIQ API error:', await response.text())
    }
  } catch (err) {
    console.error('Error forwarding to mxDriveIQ:', err)
  }

  return { data: null, error: null }
}

/**
 * Save an employer inquiry to the database AND forward to mxDriveIQ
 * Also sends email notification to ben@millarx.com.au
 */
export async function saveEmployerInquiry(data) {
  // Save to local Supabase
  if (supabase) {
    const { error } = await supabase
      .from('employer_inquiries')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error saving to Supabase:', error)
    }
  }

  // Forward to mxDriveIQ via Netlify function
  try {
    const mxDriveIQPayload = {
      lead_type: 'employer_inquiry',
      name: data.contact_name,
      email: data.email,
      phone: data.phone || null,
      employer: data.company_name,
      employee_count: data.employee_count,
      source: 'millarx-website',
      source_page: data.source_page,
    }

    const response = await fetch('/.netlify/functions/forward-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mxDriveIQPayload),
    })

    if (!response.ok) {
      console.error('mxDriveIQ API error:', await response.text())
    }
  } catch (err) {
    console.error('Error forwarding to mxDriveIQ:', err)
  }

  return { data: null, error: null }
}

/**
 * Save a contact form submission to the database AND forward to mxDriveIQ
 */
export async function saveContactSubmission(data) {
  // Save to local Supabase
  if (supabase) {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([data])
      .select()
      .single()

    if (error) {
      console.error('Error saving to Supabase:', error)
    }
  }

  // Forward to mxDriveIQ via Netlify function
  const mxDriveIQPayload = {
    lead_type: 'contact',
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    inquiry_type: data.inquiryType || data.inquiry_type,
    message: data.message,
    source: 'millarx-website',
    source_page: data.source_page,
  }

  try {
    const response = await fetch('/.netlify/functions/forward-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mxDriveIQPayload),
    })

    if (!response.ok) {
      console.error('mxDriveIQ API error:', await response.text())
    }
  } catch (err) {
    console.error('Error forwarding to mxDriveIQ:', err)
  }

  return { data: null, error: null }
}

export default supabase

// ============================================
// LEASE ANALYSIS DATA (for provider intelligence)
// ============================================

/**
 * Save anonymous lease analysis data for pattern learning
 * No email required - builds provider intelligence database
 */
export async function saveAnalysisData(data) {
  if (!supabase) return { error: null }

  const { error } = await supabase
    .from('lease_analysis_data')
    .insert([{
      provider_name: data.providerName || null,
      provider_normalized: data.providerName?.toLowerCase().trim() || null,
      vehicle_description: data.vehicleDescription || null,
      fbt_value: data.fbtValue || null,
      residual_value: data.residualValue || null,
      finance_payment: data.financePayment || null,
      payment_frequency: data.paymentFrequency || null,
      lease_term: data.leaseTerm || null,
      state: data.state || null,
      vehicle_type: data.vehicleType || null,
      shown_rate: data.shownRate || null,
      risk_level: data.riskLevel || null,
      extras_detected: data.extrasDetected || false,
    }])

  if (error) {
    console.error('Error saving analysis data:', error)
  }

  return { error }
}

// ============================================
// EV CATALOG (from mxDriveIQ Supabase)
// ============================================

/**
 * Fetch all active EVs from the mxDriveIQ catalog
 * Sorted: specials first, then by popularity
 * Uses the mxDriveIQ Supabase project (shared data)
 */
export async function fetchEVCatalog() {
  if (!mxDriveIQSupabase) {
    console.warn('mxDriveIQ Supabase not configured, returning empty catalog')
    return { data: [], error: null }
  }

  const { data, error } = await mxDriveIQSupabase
    .from('ev_catalog')
    .select('*')
    .eq('is_active', true)
    .order('is_special', { ascending: false })
    .order('special_order', { ascending: true })
    .order('popularity_score', { ascending: false })

  return { data, error }
}

// ============================================
// STORAGE - Media Assets
// ============================================

// Storage bucket name for media assets
export const MEDIA_BUCKET = 'media'

/**
 * Get public URL for a media asset from Supabase Storage
 * @param {string} path - Path to the file in the media bucket (e.g., 'logos/millarx-logo.svg')
 * @returns {string} Public URL for the asset
 */
export function getMediaUrl(path) {
  if (!path) return ''

  // If it's already a full URL, return as-is
  if (path.startsWith('http')) return path

  // If Supabase not configured, return path as fallback (for local dev)
  if (!supabase) {
    console.warn('Supabase not configured, using local fallback for:', path)
    return `/assets/${path}`
  }

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Media asset paths - centralized location for all asset references
 * Update these paths to match your Supabase storage structure
 *
 * Folder structure in Supabase Storage 'media' bucket:
 * - logos/
 * - images/
 * - images/cars/
 * - images/testimonials/
 * - videos/
 */
export const MEDIA = {
  // Logos - Direct URLs from Supabase Storage
  logo: 'https://ktsjfqbosdmataezkcbh.supabase.co/storage/v1/object/public/media/logos/millerX_dark%20(2).jpg',
  logoWhite: 'https://ktsjfqbosdmataezkcbh.supabase.co/storage/v1/object/public/media/logos/millerX_light.png',
  logoIcon: 'logos/millarx-icon.svg',
  logoDark: 'https://ktsjfqbosdmataezkcbh.supabase.co/storage/v1/object/public/media/logos/millerX_dark%20(2).jpg',

  // Open Graph / Social
  ogImage: 'images/og-image.png',

  // Hero images
  heroHome: 'images/hero-home.jpg',
  heroEmployers: 'images/hero-employers.jpg',
  heroCalculator: 'images/hero-calculator.jpg',

  // Car images (for popular EVs)
  cars: {
    teslaModel3: 'images/cars/tesla-model-3.jpg',
    teslaModelY: 'images/cars/tesla-model-y.jpg',
    bydSeal: 'images/cars/byd-seal.jpg',
    bydSealion7: 'images/cars/byd-sealion-7.jpg',
    bmwIx3: 'images/cars/bmw-ix3.jpg',
    bmwI4: 'images/cars/bmw-i4.jpg',
    hyundaiKona: 'images/cars/hyundai-kona.jpg',
    kiaEv6: 'images/cars/kia-ev6.jpg',
    mgMg4: 'images/cars/mg-mg4.jpg',
  },

  // Testimonial/team photos
  testimonials: {
    person1: 'images/testimonials/person-1.jpg',
    person2: 'images/testimonials/person-2.jpg',
  },

  // Videos
  videos: {
    intro: 'videos/intro.mp4',
    howItWorks: 'videos/how-it-works.mp4',
  },

  // Icons & decorative
  icons: {
    evBadge: 'images/icons/ev-badge.svg',
    savingsBadge: 'images/icons/savings-badge.svg',
  },
}
