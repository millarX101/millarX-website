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
 * Save a quote request to the database
 */
export async function saveQuoteRequest(data) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping save')
    return { data: null, error: null }
  }

  const { data: result, error } = await supabase
    .from('quote_requests')
    .insert([data])
    .select()
    .single()

  return { data: result, error }
}

/**
 * Save a lease analysis to the database
 */
export async function saveLeaseAnalysis(data) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping save')
    return { data: null, error: null }
  }

  const { data: result, error } = await supabase
    .from('lease_analyses')
    .insert([data])
    .select()
    .single()

  return { data: result, error }
}

/**
 * Save an employer inquiry to the database
 */
export async function saveEmployerInquiry(data) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping save')
    return { data: null, error: null }
  }

  const { data: result, error } = await supabase
    .from('employer_inquiries')
    .insert([data])
    .select()
    .single()

  return { data: result, error }
}

/**
 * Save a contact form submission to the database
 */
export async function saveContactSubmission(data) {
  if (!supabase) {
    console.warn('Supabase not configured, skipping save')
    return { data: null, error: null }
  }

  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([data])
    .select()
    .single()

  return { data: result, error }
}

export default supabase

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
