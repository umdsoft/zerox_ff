/**
 * ZeroX - UI Components Library
 * Markazlashtirilgan UI komponentlar
 *
 * @module components/ui
 * @description Loyiha bo'ylab ishlatiladigan qayta foydalaniladigan UI komponentlar
 *
 * @example
 * // Named import (tree-shaking uchun yaxshi)
 * import { ZButton, ZCard, ZModal } from '@/components/ui'
 *
 * @example
 * // Plugin sifatida
 * import UIComponents from '@/components/ui'
 * Vue.use(UIComponents)
 */

// ============================================
// Base Components
// ============================================
export { default as ZModal } from './ZModal.vue';

// ============================================
// Display Components
// ============================================
export { default as DaysDisplay } from './DaysDisplay.vue';

// ============================================
// Component Variants (for validation)
// ============================================

/**
 * ZModal variant turlari
 * @constant {string[]}
 */
export const MODAL_VARIANTS = ['default', 'primary', 'success', 'warning', 'error', 'info'];

// ============================================
// Vue Plugin
// ============================================

/**
 * UI Components Vue Plugin
 * Barcha komponentlarni global ro'yxatdan o'tkazadi
 *
 * @param {Vue} Vue - Vue constructor
 */
const UIComponentsPlugin = {
  install(Vue) {
    // Lazy load qilish orqali bundle size optimizatsiya
    Vue.component('ZModal', () => import('./ZModal.vue'));
    Vue.component('DaysDisplay', () => import('./DaysDisplay.vue'));
  },
};

export default UIComponentsPlugin;
