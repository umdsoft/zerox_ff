/**
 * Phone Mixin for phone number handling
 * Provides reusable phone formatting and validation logic
 * @mixin phoneMixin
 */

import { cleanPhoneNumber, isValidUzbekPhone } from '@/utils/formatters'

export default {
  methods: {
    /**
     * Clean phone number by removing spaces
     * @param {string} phone - Phone number with spaces
     * @returns {string} Cleaned phone number
     */
    cleanPhone(phone) {
      return cleanPhoneNumber(phone)
    },

    /**
     * Validate Uzbekistan phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid
     */
    isValidPhone(phone) {
      return isValidUzbekPhone(phone)
    },

    /**
     * Handle input event and trim spaces
     * Use with @input="handlePhoneInput"
     * @param {Event} event - Input event
     * @returns {string} Trimmed value
     */
    handlePhoneInput(event) {
      const value = event.target?.value || event
      if (typeof value === 'string') {
        return value.trim()
      }
      return value
    },

    /**
     * Remove spaces from phone model
     * Use with @input="removeSpaceFromPhone"
     */
    removeSpaceFromPhone(event) {
      if (this.phone) {
        this.phone = this.phone.trim()
      }
    },

    /**
     * Validate and show error if phone is invalid
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid, shows toast error if invalid
     */
    validatePhoneWithError(phone) {
      const cleaned = this.cleanPhone(phone)
      if (cleaned.length !== 13) {
        this.$toast.error(this.$t('a1.a72'))
        return false
      }
      return true
    },

    /**
     * Format phone for display
     * @param {string} phone - Raw phone number
     * @returns {string} Formatted phone +998 XX XXX XX XX
     */
    formatPhoneForDisplay(phone) {
      const cleaned = this.cleanPhone(phone)
      if (cleaned.length !== 13) return phone

      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 11)} ${cleaned.slice(11, 13)}`
    }
  }
}
