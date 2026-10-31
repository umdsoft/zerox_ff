/**
 * ZeroX - Mixins Library
 * Vue 2 uchun qayta foydalaniladigan mantiq
 *
 * @module mixins
 * @description Komponentlar orasida umumiy mantiqni bo'lishish uchun mixinlar
 *
 * @example
 * import { timerMixin, phoneMixin } from '@/mixins'
 *
 * export default {
 *   mixins: [timerMixin],
 *   // ...
 * }
 */

// ============================================
// Core Mixins (loading/pagination/form olib tashlandi: ishlatilmagan edi)
// ============================================


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

import timerMixin from './timerMixin';
import phoneMixin from './phoneMixin';
import socketMixin from './socketMixin';
import dateFormatMixin from './dateFormatMixin';

export default {
  timerMixin,
  phoneMixin,
  socketMixin,
  dateFormatMixin
};
