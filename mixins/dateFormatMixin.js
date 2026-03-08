/**
 * Date Format Mixin for date handling
 * Provides reusable date formatting logic
 * @mixin dateFormatMixin
 */

import { formatDate, formatAmount } from '@/utils/formatters'
import { getUserDisplayName as _getUserDisplayName } from '@/utils/helpers'

export default {
  beforeDestroy() {
    if (this._dateInput) {
      this._dateInput.removeEventListener("keydown", this.handleDateKeydown);
      this._dateInput.removeEventListener("keyup", this.handleDateKeyup);
      this._dateInput = null;
    }
  },

  methods: {
    /**
     * Setup date input DD.MM.YYYY formatting for mx-datepicker
     * Attaches keydown/keyup listeners for manual input formatting
     * @param {string} selector - CSS selector for input (default: '.mx-input')
     */
    setupDateInput(selector = '.mx-input') {
      setTimeout(() => {
        const input = document.querySelector(selector);
        if (!input) return;
        this._dateInput = input;
        input.addEventListener("keydown", this.handleDateKeydown);
        input.addEventListener("keyup", this.handleDateKeyup);
      }, 500);
    },

    /**
     * Handle keydown event for date input - restrict to numbers and backspace
     */
    handleDateKeydown(e) {
      const key = parseInt(e.key);
      const isBackspace = e.which === 8;
      const endsWithDot = e.target.value.charAt(e.target.value.length - 1) === ".";

      if (isBackspace && endsWithDot) {
        e.target.value = e.target.value.slice(0, -2);
        e.preventDefault();
        return;
      }

      if (!(Number.isInteger(key) && e.target.value.length < 10) && !isBackspace) {
        e.preventDefault();
      }
    },

    /**
     * Handle keyup event for date input - auto-format DD.MM.YYYY
     */
    handleDateKeyup(e) {
      const value = e.target.value.replace(/[^0-9]/g, "");
      const length = value.length;

      if (length >= 8) {
        e.target.value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, 8)}`;
      } else if (length >= 4) {
        e.target.value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4)}`;
      } else if (length >= 2) {
        e.target.value = `${value.slice(0, 2)}.${value.slice(2)}`;
      }
    },

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
     * Get user display name (physical: F.I.O, company: company name)
     * @param {Object} user - User object with type, last_name, first_name, middle_name, company
     * @returns {string}
     */
    getUserDisplayName(user) {
      return _getUserDisplayName(user)
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
