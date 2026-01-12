/**
 * ZeroX - API Service
 * Markazlashtirilgan API chaqiruvlari
 *
 * MUHIM: API endpointlari o'zgarmasin!
 */

import { API_ENDPOINTS } from '@/utils/constants';
import { PAGINATION } from '@/constants';
import {
  cachedRequest,
  invalidateCacheByPattern,
  createCacheKey,
} from '@/utils/requestCache';

// Cache TTL constants (milliseconds)
const CACHE_TTL = {
  SHORT: 10000,   // 10 sekund - tez o'zgaruvchi ma'lumotlar
  MEDIUM: 30000,  // 30 sekund - o'rtacha
  LONG: 60000,    // 1 minut - kam o'zgaruvchi ma'lumotlar
  STATIC: 300000, // 5 minut - statik ma'lumotlar (USD kursi va h.k.)
};

/**
 * API Service class
 * Axios instance bilan ishlash uchun wrapper
 */
class ApiService {
  constructor(axios) {
    this.$axios = axios;
  }

  /**
   * Cache bilan GET so'rov
   * @param {string} url - Endpoint
   * @param {Object} params - Query params
   * @param {number} ttl - Cache TTL
   * @param {Object} config - Axios config
   */
  async getCached(url, params = {}, ttl = CACHE_TTL.MEDIUM, config = {}) {
    const cacheKey = createCacheKey(url, params);
    return cachedRequest(
      () => this.$axios.get(url, { params, ...config }),
      cacheKey,
      ttl
    );
  }

  /**
   * Contract o'zgarganda cache'ni tozalash
   */
  invalidateContractCache() {
    invalidateCacheByPattern('/contract/');
  }

  /**
   * Dashboard cache'ni tozalash
   */
  invalidateDashboardCache() {
    invalidateCacheByPattern('/dashboard/');
  }

  // ============================================
  // Auth
  // ============================================

  /**
   * Login
   * @param {string} phone - Telefon raqam
   * @param {string} password - Parol
   */
  async login(phone, password) {
    return this.$axios.post(API_ENDPOINTS.LOGIN, { phone, password });
  }

  /**
   * Joriy foydalanuvchi ma'lumotlari
   */
  async getMe() {
    return this.$axios.get(API_ENDPOINTS.USER_ME, { falseLoading: true });
  }

  /**
   * User archive (login history)
   */
  async saveUserArchive(data) {
    return this.$axios.post(API_ENDPOINTS.USER_ARCHIVE, data);
  }

  // ============================================
  // Dashboard
  // ============================================

  /**
   * Dashboard ma'lumotlari
   * @param {string} type - 'debitor' yoki 'creditor'
   */
  async getDashboard(type) {
    return this.$axios.get(API_ENDPOINTS.HOME_MY, { params: { type } });
  }

  /**
   * Server vaqtini olish
   */
  async getServerTime() {
    return this.$axios.get(API_ENDPOINTS.GET_TIME, { falseLoading: true });
  }

  /**
   * Transfer/to'lov ro'yxati
   */
  async getTransferPayments() {
    return this.$axios.get(API_ENDPOINTS.TRANSFER_PAY);
  }

  /**
   * Click ATM orqali to'lash
   * @param {string} id - Transaction ID
   */
  async payViaClickAtm(id) {
    return this.$axios.post(`${API_ENDPOINTS.CLICK_ATM}/${id}`);
  }

  // ============================================
  // Notifications
  // ============================================

  /**
   * Bildirishnomalarni olish
   */
  async getNotifications() {
    return this.$axios.get(API_ENDPOINTS.NOTIFICATION_ME);
  }

  /**
   * Bildirishnomani o'qilgan deb belgilash
   * @param {string} id - Notification ID
   */
  async markNotificationAsRead(id) {
    return this.$axios.put(`${API_ENDPOINTS.NOTIFICATION_SUCCESS}/${id}`);
  }

  // ============================================
  // Contracts
  // ============================================

  /**
   * Shartnoma tafsilotlarini olish
   * @param {string} id - Contract ID
   */
  async getContractById(id) {
    return this.$axios.get(`${API_ENDPOINTS.CONTRACT_BY_ID}/${id}`);
  }

  /**
   * Shartnoma akti yaratish
   * @param {Object} data - Act data
   */
  async createContractAct(data) {
    return this.$axios.post(API_ENDPOINTS.CONTRACT_ACT, data);
  }

  // ============================================
  // Contracts (Extended)
  // ============================================

