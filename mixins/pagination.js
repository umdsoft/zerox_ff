/**
 * Pagination Mixin
 * Ro'yxatlar uchun pagination boshqaruvi
 *
 * @mixin
 * @example
 * import { paginationMixin } from '@/mixins/pagination'
 *
 * export default {
 *   mixins: [paginationMixin],
 *   methods: {
 *     async fetchData() {
 *       const { page, perPage } = this.pagination;
 *       const response = await this.$axios.get('/api/list', {
 *         params: { page, limit: perPage }
 *       });
 *       this.setPaginationMeta(response.data.meta);
 *     }
 *   }
 * }
 */
export const paginationMixin = {
  data() {
    return {
      pagination: {
        page: 1,
        perPage: 10,
        total: 0,
        totalPages: 0,
      },
    };
  },

  computed: {
    /**
     * Sahifalar ro'yxati (pagination component uchun)
     * @returns {number[]}
     */
    pageNumbers() {
      const { page, totalPages } = this.pagination;
      const pages = [];
      const delta = 2;

      for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
        pages.push(i);
      }

      return pages;
    },

    /**
     * Oldingi sahifa mavjudmi
     * @returns {boolean}
     */
    hasPrevPage() {
      return this.pagination.page > 1;
    },

    /**
     * Keyingi sahifa mavjudmi
     * @returns {boolean}
     */
    hasNextPage() {
      return this.pagination.page < this.pagination.totalPages;
    },

    /**
     * Bo'sh sahifa
     * @returns {boolean}
     */
    isEmpty() {
      return this.pagination.total === 0;
    },
  },

  methods: {
    /**
     * Sahifani o'zgartirish
     * @param {number} page - Yangi sahifa raqami
     */
    goToPage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.pagination.page = page;
        this.$emit('page-change', page);
      }
    },

    /**
     * Keyingi sahifaga
     */
    nextPage() {
      if (this.hasNextPage) {
        this.goToPage(this.pagination.page + 1);
      }
    },

    /**
     * Oldingi sahifaga
     */
    prevPage() {
      if (this.hasPrevPage) {
        this.goToPage(this.pagination.page - 1);
      }
    },

    /**
     * Birinchi sahifaga
     */
    firstPage() {
      this.goToPage(1);
    },

    /**
     * Oxirgi sahifaga
     */
    lastPage() {
      this.goToPage(this.pagination.totalPages);
    },

    /**
     * Pagination meta ma'lumotlarini o'rnatish
     * @param {Object} meta - Server'dan kelgan meta
     * @param {number} meta.total - Jami elementlar soni
     * @param {number} meta.page - Joriy sahifa
     * @param {number} meta.perPage - Har sahifadagi elementlar
     * @param {number} meta.totalPages - Jami sahifalar
     */
    setPaginationMeta({ total, page, perPage, totalPages, last_page }) {
      this.pagination.total = total || 0;
      this.pagination.page = page || 1;
      this.pagination.perPage = perPage || 10;
      this.pagination.totalPages = totalPages || last_page || 1;
    },

    /**
     * Paginationni reset qilish
     */
    resetPagination() {
      this.pagination.page = 1;
      this.pagination.total = 0;
      this.pagination.totalPages = 0;
    },
  },
};

export default paginationMixin;
