/**
 * ZeroX - Mixins Library
 * Vue 2 uchun qayta foydalaniladigan mantiq
 *
 * @module mixins
 * @description Komponentlar orasida umumiy mantiqni bo'lishish uchun mixinlar
 *
 * @example
 * import { loadingMixin, timerMixin, phoneMixin } from '@/mixins'
 *
 * export default {
 *   mixins: [loadingMixin, timerMixin],
 *   // ...
 * }
 */

// ============================================
// Core Mixins
// ============================================

export { loadingMixin } from './loading';
export { paginationMixin } from './pagination';
export { formMixin } from './form';

// ============================================
// New Professional Mixins
// ============================================

export { default as timerMixin } from './timerMixin';
export { default as phoneMixin } from './phoneMixin';
export { default as socketMixin } from './socketMixin';
export { default as dateFormatMixin } from './dateFormatMixin';

// ============================================
// Default export
// ============================================

import { loadingMixin } from './loading';
import { paginationMixin } from './pagination';
import { formMixin } from './form';
import timerMixin from './timerMixin';
import phoneMixin from './phoneMixin';
import socketMixin from './socketMixin';
import dateFormatMixin from './dateFormatMixin';

export default {
  loadingMixin,
  paginationMixin,
  formMixin,
  timerMixin,
  phoneMixin,
  socketMixin,
  dateFormatMixin
};
