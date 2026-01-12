/**
 * ZeroX - Notification Store
 * Vuex module for notifications
 *
 * Bu store socketManager bilan integratsiya qilingan.
 * Komponentlar to'g'ridan-to'g'ri socketManager'dan foydalanishi mumkin.
 */

export const namespaced = true;

// ============================================
// State
// ============================================
export const state = () => ({
  notifications: [],
  balance: 0,
  isSubscribed: false,
  lastUpdate: null,
});

// ============================================
// Getters
// ============================================
export const getters = {
  notifications: (state) => state.notifications,
  notificationCount: (state) => state.notifications.length,
  balance: (state) => state.balance,
  isSubscribed: (state) => state.isSubscribed,
  unreadCount: (state) => state.notifications.filter(n => n.status === 0).length,
};

// ============================================
// Mutations
// ============================================
export const mutations = {
  SET_NOTIFICATIONS(state, data) {
    state.notifications = Array.isArray(data) ? data : [];
    state.lastUpdate = Date.now();
  },

  SET_BALANCE(state, amount) {
    state.balance = Number(amount) || 0;
  },

  SET_SUBSCRIBED(state, value) {
    state.isSubscribed = Boolean(value);
  },

  ADD_NOTIFICATION(state, notification) {
    if (notification && notification.id) {
      // Check if already exists
      const exists = state.notifications.some(n => n.id === notification.id);
      if (!exists) {
        state.notifications.unshift(notification);
      }
    }
  },

  REMOVE_NOTIFICATION(state, notificationId) {
    state.notifications = state.notifications.filter(n => n.id !== notificationId);
  },

  CLEAR_NOTIFICATIONS(state) {
    state.notifications = [];
    state.lastUpdate = null;
  },

  // Legacy aliases
  setNotifications(state, data) {
    state.notifications = Array.isArray(data) ? data : [];
    state.lastUpdate = Date.now();
  },

  setBalance(state, amount) {
    state.balance = Number(amount) || 0;
  },
};

// ============================================
// Actions
// ============================================
export const actions = {
  /**
   * Socket listener'larni ro'yxatdan o'tkazish (legacy support)
   * @deprecated Use socketManager directly in components
   */
  registerSocketListeners({ commit, state }, { socket, userId }) {
    if (state.isSubscribed) {
      return; // Already subscribed
    }

    if (!socket || !userId) {
      console.warn('[notification store] Invalid socket or userId');
      return;
    }

    // Remove existing listener
    socket.off?.("recive_notification");

    // Add new listener
    socket.on("recive_notification", (data) => {
      const notifications = data?.notification || data?.notifications || [];
      const filtered = Array.isArray(notifications)
        ? notifications.filter((n) => n.reciver === userId || n.reciver === String(userId))
        : [];

      commit("SET_NOTIFICATIONS", filtered);
      commit("SET_BALANCE", data?.amount?.balance || data?.balance || 0);
    });

    // Register and request notifications
    socket.emit("register", { id: userId });
    socket.emit("send_notification", { id: userId });

    commit("SET_SUBSCRIBED", true);
  },

  /**
   * Socket listener'larni o'chirish
   */
  unregisterSocketListeners({ commit }, { socket }) {
    if (socket) {
      socket.off?.("recive_notification");
    }
    commit("SET_SUBSCRIBED", false);
  },

  /**
   * Notification qo'shish (real-time update)
   */
  addNotification({ commit }, notification) {
    commit("ADD_NOTIFICATION", notification);
  },

  /**
   * Notification o'chirish
   */
  removeNotification({ commit }, notificationId) {
    commit("REMOVE_NOTIFICATION", notificationId);
  },

  /**
   * Balance yangilash
   */
  updateBalance({ commit }, amount) {
    commit("SET_BALANCE", amount);
  },

  /**
   * Notificationlarni tozalash
   */
  clearNotifications({ commit }) {
    commit("CLEAR_NOTIFICATIONS");
  },

  /**
   * Handle incoming notification data
   * Called by socketManager or components
   */
  handleNotificationData({ commit }, { notifications, balance, userId }) {
    if (notifications) {
      const filtered = userId
        ? notifications.filter(n => n.reciver === userId || n.reciver === String(userId))
        : notifications;
      commit("SET_NOTIFICATIONS", filtered);
    }

    if (balance !== undefined) {
      commit("SET_BALANCE", balance);
    }
  },
};
