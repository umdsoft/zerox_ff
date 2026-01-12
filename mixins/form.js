/**
 * Form Mixin
 * Forma bilan ishlash uchun umumiy mantiq
 *
 * @mixin
 * @example
 * import { formMixin } from '@/mixins/form'
 *
 * export default {
 *   mixins: [formMixin],
 *   data() {
 *     return {
 *       form: {
 *         name: '',
 *         email: '',
 *       }
 *     }
 *   },
 *   methods: {
 *     async submit() {
 *       if (await this.validateForm()) {
 *         await this.submitForm('/api/submit', this.form);
 *       }
 *     }
 *   }
 * }
 */
export const formMixin = {
  data() {
    return {
      isSubmitting: false,
      formErrors: {},
      formSuccess: false,
      initialFormData: null,
    };
  },

  computed: {
    /**
     * Formada xatolik bormi
     * @returns {boolean}
     */
    hasErrors() {
      return Object.keys(this.formErrors).length > 0;
    },

    /**
     * Forma o'zgarganmi
     * @returns {boolean}
     */
    isFormDirty() {
      if (!this.initialFormData || !this.form) return false;
      return JSON.stringify(this.form) !== JSON.stringify(this.initialFormData);
    },
  },

  methods: {
    /**
     * Boshlang'ich form holatini saqlash
     */
    saveInitialFormData() {
      if (this.form) {
        this.initialFormData = JSON.parse(JSON.stringify(this.form));
      }
    },

    /**
     * Formani boshlang'ich holatiga qaytarish
     */
    resetForm() {
      if (this.initialFormData) {
        this.form = JSON.parse(JSON.stringify(this.initialFormData));
      }
      this.clearErrors();
      this.formSuccess = false;
    },

    /**
     * Xatoliklarni tozalash
     */
    clearErrors() {
      this.formErrors = {};
    },

    /**
     * Maydon xatoligini olish
     * @param {string} field - Maydon nomi
     * @returns {string|null}
     */
    getError(field) {
      return this.formErrors[field] || null;
    },

    /**
     * Maydon xatoligini o'rnatish
     * @param {string} field - Maydon nomi
     * @param {string} message - Xatolik xabari
     */
    setError(field, message) {
      this.$set(this.formErrors, field, message);
    },

    /**
     * Server xatoliklarini o'rnatish
     * @param {Object} errors - Server'dan kelgan xatoliklar
     */
    setServerErrors(errors) {
      if (typeof errors === 'object') {
        Object.entries(errors).forEach(([field, messages]) => {
          this.setError(field, Array.isArray(messages) ? messages[0] : messages);
        });
      }
    },

    /**
     * Formani serverga yuborish
     * @param {string} url - API endpoint
     * @param {Object} data - Yuborilnadigan ma'lumotlar
     * @param {Object} options - Qo'shimcha opsiyalar
     * @returns {Promise<Object>}
     */
    async submitForm(url, data = null, { method = 'post', successMessage = null } = {}) {
      this.isSubmitting = true;
      this.clearErrors();
      this.formSuccess = false;

      try {
        const payload = data || this.form;
        const response = await this.$axios[method](url, payload);

        this.formSuccess = true;

        if (successMessage) {
          this.$toast?.success(successMessage);
        }

        this.$emit('submit-success', response.data);
        return response.data;
      } catch (error) {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          this.setServerErrors(serverErrors);
        }

        const message = error.response?.data?.message || this.$t?.('common.error') || 'Xatolik yuz berdi';
        this.$toast?.error(message);

        this.$emit('submit-error', error);
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    /**
     * Formani validatsiya qilish (Vuelidate bilan)
     * @returns {Promise<boolean>}
     */
    async validateForm() {
      if (this.$v) {
        this.$v.$touch();
        return !this.$v.$invalid;
      }
      return true;
    },
  },

  mounted() {
    // Boshlang'ich holatni saqlash
    this.$nextTick(() => {
      this.saveInitialFormData();
    });
  },
};

export default formMixin;
