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
   * Unified analytics dashboard
   * Barcha 3 modul bitta so'rovda (shartnoma + qarz daftari + moliya)
   */
  async getUnifiedAnalytics() {
    return this.$axios.get(API_ENDPOINTS.HOME_ANALYTICS);
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
  // Finance Module - Shaxsiy Moliya
  // ============================================

  /**
   * Moliyaviy dashboard
   */
  async getFinanceDashboard() {
    return this.$axios.get('/finance/dashboard');
  }

  /**
   * Moliyaviy sog'liq ko'rsatkichlari
   */
  async getFinancialHealth() {
    return this.$axios.get('/finance/health');
  }

  /**
   * Finance cache'ni tozalash
   */
  invalidateFinanceCache() {
    invalidateCacheByPattern('/finance/');
  }

  // ---------- Personal Debts (Shaxsiy qarzlar) ----------

  /**
   * Barcha shaxsiy qarzlar
   * @param {Object} params - { type, status, page, limit }
   */
  async getPersonalDebts(params = {}) {
    return this.$axios.get('/finance/debts', { params });
  }

  /**
   * Qarz statistikasi
   */
  async getDebtStats() {
    return this.$axios.get('/finance/debts/stats');
  }

  /**
   * Bitta qarzni olish
   * @param {number} id - Debt ID
   */
  async getDebtById(id) {
    return this.$axios.get(`/finance/debts/${id}`);
  }

  /**
   * Yangi qarz yaratish
   * @param {Object} data - Qarz ma'lumotlari
   */
  async createDebt(data) {
    return this.$axios.post('/finance/debts', data);
  }

  /**
   * Qarzni yangilash
   * @param {number} id - Debt ID
   * @param {Object} data - Yangilanayotgan ma'lumotlar
   */
  async updateDebt(id, data) {
    return this.$axios.put(`/finance/debts/${id}`, data);
  }

  /**
   * Qarzni o'chirish
   * @param {number} id - Debt ID
   */
  async deleteDebt(id) {
    return this.$axios.delete(`/finance/debts/${id}`);
  }

  /**
   * Qarzga to'lov qo'shish
   * @param {number} id - Debt ID
   * @param {Object} data - { amount, payment_date, notes }
   */
  async increaseDebt(id, data) {
    return this.$axios.post(`/finance/debts/${id}/increase`, data);
  },

  async addDebtPayment(id, data) {
    return this.$axios.post(`/finance/debts/${id}/payments`, data);
  }

  // ---------- Expenses (Xarajatlar) ----------

  /**
   * Barcha xarajatlar
   * @param {Object} params - { category_id, start_date, end_date, page, limit }
   */
  async getExpenses(params = {}) {
    return this.$axios.get('/finance/expenses', { params });
  }

  /**
   * Oylik xarajat statistikasi
   * @param {Object} params - { year, month }
   */
  async getExpenseStats(params = {}) {
    return this.$axios.get('/finance/expenses/stats', { params });
  }

  /**
   * Xarajat kategoriyalari
   */
  async getExpenseCategories() {
    return this.getCached('/finance/expenses/categories', {}, CACHE_TTL.LONG);
  }

  /**
   * Yangi kategoriya yaratish
   * @param {Object} data - { name, icon, color }
   */
  async createExpenseCategory(data) {
    const res = await this.$axios.post('/finance/expenses/categories', data);
    // Kesh (LONG TTL) — yangi kategoriya darhol ko'rinishi uchun bekor qilamiz
    invalidateCacheByPattern('/finance/expenses/categories');
    return res;
  }

  /**
   * Xarajat kategoriyasini o'chirish (faqat foydalanuvchi yaratgani)
   */
  async deleteExpenseCategory(id) {
    const res = await this.$axios.delete(`/finance/expenses/categories/${id}`);
    // Kesh (LONG TTL) — o'chirilgan kategoriya ro'yxatdan darhol ketishi uchun
    invalidateCacheByPattern('/finance/expenses/categories');
    return res;
  }

  /**
   * Yangi xarajat qo'shish
   * @param {Object} data - Xarajat ma'lumotlari
   */
  async createExpense(data) {
    return this.$axios.post('/finance/expenses', data);
  }

  /**
   * Xarajatni yangilash
   * @param {number} id - Expense ID
   * @param {Object} data - Yangilanayotgan ma'lumotlar
   */
  async updateExpense(id, data) {
    return this.$axios.put(`/finance/expenses/${id}`, data);
  }

  /**
   * Xarajatni o'chirish
   * @param {number} id - Expense ID
   */
  async deleteExpense(id) {
    return this.$axios.delete(`/finance/expenses/${id}`);
  }

  // ---------- Incomes (Daromadlar) ----------

  /**
   * Barcha daromadlar
   * @param {Object} params - { category_id, start_date, end_date, page, limit }
   */
  async getIncomes(params = {}) {
    return this.$axios.get('/finance/incomes', { params });
  }

  /**
   * Oylik daromad statistikasi
   * @param {Object} params - { year, month }
   */
  async getIncomeStats(params = {}) {
    return this.$axios.get('/finance/incomes/stats', { params });
  }

  /**
   * Daromad kategoriyalari
   */
  async getIncomeCategories() {
    return this.$axios.get('/finance/incomes/categories');
  }

  /**
   * Yangi daromad kategoriyasi yaratish
   * @param {Object} data - { name, icon, color }
   */
  async createIncomeCategory(data) {
    return this.$axios.post('/finance/incomes/categories', data);
  }

  /**
   * Daromad kategoriyasini o'chirish (faqat foydalanuvchi yaratgani)
   */
  async deleteIncomeCategory(id) {
    return this.$axios.delete(`/finance/incomes/categories/${id}`);
  }

  /**
   * Yangi daromad qo'shish
   * @param {Object} data - Daromad ma'lumotlari
   */
  async createIncome(data) {
    return this.$axios.post('/finance/incomes', data);
  }

  /**
   * Daromadni yangilash
   * @param {number} id - Income ID
   * @param {Object} data - Yangilanayotgan ma'lumotlar
   */
  async updateIncome(id, data) {
    return this.$axios.put(`/finance/incomes/${id}`, data);
  }

  /**
   * Daromadni o'chirish
   * @param {number} id - Income ID
   */
  async deleteIncome(id) {
    return this.$axios.delete(`/finance/incomes/${id}`);
  }

  // ---------- Budgets (Byudjetlar) ----------

  /**
   * Barcha byudjetlar
   * @param {Object} params - { year }
   */
  async getBudgets(params = {}) {
    return this.$axios.get('/finance/budgets', { params });
  }

  /**
   * Joriy oy byudjeti
   */
  async getCurrentBudget() {
    return this.$axios.get('/finance/budgets/current');
  }

  /**
   * Byudjet statistikasi
   * @param {Object} params - { year }
   */
  async getBudgetStats(params = {}) {
    return this.$axios.get('/finance/budgets/stats', { params });
  }

  /**
   * Byudjet yaratish/yangilash
   * @param {Object} data - { month, year, planned_amount, category_id, alert_threshold }
   */
  async saveBudget(data) {
    return this.$axios.post('/finance/budgets', data);
  }

  /**
   * Byudjetni o'chirish
   * @param {number} id - Budget ID
   */
  async deleteBudget(id) {
    return this.$axios.delete(`/finance/budgets/${id}`);
  }

  // ---------- Financial Goals (Moliyaviy maqsadlar) ----------

  /**
   * Barcha maqsadlar
   * @param {Object} params - { status }
   */
  async getFinancialGoals(params = {}) {
    return this.$axios.get('/finance/goals', { params });
  }

  /**
   * Maqsad statistikasi
   */
  async getGoalStats() {
    return this.$axios.get('/finance/goals/stats');
  }

  /**
   * Bitta maqsadni olish
   * @param {number} id - Goal ID
   */
  async getGoalById(id) {
    return this.$axios.get(`/finance/goals/${id}`);
  }

  /**
   * Yangi maqsad yaratish
   * @param {Object} data - Maqsad ma'lumotlari
   */
  async createGoal(data) {
    return this.$axios.post('/finance/goals', data);
  }

  /**
   * Maqsadni yangilash
   * @param {number} id - Goal ID
   * @param {Object} data - Yangilanayotgan ma'lumotlar
   */
  async updateGoal(id, data) {
    return this.$axios.put(`/finance/goals/${id}`, data);
  }

  /**
   * Maqsadga pul qo'shish
   * @param {number} id - Goal ID
   * @param {Object} data - { amount }
   */
  async addGoalAmount(id, data) {
    return this.$axios.post(`/finance/goals/${id}/add-amount`, data);
  }

  /**
   * Maqsadni o'chirish
   * @param {number} id - Goal ID
   */
  async deleteGoal(id) {
    return this.$axios.delete(`/finance/goals/${id}`);
  }

  // ---------- Analytics (Analitika) ----------

  /**
   * Umumiy analitika
   * @param {Object} params - { year, month }
   */
  async getAnalyticsOverview(params = {}) {
    return this.$axios.get('/finance/analytics/overview', { params });
  }

  /**
   * Xarajatlar analitikasi
   * @param {Object} params - { year, month }
   */
  async getExpenseAnalytics(params = {}) {
    return this.$axios.get('/finance/analytics/expenses', { params });
  }

  /**
   * Daromadlar analitikasi
   * @param {Object} params - { year, month }
   */
  async getIncomeAnalytics(params = {}) {
    return this.$axios.get('/finance/analytics/incomes', { params });
  }

  /**
   * Qarzlar analitikasi
   */
  async getDebtAnalytics() {
    return this.$axios.get('/finance/analytics/debts');
  }

  /**
   * Byudjet analitikasi
   * @param {Object} params - { year }
   */
  async getBudgetAnalytics(params = {}) {
    return this.$axios.get('/finance/analytics/budgets', { params });
  }

  /**
   * Maqsadlar analitikasi
   */
  async getGoalAnalytics() {
    return this.$axios.get('/finance/analytics/goals');
  }

  /**
   * Aqlli tavsiyalar (Insights)
   */
  async getFinanceInsights() {
    return this.$axios.get('/finance/analytics/insights');
  }

  /**
   * Tavsiyalar — xarajat/byudjet/maqsad tahlili asosida matnli maslahatlar
   */
  async getFinanceRecommendations() {
    return this.$axios.get('/finance/recommendations');
  }

  // ============================================
  // Nasiya Daftar Module - Do'kon egalari uchun
  // ============================================

  /**
   * Nasiya cache'ni tozalash
   */
  invalidateNasiyaCache() {
    invalidateCacheByPattern('/nasiya/');
  }

  // ---------- Dashboard ----------

  /**
   * Nasiya dashboard statistikasi
   */
  async getNasiyaDashboard() {
    return this.$axios.get('/nasiya/dashboard');
  }

  /**
   * Muddati o'tgan nasiyalar
   */
  async getNasiyaOverdue() {
    return this.$axios.get('/nasiya/overdue');
  }

  /**
   * Yaqinlashayotgan to'lovlar
   */
  async getNasiyaUpcoming() {
    return this.$axios.get('/nasiya/upcoming');
  }

  // ---------- Customers (Mijozlar) ----------

  /**
   * Barcha mijozlar
   * @param {Object} params - { search, status, page, limit }
   */
  async getNasiyaCustomers(params = {}) {
    return this.$axios.get('/nasiya/customers', { params });
  }

  /**
   * Mijozlar statistikasi
   */
  async getNasiyaCustomerStats() {
    return this.$axios.get('/nasiya/customers/stats');
  }

  /**
   * Bitta mijozni olish
   * @param {number} id - Customer ID
   */
  async getNasiyaCustomerById(id) {
    return this.$axios.get(`/nasiya/customers/${id}`);
  }

  /**
   * Yangi mijoz yaratish
   * @param {Object} data - Mijoz ma'lumotlari
   */
  async createNasiyaCustomer(data) {
    return this.$axios.post('/nasiya/customers', data);
  }

  /**
   * Mijozni yangilash
   * @param {number} id - Customer ID
   * @param {Object} data - Yangilanayotgan ma'lumotlar
   */
  async updateNasiyaCustomer(id, data) {
    return this.$axios.put(`/nasiya/customers/${id}`, data);
  }

  /**
   * Mijozni o'chirish
   * @param {number} id - Customer ID
   */
  async deleteNasiyaCustomer(id) {
    return this.$axios.delete(`/nasiya/customers/${id}`);
  }

  // ---------- Products (Mahsulotlar) ----------

  /**
   * Barcha mahsulotlar
   * @param {Object} params - { search, category, active, page, limit }
   */
  async getNasiyaProducts(params = {}) {
    return this.$axios.get('/nasiya/products', { params });
  }

  /**
   * Mahsulot kategoriyalari
   */
  async getNasiyaProductCategories() {
    return this.getCached('/nasiya/products/categories', {}, CACHE_TTL.LONG);
  }

  /**
   * Shtrix kod bo'yicha qidirish
   * @param {string} barcode - Barcode
   */
  async findNasiyaProductByBarcode(barcode) {
    return this.$axios.get(`/nasiya/products/barcode/${barcode}`);
  }

  /**
   * Bitta mahsulotni olish
   * @param {number} id - Product ID
   */
  async getNasiyaProductById(id) {
    return this.$axios.get(`/nasiya/products/${id}`);
  }

  /**
   * Yangi mahsulot yaratish
   * @param {Object} data - Mahsulot ma'lumotlari
   */
  async createNasiyaProduct(data) {
    return this.$axios.post('/nasiya/products', data);
  }

  /**
   * Mahsulotni yangilash
   * @param {number} id - Product ID
   * @param {Object} data - Yangilanayotgan ma'lumotlar
   */
  async updateNasiyaProduct(id, data) {
    return this.$axios.put(`/nasiya/products/${id}`, data);
  }

  /**
   * Mahsulotni o'chirish
   * @param {number} id - Product ID
   */
  async deleteNasiyaProduct(id) {
    return this.$axios.delete(`/nasiya/products/${id}`);
  }

  // ---------- Credits (Nasiyalar) ----------

  /**
   * Barcha nasiyalar
   * @param {Object} params - { customer_id, status, page, limit }
   */
  async getNasiyaCredits(params = {}) {
    return this.$axios.get('/nasiya/credits', { params });
  }

  /**
   * Bitta nasiyani olish
   * @param {number} id - Credit ID
   */
  async getNasiyaCreditById(id) {
    return this.$axios.get(`/nasiya/credits/${id}`);
  }

  /**
   * Yangi nasiya yaratish
   * @param {Object} data - { customer_id, items[], due_date, notes }
   */
  async createNasiyaCredit(data) {
    return this.$axios.post('/nasiya/credits', data);
  }

  /**
   * Nasiyaga to'lov qo'shish
   * @param {number} id - Credit ID
   * @param {Object} data - { amount, payment_date, payment_method, notes }
   */
  async addNasiyaPayment(id, data) {
    return this.$axios.post(`/nasiya/credits/${id}/payments`, data);
  }

  /**
   * Nasiyani bekor qilish
   * @param {number} id - Credit ID
   */
  async cancelNasiyaCredit(id) {
    return this.$axios.post(`/nasiya/credits/${id}/cancel`);
  }

  // ============================================
  // Telegram WebApp
  // ============================================

  /**
   * Telegram WebApp orqali autentifikatsiya
   * @param {string} initData - Telegram initData
   */
  async telegramAuth(initData) {
    return this.$axios.post('/telegram/auth', { initData });
  }

  /**
   * Telefon raqamni Telegram hisobiga bog'lash
   * @param {string} phone - Telefon raqam
   */
  async telegramLinkPhone(phone) {
    return this.$axios.post('/telegram/link-phone', { phone });
  }

  /**
   * Telegram foydalanuvchi ma'lumotlari
   */
  async getTelegramMe() {
    return this.$axios.get('/telegram/me');
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

  // ========================
  // Oila (Family) moduli
  // ========================

  /** Mening oilaviy bog'lanishlarim: { owned, received } */
  async getFamily(params = {}) {
    // params: { year, month } — Byudjet limitlari sahifasi tanlangan oy uchun
    // kuzatuvchi limitining "sarflangan" summasini so'raydi (backend YEAR/MONTH scope qiladi).
    return this.$axios.get('/finance/family', { params });
  }

  /** Telefon orqali yangi a'zoni taklif qilish */
  async inviteFamilyMember(data) {
    // B30-7: silent — global interceptor toast'ini o'chiramiz (komponent o'zi aniq
    // xabarni ko'rsatadi; aks holda "allaqachon qo'shilgan" IKKI marta chiqardi)
    return this.$axios.post('/finance/family/invite', data, { silent: true });
  }

  /** Kelgan taklifga javob: { action: 'accept'|'reject', permissions? } (B33-2: qabulда ruxsat tanlash) */
  async respondFamilyInvite(id, action, permissions) {
    const body = { action };
    if (permissions !== undefined) body.permissions = permissions;
    return this.$axios.post(`/finance/family/${id}/respond`, body, { silent: true });
  }

  /** A'zo ruxsat/limit/label ni yangilash (owner) */
  async updateFamilyMember(id, data) {
    return this.$axios.patch(`/finance/family/${id}`, data, { silent: true });
  }

  /** Bog'lanishni o'chirish (har ikki taraf) */
  async removeFamilyMember(id) {
    return this.$axios.delete(`/finance/family/${id}`);
  }

  /** A'zo owner moliyasini ko'radi (ruxsat doirasida); params: { year, month } */
  async getFamilyOverview(id, params = {}) {
    return this.$axios.get(`/finance/family/${id}/overview`, { params });
  }

  /** B34-11: Oila byudjeti tahlili (self + qo'shilgan a'zolar); params: { year, month, owner_id } */
  async getFamilyBudget(params = {}) {
    return this.$axios.get('/finance/family/budget', { params });
  }
  /** B35-6: a'zoni byudjetga qo'shish */
  async addFamilyBudgetMember(memberId) {
    return this.$axios.post('/finance/family/budget/members', { member_id: memberId }, { silent: true });
  }
  /** B35-6: a'zoni byudjetdan chiqarish */
  async removeFamilyBudgetMember(memberId) {
    return this.$axios.delete(`/finance/family/budget/members/${memberId}`, { silent: true });
  }
  /** B35-6: byudjetni ko'rish huquqini o'rnatish (viewer_ids massivi) */
  async setFamilyBudgetViewers(viewerIds) {
    return this.$axios.put('/finance/family/budget/viewers', { viewer_ids: viewerIds }, { silent: true });
  }

  // ========================
  // Gap (ROSCA / qora kassa) moduli
  // ========================
  async getGaps() { return this.$axios.get('/finance/gap'); }
  async createGap(data) { return this.$axios.post('/finance/gap', data); }
  async getGap(id) { return this.$axios.get(`/finance/gap/${id}`); }
  async updateGap(id, data) { return this.$axios.patch(`/finance/gap/${id}`, data); }
  async addGapMember(id, phone, amount, name) { return this.$axios.post(`/finance/gap/${id}/members`, { phone, amount, name }); }
  async updateGapMember(id, mid, data) { return this.$axios.patch(`/finance/gap/${id}/members/${mid}`, data); }
  async removeGapMember(id, mid) { return this.$axios.delete(`/finance/gap/${id}/members/${mid}`); }
  async shuffleGap(id, order) { return this.$axios.post(`/finance/gap/${id}/shuffle`, order ? { order } : {}); }
  async payGap(id, pid) { return this.$axios.post(`/finance/gap/${id}/payments/${pid}/pay`); }
  async downloadGapPdf(id) { return this.$axios.get(`/finance/gap/${id}/pdf`, { responseType: 'blob' }); }
  async setGapRoundVenue(id, roundId, data) { return this.$axios.put(`/finance/gap/${id}/rounds/${roundId}/venue`, data); }
  async removeGap(id) { return this.$axios.delete(`/finance/gap/${id}`); }
}

// Plugin sifatida eksport
export default ({ $axios }, inject) => {
  const api = new ApiService($axios);
  inject('api', api);
};

// Class eksporti (test va boshqa joylar uchun)
export { ApiService };
