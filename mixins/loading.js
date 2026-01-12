/**
 * Loading Mixin
 * Komponentlarda loading holatini boshqarish
 *
 * @mixin
 * @example
 * import { loadingMixin } from '@/mixins/loading'
 *
 * export default {
 *   mixins: [loadingMixin],
 *   async mounted() {
 *     await this.withLoading(async () => {
 *       // Async operation
 *     })
 *   }
 * }
 */
export const loadingMixin = {
  data() {
    return {
      isLoading: false,
      loadingError: null,
    };
  },

  methods: {
    /**
     * Loading bilan async operatsiya bajarish
     * @param {Function} fn - Async funksiya
     * @param {Object} options - Opsiyalar
     * @param {boolean} options.global - Global loading ishlatish
     * @returns {Promise<*>}
     */
    async withLoading(fn, { global = false } = {}) {
      this.isLoading = true;
      this.loadingError = null;

      if (global) {
        this.$store.commit('START_LOADING');
      }

      try {
        return await fn();
      } catch (error) {
        this.loadingError = error;
        throw error;
      } finally {
        this.isLoading = false;
        if (global) {
          this.$store.commit('STOP_LOADING');
        }
      }
    },

    /**
     * Loading holatini to'g'ridan-to'g'ri o'rnatish
     * @param {boolean} value - Loading holati
     */
    setLoading(value) {
      this.isLoading = Boolean(value);
    },
  },
};

export default loadingMixin;
