/**
 * ZeroX - Vuex Root Store
 * Umumiy state boshqaruvi
 *
 * Naming Convention:
 * - Mutations: SCREAMING_SNAKE_CASE (masalan: SET_LOADING)
 * - Actions: camelCase (masalan: setLoading)
 * - Getters: camelCase (masalan: isLoading)
 * - State: camelCase (masalan: isLoading)
 *
 * MUHIM: Legacy mutations komponentlarda ishlatilmoqda.
 * Ular yangi mutations'ga yo'naltirilgan (alias).
 * Keyinchalik komponentlarni yangilab, legacy'larni o'chirish kerak.
 */

// Strict mode - faqat dev muhitida
export const strict = process.env.NODE_ENV !== 'production';

// ============================================
// State
// ============================================
export const state = () => ({
  // Loading states
  isLoading: false,
  loadingCount: 0,

  // UI states
  isMobileMenuOpen: false,
  isModalOpen: false,

  // Modal states
  isActModalOpen: false,
  isContractModalOpen: false,
  actType: '',
  contractData: {},
  endDate: null,

  // User info
  userInfo: null,

  // Breadcrumb
  breadcrumbs: [],

  // Partial amount
  partialAmount: 0,

  // Re-render trigger
  renderIndex: 0,

  // Socket instance
  socket: null,
});

// ============================================
// Getters
// ============================================
export const getters = {
  isLoading: (state) => state.isLoading || state.loadingCount > 0,
  isModalOpen: (state) => state.isModalOpen,
  isModalInfo: (state) => state.isModalOpen, // Alias for isModalOpen (legacy)
  isAnyModalOpen: (state) => state.isActModalOpen || state.isContractModalOpen || state.isModalOpen,
  currentContract: (state) => state.contractData,
  currentActType: (state) => state.actType,
  userInfo: (state) => state.userInfo,
  breadcrumbs: (state) => state.breadcrumbs,
  isMobileMenuOpen: (state) => state.isMobileMenuOpen,
};

// ============================================
// Actions
// ============================================
export const actions = {
  // Loading
  startLoading({ commit }) {
    commit('START_LOADING');
  },

  stopLoading({ commit }) {
    commit('STOP_LOADING');
  },

  // Modal
  toggleModal({ commit }) {
    commit('TOGGLE_MODAL');
  },

  // Legacy alias for toggleModal
  IsActiveModal({ commit }) {
    commit('TOGGLE_MODAL');
  },

  showActModal({ commit }, payload) {
    commit('SHOW_ACT_MODAL', payload);
  },

  hideActModal({ commit }) {
    commit('HIDE_ACT_MODAL');
  },

  showContractModal({ commit }, payload) {
    commit('SHOW_CONTRACT_MODAL', payload);
  },

  hideContractModal({ commit }) {
    commit('HIDE_CONTRACT_MODAL');
  },

  closeAllModals({ commit }) {
    commit('HIDE_ACT_MODAL');
    commit('HIDE_CONTRACT_MODAL');
    commit('SET_MODAL', false);
  },

  // User
  updateUserInfo({ commit }, data) {
    commit('SET_USER_INFO', data);
  },

  // Socket
  setSocket({ commit }, socket) {
    commit('SET_SOCKET', socket);
  },

  // Mobile Menu
  openMobileMenu({ commit }) {
    commit('OPEN_MOBILE_MENU');
  },

  closeMobileMenu({ commit }) {
    commit('CLOSE_MOBILE_MENU');
  },

  toggleMobileMenu({ commit }) {
    commit('TOGGLE_MOBILE_MENU');
  },

  // Breadcrumb
  setBreadcrumbs({ commit }, links) {
    commit('SET_BREADCRUMBS', links);
  },

  // Partial Amount
  setPartialAmount({ commit }, amount) {
    commit('SET_PARTIAL_AMOUNT', amount);
  },

  // Force Rerender
  forceRerender({ commit }) {
    commit('FORCE_RERENDER');
  },
};