  /**
   * Faol qarzlar ro'yxati
   * @param {Object} params - { type, page, limit, search, start, end }
   */
  async getActiveDebts(params = {}) {
    const { type = 'debitor', page = 1, limit = PAGINATION.DEFAULT_LIMIT, ...rest } = params;
    return this.$axios.get('/contract/deb-qarz', { params: { type, page, limit, ...rest } });
  }

  /**
   * Muddati o'tgan shartnomalar
   * @param {Object} params - { type, page, limit, search, start, end }
   */
  async getExpiredContracts(params = {}) {
    const { type = 'debitor', page = 1, limit = PAGINATION.DEFAULT_LIMIT, ...rest } = params;
    return this.$axios.get('/contract/expired', { params: { type, page, limit, ...rest } });
  }

  /**
   * Yaqinlashayotgan muddatlar
   * @param {Object} params - { type, page, limit, day, currency }
   */
  async getNearContracts(params = {}) {
    const { type = 'debitor', page = 1, limit = PAGINATION.DEFAULT_LIMIT, ...rest } = params;
    return this.$axios.get('/contract/near', { params: { type, page, limit, ...rest } });
  }

  /**
   * Tarix (yakunlangan shartnomalar)
   * @param {Object} params - { type, page, limit, status, search, start, end }
   */
  async getContractHistory(params = {}) {
    const { type = 'debitor', page = 1, limit = PAGINATION.DEFAULT_LIMIT, ...rest } = params;
    return this.$axios.get('/contract/reports', { params: { type, page, limit, ...rest } });
  }

  /**
   * Oldi-berdi (aloqa qilgan foydalanuvchilar)
   */
  async getContacts() {
    return this.$axios.get('/contract/oldi-bardi');
  }

  /**
   * Yangi shartnoma yaratish
   * @param {Object} data - Contract data
   */
  async createContract(data) {
    return this.$axios.post('/contract/create', data);
  }

  /**
   * Muddat uzaytirish so'rovi
   * @param {Object} data - Extension data
   */
  async requestExtension(data) {
    return this.$axios.post('/contract/deb-uzay', data);
  }

  /**
   * Qaytarish so'rovi
   * @param {Object} data - Restitution data
   */
  async requestRestitution(data) {
    return this.$axios.post('/contract/restitution', data);
  }

  /**
   * To'liq kechirish
   * @param {Object} data - Forgiveness data
   */
  async forgiveDebt(data) {
    return this.$axios.post('/contract/toliq-vos-kechish', data);
  }

  /**
   * Talab qilish
   * @param {Object} data - Demand data
   */
  async demandPayment(data) {
    return this.$axios.post('/contract/talab-qilish', data);
  }

  /**
   * USD kursini olish (cached - 5 daqiqa)
   */
  async getUsdRate() {
    return this.getCached('/contract/usd', {}, CACHE_TTL.STATIC, { falseLoading: true });
  }

  // ============================================
  // User (Extended)
  // ============================================

  /**
   * Foydalanuvchini UID orqali qidirish
   * @param {string} uid - User UID
   */
  async findUserByUid(uid) {
    return this.$axios.get(`/user/by-uid/${uid}`);
  }

  /**
   * Profilni yangilash
   * @param {Object} data - Profile data
   */
  async updateProfile(data) {
    return this.$axios.put('/user/update-profile', data);
  }

  /**
   * Parolni o'zgartirish
   * @param {Object} data - { oldPassword, newPassword }
   */
  async changePassword(data) {
    return this.$axios.put('/user/change-password', data);
  }

  // ============================================
  // Generic Methods
  // ============================================

  /**
   * GET so'rov
   * @param {string} url - Endpoint
   * @param {Object} params - Query params
   * @param {Object} config - Axios config
   */
  async get(url, params = {}, config = {}) {
    return this.$axios.get(url, { params, ...config });
  }

  /**
   * POST so'rov
   * @param {string} url - Endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Axios config
   */
  async post(url, data = {}, config = {}) {
    return this.$axios.post(url, data, config);
  }

  /**
   * PUT so'rov
   * @param {string} url - Endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Axios config
   */
  async put(url, data = {}, config = {}) {
    return this.$axios.put(url, data, config);
  }

  /**
   * DELETE so'rov
   * @param {string} url - Endpoint
   * @param {Object} config - Axios config
   */
  async delete(url, config = {}) {
    return this.$axios.delete(url, config);
  }
}

// Plugin sifatida eksport
export default ({ $axios }, inject) => {
  const api = new ApiService($axios);
  inject('api', api);
};

// Class eksporti (test va boshqa joylar uchun)
export { ApiService };
