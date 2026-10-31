/**
 * Utility functions for formatting data
 * @module utils/formatters
 *
 * Wave-1 refactor: amallar `utils/format.js` ga ko'chirildi; bu fayl faqat eski nomlarga ALIAS.
 * Eslatma: bu yerdagi formatAmount/formatDate/getRelativeTime `utils/helpers.js` dagi bir xil nomli
 * funksiyalardan FARQ qiladi (docs/REFACTOR_DIVERGENCES.md).
 */
import {
  formatAmountRaw,
  formatDateLocalIso,
  cleanPhoneNumber,
  isValidUzbekPhone,
  formatTime,
  parseDate,
  relativeTimeLabel,
} from './format'

export const formatAmount = formatAmountRaw
export const formatDate = formatDateLocalIso
export const getRelativeTime = relativeTimeLabel
export { cleanPhoneNumber, isValidUzbekPhone, formatTime, parseDate }

export default {
  formatAmount,
  formatDate,
  cleanPhoneNumber,
  isValidUzbekPhone,
  formatTime,
  parseDate,
  getRelativeTime
}