// ============================================
// Mutations
// ============================================
export const mutations = {
  // ========== Loading ==========
  START_LOADING(state) {
    state.isLoading = true;
    state.loadingCount++;
  },

  STOP_LOADING(state) {
    state.loadingCount = Math.max(0, state.loadingCount - 1);
    if (state.loadingCount === 0) {
      state.isLoading = false;
    }
  },

  SET_LOADING(state, value) {
    state.isLoading = Boolean(value);
    if (!value) state.loadingCount = 0;
  },

  // ========== Modal ==========
  TOGGLE_MODAL(state) {
    state.isModalOpen = !state.isModalOpen;
  },

  SET_MODAL(state, value) {
    state.isModalOpen = Boolean(value);
  },

  // ========== Act Modal ==========
  SHOW_ACT_MODAL(state, payload) {
    state.actType = payload?.type || '';
    state.contractData = payload?.contract ? { ...payload.contract } : {};
    if (payload?.act) {
      state.contractData.act = payload.act;
    }
    state.endDate = payload?.time || null;
    state.isActModalOpen = true;
  },

  HIDE_ACT_MODAL(state) {
    state.isActModalOpen = false;
    state.contractData = {};
    state.actType = '';
    state.endDate = null;
  },

  // ========== Contract Modal ==========
  SHOW_CONTRACT_MODAL(state, payload) {
    state.actType = payload?.type || '';
    state.contractData = payload?.contract ? { ...payload.contract } : {};
    state.isModalOpen = true;
    state.isContractModalOpen = true;
  },

  HIDE_CONTRACT_MODAL(state) {
    state.isContractModalOpen = false;
    state.contractData = {};
    state.isModalOpen = false;
  },

  // ========== User Info ==========
  SET_USER_INFO(state, data) {
    state.userInfo = data;
  },

  // ========== Mobile Menu ==========
  OPEN_MOBILE_MENU(state) {
    state.isMobileMenuOpen = true;
  },

  CLOSE_MOBILE_MENU(state) {
    state.isMobileMenuOpen = false;
  },

  TOGGLE_MOBILE_MENU(state) {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;
  },

  // ========== Breadcrumb ==========
  SET_BREADCRUMBS(state, links) {
    state.breadcrumbs = Array.isArray(links) ? links : [];
  },

  // ========== Partial Amount ==========
  SET_PARTIAL_AMOUNT(state, amount) {
    state.partialAmount = Number(amount) || 0;
  },

  // ========== Render Index ==========
  FORCE_RERENDER(state) {
    state.renderIndex++;
  },

  // ========== Socket ==========
  SET_SOCKET(state, socketInstance) {
    state.socket = socketInstance;
  },

  // ============================================
  // LEGACY ALIASES (Komponentlarda ishlatilmoqda)
  // TODO: Komponentlarni yangilab, bu aliaslarni o'chirish kerak
  // ============================================

  // Loading aliases
  ACTIVE_LOADING(state) {
    // Alias for START_LOADING
    state.isLoading = true;
    state.loadingCount++;
  },

  FALSE_LOADING(state) {
    // Alias for STOP_LOADING
    state.loadingCount = Math.max(0, state.loadingCount - 1);
    if (state.loadingCount === 0) {
      state.isLoading = false;
    }
  },

  changeLoading(state, data) {
    // Alias for SET_LOADING
    state.isLoading = Boolean(data);
  },

  // Modal alias
  ACTIVE_MODAL(state) {
    // Alias for TOGGLE_MODAL
    state.isModalOpen = !state.isModalOpen;
  },

  // User info alias
  SET_MYINFO(state, data) {
    // Alias for SET_USER_INFO
    state.userInfo = data;
  },

  // Mobile menu aliases
  Media_Menu_Open(state) {
    // Alias for OPEN_MOBILE_MENU
    state.isMobileMenuOpen = true;
  },

  Media_Menu_Close(state) {
    // Alias for CLOSE_MOBILE_MENU
    state.isMobileMenuOpen = false;
  },

  // Breadcrumb aliases
  changeBreadCrumb(state, data) {
    // Alias for SET_BREADCRUMBS
    state.breadcrumbs = Array.isArray(data) ? data : [];
  },

  SET_BREADCRUMB(state, links) {
    // Alias for SET_BREADCRUMBS
    state.breadcrumbs = Array.isArray(links) ? links : [];
  },

  // Partial amount alias
  changePartialAmount(state, data) {
    // Alias for SET_PARTIAL_AMOUNT
    state.partialAmount = Number(data) || 0;
  },

  // Render index alias
  changeRenderIndex(state) {
    // Alias for FORCE_RERENDER
    state.renderIndex++;
  },

  // Socket alias
  socket(state, socketInstance) {
    // Alias for SET_SOCKET
    state.socket = socketInstance;
  },
};
