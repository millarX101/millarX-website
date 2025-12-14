// Utility functions

/**
 * Format a number as Australian currency
 * @param {number} amount - The amount to format
 * @param {boolean} showCents - Whether to show cents
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, showCents = false) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0'
  }

  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount)
}

/**
 * Format a number with thousand separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) {
    return '0'
  }

  return new Intl.NumberFormat('en-AU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format a percentage
 * @param {number} value - The percentage value (e.g., 0.0725 for 7.25%)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%'
  }

  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Parse a currency string to a number
 * @param {string} value - Currency string (e.g., "$50,000")
 * @returns {number} Parsed number
 */
export function parseCurrency(value) {
  if (!value) return 0
  return parseFloat(String(value).replace(/[^0-9.-]+/g, '')) || 0
}

/**
 * Combine class names conditionally
 * @param  {...string} classes - Class names
 * @returns {string} Combined class names
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Get URL search params as an object
 * @param {string} search - URL search string
 * @returns {Object} Params object
 */
export function getSearchParams(search) {
  const params = new URLSearchParams(search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

/**
 * Convert object to URL search params
 * @param {Object} params - Params object
 * @returns {string} URL search string
 */
export function toSearchParams(params) {
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  }
  return searchParams.toString()
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Clamp a number between min and max
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped number
 */
export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Smooth scroll to an element
 * @param {string} elementId - ID of the element to scroll to
 */
export function scrollToElement(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
