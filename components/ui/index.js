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
export { default as ZCard } from './ZCard.vue';
export { default as ZButton } from './ZButton.vue';
export { default as ZInput } from './ZInput.vue';
export { default as ZBadge } from './ZBadge.vue';
export { default as ZModal } from './ZModal.vue';
export { default as ZStat } from './ZStat.vue';

// ============================================
// Display Components
// ============================================
export { default as DaysDisplay } from './DaysDisplay.vue';

// ============================================
// Component Variants (for validation)
// ============================================

/**
 * ZButton variant turlari
 * @constant {string[]}
 */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'link'];

/**
 * ZButton o'lchamlari
 * @constant {string[]}
 */
export const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * ZCard variant turlari
 * @constant {string[]}
 */
export const CARD_VARIANTS = ['default', 'primary', 'success', 'warning', 'error', 'info'];

/**
 * ZBadge variant turlari
 * @constant {string[]}
 */
export const BADGE_VARIANTS = ['default', 'primary', 'success', 'warning', 'error', 'info'];

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
    Vue.component('ZCard', () => import('./ZCard.vue'));
    Vue.component('ZButton', () => import('./ZButton.vue'));
    Vue.component('ZInput', () => import('./ZInput.vue'));
    Vue.component('ZBadge', () => import('./ZBadge.vue'));
    Vue.component('ZModal', () => import('./ZModal.vue'));
    Vue.component('ZStat', () => import('./ZStat.vue'));
    Vue.component('DaysDisplay', () => import('./DaysDisplay.vue'));
  },
};

export default UIComponentsPlugin;
