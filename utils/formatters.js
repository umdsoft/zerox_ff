/**
 * Utility functions for formatting data
 * @module utils/formatters
 */

import dateformat from 'dateformat'

/**
 * Format number with space separator for thousands
 * @param {number|string} value - Number to format
 * @returns {string} Formatted number string
 * @example formatAmount(1234567) // "1 234 567"
 */
export function formatAmount(value) {
  if (value === null || value === undefined) return '0'
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Format date to DD.MM.YYYY format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 * @example formatDate('2024-01-15') // "15.01.2024"
 */
export function formatDate(date) {
  if (!date) return ''
  const isoDate = dateformat(date, 'isoDate')
  return isoDate.split('-').reverse().join('.')
}

/**
 * Clean phone number by removing spaces
 * @param {string} phone - Phone number with spaces
 * @returns {string} Phone number without spaces
 * @example cleanPhoneNumber('+998 90 123 45 67') // "+998901234567"
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return ''
  return phone.split('').filter(char => char !== ' ').join('')
}

/**
 * Validate phone number format (Uzbekistan)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export function isValidUzbekPhone(phone) {
  const cleaned = cleanPhoneNumber(phone)
  return cleaned.length === 13 && cleaned.startsWith('+998')
}

/**
 * Format time from seconds to MM:SS
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 * @example formatTime(125) // "02:05"
 */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Parse date string to Date object
 * @param {string} dateStr - Date string in various formats
 * @returns {Date} Parsed Date object
 */
export function parseDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr)
}

/**
 * Get relative time string
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now - past
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Bugun'
  if (diffDays === 1) return 'Kecha'
  if (diffDays < 7) return `${diffDays} kun oldin`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta oldin`
  return formatDate(date)
}

export default {
  formatAmount,
  formatDate,
  cleanPhoneNumber,
  isValidUzbekPhone,
  formatTime,
  parseDate,
  getRelativeTime
}
