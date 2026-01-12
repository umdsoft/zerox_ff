/**
 * Socket Mixin - Global Socket Manager bilan ishlash uchun
 * Bu mixin socketManager'dan foydalanadi va component lifecycle'ni boshqaradi
 *
 * Ishlatilishi:
 * import socketMixin from '@/mixins/socketMixin';
 * export default {
 *   mixins: [socketMixin],
 *   methods: {
 *     onNotification(data) {
 *       // Handle notification
 *     }
 *   },
 *   mounted() {
 *     this.subscribeToNotifications(this.onNotification);
 *   }
 * }
 */

export default {
  data() {
    return {
      // Socket holati
      isSocketConnected: false,
      // Active subscriptions (cleanup uchun)
      _socketSubscriptions: [],
    };
  },

  computed: {
    /**
     * Socket manager instance
     */
    socketManager() {
      return this.$socketManager;
    },

    /**
     * Raw socket (legacy compatibility)
     */
    socket() {
      return this.$socketManager?.getSocket?.() || this.$socket;
    },

    /**
     * User ID
     */
    socketUserId() {
      return this.$auth?.user?.id || null;
    },
  },

  methods: {
    // ==========================================
    // Subscription Methods
    // ==========================================

    /**
     * Event'ga subscribe qilish (avtomatik cleanup bilan)
     * @param {string} event - Event nomi
     * @param {Function} handler - Handler function
     * @returns {Function} - Unsubscribe function
     */
    subscribeSocket(event, handler) {
      if (!this.$socketManager) {
        console.warn('[socketMixin] Socket manager not available');
        return () => {};
      }

      // Handler'ga component reference qo'shish (cleanup uchun)
      handler._component = this;
      handler._event = event;

      const unsubscribe = this.$socketManager.subscribe(event, handler);

      // Track subscription for cleanup
      this._socketSubscriptions.push({ event, handler, unsubscribe });

      return unsubscribe;
    },

    /**
     * Notification event'iga subscribe qilish
     * @param {Function} handler - Notification handler
     */
    subscribeToNotifications(handler) {
      return this.subscribeSocket('recive_notification', handler);
    },

    /**
     * Connection status event'lariga subscribe qilish
     * @param {Object} handlers - { onConnect, onDisconnect, onReconnect }
     */
    subscribeToConnectionEvents(handlers = {}) {
      const { onConnect, onDisconnect, onReconnect } = handlers;

      if (onConnect) {
        this.subscribeSocket('connect', onConnect);
      }
      if (onDisconnect) {
        this.subscribeSocket('disconnect', onDisconnect);
      }
      if (onReconnect) {
        this.subscribeSocket('reconnect', onReconnect);
      }
    },

    /**
     * Barcha subscriptionlarni tozalash
     */
    unsubscribeAll() {
      this._socketSubscriptions.forEach(({ unsubscribe }) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      this._socketSubscriptions = [];
    },

    // ==========================================
    // Emit Methods
    // ==========================================

    /**
     * Event yuborish
     * @param {string} event - Event nomi
     * @param {any} data - Data
     * @param {Function} callback - Optional callback
     */
    emitSocket(event, data, callback) {
      if (!this.$socketManager) {
        console.warn('[socketMixin] Socket manager not available');
        return false;
      }
      return this.$socketManager.emit(event, data, callback);
    },

    /**
     * Notification so'rash
     * @param {string|number} userId - User ID (optional)
     */
    requestNotifications(userId = null) {
      const id = userId || this.socketUserId;
      if (!id) {
        console.warn('[socketMixin] No user ID for notifications');
        return false;
      }
      return this.$socketManager?.requestNotifications?.(id);
    },

    /**
     * User'ni register qilish
     * @param {string|number} userId - User ID (optional)
     */
    registerUser(userId = null) {
      const id = userId || this.socketUserId;
      if (!id) return false;
      return this.$socketManager?.registerUser?.(id);
    },

    /**
     * Me event yuborish (legacy)
     * @param {string|number} userId - User ID
     * @param {Function} callback - Callback
     */
    emitMe(userId, callback = () => {}) {
      const id = userId || this.socketUserId;
      if (!id) return;
      this.emitSocket('me', { userId: id }, callback);
    },

    /**
     * Notification event yuborish (legacy)
     * @param {string|number} userId - User ID
     * @param {Function} callback - Callback
     */
    emitNotification(userId, callback = () => {}) {
      const id = userId || this.socketUserId;
      if (!id) return;
      this.emitSocket('notification', { userId: id }, callback);
    },

    /**
     * Legacy: Init socket (now no-op, socket is global)
     * @deprecated Use $socketManager instead
     */
    initSocket() {
      // Socket allaqachon global manager tomonidan yaratilgan
      this.isSocketConnected = this.$socketManager?.connected || false;
    },

    /**
     * Legacy: Emit user events
     * @param {number} userId - User ID
     */
    emitUserEvents(userId) {
      this.emitNotification(userId);
      this.emitMe(userId);
    },

    /**
     * Legacy: Setup socket listeners
     * @deprecated Use subscribeSocket instead
     */
    setupSocketListeners() {
      // Override in component if needed
    },

    // ==========================================
    // Connection Control
    // ==========================================

    /**
     * Socket'ni qayta ulash
     */
    reconnectSocket() {
      this.$socketManager?.reconnect?.();
    },

    /**
     * Legacy: Disconnect socket
     * @deprecated Socket is managed globally, don't disconnect manually
     */
    disconnectSocket() {
      // Don't actually disconnect - socket is shared
      // Just cleanup this component's subscriptions
      this.unsubscribeAll();
    },

    /**
     * Socket connection status'ni yangilash
     */
    updateConnectionStatus() {
      this.isSocketConnected = this.$socketManager?.connected || false;
    },
  },

  mounted() {
    // Initial connection status
    this.updateConnectionStatus();

    // Subscribe to connection changes
    this.subscribeSocket('connect', () => {
      this.isSocketConnected = true;
    });

    this.subscribeSocket('disconnect', () => {
      this.isSocketConnected = false;
    });
  },

  beforeDestroy() {
    // Cleanup all subscriptions
    this.unsubscribeAll();
  },
};
