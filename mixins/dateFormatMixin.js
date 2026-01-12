/**
 * Date Format Mixin for date handling
 * Provides reusable date formatting logic
 * @mixin dateFormatMixin
 */

import { formatDate, formatAmount } from '@/utils/formatters'

export default {
  methods: {
    /**
     * Format date to DD.MM.YYYY
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date
     */
    dateFormat(date) {
      return formatDate(date)
    },

    /**
     * Format number with space separators
     * @param {number|string} value - Number to format
     * @returns {string} Formatted number
     */
    formatNum(value) {
      return formatAmount(value)
    },

    /**
     * Format currency value with symbol
     * @param {number|string} value - Amount to format
     * @param {string} currency - Currency symbol (default: 'UZS')
     * @returns {string} Formatted currency string
     */
    formatCurrency(value, currency = 'UZS') {
      return `${formatAmount(value)} ${currency}`
    },

    /**
     * Get date difference in days
     * @param {string|Date} date1 - First date
     * @param {string|Date} date2 - Second date (default: now)
     * @returns {number} Difference in days
     */
    getDaysDiff(date1, date2 = new Date()) {
      const d1 = new Date(date1)
      const d2 = new Date(date2)
      const diffTime = Math.abs(d2 - d1)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },

    /**
     * Check if date is in past
     * @param {string|Date} date - Date to check
     * @returns {boolean} True if date is in past
     */
    isDatePast(date) {
      return new Date(date) < new Date()
    },

    /**
     * Check if date is today
     * @param {string|Date} date - Date to check
     * @returns {boolean} True if date is today
     */
    isToday(date) {
      const today = new Date()
      const checkDate = new Date(date)
      return (
        checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear()
      )
    }
  },

  filters: {
    /**
     * Vue filter for date formatting
     * Usage: {{ date | formatDate }}
     */
    formatDate(value) {
      return formatDate(value)
    },

    /**
     * Vue filter for number formatting
     * Usage: {{ amount | formatAmount }}
     */
    formatAmount(value) {
      return formatAmount(value)
    }
  }
}
