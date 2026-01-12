/**
 * Timer Mixin for countdown functionality
 * Provides reusable countdown timer logic for SMS verification, etc.
 * @mixin timerMixin
 */

import { formatTime } from '@/utils/formatters'

export default {
  data() {
    return {
      timerSeconds: 120,
      timerInterval: null,
      isTimerActive: false,
      isResendEnabled: false
    }
  },

  computed: {
    /**
     * Formatted countdown time (MM:SS)
     * @returns {string}
     */
    waitingTime() {
      return formatTime(this.timerSeconds)
    },

    /**
     * Check if timer has finished
     * @returns {boolean}
     */
    isTimerFinished() {
      return this.timerSeconds <= 0
    }
  },

  methods: {
    /**
     * Start countdown timer
     * @param {number} duration - Timer duration in seconds (default: 120)
     */
    startTimer(duration = 120) {
      this.stopTimer()
      this.timerSeconds = duration
      this.isTimerActive = true
      this.isResendEnabled = false

      this.timerInterval = setInterval(() => {
        if (this.timerSeconds > 0) {
          this.timerSeconds--
        } else {
          this.stopTimer()
          this.isResendEnabled = true
          this.onTimerComplete()
        }
      }, 1000)
    },

    /**
     * Stop and clear timer
     */
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      this.isTimerActive = false
    },

    /**
     * Reset timer to initial state
     * @param {number} duration - Timer duration in seconds (default: 120)
     */
    resetTimer(duration = 120) {
      this.stopTimer()
      this.timerSeconds = duration
      this.isResendEnabled = false
    },

    /**
     * Hook method called when timer completes
     * Override this method in component if needed
     */
    onTimerComplete() {
      // Override in component if needed
    }
  },

  beforeDestroy() {
    this.stopTimer()
  }
}
